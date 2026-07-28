import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SubscriberGate } from '@/components/auth/SubscriberGate';
import { AdminGate } from '@/components/auth/AdminGate';
import { V3Gate } from '@/components/auth/V3Gate';
import { BookPerfectGate } from '@/components/auth/BookPerfectGate';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';
import { Loader2 } from 'lucide-react';
import SubscriberActivityPopup from '@/components/admin/SubscriberActivityPopup';
import { FirstEbookOnboarding } from '@/components/onboarding/FirstEbookOnboarding';
import EbookbotFloatingButton from '@/components/ebookbot/EbookbotFloatingButton';
import ApiKeysFloatingButton from '@/components/ebook/ApiKeysFloatingButton';
import GeminiKeyAlertBanner from '@/components/ebook/GeminiKeyAlertBanner';
import AISosModal from '@/components/shared/AISosModal';
import AICostBadge from '@/components/shared/AICostBadge';
import { useBrandTitle } from '@/hooks/useBrandTitle';
import V2V3FloatingSwitch from '@/components/admin/V2V3FloatingSwitch';
import LeadCapturePopup from '@/components/marketing/LeadCapturePopup';
import FloatingToolCTA from '@/components/marketing/FloatingToolCTA';
import StickySignupBar from '@/components/marketing/StickySignupBar';
import { captureUtmParams } from '@/lib/utmTracking';

// V2 — Ebook Planner + outils satellites
const EbookPlannerPage = lazy(() => import('./pages/EbookPlannerPage'));
const EbookIdeasPage = lazy(() => import('./pages/EbookIdeasPage'));
const EbookbotPage = lazy(() => import('./pages/EbookbotPage'));
const AmbiancesPage = lazy(() => import('./pages/AmbiancesPage'));
const CouvertureKdpPage = lazy(() => import('./pages/CouvertureKdpPage'));
const CoverStudioProHubPage = lazy(() => import('./pages/v3/cover-studio-pro/CoverStudioProHubPage'));
const CoverEditorPage = lazy(() => import('./pages/v3/cover-studio-pro/CoverEditorPage'));
const Niches600Page = lazy(() => import('./pages/Niches600Page'));
const NichesPage = lazy(() => import('./pages/NichesPage'));
const BookPerfectPage = lazy(() => import('./pages/BookPerfectPage'));
const AuditPilotPage = lazy(() => import('./pages/AuditPilotPage'));
const WordCountPage = lazy(() => import('./pages/WordCountPage'));
const SeriesTomesPage = lazy(() => import('./pages/SeriesTomesPage'));
const PracticalSheetsGeneratorPage = lazy(() => import('./pages/PracticalSheetsGeneratorPage'));
const BDStudioPage = lazy(() => import('./pages/BDStudioPage'));
const KdpKeywordResearchPage = lazy(() => import('./pages/KdpKeywordResearchPage'));
const MasterclassPage = lazy(() => import('./pages/MasterclassPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const SignaturePage = lazy(() => import('./pages/SignaturePage'));

// Marketing actif
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const DemoPage = lazy(() => import('./pages/DemoPage'));
const FaqAssistancePage = lazy(() => import('./pages/FaqAssistancePage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const ConfirmationPaiementPage = lazy(() => import('./pages/ConfirmationPaiementPage'));
const PaiementManuelPage = lazy(() => import('./pages/PaiementManuelPage'));
const UpsellPage = lazy(() => import('./pages/UpsellPage'));
const UpsellPaiementPage = lazy(() => import('./pages/UpsellPaiementPage'));
const V3CommandePage = lazy(() => import('./pages/V3CommandePage'));
const V3PaiementPage = lazy(() => import('./pages/V3PaiementPage'));
const SalesPageV3Launch = lazy(() => import('./pages/SalesPageV3Launch'));

// V3 hub + public site
const V3HubPage = lazy(() => import('./pages/V3HubPage'));
const V3PublicLayout = lazy(() => import('./components/v3public/V3PublicLayout'));
const V3HomePage = lazy(() => import('./pages/v3public/V3HomePage'));
const V3AuthPage = lazy(() => import('./pages/v3public/V3AuthPage'));
const V3CreatePage = lazy(() => import('./pages/v3public/V3CreatePage'));
const V3KidsBookCreatePage = lazy(() => import('./pages/v3public/V3KidsBookCreatePage'));
const V3BookPage = lazy(() => import('./pages/v3public/V3BookPage'));
const V3LibraryPage = lazy(() => import('./pages/v3public/V3LibraryPage'));
const V3GalleryPage = lazy(() => import('./pages/v3public/V3GalleryPage'));
const V3GuestAuthorPage = lazy(() => import('./pages/v3public/V3GuestAuthorPage'));
const V3AuthorProfilePage = lazy(() => import('./pages/v3public/V3AuthorProfilePage'));
const V3BookManagerPage = lazy(() => import('./pages/v3public/V3BookManagerPage'));
const V3SpecialBookPage = lazy(() => import('./pages/v3public/V3SpecialBookPage'));
const V3AuthorSettingsPage = lazy(() => import('./pages/v3public/V3AuthorSettingsPage'));
// Archived V3 pages (no inbound links) — routes redirect to /v3/forfaits.
// Files kept in src/pages/v3public/ for reference; remove after Oct 2026 launch if unused.
const V3TocUltimatePage = lazy(() => import('./pages/v3public/V3TocUltimatePage'));
const V3TranslatorPage = lazy(() => import('./pages/v3public/V3TranslatorPage'));
const V3ToolsIndexPage = lazy(() => import('./pages/v3public/V3ToolsIndexPage'));
const V3ComptePage = lazy(() => import('./pages/v3public/V3ComptePage'));
const V3PourquoiPage = lazy(() => import('./pages/v3public/V3PourquoiPage'));
const V3ScriptHeygenPage = lazy(() => import('./pages/v3public/V3ScriptHeygenPage'));
const V3ForfaitsPage = lazy(() => import('./pages/v3public/V3ForfaitsPage'));
const V3RecherchePage = lazy(() => import('./pages/v3public/V3RecherchePage'));

// Blog / Formation SEO
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogArticleTemplate = lazy(() => import('./components/blog/BlogArticleTemplate'));
const FormationPage = lazy(() => import('./pages/FormationPage'));
const FormationVideosPage = lazy(() => import('./pages/FormationVideosPage'));
const FormationAudioPage = lazy(() => import('./pages/FormationAudioPage'));
const FormationSeriesPage = lazy(() => import('./pages/FormationSeriesPage'));
const FormationSeriesAudioPage = lazy(() => import('./pages/FormationSeriesAudioPage'));
const FormationEmbedPage = lazy(() => import('./pages/FormationEmbedPage'));
const SeoCreerEbookIaPage = lazy(() => import('./pages/SeoCreerEbookIaPage'));
const SeoGenerateurEbookPage = lazy(() => import('./pages/SeoGenerateurEbookPage'));
const SeoTutorialChatGptPage = lazy(() => import('./pages/SeoTutorialChatGptPage'));
const SeoGuideKdpEnfantsPage = lazy(() => import('./pages/SeoGuideKdpEnfantsPage'));
const SeoFrancophonesEtrangerPage = lazy(() => import('./pages/SeoFrancophonesEtrangerPage'));

// Légal / système
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const CGV = lazy(() => import('./pages/CGV'));
const Licence = lazy(() => import('./pages/Licence'));
const LicenceEtenduePage = lazy(() => import('./pages/LicenceEtenduePage'));
const Securite = lazy(() => import('./pages/Securite'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const LogoutTotalPage = lazy(() => import('./pages/LogoutTotalPage'));
const InstallPage = lazy(() => import('./pages/InstallPage'));
const RecuperationCodePage = lazy(() => import('./pages/RecuperationCodePage'));
const ActivationBetaPage = lazy(() => import('./pages/ActivationBetaPage'));
const CadeauPage = lazy(() => import('./pages/CadeauPage'));
const GiftRedeemPage = lazy(() => import('./pages/GiftRedeemPage'));
const GiftThankYouPage = lazy(() => import('./pages/GiftThankYouPage'));
const ContactSupportPage = lazy(() => import('./pages/ContactSupportPage'));

// Admin simplifié
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const AdminProfilePage = lazy(() => import('./pages/AdminProfilePage'));
const AdminDirectPage = lazy(() => import('./pages/AdminDirectPage'));
const AdminFunnelPage = lazy(() => import('./pages/admin/AdminFunnelPage'));
const AdminPdfGiftsPage = lazy(() => import('./pages/admin/AdminPdfGiftsPage'));
const AdminBetaCodesPage = lazy(() => import('./pages/admin/AdminBetaCodesPage'));
const AdminBetaTestersPage = lazy(() => import('./pages/admin/AdminBetaTestersPage'));
const AdminPaymentsDashboardPage = lazy(() => import('./pages/admin/AdminPaymentsDashboardPage'));
const AdminCleanupPage = lazy(() => import('./pages/admin/AdminCleanupPage'));
const AdminPlansV3Page = lazy(() => import('./pages/admin/AdminPlansV3Page'));
const AdminTestPayPalPage = lazy(() => import('./pages/admin/AdminTestPayPalPage'));
const CrmPage = lazy(() => import('./pages/CrmPage'));
const ProspectManagerPage = lazy(() => import('./pages/ProspectManagerPage'));
const EmailPreviewPage = lazy(() => import('./pages/EmailPreviewPage'));
const InfluenceursPage = lazy(() => import('./pages/InfluenceursPage'));
const InfluenceursConfirmationPage = lazy(() => import('./pages/InfluenceursConfirmationPage'));

// Promo funnel
const PromoCapturePage = lazy(() => import('./pages/promo/PromoCapturePage'));
const PromoMerciPage = lazy(() => import('./pages/promo/PromoMerciPage'));
const PromoDecouvertePage = lazy(() => import('./pages/promo/PromoDecouvertePage'));
const PromoCommandePage = lazy(() => import('./pages/promo/PromoCommandePage'));
const PromoPaiementPage = lazy(() => import('./pages/promo/PromoPaiementPage'));
const PromoBonusPage = lazy(() => import('./pages/promo/PromoBonusPage'));
const PromoEspacePage = lazy(() => import('./pages/promo/PromoEspacePage'));
const PromoAffiliePage = lazy(() => import('./pages/promo/PromoAffiliePage'));

const SubscriptionAuth = lazy(() => import('@/components/SubscriptionAuth').then(m => ({ default: m.SubscriptionAuth })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
const queryClient = new QueryClient();

const App = () => {
  useBrandTitle();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      console.warn('Safety timer triggered – forcing auth check complete');
      setIsCheckingAuth(false);
    }, 6000);

    const initAuth = async () => {
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

      setIsCheckingAuth(false);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const adminStatus = await getIsCurrentSessionAdmin();
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur session admin:', error);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const shouldRecheckAdmin =
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && !!session;
      if (shouldRecheckAdmin && session?.user) {
        setTimeout(async () => {
          const adminStatus = await getIsCurrentSessionAdmin();
          setIsAdmin(adminStatus);
        }, 0);
        return;
      }
      if (!session || event === 'SIGNED_OUT') setIsAdmin(false);
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

  useEffect(() => {
    captureUtmParams();
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('subscriber_email');
    localStorage.removeItem('subscriber_data');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-') && key.includes('auth-token')) {
        localStorage.removeItem(key);
      }
    });
    setIsAuthenticated(false);
    setSubscriberEmail('');
    setSubscriberData(null);
    void supabase.auth.signOut().catch(() => {});
    window.location.assign('/logout-total');
  }, []);

  const isPlannerPreviewHost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname.includes('id-preview--'));
  const hasPlannerAccess = isPlannerPreviewHost || isAuthenticated || isAdmin;
  const previewSubscriberEmail = 'preview@ebookstudio.fr';
  const previewSubscriberData = {
    email: previewSubscriberEmail,
    plan_type: 'pro',
    status: 'active',
    access_code: 'PREVIEW-ACCESS',
    ebook_plans_generated: 0,
    chapters_generated: 0,
    subchapters_generated: 0,
    covers_generated: 0,
  };

  if (isCheckingAuth) return <PageLoader />;

  // Helper wrapper for subscriber-gated routes
  const gated = (node: React.ReactNode) => (
    <SubscriberGate
      isAdmin={isAdmin}
      subscriberEmail={subscriberEmail}
      subscriberData={subscriberData}
      onInvalid={handleLogout}
    >
      {node}
    </SubscriberGate>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/googleba4e4a3539729cd0.html"
              element={
                <main className="min-h-screen bg-background text-foreground">
                  <pre className="p-6 text-sm">google-site-verification: googleba4e4a3539729cd0.html</pre>
                </main>
              }
            />

            <Route path="/" element={<Navigate to={hasPlannerAccess ? '/ebook-planner' : '/offres'} replace />} />

            {/* Marketing */}
            <Route path="/offres" element={
              hasPlannerAccess
                ? <Navigate to="/ebook-planner" replace />
                : (isAuthenticated
                    ? <SubscriptionPage subscriberEmail={subscriberEmail} subscriberData={subscriberData} onLogout={handleLogout} />
                    : <SubscriptionAuth onAuthenticated={handleAuthenticated} />)
            } />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/faq" element={<FaqAssistancePage />} />
            <Route path="/assistance" element={<FaqAssistancePage />} />
            <Route path="/paiement-succes" element={<PaymentSuccessPage />} />
            <Route path="/paiement-manuel" element={<PaiementManuelPage />} />
            <Route path="/confirmation-paiement" element={<ConfirmationPaiementPage />} />
            <Route path="/upsell" element={<UpsellPage />} />
            <Route path="/upsell-paiement" element={<UpsellPaiementPage />} />
            <Route path="/commande-v3" element={<V3CommandePage />} />
            <Route path="/v3-paiement" element={<V3PaiementPage />} />
            <Route path="/vente-v3" element={<SalesPageV3Launch />} />

            {/* Promo été */}
            <Route path="/promo" element={<PromoCapturePage />} />
            <Route path="/promo/merci" element={<PromoMerciPage />} />
            <Route path="/promo/decouverte" element={<PromoDecouvertePage />} />
            <Route path="/promo/commande" element={<PromoCommandePage />} />
            <Route path="/promo/paiement" element={<PromoPaiementPage />} />
            <Route path="/promo/bonus" element={<PromoBonusPage />} />
            <Route path="/promo/espace" element={<PromoEspacePage />} />
            <Route path="/promo/affilie" element={<PromoAffiliePage />} />

            {/* Redirections SEO (pages supprimées) */}
            <Route path="/sales" element={<Navigate to="/offres" replace />} />
            <Route path="/publication-pro" element={<Navigate to="/offres" replace />} />
            <Route path="/v3-offre" element={<Navigate to="/offres" replace />} />
            <Route path="/valeur-offre" element={<Navigate to="/offres" replace />} />
            <Route path="/coaching-vip" element={<Navigate to="/offres" replace />} />
            <Route path="/parrainage" element={<Navigate to="/offres" replace />} />
            <Route path="/affiliation" element={<Navigate to="/offres" replace />} />
            <Route path="/webinaire" element={<Navigate to="/offres" replace />} />
            <Route path="/nouveautes-2026" element={<Navigate to="/offres" replace />} />
            <Route path="/arc-signup" element={<Navigate to="/offres" replace />} />
            <Route path="/essai-gratuit" element={<Navigate to="/offres" replace />} />
            <Route path="/resultat-en-5-min" element={<Navigate to="/offres" replace />} />
            <Route path="/bookperfect-offre" element={<Navigate to="/offres" replace />} />
            <Route path="/tutoriels" element={<Navigate to="/formation" replace />} />
            <Route path="/guide-outils" element={<Navigate to="/formation" replace />} />
            <Route path="/guide-ebook" element={<Navigate to="/formation" replace />} />
            <Route path="/kdp-ads-guide" element={<Navigate to="/formation" replace />} />
            <Route path="/checklist-tournage" element={<Navigate to="/formation" replace />} />
            <Route path="/communaute" element={<Navigate to="/offres" replace />} />
            <Route path="/ai-chat" element={<Navigate to="/ebookbot" replace />} />
            <Route path="/business-center" element={<Navigate to="/admin" replace />} />
            <Route path="/plan-marketing" element={<Navigate to="/admin" replace />} />
            <Route path="/campagne-vente" element={<Navigate to="/admin" replace />} />
            <Route path="/dashboard-marketing" element={<Navigate to="/admin" replace />} />
            <Route path="/generateur-posts" element={<Navigate to="/admin" replace />} />
            <Route path="/dashboard" element={<Navigate to="/ebook-planner" replace />} />
            <Route path="/espace" element={<Navigate to="/ebook-planner" replace />} />
            <Route path="/espace/lancement" element={<Navigate to="/ebook-planner" replace />} />
            <Route path="/tableau-de-bord" element={<Navigate to="/v3/hub" replace />} />
            <Route path="/admin-cockpit" element={<Navigate to="/admin" replace />} />
            <Route path="/extension-chrome" element={<Navigate to="/offres" replace />} />
            <Route path="/elementor-export" element={<Navigate to="/admin" replace />} />
            <Route path="/audiobook-demo" element={<Navigate to="/formation-audio" replace />} />
            <Route path="/audiobook/:slug" element={<Navigate to="/formation-audio" replace />} />
            <Route path="/audiobook-embed/:slug" element={<Navigate to="/formation-audio" replace />} />
            <Route path="/audiobook-merci/:slug" element={<Navigate to="/formation-audio" replace />} />
            <Route path="/hub-v3" element={<Navigate to="/v3/hub" replace />} />
            <Route path="/dashboard-essais" element={<Navigate to="/admin" replace />} />
            <Route path="/emails-onboarding" element={<Navigate to="/admin" replace />} />
            <Route path="/guide-automatisation-brevo" element={<Navigate to="/admin" replace />} />
            <Route path="/seo-generator" element={<Navigate to="/ebook-planner" replace />} />

            {/* Blog + Formation */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticleTemplate />} />
            <Route path="/ecrire-livre-chatgpt" element={<SeoTutorialChatGptPage />} />
            <Route path="/creer-ebook-ia" element={<SeoCreerEbookIaPage />} />
            <Route path="/generateur-ebook" element={<SeoGenerateurEbookPage />} />
            <Route path="/guide-kdp-enfants" element={<SeoGuideKdpEnfantsPage />} />
            <Route path="/creer-ebook-kdp-etranger" element={<SeoFrancophonesEtrangerPage />} />
            <Route path="/formation" element={<FormationPage />} />
            <Route path="/formation-audio" element={isAdmin || isAuthenticated ? <FormationAudioPage /> : <SubscriptionAuth onAuthenticated={handleAuthenticated} />} />
            <Route path="/formation-series" element={isAdmin || isAuthenticated ? <FormationSeriesPage /> : <SubscriptionAuth onAuthenticated={handleAuthenticated} />} />
            <Route path="/formation-series-audio" element={isAdmin || isAuthenticated ? <FormationSeriesAudioPage /> : <SubscriptionAuth onAuthenticated={handleAuthenticated} />} />
            <Route path="/formation-videos" element={isAdmin || isAuthenticated ? <FormationVideosPage /> : <SubscriptionAuth onAuthenticated={handleAuthenticated} />} />
            <Route path="/formation-embed" element={<FormationEmbedPage />} />

            {/* Légal / système */}
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/securite" element={<Securite />} />
            <Route path="/confiance" element={<Securite />} />
            <Route path="/trust" element={<Securite />} />
            <Route path="/licence" element={<Licence />} />
            <Route path="/eula" element={<Licence />} />
            <Route path="/licence-etendue" element={<LicenceEtenduePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/logout-total" element={<LogoutTotalPage />} />
            <Route path="/install" element={<InstallPage />} />
            <Route path="/mon-code" element={<RecuperationCodePage />} />
            <Route path="/activer-beta" element={<ActivationBetaPage />} />
            <Route path="/cadeau" element={<CadeauPage />} />
            <Route path="/carte-cadeau" element={<GiftRedeemPage />} />
            <Route path="/carte-cadeau-merci" element={<GiftThankYouPage />} />
            <Route path="/influenceurs" element={<InfluenceursPage />} />
            <Route path="/influenceurs/merci" element={<InfluenceursConfirmationPage />} />
            <Route path="/contact-support" element={<ContactSupportPage subscriberEmail={subscriberEmail || ''} />} />
            <Route path="/contact" element={<ContactSupportPage subscriberEmail={subscriberEmail || ''} />} />


            {/* V2 tools */}
            <Route path="/ebook-ideas" element={<EbookIdeasPage />} />
            <Route path="/ambiances" element={<AmbiancesPage />} />
            <Route path="/ebookbot" element={<EbookbotPage />} />
            <Route path="/masterclass" element={<MasterclassPage />} />
            <Route path="/niches" element={<NichesPage />} />
            <Route path="/niches-600" element={<Niches600Page />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/signature" element={<SignaturePage />} />
            <Route path="/bd-studio" element={<BDStudioPage />} />
            <Route path="/word-count" element={<WordCountPage />} />
            <Route
              path="/ebook-planner"
              element={
                isPlannerPreviewHost && !isAuthenticated && !isAdmin ? (
                  <EbookPlannerPage
                    subscriberEmail={previewSubscriberEmail}
                    subscriberData={previewSubscriberData}
                    isDemo={false}
                    isAdmin={false}
                    onLogout={handleLogout}
                  />
                ) : gated(
                  <EbookPlannerPage
                    subscriberEmail={subscriberEmail || ''}
                    subscriberData={subscriberData}
                    isDemo={false}
                    isAdmin={isAdmin}
                    onLogout={handleLogout}
                  />
                )
              }
            />
            <Route path="/kdp-keywords" element={gated(<KdpKeywordResearchPage />)} />
            <Route path="/audit-pilot" element={gated(<AuditPilotPage />)} />
            <Route path="/bookperfect" element={<BookPerfectGate><BookPerfectPage /></BookPerfectGate>} />
            <Route path="/couverture-kdp" element={gated(<CouvertureKdpPage />)} />
            <Route path="/v3/cover-studio-pro" element={gated(<CoverStudioProHubPage />)} />
            <Route path="/v3/cover-studio-pro/edit" element={gated(<CoverEditorPage />)} />
            <Route path="/series-tomes" element={gated(<SeriesTomesPage />)} />
            <Route path="/fiches-pratiques" element={gated(<PracticalSheetsGeneratorPage />)} />

            {/* Abonnement */}
            <Route
              path="/subscription"
              element={
                isAdmin ? (
                  <SubscriptionPage
                    subscriberEmail={subscriberEmail || ''}
                    subscriberData={subscriberData || {
                      plan_type: 'lifetime', status: 'active', access_code: 'ADMIN-ACCESS',
                      ebook_plans_generated: 0, chapters_generated: 0, subchapters_generated: 0, covers_generated: 0
                    }}
                    onLogout={handleLogout}
                  />
                ) : isAuthenticated ? (
                  <SubscriptionPage subscriberEmail={subscriberEmail} subscriberData={subscriberData} onLogout={handleLogout} />
                ) : (
                  <SubscriptionAuth onAuthenticated={handleAuthenticated} />
                )
              }
            />

            {/* Admin */}
            <Route path="/admin" element={<AdminGate><AdminPage /></AdminGate>} />
            <Route path="/admin-direct" element={<AdminDirectPage />} />
            <Route path="/admin/profile" element={<AdminGate><AdminProfilePage /></AdminGate>} />
            <Route path="/admin/funnel" element={<AdminGate><AdminFunnelPage /></AdminGate>} />
            <Route path="/admin/cadeaux-pdf" element={<AdminGate><AdminPdfGiftsPage /></AdminGate>} />
            <Route path="/admin/codes-beta" element={<AdminGate><AdminBetaCodesPage /></AdminGate>} />
            <Route path="/admin/beta-testeurs" element={<AdminGate><AdminBetaTestersPage /></AdminGate>} />
            <Route path="/admin/cleanup" element={<AdminGate><Navigate to="/admin/plans-v3" replace /></AdminGate>} />
            <Route path="/admin/plans-v3" element={<AdminGate><AdminPlansV3Page /></AdminGate>} />
            <Route path="/admin/tester-paypal" element={<AdminGate><AdminTestPayPalPage /></AdminGate>} />
            <Route path="/admin-paiements" element={<AdminGate><AdminPaymentsDashboardPage /></AdminGate>} />
            <Route path="/crm" element={<AdminGate><CrmPage /></AdminGate>} />
            <Route path="/gestion-prospects" element={<AdminGate><ProspectManagerPage /></AdminGate>} />
            <Route path="/apercu-emails" element={<AdminGate><EmailPreviewPage /></AdminGate>} />

            {/* V3 public site */}
            <Route path="/v3" element={<V3PublicLayout />}>
              <Route index element={<V3HomePage />} />
              <Route path="auth" element={<V3AuthPage />} />
              <Route path="create" element={<V3CreatePage />} />
              <Route path="create/illustre" element={<V3KidsBookCreatePage />} />
              <Route path="book/:id" element={<V3BookPage />} />
              <Route path="library" element={<V3LibraryPage />} />
              <Route path="gallery" element={<V3GalleryPage />} />
              <Route path="auteur" element={<V3GuestAuthorPage />} />
              <Route path="u/:slug" element={<V3AuthorProfilePage />} />
              <Route path="mes-livres" element={<V3BookManagerPage />} />
              <Route path="parametres" element={<V3AuthorSettingsPage />} />
              <Route path="livres/:type" element={<V3SpecialBookPage />} />
              <Route path="offres" element={<Navigate to="/v3/forfaits" replace />} />
              <Route path="offres/merci" element={<Navigate to="/v3/forfaits" replace />} />

              <Route path="recherche" element={<V3RecherchePage />} />
              <Route path="outils" element={<V3ToolsIndexPage />} />
              <Route path="outils/sommaire-ultime" element={<V3TocUltimatePage />} />
              <Route path="outils/traduction" element={<V3TranslatorPage />} />
              <Route path="compte" element={<V3ComptePage />} />
              <Route path="forfaits" element={<V3ForfaitsPage />} />
              <Route path="pourquoi" element={<V3PourquoiPage />} />
              <Route path="script-heygen" element={<V3ScriptHeygenPage />} />
              <Route path="hub" element={isPlannerPreviewHost ? <V3HubPage /> : <V3Gate><V3HubPage /></V3Gate>} />
            </Route>

            <Route path="*" element={<Navigate to={hasPlannerAccess ? "/ebook-planner" : "/offres"} replace />} />
          </Routes>
          </Suspense>
          <SubscriberActivityPopup />
          {isAuthenticated && <FirstEbookOnboarding subscriberEmail={subscriberEmail} />}
          <EbookbotFloatingButton />
          <ApiKeysFloatingButton />
          <GeminiKeyAlertBanner />
          {(isAuthenticated || isAdmin || isPlannerPreviewHost) && (
            <V2V3FloatingSwitch forceVisible={isPlannerPreviewHost && !isAuthenticated && !isAdmin} />
          )}
          {isAuthenticated && <AISosModal />}
          {isAuthenticated && <AICostBadge />}
          {!isAuthenticated && <LeadCapturePopup />}
          {!isAuthenticated && <FloatingToolCTA />}
          {!isAuthenticated && <StickySignupBar />}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
