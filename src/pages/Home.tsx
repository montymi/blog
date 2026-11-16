import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Command } from '@/components/Command';
import { Latest } from '@/components/Latest';
import { Shelf } from '@/components/Shelf';
import { Sky } from '@/components/Sky';
import { Switchboard } from '@/components/Switchboard';
import { Meta } from '@/components/ui';
import { site } from '@/config';
import { isFoundation, posts, projects, projectCategory, projectVersion } from '@/content';

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
                I build apps with shared identity, permissions, and query languages that people and
                agents can use. Shared libraries, templates, and documentation make those
                foundations reusable.
              </p>
            </div>
            <Command />
          </div>
          <Sky className="-mt-8 w-40 justify-self-end self-end md:mt-0 md:w-full" />
        </header>
      </Band>

      <Part title="Built" more={<p className="kicker">Live status, checked every minute</p>}>
        <Switchboard />
        <section
          aria-labelledby="foundations-title"
          className="flex flex-col gap-4 border-t border-line pt-6"
        >
          <div className="flex flex-col gap-2">
            <p className="kicker">Built to be reused</p>
            <h3 id="foundations-title" className="font-display text-2xl">
              Shared foundations
            </h3>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.filter(isFoundation).map((project) => (
              <li key={project.slug}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="focus-ring flex h-full flex-col gap-2 rounded border border-line bg-raised p-4 hover:border-line-strong"
                >
                  <span className="kicker">
                    {projectCategory(project)} · {projectVersion(project)}
                  </span>
                  <span className="text-lg font-semibold">{project.title} →</span>
                  <span className="text-sm text-muted">{project.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
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
          <Shelf />
        </section>
      </Band>
    </div>
  );
}

export default Home;
