import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EbookPlannerPage from '@/pages/EbookPlannerPage';
import EbookIdeasPage from '@/pages/EbookIdeasPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/ebook-ideas" replace />} />
          <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
          <Route path="/ebook-planner" element={<EbookPlannerPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;