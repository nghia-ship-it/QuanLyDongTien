import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
import LandingPage from './components/LandingPage';
import MainDashboard from './components/MainDashboard';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    window.location.href = '/'; // Ép trình duyệt load lại và bay thẳng ra mặt tiền
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!token ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!token ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <MainDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}