

# Refonte Dashboard Trello + Mon Compte toujours visible

## Problème immédiat
"Mon Compte" est le 5ème groupe de la sidebar, poussé sous le fold par les 127 outils au-dessus. Il faut scroller pour le trouver.

## Solution : Dashboard Trello (déjà validé) + correctif rapide

### Correctif immédiat — Épingler "Mon Compte" en bas de la sidebar
**Fichier : `src/components/layout/ModernSidebar.tsx`**
- Sortir le groupe "Mon Compte" de la zone scrollable
- L'épingler juste au-dessus du bouton "Réduire", toujours visible
- Afficher seulement les items essentiels : Mes Projets, Abonnement, Paramètres (les autres restent accessibles en cliquant)

### Dashboard Trello — Refonte complète (validée précédemment)

**Fichier 1 (nouveau) — `src/components/ebook/TrelloBoardColumns.ts`**
- Configuration des 5 colonnes (Créer, Optimiser, Produire, Publier, Vendre)
- Mapping de ~30 outils essentiels avec leurs prérequis et icônes
- Items "Mon Compte" inclus en accès rapide en haut du tableau

**Fichier 2 (nouveau) — `src/components/ebook/TrelloBoardView.tsx`**
- Tableau Kanban à 5 colonnes colorées
- Cartes cliquables avec statuts (fait/en cours/dispo/bloqué)
- Barre de progression globale en haut
- Accès rapide "Mon Compte" (Projets, Paramètres, Abonnement) toujours visible en header
- Bouton "Tous les outils (127)" et "Vue classique" en bas

**Fichier 3 — `src/pages/EbookPlannerPage.tsx`**
- Ajouter `viewMode: 'trello' | 'classic'` persisté en localStorage (défaut: trello)
- Mode trello : masquer sidebar, afficher TrelloBoardView
- Clic sur carte → ouvre l'outil + header "← Retour au tableau"
- Mode classic : comportement actuel inchangé

**Fichier 4 — `src/components/layout/ModernSidebar.tsx`**
- Épingler "Mon Compte" (3 items essentiels) en bas, hors zone de scroll
- Ajouter prop `visible` pour masquer en mode trello
- Ajouter bouton "Mode Tableau" en bas

## Résultat
- "Mon Compte" toujours visible (plus besoin de scroller)
- Vue par défaut = tableau Kanban clair avec 5 colonnes
- Les 127 outils restent accessibles via "Tous les outils" ou "Vue classique"

