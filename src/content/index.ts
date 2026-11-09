/**
 * Everything the site shows, read from /content when the site is built. Adding a post is
 * adding one markdown file; there is no index to keep in step.
 *
 *   content/writing/<slug>.md          a post: title, date, optional tags in frontmatter
 *   content/projects/<slug>/project.json   a project, with transcript.md beside it if any
 *   content/papers.json                PDFs served from public/library
 *   content/activities.json            what fills my time, for About
 */
import { parseFrontmatter } from '@/lib/frontmatter';

import activitiesJson from '../../content/activities.json';
import papersJson from '../../content/papers.json';

export interface Post {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  tags: string[];
  /** The first paragraph as plain text, for lists and the page description. */
  summary: string;
  minutes: number;
  body: string;
}

export type ProjectStatus = 'published' | 'draft' | 'archived';

export interface Project {
  slug: string;
  title: string;
  /** Michael's own release shapes: an album is a large project, an episode a tool, a single a small one. */
  kind: 'album' | 'episode' | 'single';
  version: string;
  status: ProjectStatus;
  description: string;
  released: string;
  updated: string;
  github?: string;
  readme?: string;
  live?: string;
  audio?: string;
  transcript?: string;
}

export interface Paper {
  title: string;
  file: string;
  pages: number;
}

export interface Activity {
  title: string;
  description: string;
}

const slugOf = (path: string) => path.split('/').at(-1)!.replace(/\.md$/, '');
const dirOf = (path: string) => path.split('/').at(-2)!;

/** Plain text of the first paragraph that isn't a heading, trimmed to about 160 characters. */
export function summarize(markdown: string): string {
  const paragraph =
    markdown
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !/^(#|<|!\[|---|\*[^*]+\*$)/.test(block)) ?? '';
  const text = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text;
}

/** Drops a leading `# Title` that repeats the post's title: the page already shows it. */
export function withoutTitle(body: string, title: string): string {
  const match = /^\s*#\s+(.+)\n/.exec(body);
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return match && clean(match[1]) === clean(title) ? body.slice(match[0].length) : body;
}

export function readPost(path: string, text: string): Post {
  const { data, body } = parseFrontmatter(text);
  const title = String(data.title ?? slugOf(path));
  const content = withoutTitle(body, title).trim();
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug: slugOf(path),
    title,
    date: String(data.date ?? ''),
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: summarize(content),
    minutes: Math.max(1, Math.round(words / 220)),
    body: content,
  };
}

const postFiles = import.meta.glob('../../content/writing/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const projectFiles = import.meta.glob('../../content/projects/*/project.json', {
  import: 'default',
  eager: true,
}) as Record<string, Omit<Project, 'slug' | 'transcript'>>;

const transcriptFiles = import.meta.glob('../../content/projects/*/transcript.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const transcripts = Object.fromEntries(
  Object.entries(transcriptFiles).map(([path, text]) => [dirOf(path), text.trim()]),
);

/** Newest first. */
export const posts: Post[] = Object.entries(postFiles)
  .map(([path, text]) => readPost(path, text))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

/** Most recently updated first. */
export const projects: Project[] = Object.entries(projectFiles)
  .map(([path, project]) => ({
    ...project,
    slug: dirOf(path),
    transcript: transcripts[dirOf(path)] || undefined,
  }))
  .sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title));

export const papers: Paper[] = papersJson;
export const activities: Activity[] = activitiesJson;

export const postBySlug = (slug: string) => posts.find((post) => post.slug === slug);
export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
