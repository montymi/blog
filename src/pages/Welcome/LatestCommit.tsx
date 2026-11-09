import React from 'react';
import { Typography, CircularProgress, Button, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRepoLinkFromUrl, getRepoNameFromUrl } from '@/lib/getRepoName';
import { splitCommitMessage } from '@/lib/github';
import useLatestCommits from '@/hooks/useLatestCommit';

const LatestCommit: React.FC = () => {
  const { commits, loading, refetch } = useLatestCommits('montymi');
  const theme = useTheme();
  const [showFallback, setShowFallback] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading]);

  const handleReload = () => {
    setShowFallback(false);
    refetch();
  };

  return (
    <div
      style={{
        paddingTop: '2em',
        margin: '0 auto',
        textAlign: 'center',
        paddingBottom: loading ? '2em' : '0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h4" sx={{ textAlign: 'left', padding: '1em' }}>
          Random Commits
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReload}
          style={{ marginBottom: '1em' }}
        >
          <RefreshIcon />
        </Button>
      </div>
      {loading && showFallback ? (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ padding: '1em', fontSize: '1.2rem' }}
        >
          Loading is taking longer than expected... I probably reached the GitHub API rate limit.
        </Typography>
      ) : loading ? (
        <React.Fragment>
          <CircularProgress size={48} />
        </React.Fragment>
      ) : commits && commits.length > 0 ? (
        commits.map((commit, index) => {
          const { summary, body } = splitCommitMessage(commit.commit.message);

          return (
            <React.Fragment key={index}>
              <div
                style={{
                  marginBottom: '2em',
                  padding: '1em',
                  borderRadius: '8px',
                  backgroundColor: theme.palette.background.paper,
                }}
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
                    <span style={{ color: theme.palette.secondary.main }}>
                      +{commit.stats.additions}
                    </span>
                    , <span style={{ color: 'red' }}>-{commit.stats.deletions}</span> to{' '}
                    <a
                      href={getRepoLinkFromUrl(commit.url)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: theme.palette.primary.main }}
                    >
                      {getRepoNameFromUrl(commit.url).toUpperCase() || 'GITHUB'}
                    </a>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                    {new Date(commit.commit.author.date).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontWeight: 500,
                      wordWrap: 'break-word',
                    }}
                  >
                    {summary}
                  </Typography>
                  {body && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        fontFamily: '"IBM Plex Mono", monospace',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                      }}
                    >
                      {body}
                    </Typography>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })
      ) : (
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '1.1rem' }}>
          No commits found. I definitely reached the GitHub API rate limit.
        </Typography>
      )}
    </div>
  );
};

export default LatestCommit;
