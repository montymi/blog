import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Meta from '@/components/Meta';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Tooltip, IconButton } from '@mui/material';

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
          textAlign: 'center',
          marginBottom: '2em',
          padding: '2em',
          background: theme.palette.background.default,
          borderRadius: '15px',
          boxShadow: theme.shadows[4],
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5em' }}>{title}</h1>
        <p style={{ fontSize: '1.2rem', color: theme.palette.text.secondary, textAlign: 'left' }}>
          {description}
        </p>
        <div
          style={{
            marginTop: '1em',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
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
          {/* Play Button */}
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
        </div>
      </header>

      {/* File Cards */}
      <section>
        {files.map((file, index) => (
          <Button
            variant="contained"
            key={file.name}
            onClick={() => playAudio(index)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1em',
              marginBottom: '1em',
              backgroundColor: theme.palette.background.default,
              borderRadius: theme.shape.borderRadius,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.querySelector('.play-icon')!.style.visibility = 'visible')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.querySelector('.play-icon')!.style.visibility = 'hidden')
            }
          >
            <Typography
              style={{ color: theme.palette.text.primary, fontSize: '1rem', fontWeight: 500 }}
            >
              {file.name}
            </Typography>
            <PlayArrowIcon
              className="play-icon"
              style={{
                color: theme.palette.text.secondary,
                visibility: 'hidden', // Initially hidden
              }}
            />
          </Button>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: '2em',
          fontSize: '0.9rem',
          color: theme.palette.text.secondary,
        }}
      >
        <p>Release Date: {releaseDate}</p>
        <p>Last Update: {lastUpdate}</p>
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
        setSelectedRelease(data); // Set the selected release data
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
    return (
      <List>
        {sectionReleases.map((release) => (
          <React.Fragment key={release.title}>
            <ListItemButton onClick={() => handleOpenModal(release)}>
              <ListItemText primary={release.title} />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
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
            overflow: 'auto',
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
            `}
          </style>
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
