import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

/** Small, dependency-free JSON syntax highlighter. */
function render(value: unknown, indent: number): ReactNode[] {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);

  if (value === null) return [<span key="n" className="json-null">null</span>];
  if (typeof value === "string") return [<span key="s" className="json-string">{JSON.stringify(value)}</span>];
  if (typeof value === "number") return [<span key="num" className="json-number">{value}</span>];
  if (typeof value === "boolean") return [<span key="b" className="json-bool">{String(value)}</span>];

  if (Array.isArray(value)) {
    if (value.length === 0) return [<span key="e" className="json-punct">[]</span>];
    const out: ReactNode[] = [<span key="o" className="json-punct">[</span>, "\n"];
    value.forEach((v, i) => {
      out.push(padIn, ...render(v, indent + 1));
      if (i < value.length - 1) out.push(<span key={`c${i}`} className="json-punct">,</span>);
      out.push("\n");
    });
    out.push(pad, <span key="cl" className="json-punct">]</span>);
    return out;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return [<span key="e" className="json-punct">{"{}"}</span>];
    const out: ReactNode[] = [<span key="o" className="json-punct">{"{"}</span>, "\n"];
    entries.forEach(([k, v], i) => {
      out.push(
        padIn,
        <span key={`k${i}`} className="json-key">{JSON.stringify(k)}</span>,
        <span key={`p${i}`} className="json-punct">: </span>,
        ...render(v, indent + 1),
      );
      if (i < entries.length - 1) out.push(<span key={`c${i}`} className="json-punct">,</span>);
      out.push("\n");
    });
    out.push(pad, <span key="cl" className="json-punct">{"}"}</span>);
    return out;
  }
  return [String(value)];
}

export function JsonView({ data, maxHeight = 420 }: { data: unknown; maxHeight?: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <div className="relative rounded-xl bg-code-bg text-code-ink">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:bg-white/20"
        aria-label="Copy JSON"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        className="scroll-thin overflow-auto p-4 pr-20 font-mono text-[12.5px] leading-relaxed"
        style={{ maxHeight }}
      >
        <code>{render(data, 0)}</code>
      </pre>
    </div>
  );
}
