---
name: CatalogTab network logos
description: All 6 fuel network logos in CatalogTab are inline SVGs — no external requests, always crisp
---

# CatalogTab network logos

**The rule:** Network logos in `CatalogTab.tsx` are inline SVG React nodes stored in a `NETWORK_SVGS` record. Do NOT replace them with `<img>` tags pointing to external URLs (e.g. Google favicons) — those load blurry 16px rasters scaled up.

**Where:** `artifacts/tma-frontend/src/components/CatalogTab.tsx`

```tsx
const NETWORK_SVGS: Record<string, React.ReactNode> = {
  "Лукойл":        <svg ...> red bg + flame + "LUKOIL" </svg>,
  "Роснефть":      <svg ...> navy bg + vertical bar grid </svg>,
  "Газпромнефть":  <svg ...> blue bg + flame + "G-DRIVE" </svg>,
  "Башнефть":      <svg ...> purple bg + arch + "БН" </svg>,
  "Татнефть":      <svg ...> green bg + arch + dot + "ТАНЕКО" </svg>,
  "ННК":           <svg ...> amber bg + bold "ННК" + "NEO" </svg>,
};
```

`NetworkLogo` component checks `NETWORK_SVGS[net.name]` first; falls back to initials badge for unknown networks.

**Why:** Google `s2/favicons` returns a low-resolution PNG (16×16 upscaled) for Russian corporate domains — appears blurry on retina. SVG is crisp at any pixel density and requires zero network requests.

**How to apply:** When adding a new network to the `NETWORKS` array, also add a matching key to `NETWORK_SVGS`. Use `viewBox="0 0 38 38"` to match the `.ct-net-logo` container size (38×38px, border-radius 10px).
