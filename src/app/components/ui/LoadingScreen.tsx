"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
 * With cinematic full-length background video playback on initial visit.
 */
export default function RetroDragonLoader({
  type,
  onComplete,
  show,
  dragonImageSrc: _dragonImageSrc = null,
  fallbackTimeoutMs,
}: RetroDragonLoaderProps) {
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const completedRef = useRef(false);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  // Keep a stable ref to onComplete so re-renders never clear timers
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    try {
      const hasVisited = sessionStorage.getItem("hasVisited");
      setIsReturningVisitor(!!hasVisited);
    } catch {
      setIsReturningVisitor(false);
    }
  }, []);

  const callCompleteOnce = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current();
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (videoElRef.current) {
      try {
        videoElRef.current.pause();
      } catch {
        // ignore
      }
    }
    setProgress(100);
    callCompleteOnce();
  }, [callCompleteOnce]);

  // Allow skipping after 1.0s of playback via button or Escape key
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setCanSkip(true), 1000);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, handleSkip]);

  const videoSrc =
    type === "starter" && !isReturningVisitor
      ? "/videos/Lazy Loader - starter 1.mp4"
      : null;

  // Explicitly trigger play on mount to satisfy browser autoplay policies
  useEffect(() => {
    const video = videoElRef.current;
    if (!video || !videoSrc) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Video autoplay prevented by browser:", err);
      });
    }
  }, [videoSrc]);

  // Guaranteed fallback timer: NEVER gets reset by re-renders
  useEffect(() => {
    if (!show) {
      setProgress(0);
      setVideoEnded(false);
      completedRef.current = false;
      return;
    }

    // Max wait time: 8.0 seconds for starter (video is 7.44s), 1.5s for casual
    const maxWait = fallbackTimeoutMs || (type === "starter" && !isReturningVisitor ? 8000 : 1500);
    const timer = setTimeout(() => {
      setProgress(100);
      callCompleteOnce();
    }, maxWait);

    return () => clearTimeout(timer);
  }, [show, type, isReturningVisitor, fallbackTimeoutMs, callCompleteOnce]);

  // When video naturally ends, smoothly advance to 100% and dismiss
  useEffect(() => {
    if (videoEnded) {
      setProgress(100);
      const timer = setTimeout(() => callCompleteOnce(), 100);
      return () => clearTimeout(timer);
    }
  }, [videoEnded, callCompleteOnce]);

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
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % phrases.length);
        setTextVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, [show, phrases.length]);

  if (!show) return null;

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
        backgroundColor: "#060608",
      }}
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
          overflow: hidden;
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

      {/* ── Background video (plays completely to the end; loop removed) ── */}
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
            backgroundColor: "#060608",
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={() => {
            const el = videoElRef.current;
            if (el && el.duration) {
              const currentP = (el.currentTime / el.duration) * 100;
              setProgress((p) => Math.max(p, Math.min(100, currentP)));
            }
          }}
          onEnded={() => {
            setProgress(100);
            setVideoEnded(true);
          }}
          onError={() => {
            setProgress(100);
            callCompleteOnce();
          }}
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
              <svg width="0" height="0" style={{ position: "absolute", display: "block", overflow: "visible" }} aria-hidden>
                <defs>
                  <mask id="fClip">
                    <polygon points="0,0 100,0 100,100 0,100" fill="black" />
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

          {/* Progress bar (directly bound to video playback progress) */}
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

      {/* ── Discreet Neubrutalist Skip Button (Available after 1.0s for busy recruiters) ── */}
      {canSkip && videoSrc && (
        <button
          type="button"
          onClick={handleSkip}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            zIndex: 30,
            padding: "8px 16px",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            letterSpacing: 1,
            color: "#FCFAEF",
            backgroundColor: "rgba(10, 11, 15, 0.8)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "2px solid #F5B041",
            borderRadius: 8,
            boxShadow: "3px 3px 0px #D5722E",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(1px, 1px)";
            e.currentTarget.style.boxShadow = "1px 1px 0px #D5722E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)";
            e.currentTarget.style.boxShadow = "3px 3px 0px #D5722E";
          }}
        >
          SKIP INTRO [ESC] ✕
        </button>
      )}
    </motion.div>
  );
}
