
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import KeywordPage from '@/pages/KeywordPage';
import KeywordGeneratorPage from '@/pages/KeywordGeneratorPage';
import KeywordGuideComplete from '@/pages/KeywordGuideComplete';
import SimpleInternalLinksPage from '@/pages/SimpleInternalLinksPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DashboardPage from '@/pages/DashboardPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/internal-linking" element={<SimpleInternalLinksPage />} />
        <Route path="/internal-links" element={<SimpleInternalLinksPage />} />
        <Route path="/keyword-analysis" element={<KeywordPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/keyword-guide-complete" element={<KeywordGuideComplete />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
