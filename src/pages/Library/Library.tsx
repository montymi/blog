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

        let isUpdated = false;

        const updatedPapers: Paper[] = await Promise.all(
          data.map(async (paper) => {
            // Skip if pages already exist and are valid
            if (typeof paper.pages === 'number' && !isNaN(paper.pages)) {
              return paper;
            }

            // Calculate page count if missing or invalid
            let pageCount = await getPDFPageCount(paper.file);
            if (typeof pageCount !== 'number' || isNaN(pageCount)) {
              pageCount = -1; // Default fallback
            }

            isUpdated = true; // Track that we made changes
            return { ...paper, pages: pageCount };
          }),
        );

        // Write back to library.json if updates were made
        if (isUpdated) {
          await writeToLibraryJson(updatedPapers);
        }

        setPapers(updatedPapers); // Set state with updated papers
      } catch (error) {
        console.error('Error loading library.json:', error);
      }
    };

    // Function to write updated papers to library.json
    const writeToLibraryJson = async (papers: Paper[]) => {
      try {
        const response = await fetch('/library.json', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(papers),
        });

        if (!response.ok) {
          throw new Error(`Failed to update library.json: ${response.statusText}`);
        }
        console.log('Successfully wrote to the Library');
      } catch (error) {
        console.error('Error saving to library.json:', error);
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
            <>
              <div
                className="pdf-content-container"
                style={{
                  position: 'relative',
                  height: '70%', // Adjustable based on your needs
                }}
              >
                <PDFViewer fileUrl={selectedPdf} />
              </div>
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
                .pdf-content-container {
                  width: 100% !important; /* Full width on small screens */
                  max-width: 100% !important;
		  height: 100% !important;
		  max-height: 100% !important;
                }
               }
              `}
              </style>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Library;
