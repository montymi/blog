import AlbumIcon from '@mui/icons-material/Album';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import TerrainIcon from '@mui/icons-material/Terrain';
import { LibraryBooksOutlined } from '@mui/icons-material';

import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: HomeIcon,
  },
  [Pages.Library]: {
    component: asyncComponentLoader(() => import('@/pages/Library')),
    path: '/library',
    title: 'Library',
    icon: LibraryBooksOutlined,
  },
  [Pages.Page3]: {
    component: asyncComponentLoader(() => import('@/pages/Page3')),
    path: '/page-3',
    title: 'Page 3',
    icon: TerrainIcon,
  },
  [Pages.Page4]: {
    component: asyncComponentLoader(() => import('@/pages/Page4')),
    path: '/page-4',
    title: 'Page 4',
    icon: BugReportIcon,
  },
  [Pages.Discography]: {
    component: asyncComponentLoader(() => import('@/pages/Discography')),
    path: '/discography',
    title: 'Discography',
    icon: AlbumIcon,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
