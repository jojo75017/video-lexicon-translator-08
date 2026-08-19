# Voir le livre à côté pendant la rédaction + bouton « Avis clients »

Oui, le principe reste celui d'un copilote : vous dictez vos idées, le Génie les rend corrigées, vous validez, et tout ce qui est validé part dans le livre. Ce plan complète deux points : voir le livre à côté en temps réel, et un bouton dédié pour obtenir des avis clients.

## 1. Le livre visible à côté, pendant qu'il s'écrit

Aujourd'hui la colonne de droite affiche le sommaire, et l'avancement (agents, chapitres, aperçu) n'apparaît qu'à l'intérieur du parcours de rédaction. Le clic sur « Voir mon livre » déclenche bien la bascule, mais on ne lit qu'un extrait.

Ce qui change dans la colonne de droite (`/v3/create` et `/v3/biographie`) :

```text
┌─ Colonne droite (collante) ─────────────┐
│ [ Sommaire ] [ Mon livre ]   <- 2 onglets│
│                                          │
│ Onglet « Mon livre » :                   │
│  Agent 7/15 · 4/12 chapitres · 9 800 mots│
│  ▓▓▓▓▓▓░░░░░  progression                │
│  Chapitre 1 — titre        [texte entier]│
│  Chapitre 2 — titre        [texte entier]│
│  … se remplit tout seul pendant l'écriture│
└──────────────────────────────────────────┘
```

- Deux onglets dans la colonne de droite : **Sommaire** et **Mon livre**. Le clic sur « Voir mon livre » (barre d'actions) ou sur « Lire tous les chapitres écrits » ouvre directement l'onglet « Mon livre » sans quitter la page.
- L'onglet « Mon livre » affiche le compteur d'agents, les chapitres écrits, le nombre de mots, la barre de progression, puis **le texte complet de chaque chapitre** (dépliable), et non plus un extrait de 900 caractères.
- Mise à jour automatique pendant la rédaction : chaque chapitre terminé s'ajoute en direct.
- Boutons en pied de l'onglet : « Corriger mon livre », « Données KDP », « Exporter » — pour enchaîner sans chercher.
- Sur mobile, les deux onglets restent sous le dialogue, dans le même ordre.

## 2. Bouton « Obtenir des avis clients »

La page guide existe déjà (`/v3/avis`, dans la barre latérale). Il manque le bouton au bon moment.

- Ajout d'un 9e bouton dans la barre d'actions du livre : **« Obtenir des avis clients »**, avec l'icône étoile, qui ouvre `/v3/avis` en passant le titre du livre pour que la séquence d'emails soit déjà personnalisée.
- Le même bouton apparaît en fin de rédaction, dans l'onglet « Mon livre », une fois le manuscrit terminé — c'est le moment naturel où l'on pense aux avis.
- Sur `/v3/avis`, le titre reçu est pré-rempli dans le générateur de séquence d'avis (aucune saisie à refaire).

## Détails techniques

- `src/components/v3public/V3GenieOutlinePanel.tsx` : passage à deux onglets internes (`sommaire` / `livre`), l'événement `v3:show-written-book` sélectionne l'onglet `livre`.
- `src/components/v3public/V3LiveBookProgress.tsx` : variante compacte pour la colonne (props `variant="aside"`), chapitres complets en `<details>` au lieu de l'extrait tronqué, source inchangée (`readWrittenProgress`, `ebook_workflow_progress`).
- `src/components/v3public/V3BookActionsBar.tsx` : « Voir mon livre » ouvre toujours l'onglet livre (au lieu de rediriger) ; ajout du bouton `⭐ Obtenir des avis clients` vers `/v3/avis?title=…`.
- `src/pages/v3public/V3AvisClientsPage.tsx` : lecture du paramètre `title` (repli sur le brief en cours) pour pré-remplir la séquence.
- Aucune modification de base de données, aucun nouvel appel IA : tout vient de l'avancement déjà enregistré.

## Hors périmètre

Pas de récupération automatique des avis Amazon : `/v3/avis` reste un guide plus un générateur d'emails.
