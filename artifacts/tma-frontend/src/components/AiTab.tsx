import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAiMessage } from "@/api/client";
import { useUserStore } from "@/stores/useUserStore";
import { useStationStore } from "@/stores/useStationStore";
import type { AiMessage, TabId } from "@/types";
import { Send, MapPin, Bot, Fuel, TrendingUp, Wallet } from "lucide-react";

interface Props {
  onNavigate?: (tab: TabId) => void;
}

const QUICK_CHIPS = [
  { label: "📍 Найти рядом",     query: "Найди ближайшие АЗС с наличием топлива" },
  { label: "⛽ Выбрать топливо",  query: "Какой вид топлива лучше всего сейчас купить?" },
  { label: "💰 Мой бюджет",      query: "Что можно купить на 1000 рублей?" },
  { label: "📊 Прогноз",         query: "Каков прогноз кризиса на следующую неделю?" },
];

const WELCOME: AiMessage = {
  role: "bot",
  ts: Date.now(),
  text: `🤖 Добро пожаловать! Я — ИИ-советник Топливного Узла.

Я помогу вам найти лучший вариант с учётом текущего кризиса и вашего местоположения.

Используйте быстрые подсказки ниже или напишите свой вопрос.`,
};

function BotThinking() {
  return (
    <div style={{ display: "flex", gap: "5px", padding: "12px 16px", alignItems: "center" }}>
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "var(--accent-fuel)",
            boxShadow: "0 0 6px var(--accent-fuel)",
          }}
        />
      ))}
      <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginLeft: "6px" }}>ИИ думает...</span>
    </div>
  );
}

function ChatBubble({ msg }: { msg: AiMessage }) {
  const isBot = msg.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      style={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        marginBottom: "10px",
        paddingLeft: isBot ? 0 : "20%",
        paddingRight: isBot ? "20%" : 0,
      }}
    >
      {isBot && (
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, var(--accent-fuel), #f59e0b)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: "8px", marginTop: "2px",
          boxShadow: "var(--glow-fuel)",
        }}>
          <Bot size={14} style={{ color: "#fff" }} />
        </div>
      )}
      <div style={{
        background: isBot
          ? "var(--bg-glass)"
          : "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
        backdropFilter: isBot ? "var(--blur-glass)" : "none",
        WebkitBackdropFilter: isBot ? "var(--blur-glass)" : "none",
        border: isBot ? "1px solid var(--border-glass)" : "none",
        borderTopColor: isBot ? "rgba(255,255,255,0.22)" : undefined,
        borderRadius: isBot ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
        padding: "10px 14px",
        boxShadow: isBot ? "var(--shadow-glass)" : "var(--glow-primary)",
        maxWidth: "100%",
      }}>
        <p style={{
          fontSize: "0.82rem", lineHeight: 1.5,
          color: "var(--text-primary)",
          whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
}

export function AiTab({ onNavigate }: Props) {
  const [messages, setMessages] = useState<AiMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const { user }    = useUserStore();
  const { stations } = useStationStore();

  const crisisCount = stations.filter(s => {
    const avg = s.fuel_statuses.length
      ? s.fuel_statuses.reduce((a, b) => a + b.availability_pct, 0) / s.fuel_statuses.length
      : 100;
    return avg < 25;
  }).length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    setError("");
    const userMsg: AiMessage = { role: "user", text: text.trim(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const context = {
        crisis_stations: crisisCount,
        user_id: user?.id ?? 0,
        total_stations: stations.length,
      };
      const res = await sendAiMessage(userMsg.text, context);
      setMessages(prev => [...prev, { role: "bot", text: res.reply, ts: Date.now() }]);
    } catch {
      setError("Сервер недоступен. Попробуйте позже.");
      setMessages(prev => [...prev, {
        role: "bot",
        text: "⚠️ Извините, сейчас я недоступен. Попробуйте чуть позже или воспользуйтесь вкладкой Карта для поиска АЗС.",
        ts: Date.now(),
      }]);
    } finally {
      setThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", minHeight: 0,
      background: "transparent",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: "10px",
        flexShrink: 0,
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent-fuel), #f59e0b)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--glow-fuel)",
        }}>
          <Bot size={18} style={{ color: "#fff" }} />
        </div>
        <div>
          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>ИИ-Советник</p>
          <p style={{ fontSize: "0.65rem", color: "var(--accent-success)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent-success)", display: "inline-block" }} />
            Онлайн · Кризисный режим
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          <button
            onClick={() => onNavigate?.("map")}
            title="Карта"
            className="btn-glass"
            style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          >
            <MapPin size={14} style={{ color: "var(--accent-primary)" }} />
          </button>
          <button
            onClick={() => onNavigate?.("catalog")}
            title="Талоны"
            className="btn-glass"
            style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          >
            <Fuel size={14} style={{ color: "var(--accent-secondary)" }} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "14px 12px",
        display: "flex", flexDirection: "column",
      }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <ChatBubble key={msg.ts} msg={msg} />
          ))}
        </AnimatePresence>
        {thinking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ alignSelf: "flex-start", marginBottom: "10px" }}
          >
            <BotThinking />
          </motion.div>
        )}
        {error && (
          <p style={{ fontSize: "0.7rem", color: "var(--accent-danger)", textAlign: "center", margin: "4px 0 8px" }}>
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div style={{
        padding: "8px 12px 4px",
        display: "flex", gap: "6px", overflowX: "auto",
        flexShrink: 0,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.label}
            onClick={() => void send(chip.query)}
            disabled={thinking}
            style={{
              flexShrink: 0,
              background: "var(--bg-glass)",
              border: "1px solid var(--border-glass)",
              borderRadius: "999px",
              padding: "5px 10px",
              fontSize: "0.68rem", color: "var(--text-secondary)",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "8px 12px 10px",
          display: "flex", gap: "8px", alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Спросите об АЗС, талонах, кризисе..."
          style={{
            flex: 1,
            background: "var(--bg-glass)",
            border: "1px solid var(--border-glass)",
            borderRadius: "16px",
            padding: "10px 14px",
            color: "var(--text-primary)",
            fontSize: "0.82rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = "var(--accent-primary)")}
          onBlur={e => (e.target.style.borderColor = "var(--border-glass)")}
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || thinking}
          whileTap={{ scale: 0.9 }}
          style={{
            width: "40px", height: "40px", flexShrink: 0,
            borderRadius: "50%",
            background: input.trim() && !thinking
              ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
              : "var(--bg-glass)",
            border: "1px solid var(--border-glass)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !thinking ? "pointer" : "default",
            transition: "all 0.2s",
            boxShadow: input.trim() && !thinking ? "var(--glow-primary)" : "none",
          }}
        >
          <Send size={16} style={{ color: input.trim() && !thinking ? "#fff" : "var(--text-tertiary)" }} />
        </motion.button>
      </form>
    </div>
  );
}
