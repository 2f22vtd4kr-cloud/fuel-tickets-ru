import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Gift, Zap } from "lucide-react";
import { GamesPage as EmpireGame } from "./games/EmpireGame";
import { FlipCardGame } from "./games/FlipCardGame";
import { TapGame } from "./games/TapGame";
import { XPTiers } from "./games/XPTiers";

type GameSubTab = "empire" | "minigames" | "xp";

const STAR_COUNT = 60;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: (i * 137.508 + 11) % 100,
  y: (i * 91.337 + 7) % 100,
  r: 0.35 + (i % 5) * 0.18,
  delay: (i % 8) * 0.45,
}));

export function GamesPage() {
  const [activeSubTab, setActiveSubTab] = useState<GameSubTab>("empire");

  return (
    <div
      className="flex flex-col h-full text-white font-inter overflow-hidden relative"
      style={{ background: "linear-gradient(160deg,#1E22DC 0%,#181CC6 40%,#1318B0 75%,#1015A5 100%)" }}
    >
      {/* Starfield */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.35, zIndex: 0 }}>
        <defs>
          <style>{`@keyframes gt{0%,100%{opacity:.08}50%{opacity:.85}}`}</style>
        </defs>
        {STARS.map((s) => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
            style={{ animation: `gt ${2.6 + s.delay}s ease-in-out infinite`, animationDelay: `${s.delay}s` }} />
        ))}
      </svg>

      {/* Sub-tab Switcher */}
      <div className="px-4 pt-4 shrink-0 relative z-10">
        <div
          className="flex p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
        >
          {([
            { id: "empire",    icon: <Gamepad2 size={13} />, label: "Империя" },
            { id: "minigames", icon: <Gift size={13} />,     label: "Мини-игры" },
            { id: "xp",        icon: <Zap size={13} />,      label: "Опыт" },
          ] as { id: GameSubTab; icon: React.ReactNode; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={
                activeSubTab === tab.id
                  ? { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.32)", color: "#ffffff" }
                  : { border: "1px solid transparent", color: "rgba(255,255,255,0.38)" }
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {activeSubTab === "empire" && (
            <motion.div
              key="empire"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <EmpireGame />
            </motion.div>
          )}

          {activeSubTab === "minigames" && (
            <motion.div
              key="minigames"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-5 space-y-4 pb-24"
            >
              <FlipCardGame />
              <TapGame />
            </motion.div>
          )}

          {activeSubTab === "xp" && (
            <motion.div
              key="xp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-5 pb-24"
            >
              <XPTiers />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
