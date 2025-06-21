
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordGeneratorPage from '@/pages/KeywordGeneratorPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KeywordGeneratorPage />} />
        <Route path="*" element={<KeywordGeneratorPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
