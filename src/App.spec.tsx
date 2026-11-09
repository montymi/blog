import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test, vi } from 'vitest';

import { AppRoutes } from './App';
import { MOVED } from './moved';

beforeEach(() => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(JSON.stringify({ shipped: null })))),
  );
});

function at(path: string) {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

test('the front page links to every app by its address', () => {
  at('/');
  const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
  for (const href of [
    'https://chef.montymi.com',
    'https://chess.montymi.com',
    'https://chef.montymi.com/connect',
  ]) {
    expect(hrefs).toContain(href);
  }
});

test.each(Object.entries(MOVED))('the old address %s opens %s', (from, to) => {
  at(from);
  const section = to.slice(1);
  expect(
    screen.getByRole('link', { name: new RegExp(section, 'i'), current: 'page' }),
  ).toBeInTheDocument();
});

test('a post has its own address', () => {
  at('/writing/talking-docs');
  expect(screen.getByRole('heading', { level: 1, name: 'Talking Docs' })).toBeInTheDocument();
});

test('an unknown address says so and leads home', () => {
  at('/nope');
  expect(screen.getByRole('heading', { level: 1, name: 'Nothing here' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go to the front page' })).toHaveAttribute('href', '/');
});
