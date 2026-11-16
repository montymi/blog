import { fireEvent, render, screen, within } from '@testing-library/react';
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
    'https://styx.montymi.com',
    'https://charon.montymi.com',
    'https://connect.montymi.com',
  ]) {
    expect(hrefs).toContain(href);
  }
  expect(hrefs).not.toContain('https://manager.montymi.com');
  expect(hrefs).not.toContain('https://chef.montymi.com/connect');
});

test('research papers open directly from their board squares', () => {
  at('/');
  expect(screen.getByRole('link', { name: /BRCA1 Gene Mutation Report, report/ })).toHaveAttribute(
    'href',
    '/library/BRCA1-Gene-Mutation.pdf',
  );
  expect(
    screen.getByRole('link', { name: /Solar Charging for E-Mobility Devices Report, report/ }),
  ).toHaveAttribute('href', '/library/Capstone-Report.pdf');
});

test('a project has one square and opens its details inside the board', () => {
  at('/');
  const squares = screen.getAllByRole('link', { name: /^[a-h][1-8]: Charon, released project$/ });
  expect(squares).toHaveLength(1);
  fireEvent.click(squares[0]);
  const details = within(screen.getByRole('region', { name: 'Charon project details' }));
  expect(details.getByRole('heading', { name: 'Charon' })).toBeInTheDocument();
  expect(details.getByRole('link', { name: 'Open Charon' })).toHaveAttribute(
    'href',
    'https://charon.montymi.com',
  );
  expect(details.getByRole('link', { name: 'Code on GitHub (private)' })).toHaveAttribute(
    'href',
    'https://github.com/montymi/charon',
  );
  expect(details.getByText('Project README')).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Built' })).toBeInTheDocument();
  fireEvent.click(details.getByRole('button', { name: 'Back to board index' }));
  expect(screen.queryByRole('region', { name: 'Charon project details' })).not.toBeInTheDocument();
});

test('Projects and Writing browse their lists within the board', () => {
  at('/');
  fireEvent.click(screen.getByRole('button', { name: /^Projects \(/ }));
  const projectsList = within(screen.getByRole('list', { name: 'Projects' }));
  fireEvent.click(projectsList.getByRole('link', { name: /^Styx/ }));
  expect(screen.getByRole('region', { name: 'Styx project details' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /^Writing \(/ }));
  const papersList = within(screen.getByRole('list', { name: 'Writing' }));
  expect(papersList.getByRole('link', { name: /BRCA1/ })).toHaveAttribute(
    'href',
    '/library/BRCA1-Gene-Mutation.pdf',
  );
  expect(papersList.queryByRole('link', { name: /Resume/ })).not.toBeInTheDocument();
});

test('Writing includes both reports and the résumé lives under About', () => {
  at('/writing');
  const reports = within(screen.getByRole('region', { name: 'Research reports' }));
  expect(reports.getAllByRole('link', { name: /Report/ })).toHaveLength(2);
  expect(reports.queryByRole('link', { name: /Resume/ })).not.toBeInTheDocument();
});

test('About provides the résumé PDF', () => {
  at('/about');
  expect(screen.getByRole('link', { name: 'Résumé (PDF)' })).toHaveAttribute(
    'href',
    '/library/Resume-MichaelMontanaro.pdf',
  );
});

test('the capstone project keeps its report and supporting documents together', () => {
  at('/projects/capstone');
  const documents = within(screen.getByRole('region', { name: 'Project documents' }));
  expect(documents.getAllByRole('link')).toHaveLength(3);
  expect(documents.getByRole('link', { name: 'Capstone Software Presentation' })).toHaveAttribute(
    'href',
    '/library/Capstone-Project-Walkthrough.pdf',
  );
});

test('the map has unlabeled sphere controls that open the existing project pages', () => {
  // Modern browsers may return a promise from scrolling; it must never become effect cleanup.
  window.scrollTo = vi.fn(() => Promise.resolve());
  at('/projects');
  const map = within(screen.getByRole('group', { name: 'Work connections map' }));
  const sphere = map.getByRole('button', { name: 'Chess, Project' });
  expect(sphere.querySelector('.sr-only')).toHaveTextContent('Chess');
  fireEvent.focus(sphere);
  expect(screen.getByRole('status')).toHaveTextContent('Chess · Project');
  fireEvent.click(sphere);
  expect(screen.getByRole('heading', { level: 1, name: 'Chess' })).toBeInTheDocument();
});

test('a connection query highlights a real path through the map', () => {
  at('/projects?explore=what%20connects%20Chess%20to%20Styx');
  expect(screen.getByText('Connection path')).toBeInTheDocument();
  const map = within(screen.getByRole('group', { name: 'Work connections map' }));
  expect(map.getByRole('button', { name: 'Chess, Project' })).toHaveAttribute(
    'aria-current',
    'true',
  );
  expect(screen.getByRole('region', { name: 'Chess map details' })).toBeInTheDocument();
});

test('map reset and starting points stay together while exploring', () => {
  at('/projects');
  const controls = screen.getByRole('group', { name: 'Explore connections' });
  const group = within(controls);
  expect(group.getByText('Start with')).toBeInTheDocument();
  fireEvent.click(group.getByRole('button', { name: 'Connect' }));
  expect(screen.getByRole('region', { name: 'Connect map details' })).toBeInTheDocument();
  expect(group.getByRole('button', { name: 'Capstone' })).toBeInTheDocument();
  fireEvent.click(group.getByRole('button', { name: 'Show all connections' }));
  expect(group.getByRole('button', { name: 'Show all connections' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(screen.queryByRole('region', { name: 'Connect map details' })).not.toBeInTheDocument();
});

test('the homepage presents reusable foundations alongside the apps', () => {
  at('/');
  const foundations = within(screen.getByRole('region', { name: 'Shared foundations' }));
  expect(foundations.getByRole('link', { name: /Authkit/ })).toHaveAttribute(
    'href',
    '/projects/authkit',
  );
  expect(foundations.getByRole('link', { name: /Langkit/ })).toHaveAttribute(
    'href',
    '/projects/langkit',
  );
  expect(foundations.getByRole('link', { name: /ClearDocs/ })).toHaveAttribute(
    'href',
    '/projects/cleardocs',
  );
  expect(foundations.getByRole('link', { name: /next-template/ })).toHaveAttribute(
    'href',
    '/projects/next-template',
  );
  expect(foundations.getByText('Documentation · v1.4.0')).toBeInTheDocument();
  expect(foundations.getByText('Template · v1.0.0')).toBeInTheDocument();
});

test('next-template links to its public source and README as a reusable starter', () => {
  at('/projects/next-template');
  expect(screen.getByRole('heading', { level: 1, name: 'next-template' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Code on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/montymi/next-template',
  );
  expect(screen.getByText('README from GitHub')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Open next-template' })).not.toBeInTheDocument();
});

test.each(['authkit', 'langkit'])(
  'the %s library has source details without implying a separate live app',
  (slug) => {
    at(`/projects/${slug}`);
    expect(screen.getByText('Library · v0.1.0')).toBeInTheDocument();
    expect(screen.getByText('In use')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Code on GitHub (private)' })).toHaveAttribute(
      'href',
      `https://github.com/montymi/charon/tree/main/${slug}`,
    );
    expect(
      screen.queryByRole('link', { name: new RegExp(`^Open ${slug}`, 'i') }),
    ).not.toBeInTheDocument();
  },
);

test('Build is the label for an unversioned Connect deployment', () => {
  at('/projects/mcp');
  expect(screen.getByText('Build', { exact: true })).toBeInTheDocument();
  expect(screen.queryByText('Revision', { exact: true })).not.toBeInTheDocument();
});

test.each(['chess', 'charon', 'styx', 'mcp'])(
  'the %s project has source-backed metadata and a public README',
  (slug) => {
    at(`/projects/${slug}`);
    expect(screen.getByRole('link', { name: 'Code on GitHub (private)' })).toBeInTheDocument();
    expect(screen.getByText('Project README')).toBeInTheDocument();
    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.queryByText('rolling')).not.toBeInTheDocument();
    expect(screen.queryByText('TBD')).not.toBeInTheDocument();
  },
);

test('home cards name the actual publication of external writing', () => {
  at('/');
  const written = within(screen.getByRole('region', { name: 'Written' }));
  const chess = written.getByRole('link', { name: /Blitzy’s Blitz: Adventures in Chess/ });
  expect(within(chess).getByText(/· Blitzy/)).toBeInTheDocument();
  expect(within(chess).queryByText(/Substack/)).not.toBeInTheDocument();
  const preseason = written.getByRole('link', { name: /Preseason/ });
  expect(within(preseason).getByText(/· Substack/)).toBeInTheDocument();
});

test('the writing list keeps Blitzy and Substack publication labels distinct', () => {
  at('/writing');
  const chess = screen.getByRole('link', { name: /Blitzy’s Blitz: Adventures in Chess/ });
  expect(within(chess).getByText(/on Blitzy/)).toBeInTheDocument();
  const preseason = screen.getByRole('link', { name: /Preseason/ });
  expect(within(preseason).getByText(/on Substack/)).toBeInTheDocument();
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
