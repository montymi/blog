import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

type Release = {
  title: string;
  description: string;
  releaseDate: string;
  lastUpdate: string;
  totalPlayTime: string;
  files: { name: string; length: string; link: string }[];
  downloadLink: string;
  readmeContent: string;
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
  totalPlayTime,
  files,
  downloadLink,
  readmeContent,
}) => (
  <div style={{ padding: '1em', maxWidth: '800px', margin: '0 auto' }}>
    <header style={{ textAlign: 'center', marginBottom: '1.5em' }}>
      <h1>{title}</h1>
    </header>
    <section style={{ marginBottom: '1.5em' }}>
      <h2>Description</h2>
      <p>{description}</p>
    </section>
    <section style={{ marginBottom: '1.5em' }}>
      <h2>Details</h2>
      <p>
        <strong>Release Date:</strong> {releaseDate}
      </p>
      <p>
        <strong>Last Update:</strong> {lastUpdate}
      </p>
    </section>
    <section style={{ marginBottom: '1.5em' }}>
      <h2>Play</h2>
      <button
        style={{
          padding: '0.5em 1em',
          backgroundColor: '#1DB954',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Play All
      </button>
      <p style={{ marginTop: '0.5em' }}>
        <strong>Total Play Time:</strong> {totalPlayTime}
      </p>
    </section>
    <section style={{ marginBottom: '1.5em' }}>
      <h2>Files</h2>
      {files.map((file) => (
        <div
          key={file.name}
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}
        >
          <span>{file.name}</span>
          <a
            href={file.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1DB954' }}
          >
            View ({file.length})
          </a>
        </div>
      ))}
    </section>
    <section style={{ marginBottom: '1.5em' }}>
      <h2>Download</h2>
      <a href={downloadLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1DB954' }}>
        Download All
      </a>
    </section>
    <section style={{ marginBottom: '1.5em' }}>
      <h2>README</h2>
      <p>{readmeContent}</p>
    </section>
  </div>
);

function Discography(): JSX.Element {
  const [releases, setReleases] = useState<Releases>({});
  const [selectedTab, setSelectedTab] = useState<keyof Releases>('episodes');
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: keyof Releases) => {
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

  return (
    <>
      <Meta title="Discography" />
      <FullSizeCenteredFlexBox>
        <div style={{ width: '100%', maxWidth: 800 }}>
          {/* Top filter bar */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            textColor="secondary"
            indicatorColor="secondary"
          >
            {Object.keys(releases).map((key) => (
              <Tab key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={key} />
            ))}
          </Tabs>

          {/* Releases */}
          <Typography variant="h5" sx={{ mt: 2 }}>
            {`${String(selectedTab).charAt(0).toUpperCase()}${String(selectedTab).slice(1)}`}
          </Typography>
          <List>
            {releases[selectedTab]?.map((release) => (
              <React.Fragment key={release.title}>
                <ListItemButton onClick={() => handleOpenModal(release)}>
                  <ListItemText primary={release.title} />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
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
