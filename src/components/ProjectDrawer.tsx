import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Check, CircleDashed, ExternalLink, Github, Loader, Sparkles, Target, X } from "lucide-react";
import { findProject, getCurrentMilestone, getMilestoneCounts, getProgress, type Milestone, type PersonalProject } from "../content";
import { ResponsePanel } from "./ResponsePanel";
import { ProgressBar, ProgressRing, StatusBadge } from "./ui";

export default function ProjectDrawer({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const project = slug ? findProject(slug) : undefined;
  const reduce = useReducedMotion();

  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close project" onClick={onClose} className="absolute inset-0 h-full w-full bg-ink/30 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="scroll-thin absolute inset-y-0 right-0 w-full max-w-2xl overflow-y-auto border-l border-line bg-bg shadow-lift"
          >
            <DrawerBody project={project} onClose={onClose} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DrawerBody({ project: p, onClose }: { project: PersonalProject; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), [p.slug]);

  const progress = getProgress(p);
  const { done, total } = getMilestoneCounts(p);
  const current = getCurrentMilestone(p);

  const json = {
    slug: p.slug,
    title: p.title,
    status: p.status,
    progress,
    milestones_done: done,
    milestones_total: total,
    goal: p.goal,
    next_up: p.nextUp,
    stack: p.stack,
    milestones: p.milestones.map((m) => ({ title: m.title, state: m.state, date: m.date })),
    links: p.links,
  };

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-bg/90 px-5 py-3 backdrop-blur sm:px-8">
        <span className="font-mono text-xs text-muted">
          <span className="text-mint">GET</span> /v1/projects/{p.slug}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-ink"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
        {/* Title */}
        <header>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={p.status} />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{p.category}</span>
          </div>
          <h2 id="drawer-title" className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            {p.title}
          </h2>
          <p className="mt-2 text-lg text-muted">{p.tagline}</p>
        </header>

        {/* Progress */}
        <div className="flex items-center gap-5 rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <ProgressRing value={progress} size={84} stroke={7} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold">
              {done} of {total} milestones done
            </p>
            <div className="mt-2">
              <ProgressBar value={progress} />
            </div>
            {(p.startedAt || p.updatedAt) && (
              <p className="mt-2 text-xs text-muted">
                {p.startedAt && <>Started {p.startedAt}</>}
                {p.startedAt && p.updatedAt && " · "}
                {p.updatedAt && <>Updated {p.updatedAt}</>}
              </p>
            )}
          </div>
        </div>

        {/* Goal */}
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-5">
          <p className="mb-1.5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <Target className="h-4 w-4" /> Goal
          </p>
          <p className="leading-relaxed">{p.goal}</p>
        </div>

        <ResponsePanel path={`/v1/projects/${p.slug}`} data={json}>
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h3 className="mb-3 inline-flex items-center gap-2 font-display text-xl font-bold">
                <BookOpen className="h-5 w-5 text-accent" /> Overview
              </h3>
              <div className="space-y-3 leading-relaxed text-muted">
                {p.overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Milestones */}
            <section>
              <h3 className="mb-4 font-display text-xl font-bold">Milestones</h3>
              <ol className="relative space-y-1">
                {p.milestones.map((m, i) => (
                  <MilestoneRow key={i} m={m} last={i === p.milestones.length - 1} isCurrent={m === current} />
                ))}
              </ol>
              {p.nextUp && (
                <p className="mt-4 rounded-xl bg-surface-2/70 p-3 text-sm">
                  <span className="font-semibold">Next up: </span>
                  <span className="text-muted">{p.nextUp}</span>
                </p>
              )}
            </section>

            {/* Highlights */}
            <section>
              <h3 className="mb-3 inline-flex items-center gap-2 font-display text-xl font-bold">
                <Sparkles className="h-5 w-5 text-amber" /> Engineering highlights
              </h3>
              <ul className="space-y-2">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            {/* Stack */}
            <section>
              <h3 className="mb-3 font-display text-xl font-bold">Stack</h3>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-lg border border-line bg-surface-2/60 px-2.5 py-1 font-mono text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </ResponsePanel>

        {/* Links */}
        {p.links && (p.links.repo || p.links.demo || p.links.docs) && (
          <div className="flex flex-wrap gap-3">
            {p.links.repo && (
              <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-bg">
                <Github className="h-4 w-4" /> Source code
              </a>
            )}
            {p.links.demo && (
              <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium">
                <ExternalLink className="h-4 w-4" /> Live demo
              </a>
            )}
            {p.links.docs && (
              <a href={p.links.docs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium">
                <BookOpen className="h-4 w-4" /> Docs
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneRow({ m, last, isCurrent }: { m: Milestone; last: boolean; isCurrent: boolean }) {
  const icon =
    m.state === "done" ? (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-mint text-white">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    ) : m.state === "active" ? (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white">
        <Loader className="h-4 w-4 animate-[spin_3s_linear_infinite]" />
      </span>
    ) : (
      <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-line bg-surface text-muted">
        <CircleDashed className="h-3.5 w-3.5" />
      </span>
    );

  return (
    <li className="relative flex gap-4 pb-4">
      {!last && <span className={`absolute left-[13px] top-8 bottom-0 w-0.5 ${m.state === "done" ? "bg-mint/50" : "bg-line"}`} aria-hidden />}
      <span className="relative z-[1]">{icon}</span>
      <div className={`min-w-0 flex-1 rounded-xl px-3 py-1.5 ${isCurrent ? "bg-accent-soft" : ""}`}>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className={`font-medium ${m.state === "todo" ? "text-muted" : ""}`}>{m.title}</p>
          {isCurrent && <span className="text-xs font-semibold text-accent">← now</span>}
          {m.date && <span className="ml-auto font-mono text-xs text-muted">{m.date}</span>}
        </div>
        {m.note && <p className="mt-0.5 text-sm text-muted">{m.note}</p>}
      </div>
    </li>
  );
}
