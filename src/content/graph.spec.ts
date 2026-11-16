import { expect, test } from 'vitest';

import { papers, posts, projects } from '.';
import {
  graphEdges,
  graphLinks,
  graphNodes,
  graphQuery,
  connectionPath,
  neighborhood,
} from './graph';
import topics from '../../content/graph-topics.json';
import { board } from '@/lib/board';
import { graphLayout } from '@/lib/graph-layout';

test('the graph uses the board catalog with unique identities and valid edges', () => {
  expect(new Set(graphNodes.map((n) => n.id)).size).toBe(graphNodes.length);
  const boardLinks = board(projects, posts, papers).flatMap((s) => (s.item ? [s.item.href] : []));
  expect(graphNodes.map((n) => n.href).sort()).toEqual(boardLinks.sort());
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
  });
  expect(new Set(graphLinks.map((edge) => [edge.from, edge.to].sort().join('|'))).size).toBe(
    graphLinks.length,
  );
});

test('the reusable libraries connect Charon with their actual consumers', () => {
  for (const kit of ['authkit', 'langkit']) {
    expect(graphNodes.find((node) => node.id === `project:${kit}`)).toMatchObject({
      kind: 'project',
      role: 'library',
    });
    for (const id of ['project:charon', 'project:chess', 'project:lazygrocer']) {
      expect(neighborhood(`project:${kit}`)).toContain(id);
    }
  }
  expect(graphEdges).toContainEqual({
    from: 'project:langkit',
    to: 'project:chess',
    label: 'standardizes grammar/check/run for',
  });
});
