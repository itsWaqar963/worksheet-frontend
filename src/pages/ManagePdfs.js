import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManagePdfs.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ManagePdfs = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${backendUrl}/api/worksheets`);
        setPdfs(res.data);
      } catch (err) {
        setError('Failed to fetch PDFs.');
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this PDF?')) return;
    setDeletingId(id);
    setError('');
    try {
      const token = localStorage.getItem('admin-token');
      await axios.delete(`${backendUrl}/api/worksheets/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPdfs(pdfs.filter(pdf => pdf._id !== id));
    } catch (err) {
      setError('Failed to delete PDF.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="manage-pdfs">
      <h2>Manage PDFs</h2>
      {loading ? (
        <div className="loading-message">Loading PDFs...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : pdfs.length === 0 ? (
        <div className="no-pdfs">No PDFs in the database.</div>
      ) : (
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map(pdf => (
              <tr key={pdf._id}>
                <td>{pdf.title}</td>
                <td>{pdf.category}</td>
                <td>{pdf.grade}</td>
                <td>
                  <button onClick={() => handleDelete(pdf._id)} disabled={deletingId === pdf._id}>
                    {deletingId === pdf._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ManagePdfs; 