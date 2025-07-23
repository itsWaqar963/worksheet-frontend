import React, { useState } from 'react';
import axios from 'axios';
import './PdfUploadForm.css';

const categories = ['Math', 'English', 'Science', 'Geography'];

const PdfUploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [tags, setTags] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = e => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setError('');
    if (!file || !title || !description || !category) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setProgress(30);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('tags', tags);
      const token = localStorage.getItem('admin-token');
      const res = await axios.post('/api/worksheets/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      setProgress(100);
      setStatus('Upload successful!');
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory(categories[0]);
      setTags('');
      setTimeout(() => setProgress(0), 1000);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Network error, please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <form className="pdf-upload-form" onSubmit={handleSubmit}>
      <h2>Upload New PDF</h2>
      <div className="form-group">
        <label>PDF File</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>
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
      {progress > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
      )}
      {loading && <div className="loading-message">Uploading PDF...</div>}
      {error && <div className="error-message">{error}</div>}
      {status && <div className="success-message">{status}</div>}
      <button type="submit" className="upload-btn" disabled={loading}>Upload PDF</button>
    </form>
  );
};

export default PdfUploadForm; 