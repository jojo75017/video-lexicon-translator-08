## Objectif

Cloner le pipeline complet des 15 agents (P1→P15) de la V2 dans le parcours V3 `/v3/create`, en gardant strictement la même mécanique (celle qui fonctionne aujourd'hui côté V2), puis reprendre le sommaire V2 (fonctionnel) et le rafraîchir visuellement. Aucun changement de tarifs, aucune refonte de l'UI publique V3 en dehors du wizard.

## Étape 1 — Cloner le moteur V2 dans la V3

Le pipeline V2 est composé de :
- `src/components/ebook/workflow/workflowAgents.ts` — définition des 15 agents (P1 Zyro → P15 Orin).
- `src/components/ebook/EbookCompleteWorkflow.tsx` + `WorkflowStepWrapper.tsx` + `WorkflowNavigation.tsx` + `WorkflowDashboard.tsx` — orchestration UI.
- `src/hooks/useWorkflowResults.ts` + `useWorkflowSync.ts` + `useWorkflowCloudSync.ts` — état, cache local et sync cloud.
- Edge functions : `editorial-director`, `content-architect`, `expert-writing`, `editorial-quality`, `editorial-memory`, `editorial-packaging`, `complete-book-workflow`.

Action :
1. Créer `src/components/v3public/V3Workflow15.tsx` qui monte `EbookCompleteWorkflow` (composant V2) tel quel dans un conteneur V3 (halo doux + `v3-card`).
2. Brancher ce composant à l'étape « Génération » du `V3CreateWizard` (après validation du sommaire) à la place de l'appel actuel à `complete-book-workflow`.
3. Réutiliser `useWorkflowResults` pour la persistance locale et `saveProjectToCloud` pour la sauvegarde Supabase à chaque agent terminé (P1, P4, P7, P15).
4. Retirer du wizard V3 la logique « one-shot » qui produisait les titres cassés (`Ch.1 - Chapitre 1`) — le sommaire viendra désormais de P3 comme en V2.

## Étape 2 — Réutiliser le sommaire V2 puis le rafraîchir

1. Repartir de la sortie de l'agent P3 (`content-architect`) — c'est le sommaire qui fonctionne en V2.
2. Afficher la table des matières V2 dans le wizard V3 via un nouveau composant `V3SommaireFromP3.tsx` (parsing identique à V2, aucune modification côté prompt).
3. Améliorations visuelles légères uniquement : cartes ambrées, numérotation en pastilles, objectif éditable inline (aucun changement de logique de parsing).

## Étape 3 — Modules et couvertures (préparation, sans y toucher maintenant)

- Laisser `SpecialBookModules` et le studio de couverture V2 en place (ils sont déjà accessibles depuis la sidebar V3).
- Le blocage P4→P5 et la refonte des couvertures seront traités **après validation** du clonage (nouvelle demande utilisateur).

## Détails techniques

- Aucun changement d'edge functions : on rebranche celles de la V2 qui fonctionnent.
- Aucun changement de schéma Supabase (`ebook_projects`, `workflow_results`, `v3_workflow_projects` restent tels quels).
- `V3CreateWizard.tsx` : remplacer l'étape 4 (« Génération ») par le montage de `V3Workflow15`, en passant `bookConfig` (titre, description, chapitres, mots/chapitre, ton, personnages) via `edition_book_config_v1` déjà utilisé par la V2.
- Guest mode conservé : si non connecté, sync cloud silencieusement ignorée (comportement actuel).
- Aucune modif de tarifs, de sidebar, de couvertures, ni des scripts vidéo.

## Hors périmètre (pour un tour suivant)

- Fix P4→P5.
- Refonte du studio de couvertures.
- Réorganisation des onglets/contenus V3.
