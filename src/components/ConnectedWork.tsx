import { useId } from 'react';
import { Link } from 'react-router-dom';

import { connectionGroups, edgeSentence, graphNode, type ConnectionGroup } from '@/content/graph';
import { graphHref } from '@/lib/graph-query';

/** The same relationships used by search and the map, available where an item is being read. */
export function ConnectedWork({
  id,
  onSelectProject,
}: {
  id: string;
  onSelectProject?: (href: string) => void;
}) {
  const prefix = useId();
  const node = graphNode(id);
  const groups = connectionGroups(id);
  if (!node || groups.length === 0) return null;

  function entries(group: ConnectionGroup) {
    return (
      <ul className="divide-y divide-line border-y border-line">
        {group.items.map(({ node: other, edges }) => {
          const explanationId = `${prefix}-${other.id}`;
          const content = (
            <>
              <span className="font-semibold text-accent">{other.title} →</span>
              <span id={explanationId} className="flex flex-col gap-1">
                {edges.map((edge) => (
                  <span
                    key={`${edge.from}:${edge.to}:${edge.label}`}
                    className="text-xs leading-relaxed text-muted"
                  >
                    {edgeSentence(edge)}
                  </span>
                ))}
              </span>
              {other.kind === 'paper' && (
                <span className="text-xs text-muted">PDF · {other.about}</span>
              )}
            </>
          );
          const className = 'focus-ring flex min-h-11 flex-col items-start gap-1 py-3';
          return (
            <li key={other.id}>
              {other.away ? (
                <a
                  href={other.href}
                  aria-label={other.title}
                  aria-describedby={explanationId}
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <Link
                  to={other.href}
                  aria-label={other.title}
                  aria-describedby={explanationId}
                  className={className}
                  onClick={(event) => {
                    if (
                      other.kind === 'project' &&
                      onSelectProject &&
                      event.button === 0 &&
                      !event.metaKey &&
                      !event.ctrlKey &&
                      !event.shiftKey &&
                      !event.altKey
                    ) {
                      event.preventDefault();
                      onSelectProject(other.href);
                    }
                  }}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section
      aria-label={`Connections for ${node.title}`}
      className="flex min-w-0 flex-col gap-5 border-t border-line pt-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl">Follow the connections</h3>
        <Link to={graphHref(`show everything related to ${node.title}`)} className="link text-sm">
          View on map →
        </Link>
      </div>
      {groups.map((group) =>
        group.title === 'Shared subjects' ? (
          <details key={group.title} className="rounded border border-line px-3">
            <summary className="focus-ring min-h-11 cursor-pointer py-3 text-sm font-semibold">
              Shared subjects ({group.items.length})
            </summary>
            {entries(group)}
          </details>
        ) : (
          <section
            key={group.title}
            aria-label={group.title}
            className="flex min-w-0 flex-col gap-2"
          >
            <h4 className="kicker">{group.title}</h4>
            {entries(group)}
          </section>
        ),
      )}
    </section>
  );
}
