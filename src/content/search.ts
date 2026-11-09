import type { Searchable } from '@/lib/command';
import { SNAPSHOTS } from '@/platform/registry';

import { activities, papers, posts, projects } from '.';

/** Everything the command line can find, in one list. */
export const searchIndex: Searchable[] = [
  ...SNAPSHOTS.map((app) => ({
    label: app.name,
    kind: 'App',
    href: app.url,
    away: true,
    detail: app.url.replace('https://', ''),
    text: `${app.about} ${app.language?.name ?? ''} ${app.id}`,
  })),
  ...SNAPSHOTS.flatMap((app) =>
    app.assistant?.connect
      ? [
          {
            label: `Use ${app.name} with Claude`,
            kind: 'App',
            href: app.assistant.connect,
            away: true,
            detail: app.assistant.connect.replace('https://', ''),
            text: 'claude assistant connect mcp',
          },
        ]
      : [],
  ),
  ...posts.map((post) => ({
    label: post.title,
    kind: 'Post',
    href: `/writing/${post.slug}`,
    detail: post.summary,
    text: `${post.summary} ${post.tags.join(' ')} ${post.body}`,
  })),
  ...projects.map((project) => ({
    label: project.title,
    kind: 'Project',
    href: `/projects/${project.slug}`,
    detail: `${project.kind}, v${project.version}`,
    text: `${project.description} ${project.kind} ${project.status}`,
  })),
  ...papers.map((paper) => ({
    label: paper.title,
    kind: 'PDF',
    href: paper.file,
    away: true,
    detail: `${paper.pages} ${paper.pages === 1 ? 'page' : 'pages'}`,
    text: 'paper document',
  })),
  {
    label: 'About Michael',
    kind: 'Page',
    href: '/about',
    detail: 'Bio, languages, and what fills my time',
    text: `bio resume languages ${activities.map((a) => a.title).join(' ')}`,
  },
];
