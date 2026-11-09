import { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

import routes from '@/routes';
import { Pages } from '@/routes/types';
import useNav from '@/store/nav';

// A hub-and-spoke "constellation" — Welcome at the center, every other page
// branching off it, the way a Skyrim skill tree radiates from a starting
// perk. Hand-placed, not evenly spaced on a circle (that's what the old
// disc-menu petals already did) — a constellation should look found, not
// generated.
const NODE_POSITION: Record<Pages, { x: number; y: number }> = {
  [Pages.Welcome]: { x: 50, y: 48 },
  [Pages.Library]: { x: 18, y: 26 },
  [Pages.Activity]: { x: 82, y: 22 },
  [Pages.Discography]: { x: 78, y: 78 },
  [Pages.Blog]: { x: 20, y: 80 },
  [Pages.NotFound]: { x: 50, y: 48 }, // unused — NotFound has no nav entry
};

const SPOKES = [Pages.Library, Pages.Activity, Pages.Discography, Pages.Blog];

const Field = styled('div')({
  position: 'relative',
  width: '100%',
  maxWidth: 320,
  aspectRatio: '1 / 1',
  margin: '0 auto',
});

const Lines = styled('svg')({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  overflow: 'visible',
});

interface StarProps {
  active: boolean;
  x: number;
  y: number;
}

const Star = styled(Link, {
  shouldForwardProp: (prop) => !['active', 'x', 'y'].includes(prop as string),
})<StarProps>(({ theme, active, x, y }) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  transform: 'translate(-50%, -50%)',
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  border: `2px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  boxShadow: active ? `0 0 10px ${theme.palette.primary.main}` : 'none',
  textDecoration: 'none',
  transition: 'border-color 200ms ease, color 200ms ease, box-shadow 200ms ease',
}));

const Label = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  marginTop: 6,
  whiteSpace: 'nowrap',
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  pointerEvents: 'none',
}));

/**
 * The site's page navigation, reimagined as a skill-tree-style constellation
 * instead of a flat list of "tabs": Welcome is the hub, every other page a
 * star branching off it, with the connecting line lighting up as you
 * approach a star. Replaces both the old disc fan-out menu (Welcome) and
 * the plain page-link list this Dialog used to open with (every other page)
 * — one navigation model instead of two.
 */
function Constellation() {
  const theme = useTheme();
  const [, navActions] = useNav();
  const [active, setActive] = useState<Pages | null>(null);
  const home = NODE_POSITION[Pages.Welcome];

  return (
    <Field>
      <Lines viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {SPOKES.map((page) => {
          const { x, y } = NODE_POSITION[page];
          // Hovering/focusing the hub itself lights every spoke; hovering a
          // single star lights only the line leading to it.
          const isActive = active === page || active === Pages.Welcome;
          return (
            <line
              key={page}
              x1={home.x}
              y1={home.y}
              x2={x}
              y2={y}
              stroke={isActive ? theme.palette.primary.main : theme.palette.divider}
              strokeWidth={1}
              style={{ transition: 'stroke 200ms ease' }}
            />
          );
        })}
      </Lines>

      {[Pages.Welcome, ...SPOKES].map((page) => {
        const { x, y } = NODE_POSITION[page];
        const { path, title, icon: Icon } = routes[page];
        return (
          <Star
            key={page}
            to={path as string}
            x={x}
            y={y}
            active={active === page}
            onMouseEnter={() => setActive(page)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(page)}
            onBlur={() => setActive(null)}
            onClick={navActions.close}
            aria-label={title}
          >
            {Icon && <Icon fontSize="small" />}
            <Label aria-hidden="true">{title}</Label>
          </Star>
        );
      })}
    </Field>
  );
}

export default Constellation;
