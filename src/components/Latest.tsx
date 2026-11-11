import { Link } from 'react-router-dom';

import { postHref, type Post } from '@/content';
import { formatDate } from '@/lib/dates';

/**
 * The newest posts side by side, each under a rule; the newest under the red pen. On a phone
 * they stack.
 */
export function Latest({ posts }: { posts: Post[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
      {posts.map((post, i) => {
        const where = post.url ? 'Substack' : post.tags[0];
        const inside = (
          <>
            <span className="kicker">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {where && ` · ${where}`}
            </span>
            <span className="font-display text-[1.5rem] font-medium leading-7 group-hover:text-accent">
              {post.title}
            </span>
            <span className="line-clamp-3 text-sm text-muted">{post.summary}</span>
            <span className="mt-auto pt-1 text-xs text-muted">{post.minutes} min read</span>
          </>
        );
        const className = `focus-ring group flex h-full flex-col gap-2 border-t-2 pt-5 ${
          i === 0 ? 'border-bad' : 'border-line'
        }`;
        return (
          <li key={post.slug}>
            {post.url ? (
              <a href={post.url} className={className}>
                {inside}
              </a>
            ) : (
              <Link to={postHref(post)} className={className}>
                {inside}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
