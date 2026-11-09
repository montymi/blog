/**
 * ESLint 9 flat configuration (ES module).
 *
 * Entry point for `npm run lint:check` (`eslint .`). Lints the TypeScript /
 * React single-page app under `src/`.
 *
 * Composition (order is significant):
 *   1. Global ignore patterns.
 *   2. typescript-eslint recommended (non type-checked) — the TypeScript
 *      parser plus a pragmatic set of syntactic rules.
 *   3. eslint-plugin-react recommended — JSX-specific correctness rules
 *      (blog renders MUI-heavy JSX throughout, unlike a Tailwind-only SPA).
 *   4. eslint-plugin-react-hooks (recommended) — enforces the Rules of Hooks
 *      and flags missing effect dependencies.
 *   5. eslint-plugin-react-refresh (Vite preset) — keeps modules fast-refresh
 *      friendly for the Vite dev server.
 *   6. Project block — browser/DOM globals, JSX runtime, and the project's
 *      own relaxed/stricter rule overrides.
 */
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1) Build output, coverage reports, and installed dependencies are never linted.
  {
    ignores: [
      'dist/**',
      'dev-dist/**',
      'dist-ssr/**',
      '.vercel/**',
      'coverage/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },

  // 2) typescript-eslint's recommended (non type-checked) preset. Supplies
  //    the TypeScript parser plus syntactic rules without requiring
  //    parserOptions.project, which keeps the lint step fast.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3) React correctness rules for JSX.
  react.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 4) React Hooks rules: `react-hooks/rules-of-hooks` (error) and
  //    `react-hooks/exhaustive-deps` (warn).
  reactHooks.configs['recommended-latest'],

  // 5) React Refresh rule (`react-refresh/only-export-components`) for the
  //    Vite dev server's fast-refresh boundary; a no-op on non-component modules.
  reactRefresh.configs.vite,

  // 6) Application source. Declares the browser/DOM runtime globals the SPA
  //    uses, turns off the legacy JSX-scope requirement (React 17+ runtime),
  //    and keeps the project's own carried-over rules.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDivElement: 'readonly',
      },
    },
    rules: {
      // React 17+ JSX runtime: no `import React` needed per file.
      'react/react-in-jsx-scope': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@mui/*/*/*'],
        },
      ],
      // Unused identifiers are warnings; an underscore prefix opts a binding out.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // `any` is discouraged but allowed as a warning during active development.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
