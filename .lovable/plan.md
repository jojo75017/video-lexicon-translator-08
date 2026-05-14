## Objectif

Rendre l'accès au choix du provider IA (Gemini / Claude / ChatGPT / OpenRouter + modèle) **impossible à manquer** depuis le workflow `/ebook-planner`, sans dupliquer la logique : un seul réglage global appliqué à tous les agents P1-P15.

## Constat

- Le panneau (`EbookSettingsPanel`) gère déjà parfaitement les 4 providers + sélecteur de modèle OpenRouter + test de clé.
- Il s'ouvre via le bouton flottant rond `ApiKeysFloatingButton` (bas-droite, blanc/teal). Trop discret → l'abonné ne le voit pas.

## Plan (UI uniquement, aucune logique métier touchée)

### 1. Bouton flottant beaucoup plus voyant
Fichier : `src/components/ebook/ApiKeysFloatingButton.tsx`
- Fond **orange KDP `#FF9E2D`** plein (au lieu de blanc), texte blanc, ombre forte, pulsation lente (`animate-pulse` discret) tant que **aucune clé n'est encore configurée**.
- Label toujours visible (plus de `hidden sm:inline`) : **« Choisir mon IA · Clés API »**.
- Petite pastille verte « ✓ Gemini » / « ✓ Claude » / « ✓ OpenRouter (Claude Sonnet 4) » qui s'affiche dès qu'une clé valide est détectée → l'abonné voit en un coup d'œil quel provider+modèle est actif.
- Repositionné un peu plus haut (bottom-32) pour ne pas chevaucher l'EbookbotFloatingButton.

### 2. Bandeau d'état dans `/ebook-planner`
Nouveau petit composant `WorkflowAIProviderBadge.tsx` posé **en haut du Planner**, juste sous le titre :

```text
[ IA active : OpenRouter — Claude Sonnet 4   |  ⚙ Changer ]
```

- Couleur teal `#008296` si une clé valide est configurée, **rouge doux** + texte « ⚠ Aucune IA configurée — cliquez pour choisir » sinon.
- Le bouton « ⚙ Changer » ouvre le **même** `EbookSettingsPanel` (Dialog) → zéro duplication.
- Lecture seule : utilise `getProvider()`, `getProviderKey()`, `getOpenRouterModel()` déjà exportés par `aiWritingService.ts`.

### 3. Onboarding 1ʳᵉ visite (léger)
- Si `localStorage.ai_writing_provider` est absent **et** aucune clé n'est trouvée → afficher un toast persistant (sonner, durée infinie, action « Configurer ») au montage du Planner. Disparaît dès qu'une clé est validée.

### 4. Choix du modèle = global (déjà OK)
Conformément à ta réponse : **un seul modèle OpenRouter** pour tout le workflow. Aucun changement nécessaire dans `aiWritingService.ts` ni `geminiService.ts` — le routage global est déjà en place.

## Fichiers touchés

- `src/components/ebook/ApiKeysFloatingButton.tsx` (refonte visuelle + état actif)
- `src/components/ebook/WorkflowAIProviderBadge.tsx` (nouveau, ~60 lignes)
- `src/pages/EbookPlannerPage.tsx` (ou le composant racine du Planner) : ajout du `<WorkflowAIProviderBadge />` en tête + toast d'onboarding
- Aucune migration, aucune edge function, aucune dépendance ajoutée.

## Résultat attendu

Sur `/ebook-planner`, l'abonné voit immédiatement :
1. En haut : un badge teal qui dit quelle IA va être utilisée (ex. « OpenRouter — Claude Sonnet 4 »).
2. En bas-droite : un gros bouton orange « Choisir mon IA · Clés API » qui pulse tant qu'aucune clé n'existe.
3. Un clic → panneau complet avec choix Gemini/Claude/ChatGPT/**OpenRouter + sélecteur de modèle** + test de clé.
