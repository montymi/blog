import { graphQuery } from '@/lib/graph-query';
import { expect, test } from 'vitest';

import { papers, posts, projects } from '.';
import {
  graphEdges,
  graphLinks,
  graphNodes,
  connectionPath,
  neighborhood,
  connectionGroups,
  isContextEdge,
  pathEdges,
  providers,
} from './graph';
import topics from '../../content/graph-topics.json';
import { board } from '@/lib/board';
import { graphLayout } from '@/lib/graph-layout';

test('the graph uses the board catalog with unique identities and valid edges', () => {
  expect(new Set(graphNodes.map((n) => n.id)).size).toBe(graphNodes.length);
  const boardLinks = board(projects, posts, papers).flatMap((s) => (s.item ? [s.item.href] : []));
  expect(graphNodes.map((n) => n.href)).toEqual(expect.arrayContaining(boardLinks));
  const supporting = papers.filter((p) => p.kind === 'document').map((p) => p.file);
  expect(
    graphNodes
      .filter((n) => !boardLinks.includes(n.href))
      .map((n) => n.href)
      .sort(),
  ).toEqual(supporting.sort());
  expect(graphNodes.some((n) => n.href.includes('Resume'))).toBe(false);
  for (const edge of graphEdges) {
    expect(
      graphNodes.some((n) => n.id === edge.from),
      edge.from,
    ).toBe(true);
    expect(
      graphNodes.some((n) => n.id === edge.to),
      edge.to,
    ).toBe(true);
    expect(edge.from).not.toBe(edge.to);
    expect(edge.label).not.toBe('');
    expect([
      'authenticates',
      'authorizes',
      'exposes',
      'supplies',
      'standardizes',
      'uses',
      'maintains',
      'documents',
      'discusses',
      'introduces',
      'hosts',
      'shared-theme',
      'shared-topic',
      'published-with',
    ]).toContain(edge.relation);
  }
});

test('queries and neighbor exploration share the same relationships', () => {
  const result = graphQuery('show everything related to chess')!;
  expect(result.ids).toEqual(neighborhood('project:chess'));
  expect(result.ids).toContain('project:mcp');
  expect(result.ids).toContain('post:blitzys-blitz-adventures-in-chess');
  expect(graphQuery('show my research')?.ids).toHaveLength(2);
  expect(graphQuery('show libraries')?.ids.sort()).toEqual(['project:authkit', 'project:langkit']);
  expect(graphQuery('show foundations')?.ids.sort()).toEqual([
    'project:authkit',
    'project:cleardocs',
    'project:langkit',
    'project:next-template',
  ]);
});

test('a connection path is made of documented edges and unknown items stay unknown', () => {
  const path = graphQuery('what connects Chess to Styx?')!.ids;
  expect(path[0]).toBe('project:chess');
  expect(path.at(-1)).toBe('project:styx');
  for (let i = 1; i < path.length; i++) expect(neighborhood(path[i - 1])).toContain(path[i]);
  expect(connectionPath('missing', 'missing')).toEqual([]);
  expect(graphQuery('what connects BRCA1 to Connect')!.ids.length).toBeGreaterThan(0);
  expect(graphQuery('show everything related to a nonexistent project')).toBeNull();
  expect(graphQuery('plan 4 dinners for 2')).toBeNull();
});

test('map positions are deterministic and independent of input ordering', () => {
  const a = graphLayout(graphNodes, graphEdges);
  const b = graphLayout([...graphNodes].reverse(), graphEdges);
  for (const node of graphNodes) {
    expect(a.get(node.id)).toEqual(b.get(node.id));
    const p = a.get(node.id)!;
    expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
    expect(Math.abs(p.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(p.y)).toBeLessThanOrEqual(1);
  }
  const points = [...a.values()];
  for (const point of points) expect(Math.hypot(point.x, point.y, point.z)).toBeCloseTo(1);
  expect(new Set(points.map((p) => p.z)).size).toBeGreaterThan(points.length / 2);
  expect(new Set(points.map((p) => `${p.x},${p.y}`)).size).toBe(graphNodes.length);
});

test('shared subjects connect across sections while rendering each pair only once', () => {
  for (const topic of topics)
    for (const id of topic.items) {
      expect(
        graphNodes.some((node) => node.id === id),
        `${topic.name}: ${id}`,
      ).toBe(true);
    }
  expect(neighborhood('project:mcp')).toContain('project:schema-api-testing');
  expect(neighborhood('paper:/library/BRCA1-Gene-Mutation.pdf')).toContain('project:cleardocs');
  expect(graphEdges).toContainEqual({
    from: 'project:mcp',
    to: 'project:schema-api-testing',
    label: 'shared topic: APIs and contracts',
    relation: 'shared-topic',
  });
  expect(new Set(graphLinks.map((edge) => [edge.from, edge.to].sort().join('|'))).size).toBe(
    graphLinks.length,
  );
});

test('the reusable libraries connect Styx with their actual consumers', () => {
  for (const kit of ['authkit', 'langkit']) {
    expect(graphNodes.find((node) => node.id === `project:${kit}`)).toMatchObject({
      kind: 'project',
      role: 'library',
    });
    for (const id of ['project:styx', 'project:chess', 'project:lazygrocer']) {
      expect(neighborhood(`project:${kit}`)).toContain(id);
    }
  }
  expect(graphEdges).toContainEqual({
    from: 'project:langkit',
    to: 'project:chess',
    label: 'standardizes grammar/check/run for',
    relation: 'standardizes',
  });
});

test('paths prefer documented chains over a shorter shared-subject shortcut', () => {
  const path = connectionPath('project:authkit', 'project:mcp');
  expect(path).toHaveLength(3);
  expect(pathEdges(path).every((edge) => !isContextEdge(edge))).toBe(true);
  const contextual = pathEdges(
    connectionPath('paper:/library/BRCA1-Gene-Mutation.pdf', 'project:mcp'),
  );
  expect(contextual.some(isContextEdge)).toBe(true);
});

test('connected details separate actual use from context and include supporting documents once', () => {
  const groups = connectionGroups('project:chess');
  expect(
    groups
      .find((group) => group.title === 'Uses')!
      .items.map(({ node }) => node.id)
      .sort(),
  ).toEqual(providers('project:chess').sort());
  const items = groups.flatMap((group) => group.items.map(({ node }) => node.id));
  expect(new Set(items).size).toBe(items.length);
  expect(
    groups
      .find((group) => group.title === 'Shared subjects')!
      .items.every(({ edges }) => edges.every(isContextEdge)),
  ).toBe(true);
  expect(
    connectionGroups('project:capstone').find((group) => group.title === 'Project documents')!
      .items,
  ).toHaveLength(3);
});

test('the capstone is where Styx’s access pattern started', () => {
  expect(graphEdges).toContainEqual({
    from: 'project:capstone',
    to: 'project:styx',
    label: 'first tried the prove-then-choose access that grew into',
    relation: 'introduces',
  });
  expect(neighborhood('project:styx')).toContain('project:capstone');
});
