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
  paperKind?: 'report' | 'document';
}
const providerRelations = [
  'authenticates',
  'authorizes',
  'exposes',
  'supplies',
  'standardizes',
] as const;
export type GraphRelation =
  | (typeof providerRelations)[number]
  | 'uses'
  | 'maintains'
  | 'documents'
  | 'discusses'
  | 'introduces'
  | 'hosts'
  | 'shared-theme'
  | 'shared-topic'
  | 'published-with';

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  relation: GraphRelation;
}

/** Context connects ideas; it never establishes that one item uses another. */
export const isContextEdge = (edge: GraphEdge) =>
  ['shared-theme', 'shared-topic', 'published-with'].includes(edge.relation);
export function providerPair(edge: GraphEdge): [provider: string, consumer: string] | null {
  if (edge.relation === 'uses') return [edge.to, edge.from];
  return providerRelations.some((relation) => relation === edge.relation)
    ? [edge.from, edge.to]
    : null;
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
    .filter((p) => p.kind === 'report' || p.kind === 'document')
    .map((p) => ({
      id: `paper:${p.file}`,
      title: p.title,
      kind: 'paper' as const,
      paperKind: p.kind as 'report' | 'document',
      topics: [] as string[],
      about: `${p.kind === 'report' ? 'Research report' : 'Project document'} · ${p.pages} pages`,
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
for (const paper of papers.filter((p) => p.kind !== 'resume' && p.project)) {
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
        edges.push({
          from: items[i],
          to: items[j],
          label: `shared theme: ${theme.name}`,
          relation: 'shared-theme',
        });
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
        relation: 'shared-topic',
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
        relation: 'published-with',
      });
    }
}
export const graphEdges: GraphEdge[] = edges;
// Draw one line per pair; retain all of its explanations in graphEdges.
const links = new Map<string, GraphEdge>();
for (const edge of edges) {
  const key = [edge.from, edge.to].sort().join('|');
  const previous = links.get(key);
  if (!previous || (isContextEdge(previous) && !isContextEdge(edge))) links.set(key, edge);
}
export const graphLinks = [...links.values()];
export const graphNode = (id: string) => graphNodes.find((node) => node.id === id);

export const edgeSentence = (edge: GraphEdge) =>
  isContextEdge(edge)
    ? `${graphNode(edge.from)!.title} and ${graphNode(edge.to)!.title} · ${edge.label}`
    : `${graphNode(edge.from)!.title} ${edge.label} ${graphNode(edge.to)!.title}`;

/** Provider direction is defined once, for search, comparisons, and item details. */
const integrations = graphEdges.flatMap((edge) => {
  const pair = providerPair(edge);
  return pair ? [pair] : [];
});
export const providers = (id: string): string[] => [
  ...new Set(integrations.filter(([, consumer]) => consumer === id).map(([provider]) => provider)),
];
export const consumers = (id: string): string[] => [
  ...new Set(integrations.filter(([provider]) => provider === id).map(([, consumer]) => consumer)),
];

const edgeRank = (edge: GraphEdge) => (providerPair(edge) ? 0 : isContextEdge(edge) ? 2 : 1);

export function edgeBetween(from: string, to: string): GraphEdge | undefined {
  return graphEdges
    .filter(
      (edge) => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
    )
    .sort((a, b) => edgeRank(a) - edgeRank(b))[0];
}

export function pathEdges(ids: string[]): GraphEdge[] {
  return ids.slice(1).flatMap((id, i) => {
    const edge = edgeBetween(ids[i], id);
    return edge ? [edge] : [];
  });
}

export interface ConnectionGroup {
  title: string;
  items: { node: GraphNode; edges: GraphEdge[] }[];
}

/** Each neighbor appears once; documented relationships take precedence over shared subjects. */
export function connectionGroups(id: string): ConnectionGroup[] {
  const neighbors = new Map<string, GraphEdge[]>();
  for (const edge of graphEdges) {
    if (edge.from !== id && edge.to !== id) continue;
    const other = edge.from === id ? edge.to : edge.from;
    neighbors.set(other, [...(neighbors.get(other) ?? []), edge]);
  }
  const groups = new Map<string, ConnectionGroup['items']>();
  for (const [other, all] of neighbors) {
    const documented = all.filter((edge) => !isContextEdge(edge));
    const evidence = (documented.length ? documented : all).sort(
      (a, b) => edgeRank(a) - edgeRank(b),
    );
    const primary = evidence[0];
    const pair = providerPair(primary);
    const title = pair
      ? pair[1] === id
        ? 'Uses'
        : 'Used by'
      : primary.relation === 'maintains'
        ? primary.from === id
          ? 'Maintains'
          : 'Maintained by'
        : primary.relation === 'documents'
          ? primary.to === id
            ? 'Project documents'
            : 'Documents'
          : isContextEdge(primary)
            ? 'Shared subjects'
            : graphNode(other)!.kind === 'post'
              ? 'Writing'
              : 'Connected work';
    groups.set(title, [...(groups.get(title) ?? []), { node: graphNode(other)!, edges: evidence }]);
  }
  const order = [
    'Uses',
    'Used by',
    'Maintained by',
    'Maintains',
    'Project documents',
    'Documents',
    'Writing',
    'Connected work',
    'Shared subjects',
  ];
  return order
    .filter((title) => groups.has(title))
    .map((title) => ({
      title,
      items: groups.get(title)!.sort((a, b) => a.node.title.localeCompare(b.node.title)),
    }));
}

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

/** Prefer documented chains, then fewer steps. Subject-only paths remain explicitly contextual. */
export function connectionPath(from: string, to: string): string[] {
  if (!validIds.has(from) || !validIds.has(to)) return [];
  const queue = [{ ids: [from], context: 0 }];
  const seen = new Set<string>();
  while (queue.length) {
    queue.sort(
      (a, b) =>
        a.context - b.context ||
        a.ids.length - b.ids.length ||
        a.ids.join('|').localeCompare(b.ids.join('|')),
    );
    const path = queue.shift()!;
    const last = path.ids.at(-1)!;
    if (seen.has(last)) continue;
    seen.add(last);
    if (last === to) return path.ids;
    for (const next of neighborhood(last).slice(1)) {
      if (!seen.has(next)) {
        queue.push({
          ids: [...path.ids, next],
          context: path.context + Number(isContextEdge(edgeBetween(last, next)!)),
        });
      }
    }
  }
  return [];
}
