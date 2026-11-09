import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import NavOverlay from './NavOverlay';

// NavOverlay renders <Link> internally for its route list, so it must live
// inside a Router — it previously didn't (mounted in App.tsx above
// <BrowserRouter>), which crashed the whole app the moment the menu badge
// opened it. This guards against that regressing.
test('opens without crashing when rendered inside a Router', () => {
  render(
    <RecoilRoot>
      <MemoryRouter>
        <NavOverlay />
      </MemoryRouter>
    </RecoilRoot>,
  );

  fireEvent.keyDown(document.body, { key: 'k', altKey: true });

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
});
