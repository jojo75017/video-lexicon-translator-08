import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SubscriberGate } from '@/components/auth/SubscriberGate';
import { AdminGate } from '@/components/auth/AdminGate';
import { V3Gate } from '@/components/auth/V3Gate';
import { V3LockedGate } from '@/components/v3/V3LockedGate';
import { TrialGate } from '@/components/auth/TrialGate';
import { TrialBookLimitGate } from '@/components/auth/TrialBookLimitGate';


import { BookPerfectGate } from '@/components/auth/BookPerfectGate';
import { Loader2 } from 'lucide-react';
import AccessPendingFallback from '@/components/auth/AccessPendingFallback';

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
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from '@/config/adminRoutes';
import { getHomePath, SUBSCRIBER_HOME_PATH, type AccessState } from '@/lib/authDestination';
import { useAdminAccess } from '@/contexts/AdminAccessContext';
import AdminQuickNav from '@/components/admin/AdminQuickNav';
import { hasPersistedAdminHint } from '@/lib/adminAccess';

// V2 — Ebook Planner + outils satellites
const RedirectClickPage = lazy(() => import('./pages/RedirectClickPage'));
const EbookPlannerPage = lazy(() => import('./pages/EbookPlannerPage'));
const EbookIdeasPage = lazy(() => import('./pages/EbookIdeasPage'));
const EbookbotPage = lazy(() => import('./pages/EbookbotPage'));
const AmbiancesPage = lazy(() => import('./pages/AmbiancesPage'));
const CouvertureKdpPage = lazy(() => import('./pages/CouvertureKdpPage'));
const CoverStudioProHubPage = lazy(() => import('./pages/v3/cover-studio-pro/CoverStudioProHubPage'));
const CoverEditorPage = lazy(() => import('./pages/v3/cover-studio-pro/CoverEditorPage'));
const MesCouverturesPage = lazy(() => import('./pages/v3/mes-couvertures/MesCouverturesPage'));
const CouvertureExpressPage = lazy(() => import('./pages/v3/CouvertureExpressPage'));
const CouvertureProjetPage = lazy(() => import('./pages/v3/mes-couvertures/CouvertureProjetPage'));
const PaiementsCouverturesPage = lazy(() => import('./pages/v3/PaiementsCouverturesPage'));
const CoverProPage = lazy(() => import('./pages/v3/cover-studio-pro/CoverProPage'));
const AdminCoverProPage = lazy(() => import('./pages/admin/AdminCoverProPage'));
const Niches600Page = lazy(() => import('./pages/Niches600Page'));
const NichesPage = lazy(() => import('./pages/NichesPage'));
const BookPerfectPage = lazy(() => import('./pages/BookPerfectPage'));
const AuditPilotPage = lazy(() => import('./pages/AuditPilotPage'));
const WordCountPage = lazy(() => import('./pages/WordCountPage'));
const SeriesTomesPage = lazy(() => import('./pages/SeriesTomesPage'));
const PracticalSheetsGeneratorPage = lazy(() => import('./pages/PracticalSheetsGeneratorPage'));
const BDStudioPage = lazy(() => import('./pages/BDStudioPage'));
const BDOffrePage = lazy(() => import('./pages/bd/BDOffrePage'));
const BDUpsellPage = lazy(() => import('./pages/bd/BDUpsellPage'));
const BDMerciPage = lazy(() => import('./pages/bd/BDMerciPage'));
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
const V3PaiementPage = lazy(() => import('./pages/V3PaiementPage'));
const EssaiPage = lazy(() => import('./pages/launch/EssaiPage'));
const EssaiInscriptionPage = lazy(() => import('./pages/launch/EssaiInscriptionPage'));
const EssaiGratuit7JoursPage = lazy(() => import('./pages/launch/EssaiGratuit7JoursPage'));
const V3WaitingRoomPage = lazy(() => import('./pages/launch/V3WaitingRoomPage'));
const MessageAudioPage = lazy(() => import('./pages/launch/MessageAudioPage'));
const FicheHistoirePage = lazy(() => import('./pages/launch/FicheHistoirePage'));
const FichePreuvePage = lazy(() => import('./pages/launch/FichePreuvePage'));
const FicheDernierJourPage = lazy(() => import('./pages/launch/FicheDernierJourPage'));
const MethodePage = lazy(() => import('./pages/launch/MethodePage'));
const AdminLancementPage = lazy(() => import('./pages/admin/AdminLancementPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));


// V3 hub + public site
const V3HubPage = lazy(() => import('./pages/V3HubPage'));
const V3PublicLayout = lazy(() => import('./components/v3public/V3PublicLayout'));
const V3HomePage = lazy(() => import('./pages/v3public/V3HomePage'));
const V3AuthPage = lazy(() => import('./pages/v3public/V3AuthPage'));
const V3CreatePage = lazy(() => import('./pages/v3public/V3CreatePage'));
const V3LaunchBookPage = lazy(() => import('./pages/v3public/V3LaunchBookPage'));
const V3KidsBookCreatePage = lazy(() => import('./pages/v3public/V3KidsBookCreatePage'));
const V3BookPage = lazy(() => import('./pages/v3public/V3BookPage'));
const V3LibraryPage = lazy(() => import('./pages/v3public/V3LibraryPage'));
const V3GalleryPage = lazy(() => import('./pages/v3public/V3GalleryPage'));
const V3GuestAuthorPage = lazy(() => import('./pages/v3public/V3GuestAuthorPage'));
const V3AuthorProfilePage = lazy(() => import('./pages/v3public/V3AuthorProfilePage'));
const V3BookManagerPage = lazy(() => import('./pages/v3public/V3BookManagerPage'));
const V3KdpDataPage = lazy(() => import('./pages/v3public/V3KdpDataPage'));
const V3SpecialBookPage = lazy(() => import('./pages/v3public/V3SpecialBookPage'));
const V3AuthorSettingsPage = lazy(() => import('./pages/v3public/V3AuthorSettingsPage'));
// Archived V3 pages (no inbound links) — routes redirect to /v3/forfaits.
// Files kept in src/pages/v3public/ for reference; remove after Oct 2026 launch if unused.
const V3TocUltimatePage = lazy(() => import('./pages/v3public/V3TocUltimatePage'));
const V3TranslatorPage = lazy(() => import('./pages/v3public/V3TranslatorPage'));
const V3CorrecteurPage = lazy(() => import('./pages/v3public/V3CorrecteurPage'));
const V3AvisClientsPage = lazy(() => import('./pages/v3public/V3AvisClientsPage'));
const V3PostsPage = lazy(() => import('./pages/v3public/V3PostsPage'));
const V3AcquisitionPage = lazy(() => import('./pages/v3public/V3AcquisitionPage'));
const V3KitDemarragePage = lazy(() => import('./pages/v3/V3KitDemarragePage'));
const V3StudioProPage = lazy(() => import('./pages/v3public/V3StudioProPage'));

const V3ToolsIndexPage = lazy(() => import('./pages/v3public/V3ToolsIndexPage'));
const V3FeaturesPage = lazy(() => import('./pages/v3public/V3FeaturesPage'));
const V3WorkflowPage = lazy(() => import('./pages/v3public/V3WorkflowPage'));
const V3StartHerePage = lazy(() => import('./pages/v3public/V3StartHerePage'));
const V3ApiKeysPage = lazy(() => import('./pages/v3public/V3ApiKeysPage'));
const V3CoordonneesPage = lazy(() => import('./pages/v3public/V3CoordonneesPage'));
const V3ReseauxPage = lazy(() => import('./pages/v3public/V3ReseauxPage'));
const V3IntegrationsPage = lazy(() => import('./pages/v3public/V3IntegrationsPage'));
const V3QuestionsPage = lazy(() => import('./pages/v3public/V3QuestionsPage'));

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
const V3UpsellsPage = lazy(() => import('./pages/v3/V3UpsellsPage'));
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
const V3CoverOfferPage = lazy(() => import('./pages/v3public/V3CoverOfferPage'));
const V3CommanderPage = lazy(() => import('./pages/v3public/V3CommanderPage'));
const ReferralKitPage = lazy(() => import('./pages/ReferralKitPage'));
const GoKdpPilotPage = lazy(() => import('./pages/GoKdpPilotPage'));
const ContentStudioPage = lazy(() => import('./pages/v3public/ContentStudioPage'));
const ContentStudioProjectPage = lazy(() => import('./pages/v3public/ContentStudioProjectPage'));


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
const AdminFunnelPage = lazy(() => import('./pages/admin/AdminFunnelPage'));
const AdminPdfGiftsPage = lazy(() => import('./pages/admin/AdminPdfGiftsPage'));
const AdminBetaCodesPage = lazy(() => import('./pages/admin/AdminBetaCodesPage'));
const AdminBetaTestersPage = lazy(() => import('./pages/admin/AdminBetaTestersPage'));
const AdminTemoignagesPage = lazy(() => import('./pages/admin/AdminTemoignagesPage'));
const AdminEssaisPage = lazy(() => import('./pages/admin/AdminEssaisPage'));

const AdminPaymentsDashboardPage = lazy(() => import('./pages/admin/AdminPaymentsDashboardPage'));
const AdminCleanupPage = lazy(() => import('./pages/admin/AdminCleanupPage'));
const AdminPlansV3Page = lazy(() => import('./pages/admin/AdminPlansV3Page'));
const AdminTestPayPalPage = lazy(() => import('./pages/admin/AdminTestPayPalPage'));
const AdminTestBdPage = lazy(() => import('./pages/admin/AdminTestBdPage'));

const AdminAttentePage = lazy(() => import('./pages/admin/AdminAttentePage'));
const AdminSequenceEmailPage = lazy(() => import('./pages/admin/AdminSequenceEmailPage'));
const BonusPage = lazy(() => import('./pages/BonusPage'));
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
  const { pathname } = useLocation();
  const { isAdmin, isChecking: isAdminChecking, refresh: refreshAdminAccess } = useAdminAccess();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [adminTimedOut, setAdminTimedOut] = useState(false);
  const isAdminChecked = !isAdminChecking;
  // L'indice ne donne aucun droit : il maintient seulement la barre de sortie
  // visible pendant la revalidation. Chaque destination reste protégée côté serveur.
  const keepAdminNavigationVisible = isAdmin || (isAdminChecking && hasPersistedAdminHint());

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);



  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsCheckingAuth(false);
      setAdminTimedOut(true);
    }, 8000);

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
    };


    initAuth();

    return () => {
      clearTimeout(safetyTimer);
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

  /**
   * Accès abonné refusé sur une route protégée : on nettoie seulement le cache
   * abonné. Pas de signOut ni de redirection dure — sinon un admin (ou un
   * abonné dont la validation est encore en cours) était éjecté vers
   * /logout-total et « aucun onglet n'ouvrait la bonne page ».
   */
  const handleInvalidSubscriber = useCallback(() => {
    localStorage.removeItem('subscriber_email');
    localStorage.removeItem('subscriber_data');
    setIsAuthenticated(false);
    setSubscriberEmail('');
    setSubscriberData(null);
  }, []);

  /** Relance la vérification du rôle sans recharger la page. */
  const handleAdminRetry = useCallback(() => {
    setAdminTimedOut(false);
    void refreshAdminAccess();
  }, [refreshAdminAccess]);



  // La prévisualisation ne doit jamais fabriquer un faux accès V2 : elle doit
  // suivre exactement les mêmes règles de session que le site publié.
  const hasPlannerAccess = isAuthenticated || isAdmin;
  const accessState: AccessState = !isAdminChecked
    ? 'pending'
    : isAdmin
      ? 'admin'
      : isAuthenticated
        ? 'subscriber'
        : 'visitor';
  const homePath = getHomePath(accessState);
  const isAdminAuthRoute = pathname === ADMIN_LOGIN_PATH || pathname === '/admin-direct';

  if (isCheckingAuth) return <PageLoader />;

  // Helper wrapper for subscriber-gated routes
  const gated = (node: React.ReactNode) => (
    <SubscriberGate
      isAdmin={isAdmin}
      subscriberEmail={subscriberEmail}
      subscriberData={subscriberData}
      onInvalid={handleInvalidSubscriber}
    >
      {node}
    </SubscriberGate>
  );

  /**
   * Pages V3 déclarées hors du layout /v3 : elles doivent appliquer la même
   * règle que le layout — un abonné V2 (non-admin) ne voit rien de la V3 et
   * repart sur /ebook-planner. Statut inconnu = on patiente (jamais d'éjection).
   */
  const v3Standalone = (node: React.ReactNode) => {
    if (!isAdminChecked) return <PageLoader />;
    if (!isAdmin && isAuthenticated) return <Navigate to={SUBSCRIBER_HOME_PATH} replace />;
    return <>{node}</>;
  };


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {keepAdminNavigationVisible && !isAdminAuthRoute && <AdminQuickNav />}
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

            {/* Accueil : admin vers le panneau admin, client vers son espace, visiteur vers l'offre */}
            {/* Racine : on attend que la session soit connue avant de rediriger,
                sinon un abonné / admin était envoyé sur la page de vente. */}
            <Route
              path="/"
              element={
                isCheckingAuth || !homePath
                  ? <AccessPendingFallback timedOut={adminTimedOut} onRetry={handleAdminRetry} />
                  : <Navigate to={homePath} replace />
              }
            />




            {/* Marketing */}
            {/* Visiteurs non connectés → page de commande publique (plus de mur de login) */}
            <Route path="/offres" element={
              hasPlannerAccess
                ? <Navigate to={homePath ?? '/ebook-planner'} replace />
                : (isAuthenticated
                    ? <SubscriptionPage subscriberEmail={subscriberEmail} subscriberData={subscriberData} onLogout={handleLogout} />
                    : <Navigate to="/commander" replace />)
            } />
            <Route path="/connexion-abonne" element={
              isAuthenticated
                ? <Navigate to={homePath ?? '/ebook-planner'} replace />
                : <SubscriptionAuth onAuthenticated={handleAuthenticated} />
            } />

            <Route path="/login" element={<Navigate to="/connexion-abonne" replace />} />
            <Route path="/connexion" element={<Navigate to="/connexion-abonne" replace />} />
            <Route path="/subscription" element={<Navigate to="/connexion-abonne" replace />} />
            {/* Tunnel de commande : toujours accessible (les CTA emails/bannières doivent
                arriver sur le paiement, même pour un admin ou un abonné connecté). */}
            <Route path="/commander" element={<V3CommanderPage />} />
            <Route path="/essai" element={<EssaiPage />} />
            <Route path="/essai/inscription" element={<EssaiInscriptionPage />} />
            {/* Essai gratuit 7 jours : inscription publique + envoi Systeme.io */}
            <Route path="/essai-gratuit-7-jours" element={<EssaiGratuit7JoursPage />} />
            <Route path="/v3/attente" element={v3Standalone(<V3WaitingRoomPage />)} />
            <Route path="/message" element={<MessageAudioPage />} />
            {/* Fiches ponts du tunnel email : 1 email = 1 fiche = 1 bouton vers /commander */}
            <Route path="/fiche/histoire" element={<FicheHistoirePage />} />
            <Route path="/fiche/preuve" element={<FichePreuvePage />} />
            <Route path="/fiche/dernier-jour" element={<FicheDernierJourPage />} />
            <Route path="/methode" element={<MethodePage />} />




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
            <Route path="/commande-v3" element={<Navigate to="/commander" replace />} />
            <Route path="/v3-paiement" element={<V3PaiementPage />} />
            <Route path="/vente-v3" element={<Navigate to="/commander" replace />} />

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
            <Route path="/essai-gratuit" element={<Navigate to="/essai-gratuit-7-jours" replace />} />
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
            <Route path="/business-center" element={<Navigate to={ADMIN_HOME_PATH} replace />} />
            <Route path="/plan-marketing" element={<Navigate to={ADMIN_HOME_PATH} replace />} />
            <Route path="/campagne-vente" element={<Navigate to={ADMIN_HOME_PATH} replace />} />
            <Route path="/dashboard-marketing" element={<Navigate to={ADMIN_HOME_PATH} replace />} />
            <Route path="/generateur-posts" element={<Navigate to={ADMIN_HOME_PATH} replace />} />
            <Route path="/dashboard" element={<Navigate to="/ebook-planner" replace />} />
            <Route path="/espace" element={!homePath ? <PageLoader /> : <Navigate to={homePath} replace />} />
            <Route path="/espace/lancement" element={!homePath ? <PageLoader /> : <Navigate to={homePath} replace />} />
            <Route path="/tableau-de-bord" element={!homePath ? <PageLoader /> : <Navigate to={homePath} replace />} />
            <Route path="/admin-cockpit" element={<Navigate to={ADMIN_HOME_PATH} replace />} />
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
            <Route path={ADMIN_LOGIN_PATH} element={<AuthPage />} />
            <Route path="/logout-total" element={<LogoutTotalPage />} />
            <Route path="/install" element={<InstallPage />} />
            <Route path="/mon-code" element={<RecuperationCodePage />} />
            <Route path="/activer-beta" element={<ActivationBetaPage />} />
            <Route path="/cadeau" element={<CadeauPage />} />
            <Route path="/bonus" element={<BonusPage />} />
            <Route path="/r" element={<RedirectClickPage />} />
            <Route path="/r/:shortKey" element={<RedirectClickPage />} />

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
            <Route path="/10-niches-offertes" element={<Navigate to="/cadeau" replace />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/signature" element={<SignaturePage />} />
            <Route path="/bd-studio" element={<BDStudioPage />} />
            {/* Tunnel Studio BD & Jeunesse : vente 17 € → upsell Pro 47 € → studio */}
            <Route path="/bd-offre" element={<BDOffrePage />} />
            <Route path="/bd-upsell" element={<BDUpsellPage />} />
            <Route path="/bd-merci" element={<BDMerciPage />} />
            <Route path="/word-count" element={<WordCountPage />} />
            <Route
              path="/ebook-planner"
              element={
                gated(
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
            <Route path="/v3/cover-studio-pro" element={gated(<TrialGate label="Cover Studio Pro"><CoverStudioProHubPage /></TrialGate>)} />
            <Route path="/v3/cover-studio-pro/edit" element={gated(<TrialGate label="Cover Studio Pro"><CoverEditorPage /></TrialGate>)} />
            <Route path="/v3/couverture-express" element={gated(<TrialGate label="Ma couverture en 3 étapes"><CouvertureExpressPage /></TrialGate>)} />
            <Route path="/v3/mes-couvertures" element={gated(<TrialGate label="Mes couvertures"><MesCouverturesPage /></TrialGate>)} />
            <Route path="/v3/mes-couvertures/:id" element={gated(<TrialGate label="Mes couvertures"><CouvertureProjetPage /></TrialGate>)} />
            {/* Cover Studio KDP Pro — upsell indépendant 67 € (étape 3). */}
            <Route path="/v3/cover-pro" element={gated(<TrialGate label="Cover Studio KDP Pro"><CoverProPage /></TrialGate>)} />
            <Route path="/v3/paiements" element={gated(<TrialGate label="Mes paiements"><PaiementsCouverturesPage /></TrialGate>)} />
            <Route path="/admin/cover-pro" element={<AdminGate><AdminCoverProPage /></AdminGate>} />

            <Route path="/series-tomes" element={gated(<SeriesTomesPage />)} />
            <Route path="/fiches-pratiques" element={gated(<PracticalSheetsGeneratorPage />)} />

            {/* Admin */}
            <Route path={ADMIN_HOME_PATH} element={<AdminGate><AdminPage /></AdminGate>} />
            <Route path="/admin-direct" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
            <Route path="/admin/profile" element={<AdminGate><AdminProfilePage /></AdminGate>} />
            <Route path="/admin/funnel" element={<AdminGate><AdminFunnelPage /></AdminGate>} />
            <Route path="/admin/cadeaux-pdf" element={<AdminGate><AdminPdfGiftsPage /></AdminGate>} />
            <Route path="/admin/codes-beta" element={<AdminGate><AdminBetaCodesPage /></AdminGate>} />
            <Route path="/admin/beta-testeurs" element={<AdminGate><AdminBetaTestersPage /></AdminGate>} />
            <Route path="/admin/temoignages" element={<AdminGate><AdminTemoignagesPage /></AdminGate>} />
            <Route path="/admin/essais" element={<AdminGate><AdminEssaisPage /></AdminGate>} />

            <Route path="/admin/cleanup" element={<AdminGate><Navigate to="/admin/plans-v3" replace /></AdminGate>} />
            <Route path="/admin/plans-v3" element={<AdminGate><AdminPlansV3Page /></AdminGate>} />
            <Route path="/admin/attente" element={<AdminGate><AdminAttentePage /></AdminGate>} />
            <Route path="/admin/lancement" element={<AdminGate><AdminLancementPage /></AdminGate>} />
            <Route path="/admin/campagnes" element={<AdminGate><AdminSequenceEmailPage /></AdminGate>} />
            <Route path="/admin/sequence-email" element={<Navigate to="/admin/campagnes" replace />} />

            <Route path="/admin/kit-publication" element={<AdminGate><AdminPublishingKitPage /></AdminGate>} />
            <Route path="/admin/tester-paypal" element={<AdminGate><AdminTestPayPalPage /></AdminGate>} />
            {/* Test du tunnel Studio BD & Jeunesse (accès de test sans paiement) */}
            <Route path="/admin/tester-bd" element={<AdminGate><AdminTestBdPage /></AdminGate>} />

            <Route path="/admin-paiements" element={<AdminGate><AdminPaymentsDashboardPage /></AdminGate>} />
            <Route path="/crm" element={<AdminGate><CrmPage /></AdminGate>} />
            <Route path="/gestion-prospects" element={<AdminGate><ProspectManagerPage /></AdminGate>} />
            <Route path="/apercu-emails" element={<AdminGate><EmailPreviewPage /></AdminGate>} />

            {/* V3 public site */}
            <Route path="/v3/offre" element={v3Standalone(<V3OffrePage />)} />
            <Route path="/v3/temoignage" element={v3Standalone(<V3TemoignagePage />)} />


            <Route path="/v3" element={<V3PublicLayout isAdmin={isAdmin} isAdminChecking={!isAdminChecked} isSubscriber={isAuthenticated} />}>
              <Route index element={<V3HomePage />} />
              <Route path="auth" element={<V3AuthPage />} />
              <Route path="pourquoi" element={<V3PourquoiPage />} />
              <Route path="realite-kdp" element={<V3RealiteKdpPage />} />
              <Route path="contact" element={<ContactSupportPage subscriberEmail={subscriberEmail || ''} />} />
              <Route path="offre-couverture-v4" element={<V3CoverOfferPage />} />
              <Route path="fonctionnalites" element={<V3FeaturesPage />} />
              <Route path="fonctionnalites/cles" element={<V3ApiKeysPage />} />
              <Route path="fonctionnalites/coordonnees" element={<V3CoordonneesPage />} />
              <Route path="fonctionnalites/reseaux" element={<V3ReseauxPage />} />
              <Route path="fonctionnalites/integrations" element={<V3IntegrationsPage />} />
              <Route path="fonctionnalites/questions" element={<V3QuestionsPage />} />
              <Route path="workflow" element={<V3WorkflowPage />} />
              <Route path="commence-ici" element={<V3StartHerePage />} />
              <Route path="contentstudio" element={<V3LockedGate><TrialGate label="ContentStudio Engine"><ContentStudioPage /></TrialGate></V3LockedGate>} />
              <Route path="contentstudio/:id" element={<V3LockedGate><TrialGate label="ContentStudio Engine"><ContentStudioProjectPage /></TrialGate></V3LockedGate>} />



              {/* Routes verrouillées jusqu'au 1er octobre 2026 (admins exceptés) */}
              <Route path="create" element={<V3LockedGate><TrialBookLimitGate><V3CreatePage /></TrialBookLimitGate></V3LockedGate>} />
              {/* Parcours direct « comme la V2, en mieux » : fiche + workflow 15 agents */}
              <Route path="lancer" element={<V3LockedGate><TrialBookLimitGate><V3LaunchBookPage /></TrialBookLimitGate></V3LockedGate>} />

              {/* Biographie — même moteur, entretien et chronologie dédiés */}
              <Route path="biographie" element={<V3LockedGate><TrialGate label="Biographie"><V3CreatePage mode="biography" /></TrialGate></V3LockedGate>} />
              <Route path="create/illustre" element={<V3LockedGate><TrialGate label="Livre illustré"><V3KidsBookCreatePage /></TrialGate></V3LockedGate>} />
              <Route path="book/:id" element={<V3LockedGate><V3BookPage /></V3LockedGate>} />
              <Route path="library" element={<V3LockedGate><V3LibraryPage /></V3LockedGate>} />
              <Route path="gallery" element={<V3LockedGate><TrialGate label="Galerie publique"><V3GalleryPage /></TrialGate></V3LockedGate>} />
              <Route path="auteur" element={<V3LockedGate><TrialGate label="Profil auteur public"><V3GuestAuthorPage /></TrialGate></V3LockedGate>} />
              <Route path="u/:slug" element={<V3LockedGate><TrialGate label="Profil auteur public"><V3AuthorProfilePage /></TrialGate></V3LockedGate>} />
              <Route path="mes-livres" element={<V3LockedGate><V3BookManagerPage /></V3LockedGate>} />
              <Route path="livres-corriges" element={<V3LockedGate><V3BookManagerPage /></V3LockedGate>} />
              <Route path="donnees-kdp" element={<V3LockedGate><TrialGate label="Données KDP"><V3KdpDataPage /></TrialGate></V3LockedGate>} />
              <Route path="parametres" element={<V3LockedGate><V3AuthorSettingsPage /></V3LockedGate>} />
              <Route path="livres/:type" element={<V3LockedGate><TrialGate label="Livres spéciaux"><V3SpecialBookPage /></TrialGate></V3LockedGate>} />

              <Route path="offres" element={<Navigate to="/v3/forfaits" replace />} />
              <Route path="offres/merci" element={<Navigate to="/v3/forfaits" replace />} />

              <Route path="recherche" element={<V3LockedGate><V3RecherchePage /></V3LockedGate>} />
              <Route path="outils" element={<V3LockedGate><V3ToolsIndexPage /></V3LockedGate>} />
              <Route path="assistant" element={<V3LockedGate><V3AssistantPage /></V3LockedGate>} />
              <Route path="outils/sommaire-ultime" element={<V3LockedGate><V3TocUltimatePage /></V3LockedGate>} />
              <Route path="outils/traduction" element={<V3LockedGate><TrialGate label="Traduction 10 langues"><V3TranslatorPage /></TrialGate></V3LockedGate>} />
              <Route path="corriger" element={<V3LockedGate><V3CorrecteurPage /></V3LockedGate>} />
              <Route path="avis" element={<V3LockedGate><TrialGate label="Avis clients"><V3AvisClientsPage /></TrialGate></V3LockedGate>} />
              <Route path="posts" element={<V3LockedGate><TrialGate label="Publications sociales"><V3PostsPage /></TrialGate></V3LockedGate>} />
              <Route path="acquisition" element={<V3LockedGate><TrialGate label="Acquisition"><V3AcquisitionPage /></TrialGate></V3LockedGate>} />
              <Route path="kit-demarrage" element={<V3LockedGate><V3KitDemarragePage /></V3LockedGate>} />
              <Route path="studio" element={<V3LockedGate><TrialGate label="Studio Pro"><V3StudioProPage /></TrialGate></V3LockedGate>} />

              <Route path="correcteur" element={<Navigate to="/v3/corriger" replace />} />

              <Route path="compte" element={<V3LockedGate><V3ComptePage /></V3LockedGate>} />
              {/* Page des 2 forfaits : toujours visible (vitrine tarifaire) */}
              <Route path="forfaits" element={<V3ForfaitsPage />} />
              <Route path="upsells" element={<V3UpsellsPage />} />
              <Route path="complements" element={<Navigate to="/v3/upsells" replace />} />
              <Route path="tarifs" element={<Navigate to="/v3/forfaits" replace />} />
              {/* Onglet ancien client V2 : visible sans attendre l'ouverture publique */}
              <Route path="migration" element={<V3MigrationPage />} />
              <Route path="paypal-retour" element={<V3LockedGate><V3PayPalReturnPage /></V3LockedGate>} />
              <Route path="script-heygen" element={<V3LockedGate><V3ScriptHeygenPage /></V3LockedGate>} />
              <Route path="upsell-17" element={<V3LockedGate><V3Upsell17Page /></V3LockedGate>} />
              <Route path="outils/ams-keywords" element={<V3LockedGate><TrialGate label="Mots-clés AMS"><V3AmsKeywordsPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/espion-concurrents" element={<V3LockedGate><TrialGate label="Espion concurrents"><V3CompetitorSpyPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/categories" element={<V3LockedGate><TrialGate label="Catégories KDP"><V3CategoryFinderPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/offerts" element={<V3LockedGate><V3OutilsOffertsPage /></V3LockedGate>} />
              <Route path="nouveautes" element={<V3LockedGate><V3NouveautesPage /></V3LockedGate>} />
              <Route path="outils/royalties" element={<V3LockedGate><TrialGate label="Royalties"><V3RoyaltiesPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/humanizer" element={<V3LockedGate><TrialGate label="Humanizer IA"><V3HumanizerPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/mockup-3d" element={<V3LockedGate><TrialGate label="Mockup 3D"><V3MockupPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/audiobook" element={<V3LockedGate><TrialGate label="Livre audio"><V3AudiobookPage /></TrialGate></V3LockedGate>} />
              <Route path="outils/editeur" element={<V3LockedGate><V3EditorPage /></V3LockedGate>} />

              <Route path="hub" element={<V3LockedGate><V3Gate><V3HubPage /></V3Gate></V3LockedGate>} />

              {/* Alias historiques : plus aucun lien V3 ne doit tomber en 404 */}
              <Route path="avis-clients" element={<Navigate to="/v3/avis" replace />} />
              <Route path="toc-ultime" element={<Navigate to="/v3/outils/sommaire-ultime" replace />} />
              <Route path="outils/correcteur" element={<Navigate to="/v3/corriger" replace />} />
              <Route path="outils/detection-ia" element={<Navigate to="/v3/outils/humanizer" replace />} />
              <Route path="outils/anti-plagiat" element={<Navigate to="/v3/corriger" replace />} />
              <Route path="outils/coherence-personnages" element={<Navigate to="/v3/studio" replace />} />
              <Route path="outils/book-trailer" element={<Navigate to="/v3/contentstudio" replace />} />
              <Route path="outils/reels" element={<Navigate to="/v3/contentstudio" replace />} />
              <Route path="outils/epub" element={<Navigate to="/v3/outils/editeur" replace />} />
              <Route path="outils/print-ready" element={<Navigate to="/v3/donnees-kdp" replace />} />
              <Route path="outils/suivi-ventes" element={<Navigate to="/v3/outils/royalties" replace />} />
              <Route path="outils/landing-auteur" element={<Navigate to="/v3/auteur" replace />} />
              <Route path="outils/logo-auteur" element={<Navigate to="/v3/upsells" replace />} />
              <Route path="outils/sequences-emails" element={<Navigate to="/v3/acquisition" replace />} />
              <Route path="outils/arc" element={<Navigate to="/v3/avis" replace />} />

              {/* Toute autre URL /v3/* inconnue revient sur l'accueil V3 (jamais de 404),
                  et le layout renvoie l'abonné V2 sur /ebook-planner. */}
              <Route path="*" element={<Navigate to="/v3" replace />} />
            </Route>


            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          {!isAdminAuthRoute && <SubscriberActivityPopup />}
          {isAuthenticated && <FirstEbookOnboarding subscriberEmail={subscriberEmail} />}
          {!isAdminAuthRoute && <AssistantFloatingButton />}
          {!isAdminAuthRoute && <ApiKeysFloatingButton />}
          {!isAdminAuthRoute && <GeminiKeyAlertBanner />}
          {!isAdminAuthRoute && (isAuthenticated || isAdmin) && (
            <V2V3FloatingSwitch forceVisible={isAdmin} />
          )}
          {isAuthenticated && <AISosModal />}
          {isAuthenticated && <AICostBadge />}
          {!isAdminAuthRoute && !isAuthenticated && <LeadCapturePopup />}
          {!isAdminAuthRoute && !isAuthenticated && <FloatingToolCTA />}
          {!isAdminAuthRoute && !isAuthenticated && <StickySignupBar />}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
