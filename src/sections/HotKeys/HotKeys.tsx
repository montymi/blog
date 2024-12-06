import { useHotkeys } from 'react-hotkeys-hook';
import ThemeIcon from '@mui/icons-material/InvertColors';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { FlexBox } from '@/components/styled';
import useHotKeysDialog from '@/store/hotkeys';
import useSidebar from '@/store/sidebar';
import useTheme from '@/store/theme';
import useBlog from '@/store/blog';
import isMobile from '@/utils/is-mobile';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { Close, Inbox } from '@mui/icons-material';
import muiLogo from './logos/mui.svg';
import pwaLogo from './logos/pwa.svg';
import reactLogo from './logos/react_ed.svg';
import recoilLogo from './logos/recoil.svg';
import rrLogo from './logos/rr.svg';
import tsLogo from './logos/ts.svg';
import viteLogo from './logos/vite.svg';
import threeLogo from './logos/three_js.svg';

const logos = [
  { alt: 'React Router', src: rrLogo },
  { alt: 'Vite', src: viteLogo },
  { alt: 'TypeScript', src: tsLogo },
  { alt: 'React', src: reactLogo },
  { alt: 'MUI', src: muiLogo },
  { alt: 'Recoil', src: recoilLogo },
  { alt: 'PWA', src: pwaLogo },
  { alt: 'Three.js', src: threeLogo },
];

function HotKeys() {
  const [, themeActions] = useTheme();
  const [, sidebarActions] = useSidebar();
  const [, blogActions] = useBlog();
  const [isHotKeysDialogOpen, hotKeysDialogActions] = useHotKeysDialog();

  // I would love to define all hotkeys in the config and loop it here and avoid this repetitive code.
  // But the `react-hotkeys-hook` library, which we use to handle hotkeys provides only hook (`useHotkeys`).
  // And as you know we can't use hooks inside loops (read "Rules of Hooks" - https://reactjs.org/docs/hooks-rules.html).
  // There is always a workaround, but sometimes it's better to avoid premature and unnecessary optimizations :)
  useHotkeys('alt+s', sidebarActions.toggle);
  useHotkeys('alt+t', themeActions.toggle);
  useHotkeys('alt+k', hotKeysDialogActions.toggle);
  useHotkeys('alt+b', blogActions.toggle);

  return (
    <Dialog
      onClose={hotKeysDialogActions.close}
      open={isHotKeysDialogOpen}
      data-pw="hotkeys-dialog"
    >
      <DialogContent>
        <FlexBox alignItems="center" height={50} justifyContent="space-between">
          <DialogTitle style={{ margin: 0, padding: 0, fontSize: '1.5rem' }}>
            {!isMobile ? 'Hot Keys' : 'Menu'}
          </DialogTitle>
          {!isMobile ? (
            <Button color="warning" variant="outlined" onClick={hotKeysDialogActions.toggle}>
              alt + k
            </Button>
          ) : (
            <IconButton color="warning" onClick={hotKeysDialogActions.toggle}>
              <Close />
            </IconButton>
          )}
        </FlexBox>
        <Divider orientation="horizontal" />
        <FlexBox alignItems="center" height={50} justifyContent="space-between">
          <Typography>View Blog</Typography>
          {!isMobile ? (
            <Button color="warning" variant="outlined" onClick={blogActions.toggle}>
              alt + b
            </Button>
          ) : (
            <IconButton color="secondary" onClick={blogActions.toggle}>
              <Inbox />
            </IconButton>
          )}
        </FlexBox>
        <FlexBox alignItems="center" height={50} justifyContent="space-between">
          <Typography>Change Theme</Typography>
          {!isMobile ? (
            <Button color="warning" variant="outlined" onClick={themeActions.toggle}>
              alt + t
            </Button>
          ) : (
            <IconButton color="secondary" onClick={themeActions.toggle}>
              <ThemeIcon />
            </IconButton>
          )}
        </FlexBox>
        <FlexBox alignItems="center" height={50} justifyContent="space-between">
          <Typography>Open Sidebar</Typography>
          {!isMobile ? (
            <Button color="warning" variant="outlined" onClick={sidebarActions.toggle}>
              alt + s
            </Button>
          ) : (
            <IconButton color="secondary" onClick={sidebarActions.toggle}>
              <MenuIcon />
            </IconButton>
          )}
        </FlexBox>
        <Divider orientation="horizontal" />
        <FlexBox alignItems="center" height={50} width="100%" justifyContent="space-between">
          <Typography>Built with:</Typography>
        </FlexBox>
        <Grid container spacing={2} justifyContent="center">
          {logos.map((logo, index) => (
            <Grid item key={index}>
              <Tooltip title={logo.alt}>
                <Avatar src={logo.src} alt={logo.alt} />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default HotKeys;
