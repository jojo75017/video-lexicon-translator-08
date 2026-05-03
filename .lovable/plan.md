# Pourquoi le workflow est galère et pourquoi P1 ne propose pas de titres percutants

## Diagnostic

En lisant `supabase/functions/editorial-director/index.ts` + `EbookEditorialDirector.tsx`, j'ai identifié 3 causes concrètes :

1. **P1 demande bien 5 titres alternatifs** (`suggestionsTitle`) avec score KDP, mais :
   - Le `maxOutputTokens` est à 4500 alors que le prompt système est très long et qu'on demande beaucoup de champs JSON. Résultat : la réponse Gemini est souvent **tronquée**, le JSON casse, et le fallback `catch` renvoie `suggestionsTitle: []` (donc 0 titre affiché).
   - La `temperature` à 0.6 est faible : les 5 titres se ressemblent et sont peu créatifs.
   - Le prompt n'oblige pas Gemini à proposer des titres *différents* du titre saisi (il peut renvoyer le même reformulé).
   - Aucune validation de longueur min des `suggestionsTitle` (si Gemini en renvoie 2, on garde 2).

2. **L'utilisateur ne sait pas ce qui s'est passé** quand les titres n'apparaissent pas : pas de message « réponse incomplète, relance ». Le toast dit juste « Analyse terminée ».

3. **Le workflow global est confus** :
   - P1 vit dans un onglet, mais la liste des titres alternatifs n'est jamais "appliquée" globalement (pas de bouton « adopter ce titre pour tout le projet » lié à P2/P3).
   - Pas de raccourci visible depuis le Dashboard pour passer P1 → P3 une fois qu'un meilleur titre est choisi.

## Ce que je vais faire

### 1. Fiabiliser P1 (`supabase/functions/editorial-director/index.ts`)
- Augmenter `maxOutputTokens` à 8000 et `temperature` à 0.85 (créativité titres).
- Raccourcir et durcir le prompt système : forcer **exactement 5 suggestions DIFFÉRENTES du titre saisi**, dans 5 angles distincts (bénéfice chiffré, urgence, méthode/promesse, transformation, contre-intuitif).
- Ajouter une auto-relance côté serveur : si après parse on a < 3 `suggestionsTitle`, relancer un mini-prompt dédié uniquement aux 5 titres et fusionner.
- Réponse JSON forcée via `responseMimeType: "application/json"` dans `generationConfig` (Gemini supporte) → moins de markdown parasite.

### 2. Améliorer le retour UX dans `EbookEditorialDirector.tsx`
- Si `suggestionsTitle.length < 3` après l'appel : toast warning « Liste incomplète, relance auto » + un retry automatique (1 fois).
- Bouton **« Régénérer 5 nouveaux titres »** dédié (sans relancer toute l'analyse) qui appelle P1 avec un flag `onlyTitles: true`.
- Bouton **« Adopter ce titre »** (déjà présent via `useTitle`) reste, mais on rend visible le titre actuellement adopté en haut.

### 3. Lisser le workflow
- Dans `WorkflowDashboard.tsx`, ajouter un bandeau guidé en haut quand `P1` est complété mais pas `P2` : « Étape suivante : Analyse de marché → ».
- Dans `WorkflowStepWrapper`, ajouter un récap mini-sticky du titre courant (`ebookTitle`) pour que l'utilisateur sache toujours sur quel livre il travaille.

## Détails techniques

- Edge function : ajout du paramètre optionnel `onlyTitles` qui bypass tout le reste et renvoie uniquement `{ suggestionsTitle: [...] }` avec un prompt dédié plus court (donc plus rapide et plus fiable).
- Côté front : nouveau state `isRegeneratingTitles`, et `regenerateTitles()` qui mute uniquement `analysis.suggestionsTitle` sans détruire le reste.
- Validation serveur : si parse réussit mais `suggestionsTitle.length < 5`, on appelle en interne le sous-prompt titres et on complète. Pas de retry infini (max 1).

## Fichiers modifiés
- `supabase/functions/editorial-director/index.ts`
- `src/components/ebook/EbookEditorialDirector.tsx`
- `src/components/ebook/WorkflowDashboard.tsx` (petit bandeau guide)
- `src/components/ebook/WorkflowStepWrapper.tsx` (sticky titre courant)

Aucune migration DB. Aucun nouveau secret. Compatible BYOK Gemini existant.
