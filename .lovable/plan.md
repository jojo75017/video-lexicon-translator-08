

# Plan de correction — Accès EbookPlanner + Nettoyage final

L'ISBN n'est pas nécessaire pour publier sur KDP (Amazon le génère automatiquement). On le met de côté sans risque.

## Corrections à appliquer

### 1. Bug bloquant : accès à /ebook-planner
**Cause** : `handleLogout` et `handleAuthenticated` dans `App.tsx` ne sont pas mémorisés avec `useCallback`. À chaque rendu, une nouvelle référence est créée, ce qui relance le `useEffect` du `SubscriberGate` en boucle et finit par déclencher `onInvalid()` → déconnexion.

**Correction** :
- Envelopper `handleLogout` dans `useCallback`
- Envelopper `handleAuthenticated` dans `useCallback`

### 2. Dernières données factices (Math.random)

| Fichier | Action |
|---------|--------|
| `KdpKeywordResearchPage.tsx` | Remplacer les `Math.random()` (volume, difficulté, CPC, trend, intent) par un appel Lovable AI qui estime ces métriques à partir du mot-clé |
| `SpecializedAmazonPreview.tsx` | Remplacer rating/reviews/BSR aléatoires par des valeurs fixes réalistes (ex: 4.5 étoiles, "Nouveau") au lieu de simuler |

### 3. Fichiers orphelins à supprimer
- `src/services/dataForSeoService.ts` — service SEO externe non utilisé
- `src/pages/SeoPage.tsx` — page SEO complète non référencée dans App.tsx

### 4. Typographie française pour les exports
- Créer `src/utils/frenchTypography.ts` avec :
  - Guillemets français `« texte »`
  - Espaces insécables avant `: ; ! ?`
  - Apostrophes typographiques
- Intégrer dans `docxExportEngine.ts` et les exports PDF

## Fichiers modifiés
- `src/App.tsx` — useCallback sur handleLogout/handleAuthenticated
- `src/pages/KdpKeywordResearchPage.tsx` — IA au lieu de random
- `src/components/ebook/SpecializedAmazonPreview.tsx` — valeurs fixes
- Nouveau : `src/utils/frenchTypography.ts`
- Supprimés : `dataForSeoService.ts`, `SeoPage.tsx`

