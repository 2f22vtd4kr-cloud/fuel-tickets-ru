import { useState, useEffect, useRef } from "react";

// ── Mock data ─────────────────────────────────────────────────────────────────

const BUILDINGS_DATA = [
  { key: "hut",      name: "Хижина",  emoji: "🛖", level: 3, rate: 52,  cost: 212,  stage: 1, neon: "#00d9a6" },
  { key: "farm",     name: "Ферма",   emoji: "🌾", level: 2, rate: 42,  cost: 282,  stage: 1, neon: "#00d9a6" },
  { key: "market",   name: "Рынок",   emoji: "🏪", level: 1, rate: 20,  cost: 339,  stage: 1, neon: "#00d9a6" },
  { key: "windmill", name: "Мельница",emoji: "⚡", level: 0, rate: 0,   cost: 90,   stage: 1, neon: "#00d9a6" },
  { key: "bakery",   name: "Пекарня", emoji: "🥐", level: 0, rate: 0,   cost: 1065, stage: 2, neon: "#60a5fa" },
  { key: "smith",    name: "Кузница", emoji: "⚒️", level: 0, rate: 0,   cost: 1414, stage: 2, neon: "#60a5fa" },
  { key: "warehouse",name: "Склад",   emoji: "📦", level: 0, rate: 0,   cost: 1243, stage: 2, neon: "#60a5fa" },
  { key: "townhall", name: "Ратуша",  emoji: "🏛️", level: 0, rate: 0,   cost: 1768, stage: 2, neon: "#60a5fa" },
];

const DAILY = [500, 1000, 2000, 1500, 3000, 2500, 10000];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n/1e6).toFixed(1)}М`;
  if (n >= 1_000)     return `${(n/1e3).toFixed(1)}К`;
  return Math.floor(n).toString();
}

// ── Neon frame helper ─────────────────────────────────────────────────────────

const neonBox = (color: string, level = 0) => ({
  background: `linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0) 100%)`,
  border: level > 0 ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.07)",
  boxShadow: level > 0 ? `0 0 0 1px ${color}22, 0 4px 24px ${color}1a, inset 0 0 20px ${color}08` : "none",
});

// ── Building Card ─────────────────────────────────────────────────────────────

function BuildingCard({ b, xp, locked }: { b: typeof BUILDINGS_DATA[0]; xp: number; locked?: boolean }) {
  const canAfford = xp >= b.cost;
  const [tap, setTap] = useState(false);

  return (
    <div
      onPointerDown={() => setTap(true)}
      onPointerUp={() => setTap(false)}
      style={{
        ...neonBox(b.neon, b.level),
        borderRadius: 14,
        padding: "10px 7px 9px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        position: "relative",
        transform: tap && !locked ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.1s",
        opacity: locked ? 0.25 : 1,
        minHeight: 138,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        borderRadius: 14,
      }} />

      {/* Neon corner accent */}
      {b.level > 0 && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 20%, ${b.neon}cc, transparent 80%)`,
          borderRadius: "14px 14px 0 0",
        }} />
      )}

      {b.level > 0 && (
        <div style={{
          position: "absolute", top: 7, right: 7,
          background: `${b.neon}22`,
          border: `1px solid ${b.neon}66`,
          borderRadius: 99,
          padding: "1px 6px",
          fontSize: "0.52rem",
          fontWeight: 900,
          color: b.neon,
          letterSpacing: "0.05em",
          fontFamily: "monospace",
        }}>
          Ур.{b.level}
        </div>
      )}

      <div style={{
        fontSize: "1.85rem",
        lineHeight: 1,
        filter: b.level > 0 ? `drop-shadow(0 0 8px ${b.neon}66)` : "grayscale(1) opacity(0.3)",
      }}>
        {b.level > 0 ? b.emoji : "🏗️"}
      </div>

      <div style={{
        fontWeight: 800,
        fontSize: "0.65rem",
        color: b.level > 0 ? "#e2e8f0" : "#374151",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
        fontFamily: "monospace",
      }}>
        {b.name}
      </div>

      {b.level > 0 && (
        <div style={{
          fontSize: "0.55rem", fontWeight: 800,
          color: b.neon,
          letterSpacing: "0.04em",
          fontFamily: "monospace",
          textShadow: `0 0 8px ${b.neon}88`,
        }}>
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
            ? `linear-gradient(135deg, ${b.neon}33, ${b.neon}11)`
            : "rgba(255,255,255,0.03)",
          color: canAfford && !locked ? b.neon : "#1f2937",
          border: canAfford && !locked ? `1px solid ${b.neon}55` : "1px solid rgba(255,255,255,0.06)",
          borderRadius: 9,
          fontSize: "0.55rem",
          fontWeight: 900,
          fontFamily: "monospace",
          cursor: canAfford && !locked ? "pointer" : "not-allowed",
          boxShadow: canAfford && !locked ? `0 0 10px ${b.neon}33` : "none",
          textShadow: canAfford && !locked ? `0 0 8px ${b.neon}88` : "none",
          letterSpacing: "0.03em",
        }}
      >
        {b.level === 0 ? "BUILD" : "UPGRADE"} {fmt(b.cost)}XP
      </button>
    </div>
  );
}

// ── Daily Strip ───────────────────────────────────────────────────────────────

function DailyStrip() {
  const currentDay = 3;
  return (
    <div style={{
      margin: "0 16px",
      background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(217,119,6,0.04) 100%)",
      border: "1px solid rgba(251,191,36,0.2)",
      borderRadius: 18,
      padding: "13px 14px",
      boxShadow: "0 0 30px rgba(251,191,36,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: "1.1rem", filter: "drop-shadow(0 0 8px rgba(251,191,36,0.8))" }}>🎁</span>
        <div>
          <div style={{ fontWeight: 900, fontSize: "0.78rem", color: "#fbbf24", letterSpacing: "0.04em", fontFamily: "monospace" }}>
            ЕЖЕДНЕВНЫЕ НАГРАДЫ
          </div>
          <div style={{ fontSize: "0.58rem", color: "#6b7280" }}>7-дневный цикл бонусов</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 11 }}>
        {DAILY.map((coins, i) => {
          const d = i + 1;
          const done = d < currentDay;
          const current = d === currentDay;
          return (
            <div key={d} style={{
              flex: 1, borderRadius: 10, padding: "6px 2px", textAlign: "center",
              background: done ? "rgba(0,217,166,0.12)" : current ? "rgba(251,191,36,0.16)" : "rgba(255,255,255,0.03)",
              border: done ? "1px solid rgba(0,217,166,0.4)" : current ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.06)",
              boxShadow: current ? "0 0 12px rgba(251,191,36,0.3)" : "none",
            }}>
              <div style={{ fontSize: "0.5rem", color: done ? "#00d9a6" : current ? "#fbbf24" : "#374151", fontWeight: 800, fontFamily: "monospace" }}>
                {done ? "✓" : `Д${d}`}
              </div>
              <div style={{ fontSize: "0.46rem", color: done ? "#00d9a6" : current ? "#fcd34d" : "#1f2937", fontWeight: 800 }}>
                {fmt(coins)}
              </div>
            </div>
          );
        })}
      </div>
      <button style={{
        width: "100%", padding: "10px",
        background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.1))",
        color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)",
        borderRadius: 12, fontWeight: 900, fontSize: "0.75rem",
        fontFamily: "monospace", cursor: "pointer",
        boxShadow: "0 0 20px rgba(251,191,36,0.2)",
        textShadow: "0 0 12px rgba(251,191,36,0.6)",
        letterSpacing: "0.04em",
      }}>
        🎁 ПОЛУЧИТЬ ДЕНЬ 3 → 2.0К МОНЕТ
      </button>
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────

function BottomNav() {
  const tabs = [
    { icon: "🗺️", label: "Карта",      neon: "#60a5fa" },
    { icon: "📊", label: "Аналит.",    neon: "#a78bfa" },
    { icon: "⛽", label: "Каталог",   neon: "#f472b6" },
    { icon: "🏦", label: "Хранилище", neon: "#60a5fa" },
    { icon: "🎡", label: "Луна-парк", neon: "#fbbf24", active: true },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(4,4,8,0.95)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)",
      padding: "8px 4px 18px",
      display: "flex",
    }}>
      {tabs.map((t) => (
        <div key={t.label} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "4px 0", position: "relative",
        }}>
          {t.active && (
            <>
              <div style={{
                position: "absolute", top: -1, left: "25%", right: "25%", height: 2,
                background: t.neon,
                boxShadow: `0 0 10px ${t.neon}, 0 0 20px ${t.neon}88`,
                borderRadius: 99,
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at 50% 0%, ${t.neon}18 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />
            </>
          )}
          <div style={{
            fontSize: "1.18rem",
            filter: t.active ? `drop-shadow(0 0 8px ${t.neon})` : "none",
            opacity: t.active ? 1 : 0.35,
          }}>
            {t.icon}
          </div>
          <div style={{
            fontSize: "0.52rem", fontWeight: 900,
            color: t.active ? t.neon : "#374151",
            letterSpacing: "0.04em", fontFamily: "monospace",
            textShadow: t.active ? `0 0 8px ${t.neon}88` : "none",
          }}>
            {t.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function DarkNeon() {
  const [coins, setCoins] = useState(4827.4);
  const [tick, setTick] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => {
      setCoins((c) => c + 0.032);
      setTick((t) => t + 1);
    }, 1000) as unknown as number;
    return () => { if (ref.current) clearInterval(ref.current); };
  }, []);

  const xp = 1240;
  const empireLevel = 7;
  const income = 114;

  return (
    <div style={{
      width: 390, minHeight: 844,
      background: "#040408",
      fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
      position: "relative",
      overflowX: "hidden",
      color: "#e2e8f0",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(180deg, rgba(251,191,36,0.1) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(251,191,36,0.15)",
        padding: "48px 18px 18px",
        marginBottom: 16,
        position: "relative",
      }}>
        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 40, left: 14, width: 14, height: 14, borderLeft: "2px solid #fbbf24", borderTop: "2px solid #fbbf24", borderRadius: "2px 0 0 0" }} />
        <div style={{ position: "absolute", top: 40, right: 14, width: 14, height: 14, borderRight: "2px solid #fbbf24", borderTop: "2px solid #fbbf24", borderRadius: "0 2px 0 0" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{
              fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em",
              color: "#f1f5f9",
              textShadow: "0 0 20px rgba(251,191,36,0.3)",
            }}>
              🏰 МОЯ ИМПЕРИЯ
            </div>
            <div style={{ fontSize: "0.62rem", color: "#00d9a6", fontWeight: 900, marginTop: 2, letterSpacing: "0.08em", textShadow: "0 0 8px #00d9a699" }}>
              ⬡ ДЕРЕВНЯ · УР.{empireLevel}
            </div>
          </div>
          <div style={{
            background: "rgba(251,191,36,0.06)",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: 12,
            padding: "8px 16px",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(251,191,36,0.15), inset 0 0 20px rgba(251,191,36,0.05)",
          }}>
            <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#fbbf24", lineHeight: 1, textShadow: "0 0 16px #fbbf24" }}>
              {empireLevel}
            </div>
            <div style={{ fontSize: "0.44rem", color: "rgba(251,191,36,0.55)", letterSpacing: "0.12em" }}>УРОВЕНЬ</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* Coins */}
          <div style={{
            flex: 1,
            background: "rgba(251,191,36,0.04)",
            border: "1px solid rgba(251,191,36,0.18)",
            borderRadius: 14,
            padding: "10px 11px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)" }} />
            <div style={{ fontSize: "0.52rem", color: "#6b7280", fontWeight: 700, marginBottom: 2, letterSpacing: "0.1em" }}>◈ МОНЕТЫ</div>
            <div style={{
              fontWeight: 900, fontSize: "1.05rem", color: "#fbbf24",
              letterSpacing: "-0.02em",
              textShadow: `0 0 16px rgba(251,191,36,${0.4 + (tick % 2) * 0.1})`,
              transition: "text-shadow 1s",
            }}>
              {fmt(coins)}
            </div>
            <div style={{ fontSize: "0.52rem", color: "#374151", letterSpacing: "0.04em" }}>+{fmt(income)}/ЧАС</div>
          </div>

          {/* XP */}
          <div style={{
            flex: 1,
            background: "rgba(96,165,250,0.04)",
            border: "1px solid rgba(96,165,250,0.18)",
            borderRadius: 14,
            padding: "10px 11px",
          }}>
            <div style={{ fontSize: "0.52rem", color: "#6b7280", fontWeight: 700, marginBottom: 2, letterSpacing: "0.1em" }}>◈ СВОБ.XP</div>
            <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#60a5fa", textShadow: "0 0 12px rgba(96,165,250,0.5)" }}>
              {fmt(xp)}
            </div>
            <div style={{ fontSize: "0.52rem", color: "#374151", letterSpacing: "0.04em" }}>ИЗ АККАУНТА</div>
          </div>

          {/* Collect */}
          <div style={{
            flex: 1,
            background: "rgba(0,217,166,0.08)",
            border: "1px solid rgba(0,217,166,0.3)",
            borderRadius: 14,
            padding: "10px 7px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 0 18px rgba(0,217,166,0.12)",
          }}>
            <div style={{ fontSize: "0.5rem", color: "#00d9a6", fontWeight: 900, letterSpacing: "0.1em", marginBottom: 2, textShadow: "0 0 8px #00d9a6" }}>
              ▶ COLLECT
            </div>
            <div style={{ fontWeight: 900, fontSize: "0.88rem", color: "#00d9a6", textShadow: "0 0 12px #00d9a699" }}>
              +{fmt(38.2)}
            </div>
            <div style={{ fontSize: "0.46rem", color: "#374151", letterSpacing: "0.06em" }}>МОНЕТ</div>
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
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,217,166,0.5))" }} />
          <div style={{
            background: "rgba(0,217,166,0.08)",
            border: "1px solid rgba(0,217,166,0.35)",
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: "0.68rem",
            fontWeight: 900,
            color: "#00d9a6",
            letterSpacing: "0.08em",
            textShadow: "0 0 10px rgba(0,217,166,0.6)",
            boxShadow: "0 0 12px rgba(0,217,166,0.15)",
          }}>
            ⬡ ДЕРЕВНЯ
          </div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,217,166,0.5), transparent)" }} />
        </div>

        {/* Building grid — Stage 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "0 16px", marginBottom: 16 }}>
          {BUILDINGS_DATA.slice(0, 4).map((b) => (
            <BuildingCard key={b.key} b={b} xp={xp} />
          ))}
        </div>

        {/* Stage header: City (locked) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 99, padding: "4px 14px", fontSize: "0.66rem", fontWeight: 900,
            color: "#1f2937", letterSpacing: "0.06em",
          }}>
            ⬡ ГОРОД <span style={{ fontSize: "0.55rem" }}>🔒 +3</span>
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Building grid — Stage 2 (locked) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "0 16px", marginBottom: 20, opacity: 0.2 }}>
          {BUILDINGS_DATA.slice(4, 8).map((b) => (
            <BuildingCard key={b.key} b={b} xp={0} locked />
          ))}
        </div>

        {/* Leaderboard */}
        <div style={{ padding: "0 16px", marginBottom: 14 }}>
          <div style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 14,
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(99,102,241,0.1)",
          }}>
            <span style={{ fontWeight: 900, fontSize: "0.8rem", color: "#a78bfa", letterSpacing: "0.04em", textShadow: "0 0 10px rgba(167,139,250,0.5)" }}>
              ◈ РЕЙТИНГ ИМПЕРИЙ
            </span>
            <span style={{ color: "#6366f1" }}>▼</span>
          </div>
        </div>

        {/* XP info */}
        <div style={{
          margin: "0 16px",
          background: "rgba(96,165,250,0.04)",
          border: "1px solid rgba(96,165,250,0.12)",
          borderRadius: 14,
          padding: "10px 14px",
        }}>
          <div style={{ fontSize: "0.63rem", color: "#60a5fa", fontWeight: 900, marginBottom: 3, letterSpacing: "0.06em" }}>// КАК РАБОТАЕТ XP</div>
          <div style={{ fontSize: "0.58rem", color: "#374151", lineHeight: 1.6, letterSpacing: "0.01em" }}>
            Свободный XP = ваш общий XP минус потраченный.
            Уровень аккаунта <strong style={{ color: "#60a5fa" }}>никогда не снижается</strong>.
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
