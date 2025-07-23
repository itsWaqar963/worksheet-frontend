import React from 'react';
import './WorksheetDetail.css';

const worksheet = {
  id: 1,
  title: 'Addition Basics',
  description: 'Practice simple addition problems with this worksheet. Great for Grade 1 students learning the basics of math.',
  category: 'Math',
  subject: 'Math',
  grade: '1',
  pdfUrl: '#',
};

const relatedWorksheets = [
  { id: 2, title: 'Multiplication Drill', category: 'Math' },
  { id: 3, title: 'Fractions Fun', category: 'Math' },
  { id: 4, title: 'Subtraction Practice', category: 'Math' },
];

const WorksheetDetail = () => {
  return (
    <div className="worksheet-detail">
      <div className="main-info">
        <h1>{worksheet.title}</h1>
        <div className="meta">
          <span>Category: {worksheet.category}</span> | <span>Grade: {worksheet.grade}</span>
        </div>
        <p className="desc">{worksheet.description}</p>
        <a href={worksheet.pdfUrl} className="download-btn" download>
          Click to Download PDF
        </a>
        <div className="pdf-preview-placeholder">
          <span>PDF Preview (Coming Soon)</span>
        </div>
      </div>
      <div className="related-section">
        <h2>Related Worksheets</h2>
        <ul>
          {relatedWorksheets.map(w => (
            <li key={w.id}>
              <span className="related-title">{w.title}</span> <span className="related-cat">({w.category})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorksheetDetail; 