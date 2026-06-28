---
name: Premium Redesign Mockups
description: 7 canvas mockup screens for the premium app redesign — file paths, shape IDs, design system, and canvas restoration recipe for new sessions.
---

# Premium Redesign Mockups

## Status
Built 2026-06-28. Awaiting user approval. Not yet graduated to production app.

## Component Files
All in `artifacts/mockup-sandbox/src/components/mockups/redesign/`:

| Component file | Canvas shape ID | Preview path |
|---|---|---|
| `LoadingScreen.tsx` | `ds-loading` | `/redesign/LoadingScreen` |
| `MapTab.tsx` | `ds-map` | `/redesign/MapTab` |
| `CatalogTab.tsx` | `ds-catalog` | `/redesign/CatalogTab` |
| `VaultTab.tsx` | `ds-vault` | `/redesign/VaultTab` |
| `VPNTab.tsx` | `ds-vpn` | `/redesign/VPNTab` |
| `GamesTab.tsx` | `ds-games` | `/redesign/GamesTab` |
| `AiNewsTab.tsx` | `ds-ai` | `/redesign/AiNewsTab` |

Shared CSS/keyframes: `_group.css` in the same folder.
Mockup sandbox runs on **port 8099** (workflow name: "Mockup Sandbox"). Canvas artifact ID is stale — use `focusCanvasShapes` instead of `presentArtifact`.

## Canvas Restoration (run at start of every new session)

If the canvas is empty (shapes not persisted), run this in code_execution to re-embed all 7 screens:

```javascript
// Step 1: Restart the Mockup Sandbox workflow first
await restartWorkflow({ workflowName: "Mockup Sandbox" });

// Step 2: Get the domain
// Run: echo $REPLIT_DOMAINS  (e.g. abc123.worf.replit.dev)
const DEV = `https://<YOUR_DOMAIN>:8099/__mockup/preview`;
const W = 390, H = 844, GAP = 50;

const frames = [
  { id: "ds-loading",  name: "Loading Screen — Vertical Typography",  col: 0, row: 0 },
  { id: "ds-map",      name: "Map Tab — Glassmorphic Station Modal",   col: 1, row: 0 },
  { id: "ds-catalog",  name: "Catalog Tab — Premium Vouchers",         col: 2, row: 0 },
  { id: "ds-vault",    name: "Vault Tab — Wallet & QR Codes",          col: 3, row: 0 },
  { id: "ds-vpn",      name: "VPN Tab — Anonymous Channel",            col: 0, row: 1 },
  { id: "ds-games",    name: "Games Tab — Oil Empire & Mini-Games",    col: 1, row: 1 },
  { id: "ds-ai",       name: "AI/News Tab — CrisisBot & Feed",         col: 2, row: 1 },
];

const folderMap = {
  "ds-loading": "LoadingScreen", "ds-map": "MapTab", "ds-catalog": "CatalogTab",
  "ds-vault": "VaultTab", "ds-vpn": "VPNTab", "ds-games": "GamesTab", "ds-ai": "AiNewsTab",
};

// Step 3: Place building placeholders
await applyCanvasActions({ actions: [{
  type: "create-auto",
  shapeIds: frames.map(f => f.id),
  names: frames.map(f => f.name),
  shape: { type: "iframe", w: W, h: H, state: "building" }
}]});

// Step 4: Set live
await applyCanvasActions({ actions: frames.map(f => ({
  type: "update", shapeId: f.id,
  updates: {
    shapeType: "iframe", state: "live",
    url: `${DEV}/redesign/${folderMap[f.id]}`,
    componentPath: `artifacts/mockup-sandbox/src/components/mockups/redesign/${folderMap[f.id]}.tsx`,
    componentName: f.name
  }
}))});

await focusCanvasShapes({ shapeIds: frames.map(f => f.id), animateMs: 600 });
```

**Why:** Canvas shapes are ephemeral — they don't survive a Replit session restart. The component .tsx files DO survive in the repo. This script re-creates the iframes pointing to the existing files. Port changed from 8081 → 8099 (8081 not in Replit's allowed workflow port list). `presentArtifact` artifact ID is stale; use `focusCanvasShapes` instead.

**How to apply:** At the start of any new session, check `getCanvasState()` first. If shapes are missing, restart the "Mockup Sandbox" workflow, then run the restoration script above.

## Design System (for new screens or iterations)
- Background: `#0A0A0F`; card surface `rgba(255,255,255,0.04–0.07)` + `backdrop-filter: blur(20–40px)`
- Primary: `#A855F7` violet; secondary: `#22D3EE` cyan
- Network: Lukoil `#EF4444`, Rosneft `#3B82F6`, Gazprom `#22D3EE`, Bashneft `#8B5CF6`, Tatneft `#22C55E`, NNK `#F59E0B`
- Font: Inter; mobile 390×844; bottom nav 72px glassmorphic; border-radius 16–24px

## Graduation Plan (when user approves screens)
Use `mockup-graduate` skill for each approved screen. Preserve:
- MapTab → keep Leaflet, real API data, cluster, crowd-report POST
- CatalogTab → keep POST /api/catalog/purchase + 38% block + LiveMarketWidget
- VaultTab → keep `qrcode` lib QR generation, voucher history API
- AiNewsTab → keep AI_PROVIDER env var, CrisisBot, news feed
- LoadingScreen → mount on app init, unmount after stations+user load
- VPNTab/GamesTab → replace existing VpnTab.tsx/GamesTab.tsx in frontend
