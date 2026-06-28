import "./_group.css";

const STATIONS = [
  { id: 1, x: 28, y: 38, network: "lukoil", name: "Лукойл #12", status: "green" },
  { id: 2, x: 52, y: 24, network: "rosneft", name: "Роснефть #3", status: "yellow" },
  { id: 3, x: 68, y: 45, network: "gazprom", name: "Газпром #7", status: "green" },
  { id: 4, x: 42, y: 58, network: "bashneft", name: "Башнефть #1", status: "red" },
  { id: 5, x: 75, y: 30, network: "tatneft", name: "Татнефть #5", status: "yellow" },
  { id: 6, x: 20, y: 62, network: "lukoil", name: "Лукойл #8", status: "green" },
  { id: 7, x: 60, y: 70, network: "rosneft", name: "Роснефть #11", status: "green" },
  { id: 8, x: 82, y: 60, network: "gazprom", name: "Газпром #2", status: "red" },
  { id: 9, x: 35, y: 78, network: "nnk", name: "ННК #4", status: "yellow" },
];

const NETWORK_COLORS: Record<string, { glow: string; accent: string; label: string }> = {
  lukoil:   { glow: "#EF4444", accent: "#DC2626", label: "Лукойл" },
  rosneft:  { glow: "#3B82F6", accent: "#2563EB", label: "Роснефть" },
  gazprom:  { glow: "#22D3EE", accent: "#06B6D4", label: "Газпром" },
  bashneft: { glow: "#8B5CF6", accent: "#7C3AED", label: "Башнефть" },
  tatneft:  { glow: "#22C55E", accent: "#16A34A", label: "Татнефть" },
  nnk:      { glow: "#F59E0B", accent: "#D97706", label: "ННК" },
};

const STATUS_COLORS: Record<string, string> = {
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
};

const SELECTED_STATION = {
  id: 1,
  network: "lukoil",
  name: "Лукойл #12 · Севастополь",
  address: "ул. Генерала Острякова, 47",
  fuels: [
    { type: "АИ-92", price: "65.0₽/л", avail: 75, status: "green" },
    { type: "АИ-95", price: "72.5₽/л", avail: 40, status: "yellow" },
    { type: "ДТ",    price: "70.0₽/л", avail: 15, status: "red" },
  ],
  rating: 4.7,
};

export function MapTab() {
  const nc = NETWORK_COLORS[SELECTED_STATION.network];

  return (
    <div
      style={{
        width: 390,
        height: 844,
        background: "#0A0A0F",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* ── LIVE TICKER ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 30,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(168,85,247,0.2)",
        height: 28, display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        <div className="map-ticker" style={{ display: "flex", gap: 24, paddingLeft: 12, whiteSpace: "nowrap", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
          {["• LIVE 9 АЗС", "АИ-92 Сев. 65₽ -0%", "АИ-95 Сев. 72₽ -0%", "ДТ Сев. 70₽ -0%", "АИ-92 Обл. 63₽ -0%", "Газпром доступен ✓"].map((t, i) => (
            <span key={i} style={{ color: i === 0 ? "#22C55E" : undefined }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── DARK MAP (simulated) ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(180deg, #0D1117 0%, #0a0f1a 60%, #060810 100%)",
        filter: "blur(4px)",
      }}>
        {/* Road lines */}
        {[[60, 0, 60, 100], [0, 45, 100, 45], [20, 0, 75, 100], [0, 20, 100, 68]].map(([x1, y1, x2, y2], i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${y1}%`, left: `${x1}%`,
            width: i < 2 ? 1 : "120%", height: i < 2 ? "100%" : 1,
            background: "rgba(255,255,255,0.04)",
            transform: i >= 2 ? `rotate(${i === 2 ? 25 : -15}deg)` : undefined,
          }} />
        ))}
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      {/* Station markers on map */}
      {STATIONS.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${(s.y / 100) * 75 + 15}%`,
          zIndex: s.id === 1 ? 15 : 5,
          transform: "translate(-50%, -50%)",
        }}>
          <div style={{
            width: s.id === 1 ? 18 : 12,
            height: s.id === 1 ? 18 : 12,
            borderRadius: "50%",
            background: STATUS_COLORS[s.status],
            boxShadow: `0 0 ${s.id === 1 ? 16 : 8}px ${STATUS_COLORS[s.status]}`,
            border: `2px solid rgba(255,255,255,${s.id === 1 ? 0.9 : 0.4})`,
          }} />
        </div>
      ))}

      {/* Ambient network glow when modal open */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 300, height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${nc.glow}22 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 4,
      }} />

      {/* ── SEARCH BAR ── */}
      <div style={{
        position: "absolute", top: 36, left: 16, right: 16, zIndex: 20,
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span style={{ flex: 1, fontSize: 15, color: "rgba(255,255,255,0.35)" }}>Поиск АЗС...</span>
        <div style={{ display: "flex", gap: 3, flexDirection: "column" }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: i === 1 ? 14 : 18, height: 1.5, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />)}
        </div>
      </div>

      {/* Fuel type filter chips */}
      <div style={{
        position: "absolute", top: 96, left: 16, zIndex: 20,
        display: "flex", gap: 8,
      }}>
        {["Все", "АИ-92", "АИ-95", "ДТ"].map((f, i) => (
          <div key={f} style={{
            background: i === 0 ? "#A855F7" : "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${i === 0 ? "#A855F7" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20, padding: "5px 12px",
            fontSize: 12, fontWeight: 600,
            color: i === 0 ? "#fff" : "rgba(255,255,255,0.6)",
            boxShadow: i === 0 ? "0 0 12px rgba(168,85,247,0.5)" : "none",
          }}>{f}</div>
        ))}
      </div>

      {/* ── STATION DETAIL MODAL (open state) ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 25, height: 480,
        background: "rgba(12,8,22,0.92)",
        backdropFilter: "blur(40px)",
        borderTop: `1px solid ${nc.glow}44`,
        borderRadius: "24px 24px 0 0",
        boxShadow: `0 -8px 60px ${nc.glow}22`,
        padding: "0 20px 20px",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 14 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Station header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${nc.glow}22`,
            border: `1px solid ${nc.glow}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>⛽</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>{SELECTED_STATION.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{SELECTED_STATION.address}</div>
            <div style={{ marginTop: 5, display: "flex", gap: 6 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px",
                borderRadius: 6, background: `${nc.glow}22`,
                border: `1px solid ${nc.glow}44`, color: nc.glow,
                boxShadow: `0 0 8px ${nc.glow}33`,
              }}>{nc.label}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>★ {SELECTED_STATION.rating}</span>
            </div>
          </div>
          <div style={{ fontSize: 22, opacity: 0.6 }}>×</div>
        </div>

        {/* Fuel availability bars */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, padding: "12px 14px", marginBottom: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Доступность топлива
          </div>
          {SELECTED_STATION.fuels.map(f => (
            <div key={f.type} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, width: 44 }}>{f.type}</span>
              <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                <div style={{
                  width: `${f.avail}%`, height: "100%", borderRadius: 3,
                  background: STATUS_COLORS[f.status],
                  boxShadow: `0 0 6px ${STATUS_COLORS[f.status]}`,
                }} />
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", width: 56, textAlign: "right" }}>{f.price}</span>
            </div>
          ))}
        </div>

        {/* Crowd report buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["✅ Есть", "⚠️ Мало", "❌ Нет"].map((label, i) => (
            <button key={i} style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        {/* CTA Button */}
        <button style={{
          width: "100%", padding: "15px 0", borderRadius: 16, border: "none",
          background: `linear-gradient(135deg, #A855F7, #7C3AED)`,
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 24px rgba(168,85,247,0.5)",
          letterSpacing: 0.2,
        }}>
          Купить талон ⛽
        </button>

        {/* Bottom nav */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 72,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
        }}>
          {[
            { icon: "🗺", label: "Карта", active: true },
            { icon: "🎟", label: "Талоны", active: false },
            { icon: "⚡", label: "ИИ", active: false },
            { icon: "🎮", label: "Игры", active: false },
            { icon: "💎", label: "Хранилище", active: false },
          ].map(tab => (
            <div key={tab.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 20, opacity: tab.active ? 1 : 0.45 }}>{tab.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: tab.active ? "#A855F7" : "rgba(255,255,255,0.35)",
              }}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
