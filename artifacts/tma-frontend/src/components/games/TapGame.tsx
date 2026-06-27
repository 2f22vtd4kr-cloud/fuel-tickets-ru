import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore as useMinigameStore } from "@/stores/useGameStore";
import { useGameStore } from "@/game/store";
import { impact as hapticImpact } from "@/lib/haptic";

export function TapGame() {
  const { setTapScore } = useMinigameStore();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const target = e.currentTarget.getBoundingClientRect();
    
    const x = clientX - target.left;
    const y = clientY - target.top;
    
    setScore(s => s + 1);
    hapticImpact("light");
    
    const newClick = { id: Date.now(), x, y };
    setClicks(prev => [...prev.slice(-10), newClick]);
    
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 800);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsActive(true);
  };

  useEffect(() => {
    let timer: number;
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setTapScore(score);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, setTapScore]);

  return (
    <div className="rounded-2xl p-5 bg-[rgba(20,20,32,0.88)] backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden">
      <div 
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-10 bg-cyan-500"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-base">Клик-Мания</h3>
          <p className="text-xs text-white/50">Нажми как можно больше раз</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-cyan-400">{timeLeft}с</div>
          <div className="text-[10px] text-white/30 uppercase">Время</div>
        </div>
      </div>

      <div className="relative h-48 bg-white/5 rounded-xl border border-white/5 overflow-hidden touch-none flex flex-col items-center justify-center" onClick={handleTap}>
        {!isActive && timeLeft === 0 && (
          <div className="text-center z-10">
            {score > 0 && (
              <div className="mb-2">
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Результат</div>
                <div className="text-3xl font-black text-cyan-400">{score}</div>
              </div>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2 bg-cyan-600 rounded-full text-xs font-bold shadow-lg shadow-cyan-600/30"
            >
              {score > 0 ? "Снова" : "Старт"}
            </button>
          </div>
        )}

        {isActive && (
          <>
            <div className="text-6xl font-black text-white/20 select-none pointer-events-none">{score}</div>
            <AnimatePresence>
              {clicks.map(c => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -50, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute text-cyan-400 font-bold pointer-events-none"
                  style={{ left: c.x, top: c.y }}
                >
                  +1
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-wider">
        <span>Цель: 50 тапов</span>
        <span>Бонус: +10 XP</span>
      </div>
    </div>
  );
}
