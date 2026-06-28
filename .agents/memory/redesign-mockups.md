---
name: Premium Redesign Mockups
description: Canvas mockup screens for the premium app redesign — file paths, shape IDs, design tokens, graduation status, and one-shot canvas restoration.
---

# Premium Redesign Mockups

## Status (as of 2026-06-28)

| Shape ID | File | Status |
|----------|------|--------|
| `ds-loading` | `LoadingScreen.tsx` | ✅ Graduated → `artifacts/tma-frontend/src/components/IntroSplash.tsx` |
| `ds-map` | `MapTab.tsx` | ✅ **Graduated** → `artifacts/tma-frontend/src/components/MapTab.tsx` |
| `ds-analytics` | `AnalyticsTab.tsx` | 🟡 **Mockup complete** — cobalt starfield, ready to graduate |
| `ds-catalog` | `CatalogTab.tsx` | 🔵 Dormant — built earlier, not yet iterated with new visual language |
| `ds-vault` | `VaultTab.tsx` | 🔵 Dormant |
| `ds-vpn` | `VPNTab.tsx` | 🔵 Dormant |
| `ds-games` | `GamesTab.tsx` | 🔵 Dormant |
| `ds-ai` | `AiNewsTab.tsx` | 🔵 Dormant |

All `.tsx` files live in `artifacts/mockup-sandbox/src/components/mockups/redesign/`.
Shared keyframes/CSS: `_group.css` in same folder.

## Next session priority

1. Graduate `ds-analytics` (AnalyticsTab) into production `artifacts/tma-frontend/src/components/AnalyticsTab.tsx`
2. Bring `ds-catalog` (Каталог) to canvas and apply cobalt starfield + Mercedes ambient lighting
3. Continue tabs in order: Хранилище → Резерв

## Canvas Restoration — ONE STEP

At the start of any new session:
1. Ensure **Mockup Sandbox** workflow is running (port 8099). If not: `await restartWorkflow({ name: "Mockup Sandbox" })` in code_execution.
2. Read `.agents/canvas-restore.js` and paste its full content into a single `code_execution` call.

That file uses `process.env.REPLIT_DOMAINS` — no manual domain substitution needed.

**Why canvas dies between sessions:** Canvas shapes are ephemeral (not persisted across Replit session restarts). The `.tsx` component files survive in git. The restore script re-creates all iframes pointing to the existing files in one shot.

## Mockup Sandbox Technical Notes
- Workflow command: `cd artifacts/mockup-sandbox && PORT=8099 BASE_PATH=/__mockup pnpm dev`
- Port **8099** — 8081 is NOT in Replit's allowed workflow port list
- Preview URL pattern: `https://<REPLIT_DOMAINS>:8099/__mockup/preview/redesign/<ComponentName>`
- Never use `presentArtifact` (artifact ID is stale) — always use `focusCanvasShapes({ shapeIds })` to bring shapes into view

## Cobalt Starfield Design Tokens (MapTab + AnalyticsTab — current standard)

This is the approved visual language for all tabs going forward:

- **Background**: `linear-gradient(160deg, #0C0EA8 0%, #090B82 40%, #060760 75%, #040450 100%)`
- **Stars**: 90–110 SVG circles via `useMemo`, white, opacity 0.1–0.7, `starTwinkle` animation with `--op` CSS var
- **Grid lines**: faint indigo SVG lines at 33%/66% (opacity 0.13)
- **Ambient glow blooms**: violet radial at top, magenta radial at bottom-right corner
- **Mercedes ambient strip**: `AmbientStrip` / `Strip` component — `linear-gradient(90deg, transparent → color → transparent)`, 1.5px tall, `ambientFlow` + `ambientPulse` keyframes, appears on top/bottom edges of cards, header, modals
- **Header**: sticky `rgba(4,5,68,0.88)` with `backdrop-filter:blur(20px)`, violet ambient strip on bottom edge
- **Availability colors**: vivid — `#00E676` green, `#FFD600` yellow, `#FF1744` red
- **Network brand colors**: Lukoil `#DC143C`, Rosneft `#1565C0`, Gazprom `#0288D1`, Bashneft `#6A1B9A`, Tatneft `#00695C`, NNK `#E65100`
- **Dual-ring station markers**: inner dot = availability color, outer ring = network brand color with glow, pulsing ring = availability color
- **CTA button**: orange `linear-gradient(135deg, #E8622A 0%, #c04010 60%, #9a2f08 100%)`, shimmer sweep animation
- **Bottom nav**: `rgba(4,5,60,0.95)` + `blur(20px)`, violet ambient strip on top edge, active tab has violet/magenta underline
- **Period/sort buttons**: active = `linear-gradient(135deg, #a855f7, #db2777)`, inactive = dark glass with blue-tinted border
- **Font**: `'Inter',system-ui,sans-serif` body; `'JetBrains Mono',monospace` for numbers/codes/LIVE

## Design Rules (user-confirmed)

- **NO underscore labels** — never render `СЛОВО_СЛОВО` gray micro-labels (e.g. `МАТРИЦА_СНАБЖЕНИЯ · АНАЛИТИКА`, `ДИНАМИКА_НАЛИЧИЯ`) above section headers. Section titles stand alone.
- **NO "требуется реакция"** or `КРИЗИС_ДЕФИЦИТА` text — crisis banner just shows count + percentage
- **No underscores anywhere in UI text** — not in headers, not in banners, not in labels

## MapTab — What Was Graduated to Production

Edits applied to `artifacts/tma-frontend/src/components/MapTab.tsx`:
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

## AnalyticsTab Mockup — Sections

`artifacts/mockup-sandbox/src/components/mockups/redesign/AnalyticsTab.tsx` contains:
1. Sticky header — title gradient, LIVE green pulse, timestamp
2. Crisis banner (conditional) — red ambient strip, pulsing dot, count only (no underscore labels)
3. Three stat cards — Всего АЗС / Ср. наличие / Кризис зон, each with ambient strip in its metric color
4. Region monitor (cycling) + donut chart side by side
5. Period selector (1ч/6ч/24ч/7д) + area chart (recharts) with violet gradient fill + red dashed 25% threshold
6. Price matrix (top-6 crisis regions, recharts-free, grid layout)
7. Regional bars (sorted by availability or A–Я) — vivid stacked bars, left border = availability color
8. Bottom nav (Analytics tab active)
