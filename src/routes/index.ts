import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined';
import { LibraryBooksOutlined, InboxOutlined } from '@mui/icons-material';

import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: HomeOutlinedIcon,
  },
  [Pages.Library]: {
    component: asyncComponentLoader(() => import('@/pages/Library')),
    path: '/library',
    title: 'Library',
    icon: LibraryBooksOutlined,
  },
  [Pages.Activity]: {
    component: asyncComponentLoader(() => import('@/pages/Activity')),
    path: '/activity',
    title: 'Activity',
    icon: TerrainOutlinedIcon,
  },
  [Pages.Discography]: {
    component: asyncComponentLoader(() => import('@/pages/Discography')),
    path: '/discography',
    title: 'Discography',
    icon: AlbumOutlinedIcon,
  },
  [Pages.Blog]: {
    component: asyncComponentLoader(() => import('@/pages/Blog')),
    path: '/blog',
    title: 'Blog',
    icon: InboxOutlined,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
