import { useEffect, useState } from 'react';
import { Typography, List, ListItemText, IconButton, ListItemButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';

import Meta from '@/components/Meta';
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
        <div>
          <Typography variant="h3" gutterBottom>
            Library
          </Typography>
          <Typography fontStyle="italic" mb="1em">
            Collection of my papers and presentations.
          </Typography>
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
        </div>
      </div>

      {selectedPdf && (
        <div
          style={{
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
          <div
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '3',
            }}
          >
            <PDFViewer fileUrl={selectedPdf} />
          </div>
        </div>
      )}
    </>
  );
};

export default Library;
