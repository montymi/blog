# Authkit

Reusable sign-in and authorization for apps, maintained in [Charon](/projects/charon).

## What it provides

Authkit implements OAuth / OIDC sign-in, PKCE, verified identity tokens, and app-specific roles. An app receives a subject and its own role claims. Session renewal rechecks access; logout notices let the app end the corresponding sessions.

Identity-provider-specific claims are isolated behind an adapter. Each app supplies its configuration and keeps its own account data and session handling.

## In use

[Chess](/projects/chess) and [LazyGrocer](/projects/lazygrocer) already use pinned copies from Charon. Their drift checks compare those copies with the recorded source commit. This is a working shared library, structured as a Python package; its current distribution is through the private repository and vendored copies.

## Source

The package declares version **0.1.0**. [View the source in Charon](https://github.com/montymi/charon/tree/main/authkit) (private repository).
