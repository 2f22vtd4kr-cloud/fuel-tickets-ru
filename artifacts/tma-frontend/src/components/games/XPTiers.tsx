import { motion } from "framer-motion";
import { Coins, Zap, Trophy, TrendingUp } from "lucide-react";
import { useGameStore } from "@/game/store";
import { useGameStore as useMinigameStore } from "@/stores/useGameStore";
import { useUserStore } from "@/stores/useUserStore";

interface XPLevel {
  xp: number;
  label: string;
  bonus: string;
}

const XP_TIERS: XPLevel[] = [
  { xp: 0, label: "Новичок", bonus: "—" },
  { xp: 500, label: "Энтузиаст", bonus: "+5% доход" },
  { xp: 2000, label: "Бригадир", bonus: "+10% доход" },
  { xp: 10000, label: "Управляющий", bonus: "+20% доход" },
  { xp: 50000, label: "Магнат", bonus: "+50% доход" },
];

export function XPTiers() {
  const { state } = useGameStore();
  const { tapHighScore } = useMinigameStore();
  const xp = state.resources.xp || 0;
  
  const currentTier = [...XP_TIERS].reverse().find(t => xp >= t.xp) || XP_TIERS[0];
  const nextTierIndex = XP_TIERS.indexOf(currentTier) + 1;
  const nextTier = XP_TIERS[nextTierIndex];
  
  const progress = nextTier 
    ? ((xp - currentTier.xp) / (nextTier.xp - currentTier.xp)) * 100 
    : 100;

  return (
    <div className="space-y-4">
      {/* XP Card */}
      <div 
        className="rounded-2xl p-4 bg-[rgba(20,20,32,0.88)] backdrop-blur-xl border border-white/5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
              <Zap size={20} className="text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ваш Опыт (XP)</h3>
              <p className="text-xs text-white/50">{currentTier.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-violet-400">{xp.toLocaleString()}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Всего XP</div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>До {nextTier.label}</span>
              <span>{Math.floor(nextTier.xp - xp).toLocaleString()} XP</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-right from-violet-600 to-fuchsia-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 bg-[rgba(20,20,32,0.88)] backdrop-blur-xl border border-white/5">
          <div className="flex items-center gap-2 mb-2 text-yellow-400">
            <Trophy size={14} />
            <span className="text-[10px] font-bold uppercase">Рекорд (Tap)</span>
          </div>
          <div className="text-xl font-black">{tapHighScore.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl p-4 bg-[rgba(20,20,32,0.88)] backdrop-blur-xl border border-white/5">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <TrendingUp size={14} />
            <span className="text-[10px] font-bold uppercase">Бонус дохода</span>
          </div>
          <div className="text-xl font-black">{currentTier.bonus}</div>
        </div>
      </div>
    </div>
  );
}
