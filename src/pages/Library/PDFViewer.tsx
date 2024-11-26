import React from 'react';
import { Worker } from '@react-pdf-viewer/core'; // For worker file
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Default styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Default layout styles

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: 'background.default' }}>
      {/* Ensure the PDF worker is properly configured */}
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
        <Viewer fileUrl={fileUrl} />
      </Worker>
    </div>
  );
};

export default PDFViewer;
