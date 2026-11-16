import { expect, test } from 'vitest';

import { fill, permalink, readCheck, readManifest, route } from './contract';
import { REGISTRY, SNAPSHOTS } from './registry';

test('every registered app has a manifest that keeps the contract', () => {
  expect(SNAPSHOTS).toHaveLength(REGISTRY.length);
  for (const [i, manifest] of SNAPSHOTS.entries()) {
    expect(manifest.url).toBe(REGISTRY[i].origin);
  }
});

test('no two apps claim the same verb', () => {
  const owner = new Map<string, string>();
  for (const app of SNAPSHOTS) {
    for (const verb of app.language?.verbs ?? []) {
      expect(
        owner.get(verb),
        `"${verb}" is claimed by ${owner.get(verb)} and ${app.id}`,
      ).toBeUndefined();
      owner.set(verb, app.id);
    }
  }
});

test('a sentence goes to the app that owns its first word', () => {
  expect(route('plan 4 dinners for 2', SNAPSHOTS)?.id).toBe('chef');
  expect(route('  Mistakes where theme = fork', SNAPSHOTS)?.id).toBe('chess');
  expect(route('capstone', SNAPSHOTS)).toBeNull();
});

test('a manifest that breaks the contract is refused, not guessed at', () => {
  const good = SNAPSHOTS[0];
  expect(readManifest({ ...good, montymi: 2 })).toBeNull();
  expect(readManifest({ ...good, url: 'http://chef.montymi.com' })).toBeNull();
  expect(readManifest({ ...good, id: 'Chef!' })).toBeNull();
  const noTemplate = readManifest({
    ...good,
    language: { ...good.language, check: 'https://x.com/check' },
  });
  expect(noTemplate?.language).toBeUndefined();
});

test('a check answer keeps only known roles, and an error always says where', () => {
  expect(
    readCheck({
      ok: true,
      tokens: [
        { text: 'plan', at: 0, role: 'verb' },
        { text: 'x', at: 5, role: 'shiny' },
      ],
    }),
  ).toEqual({
    ok: true,
    tokens: [
      { text: 'plan', at: 0, role: 'verb' },
      { text: 'x', at: 5, role: null },
    ],
  });
  expect(readCheck({ ok: false, tokens: [] })).toEqual({
    ok: false,
    tokens: [],
    message: 'This sentence could not be read.',
    at: 0,
  });
  expect(readCheck({ ok: true })).toBeNull();
});

test('templates and permalinks carry the sentence encoded', () => {
  expect(fill('https://chef.montymi.com/week?q={query}', ' plan 2 dinners for 1 under $40 ')).toBe(
    'https://chef.montymi.com/week?q=plan%202%20dinners%20for%201%20under%20%2440',
  );
  expect(permalink('plan 2 dinners for 1')).toBe('/q/plan%202%20dinners%20for%201');
});
