import { Fragment, Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Header from '@/sections/Header';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import Sidebar from '@/sections/Sidebar';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

const Pages = lazy(() => import('@/routes/Pages'));

function App() {
  return (
    <div>
      <Fragment>
        <CssBaseline />
        <Notifications />
        <HotKeys />
        <SW />
        <BrowserRouter>
          <Header />
          <Sidebar />
          <Suspense fallback={<div>Loading...</div>}>
            <Pages />
          </Suspense>{' '}
        </BrowserRouter>
      </Fragment>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </div>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
