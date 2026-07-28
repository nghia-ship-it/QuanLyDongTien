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
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Route gốc: Nếu có token thì vào /dashboard, chưa thì ở lại mặt tiền */}
        <Route path="/" element={!token ? <LandingPage /> : <Navigate to="/dashboard" />} />
        
        {/* Trang Login/Register */}
        <Route path="/login" element={!token ? <Auth onLoginSuccess={handleLoginSuccess} isLogin={true} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Auth onLoginSuccess={handleLoginSuccess} isLogin={false} /> : <Navigate to="/dashboard" />} />
        
        {/* Trang Dashboard: Nếu có token thì xài component MainDashboard, không thì đá văng ra login */}
        <Route 
          path="/dashboard" 
          element={token ? <MainDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}