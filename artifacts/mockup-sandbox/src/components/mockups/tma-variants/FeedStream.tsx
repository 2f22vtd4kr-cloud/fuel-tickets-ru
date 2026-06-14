import { useState } from "react";

const DOMAIN = "#050507";
const VIOLET = "#a855f7";
const MAGENTA = "#db2777";

const FEED_ITEMS = [
  { id: 1, time: "08:41", sev: "critical", icon: "🚨", title: "Дефицит АИ-95 — Гагаринский", body: "Остаток < 5% · срочная эвакуация запасов", region: "Гагаринский", fuel: "АИ-95", price_delta: +8.2 },
  { id: 2, time: "08:37", sev: "warning", icon: "⚠️", title: "АЗС Лукойл №12 — мало ДТ", body: "Запасы на 18% · ожидается пополнение в 14:00", region: "Балаклавский", fuel: "ДТ", price_delta: +3.1 },
  { id: 3, time: "08:22", sev: "info", icon: "📡", title: "Пополнение АИ-92 — Нахимовский", body: "Цистерна 8 000 л прибыла · доступно сейчас", region: "Нахимовский", fuel: "АИ-92", price_delta: -1.4 },
  { id: 4, time: "08:15", sev: "success", icon: "✅", title: "Северная АЗС — норма по всем видам", body: "🟢 АИ-92 · 🟢 АИ-95 · 🟢 ДТ · 🟢 Газ", region: "Северная сторона", fuel: null, price_delta: null },
  { id: 5, time: "07:58", sev: "warning", icon: "⚠️", title: "Цены выросли — Ленинский", body: "АИ-92 +6.3% относительно вчерашнего дня", region: "Ленинский", fuel: "АИ-92", price_delta: +6.3 },
  { id: 6, time: "07:44", sev: "info", icon: "🛢", title: "Индекс наличия вырос до 61%", body: "Сеть стабилизировалась · 14 регионов в норме", region: "Все регионы", fuel: null, price_delta: null },
  { id: 7, time: "07:30", sev: "critical", icon: "🔴", title: "Очереди на АЗС Роснефть №4", body: "Краудрепорт · более 20 машин в очереди", region: "Балаклавский", fuel: "АИ-92", price_delta: null },
  { id: 8, time: "07:11", sev: "success", icon: "🎫", title: "Ваш ордер #A-2847 активен", body: "60 л АИ-92 · действует до 16:00", region: null, fuel: "АИ-92", price_delta: null },
];

const SEV: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#ef4444", bg: "#1a060620", border: "#ef444430" },
  warning:  { color: "#eab308", bg: "#1a0f0020", border: "#eab30830" },
  info:     { color: "#3b82f6", bg: "#05081a20", border: "#3b82f630" },
  success:  { color: "#22c55e", bg: "#05190e20", border: "#22c55e30" },
};

const STATIONS = [
  { name: "Лукойл №12", pct: 78, fuel: "🟢 АИ-92  🟢 АИ-95", dist: "1.2 км" },
  { name: "Роснефть №4", pct: 12, fuel: "🔴 АИ-92  🟡 ДТ", dist: "2.1 км" },
  { name: "Газпром №8", pct: 54, fuel: "🟡 АИ-92  🟢 ДТ", dist: "3.5 км" },
];

export function FeedStream() {
  const [mapOpen, setMapOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter ? FEED_ITEMS.filter(i => i.sev === filter) : FEED_ITEMS;

  return (
    <div style={{ width: "390px", height: "844px", background: DOMAIN, overflow: "hidden", fontFamily: "'Inter',sans-serif", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Scan line overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(168,85,247,0.015) 3px,rgba(168,85,247,0.015) 4px)", pointerEvents: "none", zIndex: 50 }} />

      {/* Header */}
      <div style={{ padding: "0.75rem 1rem 0.5rem", borderBottom: "1px solid #1e1e2a", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.42rem", letterSpacing: "0.16em" }}>РАЗВЕДКА_ТОПЛИВА · v3.1</div>
            <div style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 800, marginTop: "0.1rem" }}>📡 Лента событий</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#22c55e", fontSize: "0.55rem", fontFamily: "'JetBrains Mono',monospace" }}>LIVE</span>
          </div>
        </div>

        {/* Mini stat strip */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          {[
            { label: "ИНДЕКС", value: "61%", color: "#22c55e" },
            { label: "КРИТ", value: "3", color: "#ef4444" },
            { label: "АИ-92", value: "62₽", color: VIOLET },
          ].map(s => (
            <div key={s.label} style={{ background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "8px", padding: "0.25rem 0.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.38rem", letterSpacing: "0.1em" }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: "0.82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{s.value}</div>
            </div>
          ))}
          <button
            onClick={() => setMapOpen(!mapOpen)}
            style={{ marginLeft: "auto", background: mapOpen ? `${VIOLET}20` : "#0b0b0f", border: `1px solid ${mapOpen ? VIOLET + "44" : "#1e1e2a"}`, borderRadius: "8px", padding: "0.25rem 0.55rem", color: mapOpen ? VIOLET : "#6b7280", fontSize: "0.62rem", cursor: "pointer" }}
          >
            🗺 {mapOpen ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Collapsible map panel */}
      {mapOpen && (
        <div style={{ flexShrink: 0, borderBottom: "1px solid #1e1e2a", background: "#0a0a12", padding: "0.5rem 1rem" }}>
          <div style={{ background: "#141420", border: "1px solid #1e1e2a", borderRadius: "10px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            {STATIONS.map((s) => (
              <div key={s.name} style={{ textAlign: "center" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.pct >= 60 ? "#22c55e" : s.pct >= 25 ? "#eab308" : "#ef4444", margin: "0 auto 2px", boxShadow: `0 0 6px ${s.pct >= 60 ? "#22c55e" : s.pct >= 25 ? "#eab308" : "#ef4444"}` }} />
                <div style={{ color: "#9ca3af", fontSize: "0.5rem" }}>{s.dist}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: "flex", gap: "0.35rem", padding: "0.5rem 1rem", flexShrink: 0, overflowX: "auto" }}>
        {[null, "critical", "warning", "info", "success"].map((f) => {
          const labels: Record<string, string> = { critical: "⚠ Крит", warning: "⚡ Предупр", info: "📡 Инфо", success: "✅ Норма" };
          const active = filter === f;
          return (
            <button key={String(f)} onClick={() => setFilter(f === filter ? null : f)}
              style={{ background: active ? `${VIOLET}20` : "#0b0b0f", border: `1px solid ${active ? VIOLET + "44" : "#22222f"}`, borderRadius: "16px", padding: "0.25rem 0.6rem", color: active ? VIOLET : "#6b7280", fontSize: "0.62rem", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              {f === null ? "Все" : labels[f]}
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {filtered.map((item) => {
          const s = SEV[item.sev];
          return (
            <div key={item.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: "10px", padding: "0.6rem 0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>
                  <span style={{ color: "#e2e8f0", fontSize: "0.75rem", fontWeight: 700 }}>{item.title}</span>
                </div>
                <span style={{ color: "#374151", fontSize: "0.58rem", fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>{item.time}</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "0.67rem", margin: 0, lineHeight: 1.35 }}>{item.body}</p>
              {(item.region || item.price_delta != null) && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                  {item.region && <span style={{ color: "#374151", fontSize: "0.58rem" }}>📍 {item.region}</span>}
                  {item.fuel && <span style={{ color: "#374151", fontSize: "0.58rem" }}>⛽ {item.fuel}</span>}
                  {item.price_delta != null && (
                    <span style={{ color: item.price_delta > 0 ? "#ef4444" : "#22c55e", fontSize: "0.58rem", fontFamily: "'JetBrains Mono',monospace" }}>
                      {item.price_delta > 0 ? "▲" : "▼"}{Math.abs(item.price_delta)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height: "5rem" }} />
      </div>

      {/* Floating buy CTA */}
      <div style={{ position: "absolute", bottom: "1.25rem", left: "1rem", right: "1rem" }}>
        <button style={{
          width: "100%", background: `linear-gradient(135deg, ${VIOLET}, ${MAGENTA})`,
          border: "none", borderRadius: "14px", padding: "0.9rem", color: "#fff",
          fontSize: "0.92rem", fontWeight: 800, cursor: "pointer",
          boxShadow: `0 0 24px ${VIOLET}50, 0 4px 16px rgba(0,0,0,0.5)`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
        }}>
          🎫 Купить топливный талон
        </button>
      </div>
    </div>
  );
}
