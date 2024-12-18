import { Link } from 'react-router-dom';

import DefaultIcon from '@mui/icons-material/Deblur';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Tooltip from '@mui/material/Tooltip';
import { FlexBox } from '@/components/styled';
import isMobile from '@/utils/is-mobile';

import { HotKeysButton } from './styled';

import routes from '@/routes';
import useSidebar from '@/store/sidebar';
import useHotKeysDialog from '@/store/hotkeys';

function Sidebar() {
  const [isSidebarOpen, sidebarActions] = useSidebar();
  const [, hotKeysDialogActions] = useHotKeysDialog();

  return (
    <SwipeableDrawer
      anchor="left"
      open={isSidebarOpen}
      onClose={sidebarActions.close}
      onOpen={sidebarActions.open}
      disableBackdropTransition={false}
      swipeAreaWidth={30}
      data-pw="sidebar"
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <List sx={{ width: 250, pt: (theme) => `${theme.mixins.toolbar.minHeight}px` }}>
        {Object.values(routes)
          .filter((route) => route.title)
          .map(({ path, title, icon: Icon }) => (
            <ListItem sx={{ p: 0 }} key={path}>
              <ListItemButton component={Link} to={path as string} onClick={sidebarActions.close}>
                <ListItemIcon>{Icon ? <Icon /> : <DefaultIcon />}</ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <FlexBox sx={{ padding: '1em' }}>
        {!isMobile ? (
          <Tooltip title="Hot keys" arrow>
            <HotKeysButton
              size="small"
              variant="outlined"
              aria-label="open hotkeys dialog"
              onClick={hotKeysDialogActions.open}
            >
              alt + k
            </HotKeysButton>
          </Tooltip>
        ) : (
          <Tooltip title="Settings" arrow>
            <HotKeysButton
              size="small"
              color="inherit"
              variant="contained"
              aria-label="open menu dialog"
              onClick={hotKeysDialogActions.open}
            >
              <IconButton color="warning" size="small">
                <SettingsIcon />
              </IconButton>
            </HotKeysButton>
          </Tooltip>
        )}
      </FlexBox>
    </SwipeableDrawer>
  );
}

export default Sidebar;
