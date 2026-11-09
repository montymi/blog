import type { Project } from '@/content';

// The skyline's layout, in pixels on the tilted plane. See components/Skyline.tsx.
export const CELL = 24; // the graph paper's grid
export const FOOT = 2 * CELL; // a block's footprint
export const ROWS: Project['kind'][] = ['album', 'episode', 'single'];
export const ROW_LABEL = { album: 'Albums', episode: 'Episodes', single: 'Singles' };
export const WIDTH = 22 * CELL;
export const ROW_DEPTH = 4 * CELL; // a row's depth: room to see each block's sides
export const DEPTH = ROWS.length * ROW_DEPTH;
export const TALLEST = 6 * CELL;

const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;
/** When it stands on the timeline: its release, or its last update while it has none ("TBD"). */
const shippedOn = (p: Project) => (Number.isNaN(day(p.released)) ? p.updated : p.released);

export function keptFor(project: Project): string {
  if (Number.isNaN(day(project.released))) return 'not released yet';
  const days = Math.max(0, Math.round(day(project.updated) - day(project.released)));
  if (days < 1) return 'released once';
  if (days < 45) return `kept ${days} ${days === 1 ? 'day' : 'days'}`;
  const months = Math.round(days / 30.4);
  return months < 18 ? `kept ${months} months` : `kept ${Math.round(days / 365)} years`;
}

export interface Placed {
  project: Project;
  /** Days from release to last update. */
  kept: number;
  x: number;
  y: number;
  height: number;
}

/** Where each block stands: x from its release date, nudged right so none overlap in a row. */
export function place(projects: Project[]): {
  blocks: Placed[];
  years: { year: number; x: number }[];
} {
  const first = Math.min(...projects.map((p) => day(shippedOn(p))));
  const last = Math.max(...projects.map((p) => day(shippedOn(p))));
  const span = Math.max(1, last - first);
  const usable = WIDTH - FOOT - 2 * CELL;
  const xOf = (iso: string) => CELL + ((day(iso) - first) / span) * usable;

  const blocks: Placed[] = [];
  for (const kind of ROWS) {
    let edge = -Infinity;
    projects
      .filter((p) => p.kind === kind)
      .sort((a, b) => shippedOn(a).localeCompare(shippedOn(b)))
      .forEach((project) => {
        const x = Math.min(Math.max(xOf(shippedOn(project)), edge + FOOT + CELL / 2), WIDTH - FOOT);
        edge = x;
        const kept = Math.max(0, day(project.updated) - day(shippedOn(project)));
        blocks.push({
          project,
          x,
          kept,
          y: ROWS.indexOf(kind) * ROW_DEPTH + CELL,
          height: 0,
        });
      });
  }
  // Heights by square root, so a two-year project doesn't flatten everything else; the
  // longest-kept stands TALLEST.
  const longest = Math.sqrt(Math.max(1, ...blocks.map((b) => b.kept)));
  for (const block of blocks)
    block.height = Math.round(CELL / 2 + (Math.sqrt(block.kept) / longest) * (TALLEST - CELL / 2));
  const years: { year: number; x: number }[] = [];
  const startYear = new Date(first * 86_400_000).getUTCFullYear();
  const endYear = new Date(last * 86_400_000).getUTCFullYear();
  for (let year = startYear + 1; year <= endYear; year++)
    years.push({ year, x: xOf(`${year}-01-01`) });
  return { blocks, years };
}
