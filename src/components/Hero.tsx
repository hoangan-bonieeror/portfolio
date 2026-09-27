import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { profile } from "../content";
import { useMediaQuery, type Theme } from "../lib/hooks";
import { useDeferred3D, usePageVisible } from "../lib/scene3d";
import { Highlight, MethodBadge } from "./ui";
import Avatar from "./Avatar";
import HeroFallback from "./HeroFallback";
import type { ScenePalette } from "./HeroScene";

const HeroScene = lazy(() => import("./HeroScene"));

function readPalette(): ScenePalette {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return {
    accent: v("--accent"),
    mint: v("--mint"),
    amber: v("--amber"),
    surface: v("--surface"),
    surface2: v("--surface-2"),
    ink: v("--ink"),
    muted: v("--muted"),
    dark: document.documentElement.classList.contains("dark"),
  };
}

export default function Hero({ theme }: { theme: Theme }) {
  const reduce = useReducedMotion() ?? false;
  const [palette, setPalette] = useState<ScenePalette>(readPalette);
  const [inView, setInView] = useState(true);
  const { ready: show3D } = useDeferred3D();
  const pageVisible = usePageVisible();
  const [sceneLive, setSceneLive] = useState(false);
  const small = useMediaQuery("(max-width: 639px)");
  const large = useMediaQuery("(min-width: 1024px)");
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => setPalette(readPalette()), [theme]);

  // Pause the 3D render loop when the hero scrolls out of view.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          // Slide only (no fade), so the headline counts as painted immediately.
          initial: { y: 14 },
          animate: { y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const avatarSize = small ? 136 : large ? 208 : 184;

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-14 sm:pt-28 lg:pb-20">
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 35%, transparent), transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Avatar + orbiting systems */}
        <div ref={sceneRef} className="relative isolate mx-auto h-[268px] max-w-[920px] sm:h-[380px] lg:h-[420px]">
          {/* The CSS orbit paints instantly; the 3D orbit fades in over it once the page is idle. */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${sceneLive ? "opacity-0" : "opacity-100"}`}>
            <HeroFallback />
          </div>
          {/* Phones keep the CSS orbit: at that size the 3D objects get too small to read. */}
          {show3D && !small && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${sceneLive ? "opacity-100" : "opacity-0"}`}>
              <Suspense fallback={null}>
                <HeroScene palette={palette} animate={!reduce} active={inView && pageVisible} onReady={() => setSceneLive(true)} />
              </Suspense>
            </div>
          )}

          <motion.div
            {...(reduce ? {} : { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } })}
            className="absolute left-1/2 top-[44%] z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <Avatar size={avatarSize} />
          </motion.div>
        </div>

        {/* Text */}
        <div className="relative mx-auto mt-6 flex max-w-3xl flex-col items-center text-center">
          <motion.p {...fade(0.05)} className="text-base text-muted sm:text-lg">
            Hi, I'm <span className="font-semibold text-ink">{profile.name}</span> — {profile.role}, also open to {profile.openTo[0]} roles
          </motion.p>

          <motion.h1 {...fade(0.1)} className="mt-3 font-display text-[2.5rem] leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-[4rem]">
            <Highlight text={profile.headline} />
          </motion.h1>

          <motion.p {...fade(0.18)} className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div {...fade(0.26)} className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => scrollTo("projects")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-medium text-bg shadow-lift transition hover:-translate-y-0.5 sm:w-auto"
            >
              See my projects
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-medium shadow-soft transition hover:-translate-y-0.5 hover:border-accent sm:w-auto"
            >
              Say hello
            </button>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="inline-flex items-center gap-2 rounded-xl px-3 py-3 font-medium text-muted transition hover:text-ink" download>
                <Download className="h-4 w-4" /> Résumé
              </a>
            )}
          </motion.div>

          {/* Mini API response */}
          <motion.div
            {...fade(0.34)}
            className="mt-7 inline-flex max-w-full items-center gap-2.5 overflow-hidden rounded-xl bg-code-bg py-1.5 pl-1.5 pr-3.5 font-mono text-xs text-code-ink shadow-soft"
          >
            <MethodBadge method="GET" />
            <span>/v1/an-nguyen</span>
            <span className="json-string">200 OK</span>
            <span className="json-punct hidden sm:inline">·</span>
            <span className="hidden truncate sm:inline">
              <span className="json-key">"location"</span>
              <span className="json-punct">: </span>
              <span className="json-string">"{profile.location}"</span>
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-12 flex justify-center">
        <button
          type="button"
          onClick={() => scrollTo("about")}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted transition hover:text-ink"
        >
          <ArrowDown className="h-4 w-4 animate-bounce" /> Scroll to explore
        </button>
      </div>
    </section>
  );
}
