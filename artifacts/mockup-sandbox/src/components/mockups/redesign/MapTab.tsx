import { useState, useMemo } from "react";
import "./_group.css";

/* ─── Data ─────────────────────────────────────────────────── */
const STATIONS = [
  { id: 1, x: 22, y: 34, network: "lukoil",   name: "Лукойл #12",    address: "ул. Генерала Острякова, 47", status: "green",  rating: 4.7 },
  { id: 2, x: 55, y: 20, network: "rosneft",  name: "Роснефть #3",   address: "пр. Нахимова, 12",           status: "yellow", rating: 4.2 },
  { id: 3, x: 72, y: 42, network: "gazprom",  name: "Газпром #7",    address: "ул. Вакуленчука, 3",         status: "green",  rating: 4.9 },
  { id: 4, x: 40, y: 60, network: "bashneft", name: "Башнефть #1",   address: "ул. Балаклавская, 115",      status: "red",    rating: 3.8 },
  { id: 5, x: 78, y: 28, network: "tatneft",  name: "Татнефть #5",   address: "ул. Горпищенко, 60",         status: "yellow", rating: 4.4 },
  { id: 6, x: 18, y: 65, network: "lukoil",   name: "Лукойл #8",     address: "пр. Победы, 90",            status: "green",  rating: 4.6 },
  { id: 7, x: 62, y: 72, network: "rosneft",  name: "Роснефть #11",  address: "ул. Хрусталёва, 4",         status: "green",  rating: 4.3 },
  { id: 8, x: 85, y: 55, network: "gazprom",  name: "Газпром #2",    address: "ул. Адмирала Фадеева, 22",  status: "red",    rating: 3.5 },
  { id: 9, x: 33, y: 80, network: "nnk",      name: "ННК #4",        address: "ш. Симферопольское, 8",     status: "yellow", rating: 4.1 },
];

const FUELS_BY_STATION: Record<number, { type: string; price: string; avail: number; status: string }[]> = {
  1: [{ type:"АИ-92", price:"65.0₽/л", avail:75, status:"green" },{ type:"АИ-95", price:"72.5₽/л", avail:40, status:"yellow" },{ type:"ДТ", price:"70.0₽/л", avail:15, status:"red" }],
  2: [{ type:"АИ-92", price:"63.5₽/л", avail:50, status:"yellow" },{ type:"АИ-95", price:"71.0₽/л", avail:20, status:"red" },{ type:"ДТ", price:"68.5₽/л", avail:80, status:"green" }],
  3: [{ type:"АИ-92", price:"64.0₽/л", avail:90, status:"green" },{ type:"АИ-95", price:"73.0₽/л", avail:85, status:"green" },{ type:"ДТ", price:"69.5₽/л", avail:60, status:"green" }],
  4: [{ type:"АИ-92", price:"66.0₽/л", avail:10, status:"red" },{ type:"АИ-95", price:"74.0₽/л", avail:5, status:"red" },{ type:"ДТ", price:"71.0₽/л", avail:0, status:"red" }],
  5: [{ type:"АИ-92", price:"64.5₽/л", avail:55, status:"yellow" },{ type:"АИ-95", price:"72.0₽/л", avail:45, status:"yellow" },{ type:"ДТ", price:"70.5₽/л", avail:70, status:"green" }],
  6: [{ type:"АИ-92", price:"65.5₽/л", avail:80, status:"green" },{ type:"АИ-95", price:"73.5₽/л", avail:75, status:"green" },{ type:"ДТ", price:"71.5₽/л", avail:65, status:"green" }],
  7: [{ type:"АИ-92", price:"63.0₽/л", avail:85, status:"green" },{ type:"АИ-95", price:"70.5₽/л", avail:70, status:"green" },{ type:"ДТ", price:"68.0₽/л", avail:40, status:"yellow" }],
  8: [{ type:"АИ-92", price:"66.5₽/л", avail:5, status:"red" },{ type:"АИ-95", price:"74.5₽/л", avail:0, status:"red" },{ type:"ДТ", price:"72.0₽/л", avail:20, status:"red" }],
  9: [{ type:"АИ-92", price:"64.0₽/л", avail:45, status:"yellow" },{ type:"АИ-95", price:"71.5₽/л", avail:35, status:"yellow" },{ type:"ДТ", price:"69.0₽/л", avail:60, status:"green" }],
};

const NET: Record<string, { glow: string; label: string }> = {
  lukoil:   { glow: "#EF4444", label: "Лукойл" },
  rosneft:  { glow: "#3B82F6", label: "Роснефть" },
  gazprom:  { glow: "#22D3EE", label: "Газпром" },
  bashneft: { glow: "#8B5CF6", label: "Башнефть" },
  tatneft:  { glow: "#22C55E", label: "Татнефть" },
  nnk:      { glow: "#F59E0B", label: "ННК" },
};

const AVAIL_COLOR: Record<string, string> = {
  green:  "#22C55E",
  yellow: "#F59E0B",
  red:    "#EF4444",
};

const FILTER_OPTS = ["Все", "АИ-92", "АИ-95", "ДТ", "Газ"];
const SORT_OPTS   = ["По близости", "По цене", "По наличию", "По рейтингу"];
const NET_OPTS    = ["Все сети", "Лукойл", "Роснефть", "Газпром", "Башнефть", "Татнефть", "ННК"];

/* ─── Long-shadow CSS helper ───────────────────────────────── */
function longShadow(color: string, len = 18) {
  return Array.from({ length: len }, (_, i) => `${i + 1}px ${i + 1}px 0 ${color}`).join(", ");
}

const EXTRA_CSS = `
@keyframes markerPulse {
  0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.5; }
  50%      { transform:translate(-50%,-50%) scale(2.2); opacity:0; }
}
@keyframes slideUp {
  from { transform:translateY(100%); }
  to   { transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
.marker-pulse {
  animation: markerPulse 2s ease-out infinite;
}
.modal-slide {
  animation: slideUp .35s cubic-bezier(.16,1,.3,1) both;
}
.fade-in {
  animation: fadeIn .2s ease both;
}
`;

/* ─── Stars ─────────────────────────────────────────────────── */
function Stars({ n = 60 }: { n?: number }) {
  const stars = useMemo(() =>
    Array.from({ length: n }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.4 + 0.4,
      o: Math.random() * 0.55 + 0.15,
    })), [n]);

  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}>
      {stars.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o} />
      ))}
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function MapTab() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [activeFuel,  setActiveFuel]    = useState("Все");
  const [activeSort,  setActiveSort]    = useState("По близости");
  const [activeNet,   setActiveNet]     = useState("Все сети");

  const selected = selectedId != null ? STATIONS.find(s => s.id === selectedId)! : null;
  const nc       = selected ? NET[selected.network] : null;
  const fuels    = selected ? FUELS_BY_STATION[selected.id] : [];

  const visibleStations = STATIONS.filter(s =>
    activeFuel === "Все" || FUELS_BY_STATION[s.id].some(f => f.type === activeFuel && f.avail > 0)
  );

  return (
    <div style={{ width:390, height:844, position:"relative", overflow:"hidden",
      fontFamily:"'Inter',system-ui,sans-serif", color:"#fff",
      background:"#0B0C4A" }}>
      <style>{EXTRA_CSS}</style>

      {/* ── STARFIELD MAP BG ── */}
      <div style={{ position:"absolute", inset:0, zIndex:0,
        background:"linear-gradient(160deg,#0d0e5e 0%,#090a40 50%,#060730 100%)" }}>
        <Stars n={80} />

        {/* Road grid */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.18 }}>
          <line x1="30%" y1="0" x2="45%" y2="100%" stroke="#6366f1" strokeWidth="1.5"/>
          <line x1="65%" y1="0" x2="50%" y2="100%" stroke="#6366f1" strokeWidth="1.5"/>
          <line x1="0" y1="38%" x2="100%" y2="42%" stroke="#6366f1" strokeWidth="1"/>
          <line x1="0" y1="65%" x2="100%" y2="60%" stroke="#6366f1" strokeWidth="1"/>
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#4f46e5" strokeWidth=".8" strokeDasharray="6 10"/>
        </svg>

        {/* Block labels (city map flavour) */}
        {[
          { x:"12%", y:"22%", text:"СЕВЕРНАЯ" },
          { x:"55%", y:"15%", text:"ЦЕНТР" },
          { x:"72%", y:"50%", text:"КОРАБЕЛ." },
          { x:"20%", y:"72%", text:"ГАГАРИНСКИЙ" },
        ].map(l => (
          <div key={l.text} style={{
            position:"absolute", left:l.x, top:l.y,
            fontSize:8, fontWeight:700, letterSpacing:"0.18em",
            color:"rgba(150,160,255,0.28)", textTransform:"uppercase",
            pointerEvents:"none", zIndex:2,
          }}>{l.text}</div>
        ))}
      </div>

      {/* ── STATION MARKERS ── */}
      {visibleStations.map(s => {
        const isSelected = s.id === selectedId;
        const color = AVAIL_COLOR[s.status];
        return (
          <div key={s.id} onClick={() => setSelectedId(isSelected ? null : s.id)}
            style={{
              position:"absolute", left:`${s.x}%`,
              top:`${(s.y / 100) * 68 + 12}%`,
              transform:"translate(-50%,-50%)",
              zIndex: isSelected ? 15 : 6,
              cursor:"pointer",
            }}>
            {/* Pulse ring */}
            <div className="marker-pulse" style={{
              position:"absolute", top:"50%", left:"50%",
              width: isSelected ? 28 : 20, height: isSelected ? 28 : 20,
              borderRadius:"50%", background:color,
              animationDuration: s.status === "green" ? "2s" : s.status === "yellow" ? "1.5s" : "1.1s",
            }} />
            {/* Core dot */}
            <div style={{
              width: isSelected ? 18 : 11,
              height: isSelected ? 18 : 11,
              borderRadius:"50%",
              background: isSelected
                ? `radial-gradient(circle at 35% 35%, white, ${color})`
                : color,
              boxShadow: `0 0 ${isSelected ? 20 : 10}px ${color}, 0 0 ${isSelected ? 40 : 20}px ${color}55`,
              border: `${isSelected ? 2.5 : 1.5}px solid rgba(255,255,255,${isSelected ? .95 : .5})`,
              position:"relative", zIndex:2,
            }} />
            {/* Label on selected */}
            {isSelected && (
              <div style={{
                position:"absolute", bottom:"calc(100% + 6px)", left:"50%",
                transform:"translateX(-50%)",
                background:"rgba(10,8,60,0.92)", backdropFilter:"blur(12px)",
                border:`1px solid ${color}55`,
                borderRadius:8, padding:"3px 8px", whiteSpace:"nowrap",
                fontSize:11, fontWeight:700, color:"#fff",
                boxShadow:`0 2px 12px ${color}44`,
              }}>
                {s.name}
              </div>
            )}
          </div>
        );
      })}

      {/* ── HEADER ── */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, zIndex:30,
        background:"rgba(9,8,58,0.82)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(99,102,241,0.25)",
        padding:"12px 16px 10px",
      }}>
        {/* Search row */}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{
            flex:1, background:"rgba(255,255,255,0.06)",
            backdropFilter:"blur(16px)",
            border:"1px solid rgba(99,102,241,0.25)",
            borderRadius:12, padding:"9px 14px",
            display:"flex", alignItems:"center", gap:9,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="rgba(150,160,255,0.5)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span style={{ fontSize:14, color:"rgba(180,185,255,0.4)" }}>Поиск АЗС...</span>
          </div>

          {/* Filter toggle */}
          <button onClick={() => setFiltersOpen(true)}
            style={{
              width:40, height:40, borderRadius:12, border:"none",
              background: filtersOpen
                ? "linear-gradient(135deg,#6366f1,#4f46e5)"
                : "rgba(255,255,255,0.06)",
              backdropFilter:"blur(16px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", flexShrink:0,
              boxShadow: filtersOpen ? "0 0 16px rgba(99,102,241,0.6)" : "none",
              outline:"none",
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={filtersOpen ? "#fff" : "rgba(150,160,255,0.7)"} strokeWidth="2.2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Fuel chips */}
        <div style={{ display:"flex", gap:6, marginTop:8, overflowX:"auto" }}
          className="scroll-hidden">
          {FILTER_OPTS.map(f => {
            const on = activeFuel === f;
            return (
              <button key={f} onClick={() => setActiveFuel(f)}
                style={{
                  flexShrink:0, background: on
                    ? "linear-gradient(135deg,#E8622A,#c94e1e)"
                    : "rgba(255,255,255,0.05)",
                  backdropFilter:"blur(10px)",
                  border:`1px solid ${on ? "#E8622A" : "rgba(99,102,241,0.2)"}`,
                  borderRadius:20, padding:"4px 13px",
                  fontSize:12, fontWeight:700,
                  color: on ? "#fff" : "rgba(180,185,255,0.65)",
                  boxShadow: on ? "0 0 14px rgba(232,98,42,0.5)" : "none",
                  cursor:"pointer", outline:"none",
                }}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* ── LEGEND pill ── */}
      <div style={{
        position:"absolute", bottom: selected ? 492 : 24,
        right:16, zIndex:20,
        background:"rgba(9,8,58,0.82)", backdropFilter:"blur(16px)",
        border:"1px solid rgba(99,102,241,0.22)",
        borderRadius:12, padding:"8px 12px",
        display:"flex", flexDirection:"column", gap:5,
        transition:"bottom .35s cubic-bezier(.16,1,.3,1)",
      }}>
        {[["green","Есть"],["yellow","Мало"],["red","Нет"]].map(([s,l]) => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%",
              background:AVAIL_COLOR[s],
              boxShadow:`0 0 6px ${AVAIL_COLOR[s]}` }} />
            <span style={{ fontSize:10, color:"rgba(180,185,255,0.7)", fontWeight:600 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* ── STATION DETAIL MODAL ── */}
      {selected && nc && (
        <div className="modal-slide" style={{
          position:"absolute", bottom:0, left:0, right:0,
          zIndex:25, height:480,
          background:"rgba(8,7,52,0.95)",
          backdropFilter:"blur(48px)",
          borderTop:`1.5px solid ${nc.glow}55`,
          borderRadius:"24px 24px 0 0",
          boxShadow:`0 -12px 60px ${nc.glow}20, 0 -2px 0 ${nc.glow}33`,
          display:"flex", flexDirection:"column",
        }}>
          {/* Drag handle */}
          <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
            <div style={{ width:36, height:4, borderRadius:2,
              background:"rgba(255,255,255,0.18)" }} />
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"0 18px 16px" }}
            className="scroll-hidden">

            {/* Station name — bold with shadow */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div>
                  <div style={{
                    fontSize:19, fontWeight:900, letterSpacing:"-0.02em",
                    textShadow: longShadow(`${nc.glow}40`, 6),
                    lineHeight:1.2,
                  }}>{selected.name}</div>
                  <div style={{ fontSize:12, color:"rgba(180,185,255,0.55)", marginTop:3 }}>
                    📍 {selected.address}
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} style={{
                  background:"rgba(255,255,255,0.08)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, width:32, height:32,
                  color:"rgba(255,255,255,0.5)", fontSize:14,
                  cursor:"pointer", flexShrink:0, outline:"none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>✕</button>
              </div>

              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                <span style={{
                  fontSize:11, fontWeight:700, padding:"3px 10px",
                  borderRadius:6,
                  background:`${nc.glow}18`,
                  border:`1px solid ${nc.glow}44`,
                  color:nc.glow,
                  boxShadow:`0 0 10px ${nc.glow}30`,
                }}>{nc.label}</span>
                <span style={{
                  fontSize:11, padding:"3px 10px",
                  borderRadius:6,
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  color:"rgba(255,220,100,0.9)",
                }}>★ {selected.rating}</span>
                <span style={{
                  fontSize:11, padding:"3px 10px",
                  borderRadius:6,
                  background: `${AVAIL_COLOR[selected.status]}18`,
                  border:`1px solid ${AVAIL_COLOR[selected.status]}44`,
                  color:AVAIL_COLOR[selected.status],
                }}>
                  {selected.status === "green" ? "● Открыта" : selected.status === "yellow" ? "● Мало" : "● Закрыта"}
                </span>
              </div>
            </div>

            {/* Fuel prices */}
            <div style={{
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(99,102,241,0.18)",
              borderRadius:16, padding:"12px 14px", marginBottom:12,
            }}>
              <div style={{
                fontSize:10, fontWeight:700, letterSpacing:"0.18em",
                textTransform:"uppercase", color:"rgba(150,160,255,0.5)",
                marginBottom:10,
              }}>ТОПЛИВО · ЦЕНЫ · НАЛИЧИЕ</div>

              {fuels.map(f => (
                <div key={f.type} style={{
                  display:"flex", alignItems:"center", gap:10, marginBottom:9,
                }}>
                  <span style={{
                    fontSize:13, fontWeight:800, width:44,
                    color:"#fff", letterSpacing:"-0.02em",
                  }}>{f.type}</span>

                  <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.07)",
                    borderRadius:4, overflow:"hidden" }}>
                    <div style={{
                      width:`${f.avail}%`, height:"100%", borderRadius:4,
                      background:`linear-gradient(90deg, ${AVAIL_COLOR[f.status]}aa, ${AVAIL_COLOR[f.status]})`,
                      boxShadow:`0 0 8px ${AVAIL_COLOR[f.status]}`,
                    }} />
                  </div>

                  <span style={{
                    fontSize:13, fontWeight:700,
                    color: AVAIL_COLOR[f.status],
                    width:66, textAlign:"right",
                  }}>{f.price}</span>
                </div>
              ))}
            </div>

            {/* Crowd report */}
            <div style={{ display:"flex", gap:7, marginBottom:13 }}>
              {[
                { label:"✅ Есть", color:"#22C55E" },
                { label:"⚠️ Мало", color:"#F59E0B" },
                { label:"❌ Нет",  color:"#EF4444" },
              ].map(({ label, color }) => (
                <button key={label} style={{
                  flex:1, padding:"8px 0", borderRadius:11,
                  border:`1px solid ${color}33`,
                  background:`${color}0d`,
                  color:`${color}cc`,
                  fontSize:12, fontWeight:700, cursor:"pointer", outline:"none",
                }}>{label}</button>
              ))}
            </div>

            {/* CTA */}
            <button style={{
              width:"100%", padding:"15px 0", borderRadius:16, border:"none",
              background:"linear-gradient(135deg,#E8622A 0%,#c94e1e 50%,#a33916 100%)",
              color:"#fff", fontSize:16, fontWeight:900, cursor:"pointer",
              boxShadow:"0 4px 28px rgba(232,98,42,0.55)",
              letterSpacing:"0.04em", textTransform:"uppercase",
              textShadow: longShadow("rgba(80,20,0,0.3)", 4),
              outline:"none",
            }}>
              Купить талон ⛽
            </button>
          </div>

          {/* Bottom nav inside modal */}
          <div style={{
            height:68, background:"rgba(6,5,40,0.9)",
            backdropFilter:"blur(24px)",
            borderTop:"1px solid rgba(99,102,241,0.15)",
            display:"flex", alignItems:"center", justifyContent:"space-around",
            flexShrink:0,
          }}>
            {[
              { icon:"🗺", label:"Карта",      active:true  },
              { icon:"🎟", label:"Талоны",     active:false },
              { icon:"⚡", label:"ИИ",         active:false },
              { icon:"🎮", label:"Игры",       active:false },
              { icon:"💎", label:"Хранилище",  active:false },
            ].map(t => (
              <div key={t.label} style={{ display:"flex", flexDirection:"column",
                alignItems:"center", gap:2 }}>
                <span style={{ fontSize:20, opacity:t.active ? 1 : .4 }}>{t.icon}</span>
                <span style={{ fontSize:9, fontWeight:700,
                  color: t.active ? "#E8622A" : "rgba(180,185,255,0.35)",
                  letterSpacing:"0.04em",
                }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav when no modal */}
      {!selected && (
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:68, zIndex:25,
          background:"rgba(8,7,52,0.92)", backdropFilter:"blur(24px)",
          borderTop:"1px solid rgba(99,102,241,0.15)",
          display:"flex", alignItems:"center", justifyContent:"space-around",
        }}>
          {[
            { icon:"🗺", label:"Карта",     active:true  },
            { icon:"🎟", label:"Талоны",    active:false },
            { icon:"⚡", label:"ИИ",        active:false },
            { icon:"🎮", label:"Игры",      active:false },
            { icon:"💎", label:"Хранилище", active:false },
          ].map(t => (
            <div key={t.label} style={{ display:"flex", flexDirection:"column",
              alignItems:"center", gap:2 }}>
              <span style={{ fontSize:20, opacity:t.active ? 1 : .4 }}>{t.icon}</span>
              <span style={{ fontSize:9, fontWeight:700,
                color: t.active ? "#E8622A" : "rgba(180,185,255,0.35)",
                letterSpacing:"0.04em",
              }}>{t.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── FILTER PANEL (slide up) ── */}
      {filtersOpen && (
        <>
          <div className="fade-in" onClick={() => setFiltersOpen(false)} style={{
            position:"absolute", inset:0, zIndex:40,
            background:"rgba(5,4,35,0.6)", backdropFilter:"blur(4px)",
          }} />
          <div className="modal-slide" style={{
            position:"absolute", bottom:0, left:0, right:0,
            zIndex:50, borderRadius:"24px 24px 0 0",
            background:"rgba(8,7,52,0.97)", backdropFilter:"blur(48px)",
            border:"1px solid rgba(99,102,241,0.25)",
            borderBottom:"none",
            padding:"0 20px 32px",
          }}>
            {/* Handle */}
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", padding:"12px 0 16px" }}>
              <div style={{ width:36, height:4, borderRadius:2,
                background:"rgba(255,255,255,0.2)", margin:"0 auto" }} />
            </div>

            {/* Panel title */}
            <div style={{
              fontSize:11, fontWeight:900, letterSpacing:"0.2em",
              textTransform:"uppercase", color:"#E8622A",
              textShadow: longShadow("rgba(232,98,42,0.2)", 6),
              marginBottom:18,
            }}>ФИЛЬТРЫ · МАТРИЦА</div>

            {/* Sort */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em",
                textTransform:"uppercase", color:"rgba(150,160,255,0.5)",
                marginBottom:9 }}>Сортировка</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {SORT_OPTS.map(o => {
                  const on = activeSort === o;
                  return (
                    <button key={o} onClick={() => setActiveSort(o)} style={{
                      padding:"6px 14px", borderRadius:20,
                      border:`1px solid ${on ? "#6366f1" : "rgba(99,102,241,0.2)"}`,
                      background: on ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)",
                      color: on ? "#a5b4fc" : "rgba(180,185,255,0.55)",
                      fontSize:12, fontWeight:700, cursor:"pointer", outline:"none",
                      boxShadow: on ? "0 0 12px rgba(99,102,241,0.3)" : "none",
                    }}>{o}</button>
                  );
                })}
              </div>
            </div>

            {/* Network */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em",
                textTransform:"uppercase", color:"rgba(150,160,255,0.5)",
                marginBottom:9 }}>Сеть АЗС</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {NET_OPTS.map(o => {
                  const on = activeNet === o;
                  return (
                    <button key={o} onClick={() => setActiveNet(o)} style={{
                      padding:"6px 14px", borderRadius:20,
                      border:`1px solid ${on ? "#E8622A" : "rgba(99,102,241,0.2)"}`,
                      background: on ? "rgba(232,98,42,0.18)" : "rgba(255,255,255,0.04)",
                      color: on ? "#E8622A" : "rgba(180,185,255,0.55)",
                      fontSize:12, fontWeight:700, cursor:"pointer", outline:"none",
                      boxShadow: on ? "0 0 12px rgba(232,98,42,0.35)" : "none",
                    }}>{o}</button>
                  );
                })}
              </div>
            </div>

            {/* Apply */}
            <button onClick={() => setFiltersOpen(false)} style={{
              width:"100%", padding:"14px 0", borderRadius:16, border:"none",
              background:"linear-gradient(135deg,#E8622A,#c94e1e)",
              color:"#fff", fontSize:15, fontWeight:900, cursor:"pointer",
              boxShadow:"0 4px 24px rgba(232,98,42,0.5)",
              letterSpacing:"0.08em", textTransform:"uppercase", outline:"none",
            }}>Применить</button>
          </div>
        </>
      )}
    </div>
  );
}
