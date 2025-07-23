import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [worksheets, setWorksheets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorksheets = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/worksheets');
        // Defensive: ensure res.data is always an array
        if (Array.isArray(res.data)) {
          setWorksheets(res.data);
        } else {
          setWorksheets([]);
        }
      } catch (err) {
        setError('Failed to fetch worksheets.');
        setWorksheets([]); // Defensive: set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchWorksheets();
  }, []);

  // Defensive: ensure worksheets is always an array before filtering
  const filteredWorksheets = (Array.isArray(worksheets) ? worksheets : []).filter(w =>
    w.title && w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.description && w.description.toLowerCase().includes(search.toLowerCase())
  );

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
        <h1>Free Learning Resources for Curious Young Minds</h1>
        <p>Explore and download engaging, printable worksheets to support your child’s learning at home — organized by subject and grade, with no signup needed.</p>
        </div>
      </section>
      <section className="search-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Search worksheets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>
      <section className="worksheet-section">
        <h2>Popular Worksheets</h2>
        {loading ? (
          <div className="loading-message">Loading worksheets...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredWorksheets.length === 0 ? (
          <div className="no-worksheets">No worksheets found.</div>
        ) : (
          <div className="worksheet-list">
            {filteredWorksheets.slice(0, 3).map(w => (
              <div className="worksheet-card" key={w._id}>
                <div className="worksheet-title">{w.title}</div>
                {w.originalName && <div className="worksheet-filename">{w.originalName}</div>}
                <div className="worksheet-desc">{w.description}</div>
                <div className="worksheet-cat">{w.category}</div>
                {w.fileUrl && (
                  <a
                    href={`${backendUrl}${w.fileUrl}`}
                    className="download-btn"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="worksheet-section">
        <h2>Recent Worksheets</h2>
        {loading ? (
          <div className="loading-message">Loading worksheets...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredWorksheets.length === 0 ? (
          <div className="no-worksheets">No worksheets found.</div>
        ) : (
          <div className="worksheet-list">
            {filteredWorksheets.slice(3, 6).map(w => (
              <div className="worksheet-card" key={w._id}>
                <div className="worksheet-title">{w.title}</div>
                <div className="worksheet-desc">{w.description}</div>
                <div className="worksheet-cat">{w.category}</div>
                {w.fileUrl && (
                  <a
                    href={`${backendUrl}${w.fileUrl}`}
                    className="download-btn"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage; 