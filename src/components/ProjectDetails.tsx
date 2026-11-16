import { useState } from 'react';

import { papers, projectVersion, type Project } from '@/content';
import { formatDate } from '@/lib/dates';

import { Kicker, Markdown } from './ui';

/** Status as a word in a mono badge, never colour alone. */
export function ProjectStatus({ status }: { status: Project['status'] }) {
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

/** Load a public project README only when its disclosure opens. */
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
        {url.startsWith('https://raw.githubusercontent.com/')
          ? 'README from GitHub'
          : 'Project README'}
      </summary>
      <div className="border-t border-line p-4">
        {failed ? (
          <p className="text-sm text-bad">
            The README couldn’t be loaded.{' '}
            <a href={url} className="link">
              Open the README
            </a>
            .
          </p>
        ) : text === null ? (
          <p role="status" className="text-sm text-muted">
            Loading the README…
          </p>
        ) : (
          <Markdown base={new URL(url, window.location.origin).href}>{text}</Markdown>
        )}
      </div>
    </details>
  );
}

/** Shared by the full project page and the board's inline detail panel. */
export function ProjectDetails({
  project,
  embedded = false,
}: {
  project: Project;
  embedded?: boolean;
}) {
  const documents = papers.filter((paper) => paper.project === project.slug);
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {embedded && (
        <header className="flex flex-col gap-2">
          <Kicker>
            {project.kind} · {projectVersion(project)}
          </Kicker>
          <h3 className="font-display text-3xl leading-tight">{project.title}</h3>
          <p className="text-sm text-muted">{project.description}</p>
        </header>
      )}
      <dl
        className={`grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line ${
          embedded ? '' : 'sm:grid-cols-4'
        }`}
      >
        {[
          ['Status', <ProjectStatus key="s" status={project.status} />],
          [
            project.versionLabel ?? 'Version',
            <span key="v" className="font-mono">
              {project.version}
            </span>,
          ],
          [project.releaseLabel ?? 'Released', formatDate(project.released)],
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
              {project.sourcePrivate ? 'Code on GitHub (private)' : 'Code on GitHub'}
            </a>
          )}
        </div>
      )}

      {documents.length > 0 && (
        <section aria-label="Project documents" className="flex flex-col gap-3">
          <p className="kicker">Project documents</p>
          <ul className="flex flex-col gap-3">
            {documents.map((document) => (
              <li key={document.file}>
                <a href={document.file} className="link text-sm">
                  {document.title}
                </a>
                <span className="block text-xs text-muted">PDF · {document.pages} pages</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.audio && (
        <section aria-label="Listen" className="flex flex-col gap-2">
          <p className="kicker">Listen</p>
          <audio controls preload="none" src={project.audio} className="w-full">
            <a href={project.audio} className="link">
              Download the audio
            </a>
          </audio>
        </section>
      )}

      {project.transcript && (
        <section aria-label="How it was made" className="flex flex-col gap-3">
          <p className="kicker">How it was made</p>
          <Markdown>{project.transcript}</Markdown>
        </section>
      )}

      {project.readme && <Readme url={project.readme} />}
    </div>
  );
}
