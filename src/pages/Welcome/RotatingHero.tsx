import { useEffect, useState, type FC } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

import routes from '@/routes';
import { Pages } from '@/routes/types';

interface HeroObject {
  label: string;
  Icon: FC<SvgIconProps>;
}

// The hero's objects ARE the site's own pages — reusing each route's own
// icon from the route config, so this can never drift out of sync with the
// real nav. Ends on Discography ("the disc"): the hero's click target opens
// the nav this sequence just previewed, and the resting object should be
// the one the whole page is themed around. Every page in this list is
// guaranteed to carry an icon (see routes/index.ts) except NotFound, which
// is deliberately excluded.
const ORDER = [Pages.Welcome, Pages.Library, Pages.Activity, Pages.Blog, Pages.Discography];

const OBJECTS: HeroObject[] = ORDER.map((page) => ({
  label: routes[page].title ?? '',
  Icon: routes[page].icon!,
}));

const STEP_MS = 420;

const Frame = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

// Each new object fades and settles in once, on mount — forced by the
// `key` change in RotatingHero below. No looping, nothing ongoing: once the
// sequence reaches its last object it simply stops being re-keyed, so the
// animation never replays and there's nothing left running in the
// background to be bothered by.
const IconLayer = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  animation: 'hero-icon-settle 320ms ease-out',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
  '@keyframes hero-icon-settle': {
    from: { opacity: 0, transform: 'scale(0.92)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
}));

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The Welcome hero: a quick one-time settling sequence through objects that
 * represent Michael, landing on the record and then going still. Earlier
 * versions used continuous motion (a 3D card-flip, then a looping
 * crossfade) — both kept moving indefinitely, which is the actual problem
 * with motion-sickness triggers: it isn't really about which motion, it's
 * that it never stops. A short, finite intro sidesteps that entirely.
 */
function RotatingHero() {
  const [index, setIndex] = useState(prefersReducedMotion ? OBJECTS.length - 1 : 0);

  useEffect(() => {
    if (index >= OBJECTS.length - 1) return;
    const id = setTimeout(() => setIndex((i) => i + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [index]);

  const { Icon } = OBJECTS[index];

  return (
    <Frame>
      <IconLayer key={index} aria-hidden="true">
        <Icon sx={{ fontSize: 88 }} />
      </IconLayer>
    </Frame>
  );
}

export default RotatingHero;
