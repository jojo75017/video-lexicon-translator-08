# Bugs trouvés dans l'audit du flow ebook-planner

J'ai retesté la page `/ebook-planner` après les corrections de tout à l'heure. Bonne nouvelle : la console est propre (zéro erreur applicative, juste 6 warnings inoffensifs de la lib Lovable externe sur `postMessage` cross-origin — non bloquants). La bannière jaune "Clé Gemini manquante" s'affiche bien et le modal d'onboarding aussi.

**Mais 3 bugs concrets restent à fixer.**

---

## Bug #1 — Bouton "Coller ma clé" envoie sur un tab inexistant

**Symptôme :** Quand l'utilisateur clique sur le bouton orange "Coller ma clé" dans la bannière jaune, l'appel `setActiveTab('settings')` est lancé… mais ce tab **n'existe pas** dans la page. Les vrais tabs sont `planner`, `workflow-dashboard`, `complete-workflow`, `projects`, `onboarding`, `writing`, etc. Résultat : le clic ne fait rien de visible, le scroll vers le champ ne se déclenche jamais.

**Fix :** Remplacer `setActiveTab('settings')` par `setActiveTab('planner')` dans le handler de `MissingApiKeyBanner` (dans `EbookPlannerPage.tsx`), et augmenter le délai du `setTimeout` de 250 → 350 ms pour laisser le temps au tab de se monter avant le scroll.

---

## Bug #2 — Toast "Clé API Gemini requise" dans le workflow auto trop sec

**Symptôme :** Quand l'utilisateur clique sur "Créer mon ebook (Workflow IA)" sans clé, il reçoit juste `toast.error('Clé API Gemini requise')` (ligne 810 de `EbookPlannerPage.tsx`). Pas de lien vers AI Studio, pas d'action pour ouvrir la bannière, pas de description. C'est l'inverse de ce qu'on a fait sur P1.

**Fix :** Aligner ce toast sur le pattern intelligent de P1 (description + action vers `aistudio.google.com/apikey` + duration 8000 ms).

---

## Bug #3 — Bannière jaune cachée sous le bandeau bienvenue

**Symptôme :** Sur le screenshot, la bannière jaune "Clé Gemini manquante" est partiellement masquée par le bandeau orange-pâle "👋 Bienvenue sur EbookStudio !" qui flotte au-dessus. L'œil ne capte pas immédiatement l'alerte — qui est pourtant la chose la plus importante.

**Fix :** Donner à `MissingApiKeyBanner` un `z-index` plus élevé que le bandeau de bienvenue, ou inverser l'ordre de rendu (mettre la bannière clé AVANT `FirstVisitBanner`).

---

## Vérifications faites (pas de bug)

- ✅ Console : aucune erreur React, aucun warning DialogTitle restant
- ✅ Modal `OnboardingGuide` charge bien avec son titre a11y invisible
- ✅ La bannière disparaît bien dès qu'une clé valide est saisie (logique conditionnelle OK)
- ✅ Le format `AIza` est validé côté Step 0 onboarding
- ✅ Aucune erreur edge function dans les logs récents (`editorial-director`, `check-admin` répondent normalement)

---

## Hors scope (à confirmer si tu veux qu'on les fasse aussi)

- Les **20+ autres agents** (`generate-content`, `editorial-memory`, `expert-writing`, `generate-cover-prompt`, etc.) appellent leurs edge functions avec le même pattern que P1. **Aucun n'a été migré au toast intelligent.** Si l'utilisateur lance P5 (rédaction), P12 (couverture) ou n'importe quel autre agent sans clé, il aura le même toast générique muet qu'avant. Faire le même fix pour tous serait propre, mais représente ~20 fichiers à toucher.
- Le `setActiveTab` du Step 0 onboarding redirige vers `/ebook-planner` qui ouvre le tab par défaut (workflow-dashboard) — pas le formulaire `planner`. À voir si on veut changer ça aussi.

## Plan d'action

Si tu approuves :
1. Fix bug #1 (1 ligne dans `EbookPlannerPage.tsx`)
2. Fix bug #2 (refactor du toast ligne 810)
3. Fix bug #3 (z-index ou réordonnancement)
4. **Optionnel** : étendre le toast intelligent aux ~20 autres agents (dis-moi si oui)

Dis "go" pour les 3 fixes critiques, ou "go + tous les agents" pour inclure aussi le point optionnel.
