import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

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
      .then(blob => {
        if (blob.type !== 'application/pdf') {
          throw new Error('Invalid file type: ' + blob.type);
        }
        setPdfBlob(blob);
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        setError(err.message);
      });
  }, [fileUrl]);

  return (
    <div style={{
      minWidth: 220,
      minHeight: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {error && <div style={{ color: 'red', marginTop: 8 }}>Failed to load PDF preview: {error}</div>}
      {!pdfBlob && !error && <div>Loading PDF preview...</div>}
      {pdfBlob && (
        <Document
          file={pdfBlob}
          onLoadError={(err) => {
            console.error("PDF Load Error:", err);
            setError("PDF failed to render.");
          }}
          onSourceError={(err) => {
            console.error("PDF Source Error:", err);
            setError("PDF source error.");
          }}
        >
          <Page pageNumber={1} width={220} />
        </Document>
      )}
    </div>
  );
}
