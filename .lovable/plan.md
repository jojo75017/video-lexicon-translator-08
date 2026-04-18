

## Objectif
Refondre la sidebar pour qu'elle soit **opérationnelle** : moins de friction, hiérarchie claire, navigation rapide vers ce qui compte vraiment (Workflow IA + Guide).

## Diagnostic actuel
La sidebar (`ModernSidebar.tsx` + `modernSidebarSections.ts`) a aujourd'hui :
- 5 piliers + ~15 sous-sections + ~44 outils empilés
- Tous les piliers ouvrables simultanément → mur de boutons
- Pas de distinction visuelle entre "outils du quotidien" et "outils experts"
- Pas de raccourcis vers les actions critiques (Nouveau projet, Reprendre)
- Pas de barre de recherche → impossible de retrouver un outil par nom
- Aucun indicateur d'état (étape en cours du workflow, projet actif)

## Plan de refonte (5 chantiers)

### Chantier 1 — Header sidebar opérationnel
Nouveau bloc en haut de sidebar (au-dessus du Guide) :
- **Sélecteur de projet actif** (dropdown avec les 3 derniers ebooks ouverts)
- **Bouton CTA "+ Nouveau projet"** (vert, primaire)
- **Barre de recherche outils** (filtre live dans tous les onglets — tape "couverture" → 2 résultats)

### Chantier 2 — Section "⭐ Favoris / Épinglés"
Nouvelle section juste sous le Guide :
- L'utilisateur peut épingler ses 5 outils favoris (étoile au survol de chaque item)
- Stockage `localStorage` (pas de table DB nécessaire)
- Par défaut : Workflow IA, Studio Couverture, Export KDP, Guide KDP Ads, Mes Projets

### Chantier 3 — Hiérarchie "Essentiel vs Avancé" dans chaque pilier
Pour chaque pilier (Workflow IA, Écriture, Publier, Vendre, Compte) :
- **Bloc visible par défaut** : 3-4 outils essentiels uniquement
- **Lien "+ Voir 8 outils avancés"** qui déplie le reste
- → Réduit le bruit visuel de ~60%

### Chantier 4 — Comportement "accordéon exclusif"
Un seul pilier ouvert à la fois (clic sur un autre → ferme le précédent).
- Le pilier contenant la route active reste forcé ouvert
- Ajoute un bouton "Tout replier" en bas de sidebar

### Chantier 5 — Indicateurs d'état contextuels
- Badge "En cours" sur l'étape Workflow IA active (P1-P15)
- Badge numérique "3" sur "Mes Projets" (nombre de projets non finalisés)
- Pastille verte sur Guide KDP Ads tant que l'utilisateur ne l'a pas ouvert (onboarding silencieux)

## Architecture finale de la sidebar

```text
┌─────────────────────────────────┐
│ 📚 EbookStudio          [<<]    │  ← logo + collapse
├─────────────────────────────────┤
│ 📂 Projet : "Mon ebook v2"  ▾   │  ← sélecteur projet
│ [+ Nouveau projet]              │  ← CTA vert
│ 🔍 Rechercher un outil...       │  ← filtre live
├─────────────────────────────────┤
│ 🗺️  Guide des outils            │  ← bouton highlighté (existant)
├─────────────────────────────────┤
│ ⭐ Favoris                       │
│   • Workflow IA                 │
│   • Studio Couverture           │
│   • Export KDP                  │
├─────────────────────────────────┤
│ 🤖 Workflow IA          [▾]     │  ← un seul ouvert à la fois
│   • Pipeline complet [En cours] │
│   • Nouveau workflow            │
│   • Reprendre dernier           │
│   + Voir 8 outils avancés       │
├─────────────────────────────────┤
│ ✍️  Écriture            [▸]     │
│ 📦 Publier              [▸]     │
│ 📣 Vendre               [▸]     │
│ ⚙️  Mon Compte          [▸]     │
├─────────────────────────────────┤
│ [Tout replier]                  │
└─────────────────────────────────┘
```

## Fichiers à créer / modifier

**Créer**
- `src/components/layout/SidebarHeader.tsx` (sélecteur projet + CTA + recherche)
- `src/components/layout/SidebarFavorites.tsx` (section épinglés + hook localStorage)
- `src/hooks/useSidebarFavorites.ts` (gestion favoris)
- `src/hooks/useSidebarSearch.ts` (filtre live)

**Modifier**
- `src/components/layout/ModernSidebar.tsx` (intégrer header + favoris + accordéon exclusif + indicateurs)
- `src/components/layout/modernSidebarSections.ts` (marquer chaque outil `essential: true/false`)

## Ce que je NE fais PAS
- Pas de changement de la palette (KDP #008296 / #FF9E2D conservée)
- Pas de suppression d'outils (tous restent accessibles via "Voir avancés")
- Pas de refonte du `App.tsx` ni des routes
- Pas de table DB pour les favoris (localStorage suffit)
- Pas de drag & drop pour réorganiser (étoile = simple toggle)

## Bénéfice mesurable
- **-60% de boutons visibles** au premier coup d'œil
- **3 clics max** pour atteindre n'importe quel outil (vs 5-6 aujourd'hui)
- **0 clic** pour relancer le dernier projet (sélecteur en haut)

