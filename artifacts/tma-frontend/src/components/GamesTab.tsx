import { useState } from "react";
import { motion } from "framer-motion";
import { EmpireGame } from "@/components/EmpireGame";
import { ReserveTab } from "@/components/ReserveTab";
import { Crown, Sparkles } from "lucide-react";

type GameId = "empire" | "lunapark";

const GAMES: { id: GameId; icon: React.ReactNode; label: string; sublabel: string }[] = [
  { id: "empire",   icon: <Crown size={16} />,    label: "Империя",  sublabel: "Стройте нефтяную империю" },
  { id: "lunapark", icon: <Sparkles size={16} />, label: "Луна-парк", sublabel: "Мини-игры и карты удачи"   },
];

export function GamesTab() {
  const [active, setActive] = useState<GameId>("empire");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Sub-tab switcher */}
      <div style={{
        padding: "12px 12px 0",
        display: "flex",
        gap: "8px",
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {GAMES.map(g => {
          const isActive = active === g.id;
          return (
            <motion.button
              key={g.id}
              onClick={() => setActive(g.id)}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "2px", padding: "10px 8px",
                background: isActive ? "var(--bg-glass-hover)" : "transparent",
                border: isActive ? "1px solid var(--border-glass)" : "1px solid transparent",
                borderRadius: "14px 14px 0 0",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="games-tab-indicator"
                  style={{
                    position: "absolute", bottom: "-1px", left: "20%", right: "20%",
                    height: "2px", borderRadius: "999px",
                    background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                    boxShadow: "0 0 8px rgba(167,139,250,0.5)",
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <motion.div
                animate={{ color: isActive ? "var(--accent-primary)" : "var(--text-tertiary)" }}
                style={{ display: "flex" }}
              >
                {g.icon}
              </motion.div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: isActive ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                {g.label}
              </span>
              <span style={{ fontSize: "0.6rem", color: "var(--text-tertiary)", display: "none" }}>{g.sublabel}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Game content */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {active === "empire"   && <EmpireGame />}
        {active === "lunapark" && <ReserveTab />}
      </div>
    </div>
  );
}
