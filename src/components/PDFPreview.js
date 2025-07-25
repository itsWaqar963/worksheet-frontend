import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFPreview({ fileUrl }) {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;
    setPdfBlob(null);
    setError(null);
    fetch(fileUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch PDF');
        return res.blob();
      })
      .then(blob => setPdfBlob(blob))
      .catch(err => setError(err.message));
  }, [fileUrl]);

  return (
    <div style={{ minWidth: 220, minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {error && <div style={{ color: 'red', marginTop: 8 }}>Failed to load PDF preview: {error}</div>}
      {!pdfBlob && !error && <div>Loading PDF preview...</div>}
      {pdfBlob && (
        <Document file={pdfBlob}>
          <Page pageNumber={1} width={220} />
        </Document>
      )}
    </div>
  );
} 