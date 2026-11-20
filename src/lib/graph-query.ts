/** Checked, read-only queries over the public catalog. */
import {
  graphNodes,
  graphEdges,
  graphNode,
  connectionPath,
  neighborhood,
  providers,
  consumers,
  edgeBetween,
  edgeSentence,
  pathEdges,
  isContextEdge,
  type GraphNode,
} from '@/content/graph';
import { isFoundation, projectRoleLabel } from '@/content';

const clean = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
export function findGraphNode(text: string): GraphNode | undefined {
  const query = clean(text.replace(/^(the|my)\s+/i, ''));
  if (!query) return undefined;
  const entity = query.replace(/ (app|project)$/, '');
  return graphNodes.find((node) =>
    [node.title, node.label, ...node.aliases].some((name) => clean(name) === entity),
  );
}

export interface GraphQuery {
  mode: 'related' | 'path' | 'all' | 'collection' | 'uses' | 'used-by' | 'maintained' | 'shared';
  resultIds?: string[];
  ids: string[];
  from?: string;
  to?: string;
  description: string;
  /** Recorded chains explaining a result, including any intermediate item. */
  paths?: Record<string, string[]>;
}
/** A small local grammar, not a remote model. App-owned sentences keep their existing route. */
function connectionRequest(text: string): GraphQuery | null {
  const query = text.trim().replace(/[?.!]+$/, '');
  if (/^(show|explore|open) (me )?(the )?(graph|connections|constellation)$/i.test(query)) {
    return {
      mode: 'all',
      ids: graphNodes.map((node) => node.id),
      description: 'Explore how the work connects',
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

const collections = [
  'projects',
  'apps',
  'work',
  'writing',
  'research',
  'reports',
  'libraries',
  'foundations',
  'templates',
  'documentation',
  'documents',
] as const;
type Collection = (typeof collections)[number];
const typeValues = [
  'project',
  'app',
  'writing',
  'report',
  'document',
  'library',
  'foundation',
  'template',
  'documentation',
  'platform',
];
const statusValues = ['published', 'draft', 'archived', 'in use'];
export const queryExamples = [
  'show foundations',
  'what uses authkit',
  'what does Chess use',
  'show libraries maintained by Charon',
  'show projects where status = published',
  'show foundations where type = template',
  'show writing about AI',
  'what do Chess and LazyGrocer share',
  'show writing about the foundations behind Chess',
  'show documents for capstone',
  'what connects Chess to Styx',
];
export type GraphCheck =
  | { kind: 'valid'; plan: GraphQuery; canonical: string }
  | { kind: 'help'; message: string; suggestions: string[] }
  | { kind: 'none' };

const idsOf = (nodes: GraphNode[]) => nodes.map((node) => node.id);
const matchesType = (node: GraphNode, type: string) =>
  type === 'foundation'
    ? isFoundation(node)
    : type === 'project'
      ? node.kind === 'project'
      : type === 'app'
        ? Boolean(node.app)
        : type === 'writing'
          ? node.kind === 'post' || node.kind === 'paper'
          : type === 'report' || type === 'document'
            ? node.paperKind === type
            : node.role === type;
const inCollection = (node: GraphNode, collection: Collection) =>
  collection === 'work'
    ? true
    : collection === 'foundations'
      ? isFoundation(node)
      : collection === 'research' || collection === 'reports'
        ? node.paperKind === 'report'
        : collection === 'documents'
          ? node.kind === 'paper'
          : matchesType(
              node,
              collection === 'projects'
                ? 'project'
                : collection === 'apps'
                  ? 'app'
                  : collection === 'libraries'
                    ? 'library'
                    : collection === 'templates'
                      ? 'template'
                      : collection,
            );
const collectionTitle = (name: Collection) =>
  ({
    projects: 'Projects',
    apps: 'Live apps',
    work: 'Work',
    writing: 'Writing and reports',
    research: 'Research reports',
    reports: 'Research reports',
    libraries: 'Shared libraries',
    foundations: 'Shared foundations',
    templates: 'Templates',
    documentation: 'Documentation',
    documents: 'Documents and reports',
  })[name];

function hasTopic(node: GraphNode, value: string) {
  const words = clean(value).split(' ');
  const haystack = clean([node.title, node.about, ...node.aliases, ...node.topics].join(' ')).split(
    ' ',
  );
  return words.every((word) => haystack.includes(word));
}
function relatedPlan(
  mode: GraphQuery['mode'],
  node: GraphNode,
  matches: string[],
  description: string,
): GraphQuery {
  return {
    mode,
    from: node.id,
    resultIds: matches,
    ids: [...new Set([node.id, ...matches])],
    description,
  };
}

function request(text: string): GraphQuery | null {
  const shared = /^what do (.+?) and (.+?) (?:share|have in common)$/i.exec(text);
  if (shared) {
    const from = findGraphNode(shared[1]),
      to = findGraphNode(shared[2]);
    if (!from || !to || from.id === to.id) return null;
    const common = providers(from.id).filter((id) => providers(to.id).includes(id));
    return {
      mode: 'shared',
      from: from.id,
      to: to.id,
      resultIds: common,
      ids: [...new Set([from.id, to.id, ...common])],
      description: `Services and foundations shared by ${from.title} and ${to.title}`,
      paths: Object.fromEntries(common.map((id) => [id, [from.id, id, to.id]])),
    };
  }
  const writing =
    /^(?:show|find|list)(?: me)? writing about (?:the )?(tools|foundations) (?:behind|used by) (.+)$/i.exec(
      text,
    );
  if (writing) {
    const anchor = findGraphNode(writing[2]);
    if (!anchor) return null;
    const paths: Record<string, string[]> = {};
    for (const provider of providers(anchor.id)) {
      if (writing[1].toLowerCase() === 'foundations' && !isFoundation(graphNode(provider)!))
        continue;
      for (const edge of graphEdges) {
        if (edge.from !== provider && edge.to !== provider) continue;
        const article = edge.from === provider ? edge.to : edge.from;
        if (
          graphNode(article)?.kind !== 'post' ||
          (!isContextEdge(edge) &&
            !['discusses', 'documents', 'introduces'].includes(edge.relation))
        )
          continue;
        const existing = paths[article];
        if (
          !existing ||
          (isContextEdge(edgeBetween(existing[0], existing[1])!) && !isContextEdge(edge))
        ) {
          paths[article] = [article, provider, anchor.id];
        }
      }
    }
    return {
      ...relatedPlan(
        'related',
        anchor,
        Object.keys(paths),
        `Writing about ${writing[1].toLowerCase()} behind ${anchor.title}`,
      ),
      ids: [...new Set([anchor.id, ...Object.values(paths).flat()])],
      paths,
    };
  }
  const collection =
    /^(?:(?:show|list|find|explore)\s+(?:me\s+)?(?:(?:my|the|all)\s+)?)?(projects|apps|work|writing|research|reports|libraries|foundations|templates|documentation|documents)(?:\s+(about|using|related to|connected to|maintained by|for)\s+(.+))?$/i.exec(
      text,
    );
  if (collection) {
    const name = collection[1].toLowerCase() as Collection,
      modifier = collection[2]?.toLowerCase(),
      subject = collection[3];
    const candidates = graphNodes.filter((node) => inCollection(node, name));
    if (!modifier)
      return { mode: 'collection', ids: idsOf(candidates), description: collectionTitle(name) };
    if (modifier === 'about')
      return {
        mode: 'collection',
        ids: idsOf(candidates.filter((node) => hasTopic(node, subject))),
        description: `${collectionTitle(name)} about ${subject}`,
      };
    const anchor = findGraphNode(subject);
    if (!anchor) return null;
    const reachable =
      modifier === 'using'
        ? consumers(anchor.id)
        : modifier === 'for'
          ? graphEdges
              .filter((edge) => edge.relation === 'documents' && edge.to === anchor.id)
              .map((edge) => edge.from)
          : modifier === 'maintained by'
            ? graphEdges
                .filter((edge) => edge.relation === 'maintains' && edge.from === anchor.id)
                .map((edge) => edge.to)
            : neighborhood(anchor.id).filter((id) => id !== anchor.id);
    const results = idsOf(candidates.filter((node) => reachable.includes(node.id)));
    return relatedPlan(
      modifier === 'using' ? 'used-by' : modifier === 'maintained by' ? 'maintained' : 'related',
      anchor,
      results,
      `${collectionTitle(name)} ${modifier} ${anchor.title}`,
    );
  }
  const uses = /^(?:what|which (?:apps|projects|tools)) (?:uses?|depends? on) (.+)$/i.exec(text);
  if (uses) {
    const node = findGraphNode(uses[1]);
    return node
      ? relatedPlan('used-by', node, consumers(node.id), `Work that uses ${node.title}`)
      : null;
  }
  const dependencies = /^what does (.+?) (use|depend on|maintain|contain|house)$/i.exec(text);
  if (dependencies) {
    const node = findGraphNode(dependencies[1]);
    if (!node) return null;
    const maintaining = /maintain|contain|house/i.test(dependencies[2]);
    const matches = maintaining
      ? graphEdges
          .filter((edge) => edge.relation === 'maintains' && edge.from === node.id)
          .map((edge) => edge.to)
      : providers(node.id);
    return relatedPlan(
      maintaining ? 'maintained' : 'uses',
      node,
      matches,
      maintaining
        ? `Components maintained by ${node.title}`
        : `Services and foundations used by ${node.title}`,
    );
  }
  const path = /^(?:show )?path from (.+?) to (.+)$/i.exec(text);
  if (path) return connectionRequest(`what connects ${path[1]} to ${path[2]}`);
  return connectionRequest(text);
}

function splitConditions(text: string): string[] | null {
  const parts: string[] = [];
  let quote = '',
    start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"' || text[i] === "'") {
      if (!quote) quote = text[i];
      else if (quote === text[i]) quote = '';
    }
    if (!quote && /^\s+and\s+(?=[a-z]+\s*(?:!=|=))/i.test(text.slice(i))) {
      const separator = /^\s+and\s+/i.exec(text.slice(i))![0];
      parts.push(text.slice(start, i));
      i += separator.length - 1;
      start = i + 1;
    }
  }
  if (quote) return null;
  parts.push(text.slice(start));
  return parts;
}

export function querySuggestions(text: string): string[] {
  const query = text.trimStart();
  const where = /^(.*?\s+where\s+)(.*)$/i.exec(query);
  if (where) {
    let quote = '',
      last = 0;
    for (let i = 0; i < where[2].length; i++) {
      const char = where[2][i];
      if (char === '"' || char === "'") {
        if (!quote) quote = char;
        else if (quote === char) quote = '';
      }
      const and = !quote && /^\s+and\s+/i.exec(where[2].slice(i));
      if (and) {
        last = i + and[0].length;
        i = last - 1;
      }
    }
    const prior = where[2].slice(0, last),
      tail = where[2].slice(last);
    const field = /^\s*(status|type|role|topic)\s*(!=|=)\s*(.*)$/i.exec(tail);
    if (field) {
      const name = field[1].toLowerCase();
      const values =
        name === 'status'
          ? statusValues
          : name === 'topic'
            ? [...new Set(graphNodes.flatMap((node) => node.topics))]
            : typeValues;
      const needle = field[3].replace(/^["']/, '').toLowerCase();
      const filtered = values.filter((value) => value.toLowerCase().startsWith(needle));
      return (filtered.length ? filtered : values)
        .slice(0, 6)
        .map(
          (value) =>
            where[1] +
            prior +
            field[1] +
            ` ${field[2]} ` +
            (name === 'topic' || /^["']/.test(field[3]) ? JSON.stringify(value) : value),
        );
    }
    const values = ['status = published', 'type = library', 'topic = "APIs and contracts"'];
    const filtered = values.filter((value) => value.startsWith(tail.toLowerCase()));
    return (filtered.length ? filtered : values).map((value) => where[1] + prior + value);
  }
  const shared = /^what do (.+?) and (.*)$/i.exec(query);
  const first = shared ? findGraphNode(shared[1]) : undefined;
  if (first) {
    return graphNodes
      .filter(
        (node) =>
          node.id !== first.id &&
          [node.title, node.label, ...node.aliases].some((name) =>
            name.toLowerCase().startsWith(shared![2].toLowerCase()),
          ),
      )
      .slice(0, 6)
      .map((node) => `what do ${first.title} and ${node.title} share`);
  }
  const pool = [
    ...queryExamples,
    ...collections.map((name) => `show ${name}`),
    ...graphNodes.map((node) => `show everything related to ${node.title}`),
    ...graphNodes
      .filter((node) => consumers(node.id).length)
      .map((node) => `what uses ${node.title}`),
  ];
  return [...new Set(pool)]
    .filter((candidate) => candidate.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 6);
}

export function checkGraphQuery(text: string): GraphCheck {
  const query = text.trim().replace(/[?.!]+$/, '');
  const where = /^(.*?)\s+where(?:\s+(.*))?$/i.exec(query);
  const plan = request(where ? where[1] : query);
  const help = (message: string): GraphCheck => ({
    kind: 'help',
    message,
    suggestions: querySuggestions(text),
  });
  if (!plan) {
    const suggestions = querySuggestions(text);
    return /^(show|list|find|explore|what uses|what does|what do|which (?:apps|projects|tools)|path from|what connects)\b/i.test(
      query,
    ) ||
      (suggestions.length > 0 && query.length > 2)
      ? help('Choose a request below, or keep typing an item’s name.')
      : { kind: 'none' };
  }
  if (!where) return { kind: 'valid', plan, canonical: plan.description };
  if (/\s+and\s*$/i.test(where[2] ?? '')) return help('Add another filter after “and”.');
  const conditions = splitConditions(where[2] ?? '');
  if (!conditions) return help('Close the quote to finish this filter.');
  let matches = plan.resultIds ?? plan.ids;
  const descriptions: string[] = [];
  for (const condition of conditions) {
    const parsed = /^\s*([a-z]+)\s*(!=|=)\s*(.*?)\s*$/i.exec(condition);
    if (!parsed || !parsed[3])
      return help('Finish the filter: status, type, or topic, followed by = and a value.');
    const field = parsed[1].toLowerCase() === 'role' ? 'type' : parsed[1].toLowerCase();
    if (!['status', 'type', 'topic'].includes(field))
      return help('Filter by status, type, or topic.');
    const raw = parsed[3],
      value = raw.replace(/^(["'])(.*)\1$/, '$2');
    const allowed = field === 'status' ? statusValues : field === 'type' ? typeValues : null;
    if (allowed && !allowed.includes(value.toLowerCase()))
      return help(`${field === 'status' ? 'Status' : 'Type'} must be ${allowed.join(', ')}.`);
    matches = matches.filter((id) => {
      const node = graphNode(id)!;
      if (field === 'status' && !node.status) return false;
      const equal =
        field === 'status'
          ? value.toLowerCase() === 'in use'
            ? node.role === 'library' && node.status === 'published'
            : node.status === value.toLowerCase()
          : field === 'type'
            ? matchesType(node, value.toLowerCase())
            : hasTopic(node, value);
      return parsed[2] === '=' ? equal : !equal;
    });
    descriptions.push(`${field} ${parsed[2]} ${value}`);
  }
  const description = `${plan.description} · ${descriptions.join(' and ')}`;
  return {
    kind: 'valid',
    canonical: description,
    plan: {
      ...plan,
      mode: plan.from ? plan.mode : 'collection',
      resultIds: matches,
      ids:
        plan.mode === 'path'
          ? plan.ids
          : [
              ...new Set([
                ...(plan.from ? [plan.from] : []),
                ...(plan.to ? [plan.to] : []),
                ...matches.flatMap((id) => plan.paths?.[id] ?? [id]),
              ]),
            ],
      description,
    },
  };
}

export function graphQuery(text: string): GraphQuery | null {
  const check = checkGraphQuery(text);
  return check.kind === 'valid' ? check.plan : null;
}
export const graphResultIds = (plan: GraphQuery) => plan.resultIds ?? plan.ids;
export function graphResultDetail(plan: GraphQuery, id: string): string {
  if (plan.paths?.[id]) return pathEdges(plan.paths[id]).map(edgeSentence).join(' · ');
  if (plan.mode === 'path') {
    const index = plan.ids.indexOf(id);
    const edge = index > 0 ? edgeBetween(plan.ids[index - 1], id) : undefined;
    if (edge) return edgeSentence(edge);
  }
  if (plan.from && plan.from !== id) {
    const edge = edgeBetween(plan.from, id);
    if (edge) return edgeSentence(edge);
  }
  return graphNode(id)!.about;
}
export const graphResultKind = (node: GraphNode) =>
  (node.role === 'documentation' ? 'Docs' : projectRoleLabel(node.role)) ??
  (node.kind === 'paper' ? 'PDF' : node.kind === 'post' ? 'Writing' : 'Project');
