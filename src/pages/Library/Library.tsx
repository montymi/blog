import { useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItemText,
  IconButton,
  ListItemButton,
  Box,
  Divider,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import PDFViewer from './PDFViewer'; // Import your PDFViewer component

interface Paper {
  title: string;
  file: string;
}

const Library: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/library.json');
        const data: Paper[] = await response.json();
        setPapers(data);
      } catch (error) {
        console.error('Error loading library.json:', error);
      }
    };

    fetchPapers();
  }, []);

  const handlePdfSelect = (file: string) => {
    setSelectedPdf(file);
  };

  const handleCloseViewer = () => {
    setSelectedPdf(null);
  };

  return (
    <>
      <Meta title="Library" />
      <FullSizeCenteredFlexBox>
        <Box>
          <Typography variant="h3" gutterBottom>
            Library
          </Typography>
          <Typography>Collection of my papers and presentations.</Typography>
          <List>
            {papers.map((paper, index) => (
              <>
                <ListItemButton key={index} onClick={() => handlePdfSelect(paper.file)}>
                  <ListItemText primary={paper.title} />
                </ListItemButton>
                <Divider />
              </>
            ))}
          </List>
        </Box>
      </FullSizeCenteredFlexBox>

      {selectedPdf && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
            }}
            onClick={handleCloseViewer}
            aria-label="Close PDF Viewer"
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              width: '90%',
              height: '90%',
              bgcolor: 'white',
              borderRadius: 2,
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
};

export default Library;
