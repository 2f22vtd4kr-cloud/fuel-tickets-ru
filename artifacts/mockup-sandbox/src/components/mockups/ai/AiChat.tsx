import { useState, useRef, useEffect } from "react";

interface Msg {
  role: "user" | "bot";
  text: string;
  suggestions?: string[];
}

const DEMO_HISTORY: Msg[] = [
  { role: "user", text: "Привет" },
  {
    role: "bot",
    text: "🤖 Привет! Я — **КризисБот**, ИИ-советник по топливу.\n\nСистема сейчас: 45 зелёных АЗС из 236 (7.6% в кризисе).\n\nЧем могу помочь:\n• 📍 Поиск АЗС по городу или сети\n• 💰 Цены и расчёт бюджета\n• 🎫 Покупка топливных талонов\n• 📊 Кризисный прогноз по регионам\n\nПросто спроси!",
    suggestions: ["Найти АЗС рядом", "Купить талон", "Прогноз кризиса"],
  },
  { role: "user", text: "А по мск?" },
  {
    role: "bot",
    text: "**Москва** вне моей зоны покрытия.\n\n«Топливный Узел» работает только по Крыму и Севастополю. Сейчас у нас **45** живых АЗС из 236.\n\nВ Москве своя сеть АЗС без наших ограничений — там ситуация другая.\n\nРасскажу про Крым?",
    suggestions: ["Ситуация в Крыму", "Найти АЗС рядом", "Прогноз кризиса"],
  },
];

function renderText(text: string) {
  return text.split("\n").map((line, li, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, pi) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={pi} style={{ color: "#e2e8f0", fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        : <span key={pi}>{p}</span>
    );
    return <span key={li}>{parts}{li < arr.length - 1 && <br />}</span>;
  });
}

export function AiChat() {
  const [messages, setMessages] = useState<Msg[]>(DEMO_HISTORY);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const botReply = getBotReply(text.toLowerCase());
      setMessages(prev => [...prev, botReply]);
    }, 900 + Math.random() * 600);
  };

  function getBotReply(msg: string): Msg {
    if (msg.includes("спасибо") || msg.includes("спс") || msg.includes("окей") || msg.includes("понял"))
      return { role: "bot", text: "Всегда рад! У нас **45** зелёных АЗС — найдём. 👍", suggestions: ["Найти АЗС", "Купить талон", "Прогноз"] };
    if (msg.includes("крым") || msg.includes("ситуац"))
      return { role: "bot", text: "📊 **Ситуация в Крыму:**\n\n• Зелёных АЗС: **45** из 236\n• Кризисных: **18** (7.6%)\n• Тренд: стабильна ➡️\n• Рекомендую запастись: **40л** сегодня\n\nСитуация напряжённая, но управляемая.", suggestions: ["Купить талон", "Прогноз по регионам", "Найти АЗС"] };
    if (msg.includes("прогноз"))
      return { role: "bot", text: "📊 **Кризисный анализ** (Севастополь):\n\n• Кризисных АЗС: 18 / 236 (7.6%)\n• Зелёных АЗС: 45\n• Тренд: стабильна ➡️\n• Рекомендую запастись: **40л** сегодня\n\nСитуация напряжённая, но управляемая. Лимиты соблюдены в большинстве регионов.", suggestions: ["Купить талон", "Смотреть новости", "Прогноз по регионам"] };
    if (msg.includes("купи") || msg.includes("талон"))
      return { role: "bot", text: "⛽ **Топливный талон** — быстрая покупка:\n\n• Топливо: **АИ-95**\n• Объём: 40л\n• Стоимость: ~2 080 ₽ / ≈1 130 Stars\n• Активация: мгновенная ⚡\n• Срок: 24 часа", suggestions: ["Купить сейчас", "Выбрать АЗС", "Другой объём"] };
    if (msg.includes("найти") || msg.includes("азс") || msg.includes("рядом"))
      return { role: "bot", text: "📍 **Севастополь** — АЗС с топливом:\n\n• Зелёных в регионе: ~12\n• Всего в системе: 45 из 236\n\nОткрой вкладку **Карта** → фильтр по региону.\nЗелёный маркер = топливо есть ✅\n\nТвой лимит: осталось **60л** сегодня.", suggestions: ["Открыть карту", "Фильтр: Лукойл", "Фильтр: Роснефть"] };
    return { role: "bot", text: "Хм, не совсем понял. 🤔\n\nПопробуй иначе, например:\n• «найди АЗС в Симферополе»\n• «сколько стоит АИ-95»\n• «купить талон на 40л»\n• «прогноз кризиса»", suggestions: ["Найти АЗС рядом", "Купить талон", "Прогноз кризиса"] };
  }

  return (
    <div style={{
      height: "100vh", background: "#050507",
      display: "flex", flexDirection: "column",
      fontFamily: "system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "0.85rem 1rem 0.7rem",
        background: "rgba(8,8,20,0.98)",
        borderBottom: "1px solid #1a1a2a",
        display: "flex", alignItems: "center", gap: "0.65rem",
        flexShrink: 0,
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, #a855f7, #db2777)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", flexShrink: 0,
          boxShadow: "0 0 14px rgba(168,85,247,0.5)",
        }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.88rem" }}>КризисБот</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
            <span style={{ color: "#4b5563", fontSize: "0.6rem" }}>онлайн · ИИ-советник</span>
          </div>
        </div>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: "0.42rem", color: "#1e1e2a", letterSpacing: "0.1em" }}>AI_v2.1</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.85rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <div style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              gap: "0.5rem",
              alignItems: "flex-end",
            }}>
              {m.role === "bot" && (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #a855f7, #db2777)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", flexShrink: 0,
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "78%",
                background: m.role === "user"
                  ? "linear-gradient(135deg, #a855f7, #db2777)"
                  : "rgba(18,18,30,0.95)",
                border: m.role === "bot" ? "1px solid #2a1a3e" : "none",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "0.65rem 0.85rem",
                fontSize: "0.78rem",
                color: m.role === "user" ? "#fff" : "#c4b5fd",
                lineHeight: 1.55,
                boxShadow: m.role === "user" ? "0 0 16px rgba(168,85,247,0.3)" : "none",
              }}>
                {renderText(m.text)}
              </div>
            </div>
            {m.suggestions && m.role === "bot" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem", paddingLeft: "2rem" }}>
                {m.suggestions.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    background: "rgba(168,85,247,0.08)",
                    border: "1px solid rgba(168,85,247,0.28)",
                    borderRadius: "20px",
                    padding: "0.28rem 0.65rem",
                    color: "#c084fc",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "background 0.15s",
                  }}>{s}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>🤖</div>
            <div style={{ background: "rgba(18,18,30,0.95)", border: "1px solid #2a1a3e", borderRadius: "18px 18px 18px 4px", padding: "0.65rem 0.85rem", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a855f7", opacity: 0.7, animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "0.6rem 0.75rem 0.85rem",
        background: "rgba(8,8,20,0.98)",
        borderTop: "1px solid #1a1a2a",
        display: "flex", gap: "0.5rem", alignItems: "flex-end",
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Задайте вопрос..."
            style={{
              width: "100%",
              background: "rgba(20,20,32,0.9)",
              border: "1px solid #2a1a3e",
              borderRadius: "14px",
              padding: "0.6rem 0.85rem",
              color: "#e2e8f0",
              fontSize: "0.82rem",
              outline: "none",
              boxSizing: "border-box",
              lineHeight: 1.4,
            }}
          />
        </div>
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
          style={{
            width: "40px", height: "40px",
            background: input.trim() ? "linear-gradient(135deg, #a855f7, #db2777)" : "rgba(30,30,42,0.9)",
            border: "none", borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() ? "pointer" : "default",
            fontSize: "0.9rem", flexShrink: 0,
            boxShadow: input.trim() ? "0 0 12px rgba(168,85,247,0.4)" : "none",
            transition: "all 0.2s",
          }}
        >✈️</button>
      </div>
      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
