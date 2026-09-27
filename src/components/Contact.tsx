import { useState, type FormEvent } from "react";
import { Check, Copy, FileText, Github, Linkedin, Mail, Send } from "lucide-react";
import { profile, type SocialLink } from "../content";
import { MethodBadge, Reveal } from "./ui";

const linkIcons: Record<SocialLink["icon"], typeof Mail> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  file: FileText,
};

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15";

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <Reveal>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5 shadow-soft">
              <MethodBadge method="POST" />
              <code className="font-mono text-sm text-muted">/v1/contact</code>
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Let's talk.</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              I'm looking for <span className="font-semibold text-ink">{profile.role}</span> or{" "}
              <span className="font-semibold text-ink">{profile.openTo[0]}</span> roles. If you're hiring, have a question about a project, or just want to
              chat about backend work — my inbox is open.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 pl-4 shadow-soft">
                <Mail className="h-5 w-5 text-accent" />
                <a href={`mailto:${profile.email}`} className="min-w-0 truncate font-medium hover:text-accent">
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-medium transition hover:bg-accent-soft hover:text-accent"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.links.map((l) => {
                  const Icon = linkIcons[l.icon];
                  return (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-accent"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="min-w-0">
                        <span className="block font-medium">{l.label}</span>
                        <span className="block truncate text-sm text-muted">{l.handle}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-surface p-5 shadow-lift sm:p-7">
              <p className="mb-5 font-mono text-xs text-muted">
                Content-Type: <span className="text-ink">application/friendly</span>
              </p>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm font-medium">Your name</span>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane from Acme" autoComplete="name" />
              </label>
              <label className="mb-5 block">
                <span className="mb-1.5 block text-sm font-medium">Message</span>
                <textarea
                  className={`${inputClass} min-h-36 resize-y`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi An, we're hiring a backend developer and…"
                  required
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-medium text-on-accent shadow-soft transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Send request
              </button>
              <p className="mt-3 text-center text-xs text-muted">This opens your email app with the message ready to send.</p>

              {sent && (
                <div className="mt-5 rounded-xl bg-code-bg p-3 font-mono text-xs text-code-ink" role="status">
                  <span className="text-[#a5e8c8]">201 Created</span> — thanks{name ? `, ${name}` : ""}! I usually reply within a day or two.
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
