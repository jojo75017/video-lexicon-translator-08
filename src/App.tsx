import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SubscriberGate } from '@/components/auth/SubscriberGate';
import { AdminGate } from '@/components/auth/AdminGate';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';
import { Loader2 } from 'lucide-react';
import SubscriberActivityPopup from '@/components/admin/SubscriberActivityPopup';

// Lazy-loaded pages for performance
const EbookPlannerPage = lazy(() => import('./pages/EbookPlannerPage'));
const EbookIdeasPage = lazy(() => import('./pages/EbookIdeasPage'));
const AiChatPage = lazy(() => import('./pages/AiChatPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AdminProfilePage = lazy(() => import('./pages/AdminProfilePage'));
const AdminDirectPage = lazy(() => import('./pages/AdminDirectPage'));
const AffiliationFormationPage = lazy(() => import('./pages/AffiliationFormationPage'));
const ParrainagePage = lazy(() => import('./pages/ParrainagePage'));
const FormationPage = lazy(() => import('./pages/FormationPage'));
const FormationSeriesPage = lazy(() => import('./pages/FormationSeriesPage'));
const FormationAudioPage = lazy(() => import('./pages/FormationAudioPage'));
const FormationSeriesAudioPage = lazy(() => import('./pages/FormationSeriesAudioPage'));
const FormationVideosPage = lazy(() => import('./pages/FormationVideosPage'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const CGV = lazy(() => import('./pages/CGV'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const OfferValuePage = lazy(() => import('./pages/OfferValuePage'));
const SeoTutorialChatGptPage = lazy(() => import('./pages/SeoTutorialChatGptPage'));
const SeoCreerEbookIaPage = lazy(() => import('./pages/SeoCreerEbookIaPage'));
const SeoGenerateurEbookPage = lazy(() => import('./pages/SeoGenerateurEbookPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogArticleTemplate = lazy(() => import('./components/blog/BlogArticleTemplate'));
const LogoutTotalPage = lazy(() => import('./pages/LogoutTotalPage'));
const PaiementManuelPage = lazy(() => import('./pages/PaiementManuelPage'));
const ConfirmationPaiementPage = lazy(() => import('./pages/ConfirmationPaiementPage'));
const FaqAssistancePage = lazy(() => import('./pages/FaqAssistancePage'));
const NichesPage = lazy(() => import('./pages/NichesPage'));
const ArcSignupPage = lazy(() => import('./pages/ArcSignupPage'));
const MarketingPlanPage = lazy(() => import('./pages/MarketingPlanPage'));
const UpsellPage = lazy(() => import('./pages/UpsellPage'));
const UpsellPaiementPage = lazy(() => import('./pages/UpsellPaiementPage'));
const SeoGeneratorPage = lazy(() => import('./pages/SeoGeneratorPage'));
const PracticalSheetsGeneratorPage = lazy(() => import('./pages/PracticalSheetsGeneratorPage'));
const ResultatEn5MinPage = lazy(() => import('./pages/ResultatEn5MinPage'));
const CadeauPage = lazy(() => import('./pages/CadeauPage'));
const ChecklistTournagePage = lazy(() => import('./pages/ChecklistTournagePage'));
const BDStudioPage = lazy(() => import('./pages/BDStudioPage'));
const SeriesTomesPage = lazy(() => import('./pages/SeriesTomesPage'));
const ForumPage = lazy(() => import('./pages/ForumPage'));
const KdpKeywordResearchPage = lazy(() => import('./pages/KdpKeywordResearchPage'));
const PublicAudiobookPage = lazy(() => import('./pages/PublicAudiobookPage'));
const AudiobookEmbedPage = lazy(() => import('./pages/AudiobookEmbedPage'));
const AudiobookDemoPage = lazy(() => import('./pages/AudiobookDemoPage'));
const AudiobookThankYouPage = lazy(() => import('./pages/AudiobookThankYouPage'));
const FormationEmbedPage = lazy(() => import('./pages/FormationEmbedPage'));
const Nouveautes2026Page = lazy(() => import('./pages/Nouveautes2026Page'));
const InstallPage = lazy(() => import('./pages/InstallPage'));
const ElementorExportPage = lazy(() => import('./pages/ElementorExportPage'));
const SubscriptionAuth = lazy(() => import('@/components/SubscriptionAuth').then(m => ({ default: m.SubscriptionAuth })));

// SaaS/marketing pages (admin-only tools)
const SalesCampaignPage = lazy(() => import('@/pages/SalesCampaignPage'));
const EmailPreviewPage = lazy(() => import('@/pages/EmailPreviewPage'));
const ProspectManagerPage = lazy(() => import('@/pages/ProspectManagerPage'));
const SocialPostGeneratorPage = lazy(() => import('@/pages/SocialPostGeneratorPage'));
const UnifiedMarketingDashboard = lazy(() => import('@/pages/UnifiedMarketingDashboard'));
const CrmPage = lazy(() => import('@/pages/CrmPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const KdpAdsGuidePage = lazy(() => import('./pages/KdpAdsGuidePage'));
const ToolsGuidePage = lazy(() => import('./pages/ToolsGuidePage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberData, setSubscriberData] = useState<any>(null);
  // Admin status is ONLY set after server-side verification — never from client storage
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Admin email is checked server-side only (via check-admin edge function)

  useEffect(() => {
    // Safety timeout FIRST: never leave the app stuck on loader
    const safetyTimer = setTimeout(() => {
      console.warn('Safety timer triggered – forcing auth check complete');
      setIsCheckingAuth(false);
    }, 12000);

    const initAuth = async () => {
      // Check subscriber auth (client cache) — fast, localStorage only
      const savedEmail = localStorage.getItem('subscriber_email');
      const savedData = localStorage.getItem('subscriber_data');

      if (savedEmail && savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const hasCode = typeof parsed?.access_code === 'string' && parsed.access_code.trim().length > 0;
          const isActive = parsed?.status === 'active' || parsed?.status === 'trialing' || parsed?.plan_type === 'lifetime';

          if (hasCode && isActive) {
            setSubscriberEmail(savedEmail);
            setSubscriberData(parsed);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('subscriber_email');
            localStorage.removeItem('subscriber_data');
          }
        } catch {
          localStorage.removeItem('subscriber_email');
          localStorage.removeItem('subscriber_data');
        }
      }

      // Unblock rendering NOW — subscribers can proceed while admin check runs in background
      setIsCheckingAuth(false);

      // Check admin session in background (non-blocking)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('Session admin trouvée dans App.tsx');
          const adminStatus = await getIsCurrentSessionAdmin();

          if (adminStatus) {
            console.log('Statut admin confirmé dans App.tsx');
            setIsAdmin(true);
          } else {
            console.log('Utilisateur non-admin dans App.tsx');
            setIsAdmin(false);
          }
        } else {
          console.log('Aucune session Supabase');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session admin:', error);
      }
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
          const adminStatus = await getIsCurrentSessionAdmin();
          setIsAdmin(adminStatus);
        }, 0);
        return;
      }

      if (!session || event === 'SIGNED_OUT') {
        console.log('Déconnexion détectée');
        setIsAdmin(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthenticated = useCallback((email: string, data: any) => {
    setSubscriberEmail(email);
    setSubscriberData(data);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    // IMPORTANT: always clear client cache, otherwise users can appear logged-in without a valid backend check
    localStorage.removeItem('subscriber_email');
    localStorage.removeItem('subscriber_data');

    setIsAuthenticated(false);
    setSubscriberEmail('');
    setSubscriberData(null);
  }, []);

  const showAccessDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  if (isCheckingAuth) {
    return <PageLoader />;
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
          <Suspense fallback={<PageLoader />}>
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
            <Route path="/campagne-vente" element={<SalesCampaignPage />} />
            <Route path="/apercu-emails" element={<AdminGate><EmailPreviewPage /></AdminGate>} />
            <Route path="/generateur-posts" element={<AdminGate><SocialPostGeneratorPage /></AdminGate>} />
            <Route path="/gestion-prospects" element={<AdminGate><ProspectManagerPage /></AdminGate>} />
            <Route path="/dashboard-marketing" element={<AdminGate><UnifiedMarketingDashboard /></AdminGate>} />
            <Route path="/crm" element={<AdminGate><CrmPage /></AdminGate>} />
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
              path="/guide-outils"
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <ToolsGuidePage />
                </SubscriberGate>
              }
            />
            <Route
              path="/kdp-ads-guide"
              element={
                <SubscriberGate
                  isAdmin={isAdmin}
                  subscriberEmail={subscriberEmail}
                  subscriberData={subscriberData}
                  onInvalid={handleLogout}
                >
                  <KdpAdsGuidePage />
                </SubscriberGate>
              }
            />
            <Route
              path="/subscription"
              element={
              isAdmin ? (
                  <SubscriptionPage
                    subscriberEmail={subscriberEmail || ''}
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
              path="/dashboard" 
              element={
                <AdminGate>
                  <Dashboard />
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
            <Route path="/audiobook-demo" element={<AudiobookDemoPage />} />
            <Route path="/audiobook/:slug" element={<PublicAudiobookPage />} />
            <Route path="/audiobook-embed/:slug" element={<AudiobookEmbedPage />} />
            <Route path="/audiobook-merci/:slug" element={<AudiobookThankYouPage />} />
            <Route path="/formation-embed" element={<FormationEmbedPage />} />
            <Route path="/elementor-export" element={<ElementorExportPage />} />
            <Route path="/nouveautes-2026" element={<Nouveautes2026Page />} />
            <Route path="/install" element={<InstallPage />} />
            
            {/* SaaS routes removed — orphan system */}
            
            {/* Catch-all : redirige vers /offres */}
            <Route path="*" element={<Navigate to="/offres" replace />} />
          </Routes>
          </Suspense>
          {/* Admin: popup flottant abonnés visible sur toutes les pages */}
          <SubscriberActivityPopup />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;