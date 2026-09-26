import { personalProjects } from "./projects";
import type { Milestone, PersonalProject, ProjectStatus } from "./types";

export { profile } from "./profile";
export { skillGroups } from "./skills";
export { jobs, workProjects } from "./work";
export * from "./types";

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Progress from milestones: done = full weight, active = half weight. */
export function progressFromMilestones(milestones: Milestone[]): number {
  const total = milestones.reduce((sum, m) => sum + (m.weight ?? 1), 0);
  if (total === 0) return 0;
  const earned = milestones.reduce((sum, m) => {
    const w = m.weight ?? 1;
    if (m.state === "done") return sum + w;
    if (m.state === "active") return sum + w / 2;
    return sum;
  }, 0);
  return clamp((earned / total) * 100);
}

/** The progress to display: explicit value if set, otherwise calculated. */
export function getProgress(p: PersonalProject): number {
  if (p.status === "shipped" && p.progress === undefined) return 100;
  return p.progress !== undefined ? clamp(p.progress) : progressFromMilestones(p.milestones);
}

export function getMilestoneCounts(p: PersonalProject) {
  const done = p.milestones.filter((m) => m.state === "done").length;
  return { done, total: p.milestones.length };
}

/** The first milestone that isn't done yet. */
export function getCurrentMilestone(p: PersonalProject): Milestone | undefined {
  return p.milestones.find((m) => m.state === "active") ?? p.milestones.find((m) => m.state === "todo");
}

/* ------------------------------------------------------------------ */
/* Status labels                                                       */
/* ------------------------------------------------------------------ */

export const statusMeta: Record<ProjectStatus, { label: string; tone: "mint" | "accent" | "amber" | "muted" }> = {
  shipped: { label: "Shipped", tone: "mint" },
  "in-progress": { label: "In progress", tone: "accent" },
  planning: { label: "Planning", tone: "amber" },
  paused: { label: "Paused", tone: "muted" },
};

/* ------------------------------------------------------------------ */
/* Project list                                                        */
/* ------------------------------------------------------------------ */

/** Visible projects, featured first, otherwise in file order. */
export const projects: PersonalProject[] = personalProjects
  .filter((p) => !p.hidden)
  .map((p, i) => ({ p, i }))
  .sort((a, b) => Number(!!b.p.featured) - Number(!!a.p.featured) || a.i - b.i)
  .map(({ p }) => p);

export function findProject(slug: string): PersonalProject | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Config checks (development only)                                    */
/* ------------------------------------------------------------------ */

/**
 * Catches mistakes in projects.ts that TypeScript can't:
 * duplicate slugs, out-of-range progress, bad slugs, empty milestones.
 * Problems are printed to the browser console while running `npm run dev`.
 */
export function validateContent(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const p of personalProjects) {
    const where = `projects.ts → "${p.title}"`;
    if (seen.has(p.slug)) problems.push(`${where}: duplicate slug "${p.slug}"`);
    seen.add(p.slug);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug))
      problems.push(`${where}: slug should be lowercase-with-dashes`);
    if (p.progress !== undefined && (p.progress < 0 || p.progress > 100))
      problems.push(`${where}: progress must be 0–100 (got ${p.progress})`);
    if (p.milestones.length === 0 && p.progress === undefined)
      problems.push(`${where}: add milestones or set progress`);
    if (p.status === "shipped" && p.milestones.some((m) => m.state !== "done"))
      problems.push(`${where}: status is "shipped" but some milestones aren't done`);
    for (const m of p.milestones) {
      if (m.weight !== undefined && m.weight <= 0)
        problems.push(`${where}: milestone "${m.title}" needs a weight above 0`);
    }
  }
  return problems;
}
