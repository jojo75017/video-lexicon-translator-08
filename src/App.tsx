import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import SettingsPage from './pages/SettingsPage';
import PinterestPage from './pages/PinterestPage';
import SignaturePage from './pages/SignaturePage';
import WordCountPage from './pages/WordCountPage';
import StructurePage from './pages/StructurePage';
import PerformancePage from './pages/PerformancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SeoPage from './pages/SeoPage';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/hierarchy" element={<IndexPage />} />
        <Route path="/wordcount" element={<WordCountPage />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
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
