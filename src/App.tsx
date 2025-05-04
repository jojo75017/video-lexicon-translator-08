
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
      </Routes>
    </Router>
  );
}

export default App;
