
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import IndexPage from './pages/Index';
import SeoPage from './pages/SeoPage';
import OutilsSeoPage from './pages/OutilsSeoPage';
import OutilsSeo from './pages/OutilsSeo';
import PinterestPage from './pages/PinterestPage';
import StructurePage from './pages/StructurePage';
import SignaturePage from './pages/SignaturePage';
import KeywordMetaPage from './pages/KeywordMetaPage';
import KeywordPage from './pages/KeywordPage';
import InternalLinkingPage from './pages/InternalLinkingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/outils" element={<OutilsSeo />} />
        <Route path="/outils-seo" element={<OutilsSeoPage />} />
        <Route path="/pinterest" element={<PinterestPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/keyword-meta" element={<KeywordMetaPage />} />
        <Route path="/wordcount" element={<KeywordPage />} />
        <Route path="/internal-linking" element={<InternalLinkingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
