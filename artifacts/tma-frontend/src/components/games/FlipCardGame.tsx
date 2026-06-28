import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore as useMinigameStore } from "@/stores/useGameStore";
import { useGameStore } from "@/game/store";
import { select as hapticSelect, notify as hapticNotify } from "@/lib/haptic";

export function FlipCardGame() {
  const { flipsRemaining, lastFlipResult, setFlipResult } = useMinigameStore();
  const { state, tickGame } = useGameStore();
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (flipsRemaining <= 0 || isFlipping) return;
    hapticSelect();
    setIsFlipping(true);
    setTimeout(() => {
      const outcomes = ["win_100", "win_500", "win_xp_10", "lose", "lose"];
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      setFlipResult(result, flipsRemaining - 1);
      setIsFlipping(false);
      if (result.startsWith("win")) hapticNotify("success");
    }, 800);
  };

  const isWin = lastFlipResult?.startsWith("win");

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
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: "rgba(232,98,42,0.12)", filter: "blur(28px)" }} />

      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-base text-white">Удача Магната</h3>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Переверни карту и выиграй</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-white">{flipsRemaining} / 3</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Попыток</div>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <motion.div
          animate={isFlipping ? { rotateY: 180 } : { rotateY: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={handleFlip}
          className={`w-32 h-44 rounded-2xl cursor-pointer relative ${flipsRemaining <= 0 ? "opacity-50 grayscale" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card Back */}
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg,#1E22DC,#1015A5)",
              border: "2px solid rgba(255,255,255,0.18)",
              backfaceVisibility: "hidden",
              boxShadow: "0 8px 32px rgba(14,16,140,0.5)",
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}>
              <span className="text-3xl font-black italic" style={{ color: "rgba(255,255,255,0.7)" }}>F</span>
            </div>
          </div>

          {/* Card Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
            style={{
              background: isWin ? "rgba(232,98,42,0.15)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${isWin ? "rgba(232,98,42,0.5)" : "rgba(255,255,255,0.12)"}`,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-4xl mb-2">{lastFlipResult?.startsWith("win") ? "🎁" : "❌"}</span>
            <span className="text-sm font-bold text-white text-center px-2">
              {lastFlipResult === "win_100" && "+100 💰"}
              {lastFlipResult === "win_500" && "+500 💰"}
              {lastFlipResult === "win_xp_10" && "+10 ⭐"}
              {lastFlipResult?.startsWith("lose") && "Пусто"}
              {!lastFlipResult && "???"}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleFlip}
          disabled={flipsRemaining <= 0 || isFlipping}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={
            flipsRemaining > 0 && !isFlipping
              ? { background: "#E8622A", color: "#fff", boxShadow: "0 0 20px rgba(232,98,42,0.35)" }
              : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.07)" }
          }
        >
          {isFlipping ? "Тасуем..." : flipsRemaining > 0 ? "Испытать удачу" : "Ждите завтра"}
        </button>
      </div>
    </div>
  );
}
