# 🔥 ТОПЛИВНЫЙ УЗЕЛ — ПОЛНЫЙ OVERHAUL: ПРОМПТ ДЛЯ REPLIT

> **Ссылки на проект:**  
> App: https://fuel-tickets-ru--samarkandfolia.replit.app  
> GitHub: https://github.com/2f22vtd4kr-cloud/fuel-tickets-ru  
> Stack: FastAPI (Python) + React 19 / Vite / TypeScript + python-telegram-bot  

---

## КОНТЕКСТ И ЦЕЛЬ

This is a full overhaul of the existing Russian Federation fuel-crisis marketplace Telegram Mini App (TMA). The app sells digital fuel tickets, tracks gas station availability during the ongoing fuel crisis, and includes engagement mini-games. The current stack (FastAPI + React 19 + Vite + TypeScript) must be preserved. This prompt is an exhaustive, phase-by-phase rebuild instruction. Complete every section in order.

---

## PHASE 0 — GLOBAL DESIGN SYSTEM: LIQUID GLASS

Replace the entire visual identity. The new design language is **Apple "Liquid Glass"** — the translucent, frosted, light-refracting aesthetic from iOS 26. Implement it as a CSS design system applied universally to every component.

### CSS Design Tokens (add to global CSS / Tailwind config):
```css
:root {
  /* Backgrounds */
  --bg-base: #08090f;            /* near-black base */
  --bg-glass: rgba(255,255,255,0.07);
  --bg-glass-hover: rgba(255,255,255,0.11);
  --bg-glass-active: rgba(255,255,255,0.16);

  /* Glass borders */
  --border-glass: rgba(255,255,255,0.14);
  --border-glass-bright: rgba(255,255,255,0.28);

  /* Accent palette (keep existing violet/magenta brand but soften) */
  --accent-primary: #a78bfa;     /* soft violet */
  --accent-secondary: #f472b6;   /* rose-pink */
  --accent-danger: #fb7185;
  --accent-success: #34d399;
  --accent-fuel: #fbbf24;        /* amber — fuel color */

  /* Text */
  --text-primary: rgba(255,255,255,0.95);
  --text-secondary: rgba(255,255,255,0.60);
  --text-tertiary: rgba(255,255,255,0.35);

  /* Shadows & glows */
  --shadow-glass: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12);
  --glow-primary: 0 0 24px rgba(167,139,250,0.35);
  --glow-fuel: 0 0 20px rgba(251,191,36,0.30);

  /* Blur */
  --blur-glass: blur(20px) saturate(180%);
  --blur-overlay: blur(40px);

  /* Radius */
  --radius-card: 20px;
  --radius-btn: 14px;
  --radius-pill: 999px;

  /* Transitions */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Glass Panel Mixin (apply to all cards, modals, panels):
```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-glass);
  /* Light-catch top edge */
  border-top-color: rgba(255,255,255,0.22);
}
```

### Glass Button:
```css
.btn-glass {
  background: var(--bg-glass-hover);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-btn);
  color: var(--text-primary);
  transition: all 0.2s var(--ease-smooth);
}
.btn-glass:hover { background: var(--bg-glass-active); border-color: var(--border-glass-bright); }
.btn-glass:active { transform: scale(0.97); }
.btn-primary { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); box-shadow: var(--glow-primary); }
```

Apply `.glass-panel` to: every card, bottom nav, modals, tooltips, purchase sheets, ticket viewers, news cards.
Apply Framer Motion `initial/animate/exit` spring transitions to all mounting components.
The base `<body>` gets a subtle animated radial gradient background:
```css
body {
  background: radial-gradient(ellipse at 20% 50%, rgba(88,28,135,0.18) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(219,39,119,0.12) 0%, transparent 55%),
              var(--bg-base);
  min-height: 100vh;
}
```

---

## PHASE 1 — BOTTOM NAV OVERHAUL

Replace the current bottom nav with a floating glass pill nav (like iOS 18+ dock):

- 5 icons: 🗺️ Карта | 🎫 Талоны | 🤖 ИИ-Советник | 🎮 Игры | 📰 Новости
- Float 12px above the bottom safe area
- Active tab: accent glow + subtle scale up
- Haptic feedback on tab switch (Telegram.WebApp.HapticFeedback)
- The old tabs "Analytics / Vault / Reserve" merge into the new structure below

---

## PHASE 2 — FUEL TICKETS MARKETPLACE (CORE OVERHAUL)

### 2.1 — Catalog Tab ("Талоны")

**Search & Filtering (must-have auto-complete):**
- Full-text fuzzy search across gas station names using Fuse.js
- Each search field auto-suggests: station name, region, fuel type
- Recognised names: Роснефть, Лукойл, Газпром нефть, Башнефть, ТНК, Татнефть, Сургутнефтегаз, Независимые АЗС, Новая перевозка, Юго-Западная нефть, КамАЗ-Авто, НСТ, ЭКО, Neste (where available), Трасса, Евро+
- Auto-detect partial names: "роснеф" → "Роснефть", "лук" → "Лукойл"

**Ticket Cards UI:**
Each ticket card must look like a premium physical ticket:
```
┌─────────────────────────────────────┐
│  [LOGO]  РОСНЕФТЬ           🔴 АИ-95│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  20 литров                          │
│  Действителен: Краснодар, Севастополь│
│  Срок: до 31.08.2025                │
│                    💰 480 USDT      │
│  [■ Купить]  [⚡ Наличие: 14 шт]   │
└─────────────────────────────────────┘
```
- Logo SVG for each franchise (use colored monogram if no real logo available; use accurate brand colors)
- Animated shimmer effect on available count when low
- Pulsing red dot when availability < 5

**Ticket Availability (Dynamic Supply Engine):**

Implement a `TicketAvailabilityEngine` on the backend (`tma_backend/availability.py`):
```python
class TicketAvailabilityEngine:
    """
    Dynamic ticket supply model based on crisis severity.
    
    base_supply(station) = floor(station.tank_capacity_liters / ticket_volume_liters * scarcity_factor)
    
    scarcity_factor = f(crisis_level, region_demand, days_since_restock)
    crisis_level: 1.0 (normal) to 0.05 (critical shortage)
    
    Supply restocks every 6 hours with a random factor.
    Purchase depletes supply atomically (SQLite SELECT FOR UPDATE equivalent).
    Supply never goes below 0 or above max_supply.
    """
    def calculate_available(self, station_id: int, ticket_volume: int) -> int: ...
    def on_purchase(self, station_id: int, ticket_volume: int) -> bool: ...  # returns False if sold out
    def restock_job(self): ...  # APScheduler every 6h
```

**Crisis multipliers (stored in DB, updated by news feed events):**
- NORMAL: supply factor 0.8–1.0
- ELEVATED: 0.4–0.6
- CRITICAL: 0.1–0.25
- BLACKOUT: 0 (no tickets available for this station)

These update automatically based on the news/crisis feed (Phase 5).

### 2.2 — Digital Ticket (Post-Purchase: The Product Must Shine)

After successful payment, generate and display a **Premium Digital Fuel Ticket**:

**Visual ticket design (HTML Canvas → PNG export):**
```
╔══════════════════════════════════════╗
║  🛢️  ТОПЛИВНЫЙ УЗЕЛ                 ║
║      ЦИФРОВОЙ ТАЛОН #TN-2025-XXXXX  ║
╠══════════════════════════════════════╣
║  РОСНЕФТЬ                     АИ-95  ║
║  Объём: 20 литров                    ║
║  Регион: Краснодарский край          ║
║  ─────────────────────────────────  ║
║  ██████████████   QR-код             ║
║  ██████████████                      ║
║  ██████████████   Код: TN-A4X9-7YZ  ║
║  ─────────────────────────────────  ║
║  Действителен до: 31.08.2025         ║
║  Куплено: 15.06.2025 14:32           ║
╠══════════════════════════════════════╣
║  📱 tg://t.me/fuel_tickets_ru_bot   ║
╚══════════════════════════════════════╝
```

**Export options (prominent buttons under the ticket):**
- 📷 Сохранить как PNG (canvas → blob → download)
- 📄 Скачать PDF (jsPDF, single-page A6 portrait)
- 📋 Скопировать код (copy to clipboard with haptic)
- 📤 Поделиться в Telegram (Telegram.WebApp.openTelegramLink)

**Ticket Security features (displayed on ticket):**
- Unique 12-char alphanumeric code (server-generated, stored in DB)
- QR code encoding the ticket code + verification URL
- Holographic shimmer CSS animation on the ticket border
- SHA-256 hash displayed (first 8 chars) for fraud-proof reference

**Ticket saved to user's Vault** (existing VaultTab, redesigned as Wallet):
- Shows all purchased tickets with status: ✅ Active | 🕐 Used | ❌ Expired
- Tickets sorted by expiry (soonest first)
- Swipe-to-expand shows full ticket details

### 2.3 — Post-Purchase Support (Critical Feature)

Add a **Помощь с талоном** section, shown automatically 10 minutes after purchase (push-style in-app notification) AND accessible from every ticket in the Vault:

**"Талон не работает на АЗС?" Interactive Troubleshooter:**

```
⚠️ Проблема на АЗС?

Выберите ситуацию:
[Оператор говорит: "код недействителен"]
[АЗС не принимает этот вид талонов]
[Ошибка на терминале]
[Другая проблема]
```

Each path shows a decision tree with next steps (in Russian), including:

1. **"Код недействителен"** → 
   - Попросить оператора ввести код вручную в систему
   - Проверить: какая именно сеть АЗС (совпадает ли с указанной на талоне?)
   - Уточнить срок действия (не истёк ли он?)
   - → Кнопка "Связаться с поддержкой" (открывает Telegram-чат с поддержкой)

2. **"АЗС не принимает этот вид"** →
   - Показать список АЗС данной сети в ближайшем радиусе (from map data)
   - Объяснить: талон привязан к конкретной сети (не универсальный)
   - → Кнопка "Найти ближайшую подходящую АЗС"

3. **"Ошибка на терминале"** →
   - Попросить оператора перезапустить терминал и попробовать снова
   - Если не помогло: сфотографировать экран ошибки
   - → Кнопка "Отправить фото ошибки в поддержку"

4. **Общее объяснение (always shown at bottom):**
   > Важно: Топливные талоны выпускает сама сеть АЗС или оператор, а не государственные структуры. Каждый талон имеет уникальный код в базе данных эмитента. При отказе обращайтесь именно к нам — мы свяжемся с эмитентом напрямую.

**Emergency Contact button** (Telegram DM link to support account) — always visible at bottom of troubleshooter.

---

## PHASE 3 — INTERACTIVE MAP (MAJOR UPGRADE)

### 3.1 — Station Data Fixes & Expansion

**Fix geographic errors:**
- Audit all 236 stations. Any station whose coordinates fall in water bodies (Black Sea, Azov Sea, Kerch Strait, rivers) must be moved to the nearest road. Run validation:
  ```python
  # In seed_stations.py, add coordinate validator
  def validate_on_land(lat, lon) -> bool:
      # Check against simplified Russia land bounding boxes
      # Reject if in known water coordinates:
      # Black Sea: roughly lat 41-47, lon 28-41 (water areas)
      # Azov Sea: lat 45-47.5, lon 34-39
  ```
- Add 80+ additional stations across crisis-affected regions:
  - Краснодарский край: +25 stations (Краснодар, Новороссийск, Сочи, Анапа, Тимашевск)
  - Крым: +20 stations (Симферополь, Ялта, Феодосия, Евпатория, Керчь)
  - Ростовская обл: +15 stations (Ростов-на-Дону, Таганрог, Шахты)
  - Ставропольский край: +10 stations
  - Волгоградская обл: +10 stations

### 3.2 — Map UI Overhaul

**Station markers (SVG):**
- Each franchise gets its own colored marker using brand colors:
  - Роснефть: #E31A2F (red)
  - Лукойл: #F26522 (orange)
  - Газпромнефть: #005BAA (blue)
  - Башнефть: #009A3D (green)
  - Other/Independent: #A78BFA (violet)
- Marker color indicates crisis status:
  - GREEN dot = available (queue < 30 min)
  - AMBER dot = limited (queue 30–90 min)
  - RED dot = critical (queue > 90 min or almost sold out)
  - BLACK X = no fuel / closed
- Markers pulse when in CRITICAL or BLACKOUT state

**Station popup (glass card):**
```
┌─────────────────────────────┐
│ [LOGO] ЛУКОЙЛ  •  АЗС #47  │
│ 📍 ул. Победы, 12, Краснодар│
│ ────────────────────────────│
│ АИ-92: 🔴 Нет               │
│ АИ-95: 🟡 Мало (очередь ~1ч)│
│ ДТ:    🟢 Есть              │
│ ────────────────────────────│
│ 🚗 Очередь: ~45 мин         │
│ 👥 Сообщений: 12 за час     │
│ Обновлено: 14:22            │
│ ────────────────────────────│
│ [🎫 Купить талон] [📍 Маршрут]│
└─────────────────────────────┘
```

**Map controls:**
- Floating glass filter chip row: АИ-92 | АИ-95 | АИ-98 | ДТ | Газ
- Active filter highlights only relevant stations
- "Найти рядом со мной" button (Telegram geolocation)
- Crisis heatmap layer toggle (red/amber overlay showing crisis intensity by region)

### 3.3 — Crowd-Sourced Queue Reporting

Add user reporting system:
- On any station popup, a "Сообщить о ситуации" button
- Options: ✅ Топливо есть | 🟡 Мало | 🔴 Нет | 🚗 Очередь [N] мин
- Reports aggregate (last 3h weighted average, exponential decay)
- Badge shows how many reports in last hour
- Gamification: +5 XP for each verified report

---

## PHASE 4 — AI ASSISTANT ("ИИ-Советник") TAB

This is a new, dedicated tab. It is a conversational AI powered by calling an LLM API (implement as a call to `https://api.anthropic.com/v1/messages` or OpenAI, whichever API key is available in Replit Secrets as `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`).

### 4.1 — Bot UI

**Design:** Full-screen chat interface with glass bubbles:
- User messages: right-aligned, violet gradient bubble
- Bot messages: left-aligned, glass panel with fuel-amber icon
- Bot "thinking" animation: three pulsing fuel drops
- Sticky quick-action chips at bottom:
  `[📍 Найти рядом] [⛽ Выбрать тип топлива] [💰 Мой бюджет] [📊 Прогноз]`

### 4.2 — Bot Conversation Flow

**Startup message:**
```
🤖 Добро пожаловать! Я — ИИ-советник по топливным талонам.
Я помогу вам найти лучший вариант с учётом текущего кризиса 
и вашего местоположения.

Разрешите определить ваше местоположение?
[✅ Да, разрешить] [✏️ Введу город вручную]
```

**If geolocation granted:**
- Bot receives lat/lon from `Telegram.WebApp.requestLocation()`
- Queries backend for nearest stations within 50km radius
- Queries crisis data for that region
- Responds with personalized recommendation:
```
📍 Вы в Краснодаре.
⚠️ Ситуация в регионе: КРИТИЧЕСКАЯ (уровень 4/5)

Рекомендую срочно купить:
🎫 Талон Лукойл 20л АИ-95 — 3 шт доступно (АЗС в 1.2 км от вас)
🎫 Талон Роснефть 10л ДТ — 7 шт доступно (АЗС в 3.4 км)

⚡ Прогноз: к концу недели дефицит усилится на 30–40%.
Советую взять запас на 2 недели.
[🎫 Купить сейчас] [📊 Подробный прогноз] [🗺️ Показать на карте]
```

**If geolocation denied → Ask for station company:**
```
Хорошо! Напишите название сети АЗС 
или ваш город, и я подберу варианты.
```
- Input has fuzzy matching (same Fuse.js used in catalog)
- "Вы имели в виду: **Лукойл**?" confirmation bubble

**Fuel type selection:**
- Quick-reply chips: АИ-92 | АИ-95 | АИ-98 | ДТ (Дизель) | Пропан/Метан
- Bot asks if user has a preference or needs a recommendation

**Crisis Prognosis module (backend):**
Add `GET /api/ai/crisis-forecast?region=...&fuel_type=...` endpoint:
- Returns a struct: `{ severity: 1-5, trend: 'worsening'|'stable'|'improving', days_until_critical: int, recommended_volume_liters: int }`
- AI bot uses this to formulate advice

**AI system prompt (backend, sent with every conversation):**
```python
SYSTEM_PROMPT = """
Ты — ИИ-советник Топливного Узла, специализированного маркетплейса 
цифровых топливных талонов в России во время топливного кризиса.

Текущее состояние кризиса: {crisis_data}
Доступные талоны в регионе пользователя: {available_tickets}
Местоположение пользователя: {user_location}

Твои задачи:
1. Рекомендовать конкретные талоны исходя из типа топлива, бюджета, локации
2. Давать прогноз ситуации в регионе пользователя
3. Отвечать кратко, по-русски, используя эмодзи для наглядности
4. При каждой рекомендации указывать расстояние до АЗС и наличие
5. НИКОГДА не придумывать данные — только использовать предоставленные

Стиль: дружелюбный, конкретный, антикризисный.
"""
```

### 4.3 — Smart Suggestions (Proactive)

When user opens the app (App.tsx onMount), if their last purchase was > 7 days ago, show a dismissible glass banner:
```
💡 ИИ-подсказка: В вашем регионе ситуация ухудшилась.
   Запасы на АЗС снизились на 35% за неделю.
   [Посмотреть талоны] [×]
```

---

## PHASE 5 — NEWS FEED ("Новости") TAB

### 5.1 — News Feed UI

Dedicated tab with a vertical scrollable feed of glassmorphic news cards.

**News card layout:**
```
┌───────────────────────────────────────┐
│ 🔴 КРИТИЧНО          15 июня, 14:22  │
│ ────────────────────────────────────  │
│ Краснодарский край: дефицит АИ-95     │
│ достиг 70% на АЗС сети Лукойл        │
│                                       │
│ Очереди достигают 3-4 часов. Талоны  │
│ данного типа заканчиваются быстро.   │
│                                       │
│ [⛽ Доступные талоны] [🗺️ Карта]     │
└───────────────────────────────────────┘
```

**News severity badges:**
- 🔴 КРИТИЧНО — station closures, 0 fuel
- 🟠 ПРЕДУПРЕЖДЕНИЕ — significant shortages
- 🟡 СЛЕДИМ — developing situation
- 🟢 УЛУЧШЕНИЕ — supply restoration
- ⚫ АНАЛИТИКА — price/logistics analysis

### 5.2 — Backend News Engine

Add `news` table to DB:
```python
class NewsItem(Base):
    __tablename__ = "news"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    body: Mapped[str]
    severity: Mapped[str]  # critical/warning/watch/improving/analysis
    region: Mapped[str | None]
    station_network: Mapped[str | None]  # e.g. "Лукойл"
    fuel_type: Mapped[str | None]
    published_at: Mapped[datetime]
    affects_ticket_availability: Mapped[bool] = mapped_column(default=False)
    crisis_delta: Mapped[float] = mapped_column(default=0.0)  # how much to change supply factor
```

**Seed 30 realistic news items** covering the current crisis narrative:
- Перебои поставок в Краснодарском крае (CRITICAL)
- Ростов-на-Дону: ограничение продажи ДТ до 50л (WARNING)
- Правительство анонсировало экстренные поставки (IMPROVING)
- Лукойл временно приостановил продажу АИ-98 (WARNING)
- etc.

**News ↔ Availability link:** When news item has `affects_ticket_availability=True`, the APScheduler job reads `crisis_delta` and adjusts supply factors for matching stations.

### 5.3 — Crisis Status Banner (Global, Persistent)

At the very top of the app (below Telegram status bar, above content), show a thin collapsible banner:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 КРИЗИСНЫЙ РЕЖИМ | Уровень 4/5  
   Краснодарский край · Крым · Ростов   [×]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
- Color matches severity: red/amber/yellow/green
- Tap to expand shows brief summary + link to News tab
- Persists across all tabs

---

## PHASE 6 — EMPIRE BUILDING GAME ("Нефтяная Империя")

### DESIGN INSPIRATION: IMPERIAL SETTLERS

The attached reference images show the Imperial Settlers board game: rich isometric art, detailed building cards with resource costs, iconographic economy, and strategic depth. Match this quality.

**Game concept:** Player builds a fuel distribution empire from scratch during the crisis, managing refineries, pipelines, tanker fleets, and black-market connections. Full idle/strategy hybrid.

### 6.1 — Canvas Architecture

Use a dedicated `<canvas>` element (1:1 with viewport, pixel ratio adjusted) via React ref:
```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);
useEffect(() => {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);
  startGameLoop(ctx);
}, []);
```

### 6.2 — Isometric Rendering (Canvas)

Implement an isometric grid renderer:
- 20×20 tile grid, 64×32px tile size (isometric diamond)
- Camera pan (touch drag) + pinch zoom
- Coordinate system: screen (sx, sy) ↔ isometric (ix, iy) transforms
- Tiles: 🌾 Empty land | 🛣️ Road | 🌲 Forest | 🏗️ Under construction | Placed buildings

**Tile rendering order:** back-to-front (painter's algorithm) for correct z-ordering.

### 6.3 — Building System (Cards → Placed on Grid)

**Resource types** (displayed as pixel-art icons):
- 🛢️ Crude Oil (Нефть-сырец)
- ⚗️ Refined Fuel (Топливо)
- ⚡ Energy (Электроэнергия)
- 💰 Rubles (Рубли)
- 👷 Workers (Рабочие)
- 🔧 Parts (Запчасти)
- 🌐 Connections (Связи/блат)

**Buildings (each rendered as an isometric sprite drawn with Canvas 2D API using geometric shapes + gradients):**

| Building | Cost | Produces | Special |
|----------|------|----------|---------|
| Нефтяная скважина | 500₽ + 2👷 | 3🛢️/мин | Depletes after 72h |
| Мини-НПЗ | 2000₽ + 5🛢️ + 3👷 | 2⚗️/мин | Needs 1⚡ |
| АЗС (своя) | 3000₽ + 10⚗️ | 150₽/мин | Sells to crisis market |
| Генератор | 800₽ + 2🔧 | 2⚡/мин | — |
| Общежитие | 600₽ | +5👷 cap | — |
| Склад | 1200₽ | +500 storage | — |
| Чёрный рынок | 5000₽ + 3🌐 | 5x price mult | Risky |
| Трубопровод | 400₽/tile | Connects | Free transport |
| Штаб | free (start) | UI hub | — |
| Завод запчастей | 1500₽ + 2👷 | 2🔧/мин | — |

**Building card design** (shown in a scrollable card row at bottom, exactly like Imperial Settlers):
- Glass card with isometric building preview rendered on mini-canvas
- Top left: BUILD COST (resource icons + amounts)  
- Top right: RAZE VALUE (what you get back if demolished)
- Center: Animated isometric building preview (drawn geometrically)
- Bottom yellow banner: Building name in Cyrillic
- Below name: Feature description ("Каждые 10 мин даёт +1 Связи")
- Blue footer strip: Production rate icons

### 6.4 — Game Economy & Progression

**Production loop:** Every game second (60fps, accumulated delta time):
- Each placed building adds resources to stockpile at its rate
- Buildings can be upgraded (3 tiers, each doubles output, costs 3× build price)
- Resources decay if stockpile > capacity (spoilage mechanic)

**Crisis Events** (random events every 15–60 real minutes, shown as news-style modal):
- "Внеплановая проверка" — freeze 1 random building for 10 min
- "Удачная партия запчастей" — free +20 🔧
- "Коррупционный скандал" — lose 500₽ or 1🌐
- "Топливный дефицит усиливается" — AZS revenue doubles for 30 min
- "Рейд" — Black Market building disabled for 2h (if built)

**XP & Levels:** Building, upgrading, surviving events all give XP. Level-up unlocks new buildings.

**Real-world tie-in:** Player's game empire resources earn discount codes usable in the real Marketplace:
- Level 5 empire: -5% on next ticket purchase
- Level 10: -10% + priority access to limited tickets

### 6.5 — Game Controls (Mobile-First)

- Drag: pan camera
- Pinch: zoom in/out  
- Tap on empty tile: show build menu (slide-up glass sheet)
- Tap on building: show building info + upgrade/demolish options
- Long-press: select for multi-action
- Resource bar: fixed at top of game screen (horizontal scrollable)
- Building cards: fixed at bottom, horizontal scroll
- ⏸ Pause / ▶ Play button, top-right
- Auto-save every 60 seconds to backend (`POST /api/game/save`)

---

## PHASE 7 — OTHER MINI-GAMES (IMPROVED)

### 7.1 — Fuel Rush (Canvas Arcade Game)

A top-down 2D driving game (Canvas 2D API):
- Player drives a fuel tanker through crisis-stricken streets
- Objective: Collect fuel canisters ⛽, avoid police checkpoints 🚔 and angry crowds 👥
- Canvas-drawn map with isometric-tilt perspective
- Touch controls: left/right arrow buttons fixed on screen, auto-drive forward
- Collectibles: fuel drops (score), rubles (bonus), wrench (speed boost)
- Obstacles: police car (game over if caught), pothole (slow)
- High score saved to backend, displayed on a shared leaderboard (top 10)
- Game loop: requestAnimationFrame, delta-time physics

### 7.2 — Fuel Price Trader (Mini-Game)

A simplified trading game:
- Candlestick chart (Canvas drawn) showing fictional fuel prices fluctuating
- Player has 1000 virtual rubles to buy/sell fuel futures
- Price moves based on crisis news events (if "critical" news fires, price spikes)
- Round lasts 60 seconds
- Best profit earns "Трейдер недели" badge + 50 XP

### 7.3 — Queue Simulator (Idle Click Game)

- Tap the fuel pump to serve customers in queue
- Each customer wants a specific fuel type (shown as emoji bubble)
- If you have the right ticket in your wallet → tap to serve → +10 coins
- Queue builds up if you're slow → stress meter fills
- Encourages users to actually buy real tickets to "use" in game

---

## PHASE 8 — PAYMENT FLOW (CRYPTOBOT + TELEGRAM PAYMENTS)

### 8.1 — Payment Method Selection Screen

Full-screen slide-up sheet (from bottom, spring animation) when user taps "Купить":

```
╔══════════════════════════════════════╗
║  💳 Выберите способ оплаты           ║
║  Сумма: 480 USDT (≈ 47,200 ₽)      ║
╠══════════════════════════════════════╣
║                                      ║
║  ┌────────────────────────────────┐  ║
║  │ 🤖 CryptoBot (USDT/TON/BTC)   │  ║
║  │   Моментально · Анонимно       │  ║
║  │   Рекомендуется ✅             │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  ┌────────────────────────────────┐  ║
║  │ 💳 Telegram Payments           │  ║
║  │   Карта РФ, СБП, ЮMoney        │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  ──── Первый раз с криптой? ────    ║
║  ┌────────────────────────────────┐  ║
║  │ ❓ Как купить USDT за рубли?   │  ║
║  └────────────────────────────────┘  ║
╚══════════════════════════════════════╝
```

### 8.2 — CryptoBot Integration

Backend (`tma_backend/payment.py`), replace MockPaymentProvider:
```python
class CryptoBotPaymentProvider:
    """
    Calls CryptoBot API: https://t.me/CryptoBot
    API base: https://pay.crypt.bot/api
    Requires CRYPTO_BOT_TOKEN in Replit Secrets
    """
    async def create_invoice(self, amount_usdt: float, ticket_id: int, user_id: int) -> str:
        """Returns invoice URL to open in Telegram"""
        ...
    
    async def check_payment(self, invoice_id: str) -> bool:
        """Returns True if paid"""
        ...
    
    async def webhook_handler(self, payload: dict) -> None:
        """Called by CryptoBot webhook on payment"""
        ...
```

- Supported currencies: USDT, TON, BTC, ETH (let user choose)
- After creating invoice: `Telegram.WebApp.openTelegramLink(invoice_url)`
- Poll `check_payment` every 3 seconds (frontend), show animated "Ожидаем оплату..." glass spinner
- On success: confetti animation + ticket delivery

### 8.3 — "Как купить USDT за рубли?" Onboarding (Critical UX)

Show this as a modal info sheet when user taps the ❓ button:

```
💡 Это проще, чем кажется!

CryptoBot — это официальный сервис внутри Telegram.
Он работает как обычный кошелёк, но без банка.

КАК ПОПОЛНИТЬ ЧЕРЕЗ P2P (рубли → USDT):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Откройте @CryptoBot в Telegram
2️⃣ Нажмите "Купить" → выберите USDT
3️⃣ Выберите P2P-продавца с 🟢 значком
4️⃣ Переведите рубли на его карту 
   (Сбербанк, Т-Банк, СБП — любой банк РФ)
5️⃣ Продавец пришлёт USDT автоматически
   
✅ Ваши деньги защищены — USDT блокируется
   на эскроу до подтверждения перевода.
   
⏱ Занимает: 3–10 минут
💬 Поддержка: @CryptoBot
```

With button: `[Открыть @CryptoBot]` → `tg://resolve?domain=CryptoBot`

### 8.4 — Telegram Payments Integration

Use `python-telegram-bot` Invoice sending:
```python
await bot.send_invoice(
    chat_id=user_id,
    title="Топливный талон",
    description=f"Талон {ticket.network} {ticket.volume}л {ticket.fuel_type}",
    payload=f"ticket_{ticket.id}",
    provider_token=PAYMENT_PROVIDER_TOKEN,  # Replit Secret
    currency="RUB",
    prices=[LabeledPrice("Талон", ticket.price_rub * 100)],
    ...
)
```

---

## PHASE 9 — ADMIN MODE

### 9.1 — Hidden Admin Entry Point

At the very bottom of the main page (below all content, after games section), add a tiny subtle link:
```
· · ·
```
(Three centered dots, 12px, `var(--text-tertiary)` color — barely visible but tappable)

Tap opens a glass modal:
```
╔══════════════════════════════════╗
║  🔐 Системный доступ             ║
║  Введите пароль администратора:  ║
║  ┌──────────────────────────────┐║
║  │ ••••••••••••                 ││
║  └──────────────────────────────┘║
║         [Войти]  [Отмена]        ║
╚══════════════════════════════════╝
```

### 9.2 — Admin Authentication

Backend (`tma_backend/admin.py`):
```python
def verify_admin(telegram_id: int, password: str) -> bool:
    admin_id = int(os.getenv("ADMIN_TELEGRAM_ID", "0"))
    admin_pass = os.getenv("ADMIN_PASSWORD", "")
    return telegram_id == admin_id and password == admin_pass
```

Replit Secrets required:
- `ADMIN_TELEGRAM_ID` — the owner's Telegram numeric ID
- `ADMIN_PASSWORD` — chosen admin password

Session token (JWT or signed cookie) issued on successful auth, expires in 24h.

### 9.3 — Admin Dashboard

After login, opens a full-screen admin panel:

**Tabs within Admin:**
1. **Талоны (Free Access)** — admin gets all tickets for free (bypass payment)
2. **Управление запасами** — manually set availability for any station + fuel type
3. **Новости** — CRUD for news items (create/edit/delete crisis news)
4. **Пользователи** — list of all users, purchase history, ticket status
5. **АЗС** — add/edit/delete gas stations, fix coordinates, update status
6. **Статистика** — sales charts, active users, revenue (recharts bar/line charts)
7. **Кризис-уровень** — slider to set global crisis level (1–5), affects all supply factors
8. **Игры** — view leaderboards, reset scores

**Admin badge:** While in admin mode, a small red "ADMIN" badge appears in top-right corner of every tab (persists until logout).

---

## PHASE 10 — GAS STATION LOGOS & BRANDING

For each major franchise, draw a vector logo using inline SVG or Canvas:

```typescript
const STATION_LOGOS: Record<string, React.FC<{size: number}>> = {
  'Роснефть': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {/* Red circle with white R/H mark */}
      <circle cx="20" cy="20" r="20" fill="#E31A2F"/>
      <text x="20" y="27" textAnchor="middle" fill="white" 
            fontSize="18" fontWeight="bold" fontFamily="Arial">Р</text>
    </svg>
  ),
  'Лукойл': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill="#F26522"/>
      <text x="20" y="27" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial">LUKOIL</text>
    </svg>
  ),
  // ... etc for all networks
};
```

**Brand colors for all networks:**
- Роснефть: #E31A2F
- Лукойл: #F26522 / #004B9A
- Газпром нефть: #005BAA
- Башнефть: #009A3D
- Татнефть: #003087
- ТНК: #CC0000
- Сургутнефтегаз: #6B3FA0
- НСТ/Независимые: #64748B

Logos appear:
- On ticket cards in Catalog
- In station popups on Map
- On purchased ticket digital artifact
- In AI Bot recommendations

---

## PHASE 11 — AUTO-COMPLETE SEARCH (GLOBAL)

Install or implement fuzzy search. Use `fuse.js` (already in npm ecosystem):

```typescript
import Fuse from 'fuse.js';

const stationFuse = new Fuse(stations, {
  keys: ['name', 'network', 'region', 'city', 'address'],
  threshold: 0.35,
  includeScore: true,
});

// In every search input across the app:
const SearchInput = ({ placeholder, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const handleInput = (e) => {
    setQuery(e.target.value);
    const results = stationFuse.search(e.target.value).slice(0, 6);
    setSuggestions(results.map(r => r.item));
  };
  
  return (
    <div className="relative">
      <input value={query} onChange={handleInput} placeholder={placeholder}
             className="glass-panel w-full px-4 py-3 text-white" />
      {suggestions.length > 0 && (
        <div className="glass-panel absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto">
          {suggestions.map(s => (
            <div key={s.id} className="px-4 py-2 hover:bg-glass-hover cursor-pointer"
                 onClick={() => { onSelect(s); setSuggestions([]); }}>
              <StationLogo network={s.network} size={20} />
              <span>{s.name}</span>
              <span className="text-secondary text-sm">{s.city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

Apply to: Catalog filter, Map search, AI Bot input, Troubleshooter station selector.

---

## PHASE 12 — VAULT / WALLET TAB (REDESIGN)

Rename "Vault" → "Кошелёк" (Wallet). Complete redesign:

**Header section (glass card, full width):**
```
┌─────────────────────────────────────┐
│  👤 Иван К.  •  Уровень 7 🔥       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🎫 Активных талонов: 3             │
│  💰 Потрачено: 1,440 USDT          │
│  ⛽ Литров обеспечено: 120л        │
└─────────────────────────────────────┘
```

**Ticket list:** Each active ticket shown as a mini version of the full ticket card, with status badge.

**"Мои скидки" section:** Shows earned game discounts, referral bonuses.

**Export all tickets:** One button to download all active tickets as a PDF booklet.

---

## PHASE 13 — PERFORMANCE & MOBILE OPTIMIZATION

- All heavy components use `React.lazy()` + `Suspense`
- Map tiles lazy-loaded based on viewport
- Canvas games use `requestAnimationFrame` with frame-skip for 60fps target
- Touch targets minimum 44×44px
- Keyboard avoidance for iOS (Telegram WebApp.expand() + scroll into view)
- Pull-to-refresh on News and Catalog tabs
- Offline fallback: if network unavailable, show cached station data with "данные могут быть устаревшими" banner
- Image assets: use SVG or Canvas-drawn elements everywhere to avoid loading images
- APScheduler jobs: restock (6h), crisis-update (1h), user XP recalculation (daily), news auto-post (every 4h with varied content from a template pool)

---

## PHASE 14 — REPLIT SECRETS REQUIRED

Ensure all of these are documented and referenced in code:
```
TELEGRAM_BOT_TOKEN         — python-telegram-bot
CRYPTO_BOT_TOKEN           — CryptoBot payment API
TELEGRAM_PAYMENT_TOKEN     — Telegram Payments provider
ANTHROPIC_API_KEY          — Claude API for AI Assistant (or OPENAI_API_KEY)
ADMIN_TELEGRAM_ID          — owner's numeric Telegram user ID
ADMIN_PASSWORD             — admin panel password
TMA_PORT                   — 8000 (default)
```

---

## PHASE 15 — ADDITIONAL IMPROVEMENTS (BONUS)

### 15.1 — Referral System
- Each user gets a unique referral link: `t.me/fuel_bot?start=ref_XXXXX`
- Referred user's first purchase: referrer gets +10% bonus (as XP or discount)
- Referral count shown in Wallet tab

### 15.2 — Price History Charts
- In each ticket card, small sparkline chart (recharts) showing price over last 7 days
- "Сейчас ниже среднего на 8%" badge if applicable

### 15.3 — Fuel Alert Subscriptions
- User can subscribe to alerts for a specific station + fuel type
- When tickets become available: bot sends Telegram message
- "🔔 Уведомить когда появится" toggle on each sold-out ticket

### 15.4 — Crisis Timeline (History)
- In News tab, add a "Хронология кризиса" section
- Timeline of crisis escalation milestones (static data based on real events + dynamic new entries)
- Visual: vertical timeline with severity color bars

### 15.5 — Dark/Light mode toggle
- Since Liquid Glass works in both modes:
- Light mode: white frosted glass panels on light gray background
- Detect from Telegram.WebApp.colorScheme, allow manual override

### 15.6 — Share Functionality
- "Поделиться ситуацией" on any news item → generates a formatted Telegram message with crisis summary
- "Пригласить друга" button in Wallet tab

### 15.7 — Accessibility
- All interactive elements have aria-labels in Russian
- Minimum contrast ratios maintained (WCAG AA)
- Font size minimum 14px body, 16px for input fields

---

## IMPLEMENTATION ORDER FOR REPLIT AI

Work through phases in this order (each must be complete before moving to next):

1. **Phase 0** — CSS design system (foundation for everything)
2. **Phase 1** — Bottom nav (structure)
3. **Phase 9** — Admin mode (needed for testing other features)
4. **Phase 2.1** — Catalog tab with fuzzy search + dynamic supply engine
5. **Phase 2.2** — Digital ticket visual + exports
6. **Phase 2.3** — Troubleshooter / post-purchase support
7. **Phase 3** — Map overhaul + fix coordinates + expand stations
8. **Phase 5** — News feed + crisis engine
9. **Phase 4** — AI Assistant tab
10. **Phase 8** — Payment flows (CryptoBot + Telegram)
11. **Phase 10** — Station logos
12. **Phase 12** — Wallet tab redesign
13. **Phase 6** — Empire building game (Canvas)
14. **Phase 7** — Other mini-games (Canvas)
15. **Phase 13** — Performance pass
16. **Phase 15** — Bonus features (implement as many as possible)

---

## FINAL CHECKLIST

Before marking complete, verify:
- [ ] Every page uses Liquid Glass design tokens
- [ ] Framer Motion transitions on all mounting components
- [ ] Fuzzy search in every relevant input
- [ ] Digital ticket can be exported as PNG and PDF
- [ ] Troubleshooter decision tree works end-to-end
- [ ] Map has no stations in water bodies
- [ ] AI bot asks for location, falls back to text input
- [ ] CryptoBot invoice creation works
- [ ] "How to buy USDT" explainer shown to crypto newcomers
- [ ] Admin panel accessible only via correct Telegram ID + password
- [ ] Empire game runs at 60fps on canvas with isometric rendering
- [ ] News feed connected to availability supply engine
- [ ] At least 300 total gas stations in DB (from 236 + additions)
- [ ] All station franchises have branded logos
- [ ] Game discounts apply to real marketplace purchases
- [ ] All text UI is in Russian
- [ ] Mobile touch targets ≥ 44px
- [ ] Replit Secrets referenced but never hardcoded

---

*Промпт подготовлен для полного overhaul-а Топливного Узла.*  
*Проект: fuel-tickets-ru | Replit: @samarkandfolia*
