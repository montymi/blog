import type { Check, Role } from '@/platform/contract';

// Written out in full: Tailwind keeps only class names it finds literally in the source.
const ROLE_CLASS: Record<Role, string> = {
  verb: 'role-verb',
  keyword: 'role-keyword',
  number: 'role-number',
  value: 'role-value',
  operator: 'role-operator',
};

/**
 * A sentence in any app's language, set in montymi's one alphabet: each word styled by its role,
 * the spaces as typed, and everything from where the app stopped reading in the red pen.
 */
export function Sentence({ text, check }: { text: string; check?: Check | null }) {
  const tokens = check?.tokens ?? [];
  const stop = check && !check.ok ? Math.min(check.at ?? 0, text.length) : text.length;
  const parts: JSX.Element[] = [];
  let at = 0;
  for (const [i, token] of tokens.entries()) {
    if (
      token.at < at ||
      token.at + token.text.length > stop ||
      text.slice(token.at, token.at + token.text.length) !== token.text
    )
      continue;
    if (token.at > at) parts.push(<span key={`g${i}`}>{text.slice(at, token.at)}</span>);
    parts.push(
      <span key={i} className={token.role ? ROLE_CLASS[token.role] : undefined}>
        {token.text}
      </span>,
    );
    at = token.at + token.text.length;
  }
  if (at < stop) parts.push(<span key="rest">{text.slice(at, stop)}</span>);
  return (
    <span className="sentence break-words">
      {parts}
      {stop < text.length || (check && !check.ok) ? (
        <mark className="unread">{text.slice(stop) || ' '}</mark>
      ) : null}
    </span>
  );
}
