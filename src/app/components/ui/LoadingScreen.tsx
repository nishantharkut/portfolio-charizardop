"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface RetroDragonLoaderProps {
  type: "starter" | "casual";
  onComplete: () => void;
  show: boolean;
  dragonImageSrc?: string | null;
  fallbackTimeoutMs?: number;
}

/**
 * FractalCoreLoader — faithful port of the reference HTML fractal spinner.
 * All animations live in the injected <style> block (CSS classes + @keyframes).
 * Pseudo-elements are replaced by sibling divs.
 * Background video and all loading-context props are unchanged.
 */
export default function RetroDragonLoader({
  type,
  onComplete,
  show,
  dragonImageSrc: _dragonImageSrc = null,
  fallbackTimeoutMs = 6000,
}: RetroDragonLoaderProps) {
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    setIsReturningVisitor(!!hasVisited);
  }, []);

  const callCompleteOnce = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  useEffect(() => {
    const cleanupAnimation = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      startTimeRef.current = null;
    };

    if (!show) {
      setProgress(0);
      setVideoEnded(false);
      completedRef.current = false;
      if (fallbackTimeoutRef.current) { clearTimeout(fallbackTimeoutRef.current); fallbackTimeoutRef.current = null; }
      cleanupAnimation();
      return;
    }

    if (fallbackTimeoutRef.current) { clearTimeout(fallbackTimeoutRef.current); fallbackTimeoutRef.current = null; }
    fallbackTimeoutRef.current = window.setTimeout(() => { setProgress(100); callCompleteOnce(); }, fallbackTimeoutMs);

    startTimeRef.current = performance.now();
    const animate = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const raw = Math.min(100, (elapsed / fallbackTimeoutMs) * 100);
      setProgress((p) => (raw > p ? raw : p));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (fallbackTimeoutRef.current) { clearTimeout(fallbackTimeoutRef.current); fallbackTimeoutRef.current = null; }
      cleanupAnimation();
    };
  }, [show, fallbackTimeoutMs]);

  useEffect(() => {
    if (videoEnded) {
      if (fallbackTimeoutRef.current) { clearTimeout(fallbackTimeoutRef.current); fallbackTimeoutRef.current = null; }
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      setProgress(100);
      setTimeout(() => callCompleteOnce(), 120);
    }
  }, [videoEnded]);

  // ── Text cycler ──────────────────────────────────────────────────────────
  const phrases = [
    "LOADING PORTFOLIO...",
    "RENDERING 3D SCENE...",
    "PAINTING BRUSHSTROKES...",
    "SPINNING UP THE DRAGON...",
    "BREWING DARK COFFEE...",
    "BEST VIEWED ON DESKTOP",
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => { setTextIndex((i) => (i + 1) % phrases.length); setTextVisible(true); }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const videoSrc =
    type === "starter" && !isReturningVisitor
      ? "/videos/Lazy Loader - starter 1.mp4"
      : null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}
    >
      {/* ── Font + all fractal keyframes ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        /* Fractal spinner — CSS variables */
        .fractal-wrap {
          --color-one:   #D5722E;
          --color-two:   #F5B041;
          --color-three: rgba(213, 114, 46, 0.5);
          --color-four:  rgba(42, 42, 42, 0.5);
          --color-five:  rgba(245, 176, 65, 0.4);
          --t: 2.5s;

          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          box-shadow: 0 0 30px 0 var(--color-three), 0 20px 50px 0 var(--color-four);
          animation: fColorize calc(var(--t) * 3) ease-in-out infinite;
        }

        /* Ring — replaces ::before */
        .fractal-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border-top:    2px solid var(--color-one);
          border-bottom: 2px solid var(--color-two);
          background: linear-gradient(180deg, var(--color-five), var(--color-four));
          box-shadow:
            inset 0 10px 10px 0 var(--color-three),
            inset 0 -10px 10px 0 var(--color-four);
        }

        /* Colored box revealed through fractal mask */
        .fractal-box {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, var(--color-one) 20%, var(--color-two) 80%);
          mask: url(#fClip);
          -webkit-mask: url(#fClip);
        }

        /* SVG sits on top, positions itself absolutely */
        .fractal-svg {
          position: absolute;
          top: 0; left: 0;
        }

        /* The mask group gets the contrast filter + animation */
        #fClip {
          filter: contrast(15);
          animation: fRoundness calc(var(--t) / 2) linear infinite;
        }

        /* Every polygon in the mask is blurred so they goo together */
        #fClip polygon { filter: blur(7px); }

        #fClip polygon:nth-child(1) { transform-origin: 75% 25%; transform: rotate(90deg); }
        #fClip polygon:nth-child(2) { transform-origin: 50% 50%; animation: fRotation var(--t) linear infinite reverse; }
        #fClip polygon:nth-child(3) { transform-origin: 50% 60%; animation: fRotation var(--t) linear infinite;         animation-delay: calc(var(--t) / -3);   }
        #fClip polygon:nth-child(4) { transform-origin: 40% 40%; animation: fRotation var(--t) linear infinite reverse; }
        #fClip polygon:nth-child(5) { transform-origin: 40% 40%; animation: fRotation var(--t) linear infinite reverse; animation-delay: calc(var(--t) / -2);   }
        #fClip polygon:nth-child(6) { transform-origin: 60% 40%; animation: fRotation var(--t) linear infinite;         }
        #fClip polygon:nth-child(7) { transform-origin: 60% 40%; animation: fRotation var(--t) linear infinite;         animation-delay: calc(var(--t) / -1.5); }

        @keyframes fRotation {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
        @keyframes fRoundness {
          0%,  100% { filter: contrast(15); }
          20%, 40%  { filter: contrast(3);  }
          60%       { filter: contrast(15); }
        }
        @keyframes fColorize {
          0%,  100% { filter: hue-rotate(0deg);   }
          20%       { filter: hue-rotate(-20deg);  }
          40%       { filter: hue-rotate(-40deg);  }
          60%       { filter: hue-rotate(-60deg);  }
          80%       { filter: hue-rotate(-30deg);  }
        }
      `}</style>

      {/* ── SVG filter for bg video ───────────────────────────────────────── */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="invertSharpen" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" result="inverted" />
            <feConvolveMatrix in="inverted" order="3 3" kernelMatrix="0 -1 0 -1 6 -1 0 -1 0" divisor="1" bias="0" edgeMode="duplicate" result="sharpened" />
            <feBlend in="SourceGraphic" in2="sharpened" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* ── Background video (unchanged) ─────────────────────────────────── */}
      {videoSrc && (
        <video
          ref={(el) => { videoElRef.current = el; }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(3px) url(#invertSharpen)", transform: "translateZ(0)" }}
          autoPlay muted loop playsInline preload="auto"
          onEnded={() => setVideoEnded(true)}
          onError={() => { setProgress(100); callCompleteOnce(); }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── Dark overlay ─────────────────────────────────────────────────── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: videoSrc ? "rgba(0,0,0,0.52)" : "rgba(6,6,8,0.97)", zIndex: 5 }} />

      {/* ── Glassmorphism panel ──────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "48px 56px",
          background: "rgba(252, 250, 239, 0.08)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderRadius: 24,
          border: "1px solid rgba(245, 176, 65, 0.20)",
          boxShadow: "0 8px 48px rgba(213, 114, 46, 0.18), 0 2px 16px rgba(0,0,0,0.55)",
        }}>

          {/* Fractal spinner — scaled up 1.2× via wrapper */}
          <div style={{ transform: "scale(1.2)", marginBottom: 60 }}>
            <div className="fractal-wrap">
              {/* Ring (replaces ::before pseudo-element) */}
              <div className="fractal-ring" />

              {/* Hidden SVG: defines the mask only — rendered at 0×0 so it doesn't block */}
              <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
                <defs>
                  <mask id="fClip">
                    {/* black background = hide everything */}
                    <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                    {/* white shapes = reveal the gradient fill through them */}
                    <polygon points="25,25 75,25 50,75" fill="white" />
                    <polygon points="50,25 75,75 25,75" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                    <polygon points="35,35 65,35 50,65" fill="white" />
                  </mask>
                </defs>
              </svg>

              {/* The colored box revealed through the fractal mask */}
              <div className="fractal-box" />
            </div>
          </div>

          {/* Cycling text */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: "#FCFAEF",
            letterSpacing: 2,
            marginBottom: 20,
            textAlign: "center",
            height: 14,
            opacity: textVisible ? 1 : 0,
            transition: "opacity 0.4s ease-in-out",
            textShadow: "0 0 14px rgba(213,114,46,0.8)",
            whiteSpace: "nowrap",
          }}>
            {phrases[textIndex]}
          </div>

          {/* Progress bar */}
          <div style={{ width: 280, height: 6, background: "rgba(252,250,239,0.12)", borderRadius: 10, overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)" }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #D5722E, #F5B041)",
              borderRadius: 10,
              boxShadow: "0 0 10px rgba(213,114,46,0.6)",
              width: `${progress}%`,
              transition: "width 180ms linear",
            }} />
          </div>

        </div>
      </div>
    </motion.div>
  );
}
