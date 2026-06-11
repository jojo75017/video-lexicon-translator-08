# Rééquilibrage V3 : base 197€ vs packs premium

## Problème actuel
Dans `src/data/roadmapV3.ts`, `getModuleAccess()` dérive l'accès de l'appartenance aux 4 packs upsell (`getModuleTier`). Tout module **non listé dans un pack** est donc considéré « Inclus 197€ » par défaut. Conséquence : de nombreux modules marketing, IA avancée et monétisation se retrouvent inclus gratuitement dans la base, ce qui vide les packs de leur valeur.

## Principe cible (mémoire « V3 Tier Value Split »)
**197€ = de l'idée jusqu'à publier proprement sur KDP.** Tout ce qui relève du **marketing, de la vente, de la monétisation et de l'IA avancée** passe en **pack premium** (débloqué via le Pack Tout Complet 497€ / `hasFull`).

## Inversion de la logique
On remplace « pack = listé dans un pack » par « **inclus = appartient à une liste blanche de base**, tout le reste = pack ». C'est plus robuste : un nouveau module ajouté est premium par défaut.

### Base 197€ — INCLUS (liste blanche `V3_BASE_MODULE_IDS`)
Pilier **Publier** (essentiels de publication) :
`library`, `kdp-pack-zip`, `cockpit-audit-pilot`, `prepub-checklist`, `kindle-previewer`, `cover-pdf-exact`, `multi-format-express`, `isbn-metadata`, `manuscript-converter`, `content-compliance`, `copyright-page`, `back-matter-builder`, `print-proof-checker`, `categories-manager-10`, `low-content-books`, `onboarding-guides`

Pilier **IA** (création + recherche de niche essentielles) :
`book-creation-studio`, `niche-intelligence`, `p16-competitive`

Infra (admin, non commerciale) :
`pricing-ladder-497`, `installment-payments`

### Passent en PACK (premium, `hasFull`)
- **Publier premium** : `cover-studio-pro`, `cover-variants-thumbnail`, `audiobook-express`, `translation-markets`
- **Tout Marketing** : `listing-optimizer`, `launch-sequence-j7`, `amazon-ads`, `pinterest-pins`, `book-trailer`, `reviews-booster`, `tiktok-hooks`, `author-newsletter`, `arc-team-builder`, `author-page-optimizer`, `bookbub-ad-builder`, `social-calendar-30`, `quote-visuals`, `media-kit`, `goodreads-optimizer`, `influencer-kit`, `look-inside-optimizer`, `editorial-reviews`, `community-kdp-hub`, `community-pinned-solutions`, `community-tool-deeplinks`
- **Toute Monétisation** : `sales-tracker`, `aplus-generator`, `auto-pricing`, `royalties-dashboard`, `bundles-boxsets`, `lead-magnet`, `royalties-simulator`, `ku-niche-detector`, `launch-pricing`, `print-royalties-calc`, `kdp-select-planner`, `back-catalog-funnel`, `sales-description`
- **IA avancée** : `p17-series`, `p18-readability`, `p19-author-voice`, `p20-chat-manuscript`, `p21-blurb-ab-tester`, `p22-trend-radar`, `p23-universe-bible`, `p24-cliche-detector`, `p25-tone-adapter`, `p26-commercial-score`, `community-ai-unblock`

## Changements techniques
1. **`src/data/roadmapV3.ts`**
   - Ajouter `export const V3_BASE_MODULE_IDS = new Set([...])` (liste blanche ci-dessus).
   - Réécrire `getModuleAccess(moduleId)` : `V3_BASE_MODULE_IDS.has(id) ? 'included' : 'pack'`.
   - `getModulePack()` inchangé (pour router vers le bon pack au checkout) ; les modules « pack » sans pack explicite retombent sur le Pack Tout Complet côté UI.

2. **`src/pages/V3HubPage.tsx`** (déjà branché sur `getModuleAccess`)
   - Aucune logique à changer : les badges « Inclus 197€ » / « À débloquer » et le filtre « Mes outils » suivront automatiquement la nouvelle répartition.
   - Vérifier que le compteur héros et la légende restent cohérents (la majorité passe en premium).

3. **Mémoire** : mettre à jour `mem://business/pricing/v3-tier-value-split` pour acter la liste blanche de base comme source de vérité de l'inclusion.

## Hors périmètre
- Pas de nouveaux prix ni de nouvelle grille tarifaire.
- Pas de suivi de packs individuels (toujours `hasBase` / `hasFull`).
- Pas de changement des packs upsell existants ni de leur prix.