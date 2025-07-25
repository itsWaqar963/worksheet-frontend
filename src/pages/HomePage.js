import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import PDFPreview from '../components/PDFPreview';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const GRADES = ['All', 'Nursery', 'KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
const SUBJECTS = [
  'All',
  'Math',
  'English',
  'Science',
  'Drawing',
  'Urdu',
  'Islamic Studies',
  'Christian Studies',
  'Hindu Studies',
  'Sikh Studies',
  'Buddhist Studies',
  'Judaism',
  'Critical Thinking',
  'Thought Leadership',
  'Computer Science',
  'AI',
  'Social Studies',
  'History',
  'Geography',
  'Civics',
  'Economics',
  'Languages',
  'Arts',
  'Music',
  'Physical Education',
  'Environmental Studies',
  'Philosophy',
  'Ethics',
  'Technology',
  'Coding',
  'Robotics'
];

const AGE_GROUPS = [
  'All',
  'Ages 3–4 (Preschool)',
  'Ages 5–6 (Kindergarten)',
  'Ages 7–8 (Grade 1–2)',
  'Ages 9–10 (Grade 3–4)',
  'Ages 11+ (Grade 5+)',
];

function mapGradeToAgeGroup(grade) {
  if (!grade) return 'All';
  if (grade === 'Nursery') return 'Ages 3–4 (Preschool)';
  if (grade === 'KG') return 'Ages 5–6 (Kindergarten)';
  if (grade === 'Grade 1' || grade === 'Grade 2') return 'Ages 7–8 (Grade 1–2)';
  if (grade === 'Grade 3' || grade === 'Grade 4') return 'Ages 9–10 (Grade 3–4)';
  if (grade === 'Grade 5') return 'Ages 11+ (Grade 5+)';
  return 'All';
}

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState(() => localStorage.getItem('bbworksheets_grade') || 'All');
  const [subject, setSubject] = useState(() => localStorage.getItem('bbworksheets_subject') || 'All');
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState(() => localStorage.getItem('bbworksheets_ageGroup') || 'All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [likedWorksheets, setLikedWorksheets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bbworksheets_liked') || '[]');
    } catch {
      return [];
    }
  });
  const [likesMap, setLikesMap] = useState({}); // { worksheetId: likeCount }
  const [featuredWorksheet, setFeaturedWorksheet] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  useEffect(() => {
    // Initialize likesMap from worksheet data
    const map = {};
    worksheets.forEach(w => {
      map[w._id] = typeof w.likes === 'number' ? w.likes : 0;
    });
    setLikesMap(map);
  }, [worksheets]);

  useEffect(() => {
    localStorage.setItem('bbworksheets_liked', JSON.stringify(likedWorksheets));
  }, [likedWorksheets]);

  // Featured Worksheet of the Day logic
  useEffect(() => {
    if (!worksheets.length) return;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const cached = localStorage.getItem('bbworksheets_featured');
    let featured = null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.date === today && worksheets.some(w => w._id === parsed.id)) {
          featured = worksheets.find(w => w._id === parsed.id);
        }
      } catch {}
    }
    if (!featured) {
      // Pick a random worksheet
      const idx = Math.floor(Math.random() * worksheets.length);
      featured = worksheets[idx];
      localStorage.setItem('bbworksheets_featured', JSON.stringify({ id: featured._id, date: today }));
    }
    setFeaturedWorksheet(featured);
  }, [worksheets]);

  const handleLike = (worksheetId) => {
    if (likedWorksheets.includes(worksheetId)) return;
    setLikesMap(prev => ({ ...prev, [worksheetId]: (prev[worksheetId] || 0) + 1 }));
    setLikedWorksheets(prev => [...prev, worksheetId]);
  };

  // Save filter preferences
  useEffect(() => {
    localStorage.setItem('bbworksheets_grade', grade);
    localStorage.setItem('bbworksheets_subject', subject);
    localStorage.setItem('bbworksheets_ageGroup', ageGroup);
  }, [grade, subject, ageGroup]);

  // Filter logic
  const filteredWorksheets = worksheets.filter(w => {
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = grade === 'All' || (w.grade && w.grade === grade);
    const matchesSubject = subject === 'All' || (w.subject && w.subject === subject);
    // Age group logic
    const worksheetAgeGroup = w.ageGroup || mapGradeToAgeGroup(w.grade);
    const matchesAgeGroup = ageGroup === 'All' || worksheetAgeGroup === ageGroup;
    return matchesSearch && matchesGrade && matchesSubject && matchesAgeGroup;
  });

  // Autocomplete logic
  const searchSuggestions =
    search.trim().length > 0
      ? worksheets
          .map(w => w.title)
          .filter(title => title.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 5)
      : [];

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    // Optionally, trigger search/filter here if needed
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
    setActiveSuggestion(-1);
  };

  const handleInputBlur = () => {
    // Delay hiding to allow click
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleInputFocus = () => {
    if (search.trim().length > 0) setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setActiveSuggestion((prev) => (prev + 1) % searchSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestion((prev) => (prev - 1 + searchSuggestions.length) % searchSuggestions.length);
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      setSearch(searchSuggestions[activeSuggestion]);
      setShowSuggestions(false);
    }
  };

  const handleClearFilters = () => {
    setGrade('All');
    setSubject('All');
    setAgeGroup('All');
    localStorage.removeItem('bbworksheets_grade');
    localStorage.removeItem('bbworksheets_subject');
    localStorage.removeItem('bbworksheets_ageGroup');
  };

  return (
    <div className="ai-homepage" style={{ minHeight: '100vh', background: '#f6f5ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '40px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#7b6ef6', marginBottom: '2.5rem', letterSpacing: 1 }}>BBWORKSHEETS</h1>
      {/* Featured Worksheet of the Day */}
      {featuredWorksheet && (
        <div style={{ width: '100%', maxWidth: 600, marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#7b6ef6', marginBottom: 8 }}>Featured Worksheet of the Day</div>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(123,110,246,0.08)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{featuredWorksheet.title}</div>
            <div style={{ color: '#444', fontSize: '0.98rem' }}>{featuredWorksheet.description}</div>
            <div style={{ fontSize: '0.9rem', color: '#7b6ef6', fontWeight: 500 }}>{featuredWorksheet.category}</div>
            <div style={{ fontSize: '0.9rem', color: '#7b6ef6', fontWeight: 500 }}>{featuredWorksheet.grade} {featuredWorksheet.subject && `| ${featuredWorksheet.subject}`}</div>
            {featuredWorksheet.fileUrl && (
              <a
                href={featuredWorksheet.fileUrl}
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
        </div>
      )}
      <form style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} autoComplete="off">
        <div style={{ width: '100%', marginBottom: 24, position: 'relative' }}>
          <input
            type="text"
            placeholder="✨ Search worksheets here..."
            value={search}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
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
              position: 'relative',
              zIndex: 2,
            }}
            autoComplete="off"
          />
          {/* Autocomplete dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <ul
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #a89af7',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                boxShadow: '0 4px 16px rgba(123,110,246,0.09)',
                zIndex: 10,
                margin: 0,
                padding: 0,
                listStyle: 'none',
                maxHeight: 220,
                overflowY: 'auto',
              }}
            >
              {searchSuggestions.map((suggestion, idx) => (
                <li
                  key={suggestion}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setActiveSuggestion(idx)}
                  style={{
                    padding: '0.9rem 1.5rem',
                    background: idx === activeSuggestion ? '#ecebfc' : '#fff',
                    color: '#7b6ef6',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    cursor: 'pointer',
                    borderBottom: idx === searchSuggestions.length - 1 ? 'none' : '1px solid #ecebfc',
                    transition: 'background 0.15s',
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
      {/* Age Group Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontWeight: 600, color: '#7b6ef6' }}>
          Age Group:
          <select
            value={ageGroup}
            onChange={e => setAgeGroup(e.target.value)}
            style={{ marginLeft: 8, padding: '0.5rem', borderRadius: 8, border: '1px solid #a89af7', fontSize: '1rem', minWidth: 180 }}
          >
            {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        {/* Existing filters */}
        <label style={{ fontWeight: 600, color: '#7b6ef6' }}>
          Grade:
          <select
            value={grade}
            onChange={e => setGrade(e.target.value)}
            style={{ marginLeft: 8, padding: '0.5rem', borderRadius: 8, border: '1px solid #a89af7', fontSize: '1rem', minWidth: 100 }}
          >
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: '#7b6ef6' }}>
          Subject:
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ marginLeft: 8, padding: '0.5rem', borderRadius: 8, border: '1px solid #a89af7', fontSize: '1rem', minWidth: 120 }}
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <button type="button" onClick={handleClearFilters} style={{ marginLeft: 8, background: '#ecebfc', color: '#7b6ef6', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Clear Filters</button>
      </div>
      {/* Show selected filters as badges */}
      <div style={{ marginBottom: 10 }}>
        {(grade !== 'All' || subject !== 'All' || ageGroup !== 'All') && (
          <div style={{ display: 'flex', gap: 8 }}>
            {grade !== 'All' && <span style={{ background: '#7b6ef6', color: '#fff', borderRadius: 12, padding: '0.2rem 0.8rem', fontSize: '0.95rem' }}>{grade}</span>}
            {subject !== 'All' && <span style={{ background: '#7b6ef6', color: '#fff', borderRadius: 12, padding: '0.2rem 0.8rem', fontSize: '0.95rem' }}>{subject}</span>}
            {ageGroup !== 'All' && <span style={{ background: '#7b6ef6', color: '#fff', borderRadius: 12, padding: '0.2rem 0.8rem', fontSize: '0.95rem' }}>{ageGroup}</span>}
          </div>
        )}
      </div>
      {/* PDF Preview Modal */}
      {previewUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(60,60,80,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(123,110,246,0.13)', padding: 24, position: 'relative', minWidth: 260, minHeight: 340, maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={() => setPreviewUrl(null)} style={{ position: 'absolute', top: 10, right: 10, background: '#ecebfc', color: '#7b6ef6', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Close</button>
            <PDFPreview fileUrl={previewUrl} />
          </div>
        </div>
      )}
      <div style={{ width: '100%', maxWidth: 900, marginTop: 16 }}>
        {loading ? (
          <div>Loading worksheets...</div>
        ) : filteredWorksheets.length === 0 ? (
          <div>No worksheets found for the selected filters.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {filteredWorksheets.map(w => {
              const liked = likedWorksheets.includes(w._id);
              const likeCount = likesMap[w._id] ?? (typeof w.likes === 'number' ? w.likes : 0);
              return (
                <div key={w._id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(123,110,246,0.08)', padding: '1.5rem', minWidth: 240, maxWidth: 320, flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center' }}>
                  {/* PDF Preview at the top of the card */}
                  <PDFPreview fileUrl={w.fileUrl} width={120} height={160} />
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', textAlign: 'center' }}>{w.title}</div>
                  {/* Like button and count */}
                  <div style={{ margin: '0.2rem 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => handleLike(w._id)}
                      disabled={liked}
                      style={{
                        background: liked ? '#ecebfc' : '#7b6ef6',
                        color: liked ? '#7b6ef6' : '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.3rem 1.1rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: liked ? 'not-allowed' : 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      {liked ? `Liked (${likeCount})` : `Like (${likeCount})`}
                    </button>
                  </div>
                  <div style={{ color: '#444', fontSize: '0.98rem', textAlign: 'center' }}>{w.description}</div>
                  <div style={{ fontSize: '0.9rem', color: '#7b6ef6', fontWeight: 500 }}>{w.category}</div>
                  <div style={{ fontSize: '0.9rem', color: '#7b6ef6', fontWeight: 500 }}>{w.grade} {w.subject && `| ${w.subject}`}</div>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 