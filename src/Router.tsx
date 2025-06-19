
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import KeywordPage from '@/pages/KeywordPage';
import KeywordGeneratorPage from '@/pages/KeywordGeneratorPage';
import KeywordGuideComplete from '@/pages/KeywordGuideComplete';
import FreshInternalLinksPage from '@/pages/FreshInternalLinksPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DashboardPage from '@/pages/DashboardPage';
import PinterestPage from '@/pages/PinterestPage';
import SignaturePage from '@/pages/SignaturePage';
import QuoraPage from '@/pages/QuoraPage';
import KeywordMetaPage from '@/pages/KeywordMetaPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/internal-linking" element={<FreshInternalLinksPage />} />
        <Route path="/internal-links" element={<FreshInternalLinksPage />} />
        <Route path="/keyword-analysis" element={<KeywordPage />} />
        <Route path="/keyword-generator" element={<KeywordGeneratorPage />} />
        <Route path="/keyword-guide-complete" element={<KeywordGuideComplete />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/quora" element={<QuoraPage />} />
        <Route path="/keyword-meta" element={<KeywordMetaPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
