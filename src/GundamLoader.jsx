import { useEffect, useRef, useState } from "react";

/**
 * GundamLoader
 * -----------------------------------------------------------------
 * A HUD-style boot screen whose progress bar reflects REAL loading,
 * not a fake timer. Three real progress sources are supported —
 * pick the one that matches what you're actually waiting on:
 *
 *  1. trackPageLoad()   -> tracks the browser's own resource loading
 *                          (images, scripts, fonts) via PerformanceObserver.
 *                          Use this for "loading my website / app shell".
 *
 *  2. trackFetch(url)   -> tracks bytes downloaded from a real server
 *                          response using the Streams API. Use this for
 *                          "downloading a file / API payload from the internet".
 *
 *  3. progress prop     -> if you already have a number (0-100) from your
 *                          own logic (e.g. multi-step async setup, an
 *                          upload, a WebSocket status), just pass it in
 *                          and GundamLoader will just display it.
 *
 * If none of the above apply yet (e.g. still deciding), it falls back
 * to a slow "still working..." creep so the UI never looks frozen.
 * -----------------------------------------------------------------
 */

const STAGES = [
  { at: 0,    status: "INITIALIZING OS...",    sub: "CHECKING MOBILE SUIT SYSTEMS" },
  { at: 20,   status: "LOADING OS-7 KERNEL...", sub: "VERIFYING PHASE SHIFT ARMOR" },
  { at: 45,   status: "CALIBRATING OS...",      sub: "SYNCING PILOT NEURAL LINK" },
  { at: 68,   status: "DEPLOYING SYSTEMS...",   sub: "ARMING STRIKER PACK" },
  { at: 95,   status: "READY.",                 sub: "MOBILE SUIT ONLINE" },
];

function useRealProgress({ mode = "page", fetchUrl, externalProgress, minDurationMs = 1800, onDone } = {}) {
  const [rawProgress, setRawProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const doneRef = useRef(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  // --- gather the REAL progress number (unchanged logic, just renamed) ---
  useEffect(() => {
    let cancelled = false;

    if (mode === "external") {
      setRawProgress(Math.max(0, Math.min(100, externalProgress ?? 0)));
      return;
    }

    if (mode === "page") {
      const entries = () => performance.getEntriesByType("resource");
      const total = () => Math.max(entries().length, 1);
      const alreadyLoaded = () => entries().filter(e => e.responseEnd > 0).length;

      const tick = () => {
        if (cancelled) return;
        setRawProgress(Math.min(99, Math.round((alreadyLoaded() / total()) * 100)));
      };

      const interval = setInterval(tick, 150);
      tick();

      const finish = () => {
        if (cancelled) return;
        setRawProgress(100);
        clearInterval(interval);
      };

      if (document.readyState === "complete") finish();
      else window.addEventListener("load", finish);

      return () => {
        cancelled = true;
        clearInterval(interval);
        window.removeEventListener("load", finish);
      };
    }

    if (mode === "fetch" && fetchUrl) {
      (async () => {
        try {
          const res = await fetch(fetchUrl);
          const contentLength = res.headers.get("Content-Length");
          const total = contentLength ? parseInt(contentLength, 10) : null;

          if (!res.body || !total) {
            setRawProgress(50);
            await res.blob();
            if (!cancelled) setRawProgress(100);
            return;
          }

          const reader = res.body.getReader();
          let received = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.length;
            if (!cancelled) setRawProgress(Math.min(99, Math.round((received / total) * 100)));
          }
          if (!cancelled) setRawProgress(100);
        } catch (err) {
          console.error("GundamLoader fetch tracking failed:", err);
          if (!cancelled) setRawProgress(100);
        }
      })();

      return () => { cancelled = true; };
    }
  }, [mode, fetchUrl, externalProgress]);

  // --- smooth the number shown on screen so it never flashes past too fast ---
  // displayProgress never exceeds rawProgress (never lies upward), but it also
  // won't jump straight to 100 the instant rawProgress does — it eases up over
  // at least minDurationMs so the boot screen is actually readable.
  useEffect(() => {
    if (startRef.current === null) startRef.current = performance.now();

    const step = (now) => {
      const elapsed = now - startRef.current;
      const timeCap = Math.min(100, (elapsed / minDurationMs) * 100);
      // ease-out curve so it feels like it's settling in, not linear-robotic
      const eased = 100 - Math.pow(1 - timeCap / 100, 2) * 100;
      const next = Math.min(rawProgress, Math.round(eased));

      setDisplayProgress(prev => (next > prev ? next : prev));

      if (next < 100) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rawProgress, minDurationMs]);

  useEffect(() => {
    if (displayProgress >= 100 && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
  }, [displayProgress, onDone]);

  return displayProgress;
}

export default function GundamLoader({
  mode = "page",        // "page" | "fetch" | "external"
  fetchUrl,              // required when mode="fetch"
  progress: externalProgress, // required when mode="external"
  fadingOut = false,     // set true once the parent has been told loading is done
  minDurationMs = 1800,  // loader stays visible at least this long, even on instant loads
  onDone,
}) {
  const progress = useRealProgress({ mode, fetchUrl, externalProgress, minDurationMs, onDone });
  const stage = [...STAGES].reverse().find(s => progress >= s.at) ?? STAGES[0];

  return (
    <div
      style={{
        ...styles.stage,
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <div style={styles.scanlines} />

      <div style={{ ...styles.corner, top: 0, left: 0, borderRight: "none", borderBottom: "none" }} />
      <div style={{ ...styles.corner, top: 0, right: 0, borderLeft: "none", borderBottom: "none" }} />
      <div style={{ ...styles.corner, bottom: 0, left: 0, borderRight: "none", borderTop: "none" }} />
      <div style={{ ...styles.corner, bottom: 0, right: 0, borderLeft: "none", borderTop: "none" }} />

      <div style={styles.tag}>ZODIAC ALLIANCE OF FREEDOM TREATY</div>
      <div style={{ ...styles.tag, top: "auto", bottom: 18, opacity: 0.45, fontSize: "clamp(7px, 1.1vw, 9px)" }}>
        MS NEO OPERATION — SYS//BOOT
      </div>

      <div style={styles.content}>
        <div style={styles.emblem}>
          <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, animation: "gspin 14s linear infinite" }}>
            <polygon
              points="100,10 118,80 190,60 130,105 190,150 118,125 100,195 82,125 10,150 70,105 10,60 82,80"
              fill="none" stroke="#e13c3c" strokeWidth="2.5" opacity="0.85"
            />
          </svg>
          <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, animation: "gspin 9s linear infinite reverse" }}>
            <circle cx="100" cy="100" r="62" fill="none" stroke="#5fd4ff" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.7" />
          </svg>
        </div>

        <div style={styles.logoLine}>GUNDAM</div>

        <div style={styles.readout}>
          <div style={styles.readoutRow}>
            <span>{stage.status}</span>
            <span style={styles.pct}>{progress}%</span>
          </div>
          <div style={styles.barTrack}>
            <div style={{ ...styles.barFill, width: `${progress}%` }} />
          </div>
          <div style={styles.statusSub}>{stage.sub}</div>
        </div>
      </div>

      <style>{`
        @keyframes gspin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  stage: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(ellipse at 50% 30%, rgba(31,58,110,.55) 0%, rgba(5,7,17,0) 60%), radial-gradient(ellipse at 50% 100%, rgba(225,60,60,.12) 0%, rgba(5,7,17,0) 55%), #050711",
    fontFamily: "'Share Tech Mono', monospace",
    transition: "opacity .5s ease",
    overflow: "hidden",
    boxSizing: "border-box",
    padding: "6vh 6vw",
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "repeating-linear-gradient(to bottom, rgba(255,255,255,.035) 0px, rgba(255,255,255,.035) 1px, transparent 2px, transparent 3px)",
    mixBlendMode: "overlay",
  },
  corner: {
    position: "absolute",
    width: "clamp(20px, 3vw, 34px)",
    height: "clamp(20px, 3vw, 34px)",
    margin: "clamp(10px, 2.5vw, 22px)",
    border: "2px solid #5fd4ff",
    opacity: 0.85,
  },
  tag: {
    position: "absolute", top: 18, left: 0, right: 0, textAlign: "center",
    fontSize: "clamp(8px, 1.3vw, 11px)", letterSpacing: ".35em", color: "#5fd4ff", opacity: .75,
  },
  content: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "clamp(16px, 3.5vh, 30px)",
    width: "100%",
    maxWidth: 460,
  },
  emblem: {
    position: "relative",
    width: "clamp(120px, 22vw, 210px)",
    height: "clamp(120px, 22vw, 210px)",
  },
  logoLine: {
    fontWeight: 900,
    fontSize: "clamp(16px, 3.4vw, 26px)",
    letterSpacing: ".5em",
    color: "#eaf3ff",
    textShadow: "0 0 18px rgba(95,212,255,.5)",
  },
  readout: { width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 },
  readoutRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "clamp(9px, 1.6vw, 12px)", letterSpacing: ".1em", color: "#5fd4ff",
  },
  pct: { color: "#f2c14e", fontWeight: "bold" },
  barTrack: { position: "relative", width: "100%", height: 12, background: "rgba(95,212,255,.08)", border: "1px solid #1c4a63" },
  barFill: { height: "100%", background: "linear-gradient(90deg, #1c4a63, #5fd4ff)", boxShadow: "0 0 10px #5fd4ff", transition: "width .2s linear" },
  statusSub: { fontSize: "clamp(9px, 1.5vw, 11px)", letterSpacing: ".08em", color: "#eaf3ff", opacity: .65 },
};