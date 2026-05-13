ns# Raffinement élégance — Espace abonné

Objectif : rendre l'expérience plus élégante et lisible, **sans toucher à la logique métier** ni au monolithe `EbookPlannerPage` (au-delà de l'injection déjà faite).

## Périmètre (4 fichiers uniquement)

1. `src/components/ebook/QuickModeBar.tsx`
2. `src/components/layout/EspaceHeader.tsx`
3. `src/pages/EspacePage.tsx`
4. `src/index.css` (ajout de 2 tokens d'ombre, aucune suppression)

Aucune modification de routes, d'API, d'edge functions, du SubscriberGate, ni des composants P1→P15.

## Lot A — QuickModeBar

- Fond blanc + halo coloré derrière l'icône (au lieu du gradient plein)
- État actif : bordure `joy-ink`, petit point indicateur, ombre douce
- État inactif : bordure transparente, ring au hover
- Icône dans cercle 36px avec teinte pastel monochrome par mode
- Bouton "Plus" : pill compact avec séparateur vertical fin
- Bar resserrée (`py-2.5`), padding card réduit

## Lot B — EspaceHeader

- Logo + chevron `›` + titre projet en `font-serif italic`
- Bouton déconnexion : icône seule + tooltip
- Backdrop-blur renforcé, hairline 1px en bas
- Suppression du doublon "Mon espace" à droite

## Lot C — EspacePage

- Hero : "Bonjour 👋 — Voici ton atelier" + date du jour
- Bloc Reprendre : carte large gradient cream→white, CTA arrondi
- Bloc Mes livres : grille 3 colonnes hover scale
- Bloc Créer du neuf : 4 cartes équi-hauteur, emoji XL, bouton outline arrondi
- Bloc Aller plus loin : grille 2 colonnes de liens stylés (suppression accordion)

## Lot D — Tokens & rythme

- Ajout dans `index.css` :
  - `--shadow-soft: 0 2px 8px hsl(220 15% 20% / 0.04)`
  - `--shadow-elevated: 0 8px 24px hsl(220 15% 20% / 0.08)`
- Typographie : `tracking-tight` titres, `text-joy-ink/60` sous-titres
- Radii standardisés : 12 / 16 / 9999

## Garanties anti-casse

- Pas de changement de props publiques de `EspaceHeader` ni `QuickModeBar`
- `MAIN_MODES.matches` et `onNavigate` inchangés → la navigation tabs reste identique
- Aucun `localStorage` ni hook modifié
- `EspacePage` : props `subscriberEmail`, `onLogout` conservées telles quelles
- `index.css` : ajouts uniquement, pas de suppression de tokens existants

## Ordre d'exécution

A → B → C → D, vérification visuelle après chaque lot via screenshot du preview.
