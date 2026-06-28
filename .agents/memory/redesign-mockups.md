---
name: Premium Redesign Mockups
description: 7 canvas mockup screens for the premium app redesign — file paths, shape IDs, design tokens, graduation status, and one-shot canvas restoration.
---

# Premium Redesign Mockups

## Status (as of 2026-06-28)

| Shape ID | File | Status |
|----------|------|--------|
| `ds-loading` | `LoadingScreen.tsx` | ✅ Graduated → `artifacts/tma-frontend/src/components/IntroSplash.tsx` |
| `ds-map` | `MapTab.tsx` | 🟡 **Ready for graduation** — cobalt starfield redesign complete |
| `ds-catalog` | `CatalogTab.tsx` | 🔵 Dormant — built 2026-06-28, not yet iterated |
| `ds-vault` | `VaultTab.tsx` | 🔵 Dormant |
| `ds-vpn` | `VPNTab.tsx` | 🔵 Dormant |
| `ds-games` | `GamesTab.tsx` | 🔵 Dormant |
| `ds-ai` | `AiNewsTab.tsx` | 🔵 Dormant |

All 7 `.tsx` files live in `artifacts/mockup-sandbox/src/components/mockups/redesign/`.
Shared keyframes/CSS: `_group.css` in same folder.

## Canvas Restoration — ONE STEP

At the start of any new session:
1. Ensure **Mockup Sandbox** workflow is running (port 8099). If not: `await restartWorkflow({ name: "Mockup Sandbox" })` in code_execution.
2. Read `.agents/canvas-restore.js` and paste its full content into a single `code_execution` call.

That file uses `process.env.REPLIT_DOMAINS` — no manual domain substitution needed.

**Why canvas dies between sessions:** Canvas shapes are ephemeral (not persisted across Replit session restarts). The `.tsx` component files survive in git. The restore script re-creates all 7 iframes pointing to the existing files in one shot.

## Mockup Sandbox Technical Notes
- Workflow command: `cd artifacts/mockup-sandbox && PORT=8099 BASE_PATH=/__mockup pnpm dev`
- Port **8099** — 8081 is NOT in Replit's allowed workflow port list
- Preview URL pattern: `https://<REPLIT_DOMAINS>:8099/__mockup/preview/redesign/<ComponentName>`
- Never use `presentArtifact` (artifact ID is stale) — always use `focusCanvasShapes({ shapeIds })` to bring shapes into view

## MapTab Cobalt Starfield Design (current version)
Design tokens for this screen — different from other screens (which use violet/black):
- **Background**: `#0B0C4A → #060730` deep cobalt gradient
- **Stars**: 80 SVG circles, `useMemo` stable, white opacity 0.15–0.7
- **Road grid**: indigo SVG lines + faint district text labels
- **Primary action**: `#E8622A` orange/coral — CTAs, active chips, nav active tab, filter apply
- **Modal tint**: `rgba(8,7,52,0.95)` cobalt glassmorphic, `blur(48px)`
- **Long-shadow helper**: `longShadow(color, len)` — stepped CSS text-shadow for bold headers
- **Availability colours**: green `#22C55E`, yellow `#F59E0B`, red `#EF4444` (unchanged from system)
- **Network colours**: unchanged from system (see below)

## Design System (original screens — ds-catalog through ds-ai)
- Background: `#0A0A0F`; card surface `rgba(255,255,255,0.04–0.07)` + `backdrop-filter: blur(20–40px)`
- Primary: `#A855F7` violet; secondary: `#22D3EE` cyan
- Network: Lukoil `#EF4444`, Rosneft `#3B82F6`, Gazprom `#22D3EE`, Bashneft `#8B5CF6`, Tatneft `#22C55E`, NNK `#F59E0B`
- Font: Inter; mobile 390×844; bottom nav 72px glassmorphic; border-radius 16–24px

## Graduation Plan (MapTab — next session priority)
Use `mockup-graduate` skill. Preserve from existing production `MapTab.tsx`:
- Leaflet + react-leaflet real map tiles + marker clustering
- Real station data from `useStationStore` + API
- Crowd-report `POST /api/stations/{id}/report`
- Region/fuel/status filter state in `useMapStore`

Apply from mockup:
- Cobalt gradient as map container background / CSS filter on tiles
- Glassmorphic slide-up modal replacing current bottom sheet
- Slide-up filter panel replacing current filter chips
- Orange `#E8622A` for CTAs (replace purple)
- Station marker pulse-ring animation
