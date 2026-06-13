/**
 * Production launcher + reverse proxy.
 *
 * Replit artifact-mode runs this with PORT=8080.
 * We listen on PORT immediately (so health checks pass right away),
 * proxy all HTTP/WS traffic to FastAPI on FASTAPI_PORT,
 * and spawn FastAPI + Telegram bot as child processes.
 */
import http from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import { logger } from "./lib/logger";

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
    cwd: process.cwd(),
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

// ── Reverse proxy ──────────────────────────────────────────────────────────

function proxyRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const options: http.RequestOptions = {
    hostname: "127.0.0.1",
    port: FASTAPI_PORT,
    path: req.url ?? "/",
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${FASTAPI_PORT}` },
  };

  const upstream = http.request(options, (upRes) => {
    res.writeHead(upRes.statusCode ?? 200, upRes.headers);
    upRes.pipe(res, { end: true });
  });

  upstream.on("error", () => {
    // FastAPI not ready yet — return 200 for health checks
    const url = req.url ?? "/";
    if (
      url === "/api/healthz" ||
      url.startsWith("/api") ||
      url.startsWith("/webhook")
    ) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "starting" }));
    } else {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<!DOCTYPE html><html><head><meta charset=utf-8>" +
          "<meta http-equiv=refresh content=3>" +
          "<title>Запуск…</title></head>" +
          "<body style='background:#050507;color:#a855f7;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'>" +
          "<div style='text-align:center'><div style='font-size:2rem'>⛽ Топливный Узел</div>" +
          "<div style='margin-top:1rem;opacity:.7'>Система запускается… страница обновится автоматически</div></div></body></html>",
      );
    }
  });

  req.pipe(upstream, { end: true });
}

function proxyWebSocket(
  req: http.IncomingMessage,
  socket: import("node:net").Socket,
  head: Buffer,
): void {
  const upstream = http.request({
    hostname: "127.0.0.1",
    port: FASTAPI_PORT,
    path: req.url ?? "/",
    method: req.method,
    headers: req.headers,
  });

  upstream.on("upgrade", (upRes, upSocket) => {
    const statusLine = `HTTP/1.1 ${upRes.statusCode} Switching Protocols\r\n`;
    const headers = Object.entries(upRes.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\r\n");
    socket.write(`${statusLine}${headers}\r\n\r\n`);
    if (head.length) upSocket.write(head);
    upSocket.pipe(socket, { end: true });
    socket.pipe(upSocket, { end: true });
  });

  upstream.on("error", () => socket.destroy());
  upstream.end();
}

const server = http.createServer(proxyRequest);
server.on("upgrade", proxyWebSocket);

server.listen(PORT, "0.0.0.0", () => {
  logger.info({ PORT }, "Proxy listening — spawning services");

  // FastAPI on port 8000 internally
  spawnProc(
    "python",
    ["-m", "tma_backend.main"],
    { TMA_PORT: String(FASTAPI_PORT) },
    "TMA Backend",
  );

  // Telegram bot
  spawnProc("python", ["bot.py"], {}, "Telegram Bot");
});
