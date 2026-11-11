import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Command } from '@/components/Command';
import { Latest } from '@/components/Latest';
import { Shelf } from '@/components/Shelf';
import { Sky } from '@/components/Sky';
import { Switchboard } from '@/components/Switchboard';
import { Meta } from '@/components/ui';
import { site } from '@/config';
import { papers, posts, projects } from '@/content';

function Part({ title, more, children }: { title: string; more?: ReactNode; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[1.75rem] font-medium leading-[2.125rem]">{title}</h2>
        {more}
      </div>
      {children}
    </section>
  );
}

/** A band the full width of the window, its content kept to the page's column. */
function Band({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={`mx-[calc(50%-50vw)] ${className}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">{children}</div>
    </div>
  );
}

// The front page performs its one line: you write a sentence, an app explains how it read it,
// under a sun that keeps the visitor's own time. Then the apps, the writing, and everything made
// on sixty-four squares, by theme.
function Home() {
  return (
    <div className="-my-10 flex flex-col gap-16 sm:-my-14">
      <Meta />
      <Band className="border-b border-line bg-raised">
        <header className="grid gap-8 pt-12 md:grid-cols-[1fr_15rem] md:gap-10 md:pt-14">
          <div className="flex min-w-0 flex-col gap-8 pb-12 md:pb-14">
            <div className="flex flex-col gap-4">
              <h1 className="font-display text-[2.5rem] font-medium leading-[2.625rem] tracking-[-0.015em] sm:text-[3.25rem] sm:leading-[3.375rem]">
                {site.line}
              </h1>
              <p className="max-w-[28rem] text-[1.0625rem] text-muted">
                Every request takes a unique shape. I build apps that adapt to yours and show you
                what they found. Try one below.
              </p>
            </div>
            <Command />
          </div>
          <Sky className="-mt-8 w-40 justify-self-end self-end md:mt-0 md:w-full" />
        </header>
      </Band>

      <Part title="Built" more={<p className="kicker">Live status, checked every minute</p>}>
        <Switchboard />
      </Part>

      <Part
        title="Written"
        more={
          <Link to="/writing" className="link text-sm">
            All {posts.length} posts →
          </Link>
        }
      >
        <Latest posts={posts.slice(0, 3)} />
      </Part>

      <Band className="border-t border-line bg-inset py-14">
        <section aria-label="The board">
          <Shelf
            more={
              <>
                <Link to="/projects" className="link">
                  All {projects.length} projects →
                </Link>
                <Link to="/papers" className="link">
                  {papers.length} papers →
                </Link>
              </>
            }
          />
        </section>
      </Band>
    </div>
  );
}

export default Home;
