# Retrouver les données KDP d'un livre terminé, et garder le pilotage dans la V3

## Ce qui a été vérifié

- Vos livres sont bien enregistrés : les deux derniers projets du 20 août (5 et 20 chapitres) sont présents en base avec leur description KDP.
- Le bouton « Données KDP » de la barre d'actions ne mène nulle part : il fait défiler vers un bloc `exports-livre` qui n'existe plus dans la page. Rien ne s'ouvre, d'où l'impression que le livre a disparu.
- Le panneau KDP (description, mots-clés, catégories, ZIP) n'existe qu'à l'intérieur du parcours de création, tout en bas, et seulement quand le manuscrit est chargé en mémoire. Depuis « Mes livres » il n'y a aucun accès direct.
- Le bouton « Ouvrir le pilotage détaillé P1 → P15 » de la page Workflow pointe explicitement vers `/ebook-planner`, c'est-à-dire la V2. C'est bien la cause du renvoi vers l'ancien outil.

## Correction proposée

### 1. Une vraie page « Données KDP » par livre

- Nouvelle page V3 dédiée, ouverte avec l'identifiant du livre : elle charge le manuscrit enregistré (et, si besoin, la dernière sauvegarde de version), puis affiche le panneau KDP complet : titre, sous-titre, auteur, description commerciale, catégories, mots-clés, couverture et export.
- Si le manuscrit est encore incomplet, message clair et bouton pour reprendre la rédaction, jamais une page vide.

### 2. Des boutons qui mènent vraiment au livre

- « Mes livres » : ajout d'un bouton **Données KDP** sur chaque livre, à côté de « Ouvrir le livre » et « Exporter ».
- Barre d'actions sous le livre en cours : « Données KDP » ouvre cette page pour le livre courant au lieu de défiler dans le vide ; sans livre enregistré, il propose d'abord l'enregistrement.
- Fin du workflow : après la génération, un lien direct vers les données KDP du livre qui vient d'être créé.

### 3. Le pilotage reste dans la V3

- Le bouton « Ouvrir le pilotage détaillé P1 → P15 » cesse de renvoyer vers la V2 : il ouvre le pilotage des 15 agents à l'intérieur de la V3 (page Workflow / parcours de lancement), avec l'avancement agent par agent.
- Vérification qu'aucun autre bouton de la V3 ne renvoie vers `/ebook-planner`.

### 4. Vérification avant de conclure

- Ouvrir un des deux livres du 20 août depuis « Mes livres », confirmer que les données KDP s'affichent avec la description enregistrée.
- Cliquer « Données KDP » depuis la barre d'actions et depuis la fin du workflow.
- Cliquer le pilotage P1 → P15 et confirmer qu'on reste dans la V3.

## Détails techniques

- Nouvelle page `src/pages/v3public/V3KdpDataPage.tsx` + route `/v3/donnees-kdp` (paramètre `projectId`), protégée comme les autres pages V3.
- Réutilisation de `V3KdpPublishPanel` avec chargement depuis `ebook_projects`, repli sur `ebook_project_versions` et `normalizeManuscript` (même logique que l'export de `V3BookManagerPage`).
- `V3BookActionsBar.tsx` : remplacer le défilement vers `#exports-livre` par un lien vers la nouvelle page.
- `V3BookManagerPage.tsx` : bouton supplémentaire par ligne.
- `V3WorkflowPage.tsx` : remplacer le lien `/ebook-planner` par la destination V3 du pilotage.
