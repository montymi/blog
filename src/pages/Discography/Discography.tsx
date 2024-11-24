import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Tooltip, IconButton } from '@mui/material';

type Release = {
  title: string;
  description: string;
  releaseDate: string;
  lastUpdate: string;
  files: { name: string; length: string; link: string }[];
  githubLink: string;
  readmeLink: string;
  folder: string;
};

type Releases = {
  [key: string]: Release[];
};

// Styles for the modal
const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  scrollbarWidth: null /* For Firefox */,
};

// ReleasePage Component to show release content
const ReleasePage: React.FC<Release> = ({
  title,
  description,
  releaseDate,
  lastUpdate,
  files,
  githubLink,
  readmeLink,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [audio] = useState(new Audio());

  const playAudio = useCallback(
    (fileIndex: number) => {
      if (audio.src !== files[fileIndex].link) {
        audio.src = files[fileIndex].link;
        console.log(audio.src);
        console.log(files[fileIndex].link);
        audio.load(); // Reload audio source if it's different
      }

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setCurrentFileIndex(fileIndex);
        })
        .catch((error) => {
          console.error('Error playing audio', error);
        });
    },
    [audio, files, setCurrentFileIndex],
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

  //const handlePrevTrack = () => {
  //  if (currentFileIndex === null || currentFileIndex === 0) return;
  //  playAudio(currentFileIndex - 1);
  //};

  useEffect(() => {
    audio.addEventListener('ended', handleNextTrack);
    return () => {
      audio.removeEventListener('ended', handleNextTrack);
    };
  }, [handleNextTrack, audio, currentFileIndex]);

  return (
    <div style={{ padding: '1em', maxWidth: '800px', margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          marginBottom: '1.5em',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>{title}</h1>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Box>
            <Button
              id="github"
              variant="text"
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip title="Visit repo" placement="top" arrow>
                <IconButton>
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </Button>
            <Button
              id="README"
              variant="text"
              href={readmeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip title="View files" placement="top" arrow>
                <IconButton>
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
            </Button>
          </Box>
          <Tooltip title="Listen to walkthrough" placement="top" arrow>
            <Button
              variant="contained"
              sx={{
                padding: '0.5em 1em',
                border: 'none',
                height: '50px',
                width: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                if (currentFileIndex === null) playAudio(0);
                else stopAudio();
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
          </Tooltip>
        </Box>
      </header>
      <section style={{ marginBottom: '1.5em' }}>
        <p>{description}</p>
      </section>
      <section style={{ marginBottom: '1.5em' }}>
        {files.map((file, index) => (
          <Button
            className="release"
            variant="contained"
            key={file.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5em',
              backgroundColor: 'background.default',
              mb: '15px',
              width: '100%',
              position: 'relative',
              '&:hover .play-icon': {
                opacity: 1, // Show the icon on hover
              },
            }}
            onClick={() => playAudio(index)}
          >
            <Typography>{file.name}</Typography>
            <PlayArrowIcon
              className="play-icon"
              sx={{
                opacity: 0, // Initially hidden
                transition: 'opacity 0.3s', // Smooth transition for opacity
                position: 'absolute', // Position it over the button
                right: '10px', // Adjust right position if needed
              }}
            />
          </Button>
        ))}
      </section>
      <section style={{ marginBottom: '1.5em' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography>Release Date: {releaseDate}</Typography>
            <Typography>Last Update: {lastUpdate}</Typography>
          </Box>
        </Box>
      </section>
    </div>
  );
};
function Discography(): JSX.Element {
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

  const renderAllReleases = () => {
    return Object.entries(releases).map(([section, sectionReleases]) => (
      <React.Fragment key={section}>
        <Typography variant="h6" sx={{ mt: 3 }}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </Typography>
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
      <FullSizeCenteredFlexBox>
        <div style={{ width: '100%', maxWidth: 800 }}>
          <Typography variant="h4">Discography</Typography>
          <Typography>Collection of my released code.</Typography>
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
      </FullSizeCenteredFlexBox>

      {/* Modal for ReleasePage */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
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
        </Box>
      </Modal>
    </>
  );
}

export default Discography;
