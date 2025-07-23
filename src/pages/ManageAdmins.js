import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageAdmins.css';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('admin-token');
        const res = await axios.get('/api/admin/admins', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAdmins(res.data);
      } catch (err) {
        setError('Failed to fetch admins.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) return;
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('admin-token');
      const res = await axios.post('/api/admin/admins', {
        username: newUsername,
        email: newEmail,
        password: newPassword
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAdmins([...admins, res.data.admin]);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setSuccess('Admin added successfully!');
    } catch (err) {
      setError('Failed to add admin.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin?')) return;
    setRemovingId(id);
    setError('');
    try {
      const token = localStorage.getItem('admin-token');
      await axios.delete(`/api/admin/admins/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAdmins(admins.filter(admin => admin._id !== id));
    } catch (err) {
      setError('Failed to delete admin.');
    } finally {
      setRemovingId(null);
    }
  };

  // Get current admin username from localStorage (set at login)
  const currentAdmin = localStorage.getItem('admin-username');

  return (
    <section className="manage-admins">
      <h2>Manage Admins</h2>
      {currentAdmin === 'BackendBrew' && (
        <form className="add-admin-form" onSubmit={handleAdd}>
          <div className="form-group">
            <label htmlFor="new-username">Username</label>
            <input
              id="new-username"
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-email">Email</label>
            <input
              id="new-email"
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={adding}>Add Admin</button>
          {success && <div className="success-message">{success}</div>}
        </form>
      )}
      {loading ? (
        <div className="loading-message">Loading admins...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : admins.length === 0 ? (
        <div className="no-admins">No admins in the database.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin._id}>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>
                  <button onClick={() => handleDelete(admin._id)} disabled={removingId === admin._id}>
                    {removingId === admin._id ? 'Deleting...' : 'Delete'}
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

export default ManageAdmins; 