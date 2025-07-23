import React, { useState } from 'react';
import axios from 'axios';
import './EditPdfForm.css';

const categories = ['Math', 'English', 'Science', 'Geography'];

// Placeholder for selected PDF metadata
const initialPdf = {
  id: 1,
  title: 'Addition Basics',
  description: 'Practice simple addition problems.',
  category: 'Math',
  tags: 'addition, math, grade 1',
};

const EditPdfForm = ({ onCancel }) => {
  const [title, setTitle] = useState(initialPdf.title);
  const [description, setDescription] = useState(initialPdf.description);
  const [category, setCategory] = useState(initialPdf.category);
  const [tags, setTags] = useState(initialPdf.tags);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setError('');
    if (!title || !description || !category) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      // Placeholder API call
      const payload = { title, description, category, tags };
      console.log('PUT /api/admin/pdfs/' + initialPdf.id, payload);
      // await axios.put(`/api/admin/pdfs/${initialPdf.id}`, payload);
      setTimeout(() => {
        setStatus('Update successful!');
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Network error, please try again.');
      setLoading(false);
    }
  };

  return (
    <form className="edit-pdf-form" onSubmit={handleSubmit}>
      <h2>Edit PDF Metadata</h2>
      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Tags (comma separated)</label>
        <input type="text" value={tags} onChange={e => setTags(e.target.value)} />
      </div>
      {loading && <div className="loading-message">Saving changes...</div>}
      {error && <div className="error-message">{error}</div>}
      {status && <div className="success-message">{status}</div>}
      <div className="edit-actions">
        <button type="submit" className="save-btn" disabled={loading}>Save Changes</button>
        <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
    </form>
  );
};

export default EditPdfForm; 