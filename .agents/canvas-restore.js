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

// ── Config ──────────────────────────────────────────────────────────────────
const DOMAIN = process.env.REPLIT_DOMAINS?.split(",")[0] ?? "";
if (!DOMAIN) throw new Error("REPLIT_DOMAINS not set — is this running in the Replit sandbox?");

const BASE = `https://${DOMAIN}:8099/__mockup/preview/redesign`;
const W = 390, H = 844;

// ── Screens (2 active, 5 dormant — all files exist) ─────────────────────────
// ACTIVE this session (approved / being iterated):
//   ds-loading — LoadingScreen (graduated to production as IntroSplash.tsx)
//   ds-map     — MapTab cobalt starfield (ready for graduation)
//
// DORMANT (built session 2026-06-28, untouched since):
//   ds-catalog, ds-vault, ds-vpn, ds-games, ds-ai

const FRAMES = [
  // Row 0
  { id: "ds-loading", file: "LoadingScreen", name: "Loading Screen — Vertical Typography",   col: 0, row: 0 },
  { id: "ds-map",     file: "MapTab",        name: "Map Tab — Cobalt Starfield",             col: 1, row: 0 },
  { id: "ds-catalog", file: "CatalogTab",    name: "Catalog Tab — Premium Vouchers",         col: 2, row: 0 },
  { id: "ds-vault",   file: "VaultTab",      name: "Vault Tab — Wallet & QR Codes",          col: 3, row: 0 },
  // Row 1
  { id: "ds-vpn",     file: "VPNTab",        name: "VPN Tab — Anonymous Channel",            col: 0, row: 1 },
  { id: "ds-games",   file: "GamesTab",      name: "Games Tab — Oil Empire & Mini-Games",    col: 1, row: 1 },
  { id: "ds-ai",      file: "AiNewsTab",     name: "AI/News Tab — CrisisBot & Feed",         col: 2, row: 1 },
];

const GAP = 50;
const ORIGIN_X = 500, ORIGIN_Y = 118;

// ── Step 1: create placeholders ──────────────────────────────────────────────
await applyCanvasActions({
  actions: FRAMES.map(f => ({
    type: "create",
    shapeId: f.id,
    shape: {
      type: "iframe",
      x: ORIGIN_X + f.col * (W + GAP),
      y: ORIGIN_Y + f.row * (H + GAP + 100),
      w: W,
      h: H,
      state: "building",
      name: f.name,
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
await focusCanvasShapes({ shapeIds: ["ds-loading", "ds-map"], animateMs: 600 });

console.log("Canvas restored. 7 iframes live. Focused on ds-loading + ds-map.");
