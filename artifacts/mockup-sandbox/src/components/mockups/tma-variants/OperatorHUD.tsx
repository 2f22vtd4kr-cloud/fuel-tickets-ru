import { useState } from "react";

const DOMAIN = "#020204";
const GREEN = "#22c55e";
const YELLOW = "#eab308";
const RED = "#ef4444";
const VIOLET = "#a855f7";
const MAGENTA = "#db2777";

const REGIONS = [
  { name: "Северная",   pct: 82, zone: "standard", g: 8, y: 2, r: 0 },
  { name: "Нахимовский",pct: 54, zone: "critical",  g: 5, y: 3, r: 2 },
  { name: "Гагаринский",pct: 34, zone: "standard",  g: 3, y: 4, r: 3 },
  { name: "Балаклавский",pct: 11, zone: "critical", g: 1, y: 2, r: 7 },
  { name: "Ленинский",  pct: 68, zone: "eastern",   g: 6, y: 3, r: 1 },
  { name: "Симферополь",pct: 77, zone: "eastern",   g: 7, y: 2, r: 1 },
];

const EVENTS = [
  { t: "08:41", sev: "CRIT", msg: "ДФЦ АИ-95 / Гагаринский" },
  { t: "08:37", sev: "WARN", msg: "ДТ мало / Балаклавский" },
  { t: "08:22", sev: "INFO", msg: "АИ-92 пополн / Нахимовский" },
  { t: "08:15", sev: "OK",   msg: "Северная — норма" },
  { t: "07:58", sev: "WARN", msg: "▲6.3% АИ-92 / Ленинский" },
];

const SEV_COLOR: Record<string, string> = { CRIT: RED, WARN: YELLOW, INFO: "#3b82f6", OK: GREEN };

function MiniBar({ pct }: { pct: number }) {
  const c = pct >= 60 ? GREEN : pct >= 25 ? YELLOW : RED;
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      <div style={{ width: "44px", height: "5px", background: "#12121a", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: c }} />
      </div>
      <span style={{ color: c, fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, width: "26px", textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

export function OperatorHUD() {
  const [activePanel, setActivePanel] = useState<"buy" | null>(null);
  const [fuel, setFuel] = useState("АИ-92");

  const globalPct = Math.round(REGIONS.reduce((s, r) => s + r.pct, 0) / REGIONS.length);
  const indexColor = globalPct >= 60 ? GREEN : globalPct >= 25 ? YELLOW : RED;
  const crisisCount = REGIONS.filter(r => r.pct < 25).length;

  return (
    <div style={{ width: "390px", height: "844px", background: DOMAIN, fontFamily: "'JetBrains Mono',monospace", display: "flex", flexDirection: "column", overflow: "hidden", color: "#e2e8f0" }}>

      {/* Full scan lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(168,85,247,0.018) 2px,rgba(168,85,247,0.018) 3px)", pointerEvents: "none", zIndex: 100 }} />

      {/* ── STATUS BAR ── */}
      <div style={{ background: "#08080f", borderBottom: "1px solid #1e1e2a", padding: "0.35rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: VIOLET, fontSize: "0.55rem", letterSpacing: "0.12em" }}>ТОПЛ_УЗ v3.1</span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <span style={{ color: "#374151", fontSize: "0.52rem" }}>08:41:22</span>
          <span style={{ color: GREEN, fontSize: "0.52rem" }}>● LIVE</span>
          <span style={{ color: "#374151", fontSize: "0.52rem" }}>SIG:98%</span>
        </div>
      </div>

      {/* ── MAIN HUD AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── ROW 1: INDEX + FUEL PRICES ── */}
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderBottom: "1px solid #0f0f18", flexShrink: 0 }}>
          {/* Index block */}
          <div style={{ borderRight: "1px solid #0f0f18", padding: "0.5rem 0.6rem", background: "#05050a" }}>
            <div style={{ color: "#374151", fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "0.1rem" }}>ИНДЕКС_СЕТИ</div>
            <div style={{ color: indexColor, fontSize: "2.6rem", fontWeight: 900, lineHeight: 1, textShadow: `0 0 16px ${indexColor}` }}>
              {globalPct}<span style={{ fontSize: "1rem" }}>%</span>
            </div>
            <div style={{ marginTop: "0.2rem" }}>
              <div style={{ height: "3px", background: "#12121a", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${globalPct}%`, background: indexColor, borderRadius: "2px" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.25rem" }}>
              <span style={{ color: GREEN, fontSize: "0.52rem" }}>🟢{REGIONS.reduce((s,r)=>s+r.g,0)}</span>
              <span style={{ color: YELLOW, fontSize: "0.52rem" }}>🟡{REGIONS.reduce((s,r)=>s+r.y,0)}</span>
              <span style={{ color: RED, fontSize: "0.52rem" }}>🔴{REGIONS.reduce((s,r)=>s+r.r,0)}</span>
            </div>
          </div>

          {/* Price grid */}
          <div style={{ padding: "0.4rem 0.5rem" }}>
            <div style={{ color: "#374151", fontSize: "0.38rem", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>МАТРИЦА_ЦЕН · ₽/л</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem" }}>
              {[
                { f: "АИ-92", p: 62, m: 1.04, color: VIOLET },
                { f: "АИ-95", p: 68, m: 1.07, color: MAGENTA },
                { f: "ДТ",    p: 71, m: 1.02, color: YELLOW },
                { f: "Газ",   p: 32, m: 0.99, color: GREEN },
              ].map(({ f, p, m, color }) => (
                <div key={f} style={{ background: "#0a0a12", border: `1px solid ${color}18`, borderRadius: "6px", padding: "0.25rem 0.35rem" }}>
                  <div style={{ color: "#374151", fontSize: "0.38rem" }}>{f}</div>
                  <div style={{ color, fontSize: "0.9rem", fontWeight: 800 }}>{p}₽</div>
                  <div style={{ color: m > 1 ? RED : GREEN, fontSize: "0.45rem" }}>{m > 1 ? "▲" : "▼"}{Math.abs((m-1)*100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 2: REGION TABLE ── */}
        <div style={{ flexShrink: 0, borderBottom: "1px solid #0f0f18" }}>
          <div style={{ padding: "0.3rem 0.75rem 0.15rem", background: "#06060c", borderBottom: "1px solid #0f0f18" }}>
            <div style={{ color: "#374151", fontSize: "0.38rem", letterSpacing: "0.12em" }}>РЕГИОНЫ_МОНИТОРИНГ · {REGIONS.length}_ЗОН</div>
          </div>
          {REGIONS.map((r) => {
            const c = r.pct >= 60 ? GREEN : r.pct >= 25 ? YELLOW : RED;
            return (
              <div key={r.name} style={{
                display: "grid", gridTemplateColumns: "90px 1fr 40px",
                alignItems: "center", padding: "0.28rem 0.75rem",
                borderBottom: "1px solid #08080f",
                background: r.pct < 25 ? "#1a04041a" : "transparent",
                borderLeft: `2px solid ${c}44`,
              }}>
                <div style={{ color: r.pct < 25 ? "#fca5a5" : "#d1d5db", fontSize: "0.62rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                <MiniBar pct={r.pct} />
                <div style={{ color: "#374151", fontSize: "0.5rem", textAlign: "right", textTransform: "uppercase" }}>{r.zone.slice(0,3)}</div>
              </div>
            );
          })}
        </div>

        {/* ── ROW 3: SPLIT — ALERTS + ORDER ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1, overflow: "hidden", borderBottom: "1px solid #0f0f18" }}>
          {/* Events ticker */}
          <div style={{ borderRight: "1px solid #0f0f18", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "0.3rem 0.6rem", background: "#06060c", borderBottom: "1px solid #0f0f18", flexShrink: 0 }}>
              <div style={{ color: "#374151", fontSize: "0.38rem", letterSpacing: "0.1em" }}>СОБЫТИЯ · ЛЕНТА</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0.25rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {EVENTS.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: "0.35rem", alignItems: "flex-start", borderBottom: "1px solid #0a0a0f", paddingBottom: "0.25rem" }}>
                  <span style={{ color: "#374151", fontSize: "0.5rem", flexShrink: 0, marginTop: "1px" }}>{e.t}</span>
                  <span style={{ color: SEV_COLOR[e.sev], fontSize: "0.5rem", flexShrink: 0, fontWeight: 700 }}>[{e.sev}]</span>
                  <span style={{ color: "#9ca3af", fontSize: "0.5rem", lineHeight: 1.3 }}>{e.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order panel */}
          <div style={{ display: "flex", flexDirection: "column", padding: "0.4rem 0.6rem", gap: "0.35rem" }}>
            <div style={{ color: "#374151", fontSize: "0.38rem", letterSpacing: "0.1em", marginBottom: "0.05rem" }}>ОРДЕР · БЫСТРЫЙ</div>
            {["АИ-92","АИ-95","ДТ","Газ"].map(f => (
              <button key={f} onClick={() => setFuel(f)}
                style={{ background: fuel === f ? `${VIOLET}18` : "#08080f", border: `1px solid ${fuel === f ? VIOLET+"44" : "#1e1e2a"}`, borderRadius: "6px", padding: "0.3rem 0.5rem", color: fuel === f ? VIOLET : "#4b5563", fontSize: "0.62rem", cursor: "pointer", textAlign: "left" }}>
                {f} {fuel === f ? "◀ ВЫБРАН" : ""}
              </button>
            ))}
            <div style={{ marginTop: "auto" }}>
              <div style={{ color: "#374151", fontSize: "0.45rem", marginBottom: "0.2rem" }}>ОБЪЁМ:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25rem" }}>
                {["20L","40L","60L"].map(v => (
                  <button key={v} style={{ background: v === "40L" ? `${MAGENTA}18` : "#08080f", border: `1px solid ${v === "40L" ? MAGENTA+"44" : "#1e1e2a"}`, borderRadius: "5px", padding: "0.3rem 0", color: v === "40L" ? MAGENTA : "#4b5563", fontSize: "0.6rem", cursor: "pointer" }}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ padding: "0.5rem 0.75rem", flexShrink: 0, background: "#06060c" }}>
          {crisisCount > 0 && (
            <div style={{ background: "#1a040410", border: "1px solid #ef444430", borderRadius: "6px", padding: "0.25rem 0.6rem", marginBottom: "0.4rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ color: RED, fontSize: "0.52rem" }}>⚠ ALERT:</span>
              <span style={{ color: "#fca5a5", fontSize: "0.52rem" }}>{crisisCount} крит. региона · закупайтесь сейчас</span>
            </div>
          )}
          <button style={{
            width: "100%", background: `linear-gradient(135deg, ${VIOLET}cc, ${MAGENTA}cc)`,
            border: `1px solid ${VIOLET}44`, borderRadius: "8px", padding: "0.65rem",
            color: "#fff", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer",
            boxShadow: `0 0 16px ${VIOLET}30`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          }}>
            🎫 ИСПОЛНИТЬ ОРДЕР · {fuel}
          </button>
        </div>
      </div>
    </div>
  );
}
