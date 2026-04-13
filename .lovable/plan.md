
# Rapport d'Amélioration — Générateur d'Ebooks

## Ce qui fonctionne parfaitement (acquis solides)
- Workflow IA 15 agents (P1-P15) complet et fonctionnel
- Sidebar organisée en 5 catégories claires
- Export PDF/DOCX/EPUB + Calibre
- Formats KDP spécialisés (Atlas, Encyclopédie, Coloriage, Documentaire)
- Couverture IA + 4e de couverture + Éditeur visuel
- Sauvegarde auto (60s) + sauvegarde cloud
- Traduction multi-langues, personnages, séries
- Checklist KDP pré-publication
- Audio / Audio Express
- Plan de lancement + Marketing

---

## Problèmes concrets à corriger

### 1. Composants avec données factices (Math.random) encore présents

Ces fichiers existent dans le dossier `src/components/ebook/` mais ne sont **pas** dans la sidebar ni utilisés dans EbookPlannerPage. Ils sont orphelins et doivent être supprimés :

| Fichier | Problème |
|---------|----------|
| `EbookCompetitorDashboard.tsx` | Prix, BSR, reviews = Math.random() |
| `EbookBsrTracker.tsx` | Classements BSR simulés par Math.random() |
| `EbookAmazonAdsSimulator.tsx` | Mots-clés et CPC simulés |
| `EbookPlagiarismValidator.tsx` | Scores de similarité = Math.random() |
| `SpecializedAmazonPreview.tsx` | Rating, reviews, BSR = Math.random() |
| `EbookCompetitorSpy.tsx` | Orphelin |
| `EbookAdvancedFeatures.tsx` | Que des "coming soon" |
| `EbookAnalyticsDashboard.tsx` | Orphelin |
| `EbookPublicationPlanner.tsx` | Orphelin |
| `EbookRoyaltyDashboard.tsx` | Orphelin |
| `EbookKdpExplosiveSimulator.tsx` | Orphelin |
| `EbookKdpRevenueSimulator.tsx` | Orphelin |
| `EbookVideoCreator.tsx` | Orphelin |
| `EbookVideoTrailer.tsx` | Orphelin |
| `EbookLandingPageGenerator.tsx` | Orphelin |
| `EbookDirectSales.tsx` | Orphelin |
| `EbookSeoArticleGenerator.tsx` | Orphelin |
| `EbookTrendPredictor.tsx` | Orphelin |
| `EbookPublishedBooksDashboard.tsx` | Orphelin |
| `EbookKdpAnalytics.tsx` | Orphelin |

**Action** : Supprimer ces ~20 fichiers orphelins qui alourdissent le projet sans rien apporter.

### 2. Fallbacks Math.random dans les composants ACTIFS

Ces composants sont dans la sidebar mais ont des fallbacks factices quand l'IA échoue :

| Composant | Problème |
|-----------|----------|
| `EbookABTesting.tsx` | `simulateAnalysis()` génère des scores random (ligne 155-160) |
| `EbookArcManager.tsx` | Fallback titre = score random (ligne 248) |
| `EbookBetaReaderHub.tsx` | Lecteur random parmi la liste |

**Action** : Remplacer les fallbacks par un message d'erreur clair ("Analyse impossible, vérifiez votre clé API") au lieu de fausses données.

### 3. EbookPlannerPage.tsx = 3149 lignes (monolithe)

Fichier trop gros, difficile à maintenir. Contient tout : état, effets, rendu de ~40 onglets.

**Action** : Extraire le `renderContent()` (switch de ~1000 lignes) dans un fichier séparé `EbookContentRenderer.tsx` + extraire la logique d'état dans un hook `useEbookPlannerState.ts`.

### 4. UX — Points de friction identifiés

| Problème | Solution |
|----------|----------|
| Pas de message d'accueil clair quand on arrive la première fois | Ajouter un écran "Bienvenue" simple avec 3 choix : Workflow IA / Formulaire manuel / Mes projets |
| L'onglet "Planner" (formulaire manuel) est dense et intimidant | Ajouter des tooltips sur chaque champ + regrouper visuellement |
| Quand un onglet n'existe pas → message "Onglet non disponible" sans contexte | Améliorer le fallback avec suggestion du bon onglet |
| Deux admin links dans la sidebar (admin + admin-panel) pointent vers la même page | Supprimer le doublon |

### 5. Typographie française dans les exports

Les exports PDF/DOCX n'appliquent pas les règles typographiques françaises automatiquement.

**Action** : Ajouter un utilitaire `frenchTypography.ts` qui convertit automatiquement :
- `"texte"` → `« texte »`
- Espace insécable avant `:`, `;`, `!`, `?`
- Apostrophes typographiques

---

## Plan d'exécution (par priorité)

1. **Supprimer les ~20 fichiers orphelins** — Nettoyage immédiat, 0 risque
2. **Corriger les 3 fallbacks random actifs** — Remplacer par messages d'erreur clairs
3. **Supprimer le doublon admin** dans la sidebar
4. **Refactorer EbookPlannerPage.tsx** — Extraire renderContent + état
5. **Typographie française** dans les exports

## Détails techniques

- Fichiers à supprimer : ~20 composants non référencés dans la sidebar ni dans EbookPlannerPage
- Fichiers à modifier : `EbookABTesting.tsx`, `EbookArcManager.tsx`, `ModernSidebar.tsx`, `EbookPlannerPage.tsx`
- Nouveau fichier : `src/utils/frenchTypography.ts`
