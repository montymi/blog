import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

import CornerBadge from '@/components/CornerBadge';
import useNav from '@/store/nav';

// Styled via `styled()`, not the `sx` prop: an inline `sx` object on a raw
// MUI primitive (`<Box sx={{...}} />`) triggers a real TS2590 "union too
// complex" compiler error in this project's MUI/TS version combination —
// confirmed by bisection, not a style preference. `styled()` is also what
// the rest of this codebase already uses everywhere (components/styled.ts,
// Header/styled.ts, etc.), so this keeps the one convention that actually
// works.
const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100dvh',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  overflowX: 'hidden',
}));

const Glow = styled(Box)({
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 35%, rgba(43, 143, 212, 0.08), transparent 70%)',
});

const Content = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: 760,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

interface ScreenShellProps {
  /** Hides the home badge — used on Welcome, where it would point at itself. */
  showHome?: boolean;
  /** Hides the menu badge — used on Welcome, where the disc is the one nav trigger instead. */
  showMenu?: boolean;
  children: ReactNode;
}

/**
 * The shared page shell: a dark full-height canvas with one centered ambient
 * glow, a centered content column (max ~760px), and the home/menu corner
 * badges that replaced the old AppBar + Sidebar chrome.
 */
function ScreenShell({ showHome = true, showMenu = true, children }: ScreenShellProps) {
  const [, navActions] = useNav();

  return (
    <Root>
      <Glow aria-hidden />

      {showHome && (
        <CornerBadge corner="top-left" component={Link} to="/" aria-label="Home">
          <HomeOutlinedIcon fontSize="small" />
        </CornerBadge>
      )}
      {showMenu && (
        <CornerBadge corner="top-right" onClick={() => navActions.open()} aria-label="Open menu">
          <MenuOutlinedIcon fontSize="small" />
        </CornerBadge>
      )}

      <Content>{children}</Content>
    </Root>
  );
}

export default ScreenShell;
