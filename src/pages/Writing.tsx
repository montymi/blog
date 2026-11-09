import { Link, useParams } from 'react-router-dom';

import { MarginList } from '@/components/MarginList';
import { Kicker, Markdown, Meta, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { postBySlug, posts } from '@/content';

import NotFound from './NotFound';

export function Writing() {
  return (
    <div className="flex flex-col gap-10">
      <Meta title="Writing" description="Posts by Michael Montanaro, newest first." />
      <PageHeader title="Writing">Newest first.</PageHeader>
      <MarginList posts={posts} />
    </div>
  );
}

export function Post() {
  const { slug = '' } = useParams();
  const post = postBySlug(slug);
  if (!post) return <NotFound />;
  const index = posts.indexOf(post);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  return (
    <article className="flex flex-col gap-8">
      <Meta title={post.title} description={post.summary} />
      <PageHeader
        kicker={`${formatDate(post.date)} · ${post.minutes} min${
          post.tags.length ? ` · ${post.tags.join(', ')}` : ''
        }`}
        title={post.title}
      />
      <Markdown>{post.body}</Markdown>
      <nav
        aria-label="More writing"
        className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2"
      >
        {older && (
          <Link to={`/writing/${older.slug}`} className="door">
            <Kicker as="span">Older</Kicker>
            <span className="door-name font-semibold">{older.title}</span>
          </Link>
        )}
        {newer && (
          <Link to={`/writing/${newer.slug}`} className="door sm:col-start-2 sm:text-right">
            <Kicker as="span">Newer</Kicker>
            <span className="door-name font-semibold">{newer.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
