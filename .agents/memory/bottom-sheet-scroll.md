---
name: Bottom-sheet scroll vs drag
description: How to make framer-motion drag-to-dismiss sheets scroll internally without conflict
---

# Bottom-sheet scroll vs drag (framer-motion)

The rule: a framer-motion `drag="y"` container that also needs internal scroll requires two specific settings.

**How to apply:**
1. Do NOT set `overflow: "hidden"` on the sheet container — it overrides `overflowY: "auto"` (hidden always wins in CSS).
2. Set `touchAction: "pan-y"` (not `"none"`) so iOS/Android pass vertical swipes to the native scroll engine instead of swallowing them for the drag handler.
3. Set `overflowY: "auto"` and optionally `-webkit-overflow-scrolling: touch` for smooth momentum.

```tsx
// CORRECT
style={{
  overflowY: "auto",
  touchAction: "pan-y",   // NOT "none"
  // NO overflow: "hidden" here
}}

// WRONG — both of these kill scroll
style={{
  overflowY: "auto",
  overflow: "hidden",     // ← overrides the line above
  touchAction: "none",    // ← eats all touch events
}}
```

**Why:** `overflow: "hidden"` is a shorthand that sets both axes; it overrides the earlier `overflowY: "auto"` regardless of declaration order. `touchAction: "none"` tells the browser to hand all pointer events to JS, so the native scroll stack never activates.

The drag-to-dismiss still works with `pan-y` — framer-motion reads `dragConstraints` and `onDragEnd` velocity; it just doesn't intercept the touch stream before the scroll engine.

**Affected file:** `artifacts/tma-frontend/src/components/VpnModal.tsx` (fixed 2026-06-28).
