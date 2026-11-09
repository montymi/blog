/**
 * The apps montymi.com fronts: one origin per line. Adding an app is adding its origin here and
 * a snapshot of its manifest in content/apps/ (what the site shows until, and whenever, the live
 * manifest can't be fetched). Everything else (name, status, language, assistant) comes from
 * the manifest.
 */
import chef from '../../content/apps/chef.json';
import chess from '../../content/apps/chess.json';

import { readManifest, type Manifest } from './contract';

export const REGISTRY: { origin: string; snapshot: unknown }[] = [
  { origin: 'https://chef.montymi.com', snapshot: chef },
  { origin: 'https://chess.montymi.com', snapshot: chess },
];

/** The bundled manifests, in registry order: the site's knowledge of its apps with no network. */
export const SNAPSHOTS: Manifest[] = REGISTRY.map(({ snapshot }) => readManifest(snapshot)).filter(
  (manifest): manifest is Manifest => manifest !== null,
);

export const manifestUrl = (origin: string) => `${origin}/.well-known/montymi.json`;
