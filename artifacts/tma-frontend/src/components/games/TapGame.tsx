import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore as useMinigameStore } from "@/stores/useGameStore";
import { impact as hapticImpact } from "@/lib/haptic";

export function TapGame() {
  const { setTapScore } = useMinigameStore();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const target = e.currentTarget.getBoundingClientRect();
    const x = clientX - target.left;
    const y = clientY - target.top;
    setScore((s) => s + 1);
    hapticImpact("light");
    const newClick = { id: Date.now(), x, y };
    setClicks((prev) => [...prev.slice(-10), newClick]);
    setTimeout(() => setClicks((prev) => prev.filter((c) => c.id !== newClick.id)), 800);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsActive(true);
  };

  useEffect(() => {
    let timer: number;
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setTapScore(score);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, setTapScore]);

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* warm glow */}
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: "rgba(232,98,42,0.1)", filter: "blur(28px)" }} />

      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-base text-white">Клик-Мания</h3>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Нажми как можно больше раз</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-black" style={{ color: isActive ? "#E8622A" : "rgba(255,255,255,0.6)" }}>
            {timeLeft}с
          </div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Время</div>
        </div>
      </div>

      <div
        className="relative h-48 rounded-xl overflow-hidden touch-none flex flex-col items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={handleTap}
      >
        {!isActive && timeLeft === 0 && (
          <div className="text-center z-10">
            {score > 0 && (
              <div className="mb-3">
                <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Результат</div>
                <div className="text-4xl font-black text-white">{score}</div>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-7 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: "#E8622A", boxShadow: "0 0 18px rgba(232,98,42,0.4)" }}
            >
              {score > 0 ? "Снова" : "Старт"}
            </button>
          </div>
        )}

        {isActive && (
          <>
            <div className="text-6xl font-black select-none pointer-events-none" style={{ color: "rgba(255,255,255,0.15)" }}>
              {score}
            </div>
            <AnimatePresence>
              {clicks.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -50, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute font-black pointer-events-none text-sm"
                  style={{ left: c.x, top: c.y, color: "#E8622A" }}
                >
                  +1
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.28)" }}>
        <span>Цель: 50 тапов</span>
        <span>Бонус: +10 XP</span>
      </div>
    </div>
  );
}
