import { Link, useParams } from 'react-router-dom';

import { MarginList } from '@/components/MarginList';
import { Kicker, Markdown, Meta, PageHeader } from '@/components/ui';
import { formatDate } from '@/lib/dates';
import { postBySlug, posts, reports } from '@/content';

import NotFound from './NotFound';

export function Writing() {
  return (
    <div className="flex flex-col gap-10">
      <Meta
        title="Writing"
        description="Essays, posts, and research reports by Michael Montanaro."
      />
      <PageHeader title="Writing">
        Essays, posts, and research reports. Writing published on{' '}
        <a href="https://michaelmontanaro.substack.com" className="link">
          Substack
        </a>{' '}
        and{' '}
        <a href="https://blitzy.com/blog" className="link">
          Blitzy
        </a>{' '}
        is listed here too, and opens at its original source.
      </PageHeader>
      <MarginList posts={posts} />
      <section id="reports" aria-labelledby="reports-title" className="flex flex-col gap-4">
        <h2 id="reports-title" className="font-display text-3xl">
          Research reports
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {[...reports]
            .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
            .map((report) => (
              <li key={report.file}>
                <a href={report.file} className="focus-ring flex flex-col gap-2 py-5">
                  <span className="text-xl font-semibold">{report.title}</span>
                  <span className="text-sm text-muted">
                    PDF · {report.pages} pages{report.date && ` · ${formatDate(report.date)}`}
                  </span>
                </a>
                {report.project && (
                  <Link
                    to={`/projects/${report.project}`}
                    className="link mb-5 inline-block text-sm"
                  >
                    Explore the project →
                  </Link>
                )}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

export function Post() {
  const { slug = '' } = useParams();
  const post = postBySlug(slug);
  if (!post) return <NotFound />;
  // Older and newer among the posts that have a page here.
  const here = posts.filter((p) => !p.url);
  const index = here.indexOf(post);
  const newer = here[index - 1];
  const older = here[index + 1];
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
