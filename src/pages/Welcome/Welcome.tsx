import Meta from '@/components/Meta';
import useOrientation from '@/hooks/useOrientation';
import muiLogo from './logos/mui.svg';
import pwaLogo from './logos/pwa.svg';
import reactLogo from './logos/react_ed.svg';
import recoilLogo from './logos/recoil.svg';
import rrLogo from './logos/rr.svg';
import tsLogo from './logos/ts.svg';
import viteLogo from './logos/vite.svg';
import { Image } from './styled';
import { useTheme } from '@emotion/react';
import { Box } from '@mui/system';
import { GitHub, Mail, MusicNote, Phone } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import Spotlight from './Spotlight';

const logos = [
  { alt: 'React Router', src: rrLogo },
  { alt: 'Vite', src: viteLogo },
  { alt: 'TypeScript', src: tsLogo },
  { alt: 'React', src: reactLogo },
  { alt: 'MUI', src: muiLogo },
  { alt: 'Recoil', src: recoilLogo },
  { alt: 'PWA', src: pwaLogo },
];

function Welcome() {
  const email = 'mcmontanaro01@gmail.com';
  const phoneNumber = '+16175999973';

  const isPortrait = useOrientation();
  const theme = useTheme();

  return (
    <>
      <Meta title="Welcome" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          flexDirection={isPortrait ? 'column' : 'row'}
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <h1 style={{ fontSize: '3em', margin: 0 }}>Michael Montanaro`s Corner of the Web</h1>
          <Box m="1em">
            <Tooltip title="Code with me">
              <IconButton
                color="primary"
                component="a"
                href="https://www.github.com/montymi"
                target="_blank"
                rel="noreferrer"
                aria-label="contact email"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Tooltip title="Listen with me">
              <IconButton
                color="primary"
                component="a"
                href="https://open.spotify.com/user/mumugoalie"
                target="_blank"
                rel="noreferrer"
                aria-label="contact email"
              >
                <MusicNote />
              </IconButton>
            </Tooltip>
            <Tooltip title="Write to me">
              <IconButton
                color="primary"
                component="a"
                href={`mailto:${email}`}
                aria-label="contact email"
              >
                <Mail />
              </IconButton>
            </Tooltip>
            <Tooltip title="Talk with me">
              <IconButton
                color="primary"
                component="a"
                href={`tel:${phoneNumber}`} // The tel: link initiates the phone call
                aria-label="contact phone"
              >
                <Phone />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Headliner Section */}
        <Box
          flexDirection={isPortrait ? 'column' : 'row'}
          sx={{
            display: 'flex',
            height: '100%',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme?.palette?.background?.paper,
            }}
          >
            <Box sx={{ height: '100%' }}>
              <Typography m="1em">
                Hi, I’m Michael, a full-stack developer and a recent computer engineering graduate
                who thrives on crafting innovative solutions and intuitive experiences. When I’m not
                coding, I’m analyzing soccer plays, curating the perfect playlist, or exploring new
                ideas to keep inspired. Explore my Discography to see the projects and tools I’ve
                built—I’m excited to share my journey with you!
              </Typography>
            </Box>
            <Spotlight />
          </div>

          {/* Stream Section */}
          <Tooltip title="Blog & Updates | Stay tuned for latest news and posts!">
            <div
              style={{
                flex: 1,
                backgroundColor: theme?.palette?.background?.paper,
                overflowY: 'auto',
                padding: '20px',
              }}
            >
              <Box
                sx={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      padding: '15px',
                      marginBottom: '15px',
                      borderRadius: '8px',
                      opacity: 0.7,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.9)',
                      },
                    }}
                  >
                    <h3>Post Title {i + 1}</h3>
                    <p>This is a placeholder for blog content {i + 1}.</p>
                  </Box>
                ))}
              </Box>
            </div>
          </Tooltip>
        </Box>

        {/* Footer Section */}
        <Tooltip title="App is powered by these awesome technologies!">
          <Box
            flexDirection={isPortrait ? 'column' : 'row'}
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxHeight: '20vh',
              background: theme.palette.background.default,
              padding: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            {logos.map(({ alt, src }) => (
              <Image key={alt} alt={alt} src={src} />
            ))}
          </Box>
        </Tooltip>
      </div>
    </>
  );
}

export default Welcome;
