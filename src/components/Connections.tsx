import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { graphEdges, graphNode, graphNodes, graphQuery, neighborhood } from '@/content/graph';
import { graphLayout } from '@/lib/graph-layout';
import type { SceneState } from '@/lib/graph-scene';

const positions = graphLayout(graphNodes, graphEdges);
const words = { project: 'Project', post: 'Writing', paper: 'Report' };

/** Native buttons provide labels and keyboard access even without a WebGL context. */
function GraphStage({
  selected,
  focus,
  onHover,
  onOpen,
}: {
  selected: string | null;
  focus: Set<string> | null;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, HTMLButtonElement>());
  const controller = useRef<{ update: (state: SceneState) => void; dispose: () => void } | null>(
    null,
  );
  const latest = useRef({ selected, focus });
  latest.current = { selected, focus };
  const callbacks = useRef({ onHover, onOpen });
  callbacks.current = { onHover, onOpen };
  const [three, setThree] = useState(false);
  useEffect(() => {
    let disposed = false;
    if (!window.WebGLRenderingContext || !host.current) return;
    void import('@/lib/graph-scene')
      .then(({ createGraphScene }) => {
        if (disposed || !host.current) return;
        try {
          controller.current = createGraphScene(
            host.current,
            labels.current,
            graphNodes,
            graphEdges,
            positions,
            (id) => callbacks.current.onHover(id),
            (id) => callbacks.current.onOpen(id),
          );
          controller.current.update(latest.current);
          setThree(true);
        } catch {
          /* The flat map underneath retains every label and interaction. */
        }
      })
      .catch(() => {
        /* Offline or no graphics context: keep the map usable. */
      });
    return () => {
      disposed = true;
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);
  useEffect(() => {
    controller.current?.update({ selected, focus });
  }, [selected, focus]);
  return (
    <div
      ref={host}
      data-renderer={three ? 'three' : 'flat'}
      role="group"
      aria-label="Work connections map"
      className="connections-map relative h-[540px] overflow-hidden rounded border border-line bg-raised sm:h-[500px]"
    >
      {!three && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          {graphEdges.map((edge, i) => {
            const a = positions.get(edge.from)!,
              b = positions.get(edge.to)!;
            return (
              <line
                key={i}
                x1={50 + a.x * 37.5}
                y1={50 - a.y * 35}
                x2={50 + b.x * 37.5}
                y2={50 - b.y * 35}
                stroke="currentColor"
                strokeWidth=".13"
                className="text-line-strong"
                opacity={!focus || (focus.has(edge.from) && focus.has(edge.to)) ? 0.65 : 0.1}
              />
            );
          })}
        </svg>
      )}
      {graphNodes.map((node) => {
        const p = positions.get(node.id)!;
        const active = !focus || focus.has(node.id);
        return (
          <button
            key={node.id}
            ref={(element) => {
              if (element) labels.current.set(node.id, element);
              else labels.current.delete(node.id);
            }}
            type="button"
            aria-label={`${node.title}, ${words[node.kind]}`}
            aria-current={selected === node.id ? 'true' : undefined}
            onClick={() => onOpen(node.id)}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(node.id)}
            onBlur={() => onHover(null)}
            style={{ left: `${50 + p.x * 37.5}%`, top: `${50 - p.y * 35}%` }}
            className={`focus-ring absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
              three ? 'pointer-events-none focus-visible:ring-2 focus-visible:ring-accent' : ''
            } ${active ? 'opacity-100' : 'opacity-30 focus:opacity-100'}`}
          >
            <span className="sr-only">{node.title}</span>
            {!three && (
              <span
                aria-hidden="true"
                className="h-5 w-5 rounded-full shadow-md"
                style={{
                  background: `radial-gradient(circle at 30% 25%, rgb(var(--c-raised)), rgb(var(--c-${
                    node.kind === 'post'
                      ? 'bad'
                      : node.kind === 'paper'
                        ? 'highlight'
                        : node.released
                          ? 'accent'
                          : 'muted'
                  })) 55%, rgb(var(--c-ink)))`,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Connections({
  queryText = '',
  onClear,
}: {
  queryText?: string;
  onClear: () => void;
}) {
  const query = graphQuery(queryText);
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  function openNode(id: string) {
    const target = graphNode(id);
    if (!target) return;
    if (target.away) window.location.assign(target.href);
    else navigate(target.href);
  }
  const selected = picked ?? query?.from ?? null;
  const node = selected ? graphNode(selected) : undefined;

  const focus = picked
    ? new Set(neighborhood(picked))
    : query && query.mode !== 'all'
      ? new Set(query.ids)
      : null;
  const selectedEdges = selected
    ? graphEdges.filter((e) => e.from === selected || e.to === selected)
    : [];
  const neighbors = [...new Set(selectedEdges.map((e) => (e.from === selected ? e.to : e.from)))];
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (queryText) stage.current?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
  }, [queryText]);
  return (
    <section
      id="connections"
      ref={stage}
      aria-labelledby="connections-title"
      className="flex scroll-mt-6 flex-col gap-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="kicker">Explore the connections</p>
          <h2 id="connections-title" className="font-display text-3xl">
            How the work fits together.
          </h2>
        </div>
        <button
          type="button"
          className="btn-secondary min-h-9 px-3 py-1 text-xs"
          onClick={() => {
            setPicked(null);
            onClear();
          }}
        >
          Show all connections
        </button>
      </div>
      <p className="max-w-prose text-sm text-muted">
        Hover or focus a sphere to identify it. Select it to open its project, article, or report.
      </p>
      {queryText && !picked && (
        <p role="status" className="rounded border border-line bg-inset px-4 py-3 text-sm">
          {query
            ? query.mode === 'path' && query.ids.length === 0
              ? 'No documented connection joins these items yet.'
              : `${query.description} · ${query.ids.length} items highlighted.`
            : 'That connection request was not understood. Try “show everything related to chess”.'}
        </p>
      )}
      <GraphStage
        selected={hovered ?? selected}
        focus={focus}
        onHover={setHovered}
        onOpen={openNode}
      />
      <p role="status" className="min-h-6 text-sm text-muted" aria-live="polite">
        {hovered
          ? `${graphNode(hovered)!.title} · ${words[graphNode(hovered)!.kind]}`
          : node
            ? `${node.title} · ${words[node.kind]}`
            : 'Choose a sphere, or ask for a connection using the search field.'}
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-label="Map key">
        <span className="text-accent">● Released project</span>
        <span>● Project</span>
        <span className="text-bad">● Writing</span>
        <span>
          <span aria-hidden="true" style={{ color: 'rgb(var(--c-highlight))' }}>
            ●
          </span>{' '}
          Report
        </span>
      </div>
      {node ? (
        <div className="grid min-w-0 gap-8 border-t border-line pt-6 sm:grid-cols-2">
          <div role="region" aria-label={`${node.title} map details`} className="min-w-0">
            <div className="flex flex-col items-start gap-3">
              <p className="kicker">{words[node.kind]}</p>
              <h3 className="font-display text-3xl">{node.title}</h3>
              <p className="text-sm text-muted">{node.about}</p>
              {node.away ? (
                <a href={node.href} className="btn-primary">
                  {node.kind === 'paper' ? 'Read the report' : 'Read the article'} →
                </a>
              ) : (
                <Link to={node.href} className="btn-primary">
                  {node.kind === 'project' ? 'Open the project' : 'Read the article'} →
                </Link>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <h3 className="kicker">Connected work</h3>
            {neighbors.length === 0 ? (
              <p className="text-sm text-muted">
                No connections have been documented for this item yet.
              </p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {neighbors.map((id) => {
                  const neighbor = graphNode(id)!;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className="focus-ring flex w-full flex-col gap-2 py-3 text-left"
                        onClick={() => setPicked(id)}
                      >
                        <span className="font-semibold text-accent">{neighbor.title} →</span>
                        {selectedEdges
                          .filter((edge) => edge.from === id || edge.to === id)
                          .map((edge) => (
                            <span
                              key={`${edge.from}:${edge.to}:${edge.label}`}
                              className="text-xs leading-relaxed text-muted"
                            >
                              {graphNode(edge.from)!.label}{' '}
                              <strong className="font-medium text-ink">{edge.label}</strong>{' '}
                              {graphNode(edge.to)!.label}
                            </span>
                          ))}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {query?.mode === 'path' && !picked && query.ids.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="kicker">Connection path</p>
                <ol className="flex flex-col gap-1 text-sm">
                  {query.ids.map((id, i) => (
                    <li key={id}>
                      {i + 1}. {graphNode(id)!.title}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>Start with</span>
          {['project:mcp', 'project:chess', 'project:capstone'].map((id) => (
            <button
              type="button"
              key={id}
              className="btn-secondary min-h-9 px-3 py-1 text-xs"
              onClick={() => setPicked(id)}
            >
              {graphNode(id)!.title}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-muted">
        Connections describe shared themes and documented relationships.
      </p>
    </section>
  );
}
