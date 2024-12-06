import { Fragment, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Analytics } from '@vercel/analytics/next';
import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import Header from '@/sections/Header';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import Sidebar from '@/sections/Sidebar';
import Blog from './sections/Blog';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/posts.json');
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.statusText}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        // Optionally, display a notification to the user
      }
    }
    fetchPosts();
  }, [setPosts]);

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
          <Blog posts={posts} />
          <Pages />
        </BrowserRouter>
      </Fragment>
      {process.env.NODE_ENV === 'production' && <Analytics mode="production" />}
      {process.env.NODE_ENV !== 'production' && <Analytics debug={true} />}
    </div>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
