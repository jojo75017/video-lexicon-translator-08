

## Diagnostic

Deux problèmes distincts dans les onglets **Description** et **Mots-clés** :

### 1. Description Magnet (`generate-kdp-description`)
- Utilise **ta clé Gemini personnelle (BYOK)**.
- Si la clé est absente, expirée ou invalide → 400 "Clé API Gemini requise".
- Si Gemini renvoie du JSON mal formé → fallback silencieux mais l'utilisateur ne sait pas pourquoi.

### 2. Mots-clés (3 onglets : Recherche, Longue traîne, Backend 7)
- Utilise la **clé serveur** `GEMINI_API_KEY` via `generate-content` (PAS la clé BYOK).
- Le frontend affiche un toast **générique** : *"Impossible de générer les mots-clés. Réessayez."* — qui masque la vraie cause (quota, timeout, JSON tronqué, clé serveur manquante).
- Incohérence avec le reste du projet qui est en BYOK.

## Plan de correction

### A. Aligner les 3 onglets mots-clés sur le BYOK (cohérence projet)
- `KdpKeywordResearchPage.tsx` : lire `userGeminiKey` via `useOpenAIConfig()` et l'envoyer dans `body.userApiKey`.
- `generate-content/index.ts` : pour les 3 types `kdp-keyword-research`, `kdp-longtail`, `kdp-backend-keywords`, accepter et utiliser `userApiKey` en priorité (fallback serveur si vide).

### B. Remonter les vraies erreurs au lieu d'un toast générique
- Frontend : afficher le message réel renvoyé (`error.message` ou `data.error`) au lieu de "Impossible de générer".
- Edge function : structurer la réponse d'erreur avec `{ error, stage, details }` pour diagnostiquer (timeout vs 429 vs JSON invalide vs clé absente).

### C. Robustifier le parsing JSON
- Côté serveur : si Gemini renvoie un JSON tronqué (max tokens atteints), retenter une fois avec `maxOutputTokens` plus élevé OU renvoyer un message clair "Réponse tronquée, simplifie ta niche".
- Côté client : déjà un `safeParseJsonArray` mais améliorer le message d'échec pour guider l'utilisateur.

### D. Vérifier la config de la clé Gemini utilisateur
- Sur `EbookDescriptionMagnet.tsx` : si `userGeminiKey` est vide, afficher un encart clair *"Configurez votre clé Gemini dans Paramètres"* AVANT le bouton, plutôt qu'attendre l'erreur 400.

## Fichiers modifiés
- `src/pages/KdpKeywordResearchPage.tsx` (BYOK + meilleurs messages d'erreur + check clé)
- `src/components/ebook/EbookDescriptionMagnet.tsx` (encart pré-check clé + affichage erreur réelle)
- `supabase/functions/generate-content/index.ts` (accepter `userApiKey`, retours d'erreur structurés sur les 3 types KDP)

## Ce que je ne touche pas
- Les autres types de `generate-content` (kdp-analytics, etc.) — pas concernés par le bug.
- Le design visuel — uniquement la logique d'erreur et BYOK.

