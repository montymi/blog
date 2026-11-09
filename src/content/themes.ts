/**
 * Everything grouped by what it's about, across kinds: an app, a project, a paper and a post can
 * share a theme. The grouping is curated in content/themes.json, one theme per item; a test
 * checks every item it names exists.
 */
import { SNAPSHOTS } from '@/platform/registry';

import themesJson from '../../content/themes.json';
import { papers, postHref, posts, projects } from '.';

export type Kind = 'app' | 'project' | 'paper' | 'post';

export interface Entry {
  kind: Kind;
  title: string;
  href: string;
  /** True when it leaves this site. */
  away: boolean;
}

export interface Theme {
  id: string;
  name: string;
  about: string;
  entries: Entry[];
}

/** What a theme's item reference (`project:linguist`, `paper:/library/x.pdf`) points at. */
export function resolve(ref: string): Entry | null {
  const at = ref.indexOf(':');
  const kind = ref.slice(0, at);
  const id = ref.slice(at + 1);
  if (kind === 'app') {
    const app = SNAPSHOTS.find((a) => a.id === id);
    return app ? { kind, title: app.name, href: app.url, away: true } : null;
  }
  if (kind === 'project') {
    const project = projects.find((p) => p.slug === id);
    return project ? { kind, title: project.title, href: `/projects/${id}`, away: false } : null;
  }
  if (kind === 'paper') {
    const paper = papers.find((p) => p.file === id);
    return paper ? { kind, title: paper.title, href: paper.file, away: true } : null;
  }
  if (kind === 'post') {
    const post = posts.find((p) => p.slug === id);
    return post ? { kind, title: post.title, href: postHref(post), away: Boolean(post.url) } : null;
  }
  return null;
}

export const themes: Theme[] = themesJson.map(({ id, name, about, items }) => ({
  id,
  name,
  about,
  entries: items.map(resolve).filter((entry): entry is Entry => entry !== null),
}));

export const rawThemes = themesJson;
