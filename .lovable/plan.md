# V3 : baisse des tarifs — Plume 17 € et Édition 27 €

Les tarifs actuels (29 € / 49 €) sont jugés trop élevés. On les remplace définitivement par une grille plus accessible, mensuelle et annuelle.

## Nouvelle grille

| | **Plume** | **Édition** |
|---|---|---|
| Mensuel | 17 €/mois | 27 €/mois |
| Annuel | 170 €/an (2 mois offerts) | 270 €/an (2 mois offerts) |
| Livres | 30 livres / mois | Livres illimités |
| Positionnement | J'écris et je publie | Je publie en pro et je vends |

Le contenu des forfaits ne change pas : même socle complet pour les deux, Édition ajoute la version pro des outils (Recherche Approfondie, Cover Studio Pro, BD Studio Pro, audiolivre pro, Amazon Spy avancé, pack KDP) et inclut les upsells.

## Affichage

- Bascule Mensuel / Annuel avec badge « 2 mois offerts ».
- Mention « Nouveaux tarifs » sur la page forfaits, sans prix barré (ce sont les tarifs définitifs, pas une promo à durée limitée).
- Bandeau global V3 mis à jour : plus de « 9,99 € · 12,99 € · 59 € », on annonce « Plume 17 € · Édition 27 € ».
- La remise fidélité −20 % des acheteurs V2 continue de s'appliquer sur ces nouveaux prix (13,60 € et 21,60 €/mois).

## Détails techniques

1. `src/data/v3Pricing.ts` : `monthlyPrice` 17 / 27, `yearlyPrice` 170 / 270. `getYearlySavingsPercent` / `…Amount` restent inchangés (calculés).
2. Prix côté fournisseur de paiement : recréer les 4 prix récurrents sur les **mêmes identifiants** (`v3_plume_monthly`, `v3_plume_annual`, `v3_edition_monthly`, `v3_edition_annual`) avec les nouveaux montants — l'ID reprend automatiquement la clé de recherche, aucun changement de code de checkout n'est nécessaire.
3. Variantes legacy V2 (−20 %) : recréer de même `v3_plume_monthly_legacy`, `v3_plume_annual_legacy`, `v3_edition_monthly_legacy`, `v3_edition_annual_legacy` (13,60 € / 136 € / 21,60 € / 216 €).
4. `supabase/functions/paypal-subscribe/index.ts` : mettre à jour la table de plans (`plume` 17/170, `edition` 27/270). Le cache `paypal_plan_cache` étant indexé par montant/intervalle, les nouveaux plans PayPal seront créés à la première souscription.
5. Textes en dur à corriger : `src/components/V3LaunchGlobalBanner.tsx` (mentionne encore 9,99 / 12,99 / 59 €), puis balayage des pages `V3ForfaitsPage.tsx`, `V3OffrePage.tsx`, `V3ComptePage.tsx`, `V3MigrationPage.tsx`, `AdminPlansV3Page.tsx` et des composants d'upsell qui affichent « Éditeur 59 € » pour aligner sur « Édition 27 € ».
6. Mémoire projet : mettre à jour la règle de tarification V3 pour éviter tout retour aux anciens montants.

## Hors périmètre

- L'offre accès à vie 47 € (`/commander`) reste inchangée jusqu'au 30/09/2026.
- Aucun email ni campagne d'annonce dans ce lot : on fige d'abord la grille.
