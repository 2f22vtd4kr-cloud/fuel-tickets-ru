import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";
import { useEmpireStore } from "@/stores/useEmpireStore";
import { useToast } from "@/components/Toast";

// ── Haptic feedback ───────────────────────────────────────────────────────────

type HapticStyle = "light" | "medium" | "heavy" | "soft" | "rigid";
type HapticNotification = "success" | "error" | "warning";

function hapticImpact(style: HapticStyle = "medium") {
  try { (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style); } catch { /* noop */ }
}
function hapticNotify(type: HapticNotification = "success") {
  try { (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type); } catch { /* noop */ }
}

// ── Coin burst particles ───────────────────────────────────────────────────────

interface Particle { id: number; x: number; y: number; vx: number; vy: number; emoji: string; }

const COIN_EMOJIS = ["💰","🪙","✨","💛","⭐"];

function CoinBurst({ origin }: { origin: { x: number; y: number } | null }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!origin) return;
    const count = 18;
    const next: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: origin.x,
      y: origin.y,
      vx: (Math.random() - 0.5) * 220,
      vy: -(60 + Math.random() * 260),
      emoji: COIN_EMOJIS[Math.floor(Math.random() * COIN_EMOJIS.length)],
    }));
    setParticles(next);
    const t = setTimeout(() => setParticles([]), 1100);
    return () => clearTimeout(t);
  }, [origin]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 900, overflow: "hidden" }}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x: p.x + p.vx, y: p.y + p.vy, opacity: 0, scale: 0.4, rotate: (Math.random() - 0.5) * 360 }}
            transition={{ duration: 0.95, ease: [0.2, 0, 0.8, 1] }}
            style={{ position: "absolute", fontSize: "1.4rem", lineHeight: 1, transformOrigin: "center" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Building catalogue ────────────────────────────────────────────────────────

interface BuildingDef {
  key: string;
  name: string;
  emojis: [string, string, string];
  baseRate: number;
  baseXp: number;
  unlock: number;
  stage: 1 | 2 | 3 | 4;
  desc: string;
}

const BUILDINGS: BuildingDef[] = [
  { key: "hut",             name: "Хижина",          emojis: ["🛖","🏡","🏠"],  baseRate: 10,  baseXp: 50,   unlock: 1,  stage: 1, desc: "Уютное жильё для рабочих" },
  { key: "farm",            name: "Ферма",            emojis: ["🌾","🌿","🌽"],  baseRate: 15,  baseXp: 80,   unlock: 1,  stage: 1, desc: "Обеспечивает продовольствием" },
  { key: "market",          name: "Рынок",            emojis: ["🏪","🛒","🏬"],  baseRate: 20,  baseXp: 120,  unlock: 1,  stage: 1, desc: "Центр торговли" },
  { key: "windmill",        name: "Мельница",         emojis: ["🌬️","🌀","⚡"],  baseRate: 12,  baseXp: 90,   unlock: 1,  stage: 1, desc: "Производит энергию" },
  { key: "bakery",          name: "Пекарня",          emojis: ["🥐","🥖","🎂"],  baseRate: 35,  baseXp: 300,  unlock: 10, stage: 2, desc: "Кормит горожан" },
  { key: "blacksmith",      name: "Кузница",          emojis: ["⚒️","🔩","⚙️"],  baseRate: 40,  baseXp: 400,  unlock: 11, stage: 2, desc: "Производит инструменты" },
  { key: "warehouse",       name: "Склад",            emojis: ["📦","🏗️","🏭"],  baseRate: 30,  baseXp: 350,  unlock: 12, stage: 2, desc: "Хранит ресурсы" },
  { key: "townhall",        name: "Ратуша",           emojis: ["🏛️","🏢","🏛️"],  baseRate: 50,  baseXp: 500,  unlock: 13, stage: 2, desc: "Сердце города" },
  { key: "apartments",      name: "Апартаменты",      emojis: ["🏢","🏢","🏙️"],  baseRate: 80,  baseXp: 1000, unlock: 25, stage: 3, desc: "Жилой комплекс" },
  { key: "mall",            name: "Торг. центр",      emojis: ["🏬","🛍️","🛍️"],  baseRate: 100, baseXp: 1200, unlock: 26, stage: 3, desc: "Коммерческий гигант" },
  { key: "factory",         name: "Завод",            emojis: ["🏗️","🏭","🏭"],  baseRate: 120, baseXp: 1500, unlock: 27, stage: 3, desc: "Промышленное сердце" },
  { key: "bank",            name: "Банк",             emojis: ["🏦","💳","💰"],  baseRate: 150, baseXp: 2000, unlock: 28, stage: 3, desc: "Финансовый якорь" },
  { key: "skyscraper",      name: "Небоскрёб",        emojis: ["🏙️","🌆","🌃"],  baseRate: 300, baseXp: 5000, unlock: 50, stage: 4, desc: "Символ могущества" },
  { key: "airport",         name: "Аэропорт",         emojis: ["✈️","🛫","🛫"],  baseRate: 350, baseXp: 6000, unlock: 51, stage: 4, desc: "Хаб мирового класса" },
  { key: "techcampus",      name: "Технокампус",      emojis: ["💻","💡","🚀"],  baseRate: 400, baseXp: 7000, unlock: 52, stage: 4, desc: "Инновационный центр" },
  { key: "financial_center",name: "Финансовый ЦТ",   emojis: ["💰","💎","💎"],  baseRate: 500, baseXp: 8000, unlock: 53, stage: 4, desc: "Капитал мира" },
];

const STAGES = [
  { stage: 1, label: "🛖 Деревня",    unlock: 1,  color: "#10b981", light: "#d1fae5" },
  { stage: 2, label: "🏛️ Город",      unlock: 10, color: "#3b82f6", light: "#dbeafe" },
  { stage: 3, label: "🏙️ Мегаполис",  unlock: 25, color: "#8b5cf6", light: "#ede9fe" },
  { stage: 4, label: "✈️ Метрополия", unlock: 50, color: "#f59e0b", light: "#fef3c7" },
];

const DAILY_COINS = [500, 1000, 2000, 1500, 3000, 2500, 10000];

// ── Achievements ──────────────────────────────────────────────────────────────

interface Achievement {
  id: string;
  label: string;
  emoji: string;
  check: (data: { buildings: Record<string, number>; empire_level: number; coins: number; income_per_hour: number; prestige_count?: number }) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_build",  label: "Первое строение!",    emoji: "🏗️",  check: (d) => Object.keys(d.buildings).length >= 1 },
  { id: "stage2",       label: "Открыт Город!",       emoji: "🏛️",  check: (d) => d.empire_level >= 10 },
  { id: "stage3",       label: "Открыт Мегаполис!",   emoji: "🏙️",  check: (d) => d.empire_level >= 25 },
  { id: "stage4",       label: "Открыта Метрополия!", emoji: "✈️",  check: (d) => d.empire_level >= 50 },
  { id: "income_1k",    label: "Доход 1К/ч",          emoji: "📈",  check: (d) => d.income_per_hour >= 1000 },
  { id: "income_10k",   label: "Доход 10К/ч",         emoji: "📊",  check: (d) => d.income_per_hour >= 10000 },
  { id: "coins_100k",   label: "100K монет!",          emoji: "💰",  check: (d) => d.coins >= 100_000 },
  { id: "coins_1m",     label: "Миллионер!",           emoji: "🤑",  check: (d) => d.coins >= 1_000_000 },
  { id: "five_buildings",label:"Пять строений!",       emoji: "🏘️",  check: (d) => Object.keys(d.buildings).length >= 5 },
  { id: "prestige_1",   label: "Первый Престиж!",      emoji: "⭐",  check: (d) => (d.prestige_count ?? 0) >= 1 },
  { id: "level_20",     label: "Уровень 20!",          emoji: "🔥",  check: (d) => d.empire_level >= 20 },
];

// ── Animated number counter ───────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    if (Math.abs(to - from) < 0.5) { setDisplayed(to); return; }
    const duration = 480;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(from + (to - from) * ease);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <>{fmtCoins(displayed)}</>;
}

// ── Micro sparkline ───────────────────────────────────────────────────────────

function MicroSparkline({ history, color }: { history: number[]; color: string }) {
  if (history.length < 2) return null;
  const w = 72, h = 28;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const ptsArr = pts.split(" ");
  const lastPt = ptsArr[ptsArr.length - 1].split(",");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <circle
        cx={parseFloat(lastPt[0])}
        cy={parseFloat(lastPt[1])}
        r="3"
        fill={color}
      />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildingEmoji(def: BuildingDef, level: number): string {
  if (level <= 0) return "🏗️";
  if (level >= 10) return def.emojis[2];
  if (level >= 5)  return def.emojis[1];
  return def.emojis[0];
}

function productionPerHour(def: BuildingDef, level: number, prestige: number): number {
  if (level <= 0) return 0;
  return def.baseRate * Math.pow(level, 1.5) * (1 + 0.25 * prestige);
}

function upgradeCost(def: BuildingDef, currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return Math.round(def.baseXp * Math.pow(nextLevel, 1.5));
}

function fmtCoins(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}К`;
  return Math.floor(n).toLocaleString("ru");
}

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}ч ${m}м`;
  return `${m}м`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

// ── Building detail sheet ─────────────────────────────────────────────────────

function BuildingDetailSheet({
  def, level, prestige, availableXp, onClose, onUpgrade, loading,
}: {
  def: BuildingDef; level: number; prestige: number; availableXp: number;
  onClose: () => void; onUpgrade: () => void; loading: boolean;
}) {
  const stage = STAGES.find((s) => s.stage === def.stage)!;
  const currentRate = productionPerHour(def, level, prestige);
  const nextRate = productionPerHour(def, level + 1, prestige);
  const cost = upgradeCost(def, level);
  const canAfford = availableXp >= cost;
  const totalXpInvested = Array.from({ length: level }, (_, i) => upgradeCost(def, i)).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 800,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "28px 28px 0 0",
          padding: "20px 20px 36px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{
            width: 56, height: 56,
            background: `linear-gradient(135deg, ${stage.light}, ${stage.color}22)`,
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", border: `2px solid ${stage.color}44`,
          }}>
            {buildingEmoji(def, level)}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "#1c1917" }}>{def.name}</div>
            <div style={{ fontSize: "0.72rem", color: stage.color, fontWeight: 700, marginTop: "2px" }}>{stage.label} · {def.desc}</div>
            {level > 0 && (
              <div style={{ fontSize: "0.68rem", color: "#6b7280", marginTop: "2px" }}>Уровень {level}</div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {[
            { label: "Производство/ч", value: level > 0 ? `${fmtCoins(currentRate)}` : "—", color: "#10b981" },
            { label: "После улучшения", value: `+${fmtCoins(nextRate - currentRate)}/ч`, color: stage.color },
            { label: "Цена улучшения", value: `${fmtCoins(cost)} XP`, color: canAfford ? "#7c3aed" : "#ef4444" },
            { label: "Вложено XP", value: totalXpInvested > 0 ? fmtCoins(totalXpInvested) : "—", color: "#6b7280" },
          ].map((item) => (
            <div key={item.label} style={{
              background: "#f9fafb", borderRadius: "14px", padding: "12px",
              border: "1px solid #f3f4f6",
            }}>
              <div style={{ fontSize: "0.58rem", color: "#9ca3af", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {item.label}
              </div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onUpgrade}
          disabled={!canAfford || loading}
          style={{
            width: "100%",
            padding: "14px",
            background: canAfford ? `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)` : "#f3f4f6",
            color: canAfford ? "#fff" : "#9ca3af",
            border: "none", borderRadius: "16px",
            fontWeight: 800, fontSize: "0.95rem",
            cursor: canAfford && !loading ? "pointer" : "not-allowed",
            boxShadow: canAfford ? `0 4px 20px ${stage.color}44` : "none",
          }}
        >
          {loading ? "Строим..." : level === 0 ? `Построить · ${fmtCoins(cost)} XP` : `Улучшить до ур.${level + 1} · ${fmtCoins(cost)} XP`}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Building card ─────────────────────────────────────────────────────────────

function BuildingCard({
  def,
  level,
  prestige,
  availableXp,
  onUpgrade,
  onInfo,
  loading,
}: {
  def: BuildingDef;
  level: number;
  prestige: number;
  availableXp: number;
  onUpgrade: () => void;
  onInfo: () => void;
  loading: boolean;
}) {
  const rate = productionPerHour(def, level, prestige);
  const cost = upgradeCost(def, level);
  const canAfford = availableXp >= cost;
  const stage = STAGES.find((s) => s.stage === def.stage)!;
  const levelColors = ["#10b981","#3b82f6","#8b5cf6","#f59e0b","#ef4444"];
  const borderColor = level === 0 ? "#e5e7eb" : levelColors[Math.min(Math.floor(level / 5), 4)];

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: `2px solid ${borderColor}`,
        padding: "12px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        position: "relative",
        boxShadow: level > 0
          ? `0 2px 12px ${borderColor}33, 0 1px 4px rgba(0,0,0,0.06)`
          : "0 1px 4px rgba(0,0,0,0.06)",
        minHeight: "148px",
        overflow: "hidden",
      }}
    >
      {/* Pulse ring for active buildings */}
      {level > 0 && (
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ repeat: Infinity, duration: 3.5 + def.stage * 0.4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "20px",
            border: `2px solid ${stage.color}`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Info button */}
      <button
        onClick={(e) => { e.stopPropagation(); onInfo(); }}
        style={{
          position: "absolute", top: "6px", left: "6px",
          background: "rgba(0,0,0,0.06)", border: "none",
          borderRadius: "99px", width: 20, height: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "0.6rem", color: "#6b7280", fontWeight: 700,
          zIndex: 1,
        }}
      >
        ℹ
      </button>
      {level > 0 && (
        <div style={{
          position: "absolute", top: "8px", right: "8px",
          background: stage.color, color: "#fff",
          borderRadius: "99px", padding: "1px 7px",
          fontSize: "0.6rem", fontWeight: 700,
        }}>
          Ур.{level}
        </div>
      )}
      <div style={{ fontSize: "2rem", lineHeight: 1 }}>{buildingEmoji(def, level)}</div>
      <div style={{ fontWeight: 700, fontSize: "0.72rem", color: "#1c1917", textAlign: "center", lineHeight: 1.2 }}>
        {def.name}
      </div>
      {level > 0 && (
        <div style={{ fontSize: "0.62rem", color: "#6b7280", fontWeight: 500 }}>
          +{fmtCoins(rate)}/ч
        </div>
      )}
      <button
        onClick={onUpgrade}
        disabled={!canAfford || loading}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "6px 4px",
          background: canAfford ? `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)` : "#f3f4f6",
          color: canAfford ? "#fff" : "#9ca3af",
          border: "none",
          borderRadius: "10px",
          fontSize: "0.62rem",
          fontWeight: 700,
          cursor: canAfford && !loading ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
        }}
      >
        {loading ? "..." : (
          <>
            {level === 0 ? "Построить" : "Улучшить"}
            <span style={{ opacity: 0.85 }}>· {fmtCoins(cost)} XP</span>
          </>
        )}
      </button>

      {/* XP affordability progress bar */}
      {!canAfford && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
          background: "#f3f4f6", borderRadius: "0 0 14px 14px", overflow: "hidden",
        }}>
          <motion.div
            animate={{ width: `${Math.min((availableXp / cost) * 100, 100)}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              height: "100%",
              background: availableXp / cost > 0.66 ? "#10b981" : availableXp / cost > 0.33 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

function DailyRewards({
  day,
  available,
  nextIn,
  onClaim,
}: {
  day: number;
  available: boolean;
  nextIn: number | null;
  onClaim: () => void;
}) {
  const [timer, setTimer] = useState(nextIn ?? 0);
  useEffect(() => {
    if (!nextIn) return;
    setTimer(nextIn);
    const iv = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [nextIn]);

  return (
    <div style={{
      background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
      borderRadius: "20px",
      border: "1.5px solid #fde68a",
      padding: "16px",
      margin: "0 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "1.2rem" }}>🎁</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#92400e" }}>Ежедневные награды</div>
          <div style={{ fontSize: "0.65rem", color: "#a16207" }}>7-дневный цикл бонусов</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {DAILY_COINS.map((coins, i) => {
          const dayNum = i + 1;
          const isCurrent = dayNum === ((day % 7) + 1) && available;
          const isDone = day > 0 && dayNum <= (day % 7 === 0 ? 7 : day % 7) && !available;
          return (
            <div
              key={dayNum}
              style={{
                flex: 1,
                background: isDone ? "#10b981" : isCurrent ? "#f59e0b" : "#fff",
                borderRadius: "10px",
                border: isCurrent ? "2px solid #d97706" : isDone ? "2px solid #059669" : "1.5px solid #e5e7eb",
                padding: "6px 2px",
                textAlign: "center",
                transition: "all 0.2s",
                boxShadow: isCurrent ? "0 2px 8px #f59e0b66" : "none",
              }}
            >
              <div style={{ fontSize: "0.55rem", color: isDone ? "#fff" : isCurrent ? "#92400e" : "#9ca3af", fontWeight: 600 }}>
                {isDone ? "✓" : `Д${dayNum}`}
              </div>
              <div style={{ fontSize: "0.5rem", color: isDone ? "#d1fae5" : isCurrent ? "#78350f" : "#6b7280", fontWeight: 700 }}>
                {fmtCoins(coins)}
              </div>
            </div>
          );
        })}
      </div>
      {available ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClaim}
          style={{
            width: "100%",
            padding: "10px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: 800,
            fontSize: "0.8rem",
            cursor: "pointer",
            boxShadow: "0 2px 12px #f59e0b66",
          }}
        >
          🎁 Получить награду дня {((day % 7) + 1)} · {fmtCoins(DAILY_COINS[(day % 7)])} монет
        </motion.button>
      ) : (
        <div style={{
          textAlign: "center", padding: "8px",
          color: "#a16207", fontSize: "0.72rem", fontWeight: 600,
        }}>
          ⏰ Следующая награда через {fmtTime(timer)}
        </div>
      )}
    </div>
  );
}

function EmpireLeaderboard({ userId }: { userId: number }) {
  const { leaderboard, fetchLeaderboard } = useEmpireStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) fetchLeaderboard();
  }, [open, fetchLeaderboard]);

  return (
    <div style={{ margin: "0 16px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: open ? "linear-gradient(135deg, #1e40af, #1d4ed8)" : "linear-gradient(135deg, #3b82f6, #2563eb)",
          color: "#fff",
          border: "none",
          borderRadius: "16px",
          fontWeight: 700,
          fontSize: "0.82rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>🏆 Рейтинг империй</span>
        <span style={{ opacity: 0.8 }}>{open ? "▲" : "▼"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              background: "#fff",
              borderRadius: "0 0 16px 16px",
              border: "1.5px solid #dbeafe",
              borderTop: "none",
              overflow: "hidden",
            }}>
              {leaderboard.length === 0 ? (
                <div style={{ padding: "16px", textAlign: "center", color: "#6b7280", fontSize: "0.8rem" }}>
                  Нет данных
                </div>
              ) : (
                leaderboard.slice(0, 10).map((e, i) => (
                  <div
                    key={e.user_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderBottom: i < leaderboard.length - 1 ? "1px solid #f1f5f9" : "none",
                      background: e.user_id === userId ? "#eff6ff" : "transparent",
                    }}
                  >
                    <div style={{
                      width: "28px", height: "28px",
                      background: e.rank <= 3 ? ["#f59e0b","#9ca3af","#cd7c2c"][e.rank - 1] : "#e5e7eb",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 800, color: e.rank <= 3 ? "#fff" : "#374151",
                      flexShrink: 0, marginRight: "10px",
                    }}>
                      {e.rank <= 3 ? ["🥇","🥈","🥉"][e.rank - 1] : e.rank}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1c1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {e.username ? `@${e.username}` : `Игрок #${e.user_id}`}
                        {e.user_id === userId && <span style={{ color: "#3b82f6", marginLeft: 4 }}>(ты)</span>}
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "#6b7280" }}>
                        Ур.{e.empire_level} · {fmtCoins(e.coins)} монет
                      </div>
                    </div>
                    {e.prestige_count > 0 && (
                      <div style={{ fontSize: "0.65rem", color: "#f59e0b", fontWeight: 700 }}>
                        ⭐×{e.prestige_count}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Level-up celebration ──────────────────────────────────────────────────────

function LevelUpCelebration({
  level, stage, onClose,
}: { level: number; stage: typeof STAGES[0]; onClose: () => void }) {
  useEffect(() => {
    hapticImpact("heavy");
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.78)",
        zIndex: 800,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ scale: 0.4, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        style={{ textAlign: "center", padding: "0 40px" }}
      >
        <motion.div
          animate={{ scale: [1, 1.12, 0.95, 1.05, 1] }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "6rem",
            fontWeight: 900,
            color: stage.color,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
            textShadow: `0 0 60px ${stage.color}, 0 0 120px ${stage.color}66`,
          }}
        >
          {level}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontWeight: 900, fontSize: "1.5rem", color: "#fff", marginTop: 16, letterSpacing: "-0.02em" }}
        >
          Новый уровень!
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "1rem", color: stage.color, fontWeight: 700, marginTop: 8 }}
        >
          {stage.label}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
          style={{ fontSize: "0.75rem", color: "#fff", marginTop: 24 }}
        >
          Нажмите, чтобы закрыть
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Prestige modal ────────────────────────────────────────────────────────────

function PrestigeModal({
  prestigeCount, onConfirm, onCancel, loading,
}: { prestigeCount: number; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  const nextPrestige = prestigeCount + 1;
  const bonusCoins = 10000 * nextPrestige;
  const newMultiplier = (1 + 0.25 * nextPrestige).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 800,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        style={{
          background: "linear-gradient(160deg, #1c0a3b, #0f0720)",
          borderRadius: "24px",
          padding: "28px 24px",
          textAlign: "center",
          maxWidth: "320px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "2px solid #7c3aed44",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⭐</div>
        <div style={{ fontWeight: 900, fontSize: "1.15rem", color: "#e9d5ff", marginBottom: "8px" }}>
          Престиж #{nextPrestige}
        </div>
        <div style={{ fontSize: "0.8rem", color: "#a78bfa", marginBottom: "20px", lineHeight: 1.6 }}>
          Все здания сбрасываются до нуля.<br />
          Взамен вы получаете постоянный<br />
          множитель дохода <strong style={{ color: "#fbbf24" }}>×{newMultiplier}</strong>
        </div>

        <div style={{
          background: "rgba(251,191,36,0.1)",
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "20px",
          border: "1px solid rgba(251,191,36,0.25)",
        }}>
          <div style={{ fontSize: "0.65rem", color: "#a16207", fontWeight: 600, marginBottom: "4px" }}>Бонус монет</div>
          <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#fbbf24" }}>
            +{fmtCoins(bonusCoins)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "12px",
              background: "rgba(255,255,255,0.06)",
              color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
            }}
          >
            Отмена
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: "12px",
              background: loading ? "#4c1d95" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "#fff", border: "none",
              borderRadius: "12px", fontWeight: 800, fontSize: "0.85rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}
          >
            {loading ? "..." : "⭐ Престиж!"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Offline Earnings Modal ────────────────────────────────────────────────────

function OfflineModal({ coins, onCollect }: { coins: number; onCollect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 500,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        style={{
          background: "linear-gradient(160deg, #fffbeb, #fef3c7)",
          borderRadius: "24px",
          padding: "28px 24px",
          textAlign: "center",
          maxWidth: "320px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          border: "2px solid #fde68a",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>💰</div>
        <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#92400e", marginBottom: "8px" }}>
          Пока вас не было...
        </div>
        <div style={{ color: "#a16207", fontSize: "0.85rem", marginBottom: "20px" }}>
          Ваша империя заработала
        </div>
        <div style={{ fontWeight: 900, fontSize: "2rem", color: "#d97706", marginBottom: "8px" }}>
          +{fmtCoins(coins)}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#a16207", marginBottom: "24px" }}>монет</div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onCollect}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 4px 16px #f59e0b66",
          }}
        >
          Забрать монеты!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function EmpireGame() {
  const { user } = useUserStore();
  const {
    data, loading, buildingLoading, localCoins,
    fetch, collect, build, claimDailyReward, tickCoins, prestige,
  } = useEmpireStore();
  const { add: addToast } = useToast();
  const [showOffline, setShowOffline] = useState(false);
  const [offlineCoins, setOfflineCoins] = useState(0);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);
  const [coinFlash, setCoinFlash] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; stage: typeof STAGES[0] } | null>(null);
  const [showPrestige, setShowPrestige] = useState(false);
  const [prestigeLoading, setPrestigeLoading] = useState(false);
  const [incomeHistory, setIncomeHistory] = useState<number[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const collectBtnRef = useRef<HTMLButtonElement>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(userId).then(() => {
      const d = useEmpireStore.getState().data;
      if (d && d.pending_coins > 5) {
        setOfflineCoins(d.pending_coins);
        setShowOffline(true);
      }
    });
  }, [userId, fetch]);

  // Track income history for sparkline (up to 12 data points)
  useEffect(() => {
    if (!data || data.income_per_hour <= 0) return;
    setIncomeHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last === data.income_per_hour) return prev;
      const next = [...prev, data.income_per_hour].slice(-12);
      return next;
    });
  }, [data?.income_per_hour]);

  // Client-side coin ticker
  useEffect(() => {
    if (!data) return;
    const incomePerSec = data.income_per_hour / 3600;
    if (incomePerSec <= 0) return;
    tickRef.current = setInterval(() => {
      tickCoins(incomePerSec);
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [data?.income_per_hour, tickCoins]);

  const handleCollect = useCallback(async () => {
    if (!userId) return;
    setShowOffline(false);
    hapticImpact("medium");
    if (collectBtnRef.current) {
      const r = collectBtnRef.current.getBoundingClientRect();
      setBurstOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      setTimeout(() => setBurstOrigin(null), 50);
    } else {
      setBurstOrigin({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 });
      setTimeout(() => setBurstOrigin(null), 50);
    }
    try {
      const earned = await collect(userId);
      hapticNotify("success");
      setCoinFlash(true);
      setTimeout(() => setCoinFlash(false), 700);
      addToast(`+${fmtCoins(earned)} монет собрано!`, "success");
    } catch {
      hapticNotify("error");
      addToast("Ошибка сбора монет", "error");
    }
  }, [userId, collect, addToast]);

  const handleBuild = useCallback(async (buildingType: string) => {
    if (!userId) return;
    hapticImpact("light");
    const prevEmpLevel = data?.empire_level ?? 1;
    try {
      const result = await build(userId, buildingType);
      const def = BUILDINGS.find((b) => b.key === buildingType)!;
      hapticNotify("success");
      addToast(`${def.name} улучшена до ур.${result.new_level}!`, "success");
      if (result.empire_level > prevEmpLevel) {
        const newStage = STAGES.slice().reverse().find((s) => result.empire_level >= s.unlock) ?? STAGES[0];
        setLevelUpData({ level: result.empire_level, stage: newStage });
      }
    } catch (e: unknown) {
      hapticNotify("error");
      const msg = e instanceof Error ? e.message : "Ошибка улучшения";
      addToast(msg, "error");
    }
  }, [userId, build, addToast, data?.empire_level]);

  const handlePrestige = useCallback(async () => {
    if (!userId) return;
    setPrestigeLoading(true);
    try {
      const res = await prestige(userId);
      hapticNotify("success");
      setShowPrestige(false);
      addToast(`⭐ Престиж #${res.prestige_count}! +${fmtCoins(res.bonus_coins)} монет`, "success");
    } catch (e: unknown) {
      hapticNotify("error");
      const msg = e instanceof Error ? e.message : "Ошибка престижа";
      addToast(msg, "error");
    } finally {
      setPrestigeLoading(false);
    }
  }, [userId, prestige, addToast]);

  const handleDailyReward = useCallback(async () => {
    if (!userId) return;
    hapticImpact("heavy");
    try {
      const res = await claimDailyReward(userId);
      hapticNotify("success");
      addToast(`🎁 День ${res.day}: +${fmtCoins(res.coins)} монет!`, "success");
    } catch {
      hapticNotify("error");
      addToast("Награда недоступна", "error");
    }
  }, [userId, claimDailyReward, addToast]);

  if (!userId) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
        Войдите, чтобы начать
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ fontSize: "2rem", display: "inline-block" }}
        >
          ⚙️
        </motion.div>
        <div style={{ color: "#6b7280", marginTop: "12px", fontSize: "0.85rem" }}>
          Загрузка империи...
        </div>
      </div>
    );
  }

  const buildings = data?.buildings ?? {};
  const empireLevel = data?.empire_level ?? 1;
  const coins = (data?.coins ?? 0) + localCoins;
  const availableXp = data?.available_xp ?? 0;
  const incomePerHour = data?.income_per_hour ?? 0;
  const prestigeCount = data?.prestige_count ?? 0;
  const currentStage = STAGES.slice().reverse().find((s) => empireLevel >= s.unlock) ?? STAGES[0];
  const pendingCoins = (data?.pending_coins ?? 0) + localCoins;

  const totalBuildingLevels = Object.values(buildings).reduce((a: number, b) => a + (b as number), 0);
  const levelProgress = (totalBuildingLevels % 5) / 5;

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Coin burst */}
      <CoinBurst origin={burstOrigin} />

      {/* Offline earnings modal */}
      <AnimatePresence>
        {showOffline && offlineCoins > 5 && (
          <OfflineModal coins={offlineCoins} onCollect={handleCollect} />
        )}
      </AnimatePresence>

      {/* Level-up celebration */}
      <AnimatePresence>
        {levelUpData && (
          <LevelUpCelebration
            level={levelUpData.level}
            stage={levelUpData.stage}
            onClose={() => setLevelUpData(null)}
          />
        )}
      </AnimatePresence>

      {/* Prestige modal */}
      <AnimatePresence>
        {showPrestige && (
          <PrestigeModal
            prestigeCount={prestigeCount}
            onConfirm={handlePrestige}
            onCancel={() => setShowPrestige(false)}
            loading={prestigeLoading}
          />
        )}
      </AnimatePresence>

      {/* Building detail sheet */}
      <AnimatePresence>
        {selectedBuilding && (() => {
          const def = BUILDINGS.find((b) => b.key === selectedBuilding);
          if (!def) return null;
          return (
            <BuildingDetailSheet
              def={def}
              level={buildings[selectedBuilding] ?? 0}
              prestige={prestigeCount}
              availableXp={availableXp}
              onClose={() => setSelectedBuilding(null)}
              onUpgrade={() => { handleBuild(selectedBuilding); setSelectedBuilding(null); }}
              loading={buildingLoading === selectedBuilding}
            />
          );
        })()}
      </AnimatePresence>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, #fffbeb 0%, #fef3c7 60%, ${currentStage.light} 100%)`,
        borderRadius: "0 0 24px 24px",
        padding: "20px 16px 16px",
        marginBottom: "16px",
        borderBottom: `2px solid ${currentStage.color}33`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#1c1917" }}>
              🏰 Моя Империя
            </div>
            <div style={{ fontSize: "0.7rem", color: currentStage.color, fontWeight: 700, marginTop: "2px" }}>
              {currentStage.label} · Ур. {empireLevel}
              {prestigeCount > 0 && (
                <span style={{ marginLeft: "6px", color: "#7c3aed" }}>⭐×{prestigeCount}</span>
              )}
            </div>
            {/* Prestige button — visible when empire_level >= 20 */}
            {empireLevel >= 20 && (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => { hapticImpact("light"); setShowPrestige(true); }}
                style={{
                  marginTop: "6px",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "4px 12px",
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(124,58,237,0.4)",
                  letterSpacing: "0.01em",
                }}
              >
                ⭐ Престиж
              </motion.button>
            )}
          </div>
          {/* SVG arc level badge */}
          <div style={{ position: "relative", width: 60, height: 60 }}>
            <svg width="60" height="60" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
              <circle cx="30" cy="30" r="26" fill="none" stroke={`${currentStage.color}22`} strokeWidth="4" />
              <motion.circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke={currentStage.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - levelProgress) }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 4,
              background: currentStage.color,
              borderRadius: "50%",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: `0 2px 12px ${currentStage.color}55`,
            }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: "1rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                {empireLevel}
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.42rem", fontWeight: 700, letterSpacing: "0.04em" }}>УР.</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "8px" }}>
          <motion.div
            animate={coinFlash ? { scale: [1, 1.06, 1], borderColor: ["#fde68a", "#f59e0b", "#fde68a"] } : {}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              flex: 1,
              background: coinFlash ? "linear-gradient(135deg, #fffbeb, #fef9c3)" : "#fff",
              borderRadius: "14px",
              padding: "10px 12px",
              border: "1.5px solid #fde68a",
              boxShadow: coinFlash ? "0 0 20px rgba(245,158,11,0.4)" : "0 2px 8px rgba(245,158,11,0.12)",
              transition: "background 0.4s, box-shadow 0.4s",
            }}
          >
            <div style={{ fontSize: "0.6rem", color: "#a16207", fontWeight: 600, marginBottom: "2px" }}>💰 Монеты</div>
            <div style={{ fontWeight: 900, fontSize: "1rem", color: "#d97706", fontFamily: "'JetBrains Mono', monospace" }}>
              <AnimatedNumber value={coins} />
            </div>
            <div style={{ fontSize: "0.58rem", color: "#a16207", opacity: 0.8 }}>
              +{fmtCoins(incomePerHour)}/ч
            </div>
          </motion.div>
          <div style={{
            flex: 1,
            background: "#fff",
            borderRadius: "14px",
            padding: "10px 12px",
            border: "1.5px solid #dbeafe",
            boxShadow: "0 2px 8px rgba(59,130,246,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.6rem", color: "#1d4ed8", fontWeight: 600, marginBottom: "2px" }}>📈 Доход/ч</div>
                <div style={{ fontWeight: 900, fontSize: "1rem", color: "#2563eb", fontFamily: "'JetBrains Mono', monospace" }}>
                  <AnimatedNumber value={incomePerHour} />
                </div>
                <div style={{ fontSize: "0.58rem", color: "#6b7280" }}>
                  XP: {fmtCoins(availableXp)}
                </div>
              </div>
              <MicroSparkline history={incomeHistory} color="#3b82f6" />
            </div>
          </div>
          {pendingCoins > 1 && (
            <motion.button
              ref={collectBtnRef}
              whileTap={{ scale: 0.94 }}
              onClick={handleCollect}
              animate={{ boxShadow: ["0 2px 12px rgba(16,185,129,0.3)", "0 4px 24px rgba(16,185,129,0.6)", "0 2px 12px rgba(16,185,129,0.3)"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "14px",
                padding: "10px 8px",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: "0.6rem", fontWeight: 600, opacity: 0.9, marginBottom: "2px" }}>Собрать</div>
              <div style={{ fontWeight: 900, fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>
                +{fmtCoins(pendingCoins)}
              </div>
              <div style={{ fontSize: "0.55rem", opacity: 0.8 }}>монет</div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Daily rewards */}
      {data && (
        <div style={{ marginBottom: "16px" }}>
          <DailyRewards
            day={data.daily_reward_day}
            available={data.daily_reward_available}
            nextIn={data.next_daily_reward_in}
            onClaim={handleDailyReward}
          />
        </div>
      )}

      {/* Buildings by stage */}
      {STAGES.map((stage) => {
        const stageDefs = BUILDINGS.filter((b) => b.stage === stage.stage);
        const isUnlocked = empireLevel >= stage.unlock;
        const nextUnlockNeeded = stage.unlock - empireLevel;

        return (
          <div key={stage.stage} style={{ marginBottom: "20px" }}>
            {/* Stage header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "0 16px", marginBottom: "10px",
            }}>
              <div style={{
                flex: 1, height: "1px",
                background: isUnlocked ? `linear-gradient(90deg, transparent, ${stage.color}66)` : "#e5e7eb",
              }} />
              <div style={{
                background: isUnlocked ? stage.color : "#e5e7eb",
                color: isUnlocked ? "#fff" : "#9ca3af",
                borderRadius: "99px",
                padding: "4px 12px",
                fontSize: "0.72rem",
                fontWeight: 800,
                display: "flex", alignItems: "center", gap: "4px",
                whiteSpace: "nowrap",
              }}>
                {stage.label}
                {!isUnlocked && (
                  <span style={{ fontSize: "0.6rem", opacity: 0.8 }}>🔒 +{nextUnlockNeeded} ур.</span>
                )}
              </div>
              <div style={{
                flex: 1, height: "1px",
                background: isUnlocked ? `linear-gradient(90deg, ${stage.color}66, transparent)` : "#e5e7eb",
              }} />
            </div>

            {/* Building grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              padding: "0 16px",
              opacity: isUnlocked ? 1 : 0.4,
              pointerEvents: isUnlocked ? "auto" : "none",
            }}>
              {stageDefs.map((def) => (
                <BuildingCard
                  key={def.key}
                  def={def}
                  level={buildings[def.key] ?? 0}
                  prestige={prestigeCount}
                  availableXp={availableXp}
                  onUpgrade={() => handleBuild(def.key)}
                  onInfo={() => { hapticImpact("light"); setSelectedBuilding(def.key); }}
                  loading={buildingLoading === def.key}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Leaderboard */}
      <div style={{ marginTop: "8px" }}>
        <EmpireLeaderboard userId={userId} />
      </div>

      {/* XP info note */}
      <div style={{
        margin: "12px 16px 0",
        background: "#eff6ff",
        borderRadius: "12px",
        padding: "10px 14px",
        border: "1px solid #dbeafe",
      }}>
        <div style={{ fontSize: "0.68rem", color: "#1d4ed8", fontWeight: 600, marginBottom: "2px" }}>
          💡 Как работает XP
        </div>
        <div style={{ fontSize: "0.62rem", color: "#3b82f6", lineHeight: 1.5 }}>
          Свободный XP = ваш общий XP минус потраченный в Империи.
          Уровень аккаунта <strong>никогда не снижается</strong> — это только баланс для игры.
        </div>
      </div>
    </div>
  );
}
