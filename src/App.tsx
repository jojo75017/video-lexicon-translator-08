import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
import EbookPlannerPage from './pages/EbookPlannerPage';
import EbookIdeasPage from './pages/EbookIdeasPage';
import SubscriptionPage from './pages/SubscriptionPage';
import { AdminPage } from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import { SubscriptionAuth } from '@/components/SubscriptionAuth';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check admin auth
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const { data, error } = await supabase.functions.invoke('check-admin');
          if (!error && data?.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
      
      setIsCheckingAuth(false);
    };

    // Check subscriber auth
    const savedEmail = localStorage.getItem('subscriber_email');
    const savedData = localStorage.getItem('subscriber_data');
    if (savedEmail && savedData) {
      setSubscriberEmail(savedEmail);
      setSubscriberData(JSON.parse(savedData));
      setIsAuthenticated(true);
    }

    checkAdminAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data, error } = await supabase.functions.invoke('check-admin');
          if (!error && data?.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthenticated = (email: string, data: any) => {
    setSubscriberEmail(email);
    setSubscriberData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSubscriberEmail('');
    setSubscriberData(null);
  };


  if (isCheckingAuth) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Navigate to="/ebook-ideas" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/ebook-ideas"
              element={
                isAdmin || isAuthenticated ? (
                  <EbookIdeasPage />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route
              path="/ebook-planner"
              element={
                isAdmin || isAuthenticated ? (
                  <EbookPlannerPage subscriberEmail={subscriberEmail} subscriberData={subscriberData} />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route 
              path="/subscription" 
              element={
                isAuthenticated ? (
                  <SubscriptionPage 
                    subscriberEmail={subscriberEmail} 
                    subscriberData={subscriberData}
                    onLogout={handleLogout}
                  />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route 
              path="/admin" 
              element={isAdmin ? <AdminPage /> : <Navigate to="/auth" replace />} 
            />
          </Routes>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;