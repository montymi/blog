import { expect, test } from 'vitest';

import { SCENE, skyAt } from './sky';

test('the sun rises on the left at 6am, in orange', () => {
  const sun = skyAt(6);
  expect(sun.kind).toBe('sun');
  expect(sun.x).toBeLessThan(0);
  expect(sun.warmth).toBe(0);
});

test('the sun peaks at noon, centred, in gold', () => {
  const sun = skyAt(12);
  expect(sun.x).toBeCloseTo(SCENE.width / 2 + 3, 0);
  expect(sun.y).toBe(30);
  expect(sun.warmth).toBe(1);
});

test('just before 11am the sun is high and a little left of centre', () => {
  const sun = skyAt(10.9);
  expect(sun.x).toBeLessThan(SCENE.width / 2);
  expect(sun.x).toBeGreaterThan(SCENE.width / 3);
  expect(sun.y).toBeLessThan(50);
});

test('the sun sets past the slope on the right at 6pm', () => {
  expect(skyAt(17.99).x).toBeGreaterThan(SCENE.width);
});

test('overnight the moon takes its place, highest at midnight', () => {
  expect(skyAt(18).kind).toBe('moon');
  expect(skyAt(3).kind).toBe('moon');
  expect(skyAt(0).y).toBe(30);
  expect(skyAt(5.99).kind).toBe('moon');
});
