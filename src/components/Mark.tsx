/**
 * The montymi mark: two columns under a lintel, a taller block, and a slope, read as an m and
 * the start of a skyline. Caps in pitch green; the sun only where there's room for it (the
 * avatar, favicon.svg). The same geometry, at 224 across, is in public/favicon.svg.
 */
export function Mark({ className = '', sun = false }: { className?: string; sun?: boolean }) {
  return (
    <svg
      viewBox="0 -2 153 124"
      aria-hidden="true"
      className={`fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {sun && <circle cx="30" cy="9" r="17" className="fill-highlight" />}
      <rect x="0" y="46" width="23" height="76" />
      <rect x="23" y="28" width="41" height="33" />
      <rect x="64" y="46" width="22" height="76" />
      <rect x="86" y="5" width="41" height="33" />
      <polygon points="127,0 153,118 127,122" />
      <g className="fill-cap">
        <rect x="0" y="46" width="23" height="8" />
        <rect x="23" y="28" width="41" height="8" />
        <rect x="64" y="46" width="22" height="8" />
        <rect x="86" y="5" width="41" height="8" />
        <polygon points="127,0 132,0 153,118 151,118" />
      </g>
    </svg>
  );
}

/** The wordmark: the mark, then the name in the display serif with a green full stop. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Mark className="h-[0.8em] w-auto text-ink" />
      <span>
        montymi<span className="text-accent">.</span>
      </span>
    </span>
  );
}
