import { Link } from 'react-router-dom';

import { postHref, type Post } from '@/content';
import { formatDate } from '@/lib/dates';

/**
 * Posts as lines in the notebook: the date sits in the margin, left of the red margin rule,
 * and the writing to its right. On a phone the date moves above the title.
 */
export function MarginList({ posts }: { posts: Post[] }) {
  return (
    <ol className="flex flex-col">
      {posts.map((post) => (
        <li key={post.slug}>
          {post.url ? (
            <a
              href={post.url}
              className="focus-ring group grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-0 sm:py-0"
            >
              <time
                dateTime={post.date}
                className="font-mono text-xs text-muted sm:pr-4 sm:pt-[1.3rem] sm:text-right"
              >
                {formatDate(post.date)}
              </time>
              <span className="flex flex-col gap-1 sm:border-l-2 sm:border-bad/50 sm:py-4 sm:pl-6">
                <span className="text-[1.3125rem] font-semibold leading-7 group-hover:text-accent">
                  {post.title}
                </span>
                <span className="max-w-prose text-sm text-muted">{post.summary}</span>
                <span className="text-xs text-muted">
                  {post.minutes} min read{post.tags.length > 0 && `, ${post.tags.join(', ')}`}
                  {post.url && `, on ${new URL(post.url).hostname.replace(/^[^.]+\./, '')}`}
                </span>
              </span>
            </a>
          ) : (
            <Link
              to={postHref(post)}
              className="focus-ring group grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-0 sm:py-0"
            >
              <time
                dateTime={post.date}
                className="font-mono text-xs text-muted sm:pr-4 sm:pt-[1.3rem] sm:text-right"
              >
                {formatDate(post.date)}
              </time>
              <span className="flex flex-col gap-1 sm:border-l-2 sm:border-bad/50 sm:py-4 sm:pl-6">
                <span className="text-[1.3125rem] font-semibold leading-7 group-hover:text-accent">
                  {post.title}
                </span>
                <span className="max-w-prose text-sm text-muted">{post.summary}</span>
                <span className="text-xs text-muted">
                  {post.minutes} min read{post.tags.length > 0 && `, ${post.tags.join(', ')}`}
                  {post.url && `, on ${new URL(post.url).hostname.replace(/^[^.]+\./, '')}`}
                </span>
              </span>
            </Link>
          )}
        </li>
      ))}
    </ol>
  );
}
