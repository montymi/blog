import { expect, test } from 'vitest';

import { papers, posts, projects } from '.';
import { graphEdges, graphNodes, graphQuery, connectionPath, neighborhood } from './graph';
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
});

test('a connection path is made of documented edges and unknown paths stay unknown', () => {
  const path = graphQuery('what connects Chess to Styx?')!.ids;
  expect(path[0]).toBe('project:chess');
  expect(path.at(-1)).toBe('project:styx');
  for (let i = 1; i < path.length; i++) expect(neighborhood(path[i - 1])).toContain(path[i]);
  expect(connectionPath('missing', 'missing')).toEqual([]);
  expect(graphQuery('what connects BRCA1 to Connect')?.ids).toEqual([]);
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
});
