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
import AdminDirectPage from './pages/AdminDirectPage';
import AffiliationFormationPage from './pages/AffiliationFormationPage';
import FormationPage from './pages/FormationPage';
import FormationSeriesPage from './pages/FormationSeriesPage';
import FormationAudioPage from './pages/FormationAudioPage';
import FormationSeriesAudioPage from './pages/FormationSeriesAudioPage';
import SalesPage from './pages/SalesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import DemoPage from './pages/DemoPage';
import OfferValuePage from './pages/OfferValuePage';
import { SubscriptionAuth } from '@/components/SubscriptionAuth';
import { supabase } from '@/integrations/supabase/client';

// SaaS Pages
import { SaasLayout } from '@/components/saas/SaasLayout';
import SaasDashboard from '@/pages/saas/SaasDashboard';
import SaasAnalytics from '@/pages/saas/SaasAnalytics';
import SaasBilling from '@/pages/saas/SaasBilling';
import SaasSettings from '@/pages/saas/SaasSettings';
import SaasAuthPage from '@/pages/saas/SaasAuthPage';
const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const invokeCheckAdmin = (accessToken?: string) => {
      return supabase.functions.invoke(
        'check-admin',
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
      );
    };

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
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log('Session admin trouvée dans App.tsx');
          const { data, error } = await invokeCheckAdmin(session.access_token);

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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);

      // IMPORTANT: INITIAL_SESSION happens on refresh when a session already exists.
      // We must treat it like SIGNED_IN to keep isAdmin in sync.
      const shouldRecheckAdmin =
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') &&
        !!session;

      if (shouldRecheckAdmin && session) {
        setTimeout(async () => {
          const { data, error } = await invokeCheckAdmin(session.access_token);
          if (error) {
            console.error("Erreur check-admin lors du changement d'état:", error);
            setIsAdmin(false);
            return;
          }

          setIsAdmin(!!data?.isAdmin);
        }, 0);
        return;
      }

      if (!session || event === 'SIGNED_OUT') {
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
            <Route path="/" element={<Navigate to="/offres" replace />} />
            <Route path="/offres" element={<SalesPage />} />
            <Route path="/valeur-offre" element={<OfferValuePage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/paiement-succes" element={<PaymentSuccessPage />} />
            <Route path="/affiliation" element={<AffiliationFormationPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin-direct" element={<AdminDirectPage />} />
            <Route path="/ai-chat" element={<AiChatPage />} />
            <Route
              path="/ebook-ideas"
              element={<EbookIdeasPage />}
            />
            <Route
              path="/ebook-planner"
              element={
                <EbookPlannerPage 
                  subscriberEmail={subscriberEmail || ''} 
                  subscriberData={subscriberData} 
                  isDemo={!isAuthenticated && !isAdmin}
                />
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
            <Route 
              path="/formation" 
              element={
                isAdmin || isAuthenticated ? (
                  <FormationPage />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route 
              path="/formation-audio" 
              element={
                isAdmin || isAuthenticated ? (
                  <FormationAudioPage />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route 
              path="/formation-series" 
              element={
                isAdmin || isAuthenticated ? (
                  <FormationSeriesPage />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            <Route 
              path="/formation-series-audio" 
              element={
                isAdmin || isAuthenticated ? (
                  <FormationSeriesAudioPage />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            
            {/* SaaS Routes */}
            <Route path="/saas/login" element={<SaasAuthPage />} />
            <Route path="/saas" element={<SaasLayout userRole={isAdmin ? 'admin' : 'pro'} />}>
              <Route index element={<SaasDashboard />} />
              <Route path="analytics" element={<SaasAnalytics />} />
              <Route path="billing" element={<SaasBilling />} />
              <Route path="settings" element={<SaasSettings />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;