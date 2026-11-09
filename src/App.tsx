import { Fragment, Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import CssBaseline from '@mui/material/CssBaseline';

import Loading from '@/components/Loading';
import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import NavOverlay from '@/sections/NavOverlay';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import { injectSpeedInsights } from '@vercel/speed-insights';

/* eslint-disable react-refresh/only-export-components -- SPA root: the
   module-level injectSpeedInsights() call and the error-boundary-HOC-wrapped
   default export already mean Fast Refresh can't preserve state here, so the
   rule's warning has nothing to protect. */

injectSpeedInsights();

const Pages = lazy(() => import('@/routes/Pages'));

function App() {
  return (
    <div>
      <Fragment>
        <CssBaseline />
        <Notifications />
        <SW />
        <BrowserRouter>
          <NavOverlay />
          <Suspense fallback={<Loading />}>
            <Pages />
          </Suspense>
        </BrowserRouter>
      </Fragment>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </div>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
