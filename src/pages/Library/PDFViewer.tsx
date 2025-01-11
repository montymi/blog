import React, { useState } from 'react';
import { Worker } from '@react-pdf-viewer/core'; // For worker file
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Default styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Default layout styles
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { giphy404, email } from '@/config';
import { Visibility, Download, Close, Email } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';

interface PDFViewerProps {
  selectedPdf: string;
  handleCloseViewer: () => void;
  handleDownload: () => void;
  openDialog: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  selectedPdf = '',
  handleCloseViewer,
  handleDownload,
  openDialog,
}) => {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;
  const [scale] = useState(1);

  const fallbackPdf = giphy404; // Replace with your fallback PDF path
  const pdfToDisplay = selectedPdf || fallbackPdf;

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseViewer}
        fullWidth
        maxWidth="md"
        aria-labelledby="pdf-viewer-title"
        PaperProps={{
          sx: {
            borderRadius: 0,
            width: '100vw',
            height: '100vh',
            margin: 0,
            maxWidth: '100vw',
            maxHeight: '100vh',
          },
        }}
      >
        <DialogTitle
          id="pdf-viewer-title"
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <IconButton onClick={handleCloseViewer} sx={{ mr: 1 }}>
              <Visibility sx={{ fontSize: '1.5rem' }} />{' '}
            </IconButton>
            {pdfToDisplay.split('/').pop()}
          </div>
          <Tooltip title="Close viewer" arrow>
            <IconButton onClick={handleCloseViewer}>
              <Close color="warning" sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          <div
            className="pdf-content-container"
            style={{
              position: 'relative',
              height: '100%', // Adjustable based on your needs
            }}
          >
            <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
              <Viewer fileUrl={pdfToDisplay} defaultScale={scale} plugins={[zoomPluginInstance]} />
            </Worker>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'absolute',
                top: 10,
                right: 10,
              }}
            >
              <ZoomInButton />
              <ZoomOutButton />
            </div>
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
        </DialogContent>
        <DialogActions>
          <Tooltip title="Contact" arrow>
            <IconButton
              color="secondary"
              onClick={() => (window.location.href = `mailto:${email}`)}
            >
              <Email sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download" arrow>
            <IconButton color="secondary" onClick={handleDownload}>
              <Download sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PDFViewer;
