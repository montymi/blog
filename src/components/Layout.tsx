import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { contact, site } from '@/config';

import { CommandDialog } from './Command';
import { LastShipped } from './ui';

const SECTIONS = [
  { to: '/writing', label: 'Writing' },
  { to: '/projects', label: 'Projects' },
  { to: '/papers', label: 'Papers' },
  { to: '/about', label: 'About' },
];

/** Every page: the name and four sections on top, contact and the last commit below. */
function Layout() {
  const { pathname } = useLocation();
  // A new page starts at its top, the way a link to another site would.
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  // The command line from anywhere: / or Ctrl/⌘ K, unless someone is typing.
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const typing = (event.target as HTMLElement).closest('input, textarea, [contenteditable]');
      if (
        (event.key === '/' && !typing) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();
        setAsking(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="btn-primary sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 sm:px-6">
          <Link
            to="/"
            className="focus-ring flex min-h-11 items-center rounded-sm font-display text-2xl font-medium tracking-[-0.01em] text-ink"
          >
            {site.name}
          </Link>
          <nav aria-label="Sections" className="flex items-center gap-2">
            <ul className="-mx-2 flex flex-wrap">
              {SECTIONS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `focus-ring flex min-h-11 items-center rounded-sm px-2 text-sm underline-offset-[6px] ${
                        isActive
                          ? 'font-semibold text-accent underline decoration-2'
                          : 'text-muted hover:text-ink'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAsking(true)}
              aria-label="Search or type a request"
              aria-keyshortcuts="/ Control+K Meta+K"
              className="focus-ring flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm text-muted hover:text-ink"
            >
              <span aria-hidden="true" className="font-mono text-accent">
                ›
              </span>
              <span>Ask</span>
              <kbd className="hidden rounded-sm border border-line-strong px-1.5 font-mono text-xs sm:inline">
                /
              </kbd>
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-3xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className="kicker">Say hello</p>
            <p className="select-all font-mono text-sm">{contact.email}</p>
            <ul className="-mx-2 flex flex-wrap">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="link mx-2 inline-flex min-h-11 items-center"
                >
                  Email
                </a>
              </li>
              {contact.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link mx-2 inline-flex min-h-11 items-center">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <LastShipped />
        </div>
      </footer>
      <CommandDialog open={asking} onClose={() => setAsking(false)} />
    </div>
  );
}

export default Layout;
