## Problème

Avant, vous pouviez basculer entre la vue **Workflow (Trello/Kanban)** et la vue **Simple (classique)**. En refondant le tableau de bord, j'ai retiré ce choix par erreur — désormais seul le nouveau "Parcours A → Z" s'affiche.

## Solution

Rétablir un sélecteur clair en haut du tableau de bord avec **2 modes** :

1. **✨ Parcours guidé A → Z** (par défaut, teal) — le nouveau dashboard linéaire en 5 phases (Préparation → Rédaction → Visuels → Publication → Après publication)
2. **🗂️ Vue Workflow (Kanban)** (orange) — l'ancienne vue Trello des 15 agents avec colonnes drag & drop

Le choix est mémorisé dans `localStorage` (clé `ebook_view_mode`) pour persister entre les sessions.

## Modifications

**Fichier unique** : `src/pages/EbookPlannerPage.tsx` (case `workflow-dashboard`, lignes 1297-1318)

- Ajout d'un bandeau sélecteur en haut avec 2 boutons stylisés (teal/orange selon mode actif)
- Affichage conditionnel : `viewMode === 'trello'` → `TrelloBoardView` ; sinon → `EbookJourneyDashboard`
- Les sections repliables (Statistiques détaillées, Inspirations best-sellers) restent visibles uniquement en mode "Parcours guidé"
- Aucune nouvelle dépendance, aucune migration, aucun nouveau composant

## Résultat

Vous retrouvez le choix entre les deux expériences avec un toggle visible et persistant, sans perdre les améliorations du nouveau parcours guidé.
