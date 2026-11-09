import useNav from '@/store/nav';

import RotatingHero from './RotatingHero';
import { HeroFrame, HeroWrap } from './styled';

/**
 * The Welcome hero: clicking the disc opens the site's navigation — the
 * same shared constellation every other page's corner menu badge opens
 * (see sections/NavOverlay/Constellation.tsx). This page has no menu badge
 * of its own (see ScreenShell showMenu={false} in Welcome.tsx); the disc is
 * the one thing here that asks to be touched.
 *
 * This used to be its own local fan-out of petals around the disc. Once the
 * shared nav became a real constellation worth opening, keeping a second,
 * separate navigation UI here stopped making sense — one model, two
 * entry points.
 */
function DiscMenu() {
  const [, navActions] = useNav();

  return (
    <HeroWrap>
      <HeroFrame onClick={() => navActions.open()} aria-label="Open navigation">
        <RotatingHero />
      </HeroFrame>
    </HeroWrap>
  );
}

export default DiscMenu;
