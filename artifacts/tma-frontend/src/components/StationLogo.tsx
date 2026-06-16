/** SVG monogram logo for a gas station network, rendered as a colored circle badge */

const NETWORK_COLORS: Record<string, { bg: string; text: string }> = {
  "Лукойл":         { bg: "#dc2626", text: "#fff"    },
  "Роснефть":       { bg: "#2563eb", text: "#fff"    },
  "ГазпромНефть":   { bg: "#4f46e5", text: "#fff"    },
  "Газпромнефть":   { bg: "#4f46e5", text: "#fff"    },
  "Shell":          { bg: "#d97706", text: "#fff"    },
  "BP":             { bg: "#16a34a", text: "#fff"    },
  "ТНКБП":          { bg: "#0369a1", text: "#fff"    },
  "ТНК":            { bg: "#0369a1", text: "#fff"    },
  "Сургутнефтегаз": { bg: "#7c3aed", text: "#fff"    },
  "Татнефть":       { bg: "#b45309", text: "#fff"    },
  "Башнефть":       { bg: "#065f46", text: "#fff"    },
  "Нефтис":         { bg: "#6d28d9", text: "#fff"    },
  "Севастополь":    { bg: "#a855f7", text: "#fff"    },
  "Крымнефть":      { bg: "#f472b6", text: "#fff"    },
  "Независимая":    { bg: "#374151", text: "#d1d5db" },
};

function getNetworkStyle(network: string): { bg: string; text: string } {
  for (const [key, style] of Object.entries(NETWORK_COLORS)) {
    if (network.toLowerCase().includes(key.toLowerCase())) return style;
  }
  // Fallback: hash the first chars to pick a color
  const code = network.charCodeAt(0) + (network.charCodeAt(1) || 0);
  const PALETTES = [
    { bg: "#7c3aed", text: "#fff" },
    { bg: "#0f766e", text: "#fff" },
    { bg: "#b45309", text: "#fff" },
    { bg: "#0369a1", text: "#fff" },
    { bg: "#047857", text: "#fff" },
    { bg: "#be185d", text: "#fff" },
    { bg: "#c2410c", text: "#fff" },
  ];
  return PALETTES[code % PALETTES.length];
}

function getInitials(network: string): string {
  const words = network.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return network.slice(0, 2).toUpperCase();
}

interface Props {
  network: string;
  size?: number;
}

export function StationLogo({ network, size = 32 }: Props) {
  if (!network) return null;
  const style = getNetworkStyle(network);
  const initials = getInitials(network);
  const fontSize = size * 0.38;

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: style.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 800, color: style.text,
      fontFamily: "'Inter', system-ui, sans-serif",
      flexShrink: 0,
      boxShadow: `0 0 8px ${style.bg}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
      letterSpacing: "-0.03em",
      userSelect: "none",
    }}>
      {initials}
    </div>
  );
}
