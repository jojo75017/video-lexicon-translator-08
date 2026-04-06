
Objectif: faire du workflow P1–P15 l’entrée principale, et arrêter les renvois parasites vers le planificateur.

1. Corriger la navigation qui renvoie encore vers `planner`
- Fichier: `src/pages/EbookPlannerPage.tsx`
- Remplacer les redirections automatiques vers `setActiveTab('planner')` par `setActiveTab('workflow-dashboard')` dans les cas où on charge ou injecte des données:
  - reset / nouveau projet
  - chargement d’un projet
  - application d’un template
  - import URL
  - application d’une structure depuis le workflow
- Garder `planner` seulement comme onglet secondaire, ouvert uniquement si l’utilisateur le choisit explicitement.

2. Supprimer le faux “point d’entrée principal” vers le planificateur
- Fichier: `src/pages/EbookPlannerPage.tsx`
- Le gros bouton actuel “Ouvrir le formulaire du livre” envoie vers `planner`, ce qui contredit la nouvelle navigation.
- Le remplacer par un CTA principal clair:
  - “Créer mon livre avec le workflow”
  - clic → `workflow-dashboard` ou directement `editorial-director` selon le contexte
- Ajouter éventuellement un petit bouton secondaire discret:
  - “Ouvrir le formulaire manuel”
  - clic → `planner`

3. Rendre le démarrage du workflow visible en permanence
- Fichier: `src/components/ebook/TrelloBoardView.tsx`
- Le CTA actuel n’apparaît que si `completedCount === 0`; s’il y a déjà des données ou un état partiel, il disparaît.
- Le remplacer par une zone d’actions toujours visible en haut du tableau:
  - bouton principal: “Démarrer le workflow”
  - bouton secondaire: “Lancer le workflow complet”
  - bouton tertiaire éventuel: “Formulaire manuel”
- Ainsi, même si un projet existe déjà, on voit toujours comment créer le livre via le workflow.

4. Réduire la confusion créée par la carte “Plan du livre”
- Fichier: `src/components/ebook/TrelloBoardColumns.ts`
- La carte `planner` apparaît dans la colonne “Créer”, ce qui la fait passer pour le chemin principal.
- La déclasser visuellement:
  - soit la renommer “Formulaire manuel”
  - soit la déplacer en fin de colonne
  - soit la marquer comme optionnelle
- Le premier parcours visible doit rester:
  - P1 Zyro
  - P2 Jano
  - P3 Kiro
  - P4 Alia

5. Harmoniser le vocabulaire dans l’UI
- Le problème semble aussi venir d’un mélange entre “planificateur”, “formulaire du livre”, “workflow”, “pipeline”.
- Uniformiser les libellés:
  - principal: “Workflow”
  - secondaire: “Formulaire manuel”
- Éviter que le planificateur soit présenté comme l’entrée par défaut.

Résultat attendu
- En arrivant sur `/ebook-planner`, l’utilisateur reste sur le tableau workflow.
- Il voit immédiatement un bouton clair pour créer son livre avec le workflow.
- Le planificateur reste disponible, mais seulement comme option manuelle.
- Le parcours devient:
  - arrivée sur dashboard workflow
  - clic sur “Créer mon livre avec le workflow”
  - démarrage sur P1 ou lancement du workflow complet
  - plus de retour involontaire vers le planificateur

Détails techniques ciblés
- `src/pages/EbookPlannerPage.tsx`: normaliser toutes les redirections internes vers `workflow-dashboard`
- `src/components/ebook/TrelloBoardView.tsx`: CTA workflow permanent, non conditionnel
- `src/components/ebook/TrelloBoardColumns.ts`: déprioriser `planner` pour qu’il ne concurrence plus le workflow

Point important
- D’après le code actuel, l’entrée par défaut est déjà prévue sur `workflow-dashboard`, mais plusieurs actions reculent encore vers `planner`. Le correctif doit donc porter surtout sur ces redirections résiduelles et sur le CTA principal mal orienté.
