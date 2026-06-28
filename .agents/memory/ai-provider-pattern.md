---
name: AI Provider Pattern
description: Gemini 2.0 Flash → Groq (llama-3.3-70b) → rule-based chain for chat and news generation. Key details, gotchas, and env vars.
---

# AI Provider Pattern

## Provider chain
1. **Gemini 2.0 Flash** (`GEMINI_API_KEY`) — primary via `_call_gemini()`
2. **Groq llama-3.3-70b-versatile** (`GROQ_API_KEY`) — auto-fallback via `_call_groq()`
3. **Rule-based** — last resort (no API keys needed)

**Why:** Gemini free tier hits quota limits (HTTP 429) frequently; Groq is fast and reliable as fallback. Both use `httpx.AsyncClient` with 12s timeout.

## Key env vars
- `GEMINI_API_KEY` — Google AI Studio key (may hit quota on free tier → Groq takes over silently)
- `GROQ_API_KEY` — Groq console key (OpenAI-compatible endpoint)
- `AI_PROVIDER` — override: `gemini` (default) | `groq` | `rule-based` | `none`
- `GEMINI_MODEL` — default `gemini-2.0-flash`
- `GROQ_MODEL` — default `llama-3.3-70b-versatile`

## Gemini API format (not OpenAI-compatible)
- URL: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}`
- Body uses `contents[].parts[].text` and `system_instruction.parts[].text`
- History roles: `"user"` / `"model"` (NOT `"assistant"`)
- Response: `candidates[0].content.parts[0].text`

## Groq API format (OpenAI-compatible)
- URL: `https://api.groq.com/openai/v1/chat/completions`
- Standard `Authorization: Bearer` header
- History roles: `"user"` / `"assistant"` / `"system"`
- Response: `choices[0].message.content`

## FuelStatus has NO price_per_liter column
- Prices live in `FUEL_PRICES_RUB` dict from `tma_backend.seed_regions`
- Use `from tma_backend.seed_regions import FUEL_PRICES_RUB` for price summaries in AI context

## Endpoints
- `POST /api/ai/chat` — conversational КризисБот with live DB context (green/crisis counts, user limits)
- `POST /api/ai/news` — on-demand: generates 3 AI-authored news items from live DB snapshot, saves to `news_events`

## Scheduler
- `generate_ai_news()` runs every 3h via APScheduler (sync job that spawns async loop internally)
- `generate_news_from_availability()` runs every 2h (rule-based, no AI)
- AI news items tagged `source="КризисБот · ИИ-аналитика"`

## JSON news generation
- Model is prompted to return a bare JSON array (no markdown)
- Response is cleaned: strip ` ```json ` fences before `json.loads()`
- Validated fields: region, headline (max 200), body (max 1000), severity (critical/warning/success/info), fuel_type, price_delta_pct
