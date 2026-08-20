# Remettre les 15 agents en évidence dans la V3

Aujourd'hui les 15 agents (P1 à P15 : Zyro, Jano, Kiro, Alia, Lexo, Vero, Kado, Conso, Mira, Nexa, Beto, Emio, Huma, Tila, Orin) ne sont visibles que dans l'ancienne interface V2 (`/ebook-planner`). Dans la V3, ils n'apparaissent que sous forme d'une ligne de texte dans l'encart « Comment votre livre est écrit » — aucun onglet, aucun écran, aucun suivi d'avancement. L'abonné ne sait donc pas où passer pour écrire son livre avec le workflow complet.

## 1. Un onglet dédié, tout en haut de la barre latérale

Nouvelle entrée en 2e position (juste après « Fonctionnalités ») :
**« 🤖 Workflow 15 Agents — écrire mon livre »** avec badge « Pipeline ».

Elle ouvre une vraie page V3 (`/v3/workflow`), dans l'habillage V3 (fond clair, or/émeraude), pas un renvoi vers l'ancienne interface.

## 2. La page « Workflow 15 Agents »

- **En-tête** : ce que fait le pipeline, en une phrase, + bouton « Lancer mon livre ».
- **Grille des 15 agents** : une carte par agent avec son numéro (P1…P15), son nom, sa mission en une ligne, et son état : en attente / en cours / terminé / erreur.
- **Barre d'avancement globale** : « Agent 7 / 15 — Mira travaille sur la cohérence ».
- **Reprise** : si un livre est en cours, un bandeau « Reprendre où vous en étiez (agent 9/15) ».
- **Résultat de chaque agent** consultable en dépliant la carte (texte produit, mots-clés, métadonnées KDP…).

Le moteur reste celui déjà en place (le tableau de bord du workflow existant) : on l'affiche dans la V3 au lieu de le laisser enfermé dans l'ancienne interface.

## 3. Rendre le chemin évident depuis l'accueil V3

- Sur `/v3`, une tuile large **« Écrire mon livre avec les 15 agents »** placée avant le formulaire de démarrage, avec les 15 pastilles d'agents visibles.
- Dans l'encart « Comment votre livre est écrit » (page de création), la ligne « Agents P1-P15 » devient cliquable et renvoie vers `/v3/workflow`.
- Ajout d'une tuile « Workflow 15 Agents » dans le module Fonctionnalités.

## 4. Deux chemins clairement expliqués

Un petit encart de choix, pour ne plus perdre l'abonné :

```text
Je discute avec le Génie        →  Ebookstudio-Génie (sommaire construit ensemble)
Je laisse les 15 agents faire   →  Workflow 15 Agents (niche → livre → KDP → couverture)
```

## Détails techniques

- Nouvelle page `src/pages/v3public/V3WorkflowPage.tsx`, route `/v3/workflow` dans `App.tsx` (même garde d'abonné/admin que les autres pages V3).
- Réutilise `src/components/ebook/WorkflowDashboard.tsx` et `src/components/ebook/workflow/workflowAgents.ts` (`WORKFLOW_STEPS`, `WORKFLOW_STEP_COUNT`) : aucun nouveau moteur, aucun nouvel appel IA.
- Nouveau composant `src/components/v3public/V3AgentsGrid.tsx` : grille des 15 agents (numéro, nom de code, mission, état) alimentée par `WORKFLOW_STEPS` + l'état de progression existant (`useWorkflowResults` / `useWorkflowSync`).
- `V3Sidebar.tsx` : ajout de l'entrée `/v3/workflow` en 2e position de la première section.
- `V3PipelinePanel.tsx` : la passe 6 « Agents P1-P15 » devient un lien vers `/v3/workflow`.
- `V3HomePage.tsx` : insertion de la tuile workflow + encart « deux chemins » avant le formulaire de démarrage.
- `src/data/v3Features.ts` : ajout de la tuile « Workflow 15 Agents ».
- Aucun changement de schéma, de tarif ou de quota.
