import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Skyline } from '@/components/Skyline';
import { ProjectDetails, ProjectStatus } from '@/components/ProjectDetails';
import { Kicker, Meta, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { projectBySlug, projects, projectVersion } from '@/content';

import NotFound from './NotFound';

const KINDS = [
  { id: 'all', label: 'All' },
  { id: 'album', label: 'Albums' },
  { id: 'episode', label: 'Episodes' },
  { id: 'single', label: 'Singles' },
] as const;

type Kind = (typeof KINDS)[number]['id'];

export function Projects() {
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
                  {project.kind} · {projectVersion(project)} · updated{' '}
                  {formatDate(project.updated, 'long')}
                </Kicker>
                <ProjectStatus status={project.status} />
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
      <PageHeader kicker={`${project.kind} · ${projectVersion(project)}`} title={project.title}>
        {project.description}
      </PageHeader>

      <ProjectDetails project={project} />

      <Link to="/projects" className="link self-start text-sm">
        All projects
      </Link>
    </article>
  );
}
