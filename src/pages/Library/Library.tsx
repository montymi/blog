import { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { getDocument } from 'pdfjs-dist';

import Meta from '@/components/Meta';
import PDFViewer from './PDFViewer'; // Import your PDFViewer component

interface Paper {
  title: string;
  file: string;
  pages?: number; // Store the number of pages
}

const Library: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/library.json');
        const data: Paper[] = await response.json();

        // Load page count for each paper
        const updatedPapers = await Promise.all(
          data.map(async (paper) => {
            const pageCount = await getPdfPageCount(paper.file);
            return { ...paper, pages: pageCount };
          }),
        );

        setPapers(updatedPapers);
      } catch (error) {
        console.error('Error loading library.json:', error);
      }
    };

    fetchPapers();
  }, []);

  // Function to get page count from a PDF
  const getPdfPageCount = async (file: string) => {
    try {
      const pdf = await getDocument(file).promise;
      return pdf.numPages; // Return the number of pages
    } catch (error) {
      console.error('Error loading PDF:', error);
      return 0; // Return 0 pages if error occurs
    }
  };

  const handlePdfSelect = (file: string) => {
    setSelectedPdf(file);
    setOpenDialog(true);
  };

  const handleCloseViewer = () => {
    setOpenDialog(false);
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
        <Typography variant="h3" gutterBottom>
          Library
        </Typography>
        <Typography fontStyle="italic" mb="1em" color="text.secondary">
          A curated collection of papers and presentations.
        </Typography>
        <TableContainer
          sx={{
            maxWidth: 800,
            bgcolor: 'background.paper',
            borderRadius: '15px',
            padding: '0.5em',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Pages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {papers.map((paper, index) => (
                <TableRow
                  key={index}
                  onClick={() => handlePdfSelect(paper.file)}
                  sx={{
                    textTransform: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'background.default',
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography>{paper.title}</Typography>
                  </TableCell>
                  <TableCell>{paper.pages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseViewer}
        fullWidth
        maxWidth="md"
        aria-labelledby="pdf-viewer-title"
      >
        <DialogTitle
          id="pdf-viewer-title"
          sx={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
        >
          <Visibility sx={{ marginRight: '8px', fontSize: '1rem' }} />{' '}
          {selectedPdf?.split('/').pop()}
        </DialogTitle>
        <DialogContent>
          {selectedPdf && (
            <div
              style={{
                position: 'relative',
                height: '90%', // Adjustable based on your needs
                overflow: 'hidden',
              }}
            >
              <PDFViewer fileUrl={selectedPdf} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Library;
