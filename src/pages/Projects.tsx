import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Skyline } from '@/components/Skyline';
import { Kicker, Markdown, Meta, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { projectBySlug, projects, type Project } from '@/content';

import NotFound from './NotFound';

const KINDS = [
  { id: 'all', label: 'All' },
  { id: 'album', label: 'Albums' },
  { id: 'episode', label: 'Episodes' },
  { id: 'single', label: 'Singles' },
] as const;

type Kind = (typeof KINDS)[number]['id'];

/** Status as a word in a mono badge, never colour alone. */
function Status({ status }: { status: Project['status'] }) {
  const tone = {
    published: 'border-line-strong text-ink',
    draft: 'border-transparent bg-inset text-muted',
    archived: 'border-transparent text-muted line-through decoration-muted/60',
  }[status];
  return (
    <span
      className={`rounded-sm border px-2 py-0.5 font-mono text-xs uppercase tracking-[0.08em] ${tone}`}
    >
      {status}
    </span>
  );
}

export function Projects() {
  const [kind, setKind] = useState<Kind>('all');
  const shown = projects.filter((p) => kind === 'all' || p.kind === kind);
  return (
    <div className="flex flex-col gap-8">
      <Meta title="Projects" description="Michael Montanaro's projects, each kept as a release." />
      <PageHeader title="Projects">
        Each project is kept as a release. Albums are the big ones, episodes are tools, and singles
        are small pieces.
      </PageHeader>

      <Skyline projects={projects} />

      <div role="radiogroup" aria-label="Show" className="flex flex-wrap gap-2">
        {KINDS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={kind === option.id}
            onClick={() => setKind(option.id)}
            className={`focus-ring min-h-11 rounded border px-3 text-sm ${
              kind === option.id
                ? 'border-accent bg-accent font-semibold text-on-accent'
                : 'border-line-strong hover:bg-inset'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-line border-y border-line" aria-live="polite">
        {shown.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className="focus-ring group flex flex-col gap-2 py-5"
            >
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Kicker as="span">
                  {project.kind} · v{project.version} · updated{' '}
                  {formatDate(project.updated, 'long')}
                </Kicker>
                <Status status={project.status} />
              </span>
              <span className="text-[1.3125rem] font-semibold leading-7 group-hover:text-accent">
                {project.title}
              </span>
              <span className="max-w-prose text-sm text-muted">{project.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The project's README, fetched from GitHub only when someone opens it. */
function Readme({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  function load(open: boolean) {
    if (!open || text !== null || failed) return;
    fetch(url)
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then(setText)
      .catch(() => setFailed(true));
  }
  return (
    <details className="rounded border border-line" onToggle={(e) => load(e.currentTarget.open)}>
      <summary className="focus-ring flex min-h-11 cursor-pointer items-center px-4 font-semibold">
        README from GitHub
      </summary>
      <div className="border-t border-line p-4">
        {failed ? (
          <p className="text-sm text-bad">
            GitHub didn’t send the README.{' '}
            <a href={url} className="link">
              Open it on GitHub
            </a>
            .
          </p>
        ) : text === null ? (
          <p role="status" className="text-sm text-muted">
            Loading the README…
          </p>
        ) : (
          <Markdown base={url}>{text}</Markdown>
        )}
      </div>
    </details>
  );
}

export function ProjectPage() {
  const { slug = '' } = useParams();
  const project = projectBySlug(slug);
  if (!project) return <NotFound />;
  return (
    <article className="flex flex-col gap-8">
      <Meta title={project.title} description={project.description} />
      <PageHeader kicker={`${project.kind} · v${project.version}`} title={project.title}>
        {project.description}
      </PageHeader>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-4">
        {[
          ['Status', <Status key="s" status={project.status} />],
          [
            'Version',
            <span key="v" className="font-mono">
              {project.version}
            </span>,
          ],
          ['Released', formatDate(project.released)],
          ['Updated', formatDate(project.updated)],
        ].map(([label, value]) => (
          <div key={label as string} className="flex flex-col gap-1 bg-raised p-3">
            <dt className="kicker">{label}</dt>
            <dd className="text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      {(project.live || project.github) && (
        <div className="flex flex-wrap gap-3">
          {project.live && (
            <a href={project.live} className="btn-primary">
              Open {project.title}
            </a>
          )}
          {project.github && (
            <a href={project.github} className="btn-secondary">
              Code on GitHub
            </a>
          )}
        </div>
      )}

      {project.audio && (
        <section aria-label="Listen" className="flex flex-col gap-2">
          <Kicker as="h2">Listen</Kicker>
          <audio controls preload="none" src={project.audio} className="w-full">
            <a href={project.audio} className="link">
              Download the audio
            </a>
          </audio>
        </section>
      )}

      {project.transcript && (
        <section aria-label="How it was made" className="flex flex-col gap-3">
          <Kicker as="h2">How it was made</Kicker>
          <Markdown>{project.transcript}</Markdown>
        </section>
      )}

      {project.readme && <Readme url={project.readme} />}

      <Link to="/projects" className="link self-start text-sm">
        All projects
      </Link>
    </article>
  );
}
