import React from "react";
import "./_group.css";

const COLUMNS = [
  {
    text: "ПОХ*Й",
    bg: null,
    textColor: "#ffffff",
    blockColor: "#A855F7",
    blockOpacity: 0.18,
    delay: 0,
  },
  {
    text: "ИНФЛЯЦИЯ —",
    bg: "#A855F7",
    textColor: "#ffffff",
    blockColor: null,
    blockOpacity: 1,
    delay: 0.08,
  },
  {
    text: "БЕРИ ТАЛОНЫ",
    bg: null,
    textColor: "#ffffff",
    blockColor: "#22D3EE",
    blockOpacity: 0.14,
    delay: 0.16,
  },
  {
    text: "И ЗАМОРАЖИВАЙ",
    bg: "#22D3EE",
    textColor: "#0A0A0F",
    blockColor: null,
    blockOpacity: 1,
    delay: 0.24,
  },
  {
    text: "ЦЕНЫ",
    bg: null,
    textColor: "#ffffff",
    blockColor: "#A855F7",
    blockOpacity: 0.22,
    delay: 0.32,
  },
];

export function LoadingScreen() {
  return (
    <div
      className="relative w-full h-[844px] max-w-[390px] mx-auto overflow-hidden"
      style={{ background: "#0A0A0F" }}
    >
      {/* Columns */}
      <div className="absolute inset-0 flex flex-row">
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            className="relative flex-1 h-full flex items-center justify-center overflow-hidden"
            style={{
              animation: `colRise 0.7s cubic-bezier(0.16,1,0.3,1) both`,
              animationDelay: `${col.delay}s`,
            }}
          >
            {/* Solid colour fill for "coloured" columns */}
            {col.bg && (
              <div
                className="absolute inset-0"
                style={{ background: col.bg }}
              />
            )}

            {/* Subtle tint for "dark" columns */}
            {!col.bg && col.blockColor && (
              <div
                className="absolute inset-0"
                style={{
                  background: col.blockColor,
                  opacity: col.blockOpacity,
                }}
              />
            )}

            {/* Vertical text — reads bottom → top like the poster */}
            <div
              className="relative font-black uppercase select-none leading-none"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                fontSize: "clamp(52px, 16vw, 72px)",
                color: col.textColor,
                letterSpacing: "-0.03em",
                textShadow:
                  col.bg === "#22D3EE"
                    ? "none"
                    : "0 0 40px rgba(168,85,247,0.35)",
              }}
            >
              {col.text}
            </div>

            {/* Thin separator line */}
            <div
              className="absolute top-0 bottom-0 right-0 w-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
        ))}
      </div>


      <style>{`
        @keyframes colRise {
          from {
            clip-path: inset(0 0 100% 0);
            opacity: 0;
          }
          to {
            clip-path: inset(0 0 0% 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
