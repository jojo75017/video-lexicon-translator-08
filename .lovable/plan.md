# Réorganisation de la navigation du Hub V3 → sidebar latérale gauche

Décision validée : on passe la navigation d'une **barre d'onglets horizontale** à une **sidebar verticale à gauche** (comme Notion / Linear / Vercel). Objectif : l'utilisateur cherche moins, tout est visible d'un coup d'œil, look plus moderne.

## Ce que je vais construire

### 1. Structure en 2 colonnes
```text
┌───────────┬─────────────────────────────┐
│  SIDEBAR  │   HERO (compacté) + CONTENU │
│  (gauche) │                             │
│ ◆ Parcours│   [contenu de l'onglet]     │
│ ◆ Outils  │                             │
│ ◆ Livres  │                             │
│ ◆ Guides  │                             │
│ ◆ Offres  │                             │
│ ◆ Roadmap │                             │
│           │                             │
│ [Créer]   │                             │
└───────────┴─────────────────────────────┘
```

- Sidebar `sticky` à gauche (~240px), charte « Clair Ambre » existante (AMBER `#E8951E`, CREAM `#FBF6EC`, INK `#2A2118`, Instrument Serif).
- Chaque entrée = icône + libellé complet ; onglet actif souligné par un fond doux `#FFF3DF` + bord/pastille ambré.
- Bouton **« Créer un livre »** mis en avant dans la sidebar.
- Hero **compacté** (titre + sous-titre plus courts, barre de stats conservée) puisque la nav quitte le haut → plus d'air pour le contenu.

### 2. Rétractable + responsive
- **Desktop** : sidebar visible par défaut, bouton pour la réduire en mini-rail d'icônes (~64px), état mémorisé dans `localStorage`.
- **Mobile / tablette** : sidebar en **tiroir** (off-canvas) ouvert via un bouton hamburger, se referme après sélection.

### 3. Rien d'autre ne change
- Les 6 onglets, leur contenu, le filtrage, la persistance `tab` (URL + localStorage), la visite guidée (`data-tour`) et les accès (197€ / Packs) restent identiques.
- Seule la **présentation de la navigation** change.

## Détails techniques
- Fichier : `src/pages/V3HubPage.tsx` — remplacement de la `<nav>` horizontale sticky (~l.333-356) par une sidebar + wrapper flex 2 colonnes ; hero et `<main>` réorganisés.
- Réutilisation du tableau `HUB_TABS` (aucun changement de données).
- Nouveaux états `sidebarCollapsed` (desktop) et `mobileNavOpen` (tiroir), persistance légère `localStorage`.
- Conservation des ancres `data-tour` (`hero`, `back`, `price`, `card`, `status`) pour ne pas casser la visite guidée.
- Styles Tailwind/inline alignés sur la palette actuelle — aucune régression de thème.
