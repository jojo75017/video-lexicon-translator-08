import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EbookPlannerPage from '@/pages/EbookPlannerPage';
import EbookIdeasPage from '@/pages/EbookIdeasPage';
import { Toaster } from 'sonner';

function App() {
  // Mock subscriber data for standalone mode
  const mockSubscriberData = {
    email: 'user@example.com',
    plan_type: 'pro',
    status: 'active',
    chapters_generated: 0,
    ebook_plans_generated: 0
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/ebook-ideas" replace />} />
          <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
          <Route path="/ebook-planner" element={
            <EbookPlannerPage 
              subscriberEmail={mockSubscriberData.email} 
              subscriberData={mockSubscriberData} 
            />
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;