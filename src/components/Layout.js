import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';
import logo from '../assets/logo.png'; // Import your logo

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('admin-auth') === 'true';
  const isSuperAdmin = sessionStorage.getItem('admin-username') === 'BackendBrew';

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    sessionStorage.removeItem('admin-token');
    sessionStorage.removeItem('admin-username');
    sessionStorage.removeItem('admin-login-time');
    window.location.href = '/admin-login';
  };

  return (
    <>
      <header>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: 40, marginRight: 12 }} />
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--primary)' }}>BBSheets</span>
          </div>
          <div>
            <Link to="/" style={{ marginRight: '1.5rem' }}>Home</Link>
            <Link to="/categories" style={{ marginRight: '1.5rem' }}>Categories</Link>
            {isAdmin ? (
              <>
                <Link to="/admin-dashboard" style={{ marginRight: '1.5rem' }}>Dashboard</Link>
                {isSuperAdmin && <Link to="/manage-admins" style={{ marginRight: '1.5rem' }}>Manage Admins</Link>}
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <Link to="/admin-login">Admin Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <div style={{ textAlign: 'center', color: '#888' }}>
          &copy; {new Date().getFullYear()} Worksheet App. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Layout; 