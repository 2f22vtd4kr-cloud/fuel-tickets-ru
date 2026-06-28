import React, { useState } from 'react';
import { 
  Map, 
  Ticket, 
  Bot, 
  Gamepad2, 
  Wallet,
  Trophy,
  ChevronRight,
  Hammer,
  Play,
  Star,
  Coins,
  Zap,
  Droplet
} from 'lucide-react';
import './_group.css';

export function GamesTab() {
  const [activeSubTab, setActiveSubTab] = useState('Империя');

  return (
    <div className="w-[390px] h-[844px] bg-[#0A0A0F] text-white overflow-hidden relative flex flex-col font-sans mx-auto shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#A855F7]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#A855F7]/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto scroll-hidden pb-[100px]">
        
        {/* Header & Sub-tabs */}
        <div className="pt-12 px-5 pb-4 sticky top-0 z-20 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Игры</h1>
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center relative shadow-glow-violet">
              <Trophy size={18} className="text-[#A855F7]" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
            {['Империя', 'Мини-игры', 'Опыт'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeSubTab === tab 
                    ? 'bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] text-white shadow-glow-violet' 
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on sub-tab */}
        {activeSubTab === 'Империя' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Empire Header & Resources */}
            <div className="px-5 mt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Нефтяная Империя</h2>
                  <p className="text-sm text-white/50">Деревня · Ур.1</p>
                </div>
              </div>

              {/* Resource Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 glass-panel py-2 px-3 rounded-xl flex flex-col gap-1 items-center">
                  <Droplet size={14} className="text-gray-400" />
                  <span className="text-xs font-bold">0</span>
                </div>
                <div className="flex-1 glass-panel py-2 px-3 rounded-xl flex flex-col gap-1 items-center">
                  <Droplet size={14} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-xs font-bold">0</span>
                </div>
                <div className="flex-1 glass-panel py-2 px-3 rounded-xl flex flex-col gap-1 items-center">
                  <Coins size={14} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  <span className="text-xs font-bold">500</span>
                </div>
                <div className="flex-1 glass-panel py-2 px-3 rounded-xl flex flex-col gap-1 items-center">
                  <Star size={14} className="text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  <span className="text-xs font-bold">0</span>
                </div>
              </div>
            </div>

            {/* Isometric Grid Container */}
            <div className="relative w-full h-[320px] flex flex-col items-center justify-center mt-4">
              
              <button className="absolute top-0 z-10 glass-panel-heavy px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border-[#A855F7]/30 text-white shadow-glow-violet hover:scale-105 transition-transform">
                <Hammer size={16} className="text-[#A855F7]" />
                Строить
              </button>

              <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-[#A855F7]/30 blur-[70px] rounded-full pointer-events-none" />
              
              {/* The Grid */}
              <div 
                className="grid grid-cols-5 gap-1.5 mt-8"
                style={{ 
                  transform: 'rotateX(60deg) rotateZ(-45deg)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {Array.from({length: 25}).map((_, i) => {
                  // Some cells have buildings
                  const isMainBuilding = i === 12; // Center
                  const isSmallBuilding = i === 8 || i === 18;
                  
                  return (
                    <div 
                      key={i} 
                      className="w-14 h-14 bg-[#111116] border border-white/10 rounded-sm relative transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 cursor-pointer"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Grid floor glow */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#A855F7]/5 to-transparent pointer-events-none" />

                      {/* Main Building */}
                      {isMainBuilding && (
                        <div 
                          className="absolute inset-1 bg-gradient-to-t from-[#8B5CF6] to-[#A855F7] border border-white/20 rounded-sm shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                          style={{ 
                            transform: 'translateZ(30px)', 
                            height: '100%',
                            boxShadow: '-10px 10px 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.2)'
                          }}
                        >
                          {/* Top roof */}
                          <div className="absolute inset-0 bg-white/20 border-b border-white/30" />
                        </div>
                      )}

                      {/* Small Buildings */}
                      {isSmallBuilding && (
                        <div 
                          className="absolute inset-2 bg-gradient-to-t from-cyan-600 to-cyan-400 border border-white/20 rounded-sm shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                          style={{ 
                            transform: 'translateZ(15px)', 
                            height: '100%',
                            boxShadow: '-5px 5px 10px rgba(0,0,0,0.6)'
                          }}
                        >
                           <div className="absolute inset-0 bg-white/20 border-b border-white/30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mini-Games Preview */}
            <div className="px-5 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Мини-игры</h3>
                <button className="text-xs text-[#A855F7] font-medium flex items-center">
                  Все <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {/* Card Flip Game */}
                <div className="glass-panel rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group cursor-pointer hover:border-white/20 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/10 blur-[40px] group-hover:bg-[#A855F7]/20 transition-colors" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E1B4B] to-[#0A0A0F] border border-[#A855F7]/30 flex items-center justify-center text-2xl shadow-glow-violet">
                      🃏
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Расклад карт</h4>
                      <p className="text-xs text-white/50 mt-0.5">2/3 попытки осталось</p>
                    </div>
                  </div>
                  
                  <button className="relative z-10 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-full transition-colors border border-white/10">
                    Играть
                  </button>
                </div>

                {/* Tap Game */}
                <div className="glass-panel rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group cursor-pointer hover:border-white/20 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] group-hover:bg-cyan-500/20 transition-colors" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#083344] to-[#0A0A0F] border border-cyan-500/30 flex items-center justify-center text-2xl shadow-glow-cyan">
                      👆
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Тапай и Копи</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/50">+2 XP за тап</span>
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-cyan-400">30 сек</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="relative z-10 bg-cyan-500 text-[#0A0A0F] text-xs font-bold py-2 px-4 rounded-full transition-transform hover:scale-105 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    Начать
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Rewards */}
            <div className="mt-4 mb-6">
              <h3 className="text-lg font-bold px-5 mb-3">Ежедневный бонус</h3>
              
              <div className="flex gap-3 px-5 overflow-x-auto scroll-hidden pb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isClaimed = day === 1;
                  const isToday = day === 2;
                  
                  return (
                    <div 
                      key={day}
                      className={`min-w-[72px] h-[90px] rounded-2xl flex flex-col items-center justify-center relative shrink-0 ${
                        isClaimed ? 'bg-[#1a1a24] border border-white/5 opacity-50' : 
                        isToday ? 'bg-gradient-to-b from-[#2E1065] to-[#0A0A0F] border border-[#A855F7]/50 shadow-glow-violet' : 
                        'glass-panel'
                      }`}
                    >
                      {isClaimed && <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur-[2px] z-10">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>}
                      
                      <span className="text-[10px] text-white/50 mb-2">День {day}</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-1">
                        <Coins size={14} className={isToday ? "text-yellow-400" : "text-white/40"} />
                      </div>
                      <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-white/40'}`}>
                        +{day * 50}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 w-full h-[72px] bg-[#0A0A0F]/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] z-50">
        <button className="flex flex-col items-center gap-1 p-2 text-white/40 hover:text-white/80 transition-colors">
          <Map size={24} />
          <span className="text-[10px] font-medium">Карта</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-white/40 hover:text-white/80 transition-colors">
          <Ticket size={24} />
          <span className="text-[10px] font-medium">Талоны</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-white/40 hover:text-white/80 transition-colors relative">
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full border-2 border-[#0A0A0F]" />
          <Bot size={24} />
          <span className="text-[10px] font-medium">ИИ</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#A855F7] transition-colors">
          <Gamepad2 size={24} className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <span className="text-[10px] font-medium">Игры</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-white/40 hover:text-white/80 transition-colors">
          <Wallet size={24} />
          <span className="text-[10px] font-medium">Хранилище</span>
        </button>
      </div>
    </div>
  );
}