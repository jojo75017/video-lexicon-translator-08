## Objectif
Rendre le header du planner (`EspaceHeader`) plus chaleureux et accueillant, sans toucher à la logique de navigation ni aux 56 outils.

## Touches « jovial » proposées

### 1. Petite emoji par famille dans la barre principale
- 📘 Plan · ✍️ Écrire · 🎨 Habiller · 🚀 Publier · 💛 Vendre
- Affichées avant le label, taille discrète, ne modifient pas la structure.

### 2. Onglet actif plus enveloppant
- Pill teal actuelle conservée, mais avec un léger **glow doux** (`shadow-[0_2px_8px_rgba(0,130,150,0.25)]`) et transition `hover:scale-[1.03]`.
- Sur hover des onglets inactifs : fond `joy-cream` + accent orange KDP `#FF9E2D` sur le texte (cohérent avec la mémoire « hover orange »).

### 3. Sous-barre contextuelle plus douce
- Fond `bg-gradient-to-r from-white via-joy-cream/40 to-white` au lieu de `bg-white/40` pur.
- Chips actives passent à `bg-joy-teal/15` + border subtile teal, avec un petit point ● devant le label de l'outil sélectionné.

### 4. Bouton « Tous les outils »
- Ajouter une micro-animation `Sparkles` qui pulse doucement (animate-pulse 2s) à côté du `LayoutGrid`.
- Texte: « Tous les outils ✨ ».

### 5. Salutation contextuelle (optionnel léger)
- Quand un `projectTitle` est présent, ajouter un **petit emoji 📖** avant le titre de projet (déjà en italique serif). Très discret.

### 6. Popover « Tous les outils »
- En-tête de chaque colonne : ajouter l'emoji de la famille devant le `familyLabel`.
- Hover des items : passer à `bg-joy-cream` + texte `#FF9E2D` (hover orange KDP).

## Hors périmètre (ne pas casser)
- Aucun changement de structure JSX au-delà des classes/icônes.
- Pas de changement de `PLANNER_TABS`, `PLANNER_SUBTABS`, `ALL_TOOLS`.
- Pas de changement dans `EbookPlannerPage.tsx`.
- Pas de nouveau fichier, pas de nouvelle dépendance.
- Tokens semantic conservés (joy-ink, joy-teal, joy-cream).

## Fichier modifié
- `src/components/layout/EspaceHeader.tsx` (uniquement classes + emojis + micro-animation)
