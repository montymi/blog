import { expect, test } from 'vitest';

import { graphNode } from '@/content/graph';
import { checkGraphQuery, graphQuery, graphResultIds, querySuggestions } from './graph-query';

const results = (query: string) => {
  const plan = graphQuery(query);
  expect(plan, query).not.toBeNull();
  return graphResultIds(plan!);
};

test('dependency queries distinguish actual consumers from shared subjects', () => {
  expect(results('what uses Authkit').sort()).toEqual(['project:chess', 'project:lazygrocer']);
  expect(results('what does Authkit use')).toEqual(['project:styx']);
  expect(results('show libraries maintained by Charon').sort()).toEqual([
    'project:authkit',
    'project:langkit',
  ]);
  expect(results('WHAT DOES CHARON MAINTAIN').sort()).toEqual([
    'project:authkit',
    'project:langkit',
  ]);
  expect(results('show apps using Langkit').sort()).toEqual([
    'project:chess',
    'project:lazygrocer',
    'project:mcp',
  ]);
  expect(results('what uses next-template')).toEqual([]);
});

test('collection filters use the catalog fields and combine conditions', () => {
  expect(results('projects where status = draft')).toEqual(['project:sesh']);
  expect(results('show foundations where type = template')).toEqual(['project:next-template']);
  expect(results('show projects where status = published and type = library').sort()).toEqual([
    'project:authkit',
    'project:langkit',
  ]);
  expect(results('show projects where status = "in use"').sort()).toEqual([
    'project:authkit',
    'project:langkit',
  ]);
  expect(results('show work where type = report')).toHaveLength(2);
  expect(results('show foundations where type != library').sort()).toEqual([
    'project:cleardocs',
    'project:next-template',
  ]);
});

test('topic matching uses complete words, publication context, and quoted conjunctions', () => {
  expect(results('show writing about Blitzy')).toHaveLength(4);
  expect(results('show writing about AI')).toContain('post:technology-beyond-the-keyboard');
  const ids = results('show projects where topic = "APIs and contracts" and status = published');
  expect(ids).toContain('project:mcp');
  expect(ids).toContain('project:authkit');
  expect(ids.every((id) => graphNode(id)!.status === 'published')).toBe(true);
});

test.each([
  'show projects where status = banana',
  'show projects where secret = yes',
  'show projects where type = spaceship',
  'show projects where topic = "unterminated',
  'show projects where status =',
  'show projects where status = published and ',
])('invalid or incomplete filters are checked rather than executed: %s', (query) => {
  expect(checkGraphQuery(query)).toMatchObject({ kind: 'help' });
  expect(graphQuery(query)).toBeNull();
});

test('completion preserves the current operator and preceding conditions', () => {
  expect(querySuggestions('show projects where status != d')).toContain(
    'show projects where status != draft',
  );
  expect(querySuggestions('show projects where status = published and ty')).toContain(
    'show projects where status = published and type = library',
  );
  expect(querySuggestions('what uses auth')).toContain('what uses Authkit');
  expect(querySuggestions('show projects where status = nope')).toContain(
    'show projects where status = published',
  );
});
