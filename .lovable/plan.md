# V3 : passage à 2 forfaits (27 € et 47 €) + annuel

Objectif : remplacer les 3 forfaits actuels (9,99 € / 12,99 € / 59 €) par une offre simple à deux niveaux, sur le modèle system.io — mensuel ou annuel, et une frontière claire basée sur les onglets et modules débloqués.

## Les deux forfaits

| | **Plume** | **Maison d'Édition** |
|---|---|---|
| Mensuel | 27 €/mois | 47 €/mois |
| Annuel | 297 €/an (~2 mois offerts) | 497 €/an (~2 mois offerts) |
| Positionnement | J'écris et je publie mes livres | Je vends et je pilote un catalogue |

Noms alternatifs si « Plume » / « Maison d'Édition » ne te plaisent pas : **Auteur / Éditeur**, ou **Studio / Empire**. Un seul mot à changer dans le fichier de tarifs.

## Frontière entre les deux (par onglets et modules)

**Plume — 27 €/mois** — le parcours complet de création :
- Onglets : Plan, Écrire, Habiller
- Workflow de génération standard (jusqu'à 40 chapitres)
- Export PDF / DOCX / EPUB + sommaire propre
- Couverture base (recto + tranche + 4e)
- Import de manuscrit (DOCX / PDF / URL)
- Livre illustré maternelle (version standard)
- Traductions incluses
- Support email 24 h

**Maison d'Édition — 47 €/mois** — tout Plume, plus la vente et le pro :
- Onglets : Publier, Vendre, Audit ASIN, 600 Niches, Communauté
- Mode Recherche Approfondie (workflow renforcé)
- Cover Studio Pro (300 DPI, gabarits KDP)
- BD Studio Pro, Audiobook
- Amazon Spy / Mots-clés Amazon
- Sélection éditeurs, KDP Pilot renforcé
- Pack KDP prêt à publier (ZIP)
- Livre illustré maternelle version Pro
- Livres illimités
- Support prioritaire + coaching mensuel

## Affichage de la page tarifs

- Bascule Mensuel / Annuel en haut, avec badge d'économie affiché (« 2 mois offerts »).
- Deux cartes côte à côte, la carte 47 € marquée « Recommandé ».
- Tableau comparatif détaillé sous les cartes (onglet par onglet, coche / croix).
- Sur les outils verrouillés dans l'app : badge « Maison d'Édition » + lien vers la page tarifs.

## Détails techniques

1. `src/data/v3Pricing.ts` : remplacer les 3 entrées de `V3_PLANS` par 2 (`plume`, `edition`), avec `monthlyPrice` 27 / 47 et `yearlyPrice` 297 / 497. Mettre à jour `getV3PriceId` sur 4 identifiants : `v3_plume_monthly`, `v3_plume_annual`, `v3_edition_monthly`, `v3_edition_annual`.
2. `src/data/v3ToolPlans.ts` : le type passe de 3 à 2 niveaux. `EXPERT_MIN` et `PRO_ONLY` fusionnent en un seul ensemble « réservé Maison d'Édition » ; tout le reste est inclus dès Plume. `PLAN_META` et `isUnlockedForPlan` adaptés.
3. Produits et prix de paiement : créer les 4 prix récurrents (2 mensuels, 2 annuels) côté fournisseur de paiement, IDs stables réutilisés en test et en production.
4. Abonnement PayPal (`PayPalSubscribeButton.tsx`) : mettre à jour la table des plans pour les 4 nouveaux IDs.
5. Pages à mettre à jour : `V3ForfaitsPage.tsx`, `V3OffrePage.tsx`, `V3ComptePage.tsx`, `AdminPlansV3Page.tsx` — suppression de toute référence à Débutant / Expert / Auteur.
6. Droits d'accès (`useV3Entitlement.ts`) : mapper les anciens niveaux vers les nouveaux pour ne casser aucun accès existant (ancien Débutant/Studio → Plume, ancien Éditeur → Maison d'Édition, accès à vie 47 € → Maison d'Édition).

## Hors périmètre

- L'offre accès à vie 47 € (`/commander`) reste inchangée jusqu'au 30/09/2026. Ces abonnements ne démarrent qu'au 01/10/2026, conformément au flag de lancement V3.
- Aucun email ni campagne marketing dans ce lot : on cadre d'abord les tarifs et les droits d'accès.
