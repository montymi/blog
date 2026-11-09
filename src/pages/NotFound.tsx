import { Link } from 'react-router-dom';

import { Meta, PageHeader } from '@/components/ui';

function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Meta title="Not found" />
      <PageHeader kicker="404" title="Nothing here">
        Nothing lives at this address. The front page lists everything that does.
      </PageHeader>
      <Link to="/" className="btn-primary">
        Go to the front page
      </Link>
    </div>
  );
}

export default NotFound;
