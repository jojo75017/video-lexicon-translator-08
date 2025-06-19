
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
import StructurePage from '@/pages/StructurePage';
import PerformancePage from '@/pages/PerformancePage';
import MetricsPage from '@/pages/MetricsPage';
import SuggestionsPage from '@/pages/SuggestionsPage';
import WordCountPage from '@/pages/WordCountPage';
import SeoPage from '@/pages/SeoPage';
import HierarchyPage from '@/pages/HierarchyPage';
import OutilsSeoPage from '@/pages/OutilsSeoPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/hierarchy" element={<HierarchyPage />} />
        <Route path="/wordcount" element={<WordCountPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/metrics" element={<MetricsPage />} />
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
        <Route path="/outils-seo" element={<OutilsSeoPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
