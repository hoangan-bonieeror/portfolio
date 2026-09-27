import type { ReactNode } from "react";
import { BarChart3, Bot, Database, Server } from "lucide-react";

/**
 * Lightweight CSS version of the hero orbit. It paints instantly, stays in
 * place while the 3D engine loads, and is the permanent scene on devices
 * without WebGL, with Data Saver on, or low-power phones.
 * The avatar itself is drawn on top by Hero.tsx.
 */
function Node({ icon, label, sub, tone, className, tilt }: { icon: ReactNode; label: string; sub: string; tone: string; className: string; tilt: number }) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-2xl border border-line bg-surface py-1.5 pl-1.5 pr-3 shadow-soft sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-3.5 ${className}`}
      style={{ transform: `perspective(700px) rotateY(${tilt}deg)` }}
    >
      <span className={`grid h-7 w-7 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${tone}`}>{icon}</span>
      <span className="leading-tight">
        <span className="block font-mono text-[11px] font-semibold sm:text-[13px]">{label}</span>
        <span className="hidden text-xs text-muted sm:block">{sub}</span>
      </span>
    </div>
  );
}

export default function HeroFallback() {
  const icon = "h-4 w-4 sm:h-5 sm:w-5";
  return (
    <div className="relative h-full w-full" aria-hidden>
      {/* soft light behind the avatar */}
      <div
        className="absolute left-1/2 top-[44%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 18%, transparent), transparent)" }}
      />

      {/* orbit rings on the "floor" */}
      <div className="absolute left-1/2 top-[70%] h-[34%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-dashed border-line" />
      <div className="absolute left-1/2 top-[70%] h-[22%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-line" />

      {/* data paths from the avatar to each system */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {["M50 44 Q 70 14 80 12", "M50 44 Q 72 52 86 58", "M50 44 Q 30 30 16 38", "M50 44 Q 34 70 24 84"].map((d) => (
          <path key={d} d={d} fill="none" stroke="var(--muted)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>

      <Node
        icon={<BarChart3 className={`${icon} text-accent`} />}
        label="dashboard"
        sub="Angular · live data"
        tone="bg-accent-soft"
        className="right-[4%] top-[2%] sm:right-[10%]"
        tilt={-14}
      />
      <Node
        icon={<Server className={`${icon} text-accent`} />}
        label="api · flask"
        sub="REST, Python"
        tone="bg-accent-soft"
        className="right-0 top-[64%] sm:right-[2%] sm:top-[44%]"
        tilt={-18}
      />
      <Node
        icon={<Database className={`${icon} text-mint`} />}
        label="postgres"
        sub="22-table schema"
        tone="bg-mint-soft"
        className="left-0 top-[18%] sm:left-[4%] sm:top-[26%]"
        tilt={14}
      />
      <Node
        icon={<Bot className={`${icon} text-amber`} />}
        label="robot · ros2"
        sub="SLAM, Nav2"
        tone="bg-amber-soft"
        className="bottom-[2%] left-[4%] sm:left-[12%]"
        tilt={16}
      />
    </div>
  );
}
