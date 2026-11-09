import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import useNav from '@/store/nav';

import Constellation from './Constellation';

function NavHarness() {
  const [isOpen, navActions] = useNav();

  useEffect(() => {
    navActions.open();
  }, [navActions]);

  return (
    <>
      <div data-testid="nav-state">{isOpen ? 'open' : 'closed'}</div>
      <Constellation />
    </>
  );
}

test('renders every page as a linked star and closes the shared nav state on click', () => {
  render(
    <RecoilRoot>
      <MemoryRouter>
        <NavHarness />
      </MemoryRouter>
    </RecoilRoot>,
  );

  const libraryStar = screen.getByRole('link', { name: 'Library' });
  expect(libraryStar).toHaveAttribute('href', '/library');
  expect(screen.getByRole('link', { name: 'Welcome' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'Discography' })).toHaveAttribute('href', '/discography');

  fireEvent.click(libraryStar);
  expect(screen.getByTestId('nav-state')).toHaveTextContent('closed');
});
