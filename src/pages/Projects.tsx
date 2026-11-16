import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { Connections } from '@/components/Connections';
import { ProjectDetails, ProjectStatus } from '@/components/ProjectDetails';
import { Kicker, Meta, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { projectBySlug, projectCategory, projects, projectVersion } from '@/content';

import NotFound from './NotFound';

const KINDS = [
  { id: 'all', label: 'All' },
  { id: 'album', label: 'Albums' },
  { id: 'episode', label: 'Episodes' },
  { id: 'single', label: 'Singles' },
] as const;

type Kind = (typeof KINDS)[number]['id'];

export function Projects() {
  const [params, setParams] = useSearchParams();
  const exploration = params.get('explore') ?? '';
  const [kind, setKind] = useState<Kind>('all');
  const shown = projects.filter((p) => kind === 'all' || p.kind === kind);
  return (
    <div className="flex flex-col gap-8">
      <Meta
        title="Projects"
        description="Michael Montanaro's projects, from experiments to released apps."
      />
      <PageHeader title="Projects">
        Projects grow from experiments into released apps. Albums are the big ones, episodes are
        tools, and singles are small pieces.
      </PageHeader>

      <Connections
        key={exploration}
        queryText={exploration}
        onClear={() => {
          const next = new URLSearchParams(params);
          next.delete('explore');
          setParams(next, { replace: true });
        }}
      />

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
                  {projectCategory(project)} · {projectVersion(project)} · updated{' '}
                  {formatDate(project.updated, 'long')}
                </Kicker>
                <ProjectStatus
                  status={project.status}
                  label={
                    project.role === 'library' && project.status === 'published'
                      ? 'In use'
                      : undefined
                  }
                />
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

export function ProjectPage() {
  const { slug = '' } = useParams();
  const project = projectBySlug(slug);
  if (!project) return <NotFound />;
  return (
    <article className="flex flex-col gap-8">
      <Meta title={project.title} description={project.description} />
      <PageHeader
        kicker={`${projectCategory(project)} · ${projectVersion(project)}`}
        title={project.title}
      >
        {project.description}
      </PageHeader>

      <ProjectDetails project={project} />

      <Link to="/projects" className="link self-start text-sm">
        All projects
      </Link>
    </article>
  );
}
