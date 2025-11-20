// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Trang
import AdminPage from '../page/AdminPage';
import LoginPage from '../components/login/Login';
import ProtectedRoute from '../routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Route bảo vệ Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Root "/" redirect về login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;