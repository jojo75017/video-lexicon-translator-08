# V3 : passage à 2 forfaits (29 € et 49 €) + annuel

Objectif : remplacer les 3 forfaits actuels (9,99 € / 12,99 € / 59 €) par une offre simple à deux niveaux, sur le modèle system.io — mensuel ou annuel, avec 2 mois offerts sur l'annuel.

## Les deux forfaits

| | **Plume** | **Édition** |
|---|---|---|
| Mensuel | 29 €/mois | 49 €/mois |
| Annuel | 290 €/an (2 mois offerts) | 490 €/an (2 mois offerts) |
| Livres | 30 livres / mois | Livres illimités |
| Positionnement | J'écris et je publie | Je publie en professionnel et je vends |

## Principe : même socle pour tous, le 49 € va plus loin

Les deux forfaits donnent accès à **tous les outils de la V2** — aucun onglet fondamental n'est amputé. **L'audiolivre est inclus dans les deux.** Le 49 € n'est pas « plus d'outils » mais **la version professionnelle** de ces outils, plus les upsells inclus.

**Plume — 29 €/mois — socle complet :**
- Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre
- 30 livres / mois
- Workflow de génération standard
- Export PDF / DOCX / EPUB + sommaire propre
- Couverture (recto + tranche + 4e)
- Audiolivre inclus
- Import de manuscrit (DOCX / PDF / URL)
- Livre illustré maternelle
- Traductions incluses
- Support email 24 h

**Édition — 49 €/mois — tout Plume, en version pro + upsells inclus :**
- Livres illimités
- Mode Recherche Approfondie (workflow renforcé, sources élargies)
- Cover Studio Pro (300 DPI, gabarits KDP, variantes)
- Audiolivre version pro (voix premium, chapitrage, export long)
- BD Studio Pro
- Amazon Spy / Audit ASIN / Mots-clés Amazon en version avancée
- Pack KDP prêt à publier (ZIP) + checklist pré-publication
- Livre illustré maternelle version Pro
- Upsells inclus (au lieu d'être payants à l'unité) : BookPerfect AI, sélection éditeurs, relecture IA premium, packs marketing
- Support prioritaire + coaching mensuel

## Affichage de la page tarifs

- Bascule Mensuel / Annuel en haut, badge « 2 mois offerts » sur l'annuel.
- Deux cartes côte à côte, la carte 49 € marquée « Recommandé ».
- Message clair : « Tous les outils dans les deux forfaits. Édition ajoute la puissance pro et les upsells inclus. »
- Tableau comparatif sous les cartes : ligne par outil, avec mention « standard » / « pro » plutôt que coche/croix, pour ne pas donner l'impression d'un forfait amputé.
- Sur les fonctions pro dans l'app : badge « Version Pro — Édition » + lien vers la page tarifs (jamais de blocage total d'un onglet).

## Détails techniques

1. `src/data/v3Pricing.ts` : remplacer les 3 entrées de `V3_PLANS` par 2 (`plume`, `edition`), `monthlyPrice` 29 / 49, `yearlyPrice` 290 / 490, `booksPerMonth` 30 / null. `getV3PriceId` renvoie 4 identifiants : `v3_plume_monthly`, `v3_plume_annual`, `v3_edition_monthly`, `v3_edition_annual`.
2. `src/data/v3ToolPlans.ts` : le type passe à 2 niveaux (`plume` | `edition`). `EXPERT_MIN` disparaît (tout devient inclus dès Plume). `PRO_ONLY` est réduit aux seules fonctions réellement pro (Cover Studio Pro, BD Studio Pro, Recherche Approfondie, upsells inclus) — `audiobook` en sort puisqu'il est inclus partout. `PLAN_META` et `isUnlockedForPlan` adaptés.
3. Gating par niveau de fonctionnalité : introduire une notion « standard / pro » pour les outils partagés (audiolivre, couverture, Amazon Spy) plutôt qu'un accès binaire, afin que Plume garde une version utilisable.
4. Prix côté fournisseur de paiement : créer les 4 prix récurrents (29 €/mois, 290 €/an, 49 €/mois, 490 €/an) avec des IDs stables identiques en test et en production, et le code fiscal adapté (service numérique).
5. `supabase/functions/v3-subscription-checkout/index.ts` : mettre `ALLOWED_PRICES` à jour avec les 4 nouveaux IDs, retirer les anciens (`v3_auteur_*`, `v3_expert_*`).
6. `src/components/v3/PayPalSubscribeButton.tsx` et la fonction `paypal-subscribe` : mapper les 4 nouveaux plans.
7. Pages à mettre à jour : `V3ForfaitsPage.tsx`, `V3OffrePage.tsx`, `V3ComptePage.tsx`, `AdminPlansV3Page.tsx` — plus aucune référence à Débutant / Expert / Auteur.
8. Droits d'accès (`useV3Entitlement.ts`) : mapper l'existant vers les nouveaux niveaux pour ne casser aucun accès (anciens Débutant / Studio → Plume, ancien Éditeur → Édition, accès à vie 47 € → Édition).

## Hors périmètre

- L'offre accès à vie 47 € (`/commander`) reste inchangée jusqu'au 30/09/2026. Les abonnements ne démarrent qu'au 01/10/2026, conformément au flag de lancement V3.
- Aucun email ni campagne marketing dans ce lot : on cadre d'abord les tarifs, les paliers et les droits d'accès.
