import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

export default function PDFPreview({ fileUrl, width = 120, height = 160 }) {
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
        setError('Preview unavailable');
      });
  }, [fileUrl]);

  return (
    <div style={{
      width,
      height,
      minWidth: width,
      minHeight: height,
      background: '#f6f5ff',
      border: '1.5px solid #a89af7',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(123,110,246,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: 8
    }}>
      {error && <div style={{ color: '#b00', fontSize: 12, textAlign: 'center' }}>{error}</div>}
      {!pdfBlob && !error && <div style={{ color: '#7b6ef6', fontSize: 13 }}>Loading...</div>}
      {pdfBlob && (
        <Document
          file={pdfBlob}
          loading=""
          onLoadError={() => setError('Preview unavailable')}
          onSourceError={() => setError('Preview unavailable')}
        >
          <Page pageNumber={1} width={width - 8} />
        </Document>
      )}
    </div>
  );
}
