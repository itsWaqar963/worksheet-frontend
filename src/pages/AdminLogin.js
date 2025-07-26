import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
console.log('Backend URL in use:', backendUrl);

const SESSION_TIMEOUT_MINUTES = 30;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-logout effect
  React.useEffect(() => {
    const checkSession = () => {
      const loginTime = sessionStorage.getItem('admin-login-time');
      if (loginTime) {
        const now = Date.now();
        const elapsed = (now - parseInt(loginTime, 10)) / 60000; // minutes
        if (elapsed > SESSION_TIMEOUT_MINUTES) {
          sessionStorage.clear();
          navigate('/admin-login?expired=1');
        }
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 60000); // check every minute
    return () => clearInterval(interval);
  }, [navigate]);

  React.useEffect(() => {
    // Show session expired message if redirected
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired')) {
      setError('Session expired. Please login again.');
      sessionStorage.clear();
    }
  }, []);

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
        sessionStorage.setItem('admin-auth', 'true');
        sessionStorage.setItem('admin-token', res.data.token);
        sessionStorage.setItem('admin-username', username);
        sessionStorage.setItem('admin-login-time', Date.now().toString());
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