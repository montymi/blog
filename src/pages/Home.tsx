import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Board } from '@/components/Board';
import { Command } from '@/components/Command';
import { MarginList } from '@/components/MarginList';
import { Switchboard } from '@/components/Switchboard';
import { Themes } from '@/components/Themes';
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
// Beside it, everything made, on sixty-four squares. Then the apps, the writing, and everything
// grouped by what it's about.
function Home() {
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
              Michael Montanaro builds small apps that turn everyday questions into something
              useful: a week of meals into one grocery list, or a chess game into a clearer picture
              of what happened. Try a request below; each app shows how it read it before you open
              it.
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

      <Part
        title="By theme"
        more={
          <span className="flex gap-4">
            <Link to="/projects" className="link">
              All {projects.length} projects
            </Link>
            <Link to="/papers" className="link">
              {papers.length} papers
            </Link>
          </span>
        }
      >
        <Themes />
      </Part>
    </div>
  );
}

export default Home;
