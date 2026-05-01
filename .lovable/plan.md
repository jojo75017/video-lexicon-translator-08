## Résultat de l'audit /ebook-planner

### Ce qui fonctionne bien

- **Chargement de la page** : OK (~3s, sidebar + hero + workflow)
- **Vue Kanban des 5 piliers** : Préparer (8) / Améliorer (9) / Produire (6) / Publier (6) / Vendre (2) — total 31 outils
- **Les 15 agents P1-P15** sont bien présents et organisés visuellement
- **Onboarding "1er ebook"** s'affiche correctement (modal 3 étapes)
- **Auto-save** fonctionne (badge "Sauvé il y a 26s")
- **Chargement projet existant** : "Le Secret du Locataire 2026" + 24 projets en historique
- **Navigation P1** : ouvre bien l'écran Directeur Éditorial avec champ titre prérempli
- **Aucune erreur JS bloquante** dans la console

### Bug CRITIQUE identifié (lancement demain)

**P1 (et tous les agents Gemini) échouent silencieusement** quand la clé API n'est pas configurée :

- L'edge function `editorial-director` répond **HTTP 400** avec le message : `"Clé API Gemini requise. Configurez votre clé dans Paramètres > Clés API."`
- Côté UI : **aucun toast, aucune alerte, aucune redirection**. L'utilisateur clique "Lancer l'analyse" → rien ne se passe → il pense que le site est cassé.
- **Impact** : 100% des nouveaux acheteurs 67€ vont vivre cet écran cassé à leur tout premier essai.

### Warnings mineurs (non bloquants)

- `DialogContent requires a DialogTitle` (a11y, sur un Dialog Radix — probablement EbookbotChat ou onboarding)
- `Safety timer triggered – forcing auth check complete` (déjà documenté, fallback SubscriberGate)
- `postMessage` cross-origin warnings : iframe Lovable preview seulement, n'apparaîtra pas en prod

## Plan de correction (à exécuter avant publication)

### 1. Gérer le 400 BYOK côté front (PRIORITÉ ABSOLUE)

Dans le hook qui appelle `editorial-director` (probablement `src/hooks/useEbookGeneration.ts` ou un sous-composant agent dans `src/components/ebook/`) :

- Catch le `response.error` quand le message contient "Clé API Gemini requise"
- Afficher un **toast destructif** explicite : "Clé Gemini manquante — configurez-la pour lancer P1"
- Ajouter un **CTA dans le toast** ou une **modale** : "Configurer ma clé →" qui ouvre directement l'onglet Paramètres / API Keys
- Faire pareil pour les **autres edge functions IA** qui suivent le même pattern BYOK (P2 marché, P3 architecte, P4 rédaction, etc.) — recensement nécessaire

### 2. Onboarding "première utilisation" : pré-vérifier la clé

Dans `FirstEbookOnboarding.tsx` ou avant le bouton "Démarrer (étape P1)" du workflow :

- Si l'utilisateur n'a pas de clé Gemini en localStorage / DB → afficher une **étape 0 obligatoire** : "Avant de créer ton 1er ebook, configure ta clé Gemini gratuite (2 min)" + lien vers `/Guide_Cle_Gemini_API.pdf` déjà présent dans `/public/`
- Bloquer le CTA "Créer mon ebook" tant que la clé n'est pas saisie

### 3. Banner global "clé manquante" dans EbookPlannerPage

Dans `src/pages/EbookPlannerPage.tsx` :

- En haut de page, si pas de clé → bandeau orange persistant : "⚠️ Configure ta clé Gemini pour activer les 15 agents IA — [Configurer maintenant]"

### 4. Corriger le warning a11y DialogContent (optionnel)

Identifier le Dialog sans `DialogTitle` (probablement `EbookbotChat.tsx` ou similaire) et wrapper le titre avec `VisuallyHidden` de Radix.

## Hors scope (post-lancement)

- Test exhaustif d'exécution des 14 autres agents (P2 → P15) — bloqué tant que P1 n'a pas validé une réponse Gemini réelle
- Refonte de la page Paramètres / Clés API
- Suppression du warning `Safety timer` (déjà connu, mémorisé)

## Question rapide

Veux-tu que je :
- **A)** Applique seulement la correction #1 (toast + redirection) — minimum vital pour ne pas perdre les ventes demain
- **B)** Applique #1 + #2 + #3 (parcours BYOK complet et bloquant) — recommandé pour un vrai lancement pro
- **C)** Applique tout (#1 à #4)

Dis-moi A, B ou C et je passe en mode build.