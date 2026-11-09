import { useHotkeys } from 'react-hotkeys-hook';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { email, linkedin, repository, spotify } from '@/config';
import useNav from '@/store/nav';

import Constellation from './Constellation';
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

/**
 * The single overlay secondary controls live behind — merges what the old
 * AppBar toolbar, Sidebar drawer, and HotKeys dialog each did separately:
 * page navigation, external links, the hotkey hint, and the "built with"
 * credits row. Page navigation is a constellation (see Constellation.tsx)
 * instead of a flat link list — the same model now opens from both the
 * corner menu badge (every page) and the disc (Welcome), replacing what
 * used to be two different navigation UIs.
 */
function NavOverlay() {
  const [isOpen, navActions] = useNav();

  useHotkeys('alt+k', navActions.toggle);

  return (
    <Dialog onClose={navActions.close} open={isOpen} fullWidth maxWidth="xs" data-pw="nav-overlay">
      <DialogContent sx={{ p: 0 }}>
        <IconButton
          onClick={navActions.close}
          aria-label="Close menu"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>

        <Grid container sx={{ pt: 4, pb: 1 }}>
          <Grid item xs={12}>
            <Constellation />
          </Grid>
        </Grid>

        <Divider />

        <List>
          <ListItemButton component="a" href={repository} target="_blank" rel="noreferrer">
            <ListItemIcon sx={{ minWidth: 36 }}>
              <GitHubIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="GitHub" />
          </ListItemButton>
          <ListItemButton component="a" href={linkedin} target="_blank" rel="noreferrer">
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LinkedInIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="LinkedIn" />
          </ListItemButton>
          <ListItemButton component="a" href={spotify} target="_blank" rel="noreferrer">
            <ListItemIcon sx={{ minWidth: 36 }}>
              <MusicNoteOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Spotify" />
          </ListItemButton>
          <ListItemButton component="a" href={`mailto:${email}`}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <MailOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Email" />
          </ListItemButton>
        </List>

        <Divider />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', px: 2, pt: 2, fontFamily: '"IBM Plex Mono", monospace' }}
        >
          alt + k
        </Typography>

        <Grid container spacing={1} justifyContent="center" sx={{ p: 2 }}>
          {logos.map((logo) => (
            <Grid item key={logo.alt}>
              <Tooltip title={logo.alt}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={28}
                  height={28}
                  style={{ opacity: 0.5 }}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default NavOverlay;
