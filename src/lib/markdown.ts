import matter from 'gray-matter';
import { Buffer } from 'buffer';

// gray-matter expects Node's Buffer; polyfill once for the browser. Both
// usePosts and useReadMe used to carry this same guard independently.
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

export interface ParsedMarkdown {
  data: Record<string, string | number | boolean>;
  content: string;
}

/** Parse a markdown file's frontmatter + body. Shared by usePosts and useReadMe. */
export function parseMarkdown(text: string): ParsedMarkdown {
  const { data, content } = matter(text);
  return { data, content };
}
