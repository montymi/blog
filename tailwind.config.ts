import type { Config } from 'tailwindcss';

/**
 * The montymi design system's tokens under the same semantic names
 * chef.montymi.com uses. Values live in src/styles/index.css (`:root`, light
 * Chalk and dark Board, as RGB so opacity modifiers like `bg-ink/10` work);
 * components use these names, never hex. Square-shouldered: 2px small, 4px
 * everything else, full only for dots.
 */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['Newsreader', '"Iowan Old Style"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        surface: token('surface'),
        raised: token('raised'),
        inset: token('inset'),
        line: token('line'),
        'line-strong': token('line-strong'),
        grid: token('grid'),
        ink: token('ink'),
        muted: token('muted'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        bad: token('bad'),
        'on-bad': token('on-bad'),
        highlight: token('highlight'),
        'on-highlight': token('on-highlight'),
        'face-top': token('face-top'),
        'face-left': token('face-left'),
        'face-right': token('face-right'),
      },
      borderRadius: { sm: '2px', DEFAULT: '4px', md: '4px', lg: '4px', xl: '4px' },
      maxWidth: { prose: '65ch' },
    },
  },
  plugins: [],
};

export default config;
