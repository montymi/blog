import type { ElementType } from 'react';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNER_POSITION: Record<Corner, object> = {
  'top-left': { top: 16, left: 16 },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
};

interface CornerBadgeExtraProps {
  corner: Corner;
  /** Allows polymorphic usage, e.g. `component={Link} to="/"`. */
  component?: ElementType;
  to?: string;
}

/**
 * A small circular control fixed to a viewport corner — the shared shell's
 * replacement for inline toolbar buttons. Composes MUI's own IconButton
 * (consistent sizing/focus/hover) rather than reimplementing it.
 *
 * Styled via `styled()`, not the `sx` prop — see ScreenShell.tsx's note on
 * why: an inline `sx` object on a raw MUI primitive triggers a real TS2590
 * "union too complex" error in this project's MUI/TS version combination.
 */
const CornerBadge = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'corner',
})<CornerBadgeExtraProps>(({ theme, corner }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  ...CORNER_POSITION[corner],
}));

export default CornerBadge;
