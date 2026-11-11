/**
 * Where the hero's sun (or moon) stands for an hour of the visitor's day. The sun rises on the
 * left at 6am in orange, peaks at noon in gold, and sets past the slope on the right at 6pm;
 * overnight the moon crosses the same arc. Positions are in the hero scene's own units: see
 * components/Sky.tsx.
 */
export const SCENE = { width: 270, height: 295 };
const RISE = { x: -24, y: 230 }; // below the left edge, behind the first column
const SET = { x: 300, y: 230 }; // past the slope, out of frame
const PEAK = 30; // the top of the arc

export interface Body {
  kind: 'sun' | 'moon';
  x: number;
  y: number;
  /** 0 at the horizon (orange) to 1 overhead (gold). The moon has none. */
  warmth: number;
}

/** `hour` is local time as a decimal: 10.75 is 10:45. */
export function skyAt(hour: number): Body {
  const h = ((hour % 24) + 24) % 24;
  const day = h >= 6 && h < 18;
  // How far across its half of the day the body is, 0 at rising to 1 at setting.
  const t = day ? (h - 6) / 12 : ((h - 18 + 24) % 24) / 12;
  const lift = Math.sin(Math.PI * t);
  return {
    kind: day ? 'sun' : 'moon',
    x: RISE.x + (SET.x - RISE.x) * t,
    y: RISE.y - (RISE.y - PEAK) * lift,
    warmth: day ? lift : 0,
  };
}

export const hourOf = (date: Date) => date.getHours() + date.getMinutes() / 60;
