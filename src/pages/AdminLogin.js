import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
console.log('Backend URL in use:', backendUrl);

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = { username, password };
      const res = await axios.post(`${backendUrl}/api/admin/login`, payload);
      if (res.data.success && res.data.token) {
        localStorage.setItem('admin-auth', 'true');
        localStorage.setItem('admin-token', res.data.token);
        // Store username for super admin check
        localStorage.setItem('admin-username', username);
        navigate('/admin-dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Network error, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        {loading && <div className="loading-message">Logging in...</div>}
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-btn" disabled={loading}>Log In</button>
      </form>
    </section>
  );
};

export default AdminLogin; 