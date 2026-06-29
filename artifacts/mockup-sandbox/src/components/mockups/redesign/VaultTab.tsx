import React, { useState } from 'react';
import { 
  Map, 
  Ticket, 
  Bot, 
  Gamepad2, 
  Wallet, 
  Copy, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  History,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import './_group.css';

const NETWORK_COLORS: Record<string, string> = {
  'Лукойл': '#EF4444',
  'Роснефть': '#3B82F6',
  'Газпром': '#22D3EE',
  'Башнефть': '#8B5CF6',
  'Татнефть': '#22C55E',
  'ННК': '#F59E0B'
};

const FakeQRCode = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-white" shapeRendering="crispEdges">
    <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
    <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
    <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
    <path d="M40,0 h10 v10 h-10 z M55,0 h10 v20 h-10 z M40,15 h25 v10 h-25 z M80,40 h20 v10 h-20 z M70,55 h10 v20 h-10 z" />
    <path d="M10,45 h20 v10 h-20 z M40,40 h15 v15 h-15 z M50,65 h10 v10 h-10 z" />
    <path d="M80,80 h10 v10 h-10 z M65,70 h10 v20 h-10 z M45,85 h15 v15 h-15 z" />
    <path d="M30,30 h10 v10 h-10 z M60,30 h10 v10 h-10 z M30,60 h10 v10 h-10 z" />
    {/* Random dots */}
    <rect x="40" y="30" width="5" height="5" />
    <rect x="50" y="30" width="5" height="5" />
    <rect x="35" y="45" width="5" height="5" />
    <rect x="65" y="45" width="5" height="5" />
    <rect x="45" y="55" width="5" height="5" />
    <rect x="55" y="50" width="5" height="5" />
    <rect x="75" y="60" width="5" height="5" />
    <rect x="85" y="65" width="5" height="5" />
    <rect x="30" y="75" width="5" height="5" />
    <rect x="35" y="85" width="5" height="5" />
    <rect x="75" y="90" width="5" height="5" />
    <rect x="85" y="95" width="5" height="5" />
  </svg>
);

export function VaultTab() {
  const [expandedId, setExpandedId] = useState<number>(1);

  const vouchers = [
    {
      id: 1,
      network: 'Лукойл',
      fuel: 'АИ-92',
      volume: '60л',
      price: '65.0₽/л',
      expiry: '87 дней',
      code: '8492-4821-9921'
    },
    {
      id: 2,
      network: 'Роснефть',
      fuel: 'АИ-95',
      volume: '40л',
      price: '71.5₽/л',
      expiry: '72 дня',
      code: '1192-5582-0043'
    },
    {
      id: 3,
      network: 'Газпром',
      fuel: 'ДТ',
      volume: '20л',
      price: '68.0₽/л',
      expiry: '61 день',
      code: '3341-9900-1122'
    }
  ];

  return (
    <div className="relative w-[390px] h-[844px] bg-[#0A0A0F] text-white font-inter overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-[#A855F7] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[#22D3EE] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="px-5 pt-12 pb-4 z-10 flex-shrink-0">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Хранилище</h1>
          <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <span className="text-sm">🏆</span>
            <span className="text-xs font-semibold bg-gradient-to-r from-[#A855F7] to-[#D8B4FE] text-transparent bg-clip-text">
              Оперативник
            </span>
            <span className="text-[10px] text-white/50 ml-1">· 847 XP</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#22D3EE] w-[70%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        </div>

        {/* Summary Stats */}
        <div className="flex gap-2 mb-2">
          <div className="glass-panel flex-1 rounded-2xl p-3 flex flex-col justify-center items-center border border-white/10">
            <div className="text-xl font-bold text-white mb-0.5">3</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider text-center">активных<br/>талона</div>
          </div>
          <div className="glass-panel flex-1 rounded-2xl p-3 flex flex-col justify-center items-center border border-white/10">
            <div className="text-xl font-bold text-white mb-0.5">540</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider text-center">литров<br/>запас</div>
          </div>
          <div className="glass-panel flex-1 rounded-2xl p-3 flex flex-col justify-center items-center border border-white/10">
            <div className="text-xl font-bold text-white mb-0.5">90</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider text-center">дней<br/>мин.</div>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[100px] z-10 px-5 space-y-6">
        
        {/* Active Vouchers */}
        <div>
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A855F7]" />
            Активные талоны
          </h2>
          
          <div className="space-y-4">
            {vouchers.map((v) => {
              const isExpanded = expandedId === v.id;
              const netColor = NETWORK_COLORS[v.network];
              
              return (
                <div 
                  key={v.id}
                  onClick={() => setExpandedId(isExpanded ? 0 : v.id)}
                  className="relative glass-panel-heavy rounded-3xl p-5 border border-white/10 transition-all duration-300 overflow-hidden"
                  style={{ 
                    boxShadow: isExpanded ? `0 0 30px ${netColor}20` : 'none'
                  }}
                >
                  {/* Left color border accent */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" 
                    style={{ backgroundColor: netColor, boxShadow: `0 0 10px ${netColor}` }}
                  />
                  
                  {/* Header Row */}
                  <div className="flex justify-between items-center pl-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-lg">{v.network}</div>
                        <div className="px-2 py-0.5 rounded text-xs font-bold bg-white/10">
                          {v.fuel}
                        </div>
                      </div>
                      <div className="text-2xl font-black">{v.volume}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-white/60 mb-1">Фракт. цена</div>
                      <div className="font-mono font-bold text-[#22D3EE]">{v.price}</div>
                    </div>
                  </div>

                  {/* Status Row */}
                  <div className="flex items-center justify-between pl-2 mt-4">
                    <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Оплачен</span>
                    </div>
                    <div className="text-xs font-medium text-white/50 flex items-center gap-1">
                      Осталось: <span className="text-white">{v.expiry}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </div>
                  </div>

                  {/* Expanded Content (QR) */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out \${isExpanded ? 'max-h-[400px] opacity-100 mt-6 pt-6 border-t border-white/10' : 'max-h-0 opacity-0 mt-0'}`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-white/60 mb-4">Предъявить на АЗС</div>
                      
                      <div className="bg-white p-4 rounded-2xl w-[200px] h-[200px] mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <FakeQRCode />
                      </div>
                      
                      <div className="font-mono text-xl tracking-[0.2em] font-bold mb-6">
                        {v.code}
                      </div>
                      
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Скопировать код
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchase History */}
        <div className="pt-2">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-[#A855F7]" />
            История покупок
          </h2>
          
          <div className="space-y-3">
            {[
              { id: 1, date: '12 Окт, 14:30', network: 'Газпром', desc: 'ДТ · 40л', amount: '- 2,640 ₽', status: 'Использован' },
              { id: 2, date: '05 Сен, 09:15', network: 'Лукойл', desc: 'АИ-95 · 30л', amount: '- 2,070 ₽', status: 'Использован' },
            ].map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{item.network} <span className="text-white/40 font-normal ml-1">{item.desc}</span></div>
                    <div className="text-xs text-white/40 mt-0.5">{item.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-sm text-white">{item.amount}</div>
                  <div className="text-[10px] text-white/30 uppercase mt-1">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-white/50 hover:text-white/80 transition-colors">
            Смотреть все транзакции
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full h-[88px] glass-panel-heavy border-t border-white/10 pb-safe z-50">
        <div className="flex justify-between items-center px-6 h-[72px]">
          <NavItem icon={<Map />} label="Карта" />
          <NavItem icon={<Ticket />} label="Талоны" />
          <NavItem icon={<Bot />} label="ИИ-Советник" />
          <NavItem icon={<Gamepad2 />} label="Игры" />
          <NavItem icon={<Wallet />} label="Хранилище" active />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer w-[60px]">
      <div className={`transition-colors duration-300 \${active ? 'text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-white/40'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <span className={`text-[10px] font-medium transition-colors duration-300 \${active ? 'text-white' : 'text-white/40'}`}>
        {label}
      </span>
    </div>
  );
}