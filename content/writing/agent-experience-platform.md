---
title: "Building an agent experience platform"
date: 2026-11-16
tags: [agents, apps, identity]
---

I have been building apps. Now I am building the platform that lets an agent use them on your behalf, with your identity, your permissions, and a record of what happened.

I think of it as an **agent experience platform**. The experience includes finding an app, understanding what it can do, getting access, checking a request, and knowing whether an action actually ran.

## The apps give it a purpose

[LazyGrocer](https://chef.montymi.com) plans a week of meals and produces one grocery list. [Chess](https://chess.montymi.com) lets you play and explore your games, mistakes, and openings. You can use the apps directly, or reach their capabilities through an assistant.

Each app speaks its own language. The platform gives those languages a common contract: discover the grammar, check a sentence, ask a question, or carry out a change.

## Three addresses, three jobs

**[Styx](https://styx.montymi.com)** is the identity layer. It handles sign-in, OAuth / OIDC, and the roles that establish who a person is within a deployment.

**[Charon](https://charon.montymi.com)** is the control plane. Together with Hades, the hospitality policy system, it manages access requests, grants, approvals, expiry, revocation, and quotas. Its operator console requires sign-in. Sharing access to an app gives someone their own account and data; it does not hand them mine.

**Connect** is the gateway agents and programs use. One connector reaches the apps:

```text
https://connect.montymi.com/mcp
```

In Claude, add that address as a custom connector under Settings → Connectors. Sign in through Styx when prompted. The old per-app connectors on `mcp.montymi.com` are retired.

Programs can use the same gateway through REST at `https://connect.montymi.com/rest/v1`, with live events over WebSocket. The entry point changes; the identity and policy checks stay the same.

## Acting should be understandable

A write is checked before it runs. A warning pauses it until confirmed. Batches are all or nothing. Idempotency keys let a client retry the same intended change without running it again within the gateway's retention window.

The gateway records each invocation and its outcome, including requests that were refused or paused. Policy is written in a language compiled to Cedar. Quotas, background jobs, and live events support the work around an invocation too.

An agent starts with **obol**, the directory of available apps and capabilities. It can discover what is here before trying to use it.

## Choose your boundary

The same architecture supports a private deployment for a person, family, or team; a shared deployment where people get separate accounts; or an independently operated stack with its own identity authority, gateway, policies, and services.

Independent operators can establish trust through signed federation and verified account linking. Signed public log heads and peer witnesses make changes to history detectable. Each operator keeps authority over their own network.

That is what I mean by hospitality: I can offer you something useful that I run, with explicit terms for access, while you retain your own boundaries.

## Still growing

The remaining work includes bringing another independent network into the federation, apps declaring their own retry protection, and a personal view of obol. The private documentation site behind Styx is deferred.

For now, the board has more pieces: apps to use, identity to sign in, policy to govern access, and one connection through which an agent can act.
