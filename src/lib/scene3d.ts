import { useEffect, useState } from "react";
import { hasWebGL } from "./hooks";

/**
 * Decides whether (and when) the hero's 3D scene should run.
 *
 * - Devices without WebGL, with Data Saver on, or low-power phones
 *   keep the lightweight CSS scene.
 * - Everyone else gets the 3D scene, but only after the page has
 *   loaded and the visitor starts interacting (or ~3 s pass) — so the
 *   headline and text are never delayed by the 3D engine.
 */

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

export function canRun3D(): boolean {
  if (!hasWebGL()) return false;
  // Manual override for testing: add ?3d=on or ?3d=off to the URL.
  const force = new URLSearchParams(window.location.search).get("3d");
  if (force === "on") return true;
  if (force === "off") return false;

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;

  const touch = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  // Low-power phones/tablets: few cores or little memory.
  if (touch && (cores <= 4 || memory <= 3)) return false;
  // Very old desktops.
  if (cores <= 2) return false;
  return true;
}

/**
 * Calls `cb` once the page has loaded AND either the visitor starts
 * interacting (mouse move, touch, scroll, key) or a few seconds pass —
 * then waits for an idle moment. This keeps the 3D engine's start-up work
 * away from the first paint and the first seconds of reading.
 */
function whenIdle(cb: () => void, delayMs = 3000): () => void {
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let fired = false;
  const events = ["pointermove", "touchstart", "scroll", "keydown"] as const;

  let loadedAt = 0;
  const idle = () => {
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(cb, { timeout: 1500 });
    else timer = setTimeout(cb, 200);
  };
  const go = () => {
    if (fired) return;
    fired = true;
    cleanupTriggers();
    // Even after an early interaction, give the page ~2.5 s after load to settle first.
    const wait = Math.max(0, 2500 - (performance.now() - loadedAt));
    if (wait > 0) timer = setTimeout(idle, wait);
    else idle();
  };
  const cleanupTriggers = () => {
    events.forEach((e) => window.removeEventListener(e, go));
    if (timer) clearTimeout(timer);
  };
  const arm = () => {
    loadedAt = performance.now();
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    timer = setTimeout(go, delayMs);
  };

  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });

  return () => {
    window.removeEventListener("load", arm);
    cleanupTriggers();
    if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
    if (timer) clearTimeout(timer);
  };
}

export function useDeferred3D() {
  const [capable] = useState(canRun3D);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!capable) return;
    // Phones wait longer (or for the first touch/scroll): their CPUs are slower
    // and the scene sits below the headline anyway.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    return whenIdle(() => setReady(true), touch ? 8000 : 3000);
  }, [capable]);

  return { capable, ready: capable && ready };
}

/** True while the browser tab is visible. */
export function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  useEffect(() => {
    const on = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);
  return visible;
}
