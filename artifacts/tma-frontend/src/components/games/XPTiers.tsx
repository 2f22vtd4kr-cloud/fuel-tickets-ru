import { motion } from "framer-motion";
import { Zap, Trophy, TrendingUp } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useGameStore as useMinigameStore } from "@/stores/useGameStore";

interface XPLevel {
  xp: number;
  label: string;
  bonus: string;
}

const XP_TIERS: XPLevel[] = [
  { xp: 0,     label: "Новичок",     bonus: "—" },
  { xp: 500,   label: "Энтузиаст",   bonus: "+5% доход" },
  { xp: 2000,  label: "Бригадир",    bonus: "+10% доход" },
  { xp: 10000, label: "Управляющий", bonus: "+20% доход" },
  { xp: 50000, label: "Магнат",      bonus: "+50% доход" },
];

const glass = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(14px)",
} as const;

export function XPTiers() {
  const { state } = useGameStore();
  const { tapHighScore } = useMinigameStore();
  const xp = state.resources.xp || 0;

  const currentTier = [...XP_TIERS].reverse().find((t) => xp >= t.xp) || XP_TIERS[0];
  const nextTierIndex = XP_TIERS.indexOf(currentTier) + 1;
  const nextTier = XP_TIERS[nextTierIndex];
  const progress = nextTier
    ? ((xp - currentTier.xp) / (nextTier.xp - currentTier.xp)) * 100
    : 100;

  return (
    <div className="space-y-4">
      {/* XP Card */}
      <div className="rounded-2xl p-4" style={glass}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(232,98,42,0.15)", border: "1px solid rgba(232,98,42,0.3)" }}
            >
              <Zap size={20} style={{ color: "#E8622A" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Ваш Опыт (XP)</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{currentTier.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black" style={{ color: "#E8622A" }}>{xp.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Всего XP</div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              <span>До {nextTier.label}</span>
              <span>{Math.floor(nextTier.xp - xp).toLocaleString()} XP</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#1E22DC,#E8622A)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={glass}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} style={{ color: "#fbbf24" }} />
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>Рекорд (Tap)</span>
          </div>
          <div className="text-xl font-black text-white">{tapHighScore.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl p-4" style={glass}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} style={{ color: "#E8622A" }} />
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>Бонус дохода</span>
          </div>
          <div className="text-xl font-black text-white">{currentTier.bonus}</div>
        </div>
      </div>

      {/* Tier list */}
      <div className="rounded-2xl p-4 space-y-2" style={glass}>
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Уровни опыта</div>
        {XP_TIERS.map((tier, i) => {
          const isActive = currentTier.label === tier.label;
          return (
            <div
              key={tier.label}
              className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{
                background: isActive ? "rgba(232,98,42,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? "rgba(232,98,42,0.35)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{["🌱","⚡","🔧","📊","🏭"][i]}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: isActive ? "#E8622A" : "#fff" }}>{tier.label}</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{tier.xp.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="text-xs font-semibold" style={{ color: isActive ? "#E8622A" : "rgba(255,255,255,0.4)" }}>{tier.bonus}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
