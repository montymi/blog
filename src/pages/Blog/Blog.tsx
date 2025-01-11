import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Tooltip, Typography, Container } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import usePosts from '@/hooks/usePosts';

type Post = {
  id: string;
  title: string;
  date: string; // ISO date string
  content: string;
};

const Blog = () => {
  const posts = usePosts();
  const theme = useTheme();
  const maxWords = 30; // Customize max words for truncation
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const toggleExpanded = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const renderContent = (content: string, isExpanded: boolean) => {
    const words = content.split(' ');
    if (words.length > maxWords && !isExpanded) {
      return `${words.slice(0, maxWords).join(' ')}...\n\n*Click to read more!*`;
    }
    return content;
  };

  return (
    <Container maxWidth="md" style={{ padding: '2em' }}>
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
      </div>
      {/* Conditional Rendering for Posts */}
      <Tooltip title="Stay tuned for the latest news and posts!">
        <div style={{ marginBottom: '2em' }}>
          {posts.length > 0 ? (
            posts.map((post: Post) => (
              <div
                className="hover-box"
                key={post.id}
                style={{
                  padding: '1.5em',
                  marginBottom: '1.5em',
                  borderRadius: '8px',
                  backgroundColor: theme.palette.background
                    ? theme.palette.background.paper
                    : 'defaultColor',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpanded(post.id)}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '0.5em' }}>
                  {new Date(post.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: '1.75em' }}>
                  <ReactMarkdown>
                    {renderContent(post.content, expandedPostId === post.id)}
                  </ReactMarkdown>
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '2em' }}>
              No posts available. Please check back later!
            </Typography>
          )}
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
    </Container>
  );
};

export default Blog;
