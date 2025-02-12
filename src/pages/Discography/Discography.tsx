import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
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
import useReadMe from '@/hooks/useReadMe';

type Release = {
  title: string;
  folder: string;
  status: string; // Example: "Draft", "Published", "Archived"
  author: string; // The creator's name, default to '@montymi'
  coauthors: string[]; // Array of coauthors
  version: string; // Example: "1.0.0"
  description: string;
  releaseDate: string;
  lastUpdate: string;
  githubLink: string;
  readmeLink: string;
};
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import isMobile from '@/utils/is-mobile';

type Releases = {
  [key: string]: Release[];
};

const ReleasePage: React.FC<Release> = ({
  title,
  folder,
  version,
  description,
  releaseDate,
  lastUpdate,
  githubLink,
  readmeLink,
  status,
}) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [audio] = useState(new Audio(`/${folder}/${version}/audio.mp3`)); // Single audio file

  const playAudio = useCallback(() => {
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => console.error('Error playing audio', error));
  }, [audio]);

  const stopAudio = () => {
    audio.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => audio.removeEventListener('ended', () => setIsPlaying(false));
  }, [audio]);

  const readmeContent = useReadMe(readmeLink);

  return (
    <div
      style={{
        padding: '2em',
        maxWidth: '900px',
        margin: '0 auto',
        color: theme.palette.text.primary,
      }}
    >
      <header
        style={{
          textAlign: 'left',
          marginBottom: isMobile ? '1.5em' : '2em',
          padding: '2em',
          background: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
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
              • {new Date(lastUpdate).getFullYear()} • {version}
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
          {status === 'Published' && (
            <div>
              <Tooltip title="Play Audio Walkthrough" placement="top" arrow>
                <IconButton
                  onClick={() => (isPlaying ? stopAudio() : playAudio())}
                  color="secondary"
                  style={{
                    height: '70px',
                    width: '70px',
                    backgroundColor: isPlaying ? theme.palette.action.selected : 'secondary',
                    borderRadius: '50%',
                    boxShadow: theme.shadows[4],
                  }}
                >
                  {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
              </Tooltip>
            </div>
          )}
          {status === 'Published' && (
            <div>
              <Tooltip title="Read more" placement="top" arrow>
                <IconButton
                  onClick={() => setIsExpanded(!isExpanded)}
                  color="secondary"
                  style={{
                    margin: '0 0.5em',
                    backgroundColor: isExpanded ? theme.palette.action.selected : 'transparent',
                  }}
                >
                  <DescriptionIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="See the source" placement="top" arrow>
                <IconButton
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="warning"
                  style={{ margin: '0 0.5em' }}
                >
                  <GitHubIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </header>

      {isExpanded && readmeContent && (
        <div
          style={{
            padding: '2em',
            background: theme.palette.background.default,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[4],
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? '100%' : 'auto',
          }}
        >
          <div style={{}}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{readmeContent.content}</ReactMarkdown>
          </div>
        </div>
      )}

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
          version: release.version, // Add the version from the release
          folder: release.folder, // Add the folder name from the release
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
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: isMobile ? '0' : '1em', // Remove padding if isMobile is true
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            borderRadius: theme.shape.borderRadius,
            maxHeight: '90vh', // Set max height
            width: '90vw', // Set width to 90% of viewport width
            maxWidth: '600px', // Set max width
          }}
        >
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
    </>
  );
}

export default Discography;
