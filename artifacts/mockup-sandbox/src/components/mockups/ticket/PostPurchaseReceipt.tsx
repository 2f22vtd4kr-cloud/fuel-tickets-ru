import { useEffect, useState } from "react";
import QRCode from "qrcode";

const HASH = "TLN-7F3A9C2E-AI95-60L-SEV042-20260616";

export default function PostPurchaseReceipt() {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [phase, setPhase] = useState<"success" | "ticket">("success");

  useEffect(() => {
    QRCode.toDataURL(HASH, { width: 280, margin: 2, color: { dark: "#0f0f0f", light: "#f0f0f4" } })
      .then(setDataUrl).catch(() => {});
  }, []);

  const now = new Date();

  return (
    <div style={{ minHeight: "100vh", background: "#050507", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "1rem" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(34,197,94,0.015) 3px,rgba(34,197,94,0.015) 4px)" }} />

      <div style={{ background: "linear-gradient(160deg, #0a0f0a, #0d180d)", border: "1px solid #22c55e44", borderRadius: "24px", padding: "1.5rem", textAlign: "center", maxWidth: "300px", width: "100%", position: "relative", overflow: "hidden", boxShadow: "0 0 60px #22c55e18, 0 0 120px #22c55e0a" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #22c55e, #a855f7, transparent)" }} />

        {/* Toggle tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "1rem", background: "#0b0b0f", borderRadius: "10px", padding: "3px" }}>
          {(["success","ticket"] as const).map((p) => (
            <button key={p} onClick={() => setPhase(p)} style={{ flex: 1, padding: "0.35rem", borderRadius: "8px", border: "none", background: phase === p ? (p === "success" ? "#22c55e22" : "#a855f722") : "transparent", color: phase === p ? (p === "success" ? "#22c55e" : "#a855f7") : "#4b5563", fontSize: "0.65rem", fontWeight: phase === p ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              {p === "success" ? "✓ Оплата" : "🎫 Талон"}
            </button>
          ))}
        </div>

        {phase === "success" ? (
          <>
            {/* Success icon */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", boxShadow: "0 0 24px rgba(34,197,94,0.25)" }}>
                <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>✓</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#22c55e", fontSize: "0.48rem", letterSpacing: "0.2em", marginBottom: "0.25rem" }}>ОПЛАТА_ПОДТВЕРЖДЕНА</div>
              <h3 style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "1rem", margin: "0 0 0.25rem" }}>Талон выдан!</h3>
              <p style={{ color: "#6b7280", fontSize: "0.72rem", margin: 0 }}>Ваучер активен 24 часа</p>
            </div>

            {/* Summary card */}
            <div style={{ background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "14px", padding: "0.85rem", marginBottom: "1rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "#6b7280", fontSize: "0.68rem" }}>Топливо</span>
                <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.78rem" }}>АИ-95 · 60 л</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "#6b7280", fontSize: "0.68rem" }}>Станция</span>
                <span style={{ color: "#9ca3af", fontSize: "0.68rem" }}>Роснефть #42</span>
              </div>
              <div style={{ height: "1px", background: "#1e1e2a", margin: "0.5rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#6b7280", fontSize: "0.68rem" }}>Дата</span>
                <span style={{ color: "#4b5563", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem" }}>
                  {now.toLocaleDateString("ru", { day: "2-digit", month: "short" })} · {now.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Stars payment confirmed */}
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "0.55rem 0.75rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1rem" }}>⭐</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#f59e0b", fontSize: "0.7rem", fontWeight: 700 }}>1 696 Telegram Stars списано</div>
                <div style={{ color: "#4b5563", fontSize: "0.58rem" }}>Оплата подтверждена Telegram</div>
              </div>
            </div>

            <button onClick={() => setPhase("ticket")} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 0 16px rgba(34,197,94,0.35)", marginBottom: "0.5rem" }}>
              📱 Открыть QR-талон
            </button>
            <button style={{ width: "100%", padding: "0.55rem", background: "transparent", border: "1px solid #1e1e2a", borderRadius: "12px", color: "#4b5563", fontSize: "0.8rem", cursor: "pointer" }}>
              Вернуться в каталог
            </button>
          </>
        ) : (
          <>
            {/* Ticket view */}
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#a855f7", fontSize: "0.48rem", letterSpacing: "0.2em", marginBottom: "0.2rem" }}>⛽️ ТОПЛИВНЫЙ ВАУЧЕР</div>
              <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.15rem" }}>Предъявите QR контролёру</p>
              <p style={{ color: "#4b5563", fontSize: "0.58rem", margin: 0 }}>
                {now.toLocaleDateString("ru", { day: "2-digit", month: "long" })} · {now.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Fuel + timer */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ flex: 1, background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "12px", padding: "0.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "#4b5563", fontSize: "0.44rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "2px" }}>ТОПЛИВО / ОБЪЁМ</div>
                <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.78rem" }}>АИ-95 · 60 л</div>
              </div>
              <div style={{ flex: 1, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "12px", padding: "0.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "#22c55e", fontSize: "0.44rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "2px", opacity: 0.7 }}>ДЕЙСТВИТЕЛЕН</div>
                <div style={{ color: "#22c55e", fontWeight: 800, fontSize: "0.82rem", fontFamily: "'JetBrains Mono',monospace" }}>24:00:00</div>
              </div>
            </div>

            {/* QR */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ width: "180px", height: "180px", margin: "0 auto", borderRadius: "14px", overflow: "hidden", border: "2px solid #a855f744", boxShadow: "0 0 28px #a855f728" }}>
                {dataUrl ? <img src={dataUrl} alt="QR" style={{ width: "100%", height: "100%", display: "block" }} /> : <div style={{ width: "100%", height: "100%", background: "#0b0b0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7" }}>⟳</div>}
              </div>
              {(["tl","tr","bl","br"] as const).map((k) => (
                <div key={k} style={{ position: "absolute", width: "14px", height: "14px", borderColor: "#a855f7", borderStyle: "solid", borderWidth: 0, ...(k==="tl"?{top:0,left:0,borderTopWidth:"2px",borderLeftWidth:"2px",borderTopLeftRadius:"3px"}:k==="tr"?{top:0,right:0,borderTopWidth:"2px",borderRightWidth:"2px",borderTopRightRadius:"3px"}:k==="bl"?{bottom:0,left:0,borderBottomWidth:"2px",borderLeftWidth:"2px",borderBottomLeftRadius:"3px"}:{bottom:0,right:0,borderBottomWidth:"2px",borderRightWidth:"2px",borderBottomRightRadius:"3px"}) }} />
              ))}
            </div>

            {/* Hash */}
            <div style={{ margin: "0.7rem 0 0.2rem", padding: "0.45rem 0.65rem", background: "#0b0b0f", border: "1px solid #1e1e2a", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.5rem", color: "#4b5563", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{HASH}</span>
              <span style={{ fontSize: "0.65rem", color: "#6b7280" }}>⎘</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", margin: "0.6rem 0" }}>
              {[{icon:"📷",label:"PNG"},{icon:"📄",label:"PDF"},{icon:"📋",label:"Копировать"},{icon:"📤",label:"Telegram"}].map(({icon,label}) => (
                <button key={label} style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "8px", padding: "0.4rem 0.3rem", color: "#c4b5fd", fontSize: "0.6rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                  <span style={{ fontSize: "0.7rem" }}>{icon}</span>{label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "0.5rem" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span style={{ color: "#22c55e", fontSize: "0.55rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.08em" }}>АКТИВЕН · ТОЛЬКО ЧТО ВЫДАН</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
