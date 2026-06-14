import { useState } from "react";

const DOMAIN = "#050507";
const VIOLET = "#a855f7";
const MAGENTA = "#db2777";

const STATIONS = [
  { id: 1, name: "Лукойл Северная №3",    dist: 1.2, fuels: { "АИ-92": 78, "АИ-95": 82, "ДТ": 65, "Газ": 0  }, zone: "Северная", price92: 62 },
  { id: 2, name: "Роснефть Нахимов №8",   dist: 2.1, fuels: { "АИ-92": 12, "АИ-95": 0,  "ДТ": 34, "Газ": 0  }, zone: "Нахимовский", price92: 71 },
  { id: 3, name: "Газпром Балаклава",      dist: 3.5, fuels: { "АИ-92": 91, "АИ-95": 88, "ДТ": 73, "Газ": 95 }, zone: "Балаклавский", price92: 59 },
  { id: 4, name: "Независимая №7",         dist: 4.0, fuels: { "АИ-92": 8,  "АИ-95": 0,  "ДТ": 22, "Газ": 0  }, zone: "Ленинский", price92: 68 },
  { id: 5, name: "Татнефть Гагарин",       dist: 5.3, fuels: { "АИ-92": 55, "АИ-95": 47, "ДТ": 61, "Газ": 38 }, zone: "Гагаринский", price92: 61 },
  { id: 6, name: "ATAN Камышовая",         dist: 6.1, fuels: { "АИ-92": 44, "АИ-95": 39, "ДТ": 0,  "Газ": 0  }, zone: "Гагаринский", price92: 64 },
  { id: 7, name: "Лукойл Малахов",         dist: 7.0, fuels: { "АИ-92": 3,  "АИ-95": 0,  "ДТ": 8,  "Газ": 0  }, zone: "Нахимовский", price92: 74 },
  { id: 8, name: "Роснефть Симферополь",  dist: 8.4, fuels: { "АИ-92": 67, "АИ-95": 71, "ДТ": 55, "Газ": 0  }, zone: "Симферопольский", price92: 60 },
];

const FUELS = ["АИ-92", "АИ-95", "ДТ", "Газ"];

function PctDot({ pct }: { pct: number }) {
  const c = pct === 0 ? "#374151" : pct < 25 ? "#ef4444" : pct < 60 ? "#eab308" : "#22c55e";
  if (pct === 0) return <span style={{ color: "#374151", fontSize: "0.7rem", fontFamily: "'JetBrains Mono',monospace", width: "28px", textAlign: "center", display: "inline-block" }}>—</span>;
  return (
    <div style={{ width: "28px", textAlign: "center" }}>
      <span style={{ color: c, fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{pct}</span>
    </div>
  );
}

export function ProximityList() {
  const [activeFuel, setActiveFuel] = useState("АИ-92");
  const [sortBy, setSortBy] = useState<"dist" | "avail">("dist");
  const [showBestOnly, setShowBestOnly] = useState(false);

  const stations = [...STATIONS]
    .filter(s => !showBestOnly || (s.fuels[activeFuel as keyof typeof s.fuels] ?? 0) >= 25)
    .sort((a, b) => {
      if (sortBy === "dist") return a.dist - b.dist;
      return (b.fuels[activeFuel as keyof typeof b.fuels] ?? 0) - (a.fuels[activeFuel as keyof typeof a.fuels] ?? 0);
    });

  return (
    <div style={{ width: "390px", height: "844px", background: DOMAIN, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "0.8rem 1rem 0.5rem", borderBottom: "1px solid #1e1e2a", flexShrink: 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.42rem", letterSpacing: "0.16em", marginBottom: "0.1rem" }}>ПОИСК_ПО_РАССТОЯНИЮ · GPS</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 800 }}>📍 Ближайшие АЗС</div>
            <div style={{ color: "#4b5563", fontSize: "0.62rem", marginTop: "0.1rem" }}>Севастополь · обновлено 3 мин назад</div>
          </div>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          </div>
        </div>
      </div>

      {/* Fuel filter */}
      <div style={{ display: "flex", gap: "0.35rem", padding: "0.6rem 1rem", flexShrink: 0, borderBottom: "1px solid #0f0f18" }}>
        {FUELS.map(f => (
          <button key={f} onClick={() => setActiveFuel(f)}
            style={{
              flex: 1, borderRadius: "10px", padding: "0.45rem 0",
              background: activeFuel === f ? `${VIOLET}20` : "#0b0b0f",
              border: `1px solid ${activeFuel === f ? VIOLET + "55" : "#1e1e2a"}`,
              color: activeFuel === f ? VIOLET : "#4b5563",
              fontSize: "0.68rem", fontWeight: 700, cursor: "pointer",
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Sort + filter row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.4rem 1rem", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button onClick={() => setSortBy("dist")} style={{ background: sortBy === "dist" ? "#1e1e2a" : "transparent", border: "1px solid #22222f", borderRadius: "8px", padding: "0.25rem 0.55rem", color: sortBy === "dist" ? "#e2e8f0" : "#4b5563", fontSize: "0.62rem", cursor: "pointer" }}>
            📍 Расстояние
          </button>
          <button onClick={() => setSortBy("avail")} style={{ background: sortBy === "avail" ? "#1e1e2a" : "transparent", border: "1px solid #22222f", borderRadius: "8px", padding: "0.25rem 0.55rem", color: sortBy === "avail" ? "#e2e8f0" : "#4b5563", fontSize: "0.62rem", cursor: "pointer" }}>
            📊 Наличие
          </button>
        </div>
        <button onClick={() => setShowBestOnly(!showBestOnly)} style={{ background: showBestOnly ? "#22c55e15" : "transparent", border: `1px solid ${showBestOnly ? "#22c55e33" : "#22222f"}`, borderRadius: "8px", padding: "0.25rem 0.55rem", color: showBestOnly ? "#22c55e" : "#4b5563", fontSize: "0.62rem", cursor: "pointer" }}>
          Только есть
        </button>
      </div>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 40px 40px 40px", gap: "0.25rem", padding: "0.2rem 1rem 0.3rem", flexShrink: 0 }}>
        <div style={{ color: "#374151", fontSize: "0.55rem", fontFamily: "'JetBrains Mono',monospace" }}>СТАНЦИЯ</div>
        {FUELS.map(f => (
          <div key={f} style={{ color: f === activeFuel ? VIOLET : "#374151", fontSize: "0.55rem", fontFamily: "'JetBrains Mono',monospace", textAlign: "center", fontWeight: f === activeFuel ? 700 : 400 }}>{f.replace("АИ-", "")}</div>
        ))}
      </div>

      {/* Station list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {stations.map((s, i) => {
          const pct = s.fuels[activeFuel as keyof typeof s.fuels] ?? 0;
          const c = pct < 25 ? "#ef4444" : pct < 60 ? "#eab308" : "#22c55e";
          const isCritical = pct < 25;
          return (
            <div key={s.id} style={{
              background: isCritical ? "linear-gradient(90deg,#14080a,#0d0d18)" : i === 0 && sortBy === "dist" ? "linear-gradient(90deg,#0d0d1a,#0a0a14)" : "#0d0d18",
              border: `1px solid ${isCritical ? "#ef444422" : "#1e1e2a"}`,
              borderLeft: `3px solid ${c}`,
              borderRadius: "10px", padding: "0.55rem 0.65rem",
              display: "grid", gridTemplateColumns: "1fr 40px 40px 40px 40px", gap: "0.25rem", alignItems: "center",
            }}>
              <div>
                <div style={{ color: "#d1d5db", fontSize: "0.7rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "2px", alignItems: "center" }}>
                  <span style={{ color: "#374151", fontSize: "0.56rem" }}>📍 {s.dist} км</span>
                  <span style={{ color: "#22222f", fontSize: "0.56rem" }}>·</span>
                  <span style={{ color: "#374151", fontSize: "0.56rem" }}>{s.price92}₽/л</span>
                </div>
              </div>
              {FUELS.map(f => <PctDot key={f} pct={s.fuels[f as keyof typeof s.fuels] ?? 0} />)}
            </div>
          );
        })}
        <div style={{ height: "5rem" }} />
      </div>

      {/* Buy CTA */}
      <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem" }}>
        <button style={{
          width: "100%", background: `linear-gradient(135deg, ${VIOLET}, ${MAGENTA})`,
          border: "none", borderRadius: "14px", padding: "0.9rem", color: "#fff",
          fontSize: "0.88rem", fontWeight: 800, cursor: "pointer",
          boxShadow: `0 0 24px ${VIOLET}40`,
        }}>
          🎫 Купить в ближайшей с наличием
        </button>
      </div>
    </div>
  );
}
