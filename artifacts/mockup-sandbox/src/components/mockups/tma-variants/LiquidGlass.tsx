import { useState, useEffect, useRef } from "react";

// ── Mock data ─────────────────────────────────────────────────────────────────

const BUILDINGS_DATA = [
  { key: "hut",      name: "Хижина",  emoji: "🛖", level: 3, rate: 52,  cost: 212,  stage: 1, color: "#10b981" },
  { key: "farm",     name: "Ферма",   emoji: "🌾", level: 2, rate: 42,  cost: 282,  stage: 1, color: "#10b981" },
  { key: "market",   name: "Рынок",   emoji: "🏪", level: 1, rate: 20,  cost: 339,  stage: 1, color: "#10b981" },
  { key: "windmill", name: "Мельница",emoji: "⚡", level: 0, rate: 0,   cost: 90,   stage: 1, color: "#10b981" },
  { key: "bakery",   name: "Пекарня", emoji: "🥐", level: 0, rate: 0,   cost: 1065, stage: 2, color: "#3b82f6" },
  { key: "smith",    name: "Кузница", emoji: "⚒️", level: 0, rate: 0,   cost: 1414, stage: 2, color: "#3b82f6" },
  { key: "warehouse",name: "Склад",   emoji: "📦", level: 0, rate: 0,   cost: 1243, stage: 2, color: "#3b82f6" },
  { key: "townhall", name: "Ратуша",  emoji: "🏛️", level: 0, rate: 0,   cost: 1768, stage: 2, color: "#3b82f6" },
];

const DAILY = [500, 1000, 2000, 1500, 3000, 2500, 10000];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n/1e6).toFixed(1)}М`;
  if (n >= 1_000)     return `${(n/1e3).toFixed(1)}К`;
  return Math.floor(n).toString();
}

// ── Glass primitives ──────────────────────────────────────────────────────────

const glass = (opacity = 0.07, blur = 20) => ({
  background: `rgba(255,255,255,${opacity})`,
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
  border: "1px solid rgba(255,255,255,0.13)",
});

// ── Building Card ─────────────────────────────────────────────────────────────

function BuildingCard({ b, xp, locked }: { b: typeof BUILDINGS_DATA[0]; xp: number; locked?: boolean }) {
  const canAfford = xp >= b.cost;
  const [tap, setTap] = useState(false);

  const glowColor = b.level > 0 ? b.color : "rgba(255,255,255,0.05)";

  return (
    <div
      onPointerDown={() => setTap(true)}
      onPointerUp={() => setTap(false)}
      style={{
        ...glass(b.level > 0 ? 0.1 : 0.05),
        borderRadius: 20,
        padding: "11px 8px 9px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        position: "relative",
        boxShadow: b.level > 0
          ? `0 0 0 1px ${glowColor}44, 0 4px 20px ${glowColor}22, inset 0 1px 0 rgba(255,255,255,0.15)`
          : "inset 0 1px 0 rgba(255,255,255,0.08)",
        transform: tap && !locked ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.12s",
        opacity: locked ? 0.35 : 1,
        minHeight: 140,
        overflow: "hidden",
      }}
    >
      {/* Shimmer top edge */}
      <div style={{
        position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
      }} />

      {b.level > 0 && (
        <div style={{
          position: "absolute", top: 7, right: 7,
          background: `${b.color}cc`,
          backdropFilter: "blur(8px)",
          borderRadius: 99,
          padding: "1px 6px",
          fontSize: "0.55rem",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.02em",
        }}>
          Ур.{b.level}
        </div>
      )}

      <div style={{ fontSize: "1.9rem", lineHeight: 1, filter: b.level > 0 ? "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" : "none" }}>
        {b.level > 0 ? b.emoji : "🏗️"}
      </div>

      <div style={{
        fontWeight: 700, fontSize: "0.67rem", color: b.level > 0 ? "#f1f5f9" : "#64748b",
        textAlign: "center", lineHeight: 1.25, letterSpacing: "-0.01em",
      }}>
        {b.name}
      </div>

      {b.level > 0 && (
        <div style={{ fontSize: "0.57rem", color: "#10b981", fontWeight: 700, letterSpacing: "0.01em" }}>
          +{fmt(b.rate)}/ч
        </div>
      )}

      <button
        disabled={!canAfford || locked}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "6px 4px",
          background: canAfford && !locked
            ? `linear-gradient(135deg, ${b.color}ee, ${b.color}99)`
            : "rgba(255,255,255,0.06)",
          color: canAfford && !locked ? "#fff" : "#475569",
          border: canAfford && !locked ? `1px solid ${b.color}66` : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          fontSize: "0.58rem",
          fontWeight: 800,
          cursor: canAfford && !locked ? "pointer" : "not-allowed",
          boxShadow: canAfford && !locked ? `0 2px 10px ${b.color}44` : "none",
          letterSpacing: "0.01em",
        }}
      >
        {b.level === 0 ? "Построить" : "Улучшить"} · {fmt(b.cost)} XP
      </button>
    </div>
  );
}

// ── Daily Rewards ─────────────────────────────────────────────────────────────

function DailyStrip() {
  const currentDay = 3;
  return (
    <div style={{
      ...glass(0.08),
      borderRadius: 22,
      padding: "14px 14px",
      margin: "0 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: "1.1rem" }}>🎁</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#fbbf24" }}>Ежедневные награды</div>
          <div style={{ fontSize: "0.6rem", color: "#94a3b8" }}>7-дневный цикл бонусов</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {DAILY.map((coins, i) => {
          const d = i + 1;
          const done = d < currentDay;
          const current = d === currentDay;
          return (
            <div key={d} style={{
              flex: 1,
              borderRadius: 12,
              padding: "6px 2px",
              textAlign: "center",
              background: done ? "rgba(16,185,129,0.22)" : current ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.04)",
              border: done ? "1px solid rgba(16,185,129,0.5)" : current ? "1px solid rgba(251,191,36,0.6)" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: current ? "0 0 12px rgba(251,191,36,0.25)" : "none",
            }}>
              <div style={{ fontSize: "0.52rem", color: done ? "#10b981" : current ? "#fbbf24" : "#475569", fontWeight: 700 }}>
                {done ? "✓" : `Д${d}`}
              </div>
              <div style={{ fontSize: "0.48rem", color: done ? "#34d399" : current ? "#fcd34d" : "#334155", fontWeight: 700 }}>
                {fmt(coins)}
              </div>
            </div>
          );
        })}
      </div>
      <button style={{
        width: "100%", padding: "10px",
        background: "linear-gradient(135deg, rgba(251,191,36,0.9), rgba(217,119,6,0.9))",
        color: "#fff", border: "1px solid rgba(251,191,36,0.4)",
        borderRadius: 14, fontWeight: 800, fontSize: "0.78rem",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 20px rgba(251,191,36,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}>
        🎁 Получить награду дня 3 · 2.0К монет
      </button>
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────

function BottomNav() {
  const tabs = [
    { icon: "🗺️", label: "Карта" },
    { icon: "📊", label: "Аналитика" },
    { icon: "⛽", label: "Каталог" },
    { icon: "🏦", label: "Хранилище" },
    { icon: "🎡", label: "Луна-парк", active: true },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      ...glass(0.12, 24),
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "8px 4px 16px",
      display: "flex",
      borderRadius: "24px 24px 0 0",
      zIndex: 50,
    }}>
      {tabs.map((t) => (
        <div key={t.label} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "4px 0",
          position: "relative",
        }}>
          {t.active && (
            <div style={{
              position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
              width: 28, height: 3, borderRadius: 99,
              background: "linear-gradient(90deg, #f59e0b, #10b981)",
              boxShadow: "0 0 8px rgba(245,158,11,0.7)",
            }} />
          )}
          <div style={{ fontSize: "1.2rem", filter: t.active ? "drop-shadow(0 0 6px rgba(251,191,36,0.8))" : "none" }}>
            {t.icon}
          </div>
          <div style={{
            fontSize: "0.55rem", fontWeight: 700,
            color: t.active ? "#fbbf24" : "#475569",
            letterSpacing: "0.03em",
          }}>
            {t.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function LiquidGlass() {
  const [coins, setCoins] = useState(4827.4);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => setCoins((c) => c + 0.032), 1000) as unknown as number;
    return () => { if (ref.current) clearInterval(ref.current); };
  }, []);

  const xp = 1240;
  const empireLevel = 7;
  const income = 114;

  return (
    <div style={{
      width: 390, minHeight: 844,
      background: "linear-gradient(160deg, #0a0a14 0%, #050507 60%, #080812 100%)",
      fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflowX: "hidden",
      color: "#e2e8f0",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "fixed", top: -80, left: -60,
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", top: 100, right: -80,
        width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Header glass hero ── */}
      <div style={{
        ...glass(0.08, 28),
        borderRadius: "0 0 32px 32px",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        padding: "52px 20px 20px",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Shimmer edge */}
        <div style={{
          position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), rgba(16,185,129,0.5), transparent)",
        }} />

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.03em", color: "#f1f5f9" }}>
              🏰 Моя Империя
            </div>
            <div style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 700, marginTop: 2, letterSpacing: "0.04em" }}>
              🛖 ДЕРЕВНЯ · УР. {empireLevel}
            </div>
          </div>
          {/* Level badge */}
          <div style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1))",
            border: "1px solid rgba(245,158,11,0.4)",
            borderRadius: 16,
            padding: "8px 16px",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#fbbf24", fontFamily: "monospace", lineHeight: 1 }}>
              {empireLevel}
            </div>
            <div style={{ fontSize: "0.48rem", color: "rgba(251,191,36,0.7)", fontWeight: 700, letterSpacing: "0.08em" }}>
              УРОВЕНЬ
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* Coins */}
          <div style={{
            flex: 1,
            ...glass(0.1, 16),
            borderRadius: 18,
            padding: "11px 12px",
            boxShadow: "0 0 0 1px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <div style={{ fontSize: "0.56rem", color: "#94a3b8", fontWeight: 600, marginBottom: 2, letterSpacing: "0.06em" }}>
              💰 МОНЕТЫ
            </div>
            <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#fbbf24", fontFamily: "monospace", letterSpacing: "-0.02em" }}>
              {fmt(coins)}
            </div>
            <div style={{ fontSize: "0.54rem", color: "#64748b" }}>
              +{fmt(income)}/ч
            </div>
          </div>

          {/* XP */}
          <div style={{
            flex: 1,
            ...glass(0.1, 16),
            borderRadius: 18,
            padding: "11px 12px",
            boxShadow: "0 0 0 1px rgba(96,165,250,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <div style={{ fontSize: "0.56rem", color: "#94a3b8", fontWeight: 600, marginBottom: 2, letterSpacing: "0.06em" }}>
              🔷 СВОБ. XP
            </div>
            <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#60a5fa", fontFamily: "monospace" }}>
              {fmt(xp)}
            </div>
            <div style={{ fontSize: "0.54rem", color: "#64748b" }}>из аккаунта</div>
          </div>

          {/* Collect */}
          <div style={{
            flex: 1,
            background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(5,150,105,0.2))",
            border: "1px solid rgba(16,185,129,0.35)",
            borderRadius: 18,
            padding: "11px 8px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <div style={{ fontSize: "0.56rem", color: "#34d399", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 2 }}>
              СОБРАТЬ
            </div>
            <div style={{ fontWeight: 900, fontSize: "0.88rem", color: "#10b981", fontFamily: "monospace" }}>
              +{fmt(38.2)}
            </div>
            <div style={{ fontSize: "0.5rem", color: "#64748b" }}>монет</div>
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: 96 }}>
        {/* Daily rewards */}
        <div style={{ marginBottom: 16 }}>
          <DailyStrip />
        </div>

        {/* Stage header: Village */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4))" }} />
          <div style={{
            ...glass(0.12),
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: "0.7rem",
            fontWeight: 800,
            color: "#10b981",
            letterSpacing: "0.03em",
            boxShadow: "0 0 12px rgba(16,185,129,0.2)",
          }}>
            🛖 Деревня
          </div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" }} />
        </div>

        {/* Building grid — Stage 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9, padding: "0 16px", marginBottom: 16 }}>
          {BUILDINGS_DATA.slice(0, 4).map((b) => (
            <BuildingCard key={b.key} b={b} xp={xp} />
          ))}
        </div>

        {/* Stage header: City (locked) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          <div style={{
            ...glass(0.06),
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: "0.7rem",
            fontWeight: 800,
            color: "#475569",
          }}>
            🏛️ Город <span style={{ fontSize: "0.58rem", opacity: 0.8 }}>🔒 +3 ур.</span>
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Building grid — Stage 2 (locked) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9, padding: "0 16px", marginBottom: 20, opacity: 0.3 }}>
          {BUILDINGS_DATA.slice(4, 8).map((b) => (
            <BuildingCard key={b.key} b={b} xp={0} locked />
          ))}
        </div>

        {/* Leaderboard button */}
        <div style={{ padding: "0 16px", marginBottom: 14 }}>
          <div style={{
            ...glass(0.1),
            borderRadius: 20,
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#e2e8f0" }}>🏆 Рейтинг империй</span>
            <span style={{ color: "#6366f1", fontSize: "0.8rem" }}>▼</span>
          </div>
        </div>

        {/* XP info */}
        <div style={{
          margin: "0 16px",
          ...glass(0.06),
          borderRadius: 16,
          padding: "10px 14px",
          boxShadow: "0 0 0 1px rgba(96,165,250,0.12)",
        }}>
          <div style={{ fontSize: "0.65rem", color: "#60a5fa", fontWeight: 700, marginBottom: 3 }}>💡 Как работает XP</div>
          <div style={{ fontSize: "0.6rem", color: "#475569", lineHeight: 1.6 }}>
            Свободный XP = ваш общий XP минус потраченный.
            Уровень аккаунта <strong style={{ color: "#60a5fa" }}>никогда не снижается</strong>.
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
