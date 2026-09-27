import { skillGroups, type SkillLevel } from "../content";
import { ResponsePanel } from "./ResponsePanel";
import { SkillIcon } from "./SkillIcon";
import { TiltCard } from "./TiltCard";
import { EndpointHeading, Reveal } from "./ui";

const levelMeta: Record<SkillLevel, { label: string; dots: number; className: string }> = {
  daily: { label: "Use daily", dots: 3, className: "text-mint" },
  comfortable: { label: "Comfortable", dots: 2, className: "text-accent" },
  learning: { label: "Learning now", dots: 1, className: "text-amber" },
};

function LevelDots({ level, decorative = false }: { level: SkillLevel; decorative?: boolean }) {
  const m = levelMeta[level];
  return (
    <span
      className={`flex gap-0.5 ${m.className}`}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": m.label, title: m.label })}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < m.dots ? "bg-current" : "bg-line"}`} />
      ))}
    </span>
  );
}

export default function Skills() {
  const json = Object.fromEntries(
    skillGroups.map((g) => [g.id, g.skills.map((s) => ({ name: s.name, level: s.level }))]),
  );

  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <EndpointHeading path="/v1/stack" title="What I work with" lead="Backend first, with enough frontend and hardware experience to ship a whole feature end to end." />
        </Reveal>

        <Reveal>
          <ResponsePanel path="/v1/stack?group=all" data={json}>
            <div className="mb-5 flex flex-wrap gap-4 text-xs text-muted">
              {(Object.keys(levelMeta) as SkillLevel[]).map((l) => (
                <span key={l} className="inline-flex items-center gap-2">
                  <LevelDots level={l} decorative /> {levelMeta[l].label}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {skillGroups.map((g) => (
                <TiltCard key={g.id} className="p-5" max={5}>
                  <div className="preserve-3d">
                    <div className="lift-z mb-4">
                      <h3 className="font-display text-lg font-bold">{g.title}</h3>
                      <p className="text-sm text-muted">{g.blurb}</p>
                    </div>
                    <ul className="lift-z grid gap-2">
                      {g.skills.map((s) => (
                        <li key={s.name} className="flex items-center gap-3 rounded-lg bg-surface-2/60 px-3 py-2">
                          <span className="grid h-6 w-6 place-items-center text-muted">
                            <SkillIcon name={s.icon} />
                          </span>
                          <span className="text-sm font-medium">{s.name}</span>
                          <span className="ml-auto">
                            <LevelDots level={s.level} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              ))}
            </div>
          </ResponsePanel>
        </Reveal>
      </div>
    </section>
  );
}
