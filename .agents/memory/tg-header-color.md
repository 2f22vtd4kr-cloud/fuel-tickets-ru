---
name: Telegram header color
description: The Telegram WebApp SDK header/bg color must match the app's cobalt palette to avoid a visible black gap at the top
---

# Telegram header / background color

**The rule:** `App.tsx` must call both color setters on SDK init, using the cobalt value `#1318B0`.

```ts
tg.setHeaderColor("#1318B0");
tg.setBackgroundColor("#1318B0");
```

**Why:** The Telegram native chrome (status bar + header bar) renders above the WebApp iframe. If the color doesn't match the app background, users see a visible stripe of the wrong color between the Telegram header and the app content. The old value `#050507` (cyberpunk black) was left over from the previous design system and caused a black gap above the cobalt app.

**How to apply:**
- Always update both setters together when the app background color changes.
- Wrap in `try/catch` — older Telegram SDK versions (< 6.1) throw on these calls; the catch is safe to ignore.
- The dev preview (Replit iframe) shows "Header color is not supported in version 6.0" in console — this is cosmetic; it works correctly inside a real Telegram client.

**Affected file:** `artifacts/tma-frontend/src/App.tsx` (fixed 2026-06-28).
