import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Board } from '@/components/Board';
import { Command } from '@/components/Command';
import { MarginList } from '@/components/MarginList';
import { Switchboard } from '@/components/Switchboard';
import { Meta } from '@/components/ui';
import { site } from '@/config';
import { papers, posts, projects } from '@/content';

function Part({ title, more, children }: { title: string; more?: ReactNode; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[1.75rem] font-medium leading-[2.125rem]">{title}</h2>
        {more && <div className="text-sm">{more}</div>}
      </div>
      {children}
    </section>
  );
}

// The front page performs its one line: you write a sentence, an app explains how it read it.
// Beside it, everything made, on sixty-four squares. Then the contents, in the line's order.
function Home() {
  const current = projects.filter((p) => p.status !== 'archived').length;
  return (
    <div className="flex flex-col gap-16">
      <Meta />
      <header className="graph-paper -mx-4 grid gap-10 border-y border-line px-4 py-10 sm:mx-0 sm:rounded sm:border sm:px-10 sm:py-12 md:grid-cols-[1fr_auto] md:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-[2.5rem] font-medium leading-[2.625rem] tracking-[-0.015em] sm:text-[3.5rem] sm:leading-[3.5rem]">
              {site.line}
            </h1>
            <p className="max-w-[32rem] text-[1.0625rem]">
              I’m Michael Montanaro. Each app below speaks a small language of its own. Write a
              sentence in one, and the app shows you how it read it before you go.
            </p>
          </div>
          <Command />
        </div>
        <Board />
      </header>

      <Part title="Built">
        <Switchboard />
      </Part>

      <Part
        title="Written"
        more={
          <Link to="/writing" className="link">
            All {posts.length} posts
          </Link>
        }
      >
        <MarginList posts={posts.slice(0, 3)} />
      </Part>

      <Part title="Kept">
        <ul className="flex flex-col border-t border-ink/80">
          {[
            {
              to: '/projects',
              name: 'Projects',
              count: `${projects.length} releases, ${current} current`,
              about:
                'Each one kept as a release, standing on graph paper by when it shipped and how long I kept at it.',
            },
            {
              to: '/papers',
              name: 'Papers',
              count: `${papers.length} PDFs`,
              about: 'My résumé, the capstone report, and other papers.',
            },
          ].map((row) => (
            <li key={row.to} className="border-b border-line">
              <Link
                to={row.to}
                className="focus-ring group grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[9rem_1fr] sm:items-baseline"
              >
                <span className="font-mono text-xs text-muted">{row.count}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[1.3125rem] font-semibold leading-7 group-hover:text-accent">
                    {row.name}
                  </span>
                  <span className="text-sm text-muted">{row.about}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Part>
    </div>
  );
}

export default Home;
