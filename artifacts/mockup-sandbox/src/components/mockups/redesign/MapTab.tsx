import { useState, useMemo } from "react";
import "./_group.css";

/* ─── Brand palette (Mercedes ambient-light concept) ───────── */
const NET: Record<string, { glow: string; ambient: string; label: string; logoChar: string }> = {
  lukoil:   { glow: "#DC143C", ambient: "#FF1744", label: "Лукойл",    logoChar: "Л" },
  rosneft:  { glow: "#1565C0", ambient: "#2979FF", label: "Роснефть",  logoChar: "Р" },
  gazprom:  { glow: "#0288D1", ambient: "#00B0FF", label: "Газпром",   logoChar: "Г" },
  bashneft: { glow: "#6A1B9A", ambient: "#AA00FF", label: "Башнефть",  logoChar: "Б" },
  tatneft:  { glow: "#00695C", ambient: "#00E5FF", label: "Татнефть",  logoChar: "Т" },
  nnk:      { glow: "#E65100", ambient: "#FF6D00", label: "ННК",       logoChar: "Н" },
};

const AVAIL_COLOR: Record<string, string> = {
  green:  "#00E676",
  yellow: "#FFD600",
  red:    "#FF1744",
};

/* ─── Mock data ─────────────────────────────────────────────── */
const STATIONS = [
  { id:1, x:22, y:34, network:"lukoil",   name:"Лукойл #12",   address:"ул. Острякова, 47",       status:"green",  rating:4.7 },
  { id:2, x:55, y:20, network:"rosneft",  name:"Роснефть #3",  address:"пр. Нахимова, 12",        status:"yellow", rating:4.2 },
  { id:3, x:72, y:42, network:"gazprom",  name:"Газпром #7",   address:"ул. Вакуленчука, 3",      status:"green",  rating:4.9 },
  { id:4, x:40, y:60, network:"bashneft", name:"Башнефть #1",  address:"ул. Балаклавская, 115",   status:"red",    rating:3.8 },
  { id:5, x:78, y:28, network:"tatneft",  name:"Татнефть #5",  address:"ул. Горпищенко, 60",      status:"yellow", rating:4.4 },
  { id:6, x:18, y:65, network:"lukoil",   name:"Лукойл #8",    address:"пр. Победы, 90",          status:"green",  rating:4.6 },
  { id:7, x:62, y:72, network:"rosneft",  name:"Роснефть #11", address:"ул. Хрусталёва, 4",       status:"green",  rating:4.3 },
  { id:8, x:85, y:55, network:"gazprom",  name:"Газпром #2",   address:"ул. Фадеева, 22",         status:"red",    rating:3.5 },
  { id:9, x:33, y:80, network:"nnk",      name:"ННК #4",       address:"ш. Симферопольское, 8",   status:"yellow", rating:4.1 },
];

const FUELS_BY_STATION: Record<number, { type:string; price:string; avail:number; status:string }[]> = {
  1: [{type:"АИ-92",price:"65.0₽/л",avail:75,status:"green"},{type:"АИ-95",price:"72.5₽/л",avail:40,status:"yellow"},{type:"ДТ",price:"70.0₽/л",avail:15,status:"red"}],
  2: [{type:"АИ-92",price:"63.5₽/л",avail:50,status:"yellow"},{type:"АИ-95",price:"71.0₽/л",avail:20,status:"red"},{type:"ДТ",price:"68.5₽/л",avail:80,status:"green"}],
  3: [{type:"АИ-92",price:"64.0₽/л",avail:90,status:"green"},{type:"АИ-95",price:"73.0₽/л",avail:85,status:"green"},{type:"ДТ",price:"69.5₽/л",avail:60,status:"green"}],
  4: [{type:"АИ-92",price:"66.0₽/л",avail:10,status:"red"},{type:"АИ-95",price:"74.0₽/л",avail:5,status:"red"},{type:"ДТ",price:"71.0₽/л",avail:0,status:"red"}],
  5: [{type:"АИ-92",price:"64.5₽/л",avail:55,status:"yellow"},{type:"АИ-95",price:"72.0₽/л",avail:45,status:"yellow"},{type:"ДТ",price:"70.5₽/л",avail:70,status:"green"}],
  6: [{type:"АИ-92",price:"65.5₽/л",avail:80,status:"green"},{type:"АИ-95",price:"73.5₽/л",avail:75,status:"green"},{type:"ДТ",price:"71.5₽/л",avail:65,status:"green"}],
  7: [{type:"АИ-92",price:"63.0₽/л",avail:85,status:"green"},{type:"АИ-95",price:"70.5₽/л",avail:70,status:"green"},{type:"ДТ",price:"68.0₽/л",avail:40,status:"yellow"}],
  8: [{type:"АИ-92",price:"66.5₽/л",avail:5,status:"red"},{type:"АИ-95",price:"74.5₽/л",avail:0,status:"red"},{type:"ДТ",price:"72.0₽/л",avail:20,status:"red"}],
  9: [{type:"АИ-92",price:"64.0₽/л",avail:45,status:"yellow"},{type:"АИ-95",price:"71.5₽/л",avail:35,status:"yellow"},{type:"ДТ",price:"69.0₽/л",avail:60,status:"green"}],
};

const FILTER_OPTS = ["Все", "АИ-92", "АИ-95", "ДТ", "Газ"];
const SORT_OPTS   = ["По близости", "По цене", "По наличию", "По рейтингу"];
const NET_OPTS    = ["Все сети", "Лукойл", "Роснефть", "Газпром", "Башнефть", "Татнефть", "ННК"];

/* ─── CSS injected once ─────────────────────────────────────── */
const EXTRA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

@keyframes markerPulse {
  0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.55; }
  50%      { transform:translate(-50%,-50%) scale(2.5); opacity:0; }
}
@keyframes slideUp {
  from { transform:translateY(100%); }
  to   { transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes ambientFlow {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes ambientPulse {
  0%,100% { opacity:.55; }
  50%     { opacity:1; }
}
@keyframes starTwinkle {
  0%,100% { opacity: var(--op); }
  50%     { opacity: calc(var(--op) * 0.3); }
}

.marker-pulse  { animation: markerPulse 2.2s ease-out infinite; }
.modal-slide   { animation: slideUp .38s cubic-bezier(.16,1,.3,1) both; }
.fade-in       { animation: fadeIn .2s ease both; }

/* Mercedes ambient line — flows with colour */
.ambient-strip {
  background-size: 200% 100%;
  animation: ambientFlow 3s linear infinite, ambientPulse 2.6s ease-in-out infinite;
}
`;

/* ─── Stars ─────────────────────────────────────────────────── */
function Stars({ n = 90 }: { n?: number }) {
  const stars = useMemo(() =>
    Array.from({ length: n }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.6 + 0.3,
      op: Math.random() * 0.65 + 0.1,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 4,
    })), [n]);

  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}>
      {stars.map(s => (
        <circle
          key={s.id}
          cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
          fill="white"
          style={{
            opacity: s.op,
            animation: `starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
            ["--op" as string]: s.op,
          } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

/* ─── Mercedes ambient light strip ─────────────────────────── */
function AmbientStrip({ color, axis = "h", thickness = 1.5, style = {} }: {
  color: string; axis?: "h" | "v"; thickness?: number; style?: React.CSSProperties;
}) {
  const grad = `linear-gradient(90deg, transparent 0%, ${color}00 5%, ${color}cc 30%, ${color} 50%, ${color}cc 70%, ${color}00 95%, transparent 100%)`;
  return (
    <div className="ambient-strip" style={{
      position:"absolute",
      background: grad,
      height: axis === "h" ? thickness : "100%",
      width:  axis === "v" ? thickness : "100%",
      pointerEvents:"none",
      ...style,
    }} />
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function MapTab() {
  const [selectedId,  setSelectedId]  = useState<number | null>(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFuel,  setActiveFuel]  = useState("Все");
  const [activeSort,  setActiveSort]  = useState("По близости");
  const [activeNet,   setActiveNet]   = useState("Все сети");

  const selected = selectedId != null ? STATIONS.find(s => s.id === selectedId)! : null;
  const nc       = selected ? NET[selected.network] : null;
  const fuels    = selected ? FUELS_BY_STATION[selected.id] : [];

  const visibleStations = STATIONS.filter(s =>
    activeFuel === "Все" || FUELS_BY_STATION[s.id].some(f => f.type === activeFuel && f.avail > 0)
  );

  /* ── deep cobalt from reference image ── */
  const BG = "linear-gradient(160deg, #0C0EA8 0%, #090B82 40%, #060760 75%, #040450 100%)";
  const HEADER_BG = "rgba(8,9,100,0.88)";
  const MODAL_BG  = "rgba(6,7,75,0.97)";

  return (
    <div style={{
      width:390, height:844, position:"relative", overflow:"hidden",
      fontFamily:"'Inter',system-ui,sans-serif", color:"#fff",
      background: BG,
    }}>
      <style>{EXTRA_CSS}</style>

      {/* ── STARFIELD + MAP BG ── */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        <Stars n={110} />

        {/* Road grid — slightly brighter to match vivid blue */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.22 }}>
          <line x1="28%" y1="0"   x2="44%" y2="100%" stroke="#818cf8" strokeWidth="1.5"/>
          <line x1="66%" y1="0"   x2="51%" y2="100%" stroke="#818cf8" strokeWidth="1.5"/>
          <line x1="0"   y1="36%" x2="100%" y2="41%" stroke="#818cf8" strokeWidth="1"/>
          <line x1="0"   y1="63%" x2="100%" y2="58%" stroke="#818cf8" strokeWidth="1"/>
          <line x1="0"   y1="0"   x2="100%" y2="100%" stroke="#6366f1" strokeWidth=".8" strokeDasharray="5 9"/>
          <line x1="100%" y1="0"  x2="0"   y2="100%" stroke="#6366f1" strokeWidth=".6" strokeDasharray="4 14" opacity=".6"/>
        </svg>

        {/* Neighbourhood labels */}
        {[
          { x:"10%", y:"20%", text:"СЕВЕРНАЯ" },
          { x:"54%", y:"13%", text:"ЦЕНТР" },
          { x:"70%", y:"48%", text:"КОРАБЕЛ." },
          { x:"18%", y:"70%", text:"ГАГАРИНСКИЙ" },
        ].map(l => (
          <div key={l.text} style={{
            position:"absolute", left:l.x, top:l.y,
            fontSize:7.5, fontWeight:800, letterSpacing:"0.22em",
            color:"rgba(160,180,255,0.22)", textTransform:"uppercase",
            pointerEvents:"none", zIndex:2,
          }}>{l.text}</div>
        ))}

        {/* Global ambient glow from selected network — bleeds into the map */}
        {nc && (
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            height:320,
            background:`radial-gradient(ellipse at 50% 110%, ${nc.ambient}1a 0%, transparent 70%)`,
            pointerEvents:"none", zIndex:3,
            transition:"background .6s ease",
          }} />
        )}
      </div>

      {/* ── STATION MARKERS ── */}
      {visibleStations.map(s => {
        const isSelected = s.id === selectedId;
        const avColor    = AVAIL_COLOR[s.status];
        const sn         = NET[s.network];
        return (
          <div key={s.id}
            onClick={() => setSelectedId(isSelected ? null : s.id)}
            style={{
              position:"absolute",
              left:`${s.x}%`,
              top:`${(s.y / 100) * 68 + 12}%`,
              transform:"translate(-50%,-50%)",
              zIndex: isSelected ? 15 : 6,
              cursor:"pointer",
            }}>

            {/* Network brand ring — Mercedes ambient concept: outer ring = brand color */}
            <div style={{
              position:"absolute", top:"50%", left:"50%",
              width: isSelected ? 36 : 24,
              height: isSelected ? 36 : 24,
              borderRadius:"50%",
              transform:"translate(-50%,-50%)",
              border:`${isSelected ? 1.5 : 1}px solid ${sn.glow}${isSelected ? "cc" : "66"}`,
              boxShadow:`0 0 ${isSelected ? 20 : 10}px ${sn.glow}${isSelected ? "88" : "44"},
                         0 0 ${isSelected ? 40 : 18}px ${sn.glow}${isSelected ? "33" : "22"}`,
              transition:"all .25s ease",
            }} />

            {/* Availability pulse */}
            <div className="marker-pulse" style={{
              position:"absolute", top:"50%", left:"50%",
              width: isSelected ? 22 : 15,
              height: isSelected ? 22 : 15,
              borderRadius:"50%",
              background: avColor,
              animationDuration: s.status === "green" ? "2.2s" : s.status === "yellow" ? "1.6s" : "1s",
            }} />

            {/* Core dot — inner fill = availability, outer ring = brand */}
            <div style={{
              width:  isSelected ? 16 : 10,
              height: isSelected ? 16 : 10,
              borderRadius:"50%",
              background: isSelected
                ? `radial-gradient(circle at 35% 30%, #fff, ${avColor})`
                : avColor,
              boxShadow:`0 0 ${isSelected ? 18 : 8}px ${avColor},
                         0 0 ${isSelected ? 36 : 16}px ${avColor}55,
                         inset 0 0 4px rgba(255,255,255,0.3)`,
              border:`${isSelected ? 2 : 1.5}px solid rgba(255,255,255,${isSelected ? .95 : .45})`,
              position:"relative", zIndex:2,
            }} />

            {/* Network logo badge on selected */}
            {isSelected && (
              <div style={{
                position:"absolute",
                top:"-4px", right:"-4px",
                width:14, height:14,
                borderRadius:"50%",
                background: sn.glow,
                border:"1.5px solid rgba(255,255,255,0.8)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:7, fontWeight:900, color:"#fff",
                boxShadow:`0 0 8px ${sn.glow}`,
                zIndex:3,
              }}>{sn.logoChar}</div>
            )}

            {/* Callout label on selected */}
            {isSelected && (
              <div style={{
                position:"absolute", bottom:"calc(100% + 8px)", left:"50%",
                transform:"translateX(-50%)",
                background:`rgba(4,4,60,0.95)`,
                backdropFilter:"blur(16px)",
                border:`1px solid ${sn.glow}66`,
                borderRadius:9, padding:"4px 10px", whiteSpace:"nowrap",
                fontSize:11, fontWeight:800, color:"#fff",
                boxShadow:`0 2px 16px ${sn.glow}44, 0 0 0 1px ${sn.glow}22`,
              }}>
                {s.name}
                {/* tiny ambient strip at bottom of callout */}
                <AmbientStrip color={sn.ambient} thickness={1.5} style={{ bottom:0, left:0, right:0, borderRadius:"0 0 9px 9px" }} />
              </div>
            )}
          </div>
        );
      })}

      {/* ── HEADER ── */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, zIndex:30,
        background: HEADER_BG,
        backdropFilter:"blur(24px)",
        padding:"12px 16px 10px",
      }}>
        {/* Mercedes ambient strip — bottom of header, brand color */}
        <AmbientStrip
          color={nc ? nc.ambient : "#6366f1"}
          thickness={1.5}
          style={{ bottom:0, left:0, right:0 }}
        />

        {/* Search row */}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{
            flex:1,
            background:"rgba(255,255,255,0.05)",
            backdropFilter:"blur(16px)",
            border:"1px solid rgba(130,140,255,0.2)",
            borderRadius:13, padding:"9px 14px",
            display:"flex", alignItems:"center", gap:9,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="rgba(160,175,255,0.45)" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span style={{ fontSize:13, color:"rgba(180,195,255,0.35)" }}>Поиск АЗС...</span>
          </div>

          <button onClick={() => setFiltersOpen(true)} style={{
            width:40, height:40, borderRadius:13, border:"none",
            background: filtersOpen
              ? "linear-gradient(135deg,#3730d4,#2120b0)"
              : "rgba(255,255,255,0.05)",
            backdropFilter:"blur(16px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", flexShrink:0,
            boxShadow: filtersOpen ? "0 0 18px rgba(99,102,241,0.65)" : "none",
            outline:"none",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={filtersOpen ? "#fff" : "rgba(160,175,255,0.6)"} strokeWidth="2.2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Fuel chips */}
        <div style={{ display:"flex", gap:6, marginTop:8, overflowX:"auto" }} className="scroll-hidden">
          {FILTER_OPTS.map(f => {
            const on = activeFuel === f;
            return (
              <button key={f} onClick={() => setActiveFuel(f)} style={{
                flexShrink:0,
                background: on
                  ? "linear-gradient(135deg,#E8622A,#c04010)"
                  : "rgba(255,255,255,0.04)",
                backdropFilter:"blur(10px)",
                border:`1px solid ${on ? "#E8622A88" : "rgba(120,130,255,0.18)"}`,
                borderRadius:20, padding:"4px 13px",
                fontSize:12, fontWeight:700,
                color: on ? "#fff" : "rgba(180,195,255,0.55)",
                boxShadow: on ? "0 0 16px rgba(232,98,42,0.55)" : "none",
                cursor:"pointer", outline:"none",
              }}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* ── LEGEND pill ── */}
      <div style={{
        position:"absolute",
        bottom: selected ? 496 : 82,
        right:16, zIndex:20,
        background:"rgba(5,6,70,0.85)",
        backdropFilter:"blur(18px)",
        border:"1px solid rgba(120,130,255,0.2)",
        borderRadius:13, padding:"8px 12px",
        display:"flex", flexDirection:"column", gap:5,
        transition:"bottom .38s cubic-bezier(.16,1,.3,1)",
        overflow:"hidden",
      }}>
        {/* micro ambient strip on legend */}
        {nc && <AmbientStrip color={nc.ambient} thickness={1} style={{ top:0 }} />}
        {[["green","Есть"],["yellow","Мало"],["red","Нет"]].map(([st,lb]) => (
          <div key={st} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%",
              background: AVAIL_COLOR[st],
              boxShadow:`0 0 7px ${AVAIL_COLOR[st]}` }} />
            <span style={{ fontSize:10, color:"rgba(185,200,255,0.7)", fontWeight:600 }}>{lb}</span>
          </div>
        ))}
      </div>

      {/* ── STATION DETAIL MODAL ── */}
      {selected && nc && (
        <div className="modal-slide" style={{
          position:"absolute", bottom:0, left:0, right:0,
          zIndex:25, height:484,
          background: MODAL_BG,
          backdropFilter:"blur(56px)",
          borderRadius:"26px 26px 0 0",
          display:"flex", flexDirection:"column",
          overflow:"hidden",
        }}>
          {/* Mercedes ambient top edge of modal — brand color */}
          <AmbientStrip color={nc.ambient} thickness={2} style={{ top:0, left:0, right:0 }} />

          {/* Subtle brand glow inside modal top */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:180,
            background:`radial-gradient(ellipse at 50% 0%, ${nc.ambient}18 0%, transparent 70%)`,
            pointerEvents:"none",
          }} />

          {/* Drag handle */}
          <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 6px", flexShrink:0 }}>
            <div style={{ width:40, height:4, borderRadius:2, background:`${nc.ambient}55` }} />
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"0 18px 16px" }} className="scroll-hidden">

            {/* Station name */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:900, letterSpacing:"-0.02em", lineHeight:1.2 }}>
                    {selected.name}
                  </div>
                  <div style={{ fontSize:12, color:"rgba(170,185,255,0.5)", marginTop:3 }}>
                    📍 {selected.address}
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} style={{
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:11, width:32, height:32,
                  color:"rgba(255,255,255,0.45)", fontSize:14,
                  cursor:"pointer", flexShrink:0, outline:"none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>✕</button>
              </div>

              <div style={{ display:"flex", gap:6, marginTop:9 }}>
                {/* Network badge — brand color */}
                <span style={{
                  fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:7,
                  background:`${nc.glow}20`,
                  border:`1px solid ${nc.glow}55`,
                  color: nc.glow,
                  boxShadow:`0 0 12px ${nc.glow}40`,
                }}>{nc.label}</span>

                <span style={{
                  fontSize:11, padding:"3px 10px", borderRadius:7,
                  background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  color:"rgba(255,215,80,0.9)",
                }}>★ {selected.rating}</span>

                <span style={{
                  fontSize:11, padding:"3px 10px", borderRadius:7,
                  background:`${AVAIL_COLOR[selected.status]}18`,
                  border:`1px solid ${AVAIL_COLOR[selected.status]}44`,
                  color:AVAIL_COLOR[selected.status],
                }}>
                  {selected.status === "green" ? "● Открыта" : selected.status === "yellow" ? "● Мало" : "● Закрыта"}
                </span>
              </div>
            </div>

            {/* Fuel prices */}
            <div style={{
              background:"rgba(255,255,255,0.03)",
              border:`1px solid ${nc.glow}22`,
              borderRadius:18, padding:"13px 15px", marginBottom:12,
              position:"relative", overflow:"hidden",
            }}>
              {/* subtle side ambient strips — like Mercedes door panels */}
              <div style={{
                position:"absolute", top:0, bottom:0, left:0, width:2,
                background:`linear-gradient(180deg, transparent, ${nc.ambient}88, transparent)`,
                animation:"ambientPulse 2.6s ease-in-out infinite",
              }} />
              <div style={{
                position:"absolute", top:0, bottom:0, right:0, width:2,
                background:`linear-gradient(180deg, transparent, ${nc.ambient}88, transparent)`,
                animation:"ambientPulse 2.6s ease-in-out infinite",
              }} />

              <div style={{
                fontSize:10, fontWeight:700, letterSpacing:"0.18em",
                textTransform:"uppercase", color:"rgba(150,165,255,0.45)",
                marginBottom:11,
              }}>ТОПЛИВО · ЦЕНЫ · НАЛИЧИЕ</div>

              {fuels.map(f => (
                <div key={f.type} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                  <span style={{ fontSize:13, fontWeight:800, width:44, color:"#fff", letterSpacing:"-0.02em" }}>
                    {f.type}
                  </span>
                  <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
                    <div style={{
                      width:`${f.avail}%`, height:"100%", borderRadius:4,
                      background:`linear-gradient(90deg, ${AVAIL_COLOR[f.status]}88, ${AVAIL_COLOR[f.status]})`,
                      boxShadow:`0 0 8px ${AVAIL_COLOR[f.status]}`,
                    }} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:AVAIL_COLOR[f.status], width:66, textAlign:"right" }}>
                    {f.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Crowd report */}
            <div style={{ display:"flex", gap:7, marginBottom:13 }}>
              {[
                { label:"✅ Есть",  color:"#00E676" },
                { label:"⚠️ Мало",  color:"#FFD600" },
                { label:"❌ Нет",   color:"#FF1744" },
              ].map(({ label, color }) => (
                <button key={label} style={{
                  flex:1, padding:"8px 0", borderRadius:12,
                  border:`1px solid ${color}33`,
                  background:`${color}0c`,
                  color:`${color}cc`,
                  fontSize:12, fontWeight:700, cursor:"pointer", outline:"none",
                }}>{label}</button>
              ))}
            </div>

            {/* CTA — network color glow on button */}
            <button style={{
              width:"100%", padding:"15px 0", borderRadius:18, border:"none",
              background:"linear-gradient(135deg,#E8622A 0%,#c04010 60%,#9a2f08 100%)",
              color:"#fff", fontSize:15, fontWeight:900, cursor:"pointer",
              letterSpacing:"0.05em", textTransform:"uppercase",
              outline:"none", position:"relative", overflow:"hidden",
              boxShadow:`0 4px 28px rgba(232,98,42,0.55), 0 0 0 1px rgba(232,98,42,0.25)`,
            }}>
              Купить талон ⛽
              {/* Mercedes light strip on CTA button */}
              <AmbientStrip color={nc.ambient} thickness={1.5} style={{ bottom:0, left:0, right:0, opacity:.7 }} />
            </button>
          </div>

          {/* Bottom nav */}
          <div style={{
            height:68, background:"rgba(4,4,55,0.95)",
            backdropFilter:"blur(24px)",
            borderTop:`1px solid ${nc.glow}22`,
            display:"flex", alignItems:"center", justifyContent:"space-around",
            flexShrink:0, position:"relative", overflow:"hidden",
          }}>
            <AmbientStrip color={nc.ambient} thickness={1} style={{ top:0 }} />
            {[
              { icon:"🗺", label:"Карта",     active:true  },
              { icon:"🎟", label:"Талоны",    active:false },
              { icon:"⚡", label:"ИИ",        active:false },
              { icon:"🎮", label:"Игры",      active:false },
              { icon:"💎", label:"Хранилище", active:false },
            ].map(t => (
              <div key={t.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <span style={{ fontSize:20, opacity:t.active ? 1 : .35 }}>{t.icon}</span>
                <span style={{ fontSize:9, fontWeight:700,
                  color: t.active ? nc.ambient : "rgba(170,185,255,0.3)",
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
          background:"rgba(5,6,65,0.94)", backdropFilter:"blur(24px)",
          borderTop:"1px solid rgba(120,130,255,0.18)",
          display:"flex", alignItems:"center", justifyContent:"space-around",
          overflow:"hidden",
        }}>
          <AmbientStrip color="#6366f1" thickness={1} style={{ top:0 }} />
          {[
            { icon:"🗺", label:"Карта",     active:true  },
            { icon:"🎟", label:"Талоны",    active:false },
            { icon:"⚡", label:"ИИ",        active:false },
            { icon:"🎮", label:"Игры",      active:false },
            { icon:"💎", label:"Хранилище", active:false },
          ].map(t => (
            <div key={t.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span style={{ fontSize:20, opacity:t.active ? 1 : .35 }}>{t.icon}</span>
              <span style={{ fontSize:9, fontWeight:700,
                color: t.active ? "#E8622A" : "rgba(170,185,255,0.3)",
                letterSpacing:"0.04em",
              }}>{t.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── FILTER PANEL ── */}
      {filtersOpen && (
        <>
          <div className="fade-in" onClick={() => setFiltersOpen(false)} style={{
            position:"absolute", inset:0, zIndex:40,
            background:"rgba(3,4,45,0.65)", backdropFilter:"blur(4px)",
          }} />
          <div className="modal-slide" style={{
            position:"absolute", bottom:0, left:0, right:0,
            zIndex:50, borderRadius:"26px 26px 0 0",
            background:"rgba(5,6,70,0.98)", backdropFilter:"blur(56px)",
            border:"1px solid rgba(120,130,255,0.2)",
            borderBottom:"none", padding:"0 20px 32px",
            overflow:"hidden",
          }}>
            <AmbientStrip color="#6366f1" thickness={2} style={{ top:0 }} />
            <div style={{ display:"flex", justifyContent:"center", padding:"14px 0 18px" }}>
              <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em",
                textTransform:"uppercase", color:"rgba(150,165,255,0.45)", marginBottom:9 }}>Сортировка</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {SORT_OPTS.map(o => {
                  const on = activeSort === o;
                  return (
                    <button key={o} onClick={() => setActiveSort(o)} style={{
                      padding:"6px 14px", borderRadius:20,
                      border:`1px solid ${on ? "#4f52dd" : "rgba(120,130,255,0.18)"}`,
                      background: on ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.03)",
                      color: on ? "#a5b4fc" : "rgba(180,195,255,0.5)",
                      fontSize:12, fontWeight:700, cursor:"pointer", outline:"none",
                      boxShadow: on ? "0 0 14px rgba(99,102,241,0.35)" : "none",
                    }}>{o}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em",
                textTransform:"uppercase", color:"rgba(150,165,255,0.45)", marginBottom:9 }}>Сеть АЗС</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {NET_OPTS.map(o => {
                  const on = activeNet === o;
                  return (
                    <button key={o} onClick={() => setActiveNet(o)} style={{
                      padding:"6px 14px", borderRadius:20,
                      border:`1px solid ${on ? "#E8622A88" : "rgba(120,130,255,0.18)"}`,
                      background: on ? "rgba(232,98,42,0.16)" : "rgba(255,255,255,0.03)",
                      color: on ? "#E8622A" : "rgba(180,195,255,0.5)",
                      fontSize:12, fontWeight:700, cursor:"pointer", outline:"none",
                      boxShadow: on ? "0 0 14px rgba(232,98,42,0.38)" : "none",
                    }}>{o}</button>
                  );
                })}
              </div>
            </div>

            <button onClick={() => setFiltersOpen(false)} style={{
              width:"100%", padding:"14px 0", borderRadius:18, border:"none",
              background:"linear-gradient(135deg,#E8622A,#c04010)",
              color:"#fff", fontSize:15, fontWeight:900, cursor:"pointer",
              boxShadow:"0 4px 24px rgba(232,98,42,0.5)",
              letterSpacing:"0.08em", textTransform:"uppercase", outline:"none",
              position:"relative", overflow:"hidden",
            }}>
              Применить
            </button>
          </div>
        </>
      )}
    </div>
  );
}
