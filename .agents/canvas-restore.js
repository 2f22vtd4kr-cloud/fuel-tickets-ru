/**
 * CANVAS RESTORATION SCRIPT
 * Run this in code_execution at the start of any new session.
 * It restores all redesign mockup iframes on the canvas.
 *
 * USAGE:
 *   1. Run bash: `echo $REPLIT_DOMAINS`  — copy the first domain (e.g. xxxx.spock.replit.dev)
 *   2. Set it as DOMAIN below
 *   3. Read this file and paste full contents into a single code_execution call
 *   4. Done — all 8 iframes appear and focus on the current active pair in one shot.
 *
 * The Mockup Sandbox workflow (port 8099) must be running first.
 * If it's not running: await restartWorkflow({ name: "Mockup Sandbox" })
 */

// ── PASTE DOMAIN HERE ──────────────────────────────────────────────────────
// Run `echo $REPLIT_DOMAINS` in bash and paste the first value:
const DOMAIN = "98e0153f-7bca-4bd3-86f2-fb762c93af93-00-1g96nbb2p97ll.spock.replit.dev";
// ──────────────────────────────────────────────────────────────────────────

const BASE = `https://${DOMAIN}:8099/__mockup/preview/redesign`;
const W = 390, H = 844;

// ── Screens ──────────────────────────────────────────────────────────────────
//
// STATUS as of 2026-06-28:
//   ds-loading   — ✅ Graduated → IntroSplash.tsx (still shown for reference)
//   ds-map       — ✅ Graduated → production MapTab.tsx (cobalt starfield)
//   ds-analytics — ✅ Graduated → production AnalyticsTab.tsx (cobalt starfield)
//   ds-catalog   — ✅ Graduated → production CatalogTab.tsx (cobalt starfield, 2989 lines)
//   ds-vault     — 🔵 Dormant — NEXT to graduate → production VaultTab.tsx
//   ds-vpn       — 🔵 Dormant
//   ds-games     — 🔵 Dormant
//   ds-ai        — 🔵 Dormant
//
// TAB ORDER in bottom nav: Карта → Аналитика → Каталог → Хранилище → Резерв

const FRAMES = [
  // ── Row 0: Graduated ──────────────────────────────────────────────────────
  { id: "ds-map",       file: "MapTab",       name: "Map Tab — Cobalt Starfield",           col: 0, row: 0 },
  { id: "ds-loading",   file: "LoadingScreen", name: "Loading Screen — Vertical Typography", col: 1, row: 0 },
  { id: "ds-vault",     file: "VaultTab",      name: "Vault Tab — Wallet & QR Codes",        col: 2, row: 0 },
  { id: "ds-games",     file: "GamesTab",      name: "Games Tab — Oil Empire & Mini-Games",  col: 3, row: 0 },

  // ── Row 1: Graduated / Dormant ────────────────────────────────────────────
  { id: "ds-analytics", file: "AnalyticsTab", name: "Analytics Tab — Cobalt Starfield",     col: 0, row: 1 },
  { id: "ds-catalog",   file: "CatalogTab",    name: "Catalog Tab — Cobalt Starfield",        col: 1, row: 1 },
  { id: "ds-vpn",       file: "VPNTab",        name: "VPN Tab — Anonymous Channel",          col: 2, row: 1 },
  { id: "ds-ai",        file: "AiNewsTab",     name: "AI/News Tab — CrisisBot & Feed",       col: 3, row: 1 },
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

// ── Step 3: focus on next work pair ─────────────────────────────────────────
await focusCanvasShapes({ shapeIds: ["ds-vault", "ds-catalog"], animateMs: 600 });

console.log("Canvas restored. 8 iframes live. Focused on ds-vault + ds-catalog.");
console.log("");
console.log("GRADUATION STATUS:");
console.log("  ✅ ds-loading   → IntroSplash.tsx");
console.log("  ✅ ds-map       → MapTab.tsx (cobalt starfield)");
console.log("  ✅ ds-analytics → AnalyticsTab.tsx (cobalt starfield)");
console.log("  ✅ ds-catalog   → CatalogTab.tsx (cobalt starfield)");
console.log("  🔵 ds-vault     → VaultTab.tsx  ← NEXT");
console.log("  🔵 ds-games     → GamesTab.tsx (Reserve tab)");
console.log("  🔵 ds-vpn, ds-ai → lower priority");
console.log("");
console.log("VaultTab notes:");
console.log("  - Production file: artifacts/tma-frontend/src/components/VaultTab.tsx");
console.log("  - Shows: purchase history, active QR codes (qrcode npm), XP progress bar, tier badge");
console.log("  - Mockup sandbox: artifacts/mockup-sandbox/src/components/mockups/redesign/VaultTab.tsx");
