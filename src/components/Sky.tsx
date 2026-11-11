import { useEffect, useState } from 'react';

import { SCENE, hourOf, skyAt } from '@/lib/sky';

const EVERY = 30_000;

/** The visitor's local hour, read again every 30 seconds so the sun creeps with the clock. */
function useHour() {
  const [hour, setHour] = useState(() => hourOf(new Date()));
  useEffect(() => {
    const id = setInterval(() => setHour(hourOf(new Date())), EVERY);
    return () => clearInterval(id);
  }, []);
  return hour;
}

/**
 * The hero's scene: the mark grown into a skyline standing on the band's floor, with the sun
 * (or, overnight, the moon) where it is in the visitor's sky right now. Decorative.
 */
export function Sky({ className = '' }: { className?: string }) {
  const body = skyAt(useHour());
  // Orange at the horizon, gold overhead: the two tokens mixed by how high the sun stands.
  const fill = `color-mix(in srgb, rgb(var(--c-highlight)) ${Math.round(
    body.warmth * 100,
  )}%, rgb(var(--c-dawn)))`;
  return (
    <svg
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      aria-hidden="true"
      data-body={body.kind}
      className={`overflow-hidden ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="sky-crescent">
          <rect x="-30" y="-30" width="60" height="60" fill="white" />
          <circle cx="9" cy="-6" r="20" fill="black" />
        </mask>
      </defs>
      {/* Drawn first, so the buildings stand in front of it as it rises and sets. */}
      <g
        style={{ transform: `translate(${body.x}px, ${body.y}px)` }}
        className="motion-safe:transition-transform motion-safe:duration-[2s] motion-safe:ease-out"
      >
        {body.kind === 'sun' ? (
          <circle r="23" style={{ fill }} />
        ) : (
          <circle r="20" mask="url(#sky-crescent)" className="fill-ink/80" />
        )}
      </g>
      <g className="fill-ink">
        <rect x="0" y="120" width="32" height="175" />
        <rect x="32" y="87" width="65" height="65" />
        <rect x="97" y="120" width="33" height="175" />
        <rect x="130" y="54" width="65" height="66" />
        <polygon points="195,54 246,295 195,295" />
      </g>
      <g className="fill-cap">
        <rect x="0" y="120" width="32" height="8" />
        <rect x="32" y="87" width="65" height="8" />
        <rect x="97" y="120" width="33" height="8" />
        <rect x="130" y="54" width="65" height="8" />
        <polygon points="195,54 203,54 263,295 246,295" />
      </g>
    </svg>
  );
}
