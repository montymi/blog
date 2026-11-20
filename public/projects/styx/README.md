# Styx

One sign-in for the montymi apps, and everything that keeps it honest.

[Ask to join](https://montymi.com/join)

## What you get

- **One way in.** Sign in once with your Google account, and every app you've been let into knows you. Ask to join with the address you'll sign in with; you follow your request on a page of your own, and every request is decided by a person.
- **Your apps, with your assistant.** [Connect](/projects/mcp) gives Claude and other assistants one way to use the apps, with your identity and your permissions.
- **Apps of your own.** Members can publish an app here. Before anyone uses it, they can check its sign-in turns away people they haven't approved; after that, they choose who gets in and can remove anyone at any time. Published apps sign people in on their own instance, so they never learn which other apps a member uses.
- **Your own network, if you'd rather.** Anyone can run their own version and, if we both agree, join as equals. Neither of us is in charge of the other.

## How it's built

Styx is built on ZITADEL for sign-in, OAuth / OIDC and roles. Around it sit an access service that records every request, grant and decision in a log nobody can quietly rewrite, a monthly proof that backups restore, and two reusable libraries the apps share:

- [Authkit](/projects/authkit): sign-in and app-specific roles for any app.
- [Langkit](/projects/langkit): one contract for each app's own query language, which Connect uses.

## Source

This is the public project overview. The [source repository](https://github.com/montymi/charon) is private and requires GitHub access. The Started date records the earliest source history date, not a tagged release.
