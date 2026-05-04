# Diagnostic — pourquoi le workflow paraît cassé

En lisant `EbookPlannerPage.tsx`, `WorkflowDashboard.tsx` et `TrelloBoardView.tsx` :

1. La vue par défaut est **Kanban (Trello)** (`localStorage.ebook_view_mode` défaut `'trello'`, ligne 279). Or `TrelloBoardView` n'affiche **aucun champ** titre / sous-titre / auteur / intro / catégorie / chapitres : juste les cartes d'agents. → l'utilisateur ne sait plus où saisir les infos de base.
2. Le bloc « Configuration du livre pour le workflow » (titre, auteur, intro, catégorie, public, nb chapitres, liste des chapitres) existe **uniquement dans la vue classique** (`WorkflowDashboard.tsx` lignes 262-…).
3. Même la vue classique **ne propose pas de champ "sous-titre"** — c'est juste mentionné dans un tip P1.
4. Aucun champ « petite introduction » distinct côté Kanban.

Résultat : l'utilisateur en mode Kanban (par défaut) voit uniquement des cartes d'agents et ne peut rien saisir → impression que « rien ne fonctionne ».

# Plan correctif

## 1. `src/pages/EbookPlannerPage.tsx`
- Ajouter un state `bookSubtitle` (+ setter) initialisé depuis le projet chargé (et persisté dans la sauvegarde projet existante via `book_summary` ou nouveau champ `subtitle` si déjà mappé — sinon stocker en mémoire + dans `ebook_projects.book_summary` parallèle ou simplement dans local). On stocke en mémoire + on le passe aussi à `EbookCompleteWorkflow` / Editorial Director.
- Passer `bookSubtitle` + `onUpdateSubtitle` à `WorkflowDashboard` **et** à `TrelloBoardView`.
- Passer également les props existantes (auteur, description, genre, public, nbChapitres, chapitres, updaters) à `TrelloBoardView`.

## 2. `src/components/ebook/TrelloBoardView.tsx`
- Étendre l'interface props pour recevoir : `ebookTitle`, `bookSubtitle`, `authorName`, `bookDescription`, `genre`, `targetAudience`, `numberOfChapters`, `chapters`, et les `onUpdate*` correspondants + `onAddChapter`.
- Insérer en haut du Kanban (avant les colonnes) une **carte "Configuration du livre"** repliable (Card + chevron), contenant exactement les mêmes champs que la vue classique (titre, sous-titre, auteur, introduction/sujet, catégorie, public, nb chapitres, liste éditable des chapitres) — même UI/styling que `WorkflowDashboard`.
- Carte ouverte par défaut tant que titre vide ou auteur vide.

## 3. `src/components/ebook/WorkflowDashboard.tsx`
- Ajouter un champ **Sous-titre** dans le bloc Configuration (après Titre, même grille). Props additionnelles `bookSubtitle?: string` + `onUpdateSubtitle?: (v: string) => void`.
- Mettre à jour le tip P1 pour pointer vers ce champ.

## 4. Factorisation légère (optionnel mais utile)
Pour éviter la duplication entre `WorkflowDashboard` et `TrelloBoardView`, extraire le formulaire dans un nouveau composant `WorkflowBookConfigForm.tsx` consommé par les deux vues. Si trop intrusif on duplique, la priorité étant que ça marche immédiatement.

## 5. Propagation du sous-titre
- `EbookCompleteWorkflow` et `EbookEditorialDirector` reçoivent déjà un titre — passer `subtitle` en prop optionnelle et l'inclure dans le prompt de la fonction `editorial-director` quand fourni (changement non bloquant, simple ajout dans `userPrompt`).

## Fichiers modifiés
- `src/pages/EbookPlannerPage.tsx`
- `src/components/ebook/TrelloBoardView.tsx`
- `src/components/ebook/WorkflowDashboard.tsx`
- (nouveau, optionnel) `src/components/ebook/WorkflowBookConfigForm.tsx`
- `src/components/ebook/EbookEditorialDirector.tsx` (prop subtitle)
- `supabase/functions/editorial-director/index.ts` (utiliser subtitle dans prompt si présent)

Aucune migration DB, aucun nouveau secret. Compatible BYOK Gemini existant.

## Résultat attendu
Quel que soit le mode d'affichage (Kanban par défaut ou Classique), l'utilisateur retrouve immédiatement un bloc clair pour saisir : **Titre · Sous-titre · Auteur · Introduction · Catégorie · Public · Nb chapitres · Chapitres**, puis lance le workflow IA — comme avant.
