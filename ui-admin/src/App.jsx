import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminPage from '../page/AdminPage';
import LoginPage from '../components/login/Login';
import ProtectedRoute from '../routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;