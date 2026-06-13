import { motion } from "framer-motion";
import type { TabId } from "@/types";

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  visible?: boolean;
  badges?: Partial<Record<TabId, number>>;
}

const TABS: { id: TabId; emoji: string; label: string }[] = [
  { id: "map",       emoji: "🗺️", label: "Карта" },
  { id: "analytics", emoji: "📊", label: "Аналитика" },
  { id: "catalog",   emoji: "⛽", label: "Каталог" },
  { id: "vault",     emoji: "🗄️", label: "Мой Сейф" },
  { id: "reserve",   emoji: "🎰", label: "Фортуна" },
];

export function BottomNav({ active, onChange, visible = true, badges = {} }: Props) {
  return (
    <motion.nav
      animate={{ y: visible ? 0 : "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(11,11,15,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid #22222f",
        display: "flex", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        zIndex: 10000,
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const badgeCount = badges[tab.id] ?? 0;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "2px",
              padding: "0.6rem 0.25rem",
              background: "none", border: "none",
              cursor: "pointer", position: "relative",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                style={{
                  position: "absolute", top: 0, left: "15%", right: "15%",
                  height: "2px", borderRadius: "1px",
                  background: "linear-gradient(90deg,#a855f7,#db2777)",
                  boxShadow: "0 0 8px #a855f7",
                }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            <div style={{ position: "relative", lineHeight: 1 }}>
              <motion.span
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", damping: 20 }}
                style={{ fontSize: "1.25rem", lineHeight: 1, display: "block" }}
              >
                {tab.emoji}
              </motion.span>
              {badgeCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "-4px", right: "-6px",
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    color: "#fff",
                    borderRadius: "99px",
                    minWidth: "16px", height: "16px",
                    fontSize: "0.5rem", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 3px",
                    boxShadow: "0 0 8px #ef444488",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </motion.div>
              )}
            </div>
            <span style={{
              fontSize: "0.6rem",
              color: isActive ? "#a855f7" : "#6b7280",
              fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
