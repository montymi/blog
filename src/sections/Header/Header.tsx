import SettingsIcon from '@mui/icons-material/Settings';
import { HotKeysButton } from './styled';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import isMobile from '@/utils/is-mobile';
import { FlexBox } from '@/components/styled';
import { GitHub, Mail, MusicNote } from '@mui/icons-material';
import { repository, title, email, spotify } from '@/config';
import useNotifications from '@/store/notifications';
import useSidebar from '@/store/sidebar';
import useTheme from '@/store/theme';
import useHotKeysDialog from '@/store/hotkeys';
import { getRandomJoke } from './utils';

function Header() {
  const [, hotKeysDialogActions] = useHotKeysDialog();
  const [, sidebarActions] = useSidebar();
  const [theme] = useTheme();
  const [, notificationsActions] = useNotifications();

  function showNotification() {
    notificationsActions.push({
      options: {
        variant: 'customNotification',
      },
      message: getRandomJoke(),
    });
  }

  return (
    <>
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
              <Button className="title-btn" onClick={showNotification} color="inherit">
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
              {/* <Tooltip title="Talk with me" arrow>
                <IconButton
                  color="inherit"
                  component="a"
                  href={`tel:${phone}`} // The tel: link initiates the phone call
                  aria-label="contact phone"
                >
                  <Phone />
                </IconButton>
              </Tooltip> */}
              <Divider orientation="vertical" flexItem />
              <FlexBox>
                {!isMobile ? (
                  <FlexBox sx={{ paddingLeft: '1em', display: 'flex' }}>
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
                  </FlexBox>
                ) : (
                  <FlexBox sx={{ display: 'flex' }}>
                    <Tooltip title="Settings" arrow>
                      <IconButton
                        color="warning"
                        size="small"
                        aria-label="open menu dialog"
                        onClick={hotKeysDialogActions.open}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  </FlexBox>
                )}
              </FlexBox>
            </FlexBox>
          </Toolbar>
        </AppBar>
      </div>
      <style>{`
      /* Webkit browsers */
      ::-webkit-scrollbar {
        width: 5px; /* Adjust width */
        height: 5px; /* Adjust height */
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5); /* Scrollbar thumb color */
        border-radius: 10px; /* Rounded edges */
      }
      ::-webkit-scrollbar-track {
        background: transparent; /* Track background color */
      }
      /* For Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.5) transparent;
      }
    `}</style>
    </>
  );
}

export default Header;
