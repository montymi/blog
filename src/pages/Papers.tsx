import { Kicker, Meta, PageHeader } from '@/components/ui';
import { papers } from '@/content';

// Each paper opens in the browser's own PDF reader: it zooms, searches and downloads
// better than anything this site could bundle.
function Papers() {
  return (
    <div className="flex flex-col gap-8">
      <Meta title="Papers" description="Michael Montanaro's résumé and papers, as PDFs." />
      <PageHeader title="Papers">Each one opens as a PDF in your browser.</PageHeader>
      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {papers.map((paper) => (
          <li key={paper.file}>
            <a
              href={paper.file}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
            >
              <span className="text-[1.3125rem] font-semibold leading-7 group-hover:text-accent">
                {paper.title}
              </span>
              <Kicker as="span">
                PDF · {paper.pages} {paper.pages === 1 ? 'page' : 'pages'}
              </Kicker>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Papers;
