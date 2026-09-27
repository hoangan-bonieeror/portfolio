import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    setThemeState(next);
  }, []);

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}

/* ------------------------------------------------------------------ */
/* Hash route: "#/projects/<slug>" opens a project panel                */
/* ------------------------------------------------------------------ */

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useProjectRoute() {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash);
  const match = hash.match(/^#\/projects\/([a-z0-9-]+)$/);
  const slug = match ? match[1] : null;

  const open = useCallback((s: string) => {
    window.location.hash = `/projects/${s}`;
  }, []);

  const close = useCallback(() => {
    // Remove the hash without adding a history entry or jumping to the top.
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, []);

  return { slug, open, close };
}

/* ------------------------------------------------------------------ */
/* Media helpers                                                       */
/* ------------------------------------------------------------------ */

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

let webglCache: boolean | null = null;
export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/* ------------------------------------------------------------------ */
/* Scroll spy for the nav                                              */
/* ------------------------------------------------------------------ */

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  const key = ids.join(",");
  useEffect(() => {
    const list = key.split(",");
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      // At the very bottom, the last section wins (it may be too short to reach the middle).
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        setActive(list[list.length - 1]);
        return;
      }
      // Otherwise: the last section whose top has passed the middle of the screen.
      const line = window.innerHeight * 0.45;
      let current = "";
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current); // "" above the first section → nothing highlighted
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}
