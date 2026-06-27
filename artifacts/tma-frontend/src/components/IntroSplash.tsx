import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onDone: () => void;
}

export function IntroSplash({ onDone }: Props) {
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800;
    progressRef.current = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - startTime) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressRef.current!);
        setTimeout(() => {
          setPhase("exit");
          setTimeout(onDone, 450);
        }, 300);
      }
    }, 20);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSkip = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setPhase("exit");
    setTimeout(onDone, 450);
  };

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "#0d0b18",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Radial purple glow at center */}
          <div style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            height: 420,
            background: "radial-gradient(circle, rgba(120,60,200,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Ambient dot grid */}
          <div aria-hidden style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, rgba(168,85,247,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 100%)",
          }} />

          {/* Title — top */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            style={{
              position: "relative",
              zIndex: 2,
              paddingTop: "env(safe-area-inset-top, 52px)",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "1rem",
            }}
          >
            <h1 style={{
              fontSize: "clamp(1.75rem, 7vw, 2.25rem)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.18,
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              Добро пожаловать<br />в Топливо
            </h1>
          </motion.div>

          {/* Hero image — fills remaining space, covers watermark with bottom overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            style={{
              position: "relative",
              flex: 1,
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <img
              src="/splash-hero.png"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />

            {/* Bottom gradient — covers watermark + hosts loading bar */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "38%",
              background: "linear-gradient(to top, #0d0b18 0%, #0d0b18 40%, rgba(13,11,24,0.85) 70%, transparent 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 2rem 2.5rem",
              paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))",
            }}>
              {/* Loading bar */}
              <div style={{ marginBottom: "0.55rem" }}>
                <div style={{
                  height: "3px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <motion.div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #7c3aed, #a855f7, #db2777)",
                      boxShadow: "0 0 10px rgba(168,85,247,0.7)",
                      borderRadius: "2px",
                      transition: "width 0.02s linear",
                    }}
                  />
                </div>
              </div>

              {/* Loading label */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}>
                  Загрузка...
                </span>
                <span style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.35)",
                }}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={handleSkip}
            style={{
              position: "absolute",
              top: "calc(env(safe-area-inset-top, 16px) + 12px)",
              right: "1rem",
              zIndex: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.72rem",
              fontWeight: 500,
              padding: "0.3rem 0.85rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              backdropFilter: "blur(8px)",
            }}
          >
            Пропустить
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
