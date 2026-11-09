import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import Layout from '@/components/Layout';
import { contact } from '@/config';
import { MOVED } from '@/moved';
import About from '@/pages/About';
import Ask from '@/pages/Ask';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Papers from '@/pages/Papers';
import { ProjectPage, Projects } from '@/pages/Projects';
import { Post, Writing } from '@/pages/Writing';

function Crashed() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-16">
      <p className="kicker">Something broke</p>
      <h1 className="screen-title">This page stopped working</h1>
      <p className="max-w-prose text-muted">
        Reload to try again. If it keeps happening, write to{' '}
        <span className="select-all font-mono text-ink">{contact.email}</span> and say which page
        you were on.
      </p>
      <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
        Reload
      </button>
    </main>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="writing" element={<Writing />} />
        <Route path="writing/:slug" element={<Post />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectPage />} />
        <Route path="papers" element={<Papers />} />
        <Route path="about" element={<About />} />
        <Route path="q/*" element={<Ask />} />
        {Object.entries(MOVED).map(([from, to]) => (
          <Route key={from} path={from.slice(1)} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={Crashed}>
      <HelmetProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
      {import.meta.env.PROD && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;
