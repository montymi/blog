import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import type { Project } from '@/content';
import { formatDate } from '@/lib/dates';
import {
  CELL,
  DEPTH,
  FOOT,
  ROWS,
  ROW_DEPTH,
  ROW_LABEL,
  WIDTH,
  keptFor,
  place,
  type Placed,
} from '@/lib/skyline';

/**
 * Every project as a block standing on the notebook's graph paper. Left to right is when it was
 * released; the back row is albums, then episodes, then singles; the height is how long it was
 * kept (first release to last update). Drawn with CSS 3D: a tilted plane and six-sided boxes.
 */

function Block({
  placed,
  risen,
  order,
  active,
  onActive,
}: {
  placed: Placed;
  risen: boolean;
  order: number;
  active: boolean;
  onActive: (slug: string | null) => void;
}) {
  const { project, x, y } = placed;
  const height = risen ? placed.height : 1;
  const tone = {
    published: 'border-line-strong',
    draft: 'border-dashed border-line-strong',
    archived: 'border-line opacity-60',
  }[project.status];
  const face = `absolute border ${tone} motion-safe:transition-[transform,width,height,background-color] motion-safe:duration-700 motion-safe:ease-out`;
  const delay = { transitionDelay: risen ? `${order * 70}ms` : '0ms' };
  return (
    <Link
      to={`/projects/${project.slug}`}
      aria-label={`${project.title}: ${project.kind}, ${keptFor(project)}, ${project.status}`}
      onMouseEnter={() => onActive(project.slug)}
      onMouseLeave={() => onActive(null)}
      onFocus={() => onActive(project.slug)}
      onBlur={() => onActive(null)}
      className="absolute outline-none [transform-style:preserve-3d]"
      style={{ left: x, top: y, width: FOOT, height: FOOT }}
    >
      {/* the shadow it casts on the paper */}
      <span aria-hidden="true" className="absolute inset-0 bg-ink/10" />
      {/* top */}
      <span
        aria-hidden="true"
        className={`${face} inset-0 ${active ? 'bg-accent' : 'bg-face-top'}`}
        style={{ transform: `translateZ(${height}px)`, ...delay }}
      />
      {/* the face toward the front-left: along the time axis */}
      <span
        aria-hidden="true"
        className={`${face} left-0 top-full origin-top ${
          active ? 'bg-accent brightness-75' : 'bg-face-left'
        }`}
        style={{ width: FOOT, height, transform: 'rotateX(90deg)', ...delay }}
      />
      {/* the face toward the front-right */}
      <span
        aria-hidden="true"
        className={`${face} left-full top-0 origin-left ${
          active ? 'bg-accent brightness-90' : 'bg-face-right'
        }`}
        style={{ width: height, height: FOOT, transform: 'rotateY(-90deg)', ...delay }}
      />
    </Link>
  );
}

// The scene's size at scale 1: wide enough for the tilted plane and its row labels.
const SCENE = 780;
const HEIGHT = 440;

export function Skyline({ projects }: { projects: Project[] }) {
  const { blocks, years } = useMemo(() => place(projects), [projects]);
  const [risen, setRisen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  // The drawn scene, labels included, is about SCENE px wide at full size: scale it to fit.
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const node = frame.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / SCENE)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRisen(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const order = [...blocks].sort((a, b) => a.x - b.x);
  const shown = blocks.find((b) => b.project.slug === active)?.project;

  return (
    <figure className="flex flex-col gap-3">
      <div
        ref={frame}
        style={{ height: `${Math.round(HEIGHT * scale)}px` }}
        className="relative overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
          style={{
            width: WIDTH,
            height: DEPTH,
            transform: `translate(-54%, -40%) scale(${scale}) rotateX(56deg) rotateZ(40deg)`,
          }}
        >
          <div className="graph-paper absolute -inset-6 border border-line" aria-hidden="true" />
          {ROWS.map((kind, row) => (
            <span
              key={kind}
              aria-hidden="true"
              className="absolute left-full ml-8 whitespace-nowrap font-mono text-xs text-muted"
              style={{ top: row * ROW_DEPTH + CELL * 1.5 }}
            >
              {ROW_LABEL[kind]}
            </span>
          ))}
          {years.map(({ year, x }) => (
            <span
              key={year}
              aria-hidden="true"
              className="absolute"
              style={{ left: x, top: -CELL / 2, height: DEPTH + CELL }}
            >
              <span className="absolute inset-y-0 border-l border-dashed border-line-strong/70" />
              <span className="absolute top-full mt-2 -translate-x-1/2 font-mono text-xs text-muted">
                {year}
              </span>
            </span>
          ))}
          {blocks.map((placed) => (
            <Block
              key={placed.project.slug}
              placed={placed}
              risen={risen}
              order={order.indexOf(placed)}
              active={active === placed.project.slug}
              onActive={setActive}
            />
          ))}
        </div>
      </div>
      <figcaption aria-live="polite" className="min-h-12 text-sm text-muted">
        {shown ? (
          <>
            <span className="font-semibold text-ink">{shown.title}</span>, {shown.kind} v
            {shown.version}
            {shown.released === 'TBD' ? ', ' : `, released ${formatDate(shown.released)}, `}
            {keptFor(shown)}, {shown.status}.
          </>
        ) : (
          <>
            Each block is a project. Left to right is when it was released, and the taller it
            stands, the longer I kept working on it. Point at one to read it, or open it.
          </>
        )}
      </figcaption>
    </figure>
  );
}
