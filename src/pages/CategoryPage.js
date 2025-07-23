import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryPage.css';

const subjects = ['All', 'Math', 'English', 'Science', 'Geography'];
const grades = ['All', '1', '2', '3', '4'];
const categories = ['All', 'Math', 'English', 'Science', 'Geography'];
const ITEMS_PER_PAGE = 6;

const CategoryPage = () => {
  const [subject, setSubject] = useState('All');
  const [grade, setGrade] = useState('All');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorksheets = async () => {
      setLoading(true);
      setError('');
      try {
        // Placeholder API call
        console.log('GET /api/worksheets', { subject, grade, category });
        // const res = await axios.get('/api/worksheets', { params: { subject, grade, category } });
        // setWorksheets(res.data);
        setWorksheets([
          { id: 1, title: 'Addition Basics', description: 'Practice simple addition problems.', category: 'Math', subject: 'Math', grade: '1', thumbnail: '' },
          { id: 2, title: 'Reading Comprehension', description: 'Short stories with questions.', category: 'English', subject: 'English', grade: '2', thumbnail: '' },
          { id: 3, title: 'World Capitals', description: 'Learn the capitals of the world.', category: 'Geography', subject: 'Geography', grade: '3', thumbnail: '' },
          { id: 4, title: 'Multiplication Drill', description: 'Timed multiplication practice.', category: 'Math', subject: 'Math', grade: '2', thumbnail: '' },
          { id: 5, title: 'Grammar Practice', description: 'Identify nouns, verbs, and adjectives.', category: 'English', subject: 'English', grade: '3', thumbnail: '' },
          { id: 6, title: 'Science Facts', description: 'Fun facts about the solar system.', category: 'Science', subject: 'Science', grade: '4', thumbnail: '' },
          { id: 7, title: 'Fractions Fun', description: 'Intro to fractions.', category: 'Math', subject: 'Math', grade: '3', thumbnail: '' },
          { id: 8, title: 'Earth Layers', description: 'Label the layers of the Earth.', category: 'Science', subject: 'Science', grade: '2', thumbnail: '' },
          { id: 9, title: 'Story Sequencing', description: 'Arrange story events in order.', category: 'English', subject: 'English', grade: '1', thumbnail: '' },
        ]);
      } catch (err) {
        setError('Network error, please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorksheets();
  }, [subject, grade, category]);

  const filtered = worksheets.filter(w =>
    (subject === 'All' || w.subject === subject) &&
    (grade === 'All' || w.grade === grade) &&
    (category === 'All' || w.category === category)
  );

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="category-page">
      <aside className="sidebar">
        <h3>Filter Worksheets</h3>
        <div className="filter-group">
          <label>Subject</label>
          <select value={subject} onChange={e => { setSubject(e.target.value); setPage(1); }}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Grade Level</label>
          <select value={grade} onChange={e => { setGrade(e.target.value); setPage(1); }}>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </aside>
      <main className="worksheet-listing">
        <h1>Browse Worksheets</h1>
        {loading && <div className="loading-message">Loading worksheets...</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="worksheet-grid">
          {paginated.map(w => (
            <div className="worksheet-card" key={w.id}>
              <div className="thumbnail-placeholder">PDF</div>
              <div className="worksheet-title">{w.title}</div>
              <div className="worksheet-desc">{w.description}</div>
              <div className="worksheet-meta">
                <span>{w.category}</span> | <span>Grade {w.grade}</span>
              </div>
            </div>
          ))}
          {paginated.length === 0 && !loading && <div>No worksheets found.</div>}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i+1}
              className={page === i+1 ? 'active' : ''}
              onClick={() => setPage(i+1)}
            >
              {i+1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage; 