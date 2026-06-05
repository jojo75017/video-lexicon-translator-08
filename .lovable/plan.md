## Objectif

Rendre **tous les modules de l'onglet « Publier »** fonctionnels et cliquables dans le cockpit V3, puis passer leur statut à « Fait ». Chaque module s'ouvre dans la fenêtre du cockpit (comme SCOUT, INTEL, etc.), en thème clair KDP. Aucun changement backend lourd : on réutilise les outils déjà codés et on construit les manquants côté front (IA via clé Gemini BYOK quand nécessaire).

## Liste des 12 modules Publier

```text
Déjà codé ailleurs → à BRANCHER (rapide)
  1. cover-pdf-exact      → réutilise KdpCoverStudio (page Couverture KDP)
  2. cockpit-audit-pilot  → réutilise KdpAmazonResearch (onglet "pilot")
  3. kdp-pack-zip         → réutilise lib downloadKdpPack + petite UI
  4. multi-format-express → réutilise exporters PDF/DOCX + petite UI

À CONSTRUIRE (nouveaux composants)
  5. prepub-checklist       → checklist 25 points cochable (déterministe)
  6. kindle-previewer       → aperçu rendu Kindle/tablette/phone (CSS)
  7. isbn-metadata          → gestionnaire ISBN/BISAC/catégories (formulaire + stockage)
  8. categories-manager-10  → 2 catégories optimales + préparation des 8 via support KDP
  9. back-matter-builder    → pages de fin (avis, "Du même auteur", bio + newsletter) via IA
 10. print-proof-checker    → contrôle bleed/gutter/dos/code-barres avant épreuve papier
 11. cover-variants-thumbnail → 6 variantes de couverture + test miniature 200×300 (IA image)
 12. translation-markets    → traduction/adaptation US/UK/DE/ES via IA
```

## Approche par module

**Branchements rapides (1 à 4).** On crée un composant léger dans `src/components/admin/` qui réutilise le composant/lib existant, puis on l'ajoute au cockpit. Pas de nouvelle logique métier.

**Nouveaux outils (5 à 12).** Chaque module = un composant autonome dans `src/components/admin/`, suivant le même patron visuel que `ListingOptimizer`/`LumenReadability` (Card, Tabs, Badge, tokens clairs teal #008296 / hover #FF9E2D). Les modules IA (back-matter, cover-variants, translation) utilisent la clé Gemini BYOK déjà en place (via `aiWritingService` / edge functions existantes), sans données simulées.

## Câblage cockpit (`src/pages/AdminCockpitPage.tsx`)

Pour chaque module : ajouter son `id` à la liste `clickable` (ligne ~400), ajouter une branche de rendu dans la fenêtre (ligne ~464+), et inclure son `id` dans la classe de largeur du `DialogContent` (large/scroll pour les outils riches).

## Statuts (`src/data/roadmapV3.ts`)

Passer les 12 modules Publier à `status: 'done'` au fur et à mesure de leur branchement effectif.

## Détails techniques

- Nouveaux fichiers : `src/components/admin/KdpPackExport.tsx`, `MultiFormatExport.tsx`, `PrepubChecklist.tsx`, `KindlePreviewer.tsx`, `IsbnMetadataManager.tsx`, `CategoriesManager10.tsx`, `BackMatterBuilder.tsx`, `PrintProofChecker.tsx`, `CoverVariantsThumbnail.tsx`, `TranslationMarkets.tsx`, et deux wrappers légers `CoverPdfExact.tsx`, `AuditPilotModule.tsx`.
- Réutilisation : `KdpCoverStudio`, `KdpAmazonResearch`, `downloadKdpPack`/`generateKdpPackZip`, `ebookPdfExporter`, `ebookDocxExporter`, `kdpCoverPdf`.
- IA : clé Gemini BYOK existante ; aucune nouvelle dépendance backend si possible (réutilise les edge functions déjà déployées).
- Persistance locale (ISBN, checklist, catégories) via `localStorage`, cohérent avec le reste du projet.
- Respect de la charte : pas de couleurs en dur hors tokens, thème clair KDP.

## Déroulé proposé (par lots, pour garder la qualité)

1. **Lot 1 — Branchements** : modules 1 à 4 (réutilisation), tests, statut « Fait ».
2. **Lot 2 — Outils déterministes** : 5, 6, 7, 8, 10 (sans IA).
3. **Lot 3 — Outils IA** : 9, 11, 12.

## Vérification

- Ouvrir `/admin-cockpit` en mode V3, colonne « Publier ».
- Chaque module est cliquable, s'ouvre, et son outil fonctionne (export ZIP/PDF, checklist, aperçu, IA…).
- Tous les modules Publier affichent le badge « Fait » (vert).
