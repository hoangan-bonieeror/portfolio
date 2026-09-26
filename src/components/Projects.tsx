import { useMemo, useState } from "react";
import { ArrowUpRight, Flag, Star } from "lucide-react";
import { getCurrentMilestone, getMilestoneCounts, getProgress, projects, statusMeta, type PersonalProject, type ProjectStatus } from "../content";
import { TiltCard } from "./TiltCard";
import { EndpointHeading, ProgressRing, Reveal, StatusBadge } from "./ui";

type Filter = "all" | ProjectStatus;

export default function Projects({ onOpen }: { onOpen: (slug: string) => void }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filters = useMemo(() => {
    const present = new Set(projects.map((p) => p.status));
    const order: ProjectStatus[] = ["in-progress", "shipped", "planning", "paused"];
    return ["all" as const, ...order.filter((s) => present.has(s))];
  }, []);

  const shown = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <section id="projects" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <EndpointHeading
            path="/v1/projects"
            title="Things I'm building"
            lead="Personal projects I'm working on right now, with honest progress. Tap one to see the goal, the plan and what's next."
          />
        </Reveal>

        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
            <code className="mr-1 font-mono text-xs text-muted">?status=</code>
            {filters.map((f) => {
              const count = f === "all" ? projects.length : projects.filter((p) => p.status === f).length;
              const label = f === "all" ? "All" : statusMeta[f].label;
              const on = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    on ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {label} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 4) * 0.06} className={p.featured && filter === "all" ? "lg:col-span-2" : ""}>
              <ProjectCard project={p} wide={!!p.featured && filter === "all"} onOpen={() => onOpen(p.slug)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, wide, onOpen }: { project: PersonalProject; wide: boolean; onOpen: () => void }) {
  const progress = getProgress(p);
  const { done, total } = getMilestoneCounts(p);
  const current = getCurrentMilestone(p);
  const extra = p.stack.length - 4;

  return (
    <TiltCard onClick={onOpen} ariaLabel={`Open ${p.title}`} max={wide ? 5 : 8} className="flex flex-col p-5 sm:p-6">
      <div className="preserve-3d flex h-full flex-col">
        <div className="lift-z mb-4 flex items-center gap-2">
          <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-wider text-muted">{p.category}</span>
          {p.featured && (
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-amber-soft px-2 py-0.5 text-[11px] font-medium text-amber">
              <Star className="h-3 w-3" /> Featured
            </span>
          )}
          <span className="ml-auto">
            <StatusBadge status={p.status} />
          </span>
        </div>

        <div className="lift-z">
          <div>
            <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.tagline}</p>
            {wide && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{p.goal}</p>}
          </div>
        </div>

        <div className="lift-z mt-5 flex items-center gap-4 rounded-xl bg-surface-2/60 p-3">
          <ProgressRing value={progress} size={56} stroke={5} />
          <div className="min-w-0 text-sm">
            <p className="font-medium">
              {done} of {total} milestones
            </p>
            {current && (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-muted">
                <Flag className="h-3.5 w-3.5 shrink-0 text-accent" />
                <span className="truncate">Now: {current.title}</span>
              </p>
            )}
          </div>
        </div>

        {/* milestone strip */}
        <div className="lift-z mt-3 flex gap-1" aria-hidden>
          {p.milestones.map((m, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                m.state === "done" ? "bg-mint" : m.state === "active" ? "bg-accent" : "bg-line"
              }`}
            />
          ))}
        </div>

        <div className="lift-z mt-auto flex flex-wrap items-center gap-1.5 pt-5">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
              {s}
            </span>
          ))}
          {extra > 0 && <span className="font-mono text-[11px] text-muted">+{extra}</span>}
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-accent">
            Details <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </TiltCard>
  );
}
