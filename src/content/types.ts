/**
 * Content types for the whole site.
 *
 * Everything visitors see is driven by the files in `src/content/`.
 * Edit those files — not the components — to update the portfolio.
 * TypeScript will flag a missing or misspelled field when you run
 * `npm run dev` or `npm run build`.
 */

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export interface SocialLink {
  label: string;
  url: string;
  /** Short text shown under the label, e.g. your handle. */
  handle: string;
  icon: "github" | "linkedin" | "mail" | "file";
}

export interface Profile {
  name: string;
  /** The role you lead with. */
  role: string;
  /** Other roles you are open to. Shown next to the availability badge. */
  openTo: string[];
  /** Set to false to hide the "available" badge. */
  available: boolean;
  location: string;
  /** Short, friendly one-liner for the hero. Wrap a phrase in *asterisks* to highlight it. */
  headline: string;
  /** One or two sentences under the headline. */
  intro: string;
  /** Paragraphs for the About section. *asterisks* highlight a phrase. */
  about: string[];
  /** Small facts shown as chips in About. */
  facts: { label: string; value: string }[];
  /** What you care about as an engineer — shown as cards in About. */
  principles: { title: string; body: string }[];
  email: string;
  /**
   * Optional photo for the hero avatar, e.g. "avatar.jpg" placed in /public.
   * Leave empty ("") to show the illustrated avatar instead.
   */
  avatarUrl: string;
  /** Optional link to a PDF résumé. Leave empty ("") to hide the button. */
  resumeUrl: string;
  links: SocialLink[];
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export type SkillLevel = "daily" | "comfortable" | "learning";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** Optional key from `src/components/SkillIcon.tsx` to show a logo. */
  icon?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

/* ------------------------------------------------------------------ */
/* Personal projects — fully configurable                              */
/* ------------------------------------------------------------------ */

export type ProjectStatus = "planning" | "in-progress" | "paused" | "shipped";

export type MilestoneState = "done" | "active" | "todo";

export interface Milestone {
  title: string;
  state: MilestoneState;
  /** Optional free-form date, e.g. "2026-08" or "Aug 2026". */
  date?: string;
  /** Optional one-line description. */
  note?: string;
  /**
   * Optional weight for progress calculation (default 1).
   * A milestone with weight 3 counts three times as much as one with weight 1.
   */
  weight?: number;
}

export interface ProjectLinks {
  repo?: string;
  demo?: string;
  docs?: string;
}

export interface PersonalProject {
  /** URL-safe id, used in links like #/projects/<slug>. Must be unique. */
  slug: string;
  title: string;
  /** One short line shown on the card. */
  tagline: string;
  category: string;
  status: ProjectStatus;
  /**
   * 0–100. Leave it out and progress is calculated from milestones
   * (done = full weight, active = half weight).
   */
  progress?: number;
  /** What "done" looks like for this project. */
  goal: string;
  /** A few paragraphs explaining the project. */
  overview: string[];
  /** Bullet points: the interesting engineering parts. */
  highlights: string[];
  stack: string[];
  milestones: Milestone[];
  /** What you are working on next. Shown on the card. */
  nextUp?: string;
  startedAt?: string;
  /** Last time you touched this entry, e.g. "2026-09". */
  updatedAt?: string;
  links?: ProjectLinks;
  /** Pin to the top of the list. */
  featured?: boolean;
  /** Set to true to hide the project without deleting it. */
  hidden?: boolean;
}

/* ------------------------------------------------------------------ */
/* Professional work                                                   */
/* ------------------------------------------------------------------ */

export interface WorkProject {
  slug: string;
  title: string;
  /** The backend angle, in one line. */
  summary: string;
  /** What you built, as bullet points. */
  contributions: string[];
  stack: string[];
  /** Visual used for the card's 3D icon. */
  kind: "robot" | "sensor" | "dashboard" | "route" | "fingerprint";
}

export interface Job {
  role: string;
  company: string;
  companyNote?: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  bullets: string[];
}
