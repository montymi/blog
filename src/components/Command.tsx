import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { searchIndex } from '@/content/search';
import { ASK_EVENT } from '@/lib/ask';
import { answer, examples, type Destination } from '@/lib/command';
import { fill, permalink, type Check, type Manifest } from '@/platform/contract';
import { SNAPSHOTS } from '@/platform/registry';
import { useCheck } from '@/platform/useCheck';

import { Sentence } from './Sentence';

interface Option {
  label: string;
  kind: string;
  detail?: string;
  run: () => void;
}

/** How an app read a sentence: the sentence in the one alphabet, then what it understood. */
export function Reading({
  app,
  query,
  check,
  pending,
}: {
  app: Manifest;
  query: string;
  check: Check | null;
  pending: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 border-l-2 border-line py-1 pl-4" aria-live="polite">
      <p className="text-sm text-muted">
        {pending
          ? `Asking ${app.name}…`
          : check === null
            ? `${app.name} didn’t answer, so this is unchecked. It can still be sent.`
            : check.ok
              ? `${app.name} understood:`
              : `${app.name} stopped reading here:`}
      </p>
      <p className="text-lg leading-8">
        <Sentence text={query} check={pending ? null : check} />
      </p>
      {check?.ok && check.canonical && check.canonical !== query && (
        <p className="text-sm text-muted">
          In its own words: <span className="font-mono text-ink">{check.canonical}</span>
        </p>
      )}
      {check && !check.ok && <p className="text-sm text-bad">{check.message}</p>}
    </div>
  );
}

/**
 * One line that either hands a sentence to the app whose language it is, or finds something on
 * the site. A combobox to assistive technology: type, arrow keys to move, Enter to open.
 */
export function Command({
  autoFocus = false,
  size = 'large',
  onDone,
}: {
  autoFocus?: boolean;
  size?: 'large' | 'compact';
  onDone?: () => void;
}) {
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const id = useId();

  const result = useMemo(() => answer(text, searchIndex, SNAPSHOTS), [text]);
  const asking = result.type === 'ask' ? result : null;
  const { check, pending } = useCheck(asking?.app ?? null, asking?.query ?? '');
  useEffect(() => {
    setActive(0);
    setCopied(false);
  }, [text]);
  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);
  // An example offered elsewhere on the page (an app's card) can be put on this line.
  useEffect(() => {
    if (size !== 'large') return;
    function onAsk(event: Event) {
      setText((event as CustomEvent<string>).detail);
      input.current?.focus();
    }
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, [size]);

  function go(to: Destination) {
    onDone?.();
    if (to.away) window.location.assign(to.href);
    else navigate(to.href);
  }

  // A sentence the app refused stays here to be fixed: nothing to open until it reads.
  const options: Option[] = asking
    ? check && !check.ok
      ? []
      : [
          {
            label: `Open in ${asking.app.name}`,
            kind: 'App',
            detail: asking.app.url.replace('https://', ''),
            run: () =>
              go({
                label: '',
                kind: '',
                href: fill(asking.app.language!.open, asking.query),
                away: true,
              }),
          },
          {
            label: copied ? 'Link copied' : 'Copy a link to this sentence',
            kind: 'Link',
            detail: `montymi.com${decodeURIComponent(permalink(asking.query))}`,
            run: () => {
              const url = `${window.location.origin}${permalink(asking.query)}`;
              navigator.clipboard?.writeText(url).then(
                () => setCopied(true),
                () => go({ label: '', kind: '', href: permalink(asking.query) }),
              );
            },
          },
        ]
    : result.type === 'results'
      ? result.results.map((to) => ({
          label: to.label,
          kind: to.kind,
          detail: to.detail,
          run: () => go(to),
        }))
      : [];

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && options.length) {
      event.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (event.key === 'ArrowUp' && options.length) {
      event.preventDefault();
      setActive((i) => (i - 1 + options.length) % options.length);
    } else if (event.key === 'Enter' && options[active]) {
      event.preventDefault();
      options[active].run();
    }
  }

  const large = size === 'large';
  return (
    <div className="flex flex-col gap-3">
      {large && (
        <label htmlFor={`${id}-input`} className="kicker">
          Ask an app, or search
        </label>
      )}
      <div
        className={
          large
            ? 'flex items-center gap-3 rounded border border-line-strong bg-surface py-1 pl-3 pr-1 focus-within:border-accent'
            : 'flex items-center gap-3 border-b-2 border-ink/80 pb-1 focus-within:border-accent'
        }
      >
        <span
          aria-hidden="true"
          className={`font-mono text-lg ${large ? 'text-muted' : 'text-accent'}`}
        >
          ›
        </span>
        <input
          ref={input}
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-label="Ask an app, or search the site"
          aria-expanded={options.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={options.length ? `${id}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={(large && examples(SNAPSHOTS)[0]) || 'Ask an app, or search'}
          className="min-h-11 w-full min-w-0 bg-transparent font-mono text-ink outline-none placeholder:text-muted/70"
        />
        {large && (
          <button
            type="button"
            onClick={() => (options[active] ? options[active].run() : input.current?.focus())}
            className="btn-primary min-h-9 shrink-0 px-3 py-1"
          >
            Ask
          </button>
        )}
      </div>

      {result.type === 'empty' && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>Try</span>
          {examples(SNAPSHOTS).map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setText(example);
                input.current?.focus();
              }}
              className="focus-ring min-h-9 rounded-sm border border-line bg-inset px-2 font-mono text-[0.8125rem] text-ink hover:border-line-strong"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {asking && <Reading app={asking.app} query={asking.query} check={check} pending={pending} />}

      {result.type === 'results' && options.length === 0 && (
        <p role="status" className="text-sm text-muted">
          Nothing here matches “{text.trim()}”. An app’s request starts with its word, like{' '}
          {SNAPSHOTS.flatMap((app) => app.language?.verbs.slice(0, 1) ?? []).map((verb, i, all) => (
            <span key={verb}>
              <span className="font-mono text-ink">{verb}</span>
              {i < all.length - 2 ? ', ' : i === all.length - 2 ? ' or ' : ''}
            </span>
          ))}
          .
        </p>
      )}

      <ul id={`${id}-list`} role="listbox" aria-label="Results" className="flex flex-col">
        {options.map((option, index) => (
          <li
            key={option.label}
            id={`${id}-${index}`}
            role="option"
            aria-selected={index === active}
            onMouseEnter={() => setActive(index)}
            onMouseDown={(event) => {
              event.preventDefault();
              option.run();
            }}
            className={`flex min-h-11 cursor-pointer items-baseline gap-4 border-l-2 px-3 py-2 ${
              index === active ? 'border-accent bg-inset' : 'border-transparent'
            }`}
          >
            <span className="w-14 shrink-0 font-mono text-xs text-muted">{option.kind}</span>
            <span className="flex min-w-0 flex-col">
              <span className={`font-semibold ${index === active ? 'text-accent' : ''}`}>
                {option.label}
              </span>
              {option.detail && (
                <span className="truncate text-sm text-muted">{option.detail}</span>
              )}
            </span>
            {index === active && (
              <span aria-hidden="true" className="ml-auto shrink-0 font-mono text-xs text-muted">
                enter
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The command line from anywhere: press / or Ctrl/⌘ K, or the header's button. A modal
 * dialog, closed with Escape or a click outside.
 */
export function CommandDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => event.target === dialog.current && onClose()}
      aria-label="Command line"
      className="mt-[12vh] w-[min(40rem,calc(100vw-2rem))] rounded border border-line bg-raised p-0 text-ink shadow-[0_12px_28px_-12px_rgba(0,0,0,0.35)] backdrop:bg-surface/80"
    >
      <div className="p-5">{open && <Command autoFocus size="compact" onDone={onClose} />}</div>
    </dialog>
  );
}
