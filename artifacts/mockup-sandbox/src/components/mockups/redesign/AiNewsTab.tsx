import React from 'react';
import { Bot, Zap, MapPin, Send, MessageCircle, BarChart3, Tag, Compass, Wallet, Gamepad2, Shield } from 'lucide-react';
import './_group.css';

export function AiNewsTab() {
  return (
    <div className="w-[390px] h-[844px] relative overflow-hidden font-sans text-white selection:bg-purple-500/30" style={{ backgroundColor: '#0A0A0F' }}>
      
      {/* Background ambient glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[200px] right-[-50px] w-[250px] h-[250px] bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Top Navigation Pill */}
      <div className="absolute top-12 w-full px-4 z-20 flex justify-center">
        <div className="glass-panel rounded-full p-1 flex items-center w-3/4 max-w-[280px]">
          <button className="flex-1 py-1.5 px-4 rounded-full bg-white/10 text-sm font-medium shadow-glow-violet text-white transition-all">
            ИИ-Советник
          </button>
          <button className="flex-1 py-1.5 px-4 rounded-full text-sm font-medium text-white/50 transition-all">
            Сводка
          </button>
        </div>
      </div>

      {/* Header Profile Row */}
      <div className="absolute top-28 w-full px-5 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-glow-violet">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0F]"></div>
          </div>
          <div>
            <div className="font-bold text-[17px] tracking-tight text-white/95">CrisisBot</div>
            <div className="text-[12px] text-green-400 font-medium">• онлайн</div>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 shadow-glow-cyan flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-400 text-xs font-medium tracking-wide">VPN вкл</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="absolute top-44 bottom-[150px] w-full px-4 overflow-y-auto scroll-hidden flex flex-col gap-5 pb-8">
        
        {/* Date Divider */}
        <div className="flex justify-center mt-2">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-3 py-1 glass-panel rounded-full">
            Сегодня
          </span>
        </div>

        {/* Bot Welcome Message */}
        <div className="flex gap-2.5 max-w-[88%]">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-1 border border-purple-500/30">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="glass-panel-heavy rounded-2xl rounded-tl-sm p-3.5 shadow-sm text-[14px] leading-relaxed text-white/90">
            <p>⚡ <strong className="text-white">КризисБот на связи</strong> — ИИ-советник по топливному кризису.</p>
            <p className="mt-2 text-white/70">Анализирую цены, наличие и очереди на АЗС Крыма в реальном времени. Чем могу помочь?</p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex justify-end mt-2">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl rounded-tr-sm p-3.5 shadow-glow-violet max-w-[85%] text-[14px] text-white leading-relaxed">
            Где заправиться рядом с Симферополем?
          </div>
        </div>

        {/* Bot Reply with Action Card */}
        <div className="flex gap-2.5 max-w-[92%] mt-2">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-1 border border-purple-500/30">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="glass-panel-heavy rounded-2xl rounded-tl-sm p-3.5 text-[14px] leading-relaxed text-white/90">
              <p>Оптимальный вариант без больших очередей:</p>
              <div className="mt-3 p-3 glass-panel rounded-xl border-l-2 border-l-red-500">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                    Лукойл АЗС №42
                  </div>
                  <div className="text-xs font-medium text-white/50">2.4 км</div>
                </div>
                <div className="text-xs text-white/60 mb-2">Объездная дорога, Ялтинское ш.</div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-white/80 font-medium">АИ-95 • <span className="text-white">62.40 ₽</span></span>
                  <span className="text-green-400">Очередь: ~5 мин</span>
                </div>
              </div>
            </div>
            
            {/* Action Card inside chat */}
            <div className="glass-panel rounded-xl p-3 border border-purple-500/20 flex items-center justify-between ml-2">
              <div className="flex flex-col">
                <span className="text-xs text-white/60">Зафиксировать цену</span>
                <span className="text-[14px] font-semibold text-purple-400">Талон на 30Л (95)</span>
              </div>
              <button className="bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors border border-white/5">
                Купить
              </button>
            </div>
          </div>
        </div>

        {/* Typing Indicator */}
        <div className="flex gap-2.5 max-w-[85%] mt-1">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-1 border border-purple-500/30">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="glass-panel rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full typing-dot"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full typing-dot"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full typing-dot"></div>
          </div>
        </div>

      </div>

      {/* Bottom Input Area */}
      <div className="absolute bottom-[72px] w-full bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/95 to-transparent pt-6 pb-4 px-4 z-30 flex flex-col gap-3">
        
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto scroll-hidden pb-1 -mx-4 px-4">
          <button className="glass-panel px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-transform">
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" /> Прогноз цен
          </button>
          <button className="glass-panel px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-transform">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Где заправиться?
          </button>
          <button className="glass-panel px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-transform">
            <Tag className="w-3.5 h-3.5 text-green-400" /> Купить талон
          </button>
        </div>

        {/* Input Bar */}
        <div className="glass-panel rounded-2xl p-1.5 pl-4 flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Задать вопрос..." 
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-white placeholder-white/40"
            disabled
          />
          <button className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-glow-violet active:scale-95 transition-transform">
            <Send className="w-4 h-4 text-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 w-full h-[72px] glass-panel-heavy border-t border-white/10 z-40 px-2 flex justify-between items-center pb-[env(safe-area-inset-bottom)]">
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-white/40">
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-medium">Карта</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-white/40">
          <Tag className="w-6 h-6" />
          <span className="text-[10px] font-medium">Талоны</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-purple-400">
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          </div>
          <span className="text-[10px] font-medium">ИИ-Советник</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-white/40">
          <Gamepad2 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Игры</span>
        </button>
        <button className="flex-1 flex flex-col items-center justify-center gap-1 text-white/40">
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-medium">Хранилище</span>
        </button>
      </div>

    </div>
  );
}
