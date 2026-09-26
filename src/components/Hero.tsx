import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { profile } from "../content";
import { hasWebGL, useMediaQuery, type Theme } from "../lib/hooks";
import { Highlight, MethodBadge } from "./ui";
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
  const [webgl] = useState(hasWebGL);
  const small = useMediaQuery("(max-width: 639px)");
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
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 35%, transparent), transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* Text */}
        <div>
          {profile.available && (
            <motion.div {...fade(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
              </span>
              <span className="font-medium">
                Open to {profile.role} &amp; {profile.openTo[0]} roles
              </span>
            </motion.div>
          )}

          <motion.p {...fade(0.05)} className="mb-3 text-lg text-muted">
            Hi, I'm <span className="font-semibold text-ink">{profile.name}</span> 👋
          </motion.p>

          <motion.h1 {...fade(0.1)} className="font-display text-[2.6rem] leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            <Highlight text={profile.headline} />
          </motion.h1>

          <motion.p {...fade(0.18)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {profile.intro}
          </motion.p>

          <motion.div {...fade(0.26)} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("projects")}
              className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-medium text-bg shadow-lift transition hover:-translate-y-0.5"
            >
              See my projects
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-medium shadow-soft transition hover:-translate-y-0.5 hover:border-accent"
            >
              Say hello
            </button>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-3 font-medium text-muted transition hover:text-ink"
                download
              >
                <Download className="h-4 w-4" /> Résumé
              </a>
            )}
          </motion.div>

          <motion.p {...fade(0.32)} className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" /> {profile.location}
          </motion.p>
        </div>

        {/* 3D scene */}
        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.9, delay: 0.15 } })}
          className="relative"
        >
          <div ref={sceneRef} className="relative isolate h-[340px] sm:h-[420px] lg:h-[480px]">
            {webgl ? (
              <Suspense fallback={<HeroFallback />}>
                <HeroScene palette={palette} animate={!reduce} active={inView} />
              </Suspense>
            ) : (
              <HeroFallback />
            )}
          </div>

          {/* Floating response card */}
          <motion.div
            {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.6 } })}
            className="absolute -bottom-8 left-0 w-[min(100%,290px)] rounded-xl border border-line bg-surface/95 p-3 shadow-lift backdrop-blur sm:left-2"
          >
            <div className="mb-2 flex items-center gap-2">
              <MethodBadge method="GET" />
              <code className="font-mono text-xs text-muted">/v1/an-nguyen</code>
              <span className="ml-auto font-mono text-[11px] text-mint">200 OK</span>
            </div>
            <pre className="overflow-hidden rounded-lg bg-code-bg p-2.5 font-mono text-[11px] leading-relaxed text-code-ink">
              <span className="json-punct">{"{"}</span>
              {"\n  "}
              <span className="json-key">"role"</span>
              <span className="json-punct">: </span>
              <span className="json-string">"{profile.role}"</span>
              <span className="json-punct">,</span>
              {"\n  "}
              <span className="json-key">"open_to"</span>
              <span className="json-punct">: </span>
              <span className="json-string">{small ? `["${profile.openTo[0]}", …]` : `["${profile.openTo[0]}"]`}</span>
              <span className="json-punct">,</span>
              {"\n  "}
              <span className="json-key">"available"</span>
              <span className="json-punct">: </span>
              <span className="json-bool">{String(profile.available)}</span>
              {"\n"}
              <span className="json-punct">{"}"}</span>
            </pre>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mt-16 flex justify-center">
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
