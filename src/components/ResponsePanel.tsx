import { useMemo, useState, type ReactNode } from "react";
import { Braces, Eye } from "lucide-react";
import { MethodBadge } from "./ui";
import { JsonView } from "./JsonView";

/**
 * A friendly "API response" frame. Visitors see a readable Preview by
 * default and can flip to the raw JSON — which is built from the same
 * content files that drive the page.
 */
export function ResponsePanel({
  method = "GET",
  path,
  status = "200 OK",
  data,
  children,
  className = "",
}: {
  method?: "GET" | "POST" | "PATCH";
  path: string;
  status?: string;
  data: unknown;
  children: ReactNode;
  className?: string;
}) {
  const [tab, setTab] = useState<"preview" | "json">("preview");
  // A small, stable "latency" number so each panel feels like a real response.
  const latency = useMemo(() => 8 + (path.length * 7) % 23, [path]);

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-surface-2/60 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <MethodBadge method={method} />
          <code className="truncate font-mono text-xs text-muted sm:text-sm">{path}</code>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1.5 font-mono text-xs text-muted sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden />
            <span className="text-mint">{status}</span>
            <span aria-hidden>·</span>
            {latency}ms
          </span>
          <div className="flex rounded-xl border border-line bg-surface p-1" role="tablist" aria-label="Response view">
            <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye className="h-3.5 w-3.5" />}>
              Preview
            </TabButton>
            <TabButton active={tab === "json"} onClick={() => setTab("json")} icon={<Braces className="h-3.5 w-3.5" />}>
              JSON
            </TabButton>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">{tab === "preview" ? children : <JsonView data={data} />}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition pointer-coarse:min-h-11 pointer-coarse:px-4 pointer-coarse:text-sm ${
        active ? "bg-accent text-on-accent shadow-sm" : "text-muted hover:text-ink"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
