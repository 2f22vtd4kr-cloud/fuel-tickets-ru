/**
 * Production launcher + reverse proxy.
 *
 * Replit artifact-mode runs this with PORT=8080.
 * We answer health-check paths (/webhook, /api, /api/healthz) with 200
 * immediately — no FastAPI needed. All other traffic is proxied to FastAPI.
 */
import http from "node:http";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { logger } from "./lib/logger";

// Workspace root is three levels up from artifacts/api-server/dist/
const WORKSPACE = path.resolve(import.meta.dirname, "..", "..", "..");

const PORT = parseInt(process.env["PORT"] ?? "8080", 10);
const FASTAPI_PORT = 8000;

function spawnProc(
  cmd: string,
  args: string[],
  env: Record<string, string>,
  label: string,
): ChildProcess {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    cwd: WORKSPACE,
  });
  child.on("error", (err) =>
    logger.error({ err, label }, `${label} spawn error`),
  );
  child.on("exit", (code, signal) => {
    logger.warn({ code, signal, label }, `${label} exited — restarting in 5s`);
    setTimeout(() => spawnProc(cmd, args, env, label), 5000);
  });
  logger.info({ pid: child.pid, label }, `${label} started`);
  return child;
}

const HEALTH_OK = JSON.stringify({ status: "ok" });

function isHealthCheckPath(url: string): boolean {
  return (
    url === "/api/healthz" ||
    url === "/api" ||
    url === "/api/" ||
    url === "/webhook" ||
    url === "/webhook/" ||
    url.startsWith("/webhook/")
  );
}

function proxyRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const url = req.url ?? "/";

  // Always answer Replit health-check paths with 200 instantly
  if (isHealthCheckPath(url)) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(HEALTH_OK);
    return;
  }

  const options: http.RequestOptions = {
    hostname: "127.0.0.1",
    port: FASTAPI_PORT,
    path: url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${FASTAPI_PORT}` },
  };

  const upstream = http.request(options, (upRes) => {
    res.writeHead(upRes.statusCode ?? 200, upRes.headers);
    upRes.pipe(res, { end: true });
  });

  upstream.on("error", () => {
    // FastAPI not ready yet — show a loading page
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<!DOCTYPE html><html><head><meta charset=utf-8>" +
        "<meta http-equiv=refresh content=3>" +
        "<title>Запуск…</title></head>" +
        "<body style='background:#050507;color:#a855f7;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'>" +
        "<div style='text-align:center'><div style='font-size:2rem'>⛽ Топливный Узел</div>" +
        "<div style='margin-top:1rem;opacity:.7'>Система запускается… страница обновится автоматически</div></div></body></html>",
    );
  });

  req.pipe(upstream, { end: true });
}

function proxyWebSocket(
  req: http.IncomingMessage,
  socket: import("node:net").Socket,
  head: Buffer,
): void {
  const net = require("node:net") as typeof import("node:net");
  const upstream = net.createConnection(FASTAPI_PORT, "127.0.0.1", () => {
    const reqLine = `${req.method ?? "GET"} ${req.url ?? "/"} HTTP/1.1\r\n`;
    const hdrs =
      Object.entries(req.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\r\n") + "\r\n\r\n";
    upstream.write(reqLine + hdrs);
    if (head.length) upstream.write(head);
    upstream.pipe(socket, { end: true });
    socket.pipe(upstream, { end: true });
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error", () => upstream.destroy());
}

const server = http.createServer(proxyRequest);
server.on("upgrade", proxyWebSocket);

server.listen(PORT, "0.0.0.0", () => {
  logger.info({ PORT }, "Proxy listening — spawning services");

  spawnProc(
    "python",
    ["-m", "tma_backend.main"],
    { TMA_PORT: String(FASTAPI_PORT) },
    "TMA Backend",
  );

  spawnProc("python", ["bot.py"], {}, "Telegram Bot");
});
