import { useEffect, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';

import { site } from '@/config';
import { formatDate } from '@/lib/dates';
import type { Shipped } from '@/lib/shipped';

/** The page's title and description, for the tab, search and link previews. */
export function Meta({
  title,
  description = site.description,
}: {
  title?: string;
  description?: string;
}) {
  const full = title ? `${title} · ${site.name}` : `${site.name} · ${site.owner}`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}

export function Kicker({
  children,
  as: Tag = 'p',
}: {
  children: ReactNode;
  as?: 'p' | 'span' | 'h2';
}) {
  return <Tag className="kicker">{children}</Tag>;
}

/** A screen's kicker, title in the display serif, and an optional line under it. */
export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      {kicker && <Kicker>{kicker}</Kicker>}
      <h1 className="screen-title">{title}</h1>
      {children && <div className="max-w-prose text-[1.0625rem] text-muted">{children}</div>}
    </header>
  );
}

export function Markdown({ children, base }: { children: string; base?: string }) {
  // Relative links and images in a README point into its repository, not this site.
  const transform = (url: string) =>
    base && !/^([a-z]+:|#|\/)/i.test(url) ? new URL(url, base).toString() : url;
  return (
    <div className="prose">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} urlTransform={transform}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

/** A titled group of doors. */
export function Doors({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <Kicker as="h2">{title}</Kicker>
        {action}
      </div>
      {/* An odd door out takes the full row rather than sitting alone beside a gap. */}
      <ul className="grid gap-4 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
        {children}
      </ul>
    </section>
  );
}

/** One whole-card link, to a page here or a site elsewhere. */
export function Door({
  to,
  href,
  kicker,
  name,
  children,
}: {
  to?: string;
  href?: string;
  kicker?: ReactNode;
  name: string;
  children?: ReactNode;
}) {
  const inside = (
    <>
      {kicker && <Kicker as="span">{kicker}</Kicker>}
      <span className="door-name text-[1.3125rem] font-semibold leading-7">{name}</span>
      {children && <span className="text-sm text-muted">{children}</span>}
    </>
  );
  return (
    <li>
      {to ? (
        <Link to={to} className="door">
          {inside}
        </Link>
      ) : (
        <a href={href} className="door">
          {inside}
        </a>
      )}
    </li>
  );
}

/** The newest public commit, from the cached `/api/shipped`. Renders nothing until it knows. */
export function LastShipped() {
  const [shipped, setShipped] = useState<Shipped | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/shipped', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setShipped(data?.shipped ?? null))
      .catch(() => {
        // A margin note: the page reads the same without it.
      });
    return () => controller.abort();
  }, []);
  if (!shipped) return null;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Kicker>Last shipped</Kicker>
      <a
        href={shipped.url}
        className="focus-ring break-words rounded-sm font-mono text-sm text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent"
      >
        {shipped.summary}
      </a>
      <p className="text-sm text-muted">
        {shipped.repo} · {formatDate(shipped.at.slice(0, 10), 'short')}
      </p>
    </div>
  );
}
