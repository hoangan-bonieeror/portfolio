import { Suspense, lazy, useEffect, useState } from "react";
import { profile, skillGroups } from "../content";
import { MethodBadge } from "./ui";
import Avatar from "./Avatar";
import type { ScenePalette } from "./HeroScene";

const HeroScene = lazy(() => import("./HeroScene"));

/**
 * 1200×630 social preview card, rendered at #/og and captured to
 * public/og.png by `npm run og`. It reads the same content files as the
 * site, so re-run the script after changing your profile.
 */
export default function OgCard() {
  const [palette, setPalette] = useState<ScenePalette | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    const s = getComputedStyle(document.documentElement);
    const v = (n: string) => s.getPropertyValue(n).trim();
    setPalette({
      accent: v("--accent"),
      mint: v("--mint"),
      amber: v("--amber"),
      surface: v("--surface"),
      surface2: v("--surface-2"),
      ink: v("--ink"),
      muted: v("--muted"),
      dark: false,
    });
  }, []);

  const topSkills = skillGroups
    .flatMap((g) => g.skills)
    .filter((s) => s.level === "daily")
    .slice(0, 3)
    .map((s) => s.name);

  return (
    <div className="relative overflow-hidden bg-bg text-ink" style={{ width: 1200, height: 630 }}>
      <div className="bg-dots absolute inset-0 opacity-70" aria-hidden />
      <div
        className="absolute -left-40 -top-40 h-[520px] w-[720px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 30%, transparent), transparent)" }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-accent to-mint" />

      <div className="relative flex h-full">
        {/* Text */}
        <div className="flex w-[560px] flex-col justify-between py-16 pl-18 pr-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-soft">
              <MethodBadge method="GET" />
              <code className="font-mono text-base text-muted">/v1/an-nguyen</code>
              <span className="ml-2 font-mono text-base font-semibold text-mint">200 OK</span>
            </div>
            <h1 className="mt-8 font-display text-[84px] leading-[0.95] font-extrabold tracking-tight">{profile.name}</h1>
            <p className="mt-5 font-display text-[40px] leading-tight font-bold text-accent">{profile.role}</p>
            <p className="mt-3 text-2xl text-muted">
              Open to {profile.openTo[0]} roles
            </p>
          </div>

          <div>
            <div className="mb-6 flex flex-wrap gap-2.5">
              {topSkills.map((s) => (
                <span key={s} className="rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-lg text-ink">
                  {s}
                </span>
              ))}
            </div>
            <p className="font-mono text-xl text-muted">hoangan-bonieeror.github.io/portfolio</p>
          </div>
        </div>

        {/* 3D scene */}
        <div className="relative flex-1">
          <div className="absolute left-1/2 top-[44%] z-10 -translate-x-1/2 -translate-y-1/2">
            <Avatar size={170} />
          </div>
          {palette && (
            <Suspense fallback={null}>
              <HeroScene
                palette={palette}
                animate={false}
                fitWidth={12}
                active
                onReady={() => {
                  // Give the labels a moment to position, then signal the capture script.
                  setTimeout(() => document.body.setAttribute("data-og-ready", "1"), 400);
                }}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
