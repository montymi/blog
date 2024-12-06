import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconButton, Tooltip, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import useBlog from '@/store/blog';
import { Close } from '@mui/icons-material';

type Post = {
  id: string;
  title: string;
  date: string; // ISO date string
  content: string;
};
type BlogProps = {
  posts: Post[]; // Define that `posts` is an array of Post objects
};

const Blog = ({ posts }: BlogProps) => {
  const [isBlogOpen, blogActions] = useBlog();
  const theme = useTheme();
  const maxWords = 30; // Customize max words for truncation
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const renderContent = (content: string) => {
    const words = content.split(' ');
    if (words.length > maxWords && !expanded) {
      return `${words.slice(0, maxWords).join(' ')}...\n\n*Click to read more!*`;
    }
    return content;
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isBlogOpen}
      onClose={blogActions.close}
      onOpen={blogActions.open}
      disableBackdropTransition={false}
      swipeAreaWidth={30}
      data-pw="sidebar"
    >
      <div className="blog-container" style={{ width: '100%', maxWidth: '45vw', padding: '2em' }}>
        <div
          className="blog-header"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.5em',
          }}
        >
          <Typography variant="h5" sx={{ margin: 0, padding: 0 }}>
            Blog & Updates
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            size="large"
            onClick={blogActions.close}
            data-pw="blog-close"
          >
            <Close />
          </IconButton>
        </div>
        {/* Conditional Rendering for Posts */}
        <Tooltip title="Stay tuned for the latest news and posts!">
          <div style={{ marginBottom: '2em' }}>
            {posts.map((post: Post) => (
              <div
                className="hover-box"
                key={post.id}
                style={{
                  padding: '1.5em',
                  marginBottom: '1.5em',
                  borderRadius: '8px',
                  backgroundColor: theme.palette?.background?.paper,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '0.5em' }}>
                  {new Date(post.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: '1.75em' }} onClick={toggleExpanded}>
                  <ReactMarkdown>{renderContent(post.content)}</ReactMarkdown>
                </Typography>
              </div>
            ))}
          </div>
        </Tooltip>

        <style>
          {`
          .hover-box:hover {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
          }
          /* Mobile devices and below */
          @media (max-width: 600px) {
            .blog-container {
              width: 100% !important; /* Full width on small screens */
              max-width: 100% !important;
            }
          }
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
            `}
        </style>
      </div>
    </SwipeableDrawer>
  );
};

export default Blog;
