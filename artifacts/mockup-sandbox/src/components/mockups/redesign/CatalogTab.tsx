import React, { useState } from 'react';
import { Map, Ticket, Bot, Gamepad2, Wallet, ChevronRight, Lock, TrendingUp, Info } from 'lucide-react';
import './_group.css';

const NetworkCard = ({ name, price, availability, color, glow, isExpanded, onClick }) => {
  return (
    <div 
      className="relative rounded-[20px] p-4 cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        boxShadow: isExpanded ? `0 0 20px ${glow}` : 'none'
      }}
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top left, ${color}, transparent 70%)`
        }}
      />
      <div className="relative z-10 flex flex-col h-full justify-between gap-3">
        <div className="flex justify-between items-start">
          <div className="font-bold text-white text-lg tracking-tight">{name}</div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="w-4 h-4 rounded-full" style={{ background: color }} />
          </div>
        </div>
        
        <div>
          <div className="text-[11px] text-zinc-400 mb-1">Лучшая цена</div>
          <div className="text-xl font-bold text-white flex items-baseline gap-1">
            {price}<span className="text-sm font-medium text-zinc-400">₽/л</span>
          </div>
        </div>

        <div className="w-full bg-zinc-800/50 rounded-full h-1.5 mt-1 overflow-hidden">
          <div 
            className="h-full rounded-full" 
            style={{ width: `${availability}%`, background: color }}
          />
        </div>
        
        <button 
          className="w-full py-2 mt-1 rounded-xl text-sm font-medium transition-colors"
          style={{ 
            background: isExpanded ? color : 'rgba(255,255,255,0.1)',
            color: isExpanded ? '#fff' : '#e4e4e7'
          }}
        >
          {isExpanded ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </div>
  );
};

export function CatalogTab() {
  const [activeTab, setActiveTab] = useState('network');
  const [activeFuel, setActiveFuel] = useState('АИ-95');
  const [activeVolume, setActiveVolume] = useState('40л');
  const [expandedNetwork, setExpandedNetwork] = useState('Lukoil');

  const networks = [
    { id: 'Lukoil', name: 'Лукойл', price: '59.80', availability: 85, color: '#EF4444', glow: 'rgba(239, 68, 68, 0.2)' },
    { id: 'Rosneft', name: 'Роснефть', price: '58.90', availability: 92, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.2)' },
    { id: 'Gazprom', name: 'Газпром', price: '60.10', availability: 78, color: '#22D3EE', glow: 'rgba(34, 211, 238, 0.2)' },
    { id: 'Bashneft', name: 'Башнефть', price: '58.50', availability: 65, color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.2)' },
  ];

  return (
    <div className="w-[390px] h-[844px] bg-[#0A0A0F] relative overflow-hidden font-sans mx-auto text-zinc-100 flex flex-col">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#A855F7]/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#A855F7]/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-[200px] left-[-100px] w-[250px] h-[250px] bg-[#22D3EE]/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scroll-hidden pb-[100px]">
        <div className="px-5 pt-12 pb-6 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Талоны на топливо</h1>
            <p className="text-[#A855F7] font-medium text-sm">Заморозь цену сейчас</p>
          </div>

          {/* Hero Pill */}
          <div className="glass-panel rounded-[16px] p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A855F7]/20 flex items-center justify-center flex-shrink-0">
              <Lock size={18} className="text-[#A855F7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-white">Цена заморожена на 90 дней</span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <TrendingUp size={10} className="text-[#22D3EE]" /> +2–4% рост в месяц
              </span>
            </div>
          </div>

          {/* Segmented Control */}
          <div className="bg-zinc-900/50 p-1 rounded-2xl flex backdrop-blur-md">
            <button 
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'network' ? 'bg-[#A855F7] text-white shadow-glow-violet' : 'text-zinc-400'}`}
              onClick={() => setActiveTab('network')}
            >
              Сетевые
            </button>
            <button 
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'station' ? 'bg-[#A855F7] text-white shadow-glow-violet' : 'text-zinc-400'}`}
              onClick={() => setActiveTab('station')}
            >
              Станционные
            </button>
          </div>

          {/* Network Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {networks.map((net) => (
              <NetworkCard 
                key={net.id}
                {...net}
                isExpanded={expandedNetwork === net.id}
                onClick={() => setExpandedNetwork(net.id)}
              />
            ))}
          </div>

          {/* Expanded Configuration (Lukoil) */}
          {expandedNetwork === 'Lukoil' && (
            <div className="glass-panel-heavy rounded-[24px] p-5 flex flex-col gap-5 animate-slide-up mt-2 relative overflow-hidden"
                 style={{ border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.1)' }}>
              
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#EF4444]/10 rounded-full blur-[40px] pointer-events-none" />

              <div className="flex justify-between items-center z-10 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center">
                    <span className="font-bold text-white text-sm">Л</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Лукойл</h3>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Map size={10} /> 12 АЗС в радиусе 5км
                    </div>
                  </div>
                </div>
              </div>

              {/* Fuel Types */}
              <div className="z-10 relative">
                <div className="text-[12px] text-zinc-400 mb-2">Вид топлива</div>
                <div className="flex gap-2">
                  {['АИ-92', 'АИ-95', 'АИ-100', 'ДТ'].map(type => (
                    <button 
                      key={type}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeFuel === type ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'}`}
                      onClick={() => setActiveFuel(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div className="z-10 relative">
                <div className="text-[12px] text-zinc-400 mb-2">Объем</div>
                <div className="flex gap-2">
                  {['20л', '40л', '60л'].map(vol => (
                    <button 
                      key={vol}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeVolume === vol ? 'bg-[#EF4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'}`}
                      onClick={() => setActiveVolume(vol)}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini Chart Widget */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 z-10 relative flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="text-[12px] text-zinc-400 flex items-center gap-1">
                    Прогноз рынка <Info size={12} />
                  </div>
                  <div className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                    +4.2% к лету
                  </div>
                </div>
                
                <div className="h-[60px] flex items-end gap-1 w-full mt-2 relative">
                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-green-500/50 z-0">
                    <div className="absolute right-0 -top-4 text-[9px] text-green-400">Ваша фиксация</div>
                  </div>
                  {[20, 25, 30, 45, 60, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-red-500/30 rounded-t-sm z-10 relative" style={{ height: `${h}%` }}>
                      <div className="absolute top-0 inset-x-0 h-1 bg-red-500 rounded-t-sm"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Buy Button */}
              <div className="flex flex-col gap-3 z-10 relative mt-2">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-zinc-400 line-through">2 780 ₽</span>
                    <span className="text-2xl font-bold text-white">2 638 ₽</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20 inline-block mb-1">Выгода ~142 ₽</div>
                    <div className="text-[11px] text-zinc-500">65.95 ₽/л</div>
                  </div>
                </div>
                
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white font-bold text-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2">
                  Купить талон <ChevronRight size={18} />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 inset-x-0 h-[80px] glass-nav pb-safe">
        <div className="flex justify-around items-center h-full px-2 pb-2 text-xs font-medium">
          <button className="flex flex-col items-center gap-1 text-zinc-500 p-2">
            <Map size={24} />
            <span>Карта</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#A855F7] p-2 relative">
            <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-[#A855F7] shadow-glow-violet"></div>
            <Ticket size={24} />
            <span>Талоны</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 p-2">
            <Bot size={24} />
            <span>Советник</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 p-2">
            <Gamepad2 size={24} />
            <span>Игры</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 p-2">
            <Wallet size={24} />
            <span>Сейф</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatalogTab;