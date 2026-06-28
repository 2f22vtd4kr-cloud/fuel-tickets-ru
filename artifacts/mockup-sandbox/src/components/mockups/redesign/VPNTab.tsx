import React, { useState, useEffect } from 'react';
import { Shield, Lock, EyeOff, Zap, Star } from 'lucide-react';
import './_group.css';

export const VPNTab: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState(47 * 60 + 23); // 47:23

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-[390px] h-[844px] bg-[#0A0A0F] text-white relative flex flex-col font-inter rounded-[32px] overflow-hidden shadow-2xl border border-white/10" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Ambient Glow */}
      <div 
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 ease-in-out ${
          isActive ? 'bg-green-500/15' : 'bg-red-500/5'
        }`} 
      />

      {/* Drag Handle */}
      <div className="w-full flex justify-center pt-4 pb-2 z-10">
        <div className="w-12 h-1.5 bg-white/20 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-5 pb-8 z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mt-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2 tracking-tight">
            <Lock className="w-5 h-5 text-white/80" /> Анонимный канал
          </h1>
          <p className="text-white/50 text-sm mt-1.5 font-medium">Защищённое VPN-соединение</p>
        </div>

        {/* Main Status Card */}
        <div className="glass-panel-heavy rounded-[32px] p-6 flex flex-col items-center relative overflow-hidden mt-2 border border-white/10">
           {/* Inner glow for the card itself */}
           <div 
             className={`absolute top-0 inset-x-0 h-32 opacity-30 pointer-events-none transition-colors duration-700 ${
               isActive ? 'bg-gradient-to-b from-green-500/30 to-transparent' : 'bg-gradient-to-b from-white/5 to-transparent'
             }`} 
           />

          {/* Shield Icon Container */}
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative w-32 h-36 mt-4 mb-6 flex items-center justify-center transition-all duration-500 transform ${
              isActive ? 'scale-100' : 'scale-95'
            }`}
          >
            {/* The animated shield background */}
            <div 
              className={`absolute inset-0 shield-shape transition-all duration-500 ${
                isActive 
                  ? 'bg-green-500/20 border border-green-400/50 animate-pulse-glow-green' 
                  : 'bg-white/5 border border-white/10'
              }`} 
            />
            {/* Inner shield border */}
            <div className={`absolute inset-2 shield-shape border border-white/10 transition-opacity duration-500 ${isActive ? 'opacity-50' : 'opacity-20'}`} />
            
            <Shield 
              className={`w-12 h-12 relative z-10 transition-all duration-500 ${
                isActive ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'text-white/30'
              }`} 
              strokeWidth={1.5} 
            />
          </button>

          <div className={`text-2xl font-bold tracking-widest mb-2 transition-colors duration-500 ${
            isActive ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-white/50'
          }`}>
            {isActive ? 'АКТИВЕН' : 'ОТКЛЮЧЕН'}
          </div>

          <div className="text-white/70 text-sm mb-5 font-medium">
            {isActive ? 'Трафик зашифрован · 128-bit AES' : 'Соединение не защищено'}
          </div>

          <div className={`w-full flex flex-col items-center transition-all duration-500 overflow-hidden ${isActive ? 'h-16 opacity-100' : 'h-0 opacity-0'}`}>
            <div className="font-mono text-3xl font-light tracking-wider mb-1 text-white/90">
              {formatTime(timeLeft)}
            </div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Истекает через 3 дня 14 ч</div>
          </div>
        </div>

        {/* Features */}
        <div className="flex justify-between gap-3">
          {[
            { icon: Shield, text: 'Шифрование' },
            { icon: EyeOff, text: 'Без логов' },
            { icon: Zap, text: 'Быстрое' }
          ].map((f, i) => (
            <div key={i} className="glass-panel flex-1 py-4 px-2 rounded-[20px] flex flex-col items-center gap-2 border border-white/5 bg-white/[0.02]">
              <f.icon className="w-5 h-5 text-white/60" strokeWidth={1.5} />
              <span className="text-[11px] text-white/70 font-medium tracking-wide">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Buy Section */}
        <div className="glass-panel rounded-[24px] p-5 flex flex-col gap-4 mt-2">
          <h3 className="font-semibold text-lg tracking-tight">Продлить доступ</h3>
          <div className="flex flex-col gap-3">
            {[
              { days: 7, price: 50 },
              { days: 30, price: 150 },
              { days: 90, price: 350 }
            ].map((plan) => (
              <button
                key={plan.days}
                onClick={() => setSelectedPlan(plan.days)}
                className={`relative w-full rounded-[20px] p-4 flex items-center justify-between transition-all duration-300 ${
                  selectedPlan === plan.days 
                    ? 'bg-[#A855F7]/15 border border-[#A855F7]/40 shadow-glow-violet' 
                    : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                    selectedPlan === plan.days ? 'border-[#A855F7]' : 'border-white/20'
                  }`}>
                    {selectedPlan === plan.days && <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />}
                  </div>
                  <span className="font-medium text-white/90 text-[15px]">{plan.days} дней</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-white text-[15px]">
                  {plan.price} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Button */}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`mt-2 w-full py-4 rounded-[20px] font-bold transition-all duration-300 border ${
            isActive 
              ? 'border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10' 
              : 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
          }`}
        >
          {isActive ? 'Отключить VPN' : 'Включить VPN'}
        </button>
      </div>
    </div>
  );
};