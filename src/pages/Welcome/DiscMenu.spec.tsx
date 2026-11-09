import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import useNav from '@/store/nav';

import DiscMenu from './DiscMenu';

// A minimal consumer of the same shared nav state DiscMenu writes to —
// stands in for NavOverlay here, since DiscMenu's whole job now is just to
// open the one shared nav store (see Constellation.tsx for the actual menu).
function NavStateProbe() {
  const [isOpen] = useNav();
  return <div data-testid="nav-state">{isOpen ? 'open' : 'closed'}</div>;
}

test('clicking the disc opens the shared nav state', () => {
  render(
    <RecoilRoot>
      <MemoryRouter>
        <DiscMenu />
        <NavStateProbe />
      </MemoryRouter>
    </RecoilRoot>,
  );

  expect(screen.getByTestId('nav-state')).toHaveTextContent('closed');

  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));

  expect(screen.getByTestId('nav-state')).toHaveTextContent('open');
});
