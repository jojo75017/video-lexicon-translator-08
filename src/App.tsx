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
import AdminProfilePage from './pages/AdminProfilePage';
import AffiliationFormationPage from './pages/AffiliationFormationPage';
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
    const initAuth = async () => {
      // Check subscriber auth
      const savedEmail = localStorage.getItem('subscriber_email');
      const savedData = localStorage.getItem('subscriber_data');
      if (savedEmail && savedData) {
        setSubscriberEmail(savedEmail);
        setSubscriberData(JSON.parse(savedData));
        setIsAuthenticated(true);
      }

      // Check admin session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Session admin trouvée dans App.tsx');
          const { data, error } = await supabase.functions.invoke('check-admin');
          
          if (error) {
            console.error('Erreur check-admin dans App.tsx:', error);
          } else if (data?.isAdmin) {
            console.log('Statut admin confirmé dans App.tsx');
            setIsAdmin(true);
          } else {
            console.log('Utilisateur non-admin dans App.tsx');
          }
        } else {
          console.log('Aucune session admin trouvée dans App.tsx');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session admin:', error);
      }

      setIsCheckingAuth(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        setTimeout(async () => {
          const { data, error } = await supabase.functions.invoke('check-admin');
          if (error) {
            console.error('Erreur check-admin lors du changement d\'état:', error);
          } else if (data?.isAdmin) {
            console.log('Admin confirmé lors du changement d\'état');
            setIsAdmin(true);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log('Déconnexion détectée');
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
            <Route path="/affiliation" element={<AffiliationFormationPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/ai-chat" element={<AiChatPage />} />
            <Route
              path="/ebook-ideas"
              element={<EbookIdeasPage />}
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
            <Route 
              path="/admin/profile" 
              element={isAdmin ? <AdminProfilePage /> : <Navigate to="/auth" replace />} 
            />
          </Routes>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;