import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    navigate('/admin-login');
  };

  return (
    <section className="admin-dashboard">
      <h1>Welcome, Admin!</h1>
      <nav className="admin-nav">
        <ul>
          <li><Link to="/upload-pdf">Upload New PDF</Link></li>
          <li><Link to="/manage-pdfs">Manage PDFs</Link></li>
          <li><Link to="/manage-admins">Manage Admins</Link></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>
    </section>
  );
};

export default AdminDashboard; 