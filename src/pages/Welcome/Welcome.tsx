import React, { useState, useEffect } from 'react';
import Meta from '@/components/Meta';
import useOrientation from '@/hooks/useOrientation';
// import muiLogo from './logos/mui.svg';
// import pwaLogo from './logos/pwa.svg';
// import reactLogo from './logos/react_ed.svg';
// import recoilLogo from './logos/recoil.svg';
// import rrLogo from './logos/rr.svg';
// import tsLogo from './logos/ts.svg';
// import viteLogo from './logos/vite.svg';
import { useTheme } from '@emotion/react';
import { Box, Typography, Tooltip } from '@mui/material';
import Spotlight from './Spotlight';
import { Person, HelpOutline, Place, Schedule, Lightbulb, Build } from '@mui/icons-material';

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
  const [posts, setPosts] = useState([]);
  const isPortrait = useOrientation();
  const theme = useTheme();

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch('/posts.json'); // Adjust the path as needed
      const data = await response.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <>
      <Meta title="Welcome" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          height: '100%',
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'top',
            alignItems: 'center',
            padding: '1em',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'left', maxWidth: '600px', margin: '2em' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
              <Person sx={{ marginRight: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Michael Montanaro
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
              <HelpOutline sx={{ marginRight: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 300 }}>
                Full-Stack Developer, Computer Engineer, Athlete, Music Enthusiast
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Place sx={{ marginRight: 1 }} />
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Explore the Discography for latest coding projects and tools!
              </Typography>
            </Box>
          </Box>

          {/* Spotlight Section */}
          <Tooltip title="Click Vinyl for Discography">
            <Box m="1em">
              <Spotlight />
            </Box>
          </Tooltip>

          {/* Bio */}
          <Box sx={{ textAlign: 'left', maxWidth: '600px', margin: '2em' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5em' }}>
              <Schedule sx={{ marginRight: 1 }} />
              <Typography variant="body1">Began programming in March 2019.</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5em' }}>
              <Lightbulb sx={{ marginRight: 1 }} />
              <Typography variant="body1">
                I started programming to create efficient solutions that simplify tasks, enhance
                productivity, and leave more time for life.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Build sx={{ marginRight: 1 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                Programming sharpened my analytical thinking, applying it to solve problems, analyze
                fútbol, curate music, and explore ideas that inspire me.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
            overflowY: 'auto',
            padding: '2em',
          }}
        >
          {/* Blog and Updates Section */}
          <Tooltip title="Stay tuned for the latest news and posts!">
            <Box sx={{ marginBottom: '2em' }}>
              {posts.map((post) => (
                <Box
                  key={post.id}
                  sx={{
                    padding: '1em',
                    marginBottom: '1em',
                    borderRadius: '8px',
                    backgroundColor: 'background.paper',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 10px rgba(0,0,0,0.9)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '0.5em' }}>
                    {new Date(post.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">{post.content}</Typography>
                </Box>
              ))}
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
}

export default Welcome;
