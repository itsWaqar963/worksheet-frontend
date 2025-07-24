import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch worksheets on mount
  useEffect(() => {
    const fetchWorksheets = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/worksheets`);
        setWorksheets(res.data);
      } catch (err) {
        setWorksheets([]);
      }
      setLoading(false);
    };
    fetchWorksheets();
  }, []);

  // Filter logic (simple search by title/description)
  const filteredWorksheets = worksheets.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ai-homepage" style={{ minHeight: '100vh', background: '#f6f5ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '40px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#7b6ef6', marginBottom: '2.5rem', letterSpacing: 1 }}>BBWORKSHEETS</h1>
      <form style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', marginBottom: 24 }}>
          <input
            type="text"
            placeholder="✨ Search worksheets here..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1.2rem 1.5rem',
              border: '2px solid #a89af7',
              borderRadius: 12,
              fontSize: '1.3rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(123,110,246,0.07)',
              marginBottom: 0,
              fontWeight: 500,
            }}
          />
        </div>
      </form>
      <div style={{ width: '100%', maxWidth: 900, marginTop: 32 }}>
        {loading ? (
          <div>Loading worksheets...</div>
        ) : filteredWorksheets.length === 0 ? (
          <div>No worksheets found.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {filteredWorksheets.map(w => (
              <div key={w._id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(123,110,246,0.08)', padding: '1.5rem', minWidth: 240, maxWidth: 320, flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{w.title}</div>
                <div style={{ color: '#444', fontSize: '0.98rem' }}>{w.description}</div>
                <div style={{ fontSize: '0.9rem', color: '#7b6ef6', fontWeight: 500 }}>{w.category}</div>
                {w.fileUrl && (
                  <a
                    href={w.fileUrl}
                    className="download-btn"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: '#7b6ef6',
                      color: '#fff',
                      padding: '0.7rem 1.5rem',
                      borderRadius: 30,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      marginTop: '0.5rem',
                      transition: 'background 0.2s',
                    }}
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 