/** One catalog for the board's relationships, the visual explorer, and the command line. */
import relations from '../../content/relations.json';
import topics from '../../content/graph-topics.json';
import { rawThemes } from './themes';
import { isFoundation, papers, postHref, posts, projects, type ProjectRole } from '.';

export interface GraphNode {
  id: string;
  title: string;
  label: string;
  kind: 'project' | 'post' | 'paper';
  about: string;
  href: string;
  away: boolean;
  released?: boolean;
  role?: ProjectRole;
  aliases: string[];
}
export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

const labels: Record<string, string> = {
  'project:schema-api-testing': 'Schema testing',
  'project:coding-from-zero': 'Coding from zero',
  'paper:/library/Capstone-Report.pdf': 'Capstone report',
  'paper:/library/BRCA1-Gene-Mutation.pdf': 'BRCA1',
  'post:blitzys-blitz-adventures-in-chess': 'Chess & Blitzy',
  'post:c-to-rust-refactor-in-5-days-blitzy-autonomously-rewrote-curl': 'curl → Rust',
  'post:from-sketch-to-production-in-8-hours': 'Sketch → production',
  'post:questioning-agile-development': 'Questioning Agile',
  'post:technology-beyond-the-keyboard': 'Beyond the keyboard',
};
const aliases: Record<string, string[]> = {
  'project:mcp': ['connect', 'gateway', 'mcp'],
  'project:next-template': ['next template', 'nextjs starter', 'web starter'],
  'project:lazygrocer': ['chef', 'lazy grocer', 'groceries'],
  'project:capstone': ['capstone', 'solar charging', 'e-mobility'],
  'paper:/library/BRCA1-Gene-Mutation.pdf': ['brca1', 'brca 1', 'gene mutation', 'genetics'],
};

export const graphNodes: GraphNode[] = [
  ...projects.map((p) => ({
    id: `project:${p.slug}`,
    title: p.title,
    kind: 'project' as const,
    about: p.description,
    href: `/projects/${p.slug}`,
    away: false,
    released: p.status === 'published',
    role: p.role,
  })),
  ...posts.map((p) => ({
    id: `post:${p.slug}`,
    title: p.title,
    kind: 'post' as const,
    about: p.summary,
    href: postHref(p),
    away: Boolean(p.url),
  })),
  ...papers
    .filter((p) => p.kind === 'report')
    .map((p) => ({
      id: `paper:${p.file}`,
      title: p.title,
      kind: 'paper' as const,
      about: `Research report · ${p.pages} pages`,
      href: p.file,
      away: true,
    })),
].map((node) => ({
  ...node,
  label: labels[node.id] ?? node.title,
  aliases: aliases[node.id] ?? [],
}));

const validIds = new Set(graphNodes.map((node) => node.id));
const edges: GraphEdge[] = [...relations];
// Project documents already declare what they document; never duplicate that relationship by hand.
for (const paper of papers.filter((p) => p.kind === 'report' && p.project)) {
  edges.push({ from: `paper:${paper.file}`, to: `project:${paper.project}`, label: 'documents' });
}
for (const theme of rawThemes) {
  const items = theme.items.filter((id) => validIds.has(id));
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++) {
      if (
        !edges.some(
          (edge) =>
            [edge.from, edge.to].includes(items[i]) && [edge.from, edge.to].includes(items[j]),
        )
      ) {
        edges.push({ from: items[i], to: items[j], label: `shared theme: ${theme.name}` });
      }
    }
}
// Cross-cutting subjects are many-to-many; the board's single-theme grouping stays intact.
for (const topic of topics) {
  for (let i = 0; i < topic.items.length; i++)
    for (let j = i + 1; j < topic.items.length; j++) {
      edges.push({
        from: topic.items[i],
        to: topic.items[j],
        label: `shared topic: ${topic.name}`,
      });
    }
}
// A publication is a factual connection, distinct from one article discussing another item.
const publications = new Map<string, string[]>();
for (const post of posts.filter((p) => p.url)) {
  const host = new URL(post.url!).hostname;
  publications.set(host, [...(publications.get(host) ?? []), `post:${post.slug}`]);
}
for (const [host, items] of publications) {
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++) {
      edges.push({
        from: items[i],
        to: items[j],
        label: `published on ${host === 'blitzy.com' ? 'Blitzy' : host}`,
      });
    }
}
export const graphEdges: GraphEdge[] = edges;
// Draw one line per pair; retain all of its explanations in graphEdges.
const links = new Map<string, GraphEdge>();
for (const edge of edges) {
  const key = [edge.from, edge.to].sort().join('|');
  const previous = links.get(key);
  if (!previous || (previous.label.startsWith('shared') && !edge.label.startsWith('shared')))
    links.set(key, edge);
}
export const graphLinks = [...links.values()];
export const graphNode = (id: string) => graphNodes.find((node) => node.id === id);

export function neighborhood(id: string): string[] {
  return [
    ...new Set([
      id,
      ...graphEdges
        .filter((e) => e.from === id || e.to === id)
        .map((e) => (e.from === id ? e.to : e.from)),
    ]),
  ];
}

/** Shortest path over explicit, explainable relationships. An absent path stays absent. */
export function connectionPath(from: string, to: string): string[] {
  if (!validIds.has(from) || !validIds.has(to)) return [];
  const queue = [[from]];
  const seen = new Set([from]);
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    if (last === to) return path;
    for (const next of neighborhood(last).slice(1)) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return [];
}

const clean = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
export function findGraphNode(text: string): GraphNode | undefined {
  const query = clean(text.replace(/^(the|my)\s+/i, ''));
  if (!query) return undefined;
  const score = (node: GraphNode) =>
    Math.max(
      ...[node.title, node.label, ...node.aliases].map((name) => {
        const term = clean(name);
        return term === query ? 100 : term.includes(query) ? 30 : query.includes(term) ? 10 : 0;
      }),
    );
  return [...graphNodes].sort((a, b) => score(b) - score(a)).find((node) => score(node) > 0);
}

export interface GraphQuery {
  mode: 'related' | 'path' | 'all' | 'collection';
  ids: string[];
  from?: string;
  to?: string;
  description: string;
}
/** A small local grammar, not a remote model. App-owned sentences keep their existing route. */
export function graphQuery(text: string): GraphQuery | null {
  const query = text.trim().replace(/[?.!]+$/, '');
  if (/^(show|explore|open) (me )?(the )?(graph|connections|constellation)$/i.test(query)) {
    return {
      mode: 'all',
      ids: graphNodes.map((node) => node.id),
      description: 'Explore how the work connects',
    };
  }
  const collection =
    /^show (?:me )?(?:my |the |all )?(research|reports|projects|writing|libraries|foundations)$/i.exec(
      query,
    );
  if (collection) {
    if (/libraries|foundations/i.test(collection[1])) {
      const foundations = /foundations/i.test(collection[1]);
      return {
        mode: 'collection',
        ids: graphNodes
          .filter((node) => (foundations ? isFoundation(node) : node.role === 'library'))
          .map((node) => node.id),
        description: foundations ? 'Shared foundations' : 'Shared libraries',
      };
    }
    const kind = /research|reports/i.test(collection[1])
      ? 'paper'
      : /projects/i.test(collection[1])
        ? 'project'
        : 'post';
    return {
      mode: 'collection',
      ids: graphNodes
        .filter((node) => node.kind === kind || (kind === 'post' && node.kind === 'paper'))
        .map((node) => node.id),
      description:
        kind === 'paper'
          ? 'Research reports'
          : kind === 'project'
            ? 'Projects'
            : 'Writing and reports',
    };
  }
  const path =
    /^(?:what|how) connects? (.+?) (?:to|and|with) (.+)$/i.exec(query) ??
    /^how (?:does|do|is|are) (.+?) connect(?:ed)? (?:to|with) (.+)$/i.exec(query);
  if (path) {
    const from = findGraphNode(path[1]);
    const to = findGraphNode(path[2].replace(/^the platform$/i, 'connect'));
    if (!from || !to) return null;
    return {
      mode: 'path',
      from: from.id,
      to: to.id,
      ids: connectionPath(from.id, to.id),
      description: `${from.title} → ${to.title}`,
    };
  }
  const related =
    /^(?:show|find|explore)(?: me)? (?:everything |work |things )?(?:related to|connected to|about) (.+)$/i.exec(
      query,
    ) ?? /^(?:what is|whats|what's) (?:related|connected) to (.+)$/i.exec(query);
  if (!related) return null;
  const node = findGraphNode(related[1]);
  return node
    ? {
        mode: 'related',
        from: node.id,
        ids: neighborhood(node.id),
        description: `Work connected to ${node.title}`,
      }
    : null;
}
export const graphHref = (query: string) =>
  `/projects?explore=${encodeURIComponent(query)}#connections`;
