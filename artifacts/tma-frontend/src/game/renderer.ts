import type { GameState, PlacedBuilding } from "./store";
import { BUILDINGS } from "./buildings";
import { TILE_W, TILE_H } from "./constants";

export function isoToScreen(col: number, row: number, tW: number, tH: number) {
  return {
    x: (col - row) * (tW / 2),
    y: (col + row) * (tH / 2),
  };
}

export function screenToIso(sx: number, sy: number, tW: number, tH: number) {
  const col = (sx / (tW / 2) + sy / (tH / 2)) / 2;
  const row = (sy / (tH / 2) - sx / (tW / 2)) / 2;
  return { col: Math.floor(col), row: Math.floor(row) };
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + tW / 2, cy + tH / 2);
  ctx.lineTo(cx, cy + tH);
  ctx.lineTo(cx - tW / 2, cy + tH / 2);
  ctx.closePath();
}

function drawGroundTile(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, color: string, highlight = false) {
  drawDiamond(ctx, cx, cy, tW, tH);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = highlight ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.04)";
  ctx.lineWidth = highlight ? 1.5 : 0.5;
  ctx.stroke();
}

function drawOilWell(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number, producing: boolean) {
  const bx = cx; const by = cy + tH * 0.6;
  ctx.strokeStyle = "#888"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(bx - 8 * ts, by); ctx.lineTo(bx, by - 32 * ts); ctx.lineTo(bx + 8 * ts, by); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx - 10 * ts, by - 2 * ts); ctx.lineTo(bx + 10 * ts, by - 2 * ts); ctx.strokeStyle = "#666"; ctx.stroke();
  const pumpOff = Math.sin(ts > 0 ? Date.now() / 600 : 0) * 5 * ts;
  ctx.fillStyle = "#777";
  ctx.fillRect(bx - 6 * ts, by - 20 * ts + pumpOff, 12 * ts, 4 * ts);
  if (producing) {
    ctx.beginPath(); ctx.arc(bx, by + 4 * ts, 3 * ts, 0, Math.PI * 2);
    ctx.fillStyle = "#00e676"; ctx.fill();
    ctx.shadowColor = "#00e676"; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
  }
}

function drawStorageTank(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const bx = cx; const by = cy + tH * 0.5;
  ctx.fillStyle = "#4a4a5a";
  ctx.beginPath(); ctx.ellipse(bx, by, 14 * ts, 7 * ts, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3a3a4a";
  ctx.fillRect(bx - 14 * ts, by, 28 * ts, 18 * ts);
  ctx.fillStyle = "#5a5a6a";
  ctx.beginPath(); ctx.ellipse(bx, by + 18 * ts, 14 * ts, 7 * ts, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(bx - 14 * ts, by + 12 * ts, 28 * ts * 0.6, 6 * ts);
}

function drawRefinery(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.3;
  for (let i = 0; i < 3; i++) {
    const tx = cx - 16 * ts + i * 16 * ts;
    const h = (22 + i * 8) * ts;
    ctx.fillStyle = "#555";
    ctx.fillRect(tx - 5 * ts, by - h, 10 * ts, h);
  }
  ctx.strokeStyle = "#666"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 16 * ts, by - 15 * ts); ctx.lineTo(cx, by - 22 * ts); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, by - 22 * ts); ctx.lineTo(cx + 16 * ts, by - 15 * ts); ctx.stroke();
  const alpha = 0.3 + 0.2 * Math.sin(Date.now() / 300);
  ctx.fillStyle = `rgba(255,100,0,${alpha})`;
  ctx.beginPath(); ctx.arc(cx, by - 38 * ts, 4 * ts, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "#ff6400"; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
}

function drawFuelStation(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.5;
  ctx.fillStyle = "#2d2d3d";
  ctx.fillRect(cx - 20 * ts, by - 12 * ts, 40 * ts, 4 * ts);
  ctx.fillStyle = "#1e8c3a";
  ctx.fillRect(cx - 14 * ts, by - 18 * ts, 8 * ts, 18 * ts);
  ctx.fillStyle = "#1e8c3a";
  ctx.fillRect(cx + 6 * ts, by - 18 * ts, 8 * ts, 18 * ts);
  ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = ts;
  ctx.beginPath(); ctx.moveTo(cx - 10 * ts, by + 2 * ts); ctx.lineTo(cx - 6 * ts, by + 2 * ts); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 6 * ts, by + 2 * ts); ctx.lineTo(cx + 10 * ts, by + 2 * ts); ctx.stroke();
}

function drawPipeline(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.7;
  ctx.strokeStyle = "#5a5a6a"; ctx.lineWidth = 5 * ts;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(cx - tW * 0.4, by); ctx.lineTo(cx + tW * 0.4, by); ctx.stroke();
  ctx.strokeStyle = "#4a4a5a"; ctx.lineWidth = 3 * ts;
  ctx.beginPath(); ctx.moveTo(cx - tW * 0.4, by); ctx.lineTo(cx + tW * 0.4, by); ctx.stroke();
}

function drawWorkerCamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.5;
  ctx.fillStyle = "#4a5a3a";
  ctx.beginPath(); ctx.moveTo(cx, by - 20 * ts); ctx.lineTo(cx - 14 * ts, by + 2 * ts); ctx.lineTo(cx + 14 * ts, by + 2 * ts); ctx.closePath(); ctx.fill();
  const alpha = 0.4 + 0.3 * Math.sin(Date.now() / 700);
  ctx.fillStyle = `rgba(255,120,0,${alpha})`;
  ctx.beginPath(); ctx.arc(cx, by + 6 * ts, 3 * ts, 0, Math.PI * 2); ctx.fill();
}

function drawResearchLab(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.4;
  ctx.fillStyle = "#1a2a3a";
  ctx.fillRect(cx - 18 * ts, by - 22 * ts, 36 * ts, 26 * ts);
  ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 0.5;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500 + r * 1.1 + c * 0.7);
      ctx.fillStyle = `rgba(59,130,246,${alpha})`;
      ctx.fillRect(cx - 14 * ts + c * 9 * ts, by - 18 * ts + r * 8 * ts, 5 * ts, 4 * ts);
    }
  }
  ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = ts;
  ctx.beginPath(); ctx.moveTo(cx, by - 22 * ts); ctx.lineTo(cx, by - 30 * ts); ctx.stroke();
}

function drawCorporateHQ(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.2;
  ctx.fillStyle = "#0d1b2a";
  ctx.fillRect(cx - 22 * ts, by - 48 * ts, 44 * ts, 52 * ts);
  const floors = 6;
  for (let f = 0; f < floors; f++) {
    for (let w = 0; w < 5; w++) {
      const alpha = 0.3 + 0.7 * Math.sin(Date.now() / 800 + f * 0.8 + w * 0.5);
      ctx.fillStyle = `rgba(167,139,250,${Math.max(0, alpha)})`;
      ctx.fillRect(cx - 18 * ts + w * 8 * ts, by - 44 * ts + f * 8 * ts, 5 * ts, 4 * ts);
    }
  }
  const shimmer = 0.5 + 0.5 * Math.sin(Date.now() / 1200);
  ctx.fillStyle = `rgba(245,158,11,${shimmer * 0.8})`;
  ctx.fillRect(cx - 4 * ts, by - 48 * ts, 8 * ts, 2 * ts);
}

function drawSecurityPost(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.5;
  ctx.fillStyle = "#2a3a2a";
  ctx.fillRect(cx - 8 * ts, by - 16 * ts, 16 * ts, 18 * ts);
  ctx.fillStyle = "#3a4a3a";
  ctx.fillRect(cx - 10 * ts, by - 18 * ts, 20 * ts, 3 * ts);
  ctx.fillStyle = "#22c55e";
  ctx.beginPath(); ctx.arc(cx + 6 * ts, by - 14 * ts, 3 * ts, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 5; ctx.fill(); ctx.shadowBlur = 0;
}

function drawPumpStation(ctx: CanvasRenderingContext2D, cx: number, cy: number, tW: number, tH: number, ts: number) {
  const by = cy + tH * 0.5;
  ctx.fillStyle = "#3a3a4a";
  ctx.fillRect(cx - 12 * ts, by - 14 * ts, 24 * ts, 16 * ts);
  ctx.fillStyle = "#555"; ctx.strokeStyle = "#888"; ctx.lineWidth = ts;
  ctx.beginPath(); ctx.arc(cx, by - 14 * ts, 6 * ts, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, by - 14 * ts); ctx.lineTo(cx, by - 26 * ts); ctx.strokeStyle = "#aaa"; ctx.stroke();
}

export function renderFrame(
  canvas: HTMLCanvasElement,
  state: GameState,
  timestamp: number,
  selectedTile: { col: number; row: number } | null,
  hoverTile: { col: number; row: number } | null,
  tileW: number,
  tileH: number,
  offsetX: number,
  offsetY: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(dpr, dpr);

  const gridSize = Math.max(4, Math.min(14, 4 + state.level - 1));
  const cx = canvas.width / dpr / 2 + offsetX;
  const cy = 48 + offsetY;

  const buildingMap: Record<string, PlacedBuilding> = {};
  for (const b of state.buildings) {
    const def = BUILDINGS[b.id];
    if (!def) continue;
    for (let dc = 0; dc < def.tileSize; dc++) {
      for (let dr = 0; dr < def.tileSize; dr++) {
        buildingMap[`${b.col + dc},${b.row + dr}`] = b;
      }
    }
  }

  const ts = tileW / TILE_W;

  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize; row++) {
      const { x, y } = isoToScreen(col, row, tileW, tileH);
      const px = cx + x; const py = cy + y;
      const isSelected = selectedTile?.col === col && selectedTile?.row === row;
      const isHover = hoverTile?.col === col && hoverTile?.row === row;
      const isOccupied = !!buildingMap[`${col},${row}`];
      const baseColor = (col + row) % 2 === 0 ? "#1a1a2e" : "#16162a";
      drawGroundTile(ctx, px, py, tileW, tileH, isSelected ? "#2d1a4a" : baseColor, isSelected);
      if (isHover && !isOccupied) {
        drawDiamond(ctx, px, py, tileW, tileH);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fill();
      }
    }
  }

  const rendered = new Set<string>();
  const sortedBuildings = [...state.buildings].sort((a, b) => (a.col + a.row) - (b.col + b.row));

  for (const building of sortedBuildings) {
    if (rendered.has(building.uid)) continue;
    rendered.add(building.uid);
    const def = BUILDINGS[building.id];
    if (!def) continue;
    const midCol = building.col + (def.tileSize - 1) / 2;
    const midRow = building.row + (def.tileSize - 1) / 2;
    const { x, y } = isoToScreen(midCol, midRow, tileW, tileH);
    const px = cx + x; const py = cy + y;

    for (let dc = 0; dc < def.tileSize; dc++) {
      for (let dr = 0; dr < def.tileSize; dr++) {
        const { x: tx, y: ty } = isoToScreen(building.col + dc, building.row + dr, tileW, tileH);
        drawGroundTile(ctx, cx + tx, cy + ty, tileW, tileH, "#1f1f35");
      }
    }

    switch (def.tileType) {
      case "oil_well":   drawOilWell(ctx, px, py, tileW, tileH, ts, Object.keys(def.produces).length > 0); break;
      case "tank":       drawStorageTank(ctx, px, py, tileW, tileH, ts); break;
      case "refinery":   drawRefinery(ctx, px, py, tileW, tileH, ts); break;
      case "fuel_station": drawFuelStation(ctx, px, py, tileW, tileH, ts); break;
      case "pipeline":   drawPipeline(ctx, px, py, tileW, tileH, ts); break;
      case "camp":       drawWorkerCamp(ctx, px, py, tileW, tileH, ts); break;
      case "lab":        drawResearchLab(ctx, px, py, tileW, tileH, ts); break;
      case "hq":         drawCorporateHQ(ctx, px, py, tileW, tileH, ts); break;
      case "security":   drawSecurityPost(ctx, px, py, tileW, tileH, ts); break;
      case "pump":       drawPumpStation(ctx, px, py, tileW, tileH, ts); break;
    }

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `${Math.max(10, 12 * ts)}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(`Ур.${building.level}`, px, py + tileH * 1.1);
  }

  for (const p of state.particles ?? []) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.font = `${p.size}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillStyle = p.color;
    const emoji = p.type === "coin" ? "💰" : p.type === "xp" ? "⭐" : p.type === "smoke" ? "💨" : p.type === "oil_drop" ? "🛢️" : "✨";
    ctx.fillText(emoji, p.x, p.y);
    ctx.restore();
  }

  ctx.restore();
}

export function getCanvasCoords(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  tileW: number,
  tileH: number,
  offsetX: number,
  offsetY: number,
): { col: number; row: number } {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const px = (clientX - rect.left);
  const py = (clientY - rect.top);
  const cx = canvas.width / dpr / 2 + offsetX;
  const cy = 48 + offsetY;
  return screenToIso(px - cx, py - cy, tileW, tileH);
}
