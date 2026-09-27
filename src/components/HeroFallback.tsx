/**
 * Lightweight CSS-3D version of the hero scene. It paints instantly,
 * stays in place while the 3D engine loads, and is the permanent scene
 * on devices without WebGL, with Data Saver on, or low-power phones.
 */
function Pill({ text, color, className }: { text: string; color: string; className: string }) {
  return (
    <span
      className={`absolute z-10 whitespace-nowrap rounded-full border bg-surface/90 px-2.5 py-1 font-mono text-[11px] font-medium text-ink shadow-soft ${className}`}
      style={{ borderColor: color }}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: color }} />
      {text}
    </span>
  );
}

export default function HeroFallback() {
  return (
    <div className="perspective relative grid h-full w-full place-items-center" aria-hidden>
      <div className="relative h-72 w-80">
        {/* Isometric platform with API stack, database and robot */}
        <div className="preserve-3d absolute inset-0" style={{ transform: "rotateX(55deg) rotateZ(-35deg)" }}>
          <div className="absolute inset-4 rounded-2xl border border-line bg-surface shadow-lift" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-[40%] top-[34%] h-16 w-20 rounded-lg bg-accent shadow-soft"
              style={{ transform: `translateZ(${18 + i * 18}px)`, opacity: 0.95 - i * 0.12 }}
            />
          ))}
          <div className="absolute left-[12%] top-[60%] h-14 w-14 rounded-full bg-mint" style={{ transform: "translateZ(16px)" }} />
          <div className="absolute left-[12%] top-[60%] h-14 w-14 rounded-full bg-mint/80" style={{ transform: "translateZ(32px)" }} />
          <div className="absolute right-[10%] top-[64%] h-10 w-14 rounded-md bg-amber" style={{ transform: "translateZ(14px)" }} />
        </div>
        {/* Labels (not rotated, so they stay readable) */}
        <Pill text="api · flask" color="var(--accent)" className="left-[44%] top-[6%]" />
        <Pill text="postgres" color="var(--mint)" className="-left-4 top-[50%]" />
        <Pill text="robot · ros2" color="var(--amber)" className="-right-2 top-[30%]" />
      </div>
    </div>
  );
}
