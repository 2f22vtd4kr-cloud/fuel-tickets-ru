import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buyVpnStars, buyVpnCrypto, fetchVpnStatus } from "@/api/client";
import { useUserStore } from "@/stores/useUserStore";
import { useToast } from "@/components/Toast";
import { VPN_PLANS } from "@/types";
import type { VpnSession } from "@/types";

type PayMethod = "stars" | "cryptobot";

function countdown(expiresAt: string): string {
  const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ActiveSessionBanner({ session, onClose }: { session: VpnSession; onClose: () => void }) {
  const [timer, setTimer] = useState(() => countdown(session.expires_at));

  useEffect(() => {
    const id = setInterval(() => setTimer(countdown(session.expires_at)), 1000);
    return () => clearInterval(id);
  }, [session.expires_at]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(135deg,#071a0f,#0a1f12)",
        border: "1px solid #22c55e44",
        borderRadius: "16px",
        padding: "1rem",
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 24px #22c55e14",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,#22c55e,transparent)" }} />
      <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#22c55e66", fontSize: "0.44rem", letterSpacing: "0.16em", marginBottom: "0.15rem" }}>VPN_АКТИВЕН · ЗАЩИЩЕНО</div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: "1.1rem" }}
        >🛡️</motion.span>
        <span style={{ color: "#22c55e", fontWeight: 800, fontSize: "0.95rem" }}>
          {session.plan_name}
        </span>
        <span style={{
          marginLeft: "auto",
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: "1.1rem", fontWeight: 800,
          color: "#22c55e",
          textShadow: "0 0 10px #22c55e66",
        }}>{timer}</span>
      </div>
      <div style={{
        background: "#050507",
        borderRadius: "10px",
        padding: "0.5rem 0.65rem",
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: "0.68rem",
        color: "#a855f7",
        letterSpacing: "0.04em",
        wordBreak: "break-all",
        border: "1px solid #a855f720",
      }}>
        {session.config_key}
      </div>
      <p style={{ margin: 0, color: "#374151", fontSize: "0.68rem" }}>
        Используйте этот ключ в приложении WireGuard или Outline.
      </p>
      <button
        onClick={onClose}
        style={{
          alignSelf: "flex-end",
          marginTop: "0.15rem",
          background: "#22c55e12",
          border: "1px solid #22c55e30",
          borderRadius: "8px",
          color: "#22c55e",
          padding: "0.3rem 0.8rem",
          fontSize: "0.72rem",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Закрыть
      </button>
    </motion.div>
  );
}

interface Props {
  onClose: () => void;
  isTroubleshooter?: boolean;
}

export function VpnModal({ onClose, isTroubleshooter = false }: Props) {
  const { user } = useUserStore();
  const { add: toast } = useToast();
  const [payMethod, setPayMethod] = useState<PayMethod>("stars");
  const [loading, setLoading] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<VpnSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchVpnStatus(user.id)
      .then((s) => { if (s.has_active && s.session) setActiveSession(s.session); })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [user]);

  const pollForSession = (uid: number, attempts = 0) => {
    fetchVpnStatus(uid)
      .then((s) => {
        if (s.has_active && s.session) {
          setActiveSession(s.session);
          toast("✅ VPN активирован!", "success");
        } else if (attempts < 10) {
          setTimeout(() => pollForSession(uid, attempts + 1), 1500);
        } else {
          toast("VPN активируется — обновите страницу через несколько секунд", "success");
        }
      })
      .catch(() => {
        if (attempts < 6) setTimeout(() => pollForSession(uid, attempts + 1), 2000);
      });
  };

  const handleBuy = async (planId: string) => {
    if (!user) return;
    setLoading(planId);
    try {
      if (payMethod === "stars") {
        const inv = await buyVpnStars(user.id, user.id, planId);
        if (!inv.checkout_url) {
          toast("Не удалось создать счёт — попробуйте ещё раз", "error");
          return;
        }
        const tg = (window as unknown as {
          Telegram?: { WebApp?: { openInvoice?: (url: string, cb: (status: string) => void) => void } }
        }).Telegram?.WebApp;
        if (tg?.openInvoice) {
          toast(`⭐ Открываю оплату ${inv.stars_amount} Stars…`, "success");
          setLoading(null);
          tg.openInvoice(inv.checkout_url, (status: string) => {
            if (status === "paid") {
              toast("⭐ Оплата прошла! Активирую VPN…", "success");
              setTimeout(() => pollForSession(user.id), 1200);
            } else if (status === "cancelled") {
              toast("Оплата отменена", "error");
            } else if (status === "failed") {
              toast("Ошибка оплаты. Попробуйте ещё раз.", "error");
            }
          });
          return;
        } else {
          // Fallback: open link in browser (outside Telegram context)
          window.open(inv.checkout_url, "_blank");
          toast(`⭐ Счёт открыт — оплатите ${inv.stars_amount} Stars в Telegram`, "success");
        }
      } else {
        const inv = await buyVpnCrypto(user.id, user.id, planId);
        if (inv.checkout_url) {
          window.open(inv.checkout_url, "_blank");
          toast("💎 Оплата через CryptoBot открыта", "success");
        }
      }
    } catch (e: unknown) {
      toast(String(e), "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 12000,
        background: "rgba(5,5,7,0.92)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0",
      }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg,#0d0d18,#0a0a12)",
          border: "1px solid #a855f720",
          borderRadius: "20px 20px 0 0",
          padding: "0 0 2rem",
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div style={{ position: "sticky", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,#a855f7,#db2777,transparent)", zIndex: 10 }} />
        <div style={{ padding: "1.25rem 1rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#4b5563", fontSize: "0.46rem", letterSpacing: "0.14em", marginBottom: "0.15rem" }}>МАТРИЦА_ДОСТУПА · VPN</div>
            <h2 style={{ margin: 0, color: "#e2e8f0", fontSize: "1.1rem", fontWeight: 800 }}>
              🔒 VPN-доступ
            </h2>
            {isTroubleshooter && (
              <p style={{ margin: "0.2rem 0 0", color: "#f59e0b", fontSize: "0.72rem", fontFamily: "'JetBrains Mono',monospace" }}>
                ⚠ Обнаружены проблемы с соединением
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "1px solid #22222f", borderRadius: "50%",
              color: "#6b7280", width: "30px", height: "30px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem",
            }}
          >
            ✕
          </button>
        </div>

        {checked && activeSession && (
          <ActiveSessionBanner session={activeSession} onClose={onClose} />
        )}

        {(!checked || !activeSession) && (
          <>
            <p style={{ margin: "0 0 0.8rem", color: "#9ca3af", fontSize: "0.78rem", lineHeight: 1.5 }}>
              Активируйте защищённый VPN-канал для обхода блокировок. Соединение поднимается автоматически сразу после оплаты.
            </p>

            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.9rem" }}>
              {(["stars", "cryptobot"] as PayMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  style={{
                    flex: 1, padding: "0.45rem 0.5rem",
                    border: `1px solid ${payMethod === m ? (m === "stars" ? "#f59e0b" : "#3b82f6") : "#22222f"}`,
                    borderRadius: "10px",
                    background: payMethod === m ? `${m === "stars" ? "#f59e0b" : "#3b82f6"}18` : "#0b0b0f",
                    color: payMethod === m ? (m === "stars" ? "#f59e0b" : "#3b82f6") : "#6b7280",
                    fontSize: "0.75rem", fontWeight: payMethod === m ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {m === "stars" ? "⭐ Telegram Stars" : "💎 CryptoBot"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {VPN_PLANS.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: idx === 1
                      ? "linear-gradient(135deg,#13092a,#0d0d18)"
                      : "linear-gradient(135deg,#0d0d18,#13141c)",
                    border: `1px solid ${idx === 1 ? "#a855f740" : "#1e1e2a"}`,
                    borderRadius: "16px",
                    padding: "0.85rem 0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: idx === 1 ? "0 0 20px #a855f718" : "none",
                  }}
                >
                  {idx === 1 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,#a855f7,transparent)" }} />}
                  {idx === 1 && (
                    <div style={{ position: "absolute", top: "0.45rem", right: "4.2rem", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.42rem", color: "#a855f766", letterSpacing: "0.1em" }}>POPULAR</div>
                  )}
                  <div style={{ fontSize: "1.5rem", minWidth: "2rem", textAlign: "center" }}>
                    {plan.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      {plan.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#374151", fontSize: "0.44rem", letterSpacing: "0.12em", marginTop: "0.1rem" }}>
                      {plan.durationMin} МИН · WIREGUARD
                    </div>
                    <div style={{ color: "#4b5563", fontSize: "0.68rem", marginTop: "0.15rem", lineHeight: 1.4 }}>
                      {plan.subtitle}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(plan.id)}
                    disabled={loading === plan.id}
                    style={{
                      background: "linear-gradient(135deg,#a855f7,#db2777)",
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: loading === plan.id ? "wait" : "pointer",
                      opacity: loading === plan.id ? 0.6 : 1,
                      whiteSpace: "nowrap",
                      minWidth: "70px",
                      boxShadow: "0 0 12px #a855f740",
                    }}
                  >
                    {loading === plan.id
                      ? "…"
                      : payMethod === "stars"
                        ? `⭐ ${plan.starsAmount}`
                        : `${plan.priceRub} ₽`}
                  </button>
                </motion.div>
              ))}
            </div>

            <p style={{ margin: "0.8rem 0 0", color: "#374151", fontSize: "0.65rem", lineHeight: 1.5, textAlign: "center" }}>
              После оплаты вам будет выдан персональный WireGuard-ключ. Соединение отключается автоматически по истечении выбранного времени.
            </p>
          </>
        )}
        </div>
      </motion.div>
    </motion.div>
  );
}
