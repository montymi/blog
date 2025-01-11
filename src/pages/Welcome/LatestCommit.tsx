import React from 'react';
import { Typography, CircularProgress, useTheme } from '@mui/material';
import useLatestCommit from '@/hooks/useLatestCommit';
import { getRepoNameFromUrl } from '@/utils/getRepoName';

const LatestCommit: React.FC = () => {
  const { commits, loading } = useLatestCommit('montymi');
  const theme = useTheme();

  return (
    <div
      style={{
        paddingTop: '2em',
        margin: '0 auto',
        textAlign: 'center',
        paddingBottom: loading ? '2em' : '0',
      }}
    >
      {loading ? (
        <React.Fragment>
          <CircularProgress size={48} />
          <img src="https://example.com/funny-image.jpg" alt="Funny" style={{ marginTop: '1em' }} />
        </React.Fragment>
      ) : commits && commits.length > 0 ? (
        commits.map((commit, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                marginBottom: '2em',
                padding: '1em',
                borderRadius: '8px',
                backgroundColor: theme.palette.background.paper,
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease-in-out',
              }}
              onClick={() => window.open(commit.html_url, '_blank')}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  textAlign: 'left',
                }}
              >
                <div>
                  <Typography
                    variant="subtitle2"
                    align="left"
                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                  ></Typography>
                  <span style={{ color: 'green' }}>+{commit.stats.additions}</span>,{' '}
                  <span style={{ color: 'red' }}>-{commit.stats.deletions}</span> to{' '}
                  {getRepoNameFromUrl(commit.url).toUpperCase() || 'GITHUB'}
                </div>
                <div style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                  {new Date(commit.commit.author.date).toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <Typography
                  variant="caption"
                  style={{ marginBottom: '0.25em', wordWrap: 'break-word', fontSize: '1.25rem' }}
                >
                  {commit.commit.message}
                </Typography>
              </div>
            </div>
          </React.Fragment>
        ))
      ) : (
        <Typography variant="caption" color="textSecondary">
          No commits found.
        </Typography>
      )}
    </div>
  );
};

export default LatestCommit;
