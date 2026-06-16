import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchNews } from "@/api/client";
import type { NewsItem, TabId } from "@/types";
import { RefreshCw, MapPin, Ticket, ChevronDown, ChevronUp, Radio } from "lucide-react";

interface Props {
  onNavigate?: (tab: TabId) => void;
}

const SEVERITY_CONFIG: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  critical: { emoji: "🔴", label: "КРИТИЧНО",       color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
  warning:  { emoji: "🟠", label: "ПРЕДУПРЕЖДЕНИЕ", color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  info:     { emoji: "🟡", label: "СЛЕДИМ",          color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  success:  { emoji: "🟢", label: "УЛУЧШЕНИЕ",       color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} д назад`;
}

function NewsCard({ item, onNavigate }: { item: NewsItem; onNavigate?: (tab: TabId) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ marginBottom: "10px", overflow: "hidden" }}
    >
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: cfg.bg, border: `1px solid ${cfg.color}33`,
            borderRadius: "999px", padding: "2px 8px",
          }}>
            <span style={{ fontSize: "0.7rem" }}>{cfg.emoji}</span>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: cfg.color, letterSpacing: "0.06em" }}>
              {cfg.label}
            </span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
            {timeAgo(item.created_at)}
          </span>
        </div>

        {(item.region || item.fuel_type) && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
            {item.region && (
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: "4px" }}>
                📍 {item.region}
              </span>
            )}
            {item.fuel_type && (
              <span style={{ fontSize: "0.65rem", color: "var(--accent-fuel)", background: "rgba(251,191,36,0.08)", padding: "1px 6px", borderRadius: "4px" }}>
                ⛽ {item.fuel_type}
              </span>
            )}
            {item.price_delta_pct !== null && (
              <span style={{
                fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-mono)",
                color: item.price_delta_pct > 0 ? "var(--accent-danger)" : "var(--accent-success)",
                background: item.price_delta_pct > 0 ? "rgba(251,113,133,0.1)" : "rgba(52,211,153,0.1)",
                padding: "1px 6px", borderRadius: "4px",
              }}>
                {item.price_delta_pct > 0 ? "+" : ""}{item.price_delta_pct.toFixed(1)}%
              </span>
            )}
          </div>
        )}

        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "6px" }}>
          {item.headline}
        </p>

        <AnimatePresence>
          {item.body && expanded && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", marginBottom: "8px" }}
            >
              {item.body}
            </motion.p>
          )}
        </AnimatePresence>

        {item.body && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "3px",
              color: "var(--accent-primary)", fontSize: "0.7rem", padding: "2px 0",
            }}
          >
            {expanded ? <><ChevronUp size={12} /> Свернуть</> : <><ChevronDown size={12} /> Читать подробнее</>}
          </button>
        )}
      </div>

      {(item.severity === "critical" || item.severity === "warning") && (
        <div style={{
          padding: "8px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: "8px",
        }}>
          <button
            onClick={() => onNavigate?.("catalog")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              padding: "7px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              color: "#fff", fontSize: "0.72rem", fontWeight: 600,
            }}
          >
            <Ticket size={12} />
            Доступные талоны
          </button>
          <button
            onClick={() => onNavigate?.("map")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              padding: "7px", borderRadius: "10px", cursor: "pointer",
              background: "var(--bg-glass-hover)", border: "1px solid var(--border-glass)",
              color: "var(--text-primary)", fontSize: "0.72rem", fontWeight: 600,
            }}
          >
            <MapPin size={12} />
            Карта
          </button>
        </div>
      )}
    </motion.div>
  );
}

function CrisisTimeline({ items }: { items: NewsItem[] }) {
  const milestones = items.filter(i => i.severity === "critical" || i.severity === "warning").slice(0, 5);
  if (!milestones.length) return null;
  return (
    <div style={{ marginTop: "16px", marginBottom: "8px" }}>
      <h3 style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", marginBottom: "10px", textTransform: "uppercase" }}>
        Хронология кризиса
      </h3>
      <div style={{ position: "relative", paddingLeft: "16px" }}>
        <div style={{ position: "absolute", left: "6px", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "1px" }} />
        {milestones.map((item, i) => {
          const cfg = SEVERITY_CONFIG[item.severity];
          return (
            <div key={item.id} style={{ display: "flex", gap: "10px", marginBottom: "12px", position: "relative" }}>
              <div style={{
                position: "absolute", left: "-13px", top: "4px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`,
                flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.3 }}>{item.headline}</p>
                <p style={{ fontSize: "0.62rem", color: "var(--text-tertiary)", marginTop: "2px" }}>
                  {item.region && `${item.region} · `}{timeAgo(item.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function NewsTab({ onNavigate }: Props) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = await fetchNews(undefined, 30);
      setNews(items);
    } catch {
      setError("Не удалось загрузить ленту новостей.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const criticalCount = news.filter(n => n.severity === "critical").length;
  const warningCount  = news.filter(n => n.severity === "warning").length;
  const crisisLevel   = criticalCount >= 3 ? 5 : criticalCount >= 2 ? 4 : criticalCount >= 1 ? 3 : warningCount >= 2 ? 2 : 1;
  const crisisRegions = [...new Set(news.filter(n => n.severity === "critical" && n.region).map(n => n.region))].slice(0, 3);
  const crisisColor   = crisisLevel >= 4 ? "#fb7185" : crisisLevel >= 3 ? "#fb923c" : crisisLevel >= 2 ? "#fbbf24" : "#34d399";

  return (
    <div style={{ minHeight: "100%", padding: "16px 12px 12px", background: "transparent" }}>

      {/* Crisis Banner */}
      <AnimatePresence>
        {!bannerDismissed && crisisLevel >= 2 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: `rgba(${crisisLevel >= 4 ? "251,113,133" : crisisLevel >= 3 ? "251,146,60" : "251,191,36"},0.10)`,
              border: `1px solid ${crisisColor}44`,
              borderRadius: "12px",
              padding: "10px 12px",
              marginBottom: "14px",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <Radio size={14} style={{ color: crisisColor, flexShrink: 0, animation: "crisisPulse 1.2s infinite" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: crisisColor, letterSpacing: "0.06em" }}>
                КРИЗИСНЫЙ РЕЖИМ · Уровень {crisisLevel}/5
              </span>
              {crisisRegions.length > 0 && (
                <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                  {crisisRegions.join(" · ")}
                </p>
              )}
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: "1rem", padding: "2px", flexShrink: 0 }}
            >×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Лента новостей</h2>
          <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "1px" }}>
            Топливный кризис · {news.length} событий
          </p>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="btn-glass"
          style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
        >
          <RefreshCw size={15} style={{ animation: loading ? "spin 1s linear infinite" : "none", color: "var(--accent-primary)" }} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "100px", borderRadius: "20px" }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "var(--accent-danger)", marginBottom: "12px" }}>{error}</p>
          <button onClick={() => void load()} className="btn-glass" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
            Повторить
          </button>
        </div>
      ) : (
        <>
          {news.map(item => (
            <NewsCard key={item.id} item={item} onNavigate={onNavigate} />
          ))}
          <CrisisTimeline items={news} />
          {news.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-tertiary)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "8px" }}>📰</p>
              <p>Новостей пока нет</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
