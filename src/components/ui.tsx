import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ProjectStatus } from "../content";
import { statusMeta } from "../content";

/** Turns "*this*" into a highlighted phrase. */
export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="font-semibold text-accent">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const methodStyles = {
  GET: "bg-mint-soft text-mint",
  POST: "bg-amber-soft text-amber",
  PATCH: "bg-accent-soft text-accent",
} as const;

export function MethodBadge({ method }: { method: keyof typeof methodStyles }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide ${methodStyles[method]}`}
    >
      {method}
    </span>
  );
}

const toneStyles = {
  mint: "bg-mint-soft text-mint",
  accent: "bg-accent-soft text-accent",
  amber: "bg-amber-soft text-amber",
  muted: "bg-surface-2 text-muted",
} as const;

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[meta.tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {meta.label}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

/** Circular progress indicator. */
export function ProgressRing({ value, size = 64, stroke = 6 }: { value: number; size?: number; stroke?: number }) {
  const reduce = useReducedMotion();
  const gid = "ring" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${value}% complete`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - value / 100) : c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--mint)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-bold">{value}%</span>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-accent to-mint"
        initial={{ width: reduce ? `${value}%` : 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/** Section heading styled like an API endpoint, with a friendly title underneath. */
export function EndpointHeading({
  method = "GET",
  path,
  title,
  lead,
}: {
  method?: "GET" | "POST" | "PATCH";
  path: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5 shadow-soft">
        <MethodBadge method={method} />
        <code className="font-mono text-sm text-muted">{path}</code>
      </div>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {lead && <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{lead}</p>}
    </div>
  );
}

/** Fade-and-rise on scroll. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
