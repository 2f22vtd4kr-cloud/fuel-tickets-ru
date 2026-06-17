import { useEffect, useState } from "react";
import QRCode from "qrcode";

const HASH = "TLN-LK-9F3A2C7E-EKTO95-40L-SEV2026";
const NETWORK = "Лукойл";
const FUEL = "ЭКТО Plus";
const VOLUME = 40;
const PRICE_PER_L = 74.2;
const PRICE = Math.round(PRICE_PER_L * VOLUME);
const PLATFORM_FEE = Math.round(PRICE * 0.03);
const GRAND_TOTAL = PRICE + PLATFORM_FEE;
const STAR_RATE = 2.5;
const STARS_TOTAL = Math.ceil(GRAND_TOTAL / STAR_RATE);
const USDT_TOTAL = (GRAND_TOTAL / 92).toFixed(2);
const DAYS_LEFT = 27;
const EXPIRES_ISO = new Date(Date.now() + DAYS_LEFT * 24 * 3600 * 1000).toISOString();
const NETWORK_COLOR = "#f59e0b";

type Corner = "tl" | "tr" | "bl" | "br";

function cornerStyle(k: Corner): React.CSSProperties {
  if (k === "tl") return { top: 0, left: 0, borderTopWidth: "2px", borderLeftWidth: "2px", borderTopLeftRadius: "4px" };
  if (k === "tr") return { top: 0, right: 0, borderTopWidth: "2px", borderRightWidth: "2px", borderTopRightRadius: "4px" };
  if (k === "bl") return { bottom: 0, left: 0, borderBottomWidth: "2px", borderLeftWidth: "2px", borderBottomLeftRadius: "4px" };
  return { bottom: 0, right: 0, borderBottomWidth: "2px", borderRightWidth: "2px", borderBottomRightRadius: "4px" };
}

function expiryInfo(expiresAt: string) {
  const now = Date.now();
  const exp = new Date(expiresAt).getTime();
  const totalMs = 30 * 24 * 3600 * 1000;
  const leftMs = exp - now;
  const daysLeft = Math.max(0, Math.ceil(leftMs / (24 * 3600 * 1000)));
  const pct = Math.max(0, Math.min(100, (leftMs / totalMs) * 100));
  if (leftMs <= 0) return { color: "#ef4444", label: "Истёк", pct: 0, daysLeft: 0 };
  if (daysLeft <= 7) return { color: "#ef4444", label: `${daysLeft} дн. осталось`, pct, daysLeft };
  if (daysLeft <= 15) return { color: "#eab308", label: `${daysLeft} дн. осталось`, pct, daysLeft };
  return { color: "#22c55e", label: `${daysLeft} дн. осталось`, pct, daysLeft };
}

export function NetworkVoucher() {
  const [dataUrl, setDataUrl] = useState<string>("");
  const now = new Date();
  const expiry = expiryInfo(EXPIRES_ISO);

  useEffect(() => {
    QRCode.toDataURL(HASH, {
      width: 300, margin: 2,
      color: { dark: "#0f0f0f", light: "#f0f0f4" },
    }).then(setDataUrl).catch(() => {});
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050507",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "1.25rem",
    }}>
      {/* CRT scanline overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(168,85,247,0.018) 3px,rgba(168,85,247,0.018) 4px)", zIndex: 0 }} />

      <div style={{
        background: "linear-gradient(160deg, #0d0d18, #120820)",
        border: `1px solid ${NETWORK_COLOR}44`,
        borderRadius: "24px",
        padding: "1.5rem",
        maxWidth: "320px", width: "100%",
        position: "relative", overflow: "hidden",
        boxShadow: `0 0 60px ${NETWORK_COLOR}18, 0 0 120px #db277711`,
        textAlign: "center",
        zIndex: 1,
      }}>
        {/* Top glow line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${NETWORK_COLOR},#db2777,transparent)` }} />
        {/* Ambient glow blobs */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "55%", height: "55%", background: `radial-gradient(circle,${NETWORK_COLOR}0a,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "5%", width: "40%", height: "40%", background: "radial-gradient(circle,#db27770a,transparent 70%)", pointerEvents: "none" }} />

        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.85rem" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: expiry.color, boxShadow: `0 0 8px ${expiry.color}` }} />
          <span style={{ color: expiry.color, fontSize: "0.5rem", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", fontWeight: 700 }}>
            АКТИВЕН · {expiry.label.toUpperCase()}
          </span>
        </div>

        {/* Network header */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#a855f7", fontSize: "0.46rem", letterSpacing: "0.22em", marginBottom: "0.3rem" }}>
            ⛽️ СЕТЕВОЙ ТОПЛИВНЫЙ ВАУЧЕР
          </div>
          <div style={{ color: "#e2e8f0", fontWeight: 900, fontSize: "1.3rem", letterSpacing: "0.01em", lineHeight: 1.1, marginBottom: "0.2rem" }}>
            {NETWORK}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: NETWORK_COLOR, fontSize: "0.65rem", fontWeight: 700, marginBottom: "0.4rem" }}>
            {FUEL} · {VOLUME}л
          </div>
          {/* "Works at all stations" pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            background: `${NETWORK_COLOR}12`,
            border: `1px solid ${NETWORK_COLOR}44`,
            borderRadius: "20px",
            padding: "0.22rem 0.7rem",
          }}>
            <span style={{ fontSize: "0.6rem" }}>✓</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: NETWORK_COLOR, fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.06em" }}>
              ДЕЙСТВУЕТ НА ВСЕХ АЗС СЕТИ {NETWORK.toUpperCase()}
            </span>
          </div>
          <div style={{ color: "#4b5563", fontSize: "0.58rem", marginTop: "0.4rem" }}>
            {now.toLocaleDateString("ru", { day: "2-digit", month: "long", year: "numeric" })} · {now.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* QR code with corner accents */}
        <div style={{ position: "relative", display: "inline-block", margin: "0 auto" }}>
          <div style={{
            width: "220px", height: "220px", margin: "0 auto",
            borderRadius: "16px", overflow: "hidden",
            border: `2px solid ${NETWORK_COLOR}44`,
            boxShadow: `0 0 32px ${NETWORK_COLOR}22, inset 0 0 20px ${NETWORK_COLOR}08`,
          }}>
            {dataUrl ? (
              <img src={dataUrl} alt="QR" style={{ width: "100%", height: "100%", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#0b0b12", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7", fontSize: "1.5rem" }}>⟳</div>
            )}
          </div>
          {(["tl", "tr", "bl", "br"] as Corner[]).map((k) => (
            <div key={k} style={{
              position: "absolute", width: "16px", height: "16px",
              borderColor: NETWORK_COLOR, borderStyle: "solid", borderWidth: 0,
              ...cornerStyle(k),
            }} />
          ))}
        </div>

        {/* Hash code row */}
        <div style={{
          margin: "0.9rem 0 0", padding: "0.5rem 0.75rem",
          background: "#0b0b12", border: "1px solid #1e1e2a",
          borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem",
          cursor: "pointer",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: "#4b5563", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {HASH}
          </span>
          <span style={{ fontSize: "0.7rem", color: "#6b7280", flexShrink: 0 }}>⎘</span>
        </div>
        <p style={{ color: "#2a2a36", fontSize: "0.5rem", margin: "0.2rem 0 0.75rem", fontFamily: "'JetBrains Mono',monospace" }}>
          Нажмите на код для копирования
        </p>

        {/* Expiry progress bar */}
        <div style={{
          background: "#0b0b12", border: `1px solid ${expiry.color}28`,
          borderRadius: "10px", padding: "0.5rem 0.75rem", marginBottom: "0.75rem",
          textAlign: "left",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.44rem", color: "#374151", letterSpacing: "0.1em" }}>СРОК ДЕЙСТВИЯ</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.52rem", color: expiry.color, fontWeight: 700 }}>{expiry.label}</span>
          </div>
          <div style={{ height: "5px", background: "#111118", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${expiry.pct}%`, height: "100%", background: expiry.color, borderRadius: "3px", boxShadow: `0 0 6px ${expiry.color}` }} />
          </div>
          <p style={{ margin: "0.28rem 0 0", color: "#374151", fontSize: "0.42rem", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.4 }}>
            ⚠ Точный срок может измениться с момента получения
          </p>
        </div>

        {/* Cost breakdown */}
        <div style={{
          background: "#0b0b12", border: `1px solid ${NETWORK_COLOR}28`,
          borderRadius: "10px", padding: "0.55rem 0.75rem", marginBottom: "0.65rem",
          textAlign: "left",
        }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.42rem", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>СТОИМОСТЬ · РАЗБИВКА</div>
          {[
            { label: "Топливо", detail: `${VOLUME}л × ${PRICE_PER_L.toFixed(1)}₽`, amount: `${PRICE}₽` },
            { label: "Сервис (3%)", detail: "", amount: `+${PLATFORM_FEE}₽` },
          ].map(({ label, detail, amount }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.15rem" }}>
              <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#6b7280", fontSize: "0.44rem" }}>{label}</span>
                {detail && <span style={{ color: "#2a2a36", fontSize: "0.38rem", fontFamily: "'JetBrains Mono',monospace" }}>{detail}</span>}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#6b7280", fontSize: "0.48rem" }}>{amount}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${NETWORK_COLOR}18`, paddingTop: "0.25rem", marginTop: "0.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: NETWORK_COLOR, fontSize: "0.52rem", fontWeight: 800 }}>ИТОГО</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: NETWORK_COLOR, fontSize: "0.75rem", fontWeight: 900 }}>{GRAND_TOTAL}₽</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.38rem" }}>≈{STARS_TOTAL}⭐ · {USDT_TOTAL}$</div>
            </div>
          </div>
        </div>

        {/* Payment buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "0.75rem" }}>
          <button style={{
            width: "100%", padding: "0.75rem",
            background: `linear-gradient(135deg, ${NETWORK_COLOR}22, ${NETWORK_COLOR}10)`,
            border: `1.5px solid ${NETWORK_COLOR}88`,
            borderRadius: "14px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: `0 0 16px ${NETWORK_COLOR}22`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>⭐</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", color: NETWORK_COLOR, fontSize: "0.62rem", fontWeight: 900 }}>Оплатить звёздами</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#6b7280", fontSize: "0.44rem" }}>Telegram Stars</div>
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", color: NETWORK_COLOR, fontSize: "0.85rem", fontWeight: 900 }}>{STARS_TOTAL} ⭐</div>
          </button>
          <button style={{
            width: "100%", padding: "0.75rem",
            background: "linear-gradient(135deg, #14b8a622, #14b8a610)",
            border: "1.5px solid #14b8a688",
            borderRadius: "14px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 0 16px #14b8a622",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>₮</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#14b8a6", fontSize: "0.62rem", fontWeight: 900 }}>Crypto USDT</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#6b7280", fontSize: "0.44rem" }}>TON / TRC-20</div>
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#14b8a6", fontSize: "0.85rem", fontWeight: 900 }}>${USDT_TOTAL}</div>
          </button>
        </div>

        {/* Action row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "0.75rem" }}>
          {[
            { icon: "📋", label: "Копировать" },
            { icon: "📤", label: "В Telegram" },
          ].map(({ icon, label }) => (
            <button key={label} style={{
              background: "rgba(168,85,247,0.09)", border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: "10px", padding: "0.5rem 0.35rem",
              color: "#c4b5fd", fontSize: "0.63rem", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
            }}>
              <span style={{ fontSize: "0.75rem" }}>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* Close CTA */}
        <button style={{
          width: "100%", padding: "0.7rem",
          background: `linear-gradient(135deg, ${NETWORK_COLOR}, #db2777)`,
          border: "none", borderRadius: "14px",
          color: "#fff", fontSize: "0.85rem", fontWeight: 700,
          cursor: "pointer", boxShadow: `0 0 20px ${NETWORK_COLOR}44`,
        }}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
