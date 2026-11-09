export type FrontmatterValue = string | number | string[];

export interface Parsed {
  data: Record<string, FrontmatterValue>;
  body: string;
}

/**
 * Splits a markdown file into its `---` frontmatter and body. Reads the small subset of YAML
 * these posts use: `key: value`, quoted strings, numbers and `["a", "b"]` lists. A file without
 * frontmatter is all body.
 */
export function parseFrontmatter(text: string): Parsed {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { data: {}, body: text };
  const data: Record<string, FrontmatterValue> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) continue;
    data[pair[1]] = value(pair[2].trim());
  }
  return { data, body: text.slice(match[0].length) };
}

function value(raw: string): FrontmatterValue {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter(Boolean);
  }
  const text = unquote(raw);
  return text !== raw || !/^-?\d+(\.\d+)?$/.test(raw) ? text : Number(raw);
}

function unquote(text: string): string {
  return /^(["']).*\1$/.test(text) ? text.slice(1, -1) : text;
}
