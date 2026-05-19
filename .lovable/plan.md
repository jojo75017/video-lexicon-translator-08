# Plan — Offre 47€ + 600 niches + EbookStudio V2 (révisé)

## 1. Offre exceptionnelle 47€ (jusqu'au 30 juin 2026)

**Scope** : uniquement sur `/promo/decouverte` (les autres pages gardent 67€).

**Bonus offerts** (47€ au lieu de 67€) :
- ✅ **Licence commerciale étendue** → lien vers `/licence-etendue`
- ✅ **Guide des 10 niches KDP rentables 2026** → lien vers `https://www.trafic-affiliation.com/niches_ebookstudio` (URL déjà utilisée dans `Guide10NichesBlock.tsx`)

> Les **600 niches** ne font PAS partie de l'offre — c'est une fonctionnalité produit accessible via la sidebar.

**Modifications dans `src/pages/promo/PromoDecouvertePage.tsx`** :
- Bandeau countdown jusqu'au 30 juin 2026 : "🎁 Offre fondateur — 47€ au lieu de 67€ — Plus que X jours".
- Bouton hero : `🚀 Démarrer maintenant — 47€ à vie`.
- Bloc PRICING : prix `47€` avec `67€` barré + badge `-30%`. Sous le prix, encart "2 bonus offerts" avec les 2 liens cliquables (Licence + 10 niches).
- CTA final : `🚀 Commander — 47€ à vie`.
- JSON-LD `offers.price` → `47`.
- Param URL passée au checkout : `/promo/commande?plan=fondateur47`.

**Mini hook countdown** intégré au composant (pas de fichier séparé).

## 2. Page dédiée "600 niches — Nouveauté Mai 2026"

**Nouvelle route** : `/niches-600`

**Fichiers créés** :
- `src/data/niches600.ts` — 600 entrées générées par templates déterministes (12 catégories × 50 niches), basé sur la structure de `bestSellers2026.ts`. Champs : `{ id, niche, sousNiche, motCleAmazon, bsrCible, concurrence, potentiel, exemplePrix, category }`. Aucun `Math.random` — valeurs calculées via formule (index + catégorie).
- `src/pages/Niches600Page.tsx` — UI :
  - Header "🆕 Nouveauté Mai 2026 — 600 niches KDP" + badge flashy animé (gradient orange→rose, pulse).
  - Filtres catégorie + recherche texte + tri (BSR/potentiel).
  - Grille paginée (50/page) + export CSV.

**Sidebar** (`MagazineSidebar.tsx` ou `modernSidebarSections.ts`) : nouvel item `600 Niches` avec badge `NEW` flashy (`bg-gradient-to-r from-[#FF9E2D] to-[#EC4899] text-white animate-pulse`), icône `Target`, lien `/niches-600`.

**Route** ajoutée dans `src/App.tsx`.

## 3. "EbookStudio V2" partout

- `useBrandTitle` (déjà installé) suffixe automatiquement le `<title>` de toutes les routes ✅.
- Logo texte dans `FunnelLayout`, sidebar header, et footers globaux → `EbookStudio V2`.

## Détails techniques

- Aucune migration DB, aucun edge function modifié.
- Stripe : pas de nouveau price créé pour l'instant — l'ancien checkout reste, l'offre 47€ est visuelle (la remise réelle sera appliquée par toi côté admin/paiement manuel, comme déjà géré dans `PaiementManuelPage`). Si tu veux un vrai checkout Stripe à 47€, je peux créer le price `fondateur_47` dans une étape suivante.
- Palette respectée (teal #008296, orange #FF9E2D).

## Ordre d'exécution

1. `/promo/decouverte` → offre 47€ + countdown + 2 bonus avec liens.
2. `src/data/niches600.ts` (data générée).
3. `Niches600Page.tsx` + route `/niches-600`.
4. Sidebar : item "600 Niches" badge NEW flashy.
5. Logo `EbookStudio V2` dans header/footer.
