import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SubscriberGate } from '@/components/auth/SubscriberGate';
import { AdminGate } from '@/components/auth/AdminGate';
import { V3Gate } from '@/components/auth/V3Gate';
import { V3LockedGate } from '@/components/v3/V3LockedGate';
import { BookPerfectGate } from '@/components/auth/BookPerfectGate';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';
import { Loader2 } from 'lucide-react';
import SubscriberActivityPopup from '@/components/admin/SubscriberActivityPopup';
import { FirstEbookOnboarding } from '@/components/onboarding/FirstEbookOnboarding';
import AssistantFloatingButton from '@/components/assistant/AssistantFloatingButton';
import ApiKeysFloatingButton from '@/components/ebook/ApiKeysFloatingButton';
import GeminiKeyAlertBanner from '@/components/ebook/GeminiKeyAlertBanner';
import AISosModal from '@/components/shared/AISosModal';
import AICostBadge from '@/components/shared/AICostBadge';
import { useBrandTitle } from '@/hooks/useBrandTitle';
import V2V3FloatingSwitch from '@/components/admin/V2V3FloatingSwitch';
import LeadCapturePopup from '@/components/marketing/LeadCapturePopup';
import FloatingToolCTA from '@/components/marketing/FloatingToolCTA';
import StickySignupBar from '@/components/marketing/StickySignupBar';
import V3LaunchGlobalBanner from '@/components/V3LaunchGlobalBanner';
import { captureUtmParams } from '@/lib/utmTracking';

// V2 — Ebook Planner + outils satellites
const RedirectClickPage = lazy(() => import('./pages/RedirectClickPage'));
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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
const V3CorrecteurPage = lazy(() => import('./pages/v3public/V3CorrecteurPage'));
const V3StudioProPage = lazy(() => import('./pages/v3public/V3StudioProPage'));

const V3ToolsIndexPage = lazy(() => import('./pages/v3public/V3ToolsIndexPage'));
const V3AssistantPage = lazy(() => import('./pages/v3/V3AssistantPage'));
const AssistantPublicPage = lazy(() => import('./pages/AssistantPublicPage'));
const V3ComptePage = lazy(() => import('./pages/v3public/V3ComptePage'));
const V3PourquoiPage = lazy(() => import('./pages/v3public/V3PourquoiPage'));
const V3RealiteKdpPage = lazy(() => import('./pages/v3public/V3RealiteKdpPage'));
const V3CommunautePage = lazy(() => import('./pages/v3public/V3CommunautePage'));
const V3CommunautePostPage = lazy(() => import('./pages/v3public/V3CommunautePostPage'));
const V3ScriptHeygenPage = lazy(() => import('./pages/v3public/V3ScriptHeygenPage'));
const V3AmsKeywordsPage = lazy(() => import('./pages/v3public/V3AmsKeywordsPage'));
const V3CompetitorSpyPage = lazy(() => import('./pages/v3public/V3CompetitorSpyPage'));
const V3OutilsOffertsPage = lazy(() => import('./pages/v3public/V3OutilsOffertsPage'));
const V3CategoryFinderPage = lazy(() => import('./pages/v3public/V3CategoryFinderPage'));
const V3ForfaitsPage = lazy(() => import('./pages/v3public/V3ForfaitsPage'));
const V3MigrationPage = lazy(() => import('./pages/v3public/V3MigrationPage'));
const V3PayPalReturnPage = lazy(() => import('./pages/v3public/V3PayPalReturnPage'));
const V3RecherchePage = lazy(() => import('./pages/v3public/V3RecherchePage'));
const V3Upsell17Page = lazy(() => import('./pages/v3public/V3Upsell17Page'));
const V3NouveautesPage = lazy(() => import('./pages/v3public/V3NouveautesPage'));
const V3RoyaltiesPage = lazy(() => import('./pages/v3public/V3RoyaltiesPage'));
const V3HumanizerPage = lazy(() => import('./pages/v3public/V3HumanizerPage'));
const V3MockupPage = lazy(() => import('./pages/v3public/V3MockupPage'));
const V3AudiobookPage = lazy(() => import('./pages/v3public/V3AudiobookPage'));
const V3EditorPage = lazy(() => import('./pages/v3public/V3EditorPage'));
const V3OffrePage = lazy(() => import('./pages/v3public/V3OffrePage'));
const V3CommanderPage = lazy(() => import('./pages/v3public/V3CommanderPage'));
const ReferralKitPage = lazy(() => import('./pages/ReferralKitPage'));
const GoKdpPilotPage = lazy(() => import('./pages/GoKdpPilotPage'));


const V3TemoignagePage = lazy(() => import('./pages/v3public/V3TemoignagePage'));

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
const AdminAttentePage = lazy(() => import('./pages/admin/AdminAttentePage'));
const AdminPublishingKitPage = lazy(() => import('./pages/admin/AdminPublishingKitPage'));
const DemoGeniePage = lazy(() => import('./pages/DemoGeniePage'));
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
          <V3LaunchGlobalBanner />
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

            {/* Accueil : client reconnu vers son espace, visiteur vers l'offre active */}
            <Route path="/" element={<Navigate to={hasPlannerAccess ? '/ebook-planner' : '/commander'} replace />} />

            {/* Marketing */}
            {/* Visiteurs non connectés → page de commande publique (plus de mur de login) */}
            <Route path="/offres" element={
              hasPlannerAccess
                ? <Navigate to="/ebook-planner" replace />
                : (isAuthenticated
                    ? <SubscriptionPage subscriberEmail={subscriberEmail} subscriberData={subscriberData} onLogout={handleLogout} />
                    : <Navigate to="/commander" replace />)
            } />
            <Route path="/connexion-abonne" element={
              isAuthenticated
                ? <Navigate to="/offres" replace />
                : <SubscriptionAuth onAuthenticated={handleAuthenticated} />
            } />
            <Route path="/login" element={<Navigate to="/connexion-abonne" replace />} />
            <Route path="/connexion" element={<Navigate to="/connexion-abonne" replace />} />
            <Route path="/subscription" element={<Navigate to="/connexion-abonne" replace />} />
            {/* Admin / abonné : renvoyé direct sur le tableau de bord (Ebook Planner).
                Ajoute ?voir=1 pour inspecter la page de vente. */}
            <Route path="/commander" element={
              hasPlannerAccess && typeof window !== 'undefined' && !new URLSearchParams(window.location.search).has('voir')
                ? <Navigate to="/ebook-planner" replace />
                : <V3CommanderPage />
            } />

            <Route path="/go/kdp-pilot" element={<GoKdpPilotPage />} />

            <Route path="/offre-59" element={<Navigate to="/commander" replace />} />
            <Route path="/59" element={<Navigate to="/commander" replace />} />

            <Route path="/demo-classique" element={<DemoPage />} />
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
            <Route path="/promo/commande" element={<Navigate to="/commander" replace />} />
            <Route path="/promo/paiement" element={<Navigate to="/commander" replace />} />
            <Route path="/promo/bonus" element={<PromoBonusPage />} />
            <Route path="/promo/espace" element={<PromoEspacePage />} />
            <Route path="/promo/affilie" element={<PromoAffiliePage />} />

            {/* Redirections SEO (pages supprimées) */}
            <Route path="/sales" element={<Navigate to="/commander" replace />} />
            <Route path="/publication-pro" element={<Navigate to="/commander" replace />} />
            <Route path="/v3-offre" element={<Navigate to="/commander" replace />} />
            <Route path="/valeur-offre" element={<Navigate to="/commander" replace />} />
            <Route path="/coaching-vip" element={<Navigate to="/offres" replace />} />
            <Route path="/parrainage" element={<Navigate to="/mon-parrainage" replace />} />
            <Route path="/mon-parrainage" element={<ReferralKitPage />} />
            <Route path="/affiliation" element={<Navigate to="/offres" replace />} />
            <Route path="/webinaire" element={<Navigate to="/offres" replace />} />
            <Route path="/nouveautes-2026" element={<Navigate to="/offres" replace />} />
            <Route path="/arc-signup" element={<Navigate to="/offres" replace />} />
            <Route path="/essai-gratuit" element={<Navigate to="/commander" replace />} />
            <Route path="/resultat-en-5-min" element={<Navigate to="/commander" replace />} />
            <Route path="/bookperfect-offre" element={<Navigate to="/commander" replace />} />

            <Route path="/tutoriels" element={<Navigate to="/formation" replace />} />
            <Route path="/guide-outils" element={<Navigate to="/formation" replace />} />
            <Route path="/guide-ebook" element={<Navigate to="/formation" replace />} />
            <Route path="/kdp-ads-guide" element={<Navigate to="/formation" replace />} />
            <Route path="/checklist-tournage" element={<Navigate to="/formation" replace />} />
            <Route path="/communaute" element={<V3CommunautePage />} />
            <Route path="/communaute/post/:id" element={<V3CommunautePostPage />} />
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
            <Route path="/demo" element={<DemoGeniePage />} />
            <Route path="/v3/import" element={<Navigate to="/v3/create?import=1" replace />} />
            <Route path="/v3/traduire" element={<Navigate to="/v3/outils/traduction" replace />} />
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
            <Route path="/r" element={<RedirectClickPage />} />
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
            <Route path="/assistant" element={<AssistantPublicPage />} />
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
            <Route path="/admin/attente" element={<AdminGate><AdminAttentePage /></AdminGate>} />
            <Route path="/admin/kit-publication" element={<AdminGate><AdminPublishingKitPage /></AdminGate>} />
            <Route path="/admin/tester-paypal" element={<AdminGate><AdminTestPayPalPage /></AdminGate>} />
            <Route path="/admin-paiements" element={<AdminGate><AdminPaymentsDashboardPage /></AdminGate>} />
            <Route path="/crm" element={<AdminGate><CrmPage /></AdminGate>} />
            <Route path="/gestion-prospects" element={<AdminGate><ProspectManagerPage /></AdminGate>} />
            <Route path="/apercu-emails" element={<AdminGate><EmailPreviewPage /></AdminGate>} />

            {/* V3 public site */}
            <Route path="/v3/offre" element={<V3OffrePage />} />
            <Route path="/v3/temoignage" element={<V3TemoignagePage />} />

            <Route path="/v3" element={<V3PublicLayout />}>
              <Route index element={<V3HomePage />} />
              <Route path="auth" element={<V3AuthPage />} />
              <Route path="pourquoi" element={<V3PourquoiPage />} />
              <Route path="realite-kdp" element={<V3RealiteKdpPage />} />
              <Route path="contact" element={<ContactSupportPage subscriberEmail={subscriberEmail || ''} />} />


              {/* Routes verrouillées jusqu'au 1er octobre 2026 (admins exceptés) */}
              <Route path="create" element={<V3LockedGate><V3CreatePage /></V3LockedGate>} />
              <Route path="create/illustre" element={<V3LockedGate><V3KidsBookCreatePage /></V3LockedGate>} />
              <Route path="book/:id" element={<V3LockedGate><V3BookPage /></V3LockedGate>} />
              <Route path="library" element={<V3LockedGate><V3LibraryPage /></V3LockedGate>} />
              <Route path="gallery" element={<V3LockedGate><V3GalleryPage /></V3LockedGate>} />
              <Route path="auteur" element={<V3LockedGate><V3GuestAuthorPage /></V3LockedGate>} />
              <Route path="u/:slug" element={<V3LockedGate><V3AuthorProfilePage /></V3LockedGate>} />
              <Route path="mes-livres" element={<V3LockedGate><V3BookManagerPage /></V3LockedGate>} />
              <Route path="parametres" element={<V3LockedGate><V3AuthorSettingsPage /></V3LockedGate>} />
              <Route path="livres/:type" element={<V3LockedGate><V3SpecialBookPage /></V3LockedGate>} />
              <Route path="offres" element={<Navigate to="/v3/forfaits" replace />} />
              <Route path="offres/merci" element={<Navigate to="/v3/forfaits" replace />} />

              <Route path="recherche" element={<V3LockedGate><V3RecherchePage /></V3LockedGate>} />
              <Route path="outils" element={<V3LockedGate><V3ToolsIndexPage /></V3LockedGate>} />
              <Route path="assistant" element={<V3AssistantPage />} />
              <Route path="outils/sommaire-ultime" element={<V3LockedGate><V3TocUltimatePage /></V3LockedGate>} />
              <Route path="outils/traduction" element={<V3LockedGate><V3TranslatorPage /></V3LockedGate>} />
              <Route path="corriger" element={<V3LockedGate><V3CorrecteurPage /></V3LockedGate>} />
              <Route path="studio" element={<V3LockedGate><V3StudioProPage /></V3LockedGate>} />
              <Route path="correcteur" element={<Navigate to="/v3/corriger" replace />} />

              <Route path="compte" element={<V3LockedGate><V3ComptePage /></V3LockedGate>} />
              {/* Page des 2 forfaits : toujours visible (vitrine tarifaire) */}
              <Route path="forfaits" element={<V3ForfaitsPage />} />
              <Route path="tarifs" element={<Navigate to="/v3/forfaits" replace />} />
              {/* Onglet ancien client V2 : visible sans attendre l'ouverture publique */}
              <Route path="migration" element={<V3MigrationPage />} />
              <Route path="paypal-retour" element={<V3LockedGate><V3PayPalReturnPage /></V3LockedGate>} />
              <Route path="script-heygen" element={<V3LockedGate><V3ScriptHeygenPage /></V3LockedGate>} />
              <Route path="upsell-17" element={<V3LockedGate><V3Upsell17Page /></V3LockedGate>} />
              <Route path="outils/ams-keywords" element={<V3LockedGate><V3AmsKeywordsPage /></V3LockedGate>} />
              <Route path="outils/espion-concurrents" element={<V3LockedGate><V3CompetitorSpyPage /></V3LockedGate>} />
              <Route path="outils/categories" element={<V3LockedGate><V3CategoryFinderPage /></V3LockedGate>} />
              <Route path="outils/offerts" element={<V3LockedGate><V3OutilsOffertsPage /></V3LockedGate>} />
              <Route path="nouveautes" element={<V3LockedGate><V3NouveautesPage /></V3LockedGate>} />
              <Route path="outils/royalties" element={<V3LockedGate><V3RoyaltiesPage /></V3LockedGate>} />
              <Route path="outils/humanizer" element={<V3LockedGate><V3HumanizerPage /></V3LockedGate>} />
              <Route path="outils/mockup-3d" element={<V3LockedGate><V3MockupPage /></V3LockedGate>} />
              <Route path="outils/audiobook" element={<V3LockedGate><V3AudiobookPage /></V3LockedGate>} />
              <Route path="outils/editeur" element={<V3LockedGate><V3EditorPage /></V3LockedGate>} />
              <Route path="hub" element={<V3LockedGate>{isPlannerPreviewHost ? <V3HubPage /> : <V3Gate><V3HubPage /></V3Gate>}</V3LockedGate>} />


            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          <SubscriberActivityPopup />
          {isAuthenticated && <FirstEbookOnboarding subscriberEmail={subscriberEmail} />}
          <AssistantFloatingButton />
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
