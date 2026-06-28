import { useState, useMemo } from 'react';
import './_group.css';

// ── Design tokens ─────────────────────────────────────────────────────────
const BG   = 'linear-gradient(160deg,#0C0EA8 0%,#090B82 40%,#060760 75%,#040450 100%)';
const V    = '#a855f7';
const M    = '#db2777';
const G    = '#00E676';
const Y    = '#FFD600';
const R    = '#FF1744';

const CSS = `
@keyframes starTwinkle  { 0%,100%{opacity:var(--op)} 50%{opacity:calc(var(--op)*0.25)} }
@keyframes ambientFlow  { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
@keyframes ambientPulse { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes scanPulse    { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.35);opacity:.3} }
@keyframes marqueeAnim  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes blockPulse   { 0%,100%{opacity:.85} 50%{opacity:1} }
.ct-strip { background-size:200% 100%; animation:ambientFlow 3s linear infinite, ambientPulse 2.6s ease-in-out infinite; }
`;

// ── Primitive components ───────────────────────────────────────────────────
function Stars({ n = 80 }: { n?: number }) {
  const pts = useMemo(() => Array.from({ length: n }, (_, i) => ({
    id: i, x: (i * 97 + 13) % 100, y: (i * 61 + 7) % 100,
    r: 0.3 + (i % 7) * 0.2, op: 0.1 + (i % 6) * 0.1, dur: 2 + (i % 5), del: i % 4,
  })), [n]);
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {pts.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white"
          style={{ opacity: s.op, animation: `starTwinkle ${s.dur}s ${s.del}s ease-in-out infinite`, ['--op' as string]: s.op } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

function Strip({ color, style = {} }: { color: string; style?: React.CSSProperties }) {
  return <div className="ct-strip" style={{
    position: 'absolute', height: '1.5px', width: '100%', pointerEvents: 'none',
    background: `linear-gradient(90deg,transparent 0%,${color}00 5%,${color}cc 30%,${color} 50%,${color}cc 70%,${color}00 95%,transparent 100%)`,
    ...style,
  }} />;
}

// ── Mock data ──────────────────────────────────────────────────────────────
const NETWORKS = [
  { name: 'Лукойл',       color: '#ef4444', badge: '🔥 ТОП',    price92: 65.9, price95: 74.2, avail: 87, stations: 42 },
  { name: 'Роснефть',     color: '#0ea5e9', badge: '⚡ PULSAR',  price92: 65.1, price95: 72.9, avail: 92, stations: 38 },
  { name: 'Газпромнефть', color: '#3b82f6', badge: '✦ G-DRIVE', price92: 65.4, price95: 73.4, avail: 78, stations: 55 },
  { name: 'Башнефть',     color: '#8b5cf6', badge: '⚗ ATUM',    price92: 61.9, price95: 66.1, avail: 65, stations: 24 },
  { name: 'Татнефть',     color: '#00E676', badge: '◆ ТАНЕКО',  price92: 62.4, price95: 66.8, avail: 71, stations: 19 },
  { name: 'ННК',          color: '#f59e0b', badge: '🌿 NEO',     price92: 70.5, price95: 74.8, avail: 58, stations: 14 },
];

const STATIONS = [
  { id: 1, name: 'АЗС Лукойл #17', address: 'ул. Ленина, 42, Симферополь', network: 'Лукойл', avail: 82, price92: 65.9, zone: 'central' },
  { id: 2, name: 'АЗС Роснефть #8', address: 'пр. Нахимова, 14, Севастополь', network: 'Роснефть', avail: 91, price92: 65.1, zone: 'critical' },
  { id: 3, name: 'Газпром #33', address: 'шоссе Феодосийское, 7', network: 'Газпромнефть', avail: 44, price92: 65.4, zone: 'eastern' },
  { id: 4, name: 'АЗС Башнефть #5', address: 'ул. Гагарина, 91, Ялта', network: 'Башнефть', avail: 17, price92: 61.9, zone: 'standard' },
  { id: 5, name: 'АЗС Татнефть #2', address: 'ул. Крымская, 110', network: 'Татнефть', avail: 69, price92: 62.4, zone: 'eastern' },
];

const VOLUMES = [20, 40, 60];
const STAR_RUB = 2.5;

// ── NetworkCard ────────────────────────────────────────────────────────────
function NetworkCard({
  net, isActive, onClick, nvFuel, nvVolume, onFuelChange, onVolumeChange, onBuy, loading,
}: {
  net: typeof NETWORKS[0]; isActive: boolean;
  onClick: () => void;
  nvFuel: string; nvVolume: number;
  onFuelChange: (f: string) => void;
  onVolumeChange: (v: number) => void;
  onBuy: () => void;
  loading: boolean;
}) {
  const price = net.price95;
  const total = price * nvVolume;
  const stars = Math.ceil(total / STAR_RUB);
  const availColor = net.avail >= 60 ? G : net.avail >= 25 ? Y : R;
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive
          ? `linear-gradient(135deg,rgba(${net.color.replace('#','').match(/.{2}/g)!.map(h=>parseInt(h,16)).join(',')},0.15),rgba(12,14,168,0.4))`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isActive ? net.color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 20, padding: '1rem', cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        boxShadow: isActive ? `0 0 28px ${net.color}22` : 'none',
        transition: 'all .25s',
        backdropFilter: 'blur(16px)',
      }}
    >
      {isActive && <Strip color={net.color} style={{ top: 0, left: 0 }} />}

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: 2 }}>{net.name}</div>
          <div style={{
            display: 'inline-block',
            background: `${net.color}18`, border: `1px solid ${net.color}44`,
            borderRadius: 6, padding: '0.06rem 0.4rem',
            fontSize: '0.56rem', fontWeight: 700, color: net.color,
            fontFamily: "'JetBrains Mono',monospace",
          }}>{net.badge}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            {price.toFixed(1)}<span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>₽/л</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.52rem' }}>{net.stations} АЗС</div>
        </div>
      </div>

      {/* Availability bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.4)' }}>Наличие</span>
          <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono',monospace", color: availColor, fontWeight: 700 }}>{net.avail}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${net.avail}%`, background: `linear-gradient(90deg,${availColor}88,${availColor})`, borderRadius: 3, transition: 'width .8s' }} />
        </div>
      </div>

      {/* Expanded controls */}
      {isActive && (
        <div onClick={e => e.stopPropagation()}>
          {/* Fuel selector */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {['АИ-92','АИ-95','ДТ'].map(f => (
              <button key={f} onClick={() => onFuelChange(f)} style={{
                flex: 1, padding: '0.3rem 0',
                border: `1px solid ${nvFuel === f ? net.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 8, background: nvFuel === f ? `${net.color}22` : 'rgba(255,255,255,0.03)',
                color: nvFuel === f ? net.color : 'rgba(255,255,255,0.5)', fontSize: '0.68rem',
                fontWeight: nvFuel === f ? 700 : 400, cursor: 'pointer',
              }}>{f}</button>
            ))}
          </div>
          {/* Volume selector */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {VOLUMES.map(v => (
              <button key={v} onClick={() => onVolumeChange(v)} style={{
                flex: 1, padding: '0.32rem 0',
                border: `1px solid ${nvVolume === v ? V : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 8, background: nvVolume === v ? `${V}22` : 'rgba(255,255,255,0.03)',
                color: nvVolume === v ? V : 'rgba(255,255,255,0.4)', fontSize: '0.72rem',
                fontWeight: nvVolume === v ? 700 : 400, cursor: 'pointer',
              }}>{v}л</button>
            ))}
          </div>
          {/* Price summary */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.5rem 0.75rem',
            marginBottom: 8, border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem' }}>Итого</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{total.toFixed(0)} ₽</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem' }}>или</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>⭐ {stars.toLocaleString('ru')} Stars</div>
            </div>
          </div>
          {/* Lock badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            background: `${G}0d`, border: `1px solid ${G}33`, borderRadius: 8, padding: '0.35rem 0.6rem',
          }}>
            <span style={{ fontSize: '0.8rem' }}>🔒</span>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: G, fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.1em' }}>ЦЕНА ЗАМОРОЖЕНА · 90 ДНЕЙ</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.5rem' }}>Заправляйтесь по сегодняшней цене 3 месяца</div>
            </div>
          </div>
          {/* Buy button */}
          <button
            onClick={onBuy}
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: loading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${V},${M})`,
              border: 'none', borderRadius: 14,
              color: loading ? 'rgba(255,255,255,0.3)' : '#fff',
              fontSize: '0.9rem', fontWeight: 800, cursor: loading ? 'default' : 'pointer',
              boxShadow: loading ? 'none' : `0 0 24px ${V}44`,
              transition: 'all .2s',
            }}
          >
            {loading ? '…Оформление' : `⛽ Оформить талон · ${nvVolume}л`}
          </button>
        </div>
      )}

      {!isActive && (
        <div style={{
          width: '100%', padding: '0.55rem', marginTop: 2,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, textAlign: 'center',
          color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', cursor: 'pointer',
        }}>
          Выбрать сеть
        </div>
      )}
    </div>
  );
}

// ── StationRow ─────────────────────────────────────────────────────────────
function StationRow({ st, isSelected, onClick }: { st: typeof STATIONS[0]; isSelected: boolean; onClick: () => void }) {
  const availColor = st.avail >= 60 ? G : st.avail >= 25 ? Y : R;
  const isCritical = st.avail < 25;
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(4,5,80,0.6))'
          : isCritical ? 'rgba(255,23,68,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isSelected ? V+'44' : isCritical ? R+'33' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16, padding: '0.75rem 0.85rem',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        marginBottom: 6, transition: 'all .2s',
      }}
    >
      {isSelected && <Strip color={V} style={{ top: 0, left: 0 }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isSelected ? '#e2e8f0' : 'rgba(255,255,255,0.85)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {st.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.address}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', fontWeight: 800, color: availColor }}>{st.avail}%</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.52rem' }}>{st.price92.toFixed(1)} ₽/л</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${st.avail}%`, background: `linear-gradient(90deg,${availColor}88,${availColor})`, borderRadius: 2, transition: 'width .8s' }} />
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace",
          background: isCritical ? `${R}18` : `${availColor}14`,
          border: `1px solid ${isCritical ? R+'44' : availColor+'33'}`,
          borderRadius: 5, padding: '0.06rem 0.3rem',
          color: availColor, fontSize: '0.5rem', fontWeight: 700, flexShrink: 0,
        }}>
          {st.network.slice(0,6)}
        </span>
      </div>
    </div>
  );
}

// ── FuelItemMock ───────────────────────────────────────────────────────────
function FuelItemMock({ fuel, price, available, onBuy }: { fuel: string; price: number; available: boolean; onBuy: (vol: number) => void }) {
  const [volume, setVolume] = useState(40);
  const statusColor = available ? (volume <= 60 ? G : Y) : R;
  const total = price * volume;
  const stars = Math.ceil(total / STAR_RUB);
  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(255,255,255,0.03),rgba(12,14,168,0.2))',
      border: `1px solid ${available ? 'rgba(255,255,255,0.08)' : R+'33'}`,
      borderRadius: 16, padding: '0.9rem', marginBottom: 8,
      position: 'relative', overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem' }}>{fuel}</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", color: V, fontSize: '0.82rem', fontWeight: 700 }}>{price.toFixed(1)} ₽/л</span>
      </div>

      {/* Limit bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem' }}>Суточный лимит</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem' }}>20л / 60л</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '33%', background: V, borderRadius: 2 }} />
        </div>
      </div>

      {/* Volume selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {VOLUMES.map(v => (
          <button key={v} onClick={() => setVolume(v)} style={{
            flex: 1, padding: '0.35rem 0',
            border: `1px solid ${volume === v ? V : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 8, background: volume === v ? `${V}22` : 'rgba(255,255,255,0.02)',
            color: volume === v ? V : 'rgba(255,255,255,0.4)', fontSize: '0.72rem',
            fontWeight: volume === v ? 700 : 400, cursor: 'pointer',
          }}>{v}л</button>
        ))}
      </div>

      {/* Lock badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
        background: `${G}0a`, border: `1px solid ${G}2a`, borderRadius: 8, padding: '0.35rem 0.6rem',
      }}>
        <span style={{ fontSize: '0.75rem' }}>🔒</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: G, fontSize: '0.43rem', fontWeight: 700, letterSpacing: '0.1em' }}>ЦЕНА ЗАМОРОЖЕНА · 90 ДНЕЙ</div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.5rem' }}>Заправляйтесь по сегодняшней цене 3 месяца.</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", color: G, fontSize: '0.55rem', fontWeight: 800 }}>+{(price * 0.085 * volume).toFixed(0)}₽</div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.38rem' }}>экономия·3мес</div>
        </div>
      </div>

      {/* Buy button */}
      <button
        onClick={() => available && onBuy(volume)}
        disabled={!available}
        style={{
          width: '100%', padding: '0.9rem',
          background: available ? `linear-gradient(135deg,${V},${M})` : 'rgba(255,255,255,0.04)',
          border: available ? 'none' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, color: available ? '#fff' : 'rgba(255,255,255,0.25)',
          fontSize: '0.9rem', fontWeight: 800, cursor: available ? 'pointer' : 'not-allowed',
          boxShadow: available ? `0 0 24px ${V}44, 0 4px 16px ${M}22` : 'none',
        }}
      >
        {available ? `⛽  ⭐ ${stars.toLocaleString('ru')} Stars · ${total.toFixed(0)} ₽` : 'Нет в наличии'}
      </button>
    </div>
  );
}

// ── BlockOverlay ───────────────────────────────────────────────────────────
function BlockOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(4,5,80,0.97)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <Stars n={60} />
      <div style={{
        background: 'linear-gradient(160deg,rgba(20,20,50,0.9),rgba(30,5,15,0.95))',
        border: `1px solid ${R}55`, borderRadius: 24,
        padding: '2rem 1.5rem', maxWidth: 300, width: '100%',
        position: 'relative', overflow: 'hidden', zIndex: 1,
        boxShadow: `0 0 60px ${R}22, inset 0 1px 0 ${R}22`,
      }}>
        <Strip color={R} style={{ top: 0, left: 0 }} />
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem', textAlign: 'center', filter: `drop-shadow(0 0 16px ${R}88)`, animation: 'blockPulse 2.2s ease-in-out infinite' }}>🚫</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", color: R, fontSize: '0.5rem', letterSpacing: '0.15em', marginBottom: '0.5rem', opacity: 0.7, textAlign: 'center' }}>
          СИСТЕМА · БЛОКИРОВКА
        </div>
        <h3 style={{ color: R, fontSize: '1rem', margin: '0 0 0.75rem', fontWeight: 800, lineHeight: 1.2, textAlign: 'center' }}>
          Шлюз временно недоступен
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: '0 0 1.25rem', lineHeight: 1.6, textAlign: 'center' }}>
          Система антифрода обнаружила подозрительную активность. Попробуйте через 15 минут.
        </p>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ height: '100%', width: '60%', background: `linear-gradient(90deg,${R},#FF5252)`, borderRadius: 2 }} />
        </div>
        <button onClick={onClose} style={{
          width: '100%', padding: '0.8rem',
          background: `linear-gradient(135deg,${V},${M})`,
          border: 'none', borderRadius: 12, color: '#fff',
          fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
          boxShadow: `0 0 20px ${V}40`,
        }}>Принять и закрыть</button>
      </div>
    </div>
  );
}

// ── Main CatalogTab ────────────────────────────────────────────────────────
export function CatalogTab() {
  const [tab, setTab] = useState<'network' | 'station'>('network');
  const [activeNetwork, setActiveNetwork] = useState<string | null>('Лукойл');
  const [selectedStation, setSelectedStation] = useState<typeof STATIONS[0] | null>(null);
  const [nvFuel, setNvFuel] = useState('АИ-95');
  const [nvVolume, setNvVolume] = useState(40);
  const [nvLoading, setNvLoading] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [search, setSearch] = useState('');

  const priceTicker = ['АИ-92: 65.1₽ ▲', 'АИ-95: 73.4₽ ▲', 'ДТ: 79.9₽ →', 'Газ: 34.5₽ ▼', 'АИ-95+: 78.2₽ ▲', 'АИ-100: 91.0₽ ▲'];

  const filteredStations = useMemo(() =>
    STATIONS.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase()))
  , [search]);

  const handleNetworkBuy = () => {
    setNvLoading(true);
    setTimeout(() => {
      setNvLoading(false);
      // 38% chance block for demo
      if (Math.random() < 0.38) setShowBlock(true);
    }, 1200);
  };

  return (
    <div style={{ width: 390, height: 844, background: BG, position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style>{CSS}</style>

      {/* Starfield + grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Stars n={80} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.09 }}>
          <line x1="0" y1="33%" x2="100%" y2="33%" stroke="#818cf8" strokeWidth=".8"/>
          <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#818cf8" strokeWidth=".8"/>
          <line x1="33%" y1="0" x2="33%" y2="100%" stroke="#818cf8" strokeWidth=".8"/>
          <line x1="66%" y1="0" x2="66%" y2="100%" stroke="#818cf8" strokeWidth=".8"/>
        </svg>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 320, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(168,85,247,0.22) 0%,transparent 70%)', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(219,39,119,0.14) 0%,transparent 70%)', filter: 'blur(24px)' }} />
      </div>

      {/* Block overlay */}
      {showBlock && <BlockOverlay onClose={() => setShowBlock(false)} />}

      {/* ── Sticky header ── */}
      <div style={{ position: 'relative', zIndex: 10, background: 'rgba(4,5,68,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(120,140,255,0.1)', padding: '2.5rem 1rem 0.75rem', flexShrink: 0 }}>
        <Strip color={V} style={{ bottom: 0, left: 0 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, background: `linear-gradient(90deg,#fff 0%,${V} 55%,${M} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Талоны на топливо
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, animation: 'scanPulse 1.5s infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: G, fontWeight: 700 }}>LIVE</span>
            <button
              onClick={() => setShowBlock(true)}
              style={{ background: 'rgba(168,85,247,0.12)', border: `1px solid ${V}33`, borderRadius: 8, color: V, fontSize: '0.6rem', padding: '0.2rem 0.5rem', cursor: 'pointer', fontWeight: 600, marginLeft: 4 }}
            >
              ⚡ Демо блок
            </button>
          </div>
        </div>

        {/* Price ticker */}
        <div style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.04)', borderRadius: 8, height: 28, display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(90deg,rgba(4,5,68,0.95),transparent)', zIndex: 1 }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(270deg,rgba(4,5,68,0.95),transparent)', zIndex: 1 }} />
          <div style={{ display: 'flex', gap: 24, padding: '0 16px', animation: 'marqueeAnim 20s linear infinite', whiteSpace: 'nowrap', background: `linear-gradient(90deg,${M},${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {[...priceTicker, ...priceTicker].map((t, i) => (
              <span key={i} style={{ fontSize: '0.68rem', fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Segmented control ── */}
      <div style={{ position: 'relative', zIndex: 9, padding: '0.6rem 1rem 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 999, padding: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['network', 'station'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.5rem 0', borderRadius: 999, border: 'none',
              background: tab === t ? `linear-gradient(135deg,${V},${M})` : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.45)',
              fontSize: '0.82rem', fontWeight: tab === t ? 700 : 400,
              cursor: 'pointer', transition: 'all .25s',
              boxShadow: tab === t ? `0 0 16px ${V}33` : 'none',
            }}>
              {t === 'network' ? 'Сетевые' : 'Станционные'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem 5rem', position: 'relative', zIndex: 2 }}
        className="scroll-hidden"
      >
        {tab === 'network' ? (
          <>
            {/* Anti-inflation banner */}
            <div style={{
              background: 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(12,14,168,0.3))',
              border: `1px solid ${V}33`, borderRadius: 18,
              padding: '0.85rem 1rem', marginBottom: 12, position: 'relative', overflow: 'hidden',
              backdropFilter: 'blur(16px)',
            }}>
              <Strip color={V} style={{ top: 0, left: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: '1.6rem', flexShrink: 0, filter: `drop-shadow(0 0 10px ${V}66)` }}>🔒</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", color: V, fontSize: '0.44rem', letterSpacing: '0.15em', marginBottom: 2 }}>АНТИИНФЛЯЦИОННАЯ ЗАЩИТА</div>
                  <div style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '0.82rem', lineHeight: 1.2, marginBottom: 2 }}>
                    Заплати сейчас — цена заморожена на{' '}
                    <span style={{ background: `linear-gradient(90deg,${V},${M})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>90 дней</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.56rem' }}>Топливо дорожает ~2–4% в месяц. Ваш талон — нет.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {[['📈','+2–4%','рост/мес'],['💰','+8–12%','за 90 дней'],['🛡️','90 дн.','гарантия']].map(([icon, v, sub]) => (
                  <div key={sub} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.4rem 0.3rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.7rem' }}>{icon}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", color: V, fontSize: '0.5rem', fontWeight: 700 }}>{v}</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.38rem' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: V, fontSize: '0.62rem', letterSpacing: '0.12em', fontWeight: 700 }}>Сетевые талоны</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${V}55,transparent)` }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,0.3)', fontSize: '0.44rem' }}>НА ВСЕХ АЗС</span>
            </div>

            {/* Network cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NETWORKS.map(net => (
                <NetworkCard
                  key={net.name}
                  net={net}
                  isActive={activeNetwork === net.name}
                  onClick={() => setActiveNetwork(activeNetwork === net.name ? null : net.name)}
                  nvFuel={nvFuel}
                  nvVolume={nvVolume}
                  onFuelChange={setNvFuel}
                  onVolumeChange={setNvVolume}
                  onBuy={handleNetworkBuy}
                  loading={nvLoading && activeNetwork === net.name}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Search */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>🔍</span>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск АЗС..."
                  style={{
                    width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#e2e8f0', fontSize: '0.82rem',
                    outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Sort pills */}
            <div style={{ display: 'flex', gap: 5, marginBottom: 10, overflowX: 'auto' }} className="scroll-hidden">
              {['Наличие','Цена','Расстояние','А→Я'].map((s, i) => (
                <button key={s} style={{
                  flexShrink: 0, padding: '0.25rem 0.6rem',
                  background: i === 0 ? `${V}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${i === 0 ? V+'55' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 20, color: i === 0 ? V : 'rgba(255,255,255,0.4)',
                  fontSize: '0.62rem', fontWeight: i === 0 ? 700 : 400, cursor: 'pointer',
                }}>{s}</button>
              ))}
            </div>

            {/* Station list */}
            {!selectedStation ? (
              filteredStations.map(st => (
                <StationRow key={st.id} st={st} isSelected={false} onClick={() => setSelectedStation(st)} />
              ))
            ) : (
              <>
                {/* Back button */}
                <button onClick={() => setSelectedStation(null)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '0.4rem 0.75rem', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem',
                }}>
                  ← Все станции
                </button>

                {/* Station header */}
                <div style={{
                  background: 'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(12,14,168,0.3))',
                  border: `1px solid ${V}33`, borderRadius: 18,
                  padding: '0.9rem 1rem', marginBottom: 12, position: 'relative', overflow: 'hidden',
                }}>
                  <Strip color={V} style={{ top: 0, left: 0 }} />
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#e2e8f0', marginBottom: 2 }}>{selectedStation.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', marginBottom: 8 }}>{selectedStation.address}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ background: `${G}14`, border: `1px solid ${G}33`, borderRadius: 6, padding: '0.1rem 0.4rem', fontSize: '0.56rem', color: G, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{selectedStation.avail}% наличие</span>
                    <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '0.1rem 0.4rem', fontSize: '0.56rem', color: 'rgba(255,255,255,0.5)' }}>{selectedStation.network}</span>
                  </div>
                </div>

                {/* Payment method */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                  {[['stars','⭐ Telegram Stars','#f59e0b'],['crypto','💎 Крипто','#3b82f6']].map(([id, label, color]) => (
                    <button key={id} style={{
                      flex: 1, padding: '0.4rem 0.3rem',
                      border: `1px solid ${id === 'stars' ? color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 9,
                      background: id === 'stars' ? `${color}22` : 'rgba(255,255,255,0.03)',
                      color: id === 'stars' ? color : 'rgba(255,255,255,0.4)',
                      fontSize: '0.68rem', fontWeight: id === 'stars' ? 700 : 400, cursor: 'pointer',
                    }}>{label}</button>
                  ))}
                </div>

                {/* Fuel items */}
                {[
                  { fuel: 'АИ-92', price: selectedStation.price92, available: selectedStation.avail > 20 },
                  { fuel: 'АИ-95', price: selectedStation.price92 + 7.3, available: selectedStation.avail > 40 },
                  { fuel: 'ДТ',    price: selectedStation.price92 + 14.5, available: selectedStation.avail > 10 },
                ].map(f => (
                  <FuelItemMock key={f.fuel} {...f} onBuy={() => {
                    if (Math.random() < 0.38) setShowBlock(true);
                  }} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
