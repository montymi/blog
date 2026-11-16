# Charon

The foundation of an agent experience platform: access policy, audit, federation, and reusable application libraries.

[Open Charon](https://charon.montymi.com)

## What it does

Charon manages the platform’s app access, requests, grants, policy, and audit trails. Its operator console requires sign-in. Styx provides identity; Connect gives agents a common way to discover and use app capabilities.

## Reusable foundations

Charon also houses [Authkit](/projects/authkit) and [Langkit](/projects/langkit), both version 0.1.0. Chess and LazyGrocer already use pinned copies of both.

Authkit provides shared sign-in and app-specific authorization. Langkit standardizes grammar, checking, and execution across app-owned query languages, including dry runs, batches, and idempotency hooks. Connect consumes that contract to give agents one gateway to the apps.

## Source

The Charon operator service is the `auth-mcp` package, which declares version 0.1.0. Styx’s integration also lives in this repository.

This is the public project overview. The [source repository](https://github.com/montymi/charon) is private and requires GitHub access. The Started date records the earliest source history date, not a tagged release.
