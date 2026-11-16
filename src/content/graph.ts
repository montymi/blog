/** One catalog for the board's relationships, the visual explorer, and the command line. */
import relations from '../../content/relations.json';
import topics from '../../content/graph-topics.json';
import { rawThemes } from './themes';
import { papers, postHref, posts, projects, type ProjectRole, type ProjectStatus } from '.';

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
  topics: string[];
  status?: ProjectStatus;
  app?: boolean;
}
export type GraphRelation =
  | 'enables'
  | 'uses'
  | 'maintains'
  | 'documents'
  | 'discusses'
  | 'introduces'
  | 'hosts';

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  relation?: GraphRelation;
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
    status: p.status,
    app: Boolean(p.live),
    topics: [] as string[],
    released: p.status === 'published',
    role: p.role,
  })),
  ...posts.map((p) => ({
    id: `post:${p.slug}`,
    title: p.title,
    kind: 'post' as const,
    about: p.summary,
    topics: [...p.tags, ...(p.url ? [new URL(p.url).hostname.replace(/^www\./, '')] : [])],
    href: postHref(p),
    away: Boolean(p.url),
  })),
  ...papers
    .filter((p) => p.kind === 'report')
    .map((p) => ({
      id: `paper:${p.file}`,
      title: p.title,
      kind: 'paper' as const,
      topics: [] as string[],
      about: `Research report · ${p.pages} pages`,
      href: p.file,
      away: true,
    })),
].map((node) => ({
  ...node,
  label: labels[node.id] ?? node.title,
  aliases: aliases[node.id] ?? [],
  topics: [
    ...new Set([
      ...node.topics,
      ...rawThemes.filter((theme) => theme.items.includes(node.id)).map((theme) => theme.name),
      ...topics.filter((topic) => topic.items.includes(node.id)).map((topic) => topic.name),
    ]),
  ],
}));

const validIds = new Set(graphNodes.map((node) => node.id));
const edges: GraphEdge[] = [...relations] as GraphEdge[];
// Project documents already declare what they document; never duplicate that relationship by hand.
for (const paper of papers.filter((p) => p.kind === 'report' && p.project)) {
  edges.push({
    from: `paper:${paper.file}`,
    to: `project:${paper.project}`,
    label: 'documents',
    relation: 'documents',
  });
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
