import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ContentGenerator from './pages/ContentGenerator';
import ContentAnalyzer from './pages/ContentAnalyzer';
import SeoAnalyzer from './pages/SeoAnalyzer';
import KeywordGeneratorPage from './pages/KeywordGeneratorPage';
import KeywordGuide from './pages/KeywordGuide';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/content-generator" element={<ContentGenerator />} />
        <Route path="/content-analyzer" element={<ContentAnalyzer />} />
        <Route path="/seo-analyzer" element={<SeoAnalyzer />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/keyword-guide" element={<KeywordGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
