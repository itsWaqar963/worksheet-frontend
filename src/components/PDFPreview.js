import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFPreview({ fileUrl }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  return (
    <div style={{ minWidth: 220, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Document
        file={fileUrl}
        loading={<div>Loading PDF preview...</div>}
        onLoadSuccess={() => setLoading(false)}
        onLoadError={err => { setError(err.message); setLoading(false); }}
      >
        <Page pageNumber={1} width={220} />
      </Document>
      {error && <div style={{ color: 'red', marginTop: 8 }}>Failed to load PDF preview</div>}
    </div>
  );
} 