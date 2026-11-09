/**
 * The montymi contract, version 1: what an app on *.montymi.com publishes about itself, and how
 * montymi.com asks it to read a sentence.
 *
 *   GET <app>/.well-known/montymi.json   the manifest: who the app is, its health, its language
 *   GET <language.check with {query}>    the check: was the sentence understood, and how
 *
 * Everything here is plain data and pure functions, shared by the browser and the server
 * functions in api/. A value that doesn't fit the contract is refused (null), never guessed at.
 */

/** Each word's part, a closed set: any app's language is set in one typography by these. */
export const ROLES = ['verb', 'keyword', 'number', 'value', 'operator'] as const;
export type Role = (typeof ROLES)[number];

export interface Manifest {
  montymi: 1;
  id: string;
  name: string;
  about: string;
  url: string;
  health: string;
  repo?: string;
  language?: {
    name: string;
    verbs: string[];
    examples: string[];
    /** A URL with `{query}` where the sentence goes. */
    check: string;
    open: string;
    grammar?: string;
  };
  assistant?: { connect?: string; mcp?: string };
}

export interface Token {
  text: string;
  at: number;
  role: Role | null;
}

export interface Check {
  ok: boolean;
  tokens: Token[];
  /** The sentence as the app understood it, in its own words (when ok). */
  canonical?: string;
  /** What went wrong and where, as a character offset (when not ok). */
  message?: string;
  at?: number;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isText = (v: unknown, max = 500): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= max;
const isHttps = (v: unknown): v is string =>
  isText(v, 300) && /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(v);
const isWords = (v: unknown): v is string[] =>
  Array.isArray(v) && v.length <= 32 && v.every((w) => isText(w, 200));

/** A manifest exactly as the contract describes it, or null. Extra fields are dropped. */
export function readManifest(value: unknown): Manifest | null {
  if (!isObject(value) || value.montymi !== 1) return null;
  const { id, name, about, url, health, repo, language, assistant } = value;
  if (!(isText(id, 40) && /^[a-z][a-z0-9-]*$/.test(id) && isText(name, 80) && isText(about, 200)))
    return null;
  if (!(isHttps(url) && isHttps(health))) return null;
  const manifest: Manifest = { montymi: 1, id, name, about, url, health };
  if (isText(repo, 100)) manifest.repo = repo;
  if (isObject(language)) {
    const { name: lname, verbs, examples, check, open, grammar } = language;
    const lowercase = isWords(verbs) && verbs.every((v) => /^[a-z]+$/.test(v));
    if (isText(lname, 80) && lowercase && isWords(examples) && isHttps(check) && isHttps(open)) {
      if (check.includes('{query}') && open.includes('{query}')) {
        manifest.language = { name: lname, verbs, examples, check, open };
        if (isHttps(grammar)) manifest.language.grammar = grammar;
      }
    }
  }
  if (isObject(assistant)) {
    manifest.assistant = {};
    if (isHttps(assistant.connect)) manifest.assistant.connect = assistant.connect;
    if (isHttps(assistant.mcp)) manifest.assistant.mcp = assistant.mcp;
  }
  return manifest;
}

/** A check answer exactly as the contract describes it, or null. Unknown roles read as plain. */
export function readCheck(value: unknown): Check | null {
  if (!isObject(value) || typeof value.ok !== 'boolean' || !Array.isArray(value.tokens))
    return null;
  const tokens: Token[] = [];
  for (const token of value.tokens.slice(0, 200)) {
    if (!isObject(token) || typeof token.text !== 'string' || typeof token.at !== 'number')
      return null;
    const role = (ROLES as readonly unknown[]).includes(token.role) ? (token.role as Role) : null;
    tokens.push({ text: token.text, at: token.at, role });
  }
  const check: Check = { ok: value.ok, tokens };
  if (value.ok && isText(value.canonical)) check.canonical = value.canonical;
  if (!value.ok) {
    check.message = isText(value.message) ? value.message : 'This sentence could not be read.';
    check.at = typeof value.at === 'number' && value.at >= 0 ? value.at : 0;
  }
  return check;
}

/** A URL template with the sentence put in its place, encoded. */
export function fill(template: string, query: string): string {
  return template.replace('{query}', encodeURIComponent(query.trim()));
}

/**
 * Which app's language a sentence is in, by its first word. Verbs are owned by exactly one app
 * (registry.spec.ts fails the build on a clash), so this never has to choose.
 */
export function route(text: string, apps: Manifest[]): Manifest | null {
  const verb = text.trim().split(/\s+/, 1)[0]?.toLowerCase() ?? '';
  return apps.find((app) => app.language?.verbs.includes(verb)) ?? null;
}

/** The permalink for a sentence: montymi.com/q/<sentence>. */
export const permalink = (query: string) => `/q/${encodeURIComponent(query.trim())}`;
