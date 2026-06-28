/**
 * CANVAS RESTORATION SCRIPT
 * Run this in code_execution at the start of any new session.
 * It restores all redesign mockup iframes on the canvas.
 *
 * USAGE:
 *   1. Read this file: read(".agents/canvas-restore.js")
 *   2. Paste contents into a code_execution call
 *   3. Done — all shapes appear and focus in one shot.
 *
 * The Mockup Sandbox workflow (port 8099) must be running first.
 * If it's not running: await restartWorkflow({ name: "Mockup Sandbox" })
 */

// ── Config ───────────────────────────────────────────────────────────────────
const DOMAIN = process.env.REPLIT_DOMAINS?.split(",")[0] ?? "";
if (!DOMAIN) throw new Error("REPLIT_DOMAINS not set — is this running in the Replit sandbox?");

const BASE = `https://${DOMAIN}:8099/__mockup/preview/redesign`;
const W = 390, H = 844;

// ── Screens ──────────────────────────────────────────────────────────────────
//
// STATUS as of 2026-06-28:
//   ds-loading   — ✅ Graduated → IntroSplash.tsx (still shown for reference)
//   ds-map       — ✅ Graduated → production MapTab.tsx (cobalt starfield)
//   ds-analytics — 🟡 Mockup complete, ready to graduate (cobalt starfield)
//   ds-catalog   — 🔵 Dormant — next to bring to canvas + apply cobalt treatment
//   ds-vault     — 🔵 Dormant
//   ds-vpn       — 🔵 Dormant
//   ds-games     — 🔵 Dormant
//   ds-ai        — 🔵 Dormant
//
// TAB ORDER in bottom nav: Карта → Аналитика → Каталог → Хранилище → Резерв

const FRAMES = [
  // ── Active / graduated (column 0–1 at row 0) ─────────────────────────────
  { id: "ds-map",       file: "MapTab",       name: "Map Tab — Cobalt Starfield",           col: 0, row: 0 },
  { id: "ds-analytics", file: "AnalyticsTab", name: "Analytics Tab — Cobalt Starfield",     col: 0, row: 1 },

  // ── Dormant — original design system (column 2 onward) ───────────────────
  { id: "ds-loading",   file: "LoadingScreen", name: "Loading Screen — Vertical Typography", col: 2, row: 0 },
  { id: "ds-catalog",   file: "CatalogTab",    name: "Catalog Tab — Premium Vouchers",       col: 2, row: 1 },
  { id: "ds-vault",     file: "VaultTab",      name: "Vault Tab — Wallet & QR Codes",        col: 3, row: 0 },
  { id: "ds-vpn",       file: "VPNTab",        name: "VPN Tab — Anonymous Channel",          col: 3, row: 1 },
  { id: "ds-games",     file: "GamesTab",      name: "Games Tab — Oil Empire & Mini-Games",  col: 4, row: 0 },
  { id: "ds-ai",        file: "AiNewsTab",     name: "AI/News Tab — CrisisBot & Feed",       col: 4, row: 1 },
];

const GAP_X = 50, GAP_Y = 100;
const ORIGIN_X = 500, ORIGIN_Y = 118;

// ── Step 1: create placeholders ──────────────────────────────────────────────
await applyCanvasActions({
  actions: FRAMES.map(f => ({
    type: "create",
    shapeId: f.id,
    shape: {
      type: "iframe",
      x: ORIGIN_X + f.col * (W + GAP_X),
      y: ORIGIN_Y + f.row * (H + GAP_Y),
      w: W,
      h: H,
      state: "building",
      componentName: f.name,
    },
  })),
});

console.log("Placeholders created — going live...");

// ── Step 2: set live ─────────────────────────────────────────────────────────
await applyCanvasActions({
  actions: FRAMES.map(f => ({
    type: "update",
    shapeId: f.id,
    updates: {
      shapeType: "iframe",
      state: "live",
      url: `${BASE}/${f.file}`,
      componentPath: `artifacts/mockup-sandbox/src/components/mockups/redesign/${f.file}.tsx`,
      componentName: f.name,
    },
  })),
});

// ── Step 3: focus active pair ────────────────────────────────────────────────
await focusCanvasShapes({ shapeIds: ["ds-map", "ds-analytics"], animateMs: 600 });

console.log("Canvas restored. 8 iframes live. Focused on ds-map + ds-analytics.");
console.log("");
console.log("Next session priorities:");
console.log("  1. Graduate ds-analytics → production AnalyticsTab.tsx");
console.log("  2. Bring ds-catalog to canvas with cobalt starfield treatment");
console.log("  3. Continue: Хранилище → Резерв");
