"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RetroDragonLoaderProps {
  type: "starter" | "casual";
  onComplete: () => void;
  show: boolean;
  dragonImageSrc?: string | null;
  fallbackTimeoutMs?: number;
}

/**
 * FractalCoreLoader:
 * - Glassmorphism overlay on top of the existing bg video
 * - Animated Fractal SVG spinner with brand orange/yellow palette
 * - Cycling portfolio-context phrases with fade transitions
 * - Smooth gradient progress bar driven by rAF (same logic as before)
 * - Backwards-compatible: same props interface as the old RetroDragonLoader
 */
export default function RetroDragonLoader({
  type,
  onComplete,
  show,
  dragonImageSrc: _dragonImageSrc = null,
  fallbackTimeoutMs = 3000,
}: RetroDragonLoaderProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);

  // Check if user is returning visitor - avoid hydration mismatch
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    setIsReturningVisitor(!!hasVisited);
  }, []);

  // progress 0..100
  const [progress, setProgress] = useState(0);

  // refs for rAF and timers
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  // call onComplete just once
  const callCompleteOnce = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  // Start/stop progress animation when show changes
  useEffect(() => {
    const cleanupAnimation = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      startTimeRef.current = null;
    };

    if (!show) {
      setProgress(0);
      setIsVideoLoaded(false);
      setVideoEnded(false);
      completedRef.current = false;

      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
      cleanupAnimation();
      return;
    }

    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
    fallbackTimeoutRef.current = window.setTimeout(() => {
      setProgress(100);
      callCompleteOnce();
    }, fallbackTimeoutMs);

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
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
      cleanupAnimation();
    };
  }, [show, fallbackTimeoutMs]);

  // When video ends: set progress to 100 and complete
  useEffect(() => {
    if (videoEnded) {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setProgress(100);
      setTimeout(() => callCompleteOnce(), 120);
    }
  }, [videoEnded]);

  // ── Text cycler state ──────────────────────────────────────────────────────
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
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % phrases.length);
        setTextVisible(true);
      }, 400);
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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      {/* ── SVG filter definitions (invert + sharpen for bg video) ── */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="invertSharpen" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              type="matrix"
              values="
                -1 0 0 0 1
                 0 -1 0 0 1
                 0 0 -1 0 1
                 0 0 0 1 0
              "
              result="inverted"
            />
            <feConvolveMatrix
              in="inverted"
              order="3 3"
              kernelMatrix="0 -1 0 -1 6 -1 0 -1 0"
              divisor="1"
              bias="0"
              edgeMode="duplicate"
              result="sharpened"
            />
            <feBlend in="SourceGraphic" in2="sharpened" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* ── Background video (unchanged) ── */}
      {videoSrc && (
        <video
          ref={(el) => { videoElRef.current = el; }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(3px) url(#invertSharpen)",
            transform: "translateZ(0)",
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          onEnded={() => setVideoEnded(true)}
          onError={(e) => {
            console.error("Loader video error:", e, videoSrc);
            setProgress(100);
            callCompleteOnce();
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* ── Dark overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: videoSrc ? "rgba(0,0,0,0.45)" : "rgba(6,6,8,0.97)",
          zIndex: 5,
        }}
      />

      {/* ── Glassmorphism loader panel ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            padding: "40px 48px",
            background: "rgba(252, 250, 239, 0.10)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 24,
            border: "1px solid rgba(245, 176, 65, 0.18)",
            boxShadow: "0 8px 48px rgba(213, 114, 46, 0.15), 0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {/* ── Fractal SVG Spinner ── */}
          <div
            style={{
              position: "relative",
              borderRadius: "50%",
              transform: "scale(1.2)",
              boxShadow: "0 0 30px 0 rgba(213,114,46,0.5), 0 20px 50px 0 rgba(42,42,42,0.5)",
              animation: "fractalColorize 7.5s ease-in-out infinite",
              marginBottom: 60,
            }}
          >
            {/* Outer ring pseudo-layer via wrapper approach */}
            <div style={{ position: "relative", width: 100, height: 100 }}>
              {/* Outer ring */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  borderTop: "solid 2px #D5722E",
                  borderBottom: "solid 2px #F5B041",
                  background:
                    "linear-gradient(180deg, rgba(245,176,65,0.4), rgba(42,42,42,0.5))",
                  boxShadow:
                    "inset 0 10px 10px 0 rgba(213,114,46,0.5), inset 0 -10px 10px 0 rgba(42,42,42,0.5)",
                }}
              />
              {/* Fractal animated box (masked via inline SVG) */}
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <defs>
                  <mask id="fractalClipping">
                    <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                    <polygon
                      points="25,25 75,25 50,75"
                      fill="white"
                      style={{
                        transformOrigin: "75% 25%",
                        transform: "rotate(90deg)",
                      }}
                    />
                    <polygon
                      points="50,25 75,75 25,75"
                      fill="white"
                      style={{
                        transformOrigin: "50% 50%",
                        animation: "fractalRotation 2.5s linear infinite reverse",
                      }}
                    />
                    <polygon
                      points="35,35 65,35 50,65"
                      fill="white"
                      style={{
                        transformOrigin: "50% 60%",
                        animation: "fractalRotation 2.5s linear infinite",
                        animationDelay: "calc(2.5s / -3)",
                      }}
                    />
                    <polygon
                      points="35,35 65,35 50,65"
                      fill="white"
                      style={{
                        transformOrigin: "40% 40%",
                        animation: "fractalRotation 2.5s linear infinite reverse",
                      }}
                    />
                    <polygon
                      points="35,35 65,35 50,65"
                      fill="white"
                      style={{
                        transformOrigin: "40% 40%",
                        animation: "fractalRotation 2.5s linear infinite reverse",
                        animationDelay: "calc(2.5s / -2)",
                      }}
                    />
                    <polygon
                      points="35,35 65,35 50,65"
                      fill="white"
                      style={{
                        transformOrigin: "60% 40%",
                        animation: "fractalRotation 2.5s linear infinite",
                      }}
                    />
                    <polygon
                      points="35,35 65,35 50,65"
                      fill="white"
                      style={{
                        transformOrigin: "60% 40%",
                        animation: "fractalRotation 2.5s linear infinite",
                        animationDelay: "calc(2.5s / -1.5)",
                      }}
                    />
                  </mask>
                </defs>
                {/* The gradient box revealed through the fractal mask */}
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  fill="url(#fractalGrad)"
                  mask="url(#fractalClipping)"
                  style={{ animation: "fractalRoundness 1.25s linear infinite" }}
                />
                <defs>
                  <linearGradient id="fractalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="20%" stopColor="#D5722E" />
                    <stop offset="80%" stopColor="#F5B041" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* ── Cycling text ── */}
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: "#FCFAEF",
              letterSpacing: 2,
              marginBottom: 20,
              textAlign: "center",
              height: 14,
              opacity: textVisible ? 1 : 0,
              transition: "opacity 0.4s ease-in-out",
              textShadow: "0 0 12px rgba(213,114,46,0.7)",
            }}
          >
            {phrases[textIndex]}
          </div>

          {/* ── Progress bar ── */}
          <div
            style={{
              width: 280,
              height: 6,
              background: "rgba(252,250,239,0.12)",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
            }}
            aria-label={`Loading ${Math.floor(progress)}%`}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #D5722E, #F5B041)",
                borderRadius: 10,
                boxShadow: "0 0 10px rgba(213,114,46,0.6)",
                width: `${progress}%`,
                transition: "width 180ms linear",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Keyframe animations + font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        @keyframes fractalRotation {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fractalRoundness {
          0%,  100% { filter: contrast(15); }
          20%, 40%  { filter: contrast(3);  }
          60%       { filter: contrast(15); }
        }

        @keyframes fractalColorize {
          0%,  100% { filter: hue-rotate(0deg);   }
          20%       { filter: hue-rotate(-20deg);  }
          40%       { filter: hue-rotate(-40deg);  }
          60%       { filter: hue-rotate(-60deg);  }
          80%       { filter: hue-rotate(-30deg);  }
        }
      `}</style>
    </motion.div>
  );
}
