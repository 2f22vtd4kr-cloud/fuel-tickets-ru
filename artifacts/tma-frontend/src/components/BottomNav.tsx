import { motion } from "framer-motion";
import { impact } from "@/lib/haptic";
import type { TabId } from "@/types";
import { Map, Ticket, Bot, Gamepad2, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  visible?: boolean;
  badges?: Partial<Record<TabId, number>>;
}

const TABS: { id: TabId; Icon: LucideIcon; label: string }[] = [
  { id: "map",     Icon: Map,       label: "Карта"       },
  { id: "catalog", Icon: Ticket,    label: "Талоны"      },
  { id: "ai",      Icon: Bot,       label: "ИИ-Советник" },
  { id: "games",   Icon: Gamepad2,  label: "Игры"        },
  { id: "news",    Icon: Newspaper, label: "Новости"     },
];

export function BottomNav({ active, onChange, visible = true, badges = {} }: Props) {
  const handleTabClick = (tab: TabId) => {
    impact("light");
    onChange(tab);
  };

  return (
    <motion.nav
      animate={{ y: visible ? 0 : "200%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
        left: "12px",
        right: "12px",
        background: "rgba(8,8,16,0.90)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderTopColor: "rgba(255,255,255,0.18)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "stretch",
        borderRadius: "999px",
        height: "64px",
        zIndex: 10000,
        padding: "0 6px",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const badge = badges[tab.id] ?? 0;
        return (
          <motion.button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            whileTap={{ scale: 0.85 }}
            style={{
              flex: 1,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "3px",
              background: "none", border: "none",
              cursor: "pointer", position: "relative",
              WebkitTapHighlightColor: "transparent",
              borderRadius: "999px",
              minWidth: 0,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                style={{
                  position: "absolute",
                  top: "8px", left: "20%", right: "20%",
                  height: "2px",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                  boxShadow: "0 0 10px rgba(167,139,250,0.6), 0 0 20px rgba(167,139,250,0.3)",
                }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}

            {tab.id === "games" && !isActive && (
              <div style={{
                position: "absolute",
                top: "10px", right: "calc(50% - 16px)",
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "var(--accent-secondary)",
                boxShadow: "0 0 6px rgba(244,114,182,0.8)",
                animation: "crisisPulse 1.8s ease-in-out infinite",
                zIndex: 2,
              }} />
            )}

            {badge > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: "absolute",
                  top: "8px", right: "calc(50% - 18px)",
                  background: "linear-gradient(135deg, var(--accent-danger), #dc2626)",
                  color: "#fff",
                  borderRadius: "999px",
                  minWidth: "16px", height: "16px",
                  fontSize: "0.45rem", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 3px",
                  boxShadow: "0 0 8px rgba(251,113,133,0.65)",
                  border: "1.5px solid rgba(8,8,16,0.9)",
                  zIndex: 2,
                }}
              >
                {badge > 99 ? "99+" : badge}
              </motion.div>
            )}

            <motion.div
              animate={{
                background: isActive ? "rgba(167,139,250,0.15)" : "transparent",
              }}
              transition={{ duration: 0.2 }}
              style={{
                width: "36px", height: "36px",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <motion.div
                animate={{
                  color: isActive ? "#c4b5fd" : "#4b5563",
                  scale: isActive ? 1.1 : 1,
                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(167,139,250,0.6))"
                    : "none",
                }}
                transition={{ type: "spring", damping: 16, stiffness: 260 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <tab.Icon size={20} />
              </motion.div>
            </motion.div>

            <motion.span
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 3 }}
              transition={{ duration: 0.15 }}
              style={{
                fontSize: "0.48rem",
                letterSpacing: "0.05em",
                lineHeight: 1,
                color: "#c4b5fd",
                fontWeight: 700,
                position: "absolute",
                bottom: "7px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </motion.span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
