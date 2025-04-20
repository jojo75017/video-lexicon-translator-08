
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import SettingsPage from './pages/SettingsPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/hierarchy" element={<IndexPage />} />
        <Route path="/wordcount" element={<IndexPage />} />
        <Route path="/seo" element={<IndexPage />} />
        <Route path="/structure" element={<IndexPage />} />
        <Route path="/performance" element={<IndexPage />} />
        <Route path="/analytics" element={<IndexPage />} />
        <Route path="/suggestions" element={<IndexPage />} />
        <Route path="/backlinks" element={<IndexPage />} />
        <Route path="/metrics" element={<IndexPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
