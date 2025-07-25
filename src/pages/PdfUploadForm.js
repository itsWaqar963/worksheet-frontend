import React, { useState } from 'react';
import axios from 'axios';
import './PdfUploadForm.css';

const subjects = [
  "Math", "English", "Science", "Geography", "Drawing", "Urdu", "Islamic Studies", "Other"
];
const grades = [
  "", "Nursery", "KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"
];
const ageGroups = [
  "", "Ages 3–4 (Preschool)", "Ages 5–6 (Kindergarten)", "Ages 7–8 (Grade 1–2)", "Ages 9–10 (Grade 3–4)", "Ages 11+ (Grade 5+)"
];
const categories = ['Math', 'English', 'Science', 'Geography'];

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const PdfUploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [subject, setSubject] = useState('Other');
  const [grade, setGrade] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
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
    if (!file || !title || !description || !subject) {
      setError('File, title, description, and subject are required.');
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
      formData.append('subject', subject && subject.trim() !== "" ? subject : "Other");
      formData.append('grade', grade);
      formData.append('ageGroup', ageGroup);
      formData.append('tags', tags);

      const token = localStorage.getItem('admin-token');
      const res = await axios.post(`${backendUrl}/api/worksheets/upload`, formData, {
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
      setSubject('Other');
      setGrade('');
      setAgeGroup('');
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
        <label>Subject <span style={{color: 'red'}}>*</span></label>
        <select value={subject} onChange={e => setSubject(e.target.value)} required>
          {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Grade</label>
        <select value={grade} onChange={e => setGrade(e.target.value)}>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Age Group</label>
        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)}>
          {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
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