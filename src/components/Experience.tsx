import { Bot, Briefcase, Fingerprint, LayoutDashboard, Route, Siren } from "lucide-react";
import { jobs, workProjects, type WorkProject } from "../content";
import { ResponsePanel } from "./ResponsePanel";
import { TiltCard } from "./TiltCard";
import { EndpointHeading, Reveal } from "./ui";

const kindIcon: Record<WorkProject["kind"], typeof Bot> = {
  robot: Bot,
  sensor: Siren,
  dashboard: LayoutDashboard,
  route: Route,
  fingerprint: Fingerprint,
};

const kindTone: Record<WorkProject["kind"], string> = {
  robot: "from-amber to-rose",
  sensor: "from-rose to-amber",
  dashboard: "from-accent to-mint",
  route: "from-mint to-accent",
  fingerprint: "from-accent to-rose",
};

export default function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <EndpointHeading
            path="/v1/experience"
            title="Where I've worked"
            lead="Production software for factories — where an API outage means robots stop moving."
          />
        </Reveal>

        {jobs.map((job) => (
          <Reveal key={job.company + job.start}>
            <ResponsePanel path={`/v1/experience/${job.company.toLowerCase().replace(/\s+/g, "-")}`} data={job} className="mb-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Briefcase className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-2xl font-bold">{job.role}</h3>
                    <span className="font-mono text-sm text-muted">
                      {job.start} — {job.end}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">
                    {job.company}
                    {job.companyNote && <span className="font-normal text-muted"> · {job.companyNote}</span>}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted">{job.summary}</p>
                  <ul className="mt-4 space-y-2.5">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                        <span className="text-muted">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ResponsePanel>
          </Reveal>
        ))}

        <Reveal>
          <h3 className="mb-5 font-display text-2xl font-bold">Selected work projects</h3>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workProjects.map((w, i) => {
            const Icon = kindIcon[w.kind];
            return (
              <Reveal key={w.slug} delay={Math.min(i, 4) * 0.06}>
                <TiltCard className="p-5 sm:p-6">
                  <div className="preserve-3d flex h-full flex-col">
                    {/* Layered 3D icon tile */}
                    <div className="preserve-3d relative mb-5 h-14 w-14">
                      <span className={`absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl bg-gradient-to-br opacity-30 blur-[2px] ${kindTone[w.kind]}`} aria-hidden />
                      <span className={`absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br text-white shadow-soft ${kindTone[w.kind]}`} style={{ transform: "translateZ(50px)" }}>
                        <Icon className="h-7 w-7" />
                      </span>
                    </div>
                    <h4 className="lift-z font-display text-lg font-bold leading-snug">{w.title}</h4>
                    <p className="lift-z mt-1.5 text-sm text-muted">{w.summary}</p>
                    <ul className="lift-z mt-4 space-y-1.5 text-sm">
                      {w.contributions.map((c, j) => (
                        <li key={j} className="flex gap-2 text-muted">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <div className="lift-z mt-auto flex flex-wrap gap-1.5 pt-5">
                      {w.stack.map((s) => (
                        <span key={s} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
