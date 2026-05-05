## Objectif

Sur le tableau de bord auteur, **toujours** afficher le texte marketing + les 6 livres Amazon **en haut**, suivis du sélecteur 1 Simple / 2 Workflow, puis du plan complet (P1 → P15 ou parcours simple) — **plus jamais d'écran de choix qui cache le plan**. Et corriger les deux boutons cassés.

## Fichier touché

`src/pages/EbookPlannerPage.tsx` uniquement. Aucun changement aux composants enfants (`AuthorBooksShowcase`, `EbookJourneyDashboard`, `TrelloBoardView`, agents P1→P15).

## Changements précis

### 1. Supprimer l'écran de choix séparé (lignes ~1306-1452)

Aujourd'hui : si `viewMode === 'choice'`, on affiche **seulement** le bandeau + sélecteur + livres Amazon, et on **cache** le plan (`viewMode === 'choice' ? null : ...`).

Après : un seul rendu, **toujours dans cet ordre** :

```text
┌─────────────────────────────────────────────┐
│ Bandeau marketing (Votre livre KDP mérite…) │  ← toujours visible
├─────────────────────────────────────────────┤
│ AuthorBooksShowcase (6 livres Amazon)       │  ← toujours visible
├─────────────────────────────────────────────┤
│ Sélecteur "Mode : 1 Simple / 2 Workflow"    │  ← toujours visible
├─────────────────────────────────────────────┤
│ Plan complet :                              │
│   - si Workflow  → TrelloBoardView P1→P15   │
│   - si Simple    → EbookJourneyDashboard    │
├─────────────────────────────────────────────┤
│ Sections repliables (stats, etc.)           │
└─────────────────────────────────────────────┘
```

- L'état `viewMode` ne prend plus que les valeurs `'trello' | 'classic'`. Valeur par défaut : `'trello'` si rien en localStorage (pour montrer P1→P15 directement).
- Suppression du `?:` qui rendait `viewMode === 'choice'`.

### 2. Corriger "+ Nouveau" (`resetPlan`, lignes 1233-1250)

- Garder `clearCurrentEditorState()` (qui vide bien le titre, chapitres, images, etc. et remet `currentProjectId = null`).
- **Retirer** `setViewMode('choice')` et `localStorage.removeItem(DASHBOARD_VIEW_MODE_KEY)` → on reste sur le mode actuel.
- Ajouter un **flag local** `localStorage.setItem('ebook_just_reset', '1')` lu par `loadFromDatabase` (ligne 397) pour empêcher le rechargement automatique de "La Belle-sœur" depuis le cloud après reset (le flag est consommé immédiatement).
- Toast : "Projet réinitialisé — nouveau livre prêt à démarrer".

### 3. Corriger "Retour au tableau de bord" (lignes ~3367-3420)

- Un seul bouton "Retour au tableau de bord" qui :
  - fait `setActiveTab('workflow-dashboard')`,
  - **ne touche pas** à `viewMode` ni au localStorage (préserve le mode choisi par l'utilisateur),
  - scrolle en haut (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
- Supprimer le second bouton "Choisir 1 ou 2" ajouté précédemment (qui forçait le mode choice).

### 4. Migration de l'état `viewMode`

- Type : `'trello' | 'classic'` (plus `'choice'`).
- Init : lire `DASHBOARD_VIEW_MODE_KEY` ; si absent ou égal à `'choice'`, fallback `'trello'`.

## Ce qui ne change PAS

- `AuthorBooksShowcase.tsx` (déjà créé avec les 6 livres Amazon + URLs).
- Bandeau marketing (mêmes textes, juste déplacé hors du `viewMode === 'choice'`).
- Agents P1 → P15, `TrelloBoardView`, `EbookJourneyDashboard`.
- Sections repliables (stats, versions, etc.).
- Logique de chargement projet, sauvegarde auto, sync cloud.

## Résultat attendu

- Sur `/ebook-planner` onglet "Tableau de bord", l'utilisateur voit **immédiatement** : texte marketing → ses 6 livres Amazon → sélecteur 1/2 → plan P1→P15 (mode Workflow par défaut).
- Cliquer "+ Nouveau" → confirmation → titre devient vide / "Nouveau projet", reste sur le tableau de bord avec le même mode, sans rechargement de l'ancien livre.
- Cliquer "Retour au tableau de bord" depuis n'importe quel onglet → revient ici avec le mode préservé, scroll en haut.
