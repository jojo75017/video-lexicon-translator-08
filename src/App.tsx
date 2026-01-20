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
import SeoTutorialChatGptPage from './pages/SeoTutorialChatGptPage';
import SeoCreerEbookIaPage from './pages/SeoCreerEbookIaPage';
import SeoGenerateurEbookPage from './pages/SeoGenerateurEbookPage';
import BlogPage from './pages/BlogPage';
import LogoutTotalPage from './pages/LogoutTotalPage';
import PaiementManuelPage from './pages/PaiementManuelPage';
import ConfirmationPaiementPage from './pages/ConfirmationPaiementPage';
import FaqAssistancePage from './pages/FaqAssistancePage';
import NichesPage from './pages/NichesPage';
import { SubscriptionAuth } from '@/components/SubscriptionAuth';
import { supabase } from '@/integrations/supabase/client';
import { SubscriberGate } from '@/components/auth/SubscriberGate';
import { AdminGate } from '@/components/auth/AdminGate';

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
  // Persist admin status in sessionStorage to prevent logout on re-renders
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('is_admin') === 'true';
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Permanent admin email - bypasses session expiration
  const PERMANENT_ADMIN_EMAIL = 'boubetgeorges@gmail.com';

  useEffect(() => {
    const invokeCheckAdmin = (accessToken?: string) => {
      return supabase.functions.invoke(
        'check-admin',
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
      );
    };

    // Check admin by email (no session required)
    const checkAdminByEmail = async (email: string) => {
      return supabase.functions.invoke('check-admin', {
        body: { email }
      });
    };

    const initAuth = async () => {
      // Check subscriber auth (client cache)
      // NOTE: localStorage can be tampered with, so we only use it as a hint.
      const savedEmail = localStorage.getItem('subscriber_email');
      const savedData = localStorage.getItem('subscriber_data');

      if (savedEmail && savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const hasCode = typeof parsed?.access_code === 'string' && parsed.access_code.trim().length > 0;
          const isActive = parsed?.status === 'active' || parsed?.plan_type === 'lifetime';

          if (hasCode && isActive) {
            setSubscriberEmail(savedEmail);
            setSubscriberData(parsed);
            setIsAuthenticated(true);
          } else {
            // Invalid cached data → reset
            localStorage.removeItem('subscriber_email');
            localStorage.removeItem('subscriber_data');
          }
        } catch {
          localStorage.removeItem('subscriber_email');
          localStorage.removeItem('subscriber_data');
        }
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
            sessionStorage.setItem('is_admin', 'true');
            // Store admin email for permanent access
            localStorage.setItem('permanent_admin_email', session.user?.email || '');
          } else {
            console.log('Utilisateur non-admin dans App.tsx');
            sessionStorage.removeItem('is_admin');
          }
        } else {
          console.log('Aucune session Supabase - vérification admin permanent par email...');
          
          // FALLBACK: Check permanent admin by email (no session required)
          const storedAdminEmail = localStorage.getItem('permanent_admin_email');
          if (storedAdminEmail === PERMANENT_ADMIN_EMAIL) {
            const { data, error } = await checkAdminByEmail(storedAdminEmail);
            
            if (!error && data?.isAdmin) {
              console.log('Admin permanent confirmé par email:', storedAdminEmail);
              setIsAdmin(true);
              sessionStorage.setItem('is_admin', 'true');
            } else {
              console.log('Email admin non confirmé');
              sessionStorage.removeItem('is_admin');
              localStorage.removeItem('permanent_admin_email');
              setIsAdmin(false);
            }
          } else {
            sessionStorage.removeItem('is_admin');
            setIsAdmin(false);
          }
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
            // Don't reset admin on error - keep current state
            return;
          }

          const adminStatus = !!data?.isAdmin;
          setIsAdmin(adminStatus);
          if (adminStatus) {
            sessionStorage.setItem('is_admin', 'true');
          } else {
            sessionStorage.removeItem('is_admin');
          }
        }, 0);
        return;
      }

      if (!session || event === 'SIGNED_OUT') {
        console.log('Déconnexion détectée');
        setIsAdmin(false);
        sessionStorage.removeItem('is_admin');
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
    // IMPORTANT: always clear client cache, otherwise users can appear logged-in without a valid backend check
    localStorage.removeItem('subscriber_email');
    localStorage.removeItem('subscriber_data');

    setIsAuthenticated(false);
    setSubscriberEmail('');
    setSubscriberData(null);
  };

  const showAccessDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  if (isCheckingAuth) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {showAccessDebug && (
            <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
              <div className="mx-auto max-w-6xl px-4 py-2 text-xs text-muted-foreground flex flex-wrap gap-3">
                <span><strong>host</strong>: {window.location.host}</span>
                <span><strong>path</strong>: {window.location.pathname}</span>
                <span><strong>isAdmin</strong>: {String(isAdmin)}</span>
                <span><strong>isAuthenticated</strong>: {String(isAuthenticated)}</span>
                <span><strong>subscriberEmail</strong>: {subscriberEmail ? 'yes' : 'no'}</span>
                <span><strong>subscriberData.access_code</strong>: {subscriberData?.access_code ? 'yes' : 'no'}</span>
              </div>
            </div>
          )}
          <Routes>
            {/* Google Search Console verification (fallback if static file routing is rewritten) */}
            <Route
              path="/googleba4e4a3539729cd0.html"
              element={
                <main className="min-h-screen bg-background text-foreground">
                  <pre className="p-6 text-sm">google-site-verification: googleba4e4a3539729cd0.html</pre>
                </main>
              }
            />

            <Route path="/" element={<Navigate to="/offres" replace />} />
            <Route path="/offres" element={<SalesPage />} />
            <Route path="/logout-total" element={<LogoutTotalPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/ecrire-livre-chatgpt" element={<SeoTutorialChatGptPage />} />
            <Route path="/creer-ebook-ia" element={<SeoCreerEbookIaPage />} />
            <Route path="/generateur-ebook" element={<SeoGenerateurEbookPage />} />
            <Route path="/valeur-offre" element={<OfferValuePage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/paiement-succes" element={<PaymentSuccessPage />} />
            <Route path="/paiement-manuel" element={<PaiementManuelPage />} />
            <Route path="/confirmation-paiement" element={<ConfirmationPaiementPage />} />
            <Route path="/faq" element={<FaqAssistancePage />} />
            <Route path="/assistance" element={<FaqAssistancePage />} />
            <Route path="/affiliation" element={<AffiliationFormationPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin-direct" element={<AdminDirectPage />} />
            <Route path="/ai-chat" element={<AiChatPage />} />
            <Route path="/niches" element={<NichesPage />} />
            <Route
              path="/ebook-ideas"
              element={<EbookIdeasPage />}
            />
            <Route
              path="/ebook-planner"
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <EbookPlannerPage
                    subscriberEmail={subscriberEmail || ''}
                    subscriberData={subscriberData}
                    isDemo={false}
                    isAdmin={isAdmin}
                  />
                </SubscriberGate>
              }
            />
            <Route
              path="/subscription"
              element={
                isAdmin ? (
                  <SubscriptionPage
                    subscriberEmail={subscriberEmail || PERMANENT_ADMIN_EMAIL}
                    subscriberData={subscriberData || { 
                      plan_type: 'lifetime', 
                      status: 'active', 
                      access_code: 'ADMIN-ACCESS',
                      ebook_plans_generated: 0,
                      chapters_generated: 0,
                      subchapters_generated: 0,
                      covers_generated: 0
                    }}
                    onLogout={handleLogout}
                  />
                ) : isAuthenticated ? (
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
              element={
                <AdminGate>
                  <AdminPage />
                </AdminGate>
              }
            />
            <Route 
              path="/admin/profile" 
              element={
                <AdminGate>
                  <AdminProfilePage />
                </AdminGate>
              }
            />
            <Route 
              path="/formation" 
              element={<FormationPage />}
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