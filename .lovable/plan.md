## Objectif

Retirer la sidebar du planner pour que l'abonné navigue uniquement depuis sa grille de tuiles `/espace`, avec une mini-barre d'onglets contextuelle en haut et un retour `← Mon espace` toujours visible.

## Changements

### 1. `src/pages/EbookPlannerPage.tsx`
- Supprimer l'import et le render de `SimpleSidebar` (lignes 17, 3464-3476) ainsi que l'état `sidebarCollapsed`.
- Le `<main>` devient pleine largeur (`flex-1` reste, plus de flex parent à 2 colonnes — passer le wrapper en simple `min-h-screen`).
- `EspaceHeader` garde un nouveau bouton « ← Mon espace » à gauche qui fait `navigate('/espace')`.

### 2. `src/components/layout/EspaceHeader.tsx`
- Ajouter un bouton retour discret « ← Mon espace » (icône `ArrowLeft`, ghost, rounded-full).
- Juste sous le header, ajouter une **PlannerTabBar** horizontale et compacte (sticky, fond `bg-white/90 backdrop-blur`, séparateur peach) avec 5 onglets contextualisés selon le mode :
  - Mode ebook : Plan · Écrire · Habiller · Publier · Vendre
  - Mode audio / coloriage : on masque la barre (l'outil est mono-écran).
- Détection du mode via la prop `activeTab` (déjà connue dans le planner) — passer `activeTab` + `onTabChange` à `EspaceHeader`.
- Onglet actif : pilule teal (`bg-[hsl(var(--joy-teal))] text-white`), inactif : `text-joy-ink/70 hover:bg-joy-cream`.

### 3. `src/pages/EspacePage.tsx`
- Aucun changement structurel. Vérifier juste que chaque tuile envoie bien le bon `?tab=` au planner (déjà fait au lot précédent).

### 4. Nettoyage
- `SimpleSidebar` reste pour les pages admin/autres usages mais n'est plus utilisée par `/ebook-planner`. Pas de suppression du fichier (risque de casse ailleurs).
- Vérifier `rg "SimpleSidebar"` après l'edit pour confirmer qu'il n'y a plus d'import dans le planner.

## Résultat

L'abonné voit : son espace plein écran avec les tuiles colorées → clic sur 📖 Ebook → planner sans sidebar, juste un header avec retour `← Mon espace` et une mini-barre 5 onglets pour passer d'une étape à l'autre. Plus rien ne « gêne » sur le côté.

## Hors scope

Pas de refonte du contenu interne du planner, pas de modification des autres pages (`/bd-studio`, `/kdp-keywords`, etc.) qui ont déjà leurs propres layouts.