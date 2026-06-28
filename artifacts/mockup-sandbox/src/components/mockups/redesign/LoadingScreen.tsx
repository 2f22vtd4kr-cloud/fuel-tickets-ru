import React, { useMemo } from "react";
import "./_group.css";

export function LoadingScreen() {
  // Generate random particles for background
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  return (
    <div className="relative w-full h-[844px] max-w-[390px] mx-auto bg-[#0A0A0F] text-white overflow-hidden font-['Inter',sans-serif]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-ambient-glow pointer-events-none" />
      
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Top Bar / Logo */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center z-10">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold tracking-tight">Топливо ⛽️</div>
        </div>
      </div>

      {/* Main Typographic Splash */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 pointer-events-none z-10 leading-[0.85] tracking-tighter pt-12">
        <div className="flex flex-col gap-3">
          
          {/* Word 1 */}
          <div className="word-enter-1 self-start relative">
            <div className="absolute -inset-x-4 -inset-y-1 bg-[#A855F7] -z-10 mix-blend-screen opacity-80 rotate-[-2deg] rounded-sm" />
            <h1 className="text-[64px] font-black uppercase text-white m-0">ПОХУЙ</h1>
          </div>

          {/* Word 2 */}
          <div className="word-enter-2 self-end relative mt-2">
            <div className="absolute -inset-x-4 -inset-y-1 bg-[#22D3EE] -z-10 mix-blend-screen opacity-80 rotate-[1deg] rounded-sm" />
            <h1 className="text-[64px] font-black uppercase text-white m-0 text-right">ИНФЛЯЦИЯ —</h1>
          </div>

          {/* Word 3 */}
          <div className="word-enter-3 self-start relative mt-2">
            <div className="absolute -inset-x-4 -inset-y-1 bg-[#A855F7] -z-10 mix-blend-screen opacity-80 rotate-[2deg] rounded-sm" />
            <h1 className="text-[58px] font-black uppercase text-white m-0">БЕРИ ТАЛОНЫ</h1>
          </div>

          {/* Word 4 */}
          <div className="word-enter-4 self-end relative mt-2">
            <div className="absolute -inset-x-4 -inset-y-1 bg-[#22D3EE] -z-10 mix-blend-screen opacity-80 rotate-[-1deg] rounded-sm" />
            <h1 className="text-[52px] font-black uppercase text-white m-0 text-right">И ЗАМОРАЖИВАЙ</h1>
          </div>

          {/* Word 5 */}
          <div className="word-enter-5 self-start relative mt-4">
            <h1 className="text-[80px] font-black uppercase text-white m-0 text-gradient-violet">ЦЕНЫ</h1>
          </div>

        </div>
      </div>

      {/* Loading Bar at Bottom */}
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+32px)] left-8 right-8 z-20">
        <div className="flex justify-between items-center mb-3">
          <div className="font-mono text-xs text-white/50 tracking-wider">
            Загрузка...
          </div>
          <div className="font-mono text-xs text-[#22D3EE] opacity-80 tracking-wider">
            100%
          </div>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-md relative border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#22D3EE] animate-loading-bar rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>
      </div>

    </div>
  );
}
