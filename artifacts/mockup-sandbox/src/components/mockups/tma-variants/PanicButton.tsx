import { useState } from "react";

const DOMAIN = "#050507";
const VIOLET = "#a855f7";
const MAGENTA = "#db2777";

export function PanicButton() {
  const [expanded, setExpanded] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState("АИ-92");

  const INDEX = 61;
  const RING_COLOR = INDEX >= 60 ? "#22c55e" : INDEX >= 25 ? "#eab308" : "#ef4444";
  const STATUS_LABEL = INDEX >= 60 ? "ТОПЛИВО ЕСТЬ" : INDEX >= 25 ? "ОСТОРОЖНО" : "ДЕФИЦИТ";

  const NEARBY = [
    { name: "Лукойл Северная",    dist: "1.2 км", avail: 78, fuels: ["АИ-92","АИ-95","ДТ"] },
    { name: "Роснефть Нахимов",   dist: "2.1 км", avail: 34, fuels: ["АИ-92","ДТ"] },
    { name: "Газпром Балаклава",  dist: "3.5 км", avail: 91, fuels: ["АИ-92","АИ-95","ДТ","Газ"] },
    { name: "Независимая №7",     dist: "4.0 км", avail: 8,  fuels: ["ДТ"] },
  ];

  const filtered = NEARBY.filter(s => s.fuels.includes(selectedFuel));
  const best = filtered.sort((a,b) => b.avail - a.avail)[0];

  return (
    <div style={{ width: "390px", height: "844px", background: DOMAIN, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>

      {/* Scan lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(168,85,247,0.012) 3px,rgba(168,85,247,0.012) 4px)", pointerEvents: "none", zIndex: 50 }} />

      {/* Top label */}
      <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.5rem", letterSpacing: "0.2em" }}>ТОПЛИВНЫЙ_УЗЕЛ · МАТРИЦА</div>
        <div style={{ color: "#4b5563", fontSize: "0.72rem", marginTop: "0.2rem" }}>Севастополь · Крым</div>
      </div>

      {/* Giant availability orb */}
      <div style={{ marginTop: "2rem", position: "relative" }}>
        <div style={{
          width: "200px", height: "200px", borderRadius: "50%",
          background: `radial-gradient(circle at 38% 38%, ${RING_COLOR}18, ${RING_COLOR}06)`,
          border: `3px solid ${RING_COLOR}55`,
          boxShadow: `0 0 60px ${RING_COLOR}30, 0 0 120px ${RING_COLOR}15, inset 0 0 40px ${RING_COLOR}08`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: RING_COLOR, fontSize: "3.5rem", fontWeight: 900, lineHeight: 1, textShadow: `0 0 24px ${RING_COLOR}` }}>
            {INDEX}%
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: RING_COLOR, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", marginTop: "0.25rem", opacity: 0.8 }}>
            {STATUS_LABEL}
          </div>
        </div>

        {/* Outer pulse ring */}
        <div style={{
          position: "absolute", inset: "-12px", borderRadius: "50%",
          border: `1px solid ${RING_COLOR}25`,
        }} />
        <div style={{
          position: "absolute", inset: "-24px", borderRadius: "50%",
          border: `1px solid ${RING_COLOR}12`,
        }} />
      </div>

      {/* Status chips */}
      <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem" }}>
        {[
          { label: "🟢 Норма", count: 14, color: "#22c55e" },
          { label: "🟡 Мало", count: 6, color: "#eab308" },
          { label: "🔴 Нет", count: 3, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center", background: `${s.color}0d`, border: `1px solid ${s.color}25`, borderRadius: "10px", padding: "0.45rem 0.65rem" }}>
            <div style={{ color: s.color, fontSize: "0.85rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{s.count}</div>
            <div style={{ color: "#6b7280", fontSize: "0.6rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fuel type selector */}
      <div style={{ display: "flex", gap: "0.4rem", marginTop: "1.5rem" }}>
        {["АИ-92","АИ-95","ДТ","Газ"].map(f => (
          <button key={f} onClick={() => setSelectedFuel(f)}
            style={{
              background: selectedFuel === f ? `${VIOLET}20` : "#0b0b0f",
              border: `1px solid ${selectedFuel === f ? VIOLET + "55" : "#22222f"}`,
              borderRadius: "10px", padding: "0.4rem 0.7rem",
              color: selectedFuel === f ? VIOLET : "#4b5563",
              fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Main CTA */}
      <div style={{ marginTop: "1.5rem", padding: "0 1.5rem", width: "100%", boxSizing: "border-box" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%", borderRadius: "16px", padding: "1.1rem",
            background: `linear-gradient(135deg, ${VIOLET}, ${MAGENTA})`,
            border: "none", color: "#fff", fontSize: "1.05rem", fontWeight: 800, cursor: "pointer",
            boxShadow: `0 0 32px ${VIOLET}45, 0 8px 24px rgba(0,0,0,0.5)`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
          }}>
          ⛽ Найти топливо рядом
          <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{expanded ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Nearest station reveal */}
      {expanded && (
        <div style={{ marginTop: "0.75rem", padding: "0 1rem", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {NEARBY.filter(s => s.fuels.includes(selectedFuel)).map(s => {
            const c = s.avail >= 60 ? "#22c55e" : s.avail >= 25 ? "#eab308" : "#ef4444";
            return (
              <div key={s.name} style={{ background: "#0d0d18", border: `1px solid ${c}25`, borderRadius: "12px", padding: "0.6rem 0.9rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: "0.75rem", fontWeight: 700 }}>{s.name}</div>
                  <div style={{ color: "#4b5563", fontSize: "0.6rem", marginTop: "2px" }}>📍 {s.dist}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: c, fontFamily: "'JetBrains Mono',monospace", fontSize: "1rem", fontWeight: 800 }}>{s.avail}%</div>
                  <div style={{ color: "#374151", fontSize: "0.55rem" }}>{s.fuels.join(" · ")}</div>
                </div>
              </div>
            );
          })}
          {best && (
            <button style={{ width: "100%", background: "#0b0b0f", border: `1px solid ${VIOLET}33`, borderRadius: "12px", padding: "0.75rem", color: VIOLET, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", marginTop: "0.2rem" }}>
              🎫 Купить талон · {best.name}
            </button>
          )}
        </div>
      )}

      {/* Bottom nav hint */}
      <div style={{ position: "absolute", bottom: "1rem", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "2rem" }}>
        {["🗺", "📊", "🛒", "🏆", "⚡"].map(icon => (
          <div key={icon} style={{ color: "#22222f", fontSize: "1.2rem", cursor: "pointer" }}>{icon}</div>
        ))}
      </div>
    </div>
  );
}
