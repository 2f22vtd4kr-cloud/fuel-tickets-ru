import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAiMessage } from "@/api/client";
import { useUserStore } from "@/stores/useUserStore";
import { useStationStore } from "@/stores/useStationStore";
import { useEmpireStore } from "@/stores/useEmpireStore";
import type { AiMessage, TabId, TicketSuggestion } from "@/types";
import { 
  Zap, 
  Send, 
  Map as MapIcon, 
  Shield, 
  ChevronRight, 
  TrendingUp,
  X,
  ShoppingCart,
  Fuel
} from "lucide-react";

interface Props {
  onNavigate?: (tab: TabId) => void;
}

const LS_KEY = (uid: number) => `ai_history_${uid}`;
const MAX_STORED = 20;

const theme = {
  bg: "#08090f",
  cardGlass: "rgba(20,20,32,0.88)",
  violet: "#a78bfa",
  magenta: "#f472b6",
  cyan: "#06b6d4",
  green: "#34d399",
  yellow: "#fbbf24",
  red: "#fb7185",
  textMain: "rgba(255,255,255,0.95)",
  textMuted: "rgba(255,255,255,0.55)",
  font: "'Inter', sans-serif"
};

function loadHistory(uid: number): AiMessage[] {
  try {
    const raw = localStorage.getItem(LS_KEY(uid));
    if (raw) return JSON.parse(raw) as AiMessage[];
  } catch { /* ignore */ }
  return [];
}

function saveHistory(uid: number, msgs: AiMessage[]) {
  try {
    localStorage.setItem(LS_KEY(uid), JSON.stringify(msgs.slice(-MAX_STORED)));
  } catch { /* ignore */ }
}

function makeWelcome(): AiMessage {
  return {
    role: "bot",
    ts: Date.now(),
    text: `⚡ **КризисБот** на связи — ИИ-советник по топливному кризису в России.\n\nОтслеживаю сотни АЗС по всем регионам страны, где фиксируется дефицит топлива.\n\nСпросите что угодно: где заправиться, какие цены сейчас, как купить талон, что происходит в вашем регионе.`,
  };
}

// ── Simple markdown renderer ─────────────────────────────────────────────────
function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <span style={{ display: "block" }}>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, pi) => {
          if (p.startsWith("**") && p.endsWith("**")) {
            return (
              <strong key={pi} style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                {p.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pi}>{p}</span>;
        });
        return (
          <span key={li}>
            {rendered}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// ── Ticket suggestion block ───────────────────────────────────────────────────
function TicketSuggestionBlock({
  suggestion,
  onBuy,
  onDismiss,
}: {
  suggestion: TicketSuggestion;
  onBuy: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93 }}
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ 
        backgroundColor: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.03)",
        marginTop: "8px"
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Fuel size={14} style={{ color: theme.violet }} />
          <h4 className="font-semibold text-[14px] text-white">{suggestion.label}</h4>
        </div>
        <button onClick={onDismiss} style={{ color: theme.textMuted }}>
          <X size={14} />
        </button>
      </div>
      
      <button 
        onClick={onBuy}
        className="mt-1 w-full py-2 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1 transition-opacity active:opacity-80"
        style={{ 
          backgroundColor: "rgba(167, 139, 250, 0.15)",
          color: theme.violet,
          border: `1px solid rgba(167, 139, 250, 0.3)`
        }}
      >
        <ShoppingCart size={14} /> Купить <ChevronRight size={14} />
      </button>
    </motion.div>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function BotThinking() {
  return (
    <div className="flex gap-2 max-w-[85%]">
      <div 
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-auto"
        style={{ background: `linear-gradient(135deg, ${theme.violet}, ${theme.magenta})` }}
      >
        <Zap size={14} color="#fff" />
      </div>
      <div className="flex flex-col gap-1">
        <div 
          className="p-3.5 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed shadow-sm flex items-center gap-2"
          style={{ 
            backgroundColor: theme.cardGlass,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.05)",
            color: theme.textMuted
          }}
        >
          {[0, 0.18, 0.36].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.7, delay, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: theme.violet,
              }}
            />
          ))}
          <span className="text-[13px] ml-1">КризисБот анализирует...</span>
        </div>
      </div>
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function ChatBubble({
  msg,
  onBuyTicket,
  onDismissTicket,
}: {
  msg: AiMessage;
  onBuyTicket?: (ts: TicketSuggestion) => void;
  onDismissTicket?: (msgTs: number) => void;
}) {
  const isBot = msg.role === "bot";
  const time = new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className={`flex gap-2 max-w-[85%] ${isBot ? "" : "self-end justify-end"}`}
    >
      {isBot && (
        <div 
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-auto"
          style={{ background: `linear-gradient(135deg, ${theme.violet}, ${theme.magenta})` }}
        >
          <Zap size={14} color="#fff" />
        </div>
      )}
      <div className={`flex flex-col gap-1 ${isBot ? "" : "items-end"}`}>
        <div 
          className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
            isBot ? "rounded-bl-sm" : "rounded-br-sm"
          }`}
          style={{ 
            backgroundColor: isBot ? theme.cardGlass : undefined,
            background: isBot ? undefined : `linear-gradient(135deg, ${theme.violet}, rgba(167, 139, 250, 0.8))`,
            backdropFilter: isBot ? "blur(20px)" : undefined,
            border: isBot ? "1px solid rgba(255,255,255,0.05)" : "none",
            color: theme.textMain
          }}
        >
          {msg.text.includes("рост на **+4.2%**") || msg.text.includes("прогнозируется рост") ? (
             <div className="flex gap-2 items-start">
               <TrendingUp size={18} className="mt-0.5 flex-shrink-0" style={{ color: theme.yellow }} />
               <MarkdownText text={msg.text} />
             </div>
          ) : (
            <MarkdownText text={msg.text} />
          )}
          
          <AnimatePresence>
            {isBot && msg.ticket_suggestion && !msg.dismissed_ticket && (
              <TicketSuggestionBlock
                key="ticket"
                suggestion={msg.ticket_suggestion}
                onBuy={() => onBuyTicket?.(msg.ticket_suggestion!)}
                onDismiss={() => onDismissTicket?.(msg.ts)}
              />
            )}
          </AnimatePresence>
        </div>
        <span className="text-[10px]" style={{ color: theme.textMuted }}>{time}</span>
      </div>
    </motion.div>
  );
}

// ── Dynamic chips ─────────────────────────────────────────────────────────────
function getDynamicChips(crisisPct: number, remainingL: number, empireLevel: number) {
  const chips: { label: string; query: string }[] = [];
  
  chips.push({ label: "Где заправиться рядом?", query: "Найди ближайшие АЗС с наличием топлива" });
  chips.push({ label: "Прогноз цен", query: "Каков прогноз топливного кризиса и цен на завтра?" });
  chips.push({ label: "Купить талон", query: "Хочу купить топливный талон на АИ-95" });

  if (crisisPct > 30) {
    chips.push({ label: "🚨 Острый кризис", query: "Прогноз кризиса — ситуация очень плохая?" });
  }

  if (empireLevel > 1) {
    chips.push({ label: "🏰 Империя", query: "Как прокачать Империю быстрее?" });
  }

  return chips.slice(0, 5);
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AiTab({ onNavigate }: Props) {
  const { user }     = useUserStore();
  const { stations } = useStationStore();
  const empireStore  = useEmpireStore();

  const uid = user?.id ?? 0;

  const [messages, setMessages]     = useState<AiMessage[]>(() => {
    if (uid) {
      const stored = loadHistory(uid);
      return stored.length ? stored : [makeWelcome()];
    }
    return [makeWelcome()];
  });
  const [input, setInput]           = useState("");
  const [thinking, setThinking]     = useState(false);
  const [showVpn, setShowVpn]       = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Computed context ────────────────────────────────────────────────────────
  const crisisCount = stations.filter(s => {
    const avg = s.fuel_statuses.length
      ? s.fuel_statuses.reduce((a, b) => a + b.availability_pct, 0) / s.fuel_statuses.length
      : 100;
    return avg < 25;
  }).length;
  const crisisPct = stations.length ? Math.round(crisisCount / stations.length * 100) : 0;

  const empireData   = empireStore.data;
  const empireLevel  = empireData?.empire_level ?? 1;
  const empireCoins  = empireData?.coins ?? 0;
  const dailyMax     = 60;
  const dailyUsed    = 0;
  const remainingL   = Math.max(0, dailyMax - dailyUsed);

  const dynamicChips = getDynamicChips(crisisPct, remainingL, empireLevel);

  // ── Persist history ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (uid) saveHistory(uid, messages);
  }, [messages, uid]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // ── Navigation detection from bot reply ─────────────────────────────────────
  const detectNavigation = useCallback((text: string) => {
    const t = text.toLowerCase();
    if (t.includes("открываю карту") || t.includes("вкладку карта")) onNavigate?.("map");
    else if (t.includes("открываю каталог") || t.includes("каталог талонов")) onNavigate?.("catalog");
    else if (t.includes("вкладку резерв") || t.includes("открыть резерв")) onNavigate?.("games");
  }, [onNavigate]);

  // ── Build history for backend ────────────────────────────────────────────────
  const buildBackendHistory = useCallback((msgs: AiMessage[]) => {
    return msgs.slice(-8).map(m => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));
  }, []);

  // ── Send message ─────────────────────────────────────────────────────────────
  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: AiMessage = { role: "user", text: text.trim(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setShowVpn(false);

    try {
      const greenCount = stations.filter(s => {
        const avg = s.fuel_statuses.length
          ? s.fuel_statuses.reduce((a, b) => a + b.availability_pct, 0) / s.fuel_statuses.length
          : 0;
        return avg >= 60;
      }).length;
      const context = {
        crisis_stations: crisisCount,
        green_stations:  greenCount,
        user_id:         uid,
        total_stations:  stations.length,
        region:          "Севастополь",
        daily_used:      dailyUsed,
        daily_max:       dailyMax,
        empire_coins:    empireCoins,
        empire_level:    empireLevel,
        hour:            new Date().getHours(),
      };
      const history = buildBackendHistory(messages);
      const res = await sendAiMessage(userMsg.text, context, history);

      const botMsg: AiMessage = {
        role: "bot",
        text: res.reply,
        ts:   Date.now(),
        ticket_suggestion: res.ticket_suggestion ?? null,
        vpn_fallback:      res.vpn_fallback ?? false,
      };

      setMessages(prev => [...prev, botMsg]);
      if (res.vpn_fallback) setShowVpn(true);
      detectNavigation(res.reply);
    } catch {
      const errMsg: AiMessage = {
        role: "bot",
        text: "⚠️ Сервер недоступен. Попробуйте чуть позже или откройте **Карту** для поиска АЗС.",
        ts: Date.now(),
        vpn_fallback: true,
      };
      setMessages(prev => [...prev, errMsg]);
      setShowVpn(true);
    } finally {
      setThinking(false);
    }
  };

  const handleBuyTicket = (_ts: TicketSuggestion) => {
    onNavigate?.("catalog");
  };

  const handleDismissTicket = (msgTs: number) => {
    setMessages(prev => prev.map(m => m.ts === msgTs ? { ...m, dismissed_ticket: true } : m));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <div 
      className="relative overflow-hidden w-full h-full flex flex-col font-sans"
      style={{ 
        backgroundColor: theme.bg,
        color: theme.textMain,
        fontFamily: theme.font
      }}
    >
      {/* Decorative gradient orbs */}
      <div 
        className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.violet }}
      />
      <div 
        className="absolute bottom-[100px] right-[-50px] w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none opacity-10"
        style={{ backgroundColor: theme.cyan }}
      />

      {/* Header */}
      <header 
        className="flex items-center justify-between px-4 py-3 z-10 sticky top-0"
        style={{
          backgroundColor: theme.cardGlass,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.violet}, ${theme.magenta})`,
              }}
            >
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#08090f]"
              style={{ backgroundColor: theme.green }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-semibold tracking-tight">CrisisBot</h1>
            </div>
            <p className="text-[12px]" style={{ color: thinking ? theme.yellow : theme.green }}>
              • {thinking ? "печатает..." : "онлайн"}
            </p>
          </div>
        </div>
        
        {/* VPN Status Pill */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium"
          style={{ 
            backgroundColor: showVpn ? "rgba(251, 113, 133, 0.15)" : "rgba(6, 182, 212, 0.15)",
            color: showVpn ? theme.red : theme.cyan,
            border: `1px solid ${showVpn ? "rgba(251, 113, 133, 0.3)" : "rgba(6, 182, 212, 0.3)"}`
          }}
        >
          <Shield size={12} />
          <span>VPN {showVpn ? "нужен" : "вкл"}</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 z-10">
        <div className="text-center text-[11px] font-medium my-2" style={{ color: theme.textMuted }}>
          Сегодня
        </div>

        {messages.map((msg, idx) => (
          <ChatBubble 
            key={idx} 
            msg={msg} 
            onBuyTicket={handleBuyTicket} 
            onDismissTicket={handleDismissTicket} 
          />
        ))}
        {thinking && <BotThinking />}
        <div ref={bottomRef} />
      </main>

      {/* Quick Suggestions */}
      <div className="px-3 pb-3 pt-1 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2 z-10">
        {dynamicChips.map((chip, i) => (
          <button 
            key={i}
            onClick={() => void send(chip.query)}
            className="px-4 py-2 rounded-full text-[13px] font-medium transition-colors active:scale-95"
            style={{ 
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: theme.textMain
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div 
        className="p-3 z-10"
        style={{
          backgroundColor: theme.bg,
          borderTop: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div 
            className="flex-1 rounded-2xl flex items-center px-4 py-3 min-h-[48px]"
            style={{ 
              backgroundColor: theme.cardGlass,
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <input 
              type="text"
              placeholder="Задать вопрос..."
              className="bg-transparent border-none outline-none w-full text-[15px] placeholder:opacity-50"
              style={{ color: theme.textMain }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={thinking}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || thinking}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            style={{ background: theme.violet }}
          >
            <Send size={18} color="#fff" className="ml-1" />
          </button>
        </form>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
