import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { IconButton, ListItemButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import PDFViewer from './PDFViewer'; // Import your PDFViewer component

function Library() {
  const [papers, setPapers] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the list of papers
    fetch('/library.json')
      .then((response) => response.json())
      .then((data) => setPapers(data))
      .catch((error) => console.error('Error loading library.json:', error));
  }, []);

  return (
    <>
      <Meta title="Library" />
      <FullSizeCenteredFlexBox>
        <div>
          <Typography variant="h3" gutterBottom>
            Library
          </Typography>
          <List>
            {papers.map((paper, index) => (
              <ListItemButton key={index} onClick={() => setSelectedPdf(paper.file)}>
                <ListItemText primary={paper.title} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </FullSizeCenteredFlexBox>

      {selectedPdf && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
            onClick={() => setSelectedPdf(null)}
            aria-label="Close PDF Viewer"
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 3,
            }}
          >
            <PDFViewer fileUrl={selectedPdf} />
          </Box>
        </Box>
      )}
    </>
  );
}

export default Library;
