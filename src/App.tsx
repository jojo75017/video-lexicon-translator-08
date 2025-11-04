import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
import EbookPlannerPage from './pages/EbookPlannerPage';
import EbookIdeasPage from './pages/EbookIdeasPage';
import { AdminPage } from './pages/AdminPage';
import { SubscriptionAuth } from '@/components/SubscriptionAuth';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberData, setSubscriberData] = useState<any>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('subscriber_email');
    const savedData = localStorage.getItem('subscriber_data');
    if (savedEmail && savedData) {
      setSubscriberEmail(savedEmail);
      setSubscriberData(JSON.parse(savedData));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = (email: string, data: any) => {
    setSubscriberEmail(email);
    setSubscriberData(data);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SubscriptionAuth onAuthenticated={handleAuthenticated} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Navigate to="/ebook-ideas" replace />} />
            <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
            <Route path="/ebook-planner" element={<EbookPlannerPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;