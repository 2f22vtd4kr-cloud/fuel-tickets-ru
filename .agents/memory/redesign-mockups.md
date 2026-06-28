---
name: Premium Redesign Mockups
description: Canvas mockup screens for the premium app redesign — file paths, shape IDs, design tokens, graduation status, and one-shot canvas restoration.
---

# Premium Redesign Mockups

## Status (as of 2026-06-28)

| Shape ID | File | Status |
|----------|------|--------|
| `ds-loading` | `LoadingScreen.tsx` | ✅ Graduated → `artifacts/tma-frontend/src/components/IntroSplash.tsx` |
| `ds-map` | `MapTab.tsx` | ✅ **Graduated** → `artifacts/tma-frontend/src/components/MapTab.tsx` (cobalt starfield) |
| `ds-analytics` | `AnalyticsTab.tsx` | ✅ **Graduated** → `artifacts/tma-frontend/src/components/AnalyticsTab.tsx` (cobalt starfield) |
| `ds-catalog` | `CatalogTab.tsx` | ✅ **Graduated** → `artifacts/tma-frontend/src/components/CatalogTab.tsx` (cobalt starfield re-applied; ~490 lines, network-voucher wizard flow with Stars/crypto payment) |
| `ds-vault` | `VaultTab.tsx` | 🔵 Dormant — next candidate |
| `ds-vpn` | `VPNTab.tsx` | 🔵 Dormant |
| `ds-games` | `GamesTab.tsx` | 🔵 Dormant |
| `ds-ai` | `AiNewsTab.tsx` | 🔵 Dormant |

All `.tsx` files live in `artifacts/mockup-sandbox/src/components/mockups/redesign/`.
Shared keyframes/CSS: `_group.css` in same folder.

## Next session priority

1. Graduate `ds-vault` (VaultTab) into production `artifacts/tma-frontend/src/components/VaultTab.tsx`
   - VaultTab shows: purchase history list, active QR codes (client-side `qrcode` npm), XP progress bar, tier badge
   - Rich mockup already exists in sandbox at `artifacts/mockup-sandbox/src/components/mockups/redesign/VaultTab.tsx`
2. Continue: `ds-games` (GamesTab / Резерв tab) → production
3. Continue: any remaining tabs

## Canvas Restoration — ONE STEP

At the start of any new session:
1. Ensure **Mockup Sandbox** workflow is running (port 8099). If not: `await restartWorkflow({ name: "Mockup Sandbox" })` in code_execution.
2. Run `bash: echo $REPLIT_DOMAINS` to get the domain.
3. Read `.agents/canvas-restore.js`, set the `DOMAIN` constant at the top, paste into a single `code_execution` call.

**Why canvas dies between sessions:** Canvas shapes are ephemeral (not persisted across Replit session restarts). The `.tsx` component files survive in git. The restore script re-creates all iframes pointing to the existing files in one shot.

## Mockup Sandbox Technical Notes
- Workflow command: `cd artifacts/mockup-sandbox && PORT=8099 BASE_PATH=/__mockup pnpm dev`
- Port **8099** — 8081 is NOT in Replit's allowed workflow port list
- Preview URL pattern: `https://<REPLIT_DOMAINS>:8099/__mockup/preview/redesign/<ComponentName>`
- Never use `presentArtifact` (artifact ID is stale) — always use `focusCanvasShapes({ shapeIds })` to bring shapes into view

## Cobalt Starfield Design Tokens (MapTab + AnalyticsTab + CatalogTab — current standard)

This is the approved visual language for all tabs going forward:

- **Background**: `linear-gradient(160deg, #0C0EA8 0%, #090B82 40%, #060760 75%, #040450 100%)`
- **Stars**: 90–110 SVG circles via `useMemo`, white, opacity 0.1–0.7, `starTwinkle` (or `ctStarTwinkle`) animation with `--op` CSS var
- **Grid lines**: faint indigo SVG lines at 33%/66% (opacity ~0.09–0.13)
- **Ambient glow blooms**: violet radial at top, magenta radial at bottom-right corner
- **Mercedes ambient strip**: `AmbientStrip` / `Strip` / `CatalogStrip` component — `linear-gradient(90deg, transparent → color → transparent)`, 1.5px tall, `ambientFlow` + `ambientPulse` keyframes, appears on top/bottom edges of cards, header, modals
- **Header**: sticky `rgba(4,5,68,0.88)` with `backdrop-filter:blur(20px)`, violet ambient strip on bottom edge, gradient title text
- **Availability colors (vivid)**: `#00E676` green, `#FFD600` yellow, `#FF1744` red
- **Network brand colors**: Lukoil `#DC143C`, Rosneft `#1565C0`, Gazprom `#0288D1`, Bashneft `#6A1B9A`, Tatneft `#00695C`, NNK `#E65100`
- **Dual-ring station markers**: inner dot = availability color, outer ring = network brand color with glow, pulsing ring = availability color
- **CTA button**: `linear-gradient(135deg, #a855f7, #db2777)` violet→magenta, `boxShadow: 0 0 24px #a855f744`
- **Bottom nav**: `rgba(4,5,60,0.95)` + `blur(20px)`, violet ambient strip on top edge, active tab has violet/magenta underline
- **Period/sort buttons**: active = `linear-gradient(135deg, #a855f7, #db2777)`, inactive = dark glass
- **Card/panel glass**: `rgba(255,255,255,0.03–0.07)` background, `rgba(255,255,255,0.06–0.1)` border, `backdrop-filter:blur(12–24px)`
- **Font**: `'Inter',system-ui,sans-serif` body; `'JetBrains Mono',monospace` for numbers/codes/LIVE labels
- **keyframe naming convention per file**: prefix with short ID (e.g. `ct` for CatalogTab) to avoid cross-file CSS collision

## Design Rules (user-confirmed)

- **NO underscore labels** — never render `СЛОВО_СЛОВО` gray micro-labels above section headers. Section titles stand alone.
- **NO "требуется реакция"** or `КРИЗИС_ДЕФИЦИТА` text — crisis banner just shows count + percentage
- **No underscores anywhere in UI text** — not in headers, not in banners, not in labels
- **Segmented controls**: always use the glass pill + gradient active tab pattern (not Tailwind className approach)

## CatalogTab Graduation — What Was Applied

Edits to `artifacts/tma-frontend/src/components/CatalogTab.tsx` (2989 lines):
- Added `React` default import (needed for `React.CSSProperties` in starfield component)
- Added `CATALOG_COBALT_CSS` const (keyframes: `ctStarTwinkle`, `ctAmbientFlow`, `ctAmbientPulse`, `ctScanPulse`)
- Added `CatalogStarField` component (90 SVG circle stars, `useMemo`, `ctStarTwinkle`)
- Added `CatalogStrip` component (ambient 1.5px strip, `ct-ambient-strip` class)
- Main container: `bg-[#08090f]` → cobalt gradient + fixed starfield + SVG grid + ambient glows
- Header: flat div → sticky cobalt glass (`rgba(4,5,68,0.88)` + blur), gradient title, `CatalogStrip` bottom edge, LIVE indicator
- Segmented control: Tailwind className buttons → inline style glass pill with gradient active tab
- `FuelItem` card: `#14141c` → cobalt glass (`rgba(255,255,255,0.03)` / crisis tint), `backdropFilter:blur(12px)`
- `FuelItem` statusColor: `#22c55e` → `#00E676`, `#eab308` → `#FFD600`, `#ef4444` → `#FF1744`
- `FuelItem` limit bar: track `#0b0b0f` → `rgba(255,255,255,0.06)`; fill `#ef4444` → `#FF1744`
- `FuelItem` lock badge: `rgba(34,197,94,0.07)` → `rgba(0,230,118,0.06)`; color `#22c55e` → `#00E676`
- `FuelItem` limit warning: `#eab308` → `#FFD600`
- `FuelItem` disabled button: `#1a1a2a` → `rgba(255,255,255,0.04)`, border → `rgba(255,255,255,0.08)`
- `BlockOverlay`: backdrop `rgba(5,5,7,0.97)` → `rgba(4,5,68,0.97)`; card `#14141c` → `rgba(20,5,25,0.95)`; red `#ef4444` → `#FF1744` throughout; `backdropFilter:blur(20px)` added
- `PaymentConfirmModal`: card `#0d0d18` → `rgba(12,14,168,0.7)`; detail box `#14141c` → `rgba(255,255,255,0.04)`; cancel btn `#14141c` → `rgba(255,255,255,0.04)`; `backdropFilter:blur(24px)` added; `#22c55e` → `#00E676`
- Removed 3 underscore labels: `СЕТЕВЫЕ_ТАЛОНЫ` → `Сетевые талоны`; `ЛИМИТ_СУТОЧНЫЙ` div removed; `ПОДГОТОВКА_ОПЛАТЫ` div removed
- TypeScript: zero errors (tsc --noEmit passes clean)

## AnalyticsTab Graduation — What Was Applied

Edits to `artifacts/tma-frontend/src/components/AnalyticsTab.tsx`:
- Added `COBALT_CSS` const + `StarField` + `AmbientStrip` primitives
- Sticky glass header with ambient strip
- Vivid colors: `#00E676` / `#FFD600` / `#FF1744`
- CSS keyframes: `starTwinkle` / `ambientFlow` / `ambientPulse` / `scanPulse`
- 3 underscore labels removed/fixed

## MapTab — What Was Graduated to Production

Edits to `artifacts/tma-frontend/src/components/MapTab.tsx`:
- `BRAND_ACCENT` dict updated to vivid network colors
- `AMBIENT_CSS` constant added (keyframes: `ambientFlow`, `ambientPulse`)
- `availabilityColor()` updated to vivid `#00E676` / `#FFD600` / `#FF1744`
- `AmbientStrip` React component added (reusable, takes `color`, `axis`, `thickness`, `style`)
- `createStationIcon()` redesigned: dual-ring (availability dot + brand outer ring), pulsing availability ring
- `PopupContent` inline colors updated to vivid palette
- Legend colors updated to vivid
- Station detail panel: `rgba(8,8,28,0.97)` bg, brand ambient strip on top edge, brand-color drag handle, brand glow bloom inside top
- CTA button: orange flame gradient, shimmer animation, brand ambient strip on bottom edge
- `selectedBrand` / `ambientColor` derived from selected station's network, passed to panel
