## Objectif

Ménage massif des pages du projet : ne conserver que V2 (Ebook Planner + outils satellites), V3 public, marketing actif (offres/démo/FAQ/promo été), blog/formation et légal/admin simplifié. Tout le reste (anciens tunnels, outils marketing obsolètes, SaaS demo, formation secondaire) est supprimé ou redirigé.

**Statut : EN ATTENTE — à exécuter en août ou septembre 2026.**

---

## Aujourd'hui : 109 pages dans `src/pages/`

Objectif : descendre à **~45 pages** en supprimant ce qui n'est pas V2, V3 ou marketing actif.

## 1. Ce qu'on GARDE

### V2 — Ebook Planner complet + outils satellites
- `EbookPlannerPage`, `EbookIdeasPage`, `EbookbotPage`
- `AmbiancesPage`, `CouvertureKdpPage`, `Niches600Page`, `NichesPage`
- `BookPerfectPage`, `AuditPilotPage`, `WordCountPage`
- `SeriesTomesPage`, `PracticalSheetsGeneratorPage`, `BDStudioPage`, `KdpKeywordResearchPage`
- `MasterclassPage`, `QuizPage`, `SignaturePage`

### V3 public (tout `src/pages/v3public/` + `V3HubPage`)
- Aucune suppression dans ce dossier.

### Marketing actif (offres + démo + FAQ + promo été)
- `SubscriptionPage` (= /offres), `DemoPage`, `FaqAssistancePage`
- Tunnel promo été : garder `src/pages/promo/*` en entier tant que 59€ actif
- `PaymentSuccessPage`, `ConfirmationPaiementPage`, `PaiementManuelPage`, `UpsellPage`, `UpsellPaiementPage`
- `V3CommandePage`, `V3PaiementPage`, `SalesPageV3Launch`

### Blog + Formation (SEO)
- `BlogPage`, `FormationPage`, `FormationVideosPage`, `FormationAudioPage`, `FormationSeriesPage`, `FormationSeriesAudioPage`, `FormationEmbedPage`
- Pages SEO blog : `SeoCreerEbookIaPage`, `SeoGenerateurEbookPage`, `SeoTutorialChatGptPage`, `SeoGuideKdpEnfantsPage`, `SeoFrancophonesEtrangerPage`

### Légal / système
- `MentionsLegales`, `PolitiqueConfidentialite`, `CGV`, `Licence`, `LicenceEtenduePage`, `Securite`
- `AuthPage`, `LogoutTotalPage`, `InstallPage`, `RecuperationCodePage`, `ActivationBetaPage`
- `CadeauPage`, `GiftRedeemPage`, `GiftThankYouPage`, `ContactSupportPage`

### Admin simplifié
- `AdminPage`, `AdminProfilePage`, `AdminDirectPage`, `AdminFunnelPage`, `AdminPdfGiftsPage`, `AdminBetaCodesPage`, `AdminBetaTestersPage`, `AdminPaymentsDashboardPage`, `CrmPage`, `ProspectManagerPage`, `EmailPreviewPage`, `InfluenceursPage`, `InfluenceursConfirmationPage`

## 2. Ce qu'on SUPPRIME (~55 pages + routes)

### Doublons / anciens dashboards
`Dashboard.tsx`, `DashboardPage.tsx`, `AdminCockpitPage.tsx`, `BusinessCenterPage.tsx`, `EspacePage.tsx`, `EspaceLancementPage.tsx`, `ProductLandingPage.tsx`

### Anciennes pages de vente remplacées par V3
`SalesPage.tsx`, `SalesPageV3.tsx`, `SalesCampaignPage.tsx`, `OfferValuePage.tsx`, `Nouveautes2026Page.tsx`, `WebinairePage.tsx`, `ArcSignupPage.tsx`, `TrialSignupPage.tsx`, `ResultatEn5MinPage.tsx`, `CoachingVipPage.tsx`, `AffiliationFormationPage.tsx`, `ParrainagePage.tsx`

### Outils marketing/SEO obsolètes (hors périmètre V2/V3)
`PinterestPage`, `HierarchyPage`, `ProductGeneratorPage`, `PromptsCapturePage`, `PromptsGeneratorPage`, `SeoGeneratorPage`, `SiteClonerPage`, `RobotsTxtPage`, `SuggestionsPage`, `SocialPostGeneratorPage`, `ElementorExportPage`, `ExtensionChromePage`, `MarketingPlanPage`, `UnifiedMarketingDashboard`, `AiChatPage`, `BookPerfectSalesPage`, `PublicAudiobookPage`, `AudiobookDemoPage`, `AudiobookEmbedPage`, `AudiobookThankYouPage`

### Formation/guides secondaires
`TutorielsPage`, `ToolsGuidePage`, `GuideEbookPage`, `KdpAdsGuidePage`, `ChecklistTournagePage`, `ForumPage`

### SaaS demo (tout `src/pages/saas/`)
`SaasAnalytics`, `SaasAuthPage`, `SaasBilling`, `SaasDashboard`, `SaasSettings` + composant `SaasLayout`

### Admin secondaire
`BrevoAutomationGuidePage`, `BrevoOnboardingEmailsPage`, `TrialDashboardPage` (doublon avec funnel)

## 3. Étapes d'exécution

1. **Nettoyer `src/App.tsx`** : supprimer imports + `<Route>` de toutes les pages listées en §2.
2. **Supprimer les fichiers pages** correspondants via `rm`.
3. **Supprimer composants orphelins** rattachés : `src/components/saas/*`, `src/components/landing/*` inutilisés, `src/components/sales/*` non liés à V3Launch, `src/components/ambassador/*`, `src/components/documentation-studio/*` s'il n'est pas branché V3.
4. **Nettoyer `AdminPanelNav.tsx`** (retirer : Business Center, Guide Ebook, Posts, retour au générateur).
5. **Mettre à jour `V3Sidebar.tsx`** et `modernSidebarSections.ts` : retirer liens morts.
6. **Nettoyer `public/sitemap.xml`** : retirer URLs des pages supprimées (formation-audio, kdp-ads-guide, tutoriels, guide-outils, communaute, parrainage, affiliation, nouveautes-2026, valeur-offre, etc.).
7. **Redirections React Router** : `/dashboard` → `/ebook-planner`, `/sales` → `/offres`, `/coaching-vip` → `/offres`, `/parrainage` → `/offres`, `/tutoriels` → `/formation` (éviter 404 sur liens externes indexés).
8. **Vérifier la build** (`tsgo`) et corriger les imports cassés au cas par cas.

## 4. Détails techniques

```text
Avant : 109 pages
Après : ~45 pages
Suppression nette : ~55 pages + ~15 composants orphelins
```

Aucune modification de la logique métier (workflow, edge functions, DB). Uniquement suppression de fichiers, nettoyage de routes, redirections SEO, et sitemap. La V2 (`/ebook-planner`) et la V3 (`/v3/*`) restent 100% fonctionnelles.

**N'exécuter ce plan qu'en août ou septembre 2026**, quand le lancement V3 sera finalisé et que la suppression des anciens tunnels/pages marketing ne perturbera plus les campagnes en cours.
