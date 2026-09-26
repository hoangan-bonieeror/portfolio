/**
 * Lightweight CSS-3D stand-in for the hero scene. Shown while the 3D
 * engine loads, and permanently on devices without WebGL.
 */
export default function HeroFallback() {
  return (
    <div className="perspective grid h-full w-full place-items-center" aria-hidden>
      <div className="preserve-3d relative h-56 w-72" style={{ transform: "rotateX(55deg) rotateZ(-35deg)" }}>
        <div className="absolute inset-0 rounded-2xl border border-line bg-surface shadow-lift" />
        {/* API stack */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-[38%] top-[34%] h-16 w-20 rounded-lg bg-accent shadow-soft"
            style={{ transform: `translateZ(${18 + i * 18}px)`, opacity: 0.9 - i * 0.1 }}
          />
        ))}
        {/* DB */}
        <div className="absolute left-[8%] top-[62%] h-14 w-14 rounded-full bg-mint" style={{ transform: "translateZ(16px)" }} />
        <div className="absolute left-[8%] top-[62%] h-14 w-14 rounded-full bg-mint/80" style={{ transform: "translateZ(30px)" }} />
        {/* Robot */}
        <div className="absolute right-[8%] top-[64%] h-10 w-14 rounded-md bg-amber" style={{ transform: "translateZ(14px)" }} />
      </div>
    </div>
  );
}
