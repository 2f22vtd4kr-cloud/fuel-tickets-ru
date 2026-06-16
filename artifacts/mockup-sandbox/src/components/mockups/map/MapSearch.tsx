import { useState, useRef } from "react";

const STATIONS = [
  { id: 1, name: "Роснефть #42", network: "Роснефть", address: "ул. Ленина, 12", status: "green", dist: "1.2 км", pct: 78 },
  { id: 2, name: "Лукойл АЗС 7", network: "Лукойл", address: "пр. Нахимова, 55", status: "green", dist: "2.1 км", pct: 64 },
  { id: 3, name: "Газпромнефть #3", network: "Газпромнефть", address: "ул. Большая Морская, 31", status: "yellow", dist: "2.8 км", pct: 41 },
  { id: 4, name: "Роснефть #7", network: "Роснефть", address: "ул. Героев Сталинграда, 90", status: "green", dist: "3.5 км", pct: 82 },
  { id: 5, name: "Лукойл АЗС 12", network: "Лукойл", address: "Балаклавское ш., 14", status: "red", dist: "4.1 км", pct: 12 },
  { id: 6, name: "Татнефть АЗС", network: "Татнефть", address: "ул. Адмирала Октябрьского, 7", status: "yellow", dist: "4.8 км", pct: 38 },
  { id: 7, name: "Роснефть #15", network: "Роснефть", address: "Симферопольское ш., 3 км", status: "green", dist: "6.2 км", pct: 71 },
];

const STATUS_COLOR: Record<string, string> = { green: "#22c55e", yellow: "#eab308", red: "#ef4444" };
const STATUS_LABEL: Record<string, string> = { green: "Норма", yellow: "Мало", red: "Нет" };

export function MapSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.toLowerCase().trim();
  const results = q ? STATIONS.filter(s =>
    `${s.name} ${s.network} ${s.address}`.toLowerCase().includes(q)
  ) : [];

  return (
    <div style={{
      height: "100vh", background: "#050507",
      display: "flex", flexDirection: "column",
      fontFamily: "system-ui, sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Map placeholder */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 40% 55%, #0d1a0d 0%, #050507 70%)",
        }}>
          {/* Fake map grid */}
          <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22c55e" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Fake roads */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
            <line x1="0" y1="40%" x2="100%" y2="55%" stroke="#4b5563" strokeWidth="2"/>
            <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#4b5563" strokeWidth="1.5"/>
            <line x1="0" y1="65%" x2="100%" y2="60%" stroke="#374151" strokeWidth="1"/>
            <line x1="60%" y1="0" x2="70%" y2="100%" stroke="#374151" strokeWidth="1"/>
          </svg>
          {/* Fake station dots */}
          {STATIONS.map((s, i) => {
            const positions = [
              [28, 45], [55, 38], [72, 52], [38, 62], [18, 70], [65, 72], [82, 38]
            ];
            const [x, y] = positions[i] ?? [50, 50];
            const c = STATUS_COLOR[s.status];
            const isSelected = selected === s.id;
            return (
              <div key={s.id} onClick={() => setSelected(s.id === selected ? null : s.id)} style={{
                position: "absolute",
                left: `${x}%`, top: `${y}%`,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
              }}>
                <div style={{
                  width: isSelected ? "22px" : "16px", height: isSelected ? "22px" : "16px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, ${c}ff, ${c}99)`,
                  border: isSelected ? `2px solid ${c}` : "1.5px solid rgba(255,255,255,0.25)",
                  boxShadow: `0 0 ${isSelected ? "20px" : "10px"} ${c}99`,
                  transition: "all 0.2s",
                }} />
                {isSelected && (
                  <div style={{
                    position: "absolute", bottom: "120%", left: "50%", transform: "translateX(-50%)",
                    background: "rgba(8,8,20,0.97)", border: `1px solid ${c}55`,
                    borderRadius: "8px", padding: "0.35rem 0.55rem",
                    whiteSpace: "nowrap", fontSize: "0.62rem", color: "#e2e8f0",
                    boxShadow: `0 4px 16px rgba(0,0,0,0.6), 0 0 8px ${c}22`,
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: "2px" }}>{s.name}</div>
                    <div style={{ color: c, fontSize: "0.55rem" }}>{STATUS_LABEL[s.status]} · {s.pct}%</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Top bar */}
        <div style={{
          position: "absolute", top: "0.75rem", left: "0.75rem", right: "0.75rem",
          display: "flex", gap: "0.4rem", alignItems: "center", zIndex: 10,
        }}>
          {/* Filter button */}
          <button style={{
            background: "rgba(20,20,28,0.92)", border: "1px solid #22222f",
            borderRadius: "10px", color: "#e2e8f0", padding: "0.4rem 0.75rem",
            fontSize: "0.75rem", cursor: "pointer", backdropFilter: "blur(12px)",
            fontWeight: 600, whiteSpace: "nowrap",
          }}>⬡ Фильтры</button>

          {/* 📍 */}
          <button style={{
            background: "rgba(20,20,28,0.92)", border: "1px solid #22222f",
            borderRadius: "10px", color: "#e2e8f0", padding: "0.4rem 0.6rem",
            fontSize: "0.78rem", cursor: "pointer", backdropFilter: "blur(12px)",
          }}>📍</button>

          {/* 🌡 */}
          <button style={{
            background: "rgba(168,85,247,0.18)", border: "1px solid #a855f755",
            borderRadius: "10px", color: "#a855f7", padding: "0.4rem 0.6rem",
            fontSize: "0.78rem", cursor: "pointer", backdropFilter: "blur(12px)",
          }}>🌡</button>

          {/* Search button + expanding input */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <button
              onClick={() => { setOpen(v => !v); if (!open) setTimeout(() => inputRef.current?.focus(), 80); else setQuery(""); }}
              style={{
                background: open ? "rgba(219,39,119,0.15)" : "rgba(20,20,28,0.92)",
                border: `1px solid ${open ? "#db277755" : "#22222f"}`,
                borderRadius: "10px", color: open ? "#f472b6" : "#9ca3af",
                padding: "0.4rem 0.6rem", fontSize: "0.78rem", cursor: "pointer",
                backdropFilter: "blur(12px)", flexShrink: 0, transition: "all 0.2s",
              }}
            >🔍</button>
            {open && (
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="АЗС, сеть, адрес…"
                style={{
                  flex: 1, background: "rgba(10,10,18,0.97)", border: "1px solid #db277755",
                  borderRadius: "10px", color: "#e2e8f0",
                  padding: "0.4rem 0.65rem", fontSize: "0.75rem",
                  outline: "none", fontFamily: "system-ui, sans-serif", boxSizing: "border-box",
                }}
              />
            )}
            {query && (
              <div style={{
                background: results.length ? "rgba(219,39,119,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${results.length ? "#db277744" : "#ef444444"}`,
                borderRadius: "10px", padding: "0.4rem 0.55rem",
                fontFamily: "'Courier New',monospace", fontSize: "0.65rem",
                color: results.length ? "#f472b6" : "#ef4444",
                backdropFilter: "blur(12px)", flexShrink: 0, cursor: "pointer",
              }}>
                {results.length > 0 ? `${results.length} АЗС →` : "0"}
              </div>
            )}
          </div>

          {/* Status counts */}
          {!open && (
            <div style={{
              background: "rgba(20,20,28,0.92)", border: "1px solid #22222f",
              borderRadius: "10px", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", overflow: "hidden",
            }}>
              {[["green","#22c55e",4],["yellow","#eab308",2],["red","#ef4444",1]].map(([s,c,n]) => (
                <div key={s as string} style={{
                  display: "flex", alignItems: "center", gap: "3px",
                  padding: "0.4rem 0.45rem", borderRight: "1px solid #22222f",
                }}>
                  <span style={{ color: c as string, fontSize: "0.5rem" }}>●</span>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: "0.68rem", color: c as string, fontWeight: 700 }}>{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search results dropdown */}
        {query && results.length > 0 && (
          <div style={{
            position: "absolute", top: "3.6rem", left: "0.75rem", right: "0.75rem",
            zIndex: 20,
            background: "rgba(8,8,20,0.97)",
            border: "1px solid #a855f722",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 8px 32px #00000088",
            maxHeight: "55vh",
            overflowY: "auto",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,#db2777,transparent)" }} />
            <div style={{ padding: "0.5rem 0.75rem 0.3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: "0.48rem", color: "#4b5563", letterSpacing: "0.14em" }}>РЕЗУЛЬТАТЫ_ПОИСКА</span>
              <span style={{ color: "#f472b6", fontSize: "0.62rem", fontWeight: 600 }}>{results.length} АЗС</span>
            </div>
            {results.map((s) => {
              const c = STATUS_COLOR[s.status];
              return (
                <div
                  key={s.id}
                  onClick={() => { setSelected(s.id); setQuery(""); setOpen(false); }}
                  style={{
                    padding: "0.55rem 0.75rem",
                    borderTop: "1px solid #12121e",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.65rem",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: `${c}18`, border: `1.5px solid ${c}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem",
                  }}>⛽</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div style={{ color: "#4b5563", fontSize: "0.6rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.address}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: c, fontSize: "0.65rem", fontWeight: 700 }}>{s.pct}%</div>
                    <div style={{ color: "#374151", fontSize: "0.55rem" }}>{s.dist}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div style={{
            position: "absolute", top: "3.6rem", left: "0.75rem", right: "0.75rem",
            zIndex: 20,
            background: "rgba(8,8,20,0.97)", border: "1px solid #2a1a1a",
            borderRadius: "14px", padding: "0.85rem 0.75rem",
            boxShadow: "0 8px 32px #00000088",
          }}>
            <div style={{ color: "#ef4444", fontSize: "0.75rem", textAlign: "center", marginBottom: "0.25rem" }}>АЗС не найдено</div>
            <div style={{ color: "#4b5563", fontSize: "0.62rem", textAlign: "center" }}>Попробуй: «Роснефть», «Лукойл», «Нахимова»</div>
          </div>
        )}

        {/* Legend */}
        <div style={{
          position: "fixed", bottom: "1rem", left: "0.75rem",
          zIndex: 10,
          background: "rgba(8,8,20,0.88)", border: "1px solid #1e1e2a",
          borderRadius: "10px", padding: "0.35rem 0.55rem",
          backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column", gap: "4px",
        }}>
          {[["#22c55e","≥60%"],["#eab308","25–60%"],["#ef4444","<25%"]].map(([c, l]) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c, boxShadow: `0 0 5px ${c}88` }} />
              <span style={{ fontFamily: "'Courier New',monospace", fontSize: "0.42rem", color: "#6b7280" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
