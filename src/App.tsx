import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
import EbookPlannerPage from './pages/EbookPlannerPage';
import EbookIdeasPage from './pages/EbookIdeasPage';
import AiChatPage from './pages/AiChatPage';
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
    const ensureAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        try {
          // First check
          const { data, error } = await supabase.functions.invoke('check-admin');
          if (!error && data?.isAdmin) {
            setIsAdmin(true);
          } else {
            // Attempt one-time bootstrap (only if no admin exists)
            try {
              await supabase.functions.invoke('bootstrap-admin');
              const { data: recheck } = await supabase.functions.invoke('check-admin');
              if (recheck?.isAdmin) setIsAdmin(true);
            } catch (e) {
              // ignore if already initialized
            }
          }
        } catch (error) {
          console.error('Error ensuring admin status:', error);
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

    ensureAdmin();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Defer to avoid deadlocks per best practices
        setTimeout(() => {
          ensureAdmin();
        }, 0);
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
            <Route path="/ai-chat" element={<AiChatPage />} />
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