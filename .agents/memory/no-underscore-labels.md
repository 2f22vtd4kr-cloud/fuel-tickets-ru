---
name: No underscore UI labels
description: User explicitly banned underscore-separated gray micro-labels and specific crisis text patterns from all UI.
---

# Rule: No underscore labels in UI

**Rule:** Never render tiny gray text labels like `МАТРИЦА_СНАБЖЕНИЯ · АНАЛИТИКА`, `ДИНАМИКА_НАЛИЧИЯ`, `РЕГИОНАЛЬНОЕ_НАЛИЧИЕ`, `МАТРИЦА_ЦЕН · КРИТИЧНЫЕ_ЗОНЫ`, `ФИЛЬТРЫ · МАТРИЦА`, or any `СЛОВО_СЛОВО` pattern in mockups or production UI. Also never show "КРИЗИС_ДЕФИЦИТА" or "требуется реакция".

**Why:** User explicitly flagged these on 2026-06-28 as unwanted. They appear as tiny barely-visible gray monospace text above section headings — a cyberpunk metadata aesthetic the user does not want.

**How to apply:** Section headers should use only a clean label (e.g. "Тренд наличия", "По регионам", "Матрица цен") without any underscore-separated prefix line above them. Crisis banners can show a count/percentage but not underscore-cased category names.
