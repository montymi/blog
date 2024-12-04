import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  List,
  Grid,
  ListItemButton,
  ListItemText,
  Divider,
  Modal,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Meta from '@/components/Meta';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PauseIcon from '@mui/icons-material/Pause';
import { repository } from '@/config';
import useNotifications from '@/store/notifications';

type Release = {
  title: string;
  folder: string;
  status: string; // Example: "Draft", "Published", "Archived"
  author: string; // The creator's name, default to '@montymi'
  coauthors: string[]; // Array of coauthors
  version: string; // Example: "v1.0.0"
  description: string;
  releaseDate: string;
  lastUpdate: string;
  files: { name: string; length: string; link: string }[];
  githubLink: string;
  readmeLink: string;
};

type Releases = {
  [key: string]: Release[];
};

const ReleasePage: React.FC<Release> = ({
  title,
  description,
  releaseDate,
  lastUpdate,
  files,
  githubLink,
  readmeLink,
  status,
}) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [audio] = useState(new Audio());

  const playAudio = useCallback(
    (fileIndex: number) => {
      if (audio.src !== files[fileIndex].link) {
        audio.src = files[fileIndex].link;
        audio.load();
      }
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setCurrentFileIndex(fileIndex);
        })
        .catch((error) => console.error('Error playing audio', error));
    },
    [audio, files],
  );

  const addTime = (timeStrings: string[]): string => {
    let totalSeconds = 0;

    // Convert each time string into total seconds and accumulate them
    timeStrings.forEach((time) => {
      const [minutes, seconds] = time.split(':').map(Number); // Split by ':' and convert to numbers
      totalSeconds += minutes * 60 + seconds; // Add minutes converted to seconds and the seconds
    });

    // Convert total seconds to hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600); // 1 hour = 3600 seconds
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes after extracting hours
    const seconds = totalSeconds % 60; // Remaining seconds after extracting minutes

    // Format output based on total time
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  };

  const totalTime = (files: { length: string }[]): string => {
    const timeStrings = files.map((file) => file.length);
    return addTime(timeStrings);
  };

  const stopAudio = () => {
    audio.pause();
    setIsPlaying(false);
    setCurrentFileIndex(null);
  };

  const handleNextTrack = useCallback(() => {
    if (currentFileIndex === null || currentFileIndex === files.length - 1) return;
    playAudio(currentFileIndex + 1);
  }, [playAudio, files.length, currentFileIndex]);

  useEffect(() => {
    audio.addEventListener('ended', handleNextTrack);
    return () => audio.removeEventListener('ended', handleNextTrack);
  }, [handleNextTrack, audio]);

  return (
    <div
      style={{
        padding: '2em',
        maxWidth: '900px',
        margin: '0 auto',
        color: theme.palette.text.primary,
      }}
    >
      {/* Header Section with Cover */}
      <header
        style={{
          textAlign: 'left',
          marginBottom: '2em',
          padding: '2em',
          background: theme.palette.background.default,
          borderRadius: '15px',
          boxShadow: theme.shadows[4],
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
          <div className="album-cover"></div>
          <div
            className="album-header-info"
            style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.5em' }}
          >
            <Typography fontStyle="h1" sx={{ fontSize: '3rem', fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography fontStyle="body1" sx={{ color: theme.palette.text.secondary }}>
              <a
                href={repository}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                @montymi
              </a>{' '}
              • {new Date(lastUpdate).getFullYear()} • {files.length} segments, {totalTime(files)}
            </Typography>
          </div>
        </div>
        <p style={{ fontSize: '1.2rem', color: theme.palette.text.secondary }}>{description}</p>
        <div
          style={{
            marginTop: '1em',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Conditionally render Play button and links */}
          {status === 'Published' && (
            <div>
              <Tooltip title="Play Audio Walkthrough" placement="top" arrow>
                <IconButton
                  onClick={() => (currentFileIndex === null ? playAudio(0) : stopAudio())}
                  color="secondary"
                  style={{
                    height: '70px',
                    width: '70px',
                    backgroundColor: 'secondary',
                    borderRadius: '50%',
                    boxShadow: theme.shadows[4],
                  }}
                >
                  {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
              </Tooltip>
            </div>
          )}

          {/* Conditionally render project links */}
          {status === 'Published' && (
            <div>
              <Tooltip title="GitHub Repository" placement="top" arrow>
                <IconButton
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.text.primary, margin: '0 0.5em' }}
                >
                  <GitHubIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="View README" placement="top" arrow>
                <IconButton
                  href={readmeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.text.primary, margin: '0 0.5em' }}
                >
                  <DescriptionIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </header>

      {status === 'Published' && (
        <TableContainer
          sx={{
            borderRadius: '15px',
          }}
        >
          <Table
            sx={{
              width: '100%',
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  opacity: 0.2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Length</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file, index) => (
                <TableRow
                  key={index}
                  onClick={() => playAudio(index)}
                  sx={{
                    textTransform: 'none',
                    justifyContent: 'spaceBetween',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'background.default',
                    },
                    '&:hover .play-row': {
                      opacity: 1,
                    },
                  }}
                >
                  <TableCell className="index-row" sx={{ color: theme.palette.text.secondary }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography>{file.name}</Typography>
                  </TableCell>
                  <TableCell color="textSecondary" sx={{ color: theme.palette.text.secondary }}>
                    {file.length}
                  </TableCell>
                  <TableCell
                    className="play-row"
                    color="textSecondary"
                    sx={{
                      opacity: 0,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <IconButton
                      onClick={() => (currentFileIndex === null ? playAudio(0) : stopAudio())}
                      color="secondary"
                      style={{
                        background: 'transparent',
                      }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Footer */}
      <footer
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          textAlign: 'center',
          marginTop: '2em',
          fontSize: '0.9rem',
          color: theme.palette.text.secondary,
        }}
      >
        <Typography>
          Status:{' '}
          <span style={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>{status}</span>
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography>Released: {releaseDate}</Typography>
          <Typography>Updated: {lastUpdate}</Typography>
        </div>
      </footer>
    </div>
  );
};

function Discography(): JSX.Element {
  const theme = useTheme();
  const [releases, setReleases] = useState<Releases>({});
  const [selectedTab, setSelectedTab] = useState<string>('all'); // Default to "all"
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state for individual release
  const [, notificationsActions] = useNotifications();

  useEffect(() => {
    function showNotification() {
      notificationsActions.push({
        options: {
          variant: 'customNotification',
        },
        message: 'Audio files for each release are coming soon!',
      });
    }
    showNotification();
  }, [notificationsActions]);

  // Fetch releases.json from public/releases
  useEffect(() => {
    fetch('/releases.json')
      .then((response) => response.json())
      .then((data) => setReleases(data))
      .catch((error) => console.error('Error loading releases:', error));
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleOpenModal = (release: Release) => {
    setLoading(true); // Set loading state when opening a release
    setSelectedRelease(null); // Clear previous release content
    fetch(`/releases/${release.folder}/release.json`) // Fetch the selected release's data
      .then((response) => response.json())
      .then((data) => {
        const updatedData = {
          ...data,
          status: release.status, // Add the status from the release
        };
        setSelectedRelease(updatedData); // Set the selected release data
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error('Error loading release:', error);
        setLoading(false);
      });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRelease(null);
  };

  const renderReleases = (
    sectionReleases: Release[],
    handleOpenModal: (release: Release) => void,
  ) => {
    return sectionReleases.map((release, index) => (
      <React.Fragment key={release.title}>
        <ListItemButton onClick={() => handleOpenModal(release)}>
          <Grid container spacing={2} alignItems="center">
            {/* Index on the left */}
            <Grid item xs={1}>
              <Typography>{index + 1}</Typography>
            </Grid>

            {/* Title in the middle */}
            <Grid item xs={5}>
              <ListItemText primary={release.title} />
            </Grid>

            {/* Folder name */}
            <Grid item xs={4}>
              <Typography variant="body2" color="textSecondary">
                {release.version}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2" color="secondary" fontWeight="100" textAlign="right">
                {release.status}
              </Typography>
            </Grid>
          </Grid>
        </ListItemButton>
        <Divider />
      </React.Fragment>
    ));
  };

  const renderAllReleases = () => {
    return Object.entries(releases).map(([section, sectionReleases]) => (
      <React.Fragment key={section}>
        <Typography variant="h6" sx={{ mt: 3 }}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </Typography>
        <List>{renderReleases(sectionReleases, handleOpenModal)}</List>
      </React.Fragment>
    ));
  };

  const renderSelectedReleases = () => {
    const sectionReleases = releases[selectedTab] || [];
    return <List>{renderReleases(sectionReleases, handleOpenModal)}</List>;
  };

  return (
    <>
      <Meta title="Discography" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowY: 'auto',
          width: '100%',
          alignItems: 'center',
          height: '90%',
          padding: '1em',
        }}
      >
        <div style={{ width: '100%', maxWidth: 800 }}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Discography
            </Typography>
            <Typography fontStyle="italic" mb="1em" color="text.secondary">
              A collection of my released projects and work in code.
            </Typography>
          </div>
          <Tooltip
            title="Releases are organized by size, with the order from smallest to largest being Single, Episode, Album"
            placement="top"
            arrow
          >
            {/* Top filter bar */}
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              centered
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab key="all" label="All" value="all" />
              {Object.keys(releases).map((key) => (
                <Tab key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={key} />
              ))}
            </Tabs>
          </Tooltip>

          {/* Releases */}
          <Typography variant="h5" sx={{ mt: 2 }}>
            {selectedTab === 'all'
              ? ''
              : `${String(selectedTab).charAt(0).toUpperCase()}${String(selectedTab).slice(1)}`}
          </Typography>
          {selectedTab === 'all' ? renderAllReleases() : renderSelectedReleases()}
        </div>
      </div>

      {/* Modal for ReleasePage */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div
          className="modal-content-container"
          style={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '24',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            scrollbarWidth: undefined /* For Firefox */,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <style>
            {`
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

              @media (max-width: 600px) {
                .modal-content-container {
                  width: 100% !important; /* Full width on small screens */
                  max-width: 100% !important;
		  height: 100% !important;
		  max-height: 100% !important;
                }
              }
            `}
          </style>
          {/* Back Arrow */}
          <IconButton
            color="secondary"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          {loading ? (
            <CircularProgress sx={{ margin: 'auto' }} />
          ) : selectedRelease ? (
            <ReleasePage {...selectedRelease} />
          ) : (
            <Alert severity="error">Error loading release data</Alert>
          )}
        </div>
      </Modal>
    </>
  );
}

export default Discography;
