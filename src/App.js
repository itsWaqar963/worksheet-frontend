import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';
import WorksheetDetail from './pages/WorksheetDetail';
import PdfUploadForm from './pages/PdfUploadForm';
import ManagePdfs from './pages/ManagePdfs';
import ManageAdmins from './pages/ManageAdmins';

// Dummy authentication for protected route
const isAuthenticated = () => {
  return localStorage.getItem('admin-auth') === 'true';
};

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/admin-login" />;
}

function SuperAdminRoute({ children }) {
  return localStorage.getItem('admin-username') === 'BackendBrew'
    ? children
    : <Navigate to="/admin-dashboard" />;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/worksheet/:id" element={<WorksheetDetail />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload-pdf" element={
            <ProtectedRoute>
              <PdfUploadForm />
            </ProtectedRoute>
          } />
          <Route path="/manage-pdfs" element={
            <ProtectedRoute>
              <ManagePdfs />
            </ProtectedRoute>
          } />
          <Route path="/manage-admins" element={
            <ProtectedRoute>
              <SuperAdminRoute>
                <ManageAdmins />
              </SuperAdminRoute>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 