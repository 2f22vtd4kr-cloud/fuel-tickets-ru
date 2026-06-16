import { useEffect, useState } from "react";
import QRCode from "qrcode";

const HASH = "TLN-7F3A9C2E-AI95-60L-SEV042-20260616";
const MOCK_REMAINING_S = 72000; // 20h

export default function FuelTicket() {
  return <TicketPreview remainingSeconds={MOCK_REMAINING_S} hash={HASH} />;
}

export function TicketPreview({ remainingSeconds, hash }: { remainingSeconds: number; hash: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [remaining, setRemaining] = useState(remainingSeconds);

  useEffect(() => {
    QRCode.toDataURL(hash, { width: 300, margin: 2, color: { dark: "#0f0f0f", light: "#f0f0f4" } })
      .then(setDataUrl).catch(() => {});
  }, [hash]);

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const timerColor = remaining > 21600 ? "#22c55e" : remaining > 3600 ? "#eab308" : "#ef4444";
  const timerBg = remaining > 21600 ? "rgba(34,197,94,0.1)" : remaining > 3600 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)";
  const timerBorder = remaining > 21600 ? "rgba(34,197,94,0.3)" : remaining > 3600 ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)";
  const now = new Date();

  return (
    <div style={{ minHeight: "100vh", background: "#050507", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "1rem" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(168,85,247,0.02) 3px,rgba(168,85,247,0.02) 4px)" }} />
      <div style={{ background: "linear-gradient(160deg, #0d0d18, #120820)", border: "1px solid #a855f755", borderRadius: "24px", padding: "1.5rem", textAlign: "center", maxWidth: "300px", width: "100%", position: "relative", overflow: "hidden", boxShadow: "0 0 60px #a855f722, 0 0 120px #db277711" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #a855f7, #db2777, transparent)" }} />

        {/* Header */}
        <div style={{ marginBottom: "0.85rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a855f7", fontSize: "0.5rem", letterSpacing: "0.2em", marginBottom: "0.25rem" }}>⛽️ ТОПЛИВНЫЙ ВАУЧЕР</div>
          <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>Предъявите QR контролёру</p>
          <p style={{ color: "#4b5563", fontSize: "0.62rem", margin: "0.2rem 0 0" }}>
            {now.toLocaleDateString("ru", { day: "2-digit", month: "long", year: "numeric" })} · {now.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Fuel + countdown row */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem", alignItems: "stretch" }}>
          {/* Fuel centered */}
          <div style={{ flex: 1, background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "12px", padding: "0.55rem 0.75rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "#4b5563", fontSize: "0.48rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "3px" }}>ТОПЛИВО / ОБЪЁМ</div>
            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.8rem" }}>АИ-95 · 60 л</div>
          </div>
          {/* Timer */}
          <div style={{ flex: 1, background: timerBg, border: `1px solid ${timerBorder}`, borderRadius: "12px", padding: "0.55rem 0.75rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: timerColor, fontSize: "0.48rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "3px", opacity: 0.7 }}>ДЕЙСТВИТЕЛЕН</div>
            <div style={{ color: timerColor, fontWeight: 800, fontSize: "0.85rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.04em" }}>{timeStr}</div>
          </div>
        </div>

        {/* Station */}
        <div style={{ background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "12px", padding: "0.5rem 0.9rem", marginBottom: "0.85rem", textAlign: "left" }}>
          <div style={{ color: "#4b5563", fontSize: "0.48rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "2px" }}>СТАНЦИЯ</div>
          <div style={{ color: "#9ca3af", fontSize: "0.72rem" }}>⛽ Роснефть АЗС #42 · Севастополь</div>
        </div>

        {/* QR */}
        <div style={{ position: "relative", display: "inline-block", margin: "0 auto" }}>
          <div style={{ width: "200px", height: "200px", margin: "0 auto", borderRadius: "16px", overflow: "hidden", border: "2px solid #a855f744", boxShadow: "0 0 30px #a855f730, inset 0 0 20px #a855f710" }}>
            {dataUrl ? <img src={dataUrl} alt="QR" style={{ width: "100%", height: "100%", display: "block" }} /> : <div style={{ width: "100%", height: "100%", background: "#0b0b0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7" }}>⟳</div>}
          </div>
          {(["tl","tr","bl","br"] as const).map((k) => (
            <div key={k} style={{ position: "absolute", width: "16px", height: "16px", borderColor: "#a855f7", borderStyle: "solid", borderWidth: 0, ...(k==="tl"?{top:0,left:0,borderTopWidth:"2px",borderLeftWidth:"2px",borderTopLeftRadius:"4px"}:k==="tr"?{top:0,right:0,borderTopWidth:"2px",borderRightWidth:"2px",borderTopRightRadius:"4px"}:k==="bl"?{bottom:0,left:0,borderBottomWidth:"2px",borderLeftWidth:"2px",borderBottomLeftRadius:"4px"}:{bottom:0,right:0,borderBottomWidth:"2px",borderRightWidth:"2px",borderBottomRightRadius:"4px"}) }} />
          ))}
        </div>

        {/* Hash */}
        <div style={{ margin: "0.8rem 0 0.25rem", padding: "0.5rem 0.75rem", background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.52rem", color: "#4b5563", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hash}</span>
          <span style={{ fontSize: "0.7rem", color: "#6b7280", flexShrink: 0 }}>⎘</span>
        </div>
        <p style={{ color: "#374151", fontSize: "0.52rem", margin: "0.25rem 0 0.65rem" }}>Нажмите на код для копирования</p>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "0.65rem" }}>
          {[{icon:"📷",label:"Сохранить PNG"},{icon:"📄",label:"Скачать PDF"},{icon:"📋",label:"Скопировать"},{icon:"📤",label:"В Telegram"}].map(({icon,label}) => (
            <button key={label} style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "10px", padding: "0.45rem 0.35rem", color: "#c4b5fd", fontSize: "0.62rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <span style={{ fontSize: "0.75rem" }}>{icon}</span>{label}
            </button>
          ))}
        </div>

        <button style={{ width: "100%", padding: "0.65rem", background: "linear-gradient(135deg,#a855f7,#db2777)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 0 16px #a855f740" }}>Закрыть</button>

        {/* Status */}
        <div style={{ marginTop: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: timerColor, boxShadow: `0 0 6px ${timerColor}` }} />
          <span style={{ color: timerColor, fontSize: "0.58rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.08em" }}>АКТИВЕН</span>
        </div>
      </div>
    </div>
  );
}
