import React from "react";
import PDFPreview from "./PDFPreview";

export default function WorksheetCard({ worksheet, liked, likeCount, onLike }) {
  return (
    <div className="ws-card">
      <div className="ws-card-thumb">
        <PDFPreview fileUrl={worksheet.fileUrl} width={110} height={150} />
      </div>
      <div className="ws-card-title">{worksheet.title}</div>
      <button
        className={`ws-like-btn${liked ? " liked" : ""}`}
        onClick={() => onLike(worksheet._id)}
        disabled={liked}
        aria-label="Like"
      >
        <svg width="20" height="20" fill={liked ? "#4f8cff" : "none"} stroke="#4f8cff" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.04 3 12.5 3.99 13.07 5.36C13.64 3.99 15.1 3 16.64 3C19.64 3 22.14 5.5 22.14 8.5C22.14 13.5 12 21 12 21Z"/>
        </svg>
        <span style={{ marginLeft: 6 }}>{likeCount}</span>
      </button>
      <div className="ws-card-desc">{worksheet.description}</div>
      <div className="ws-card-meta">{worksheet.subject}</div>
      <a
        href={worksheet.fileUrl}
        className="ws-download-icon"
        title="Download PDF"
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </a>
    </div>
  );
} 