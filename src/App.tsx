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
import ParrainagePage from './pages/ParrainagePage';
import FormationPage from './pages/FormationPage';
import FormationSeriesPage from './pages/FormationSeriesPage';
import FormationAudioPage from './pages/FormationAudioPage';
import FormationSeriesAudioPage from './pages/FormationSeriesAudioPage';
import FormationVideosPage from './pages/FormationVideosPage';
import SalesPage from './pages/SalesPage';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import CGV from './pages/CGV';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import DemoPage from './pages/DemoPage';
import OfferValuePage from './pages/OfferValuePage';
import SeoTutorialChatGptPage from './pages/SeoTutorialChatGptPage';
import SeoCreerEbookIaPage from './pages/SeoCreerEbookIaPage';
import SeoGenerateurEbookPage from './pages/SeoGenerateurEbookPage';
import BlogPage from './pages/BlogPage';
import BlogArticleTemplate from './components/blog/BlogArticleTemplate';
import LogoutTotalPage from './pages/LogoutTotalPage';
import PaiementManuelPage from './pages/PaiementManuelPage';
import ConfirmationPaiementPage from './pages/ConfirmationPaiementPage';
import FaqAssistancePage from './pages/FaqAssistancePage';
import NichesPage from './pages/NichesPage';
import ArcSignupPage from './pages/ArcSignupPage';
import MarketingPlanPage from './pages/MarketingPlanPage';
import UpsellPage from './pages/UpsellPage';
import UpsellPaiementPage from './pages/UpsellPaiementPage';
import SeoGeneratorPage from './pages/SeoGeneratorPage';
import PracticalSheetsGeneratorPage from './pages/PracticalSheetsGeneratorPage';
import ResultatEn5MinPage from './pages/ResultatEn5MinPage';
import CadeauPage from './pages/CadeauPage';
import ChecklistTournagePage from './pages/ChecklistTournagePage';
import BDStudioPage from './pages/BDStudioPage';
import SeriesTomesPage from './pages/SeriesTomesPage';
import ForumPage from './pages/ForumPage';
import KdpKeywordResearchPage from './pages/KdpKeywordResearchPage';
import PublicAudiobookPage from './pages/PublicAudiobookPage';
import AudiobookEmbedPage from './pages/AudiobookEmbedPage';
import FormationEmbedPage from './pages/FormationEmbedPage';
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
    const checkAdminDirect = async (userId: string): Promise<boolean> => {
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        return !!data;
      } catch {
        return false;
      }
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

        if (session?.user) {
          console.log('Session admin trouvée dans App.tsx');
          const adminStatus = await checkAdminDirect(session.user.id);

          if (adminStatus) {
            console.log('Statut admin confirmé dans App.tsx');
            setIsAdmin(true);
            sessionStorage.setItem('is_admin', 'true');
            localStorage.setItem('permanent_admin_email', session.user?.email || '');
          } else {
            console.log('Utilisateur non-admin dans App.tsx');
            sessionStorage.removeItem('is_admin');
          }
        } else {
          console.log('Aucune session Supabase');
          sessionStorage.removeItem('is_admin');
          localStorage.removeItem('permanent_admin_email');
          setIsAdmin(false);
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

      if (shouldRecheckAdmin && session?.user) {
        setTimeout(async () => {
          const adminStatus = await checkAdminDirect(session.user.id);
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
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/logout-total" element={<LogoutTotalPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticleTemplate />} />
            <Route path="/ecrire-livre-chatgpt" element={<SeoTutorialChatGptPage />} />
            <Route path="/creer-ebook-ia" element={<SeoCreerEbookIaPage />} />
            <Route path="/generateur-ebook" element={<SeoGenerateurEbookPage />} />
            <Route path="/valeur-offre" element={<OfferValuePage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/upsell" element={<UpsellPage />} />
            <Route path="/upsell-paiement" element={<UpsellPaiementPage />} />
            <Route path="/paiement-succes" element={<PaymentSuccessPage />} />
            <Route path="/paiement-manuel" element={<PaiementManuelPage />} />
            <Route path="/confirmation-paiement" element={<ConfirmationPaiementPage />} />
            <Route path="/faq" element={<FaqAssistancePage />} />
            <Route path="/checklist-tournage" element={<ChecklistTournagePage />} />
            <Route path="/assistance" element={<FaqAssistancePage />} />
            <Route path="/affiliation" element={<AffiliationFormationPage />} />
            <Route path="/bd-studio" element={<BDStudioPage />} />
            <Route path="/parrainage" element={<ParrainagePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin-direct" element={<AdminDirectPage />} />
            <Route path="/ai-chat" element={<AiChatPage />} />
            <Route path="/niches" element={<NichesPage />} />
            <Route path="/arc-signup" element={<ArcSignupPage />} />
            <Route path="/communaute" element={<ForumPage />} />
            <Route path="/plan-marketing" element={<MarketingPlanPage />} />
            <Route path="/resultat-en-5-min" element={<ResultatEn5MinPage />} />
            <Route path="/cadeau" element={<CadeauPage />} />
            <Route 
              path="/seo-generator" 
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <SeoGeneratorPage />
                </SubscriberGate>
              }
            />
            <Route 
              path="/fiches-pratiques" 
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <PracticalSheetsGeneratorPage />
                </SubscriberGate>
              }
            />
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
              path="/kdp-keywords"
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <KdpKeywordResearchPage />
                </SubscriberGate>
              }
            />
            <Route
              path="/series-tomes"
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <SeriesTomesPage />
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
            <Route 
              path="/formation-videos" 
              element={
                isAdmin || isAuthenticated ? (
                  <FormationVideosPage />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />
            
            {/* Public audiobook routes */}
            <Route path="/audiobook/:slug" element={<PublicAudiobookPage />} />
            <Route path="/audiobook-embed/:slug" element={<AudiobookEmbedPage />} />
            <Route path="/formation-embed" element={<FormationEmbedPage />} />
            
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