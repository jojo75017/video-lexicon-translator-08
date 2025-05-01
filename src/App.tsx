import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SeoPage from './pages/SeoPage';
import OutilsSeoPage from './pages/OutilsSeoPage'; // Import the new page
import KeywordResearchPage from './pages/KeywordResearchPage';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import OutilsSeo from './pages/OutilsSeo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/seo" element={<SeoPage />} />
        <Route path="/keyword-research" element={<KeywordResearchPage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/outils" element={<OutilsSeo />} />
        <Route path="/outils-seo" element={<OutilsSeoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
