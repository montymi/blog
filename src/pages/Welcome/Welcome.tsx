import Meta from '@/components/Meta';
import useOrientation from '@/hooks/useOrientation';
import { useTheme } from '@mui/material/styles';
import { Typography, Tooltip, IconButton } from '@mui/material';
import Spotlight from './Spotlight';
import { Schedule, Lightbulb, Build } from '@mui/icons-material';
import Icon from '@mui/material/Icon';
import { isMobile } from 'is-mobile';
import { LibraryBooksOutlined, Inbox, Terrain } from '@mui/icons-material';

import LatestCommit from './LatestCommit';

function Welcome() {
  const isPortrait = useOrientation();
  const flexDirection = isPortrait ? 'column' : 'row';
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
          <div
            style={{
              width: '90%',
              marginTop: '2em',
              textAlign: 'center',
              backgroundImage: 'url(/profile-banner.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '2em',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1em',
              }}
            >
              <Typography variant={isMobile() ? 'h2' : 'h1'} sx={{ fontWeight: 600 }}>
                Michael Montanaro
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1em',
              }}
            >
              {isMobile() ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1em',
                  }}
                >
                  <Typography variant="h5">Fullstack and Embedded Developer</Typography>
                </div>
              ) : (
                <Typography variant="h5">
                  Full-Stack Developer, Computer Engineer from Boston, MA
                </Typography>
              )}
            </div>
          </div>
          {/* Bio and Spotlight Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile() ? 'column' : 'row',
              alignItems: 'center',
              width: '90%',
              padding: '4em', // Doubled the padding
              marginTop: '2em',
              borderRadius: '8px',
              backgroundColor: theme.palette?.background?.paper,
              paddingLeft: '2em', // Added padding to the left
            }}
          >
            {/* Bio */}
            <div style={{ textAlign: 'left', maxWidth: '80%', marginBottom: '2em' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3em' }}>
                {' '}
                {/* Doubled the marginBottom */}
                <Icon sx={{ marginRight: 2, color: 'grey' }}>
                  {' '}
                  {/* Doubled the marginRight */}
                  <Schedule />
                </Icon>
                <Typography variant="body1" sx={{ fontWeight: 150, fontSize: '1.1rem' }}>
                  {' '}
                  {/* Increased font size */}
                  Began programming in March of 2019.
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3em' }}>
                {' '}
                {/* Doubled the marginBottom */}
                <Icon sx={{ marginRight: 2, color: 'grey' }}>
                  {' '}
                  {/* Doubled the marginRight */}
                  <Lightbulb />
                </Icon>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.5, fontWeight: 150, fontSize: '1.1rem' }}
                >
                  Building user-friendly solutions that let people work smarter, spark creativity,
                  and enjoy more life offline.
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon sx={{ marginRight: 2, color: 'grey' }}>
                  {' '}
                  {/* Doubled the marginRight */}
                  <Build />
                </Icon>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.5, fontWeight: 150, fontSize: '1.1rem' }}
                >
                  I enjoy problem-solving, whether it’s in programming, playing fútbol, or exploring
                  new topics.
                </Typography>
              </div>
            </div>
            {/* Spotlight Section */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {/* Tooltip and IconButton */}
              <Tooltip title="Click Vinyl for latest coding projects and tools" arrow>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <IconButton
                    sx={{
                      backgroundColor: 'transparent',
                      width: '200px', // Doubled the width
                      height: '200px', // Doubled the height
                      borderRadius: '50%',
                      cursor: 'grab',
                      '&:focus': {
                        boxShadow: '1px 4px 4px rgba(0, 0, 0, 0.5)',
                      },
                    }}
                    onClick={() => (window.location.href = '/discography')}
                    aria-label="visit-discography-call-to-action"
                  >
                    <Spotlight />
                  </IconButton>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    Explore my work!
                  </Typography>
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Commit and Blog Section */}
          <div
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              margin: '0',
              textAlign: 'left',
            }}
          >
            {/* Latest Commit Section */}
            <div style={{ textAlign: 'left', width: '100%' }}>
              <LatestCommit />
            </div>
          </div>

          {/* Read More Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '90%',
              padding: '1em',
              backgroundColor: theme.palette?.background?.default,
              borderRadius: '8px',
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '1em', textAlign: 'center' }}>
              Check out below to read more!
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              <Tooltip title="Browse my library" arrow>
                <IconButton
                  color="secondary"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1em',
                    margin: '0.5em',
                  }}
                  onClick={() => (window.location.href = '/library')}
                >
                  <Icon>
                    <LibraryBooksOutlined />
                  </Icon>
                  <Typography variant="button">Library</Typography>
                </IconButton>
              </Tooltip>
              <Tooltip title="Read my blog" arrow>
                <IconButton
                  color="secondary"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1em',
                    margin: '0.5em',
                  }}
                  onClick={() => (window.location.href = '/blog')}
                >
                  <Icon>
                    <Inbox />
                  </Icon>
                  <Typography variant="button">Blog</Typography>
                </IconButton>
              </Tooltip>
              <Tooltip title="Check out my latest activities" arrow>
                <IconButton
                  color="secondary"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1em',
                    margin: '0.5em',
                  }}
                  onClick={() => (window.location.href = '/activity')}
                >
                  <Icon>
                    <Terrain />
                  </Icon>
                  <Typography variant="button">Activity</Typography>
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Footer */}
          <div style={{ width: '100%', textAlign: 'center', padding: '1em' }}>
            <Typography variant="caption" sx={{ color: 'grey' }}>
              Made with ❤️ in Boston, MA. © 2025 Michael Montanaro
            </Typography>
            <br />
            <Typography variant="caption" sx={{ color: 'grey' }}>
              Feel free to contact me with any questions or opportunities.
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
