import { Cpu, Database, ShieldCheck } from "lucide-react";
import { profile } from "../content";
import { ResponsePanel } from "./ResponsePanel";
import { TiltCard } from "./TiltCard";
import { EndpointHeading, Highlight, Reveal } from "./ui";

const principleIcons = [Database, ShieldCheck, Cpu];

export default function About() {
  const json = {
    name: profile.name,
    role: profile.role,
    open_to: profile.openTo,
    location: profile.location,
    facts: Object.fromEntries(profile.facts.map((f) => [f.label.toLowerCase().replace(/\s+/g, "_"), f.value])),
    bio: profile.about.map((p) => p.replace(/\*/g, "")),
  };

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <EndpointHeading path="/v1/about" title="A bit about me" lead="The short version: I like making data move reliably from where it's created to where it's useful." />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Reveal>
            <ResponsePanel path="/v1/about" data={json}>
              <div className="space-y-4 text-[17px] leading-relaxed text-muted">
                {profile.about.map((p, i) => (
                  <p key={i}>
                    <Highlight text={p} />
                  </p>
                ))}
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {profile.facts.map((f) => (
                  <div key={f.label} className="rounded-xl border border-line bg-surface-2/60 p-3">
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="mt-1 font-display text-[15px] font-bold leading-snug">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </ResponsePanel>
          </Reveal>

          <div className="grid grid-cols-1 gap-4">
            {profile.principles.map((pr, i) => {
              const Icon = principleIcons[i % principleIcons.length];
              return (
                <Reveal key={pr.title} delay={i * 0.08}>
                  <TiltCard className="p-5">
                    <div className="preserve-3d flex gap-4">
                      <span className="lift-z grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="lift-z">
                        <h3 className="font-display text-lg font-bold">{pr.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{pr.body}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
