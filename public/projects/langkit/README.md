# Langkit

A reusable contract for app query languages, maintained in [Styx](/projects/styx). Standard-library Python, with no runtime dependencies.

## One contract, app-owned languages

Each app supplies its own parser and domain vocabulary. Langkit gives those different languages the same three operations:

- **grammar** describes verbs, examples, and capabilities.
- **check** returns the parsed sentence, tokens, canonical form, and effect, or a refusal.
- **run** binds execution to that interpretation and returns a consistent result.

The execution helpers provide dry runs before changes, version binding, atomic batches, and idempotency hooks. The app supplies its execution logic, transactions, and persistence; it declares which capabilities it supports.

## In use

[Chess](/projects/chess) and [LazyGrocer](/projects/lazygrocer) already vendor pinned copies from Charon. [Connect](/projects/mcp) consumes the shared language contract to discover and invoke their capabilities. The same library can support other apps without imposing one universal parser.

## Source

The package declares version **0.1.0**. [View the source in Charon](https://github.com/montymi/charon/tree/main/langkit) (private repository). Current distribution uses pinned source copies; this page does not imply a public package-registry release.
