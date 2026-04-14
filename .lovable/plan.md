

# Audit Final — Ce qu'il reste à faire

## Problème immédiat : toujours bloqué sur /subscription

Vous êtes redirigé vers `/subscription` au lieu d'accéder à `/ebook-planner`. Les corrections `useCallback` ont été appliquées dans `App.tsx` (lignes 189-203), donc le bug de boucle est corrigé. Le problème restant est que le `SubscriberGate` appelle `onInvalid()` car la validation backend échoue (edge function `validate-subscription` rejette la requête ou timeout). Il faut ajouter un fallback : si l'utilisateur a des données subscriber valides en localStorage ET que l'edge function échoue par erreur réseau/timeout, on autorise l'accès temporairement au lieu de déconnecter.

## Pages et services orphelins à supprimer (non référencés dans App.tsx)

| Fichier | Raison |
|---------|--------|
| `src/pages/CrawlerPage.tsx` | Orphelin, Math.random partout |
| `src/pages/CompetitorAnalysisPage.tsx` | Orphelin, Math.random partout |
| `src/pages/TitleGeneratorPage.tsx` | Orphelin, Math.random pour les métriques |
| `src/pages/SerpGenerator.tsx` | Orphelin, Math.random partout |
| `src/pages/EmailMarketingPage.tsx` | Orphelin, utilise emailGeneratorService |
| `src/services/realCompetitorAnalysisService.ts` | Orphelin (uniquement utilisé par CompetitorAnalysisPage) |
| `src/services/serpApiService.ts` | Orphelin (authority = Math.random) |
| `src/services/contentQualityService.ts` | Orphelin (uniqueness = Math.random) |
| `src/services/imageGeneratorService.ts` | Orphelin (aucun import) |
| `src/services/emailGeneratorService.ts` | Orphelin (uniquement EmailMarketingPage) |
| `src/services/titleGeneratorService.ts` | Orphelin (aucun import dans App.tsx) |
| `src/utils/competitorAnalysisUtils.ts` | Orphelin (uniquement CompetitorAnalysisPage) |

## Math.random légitimes (à garder)

Ces usages sont correctement utilisés et ne simulent pas de fausses données :
- `EbookPlannerPage.tsx` : génération d'ID unique pour chapitres dupliqués
- `CoverDesignEditor.tsx` : génération d'ID pour éléments visuels
- `AudiobookLibrary/Publisher` : génération de noms de fichiers uniques
- `EbookExporter.tsx` : génération d'ID EPUB
- `EbookRecipeBookGenerator.tsx` : shuffle Fisher-Yates pour varier les recettes
- `EbookColoringBookGenerator.tsx` : shuffle pour varier les sujets
- `EbookTravelGuideGenerator.tsx` : shuffle pour varier les destinations
- `TokenCounter.tsx` : animation visuelle
- `FormationQuiz.tsx` : animation confetti
- `SpotsCounter.tsx` : animation marketing (page de vente)
- `LiveActivityNotifications.tsx` : notifications marketing (page de vente)
- Edge functions (start-trial, stripe-webhook, add-subscriber) : génération de codes

## Math.random problématique restant (composant actif)

| Fichier | Problème |
|---------|----------|
| `EbookAmazonSimulator.tsx` | ASIN simulé `B0{Math.random()}`, taille fichier random, date review random |

Ce composant EST utilisé dans la sidebar du planner. Les données factices doivent être remplacées par des valeurs fixes réalistes.

## Plan d'exécution

### 1. Corriger le SubscriberGate (accès /ebook-planner)
Ajouter un fallback réseau : si `validate-subscription` échoue par timeout/erreur réseau (pas par rejet explicite), autoriser l'accès temporaire si les données localStorage sont complètes et valides.

### 2. Supprimer ~12 fichiers orphelins
Pages et services listés ci-dessus qui ne sont référencés nulle part dans le routeur.

### 3. Nettoyer EbookAmazonSimulator.tsx
Remplacer l'ASIN random par un ASIN fixe basé sur le titre, la taille fichier par un calcul basé sur le nombre de pages, et la date de review par une date fixe.

### Fichiers modifiés
- `src/components/auth/SubscriberGate.tsx` — fallback réseau
- `src/components/ebook/EbookAmazonSimulator.tsx` — valeurs fixes
- Supprimés : 12 fichiers orphelins (pages + services)

