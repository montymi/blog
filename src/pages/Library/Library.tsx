import { useEffect, useState, useCallback } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

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

  // Function to get page count from a PDF
  const getPDFPageCount = useCallback(
    async (file: string, retries: number = 3): Promise<number | JSX.Element> => {
      try {
        const pdf = await getDocument(file).promise;
        return pdf.numPages; // Return the number of pages
      } catch (error) {
        console.error('Error loading PDF:', error);
        if (retries > 0) {
          console.log(`Retrying... (${4 - retries} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          return getPDFPageCount(file, retries - 1); // Retry
        }
        return -1; // Return a loading spinner if all retries fail
      }
    },
    [],
  );

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const fetchPapers = async () => {
      try {
        const response = await fetch('/library.json');
        const data: Paper[] = await response.json();

        const updatedPapers: Paper[] = await Promise.all(
          data.map(async (paper) => {
            let pageCount = await getPDFPageCount(paper.file);

            if (typeof pageCount !== 'number' || isNaN(pageCount)) {
              pageCount = -1; // Fallback to a valid number if pageCount is invalid
            }

            // Return paper with pages type as number
            return { ...paper, pages: pageCount };
          }),
        );

        setPapers(updatedPapers);
      } catch (error) {
        console.error('Error loading library.json:', error);
      }
    };

    fetchPapers();
  }, [getPDFPageCount]);

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
                  <TableCell>
                    {paper.pages !== -1 ? paper.pages : <CircularProgress size={24} />}
                  </TableCell>
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
                height: '70vh', // Adjustable based on your needs
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
