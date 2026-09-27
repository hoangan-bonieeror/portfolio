import { useId } from "react";
import { profile } from "../content";

/**
 * The avatar in the middle of the hero.
 * Shows `profile.avatarUrl` if set; otherwise a flat illustrated character
 * drawn in the site's colours (it follows light/dark mode).
 */
export default function Avatar({ size = 208, badge = true }: { size?: number; badge?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="h-full w-full rounded-full border-2 border-accent bg-surface p-1.5 shadow-lift"
        style={{ boxShadow: "var(--shadow-lg), 0 0 0 10px color-mix(in srgb, var(--accent) 8%, transparent)" }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={`Photo of ${profile.name}`}
            className="h-full w-full rounded-full object-cover"
            width={size}
            height={size}
          />
        ) : (
          <Illustration label={`Illustrated avatar of ${profile.name}`} />
        )}
      </div>

      {badge && profile.available && (
        <span className="absolute left-1/2 top-full inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium shadow-soft">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          Open to work
        </span>
      )}
    </div>
  );
}

function Illustration({ label }: { label: string }) {
  const clip = "av" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className="block h-full w-full rounded-full">
      <defs>
        <clipPath id={clip}>
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="200" height="200" fill="var(--surface-2)" />
        <circle cx="100" cy="100" r="78" fill="color-mix(in srgb, var(--accent) 12%, var(--surface-2))" />
        {/* hoodie */}
        <path d="M26 206 C30 158 62 140 100 140 C138 140 170 158 174 206 Z" fill="var(--accent)" />
        <path d="M76 142 C80 160 120 160 124 142 C116 150 84 150 76 142 Z" fill="color-mix(in srgb, var(--accent) 70%, black)" />
        <path d="M92 158 L90 186 M108 158 L110 186" stroke="var(--surface)" strokeWidth="2.5" strokeLinecap="round" />
        {/* headphones resting on the neck */}
        <path d="M68 146 C66 128 76 120 84 124 M132 146 C134 128 124 120 116 124" fill="none" stroke="var(--mint)" strokeWidth="6" strokeLinecap="round" />
        {/* neck, ears, face */}
        <rect x="88" y="118" width="24" height="26" rx="8" fill="#d9a67c" />
        <ellipse cx="65" cy="96" rx="7" ry="10" fill="#e3b187" />
        <ellipse cx="135" cy="96" rx="7" ry="10" fill="#e3b187" />
        <ellipse cx="100" cy="92" rx="35" ry="41" fill="#ecbd93" />
        {/* hair */}
        <path d="M63 90 C58 56 80 42 102 43 C126 44 144 58 138 92 C134 78 128 70 118 66 C108 74 88 76 74 72 C68 78 65 84 63 90 Z" fill="#2e231d" />
        {/* brows, eyes, nose, smile, cheeks */}
        <path d="M80 84 Q87 80 94 84 M106 84 Q113 80 120 84" fill="none" stroke="#2e231d" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="87" cy="94" rx="3.2" ry="3.8" fill="#2e231d" />
        <ellipse cx="113" cy="94" rx="3.2" ry="3.8" fill="#2e231d" />
        <path d="M98 100 Q100 106 102 100" fill="none" stroke="#c48d66" strokeWidth="2" strokeLinecap="round" />
        <path d="M88 112 Q100 121 112 112" fill="none" stroke="#2e231d" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy="106" r="5" fill="#e6a585" opacity="0.5" />
        <circle cx="120" cy="106" r="5" fill="#e6a585" opacity="0.5" />
      </g>
    </svg>
  );
}
