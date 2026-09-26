import { ArrowUp } from "lucide-react";
import { profile } from "../content";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-muted sm:flex-row sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs">
          <span className="h-2 w-2 rounded-full bg-mint" />
          All systems operational
        </span>
        <p className="sm:ml-2">
          © {new Date().getFullYear()} {profile.name} · Built with React, Three.js & Tailwind
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition hover:bg-surface-2 hover:text-ink sm:ml-auto"
        >
          <ArrowUp className="h-4 w-4" /> Back to top
        </button>
      </div>
    </footer>
  );
}
