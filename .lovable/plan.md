## Objectif
Ajouter une visite guidée (onboarding tour) « Noir & Or » pour les nouveaux visiteurs du Hub V3 (`/hub-v3`), avec 7 étapes cliquables qui pointent vers les vraies zones de la page.

## Comportement
- Au **1er accès** au Hub, le tour démarre automatiquement (après ~1s), une seule fois — état mémorisé via `localStorage` (clé `v3hub_tour_done`).
- Bouton **« Visite guidée »** (icône boussole/sparkles, style or) ajouté dans le héro, pour relancer le tour à la demande.
- Navigation : **Suivant / Précédent / Passer**, points de progression cliquables, fermeture par croix ou clic hors-cible.
- Effet **spotlight** : overlay sombre + halo doré autour de l'élément ciblé, tooltip « Noir & Or » positionné dynamiquement, scroll automatique vers la cible. Respect de `prefers-reduced-motion`.

## Les 7 étapes (cliquables, ancrées sur la page)
```text
1. Héro            → « Bienvenue dans le cockpit V3 » (présentation)
2. Badge 197€      → « Votre accès Publication Assistée Pro à vie »
3. Recherche       → « Trouvez n'importe quel outil en 1 seconde »
4. Filtres pilier  → « Naviguez par pilier : Publier / Monétiser / Marketing / IA »
5. 1re carte module→ « Cliquez une carte pour lancer l'outil »
6. Badge statut    → « Prêt / En cours / Bientôt : suivez l'avancement »
7. Retour cockpit  → « Revenez au cockpit quand vous voulez » + CTA « C'est parti ! »
```

## Détails techniques
- **Nouveau composant** `src/components/admin/V3HubTour.tsx` : moteur de tour autonome (overlay spotlight + tooltip), inspiré de `EbookInteractiveTutorial` mais aux couleurs Noir & Or et sans dépendance aux champs du Planner. Props : `isOpen`, `onClose`, `onComplete`.
  - Liste interne d'étapes `{ id, title, description, targetSelector, position, icon }`.
  - Calcul de position via `getBoundingClientRect`, recalcul sur `resize`/`scroll`, `scrollIntoView`.
  - Animations via `framer-motion` (déjà utilisé dans le projet).
- **Édition** `src/pages/V3HubPage.tsx` :
  - Ajout d'attributs `data-tour="..."` sur les cibles : héro, badge prix, champ recherche, barre de filtres, première carte module, badge statut, bouton retour cockpit.
  - State `tourOpen` + effet `localStorage` pour l'auto-démarrage.
  - Bouton « Visite guidée » dans le héro.
  - Rendu de `<V3HubTour ... />`.
- Aucune donnée backend, aucune migration. Style strictement local à la page (charte KDP globale inchangée).

## Hors périmètre
- Pas de modification des 60 outils ni du cockpit.
- Pas de tour pour les abonnés non-admin (le Hub reste réservé admin pour l'instant).
