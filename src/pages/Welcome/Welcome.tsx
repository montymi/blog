import Meta from '@/components/Meta';
import useOrientation from '@/hooks/useOrientation';
import { useTheme } from '@mui/material/styles';
import { Typography, Tooltip, IconButton } from '@mui/material';
import Spotlight from './Spotlight';
import { Person, HelpOutline, Place, Schedule, Lightbulb, Build, Inbox } from '@mui/icons-material';
import Icon from '@mui/material/Icon';
import useBlog from '@/store/blog';

// import muiLogo from './logos/mui.svg';
// import pwaLogo from './logos/pwa.svg';
// import reactLogo from './logos/react_ed.svg';
// import recoilLogo from './logos/recoil.svg';
// import rrLogo from './logos/rr.svg';
// import tsLogo from './logos/ts.svg';
// import viteLogo from './logos/vite.svg';

// const logos = [
//   { alt: 'React Router', src: rrLogo },
//   { alt: 'Vite', src: viteLogo },
//   { alt: 'TypeScript', src: tsLogo },
//   { alt: 'React', src: reactLogo },
//   { alt: 'MUI', src: muiLogo },
//   { alt: 'Recoil', src: recoilLogo },
//   { alt: 'PWA', src: pwaLogo },
// ];

function Welcome() {
  const isPortrait = useOrientation();
  const flexDirection = isPortrait ? 'column' : 'row';
  const [isBlogOpen, blogActions] = useBlog();
  const theme = useTheme();

  return (
    <>
      <Meta title="Welcome" />
      <div
        className="welcome"
        style={{
          display: 'flex',
          flexDirection,
          overflowY: 'auto',
          height: '100%', // Ensure the full height of the screen is used
        }}
      >
        {/* Left Section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1em',
            backgroundColor: theme.palette?.background?.default,
            justifyContent: 'flex-start', // Align to the top
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'left', maxWidth: '600px', margin: '2em' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
              <Icon sx={{ marginRight: 1, color: 'grey' }}>
                <Person />
              </Icon>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Michael Montanaro
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <Icon sx={{ marginRight: 1, color: 'grey' }}>
                <HelpOutline />
              </Icon>
              <Typography variant="body1" sx={{ fontWeight: 150 }}>
                Full-Stack Developer, Computer Engineer
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon sx={{ marginRight: 1, color: 'grey' }}>
                <Place />
              </Icon>
              <Typography variant="body1" sx={{ fontWeight: 150 }}>
                Boston, MA • Northeastern University College of Engineering and Varsity Soccer
                Alumnus
              </Typography>
            </div>
          </div>

          {/* Spotlight Section */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Asymmetric Border Layer 1 */}
            <div
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '70px',
                border: '1px solid red',
                borderRadius: '50% 45%',
                animation: 'spinClockwise 2s linear infinite',
              }}
            ></div>

            {/* Asymmetric Border Layer 2 */}
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                top: '45%',
                left: '50%',
                width: '90px',
                height: '80px',
                border: '2px solid grey',
                borderRadius: '40% 60%',
                animation: 'spinCounterClockwise 2s linear infinite',
              }}
            ></div>

            {/* Tooltip and IconButton */}
            <Tooltip title="Click Vinyl for latest coding projects and tools" arrow>
              <div
                style={{
                  margin: '1em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: 'transparent',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    cursor: 'grab',
                    margin: '1em',
                  }}
                >
                  <Spotlight />
                </IconButton>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  Explore the Discography!
                </Typography>
              </div>
            </Tooltip>
          </div>

          <style>
            {`
              @keyframes spinClockwise {
                0% {
                  transform: translate(-50%, -50%) rotate(0deg);
                }
                100% {
                  transform: translate(-50%, -50%) rotate(360deg);
                }
              }

              @keyframes spinCounterClockwise {
                0% {
                  transform: translate(-50%, -50%) rotate(0deg);
                }
                100% {
                  transform: translate(-50%, -50%) rotate(-360deg);
                }
              }
            `}
          </style>

          {/* Bio */}
          <div style={{ textAlign: 'left', maxWidth: '600px', margin: '2em' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5em' }}>
              <Icon sx={{ marginRight: 1, color: 'grey' }}>
                <Schedule />
              </Icon>
              <Typography variant="body1" sx={{ fontWeight: 150 }}>
                Began programming in March of 2019.
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5em' }}>
              <Icon sx={{ marginRight: 1, color: 'grey' }}>
                <Lightbulb />
              </Icon>
              <Typography variant="body2" sx={{ lineHeight: 1.5, fontWeight: 150 }}>
                Wanted to solve problems that simplify tasks, facilitate creativity, and leverage
                data, ultimately leaving more time for life.
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon sx={{ marginRight: 1, color: 'grey' }}>
                <Build />
              </Icon>
              <Typography variant="body2" sx={{ lineHeight: 1.5, fontWeight: 150 }}>
                Analytical thinking has always been a cornerstone of my approach to life, whether
                assessing fútbol strategies, curating the perfect music queue, or diving into topics
                that spark my curiosity.
              </Typography>
            </div>
          </div>
          <div className="blog-action">
            <Tooltip title="Read More" arrow>
              <IconButton
                color="secondary"
                edge="end"
                size="large"
                onClick={blogActions.toggle}
                data-pw="blog-toggle"
                sx={{
                  border: '1px solid',
                  borderColor: 'secondary.main', // Matches the secondary color
                  backgroundColor: isBlogOpen ? 'secondary.main' : 'transparent', // Dynamic bg color
                  color: isBlogOpen ? 'white' : 'secondary.main', // Adjust text/icon color
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Inbox />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
