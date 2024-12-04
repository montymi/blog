import ThemeIcon from '@mui/icons-material/InvertColors';
import InboxIcon from '@mui/icons-material/Inbox';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { FlexBox } from '@/components/styled';
import { GitHub, Mail, MusicNote, Phone } from '@mui/icons-material';
import { repository, title, email, phone, spotify } from '@/config';
import useNotifications from '@/store/notifications';
import useSidebar from '@/store/sidebar';
import useTheme from '@/store/theme';

import { getRandomJoke } from './utils';
import useBlog from '@/store/blog';

function Header() {
  const [, sidebarActions] = useSidebar();
  const [, blogActions] = useBlog();
  const [theme, themeActions] = useTheme();
  const [, notificationsActions] = useNotifications();

  function showNotification() {
    notificationsActions.push({
      options: {
        // Show fully customized notification
        // Usually, to show a notification, you'll use something like this:
        // notificationsActions.push({ message: ... })
        // `message` accepts string as well as ReactNode
        // If you want to show a fully customized notification, you can define
        // your own `variant`s, see @/sections/Notifications/Notifications.tsx
        variant: 'customNotification',
      },
      message: getRandomJoke(),
    });
  }

  return (
    <div style={{ flexGrow: 1 }} data-pw={`theme-${theme}`}>
      <AppBar color="transparent" elevation={1} position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <FlexBox sx={{ alignItems: 'center' }}>
            <IconButton
              onClick={sidebarActions.toggle}
              size="large"
              edge="start"
              color="secondary"
              aria-label="menu"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Button onClick={showNotification} color="inherit">
              {title}
            </Button>
          </FlexBox>
          <FlexBox>
            <Tooltip title="Code with me" arrow>
              <IconButton
                color="inherit"
                size="large"
                component="a"
                href={repository}
                target="_blank"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Tooltip title="Listen with me" arrow>
              <IconButton
                color="inherit"
                size="large"
                component="a"
                href={spotify}
                target="_blank"
                rel="noreferrer"
                aria-label="view spotify"
              >
                <MusicNote />
              </IconButton>
            </Tooltip>
            <Tooltip title="Write to me" arrow>
              <IconButton
                color="inherit"
                component="a"
                href={`mailto:${email}`}
                aria-label="contact email"
              >
                <Mail />
              </IconButton>
            </Tooltip>
            <Tooltip title="Talk with me" arrow>
              <IconButton
                color="inherit"
                component="a"
                href={`tel:${phone}`} // The tel: link initiates the phone call
                aria-label="contact phone"
              >
                <Phone />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Open Blog" arrow>
              <IconButton
                color="secondary"
                edge="end"
                size="large"
                onClick={blogActions.toggle}
                data-pw="blog-toggle"
              >
                <InboxIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Switch theme" arrow>
              <IconButton
                color="secondary"
                edge="end"
                size="large"
                onClick={themeActions.toggle}
                data-pw="theme-toggle"
              >
                <ThemeIcon />
              </IconButton>
            </Tooltip>
          </FlexBox>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
