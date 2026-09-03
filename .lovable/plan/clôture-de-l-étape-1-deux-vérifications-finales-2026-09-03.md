# Clôture de l'étape 1 — deux vérifications finales

Aucun fichier, table, interface ou ancien module ne sera modifié. Aucun appel IA, aucun crédit consommé.

## Opération 1 — Suppression des deux comptes de test

1. Lister les comptes dont l'e-mail commence par `rlstest-` (uniquement ceux-là).
2. Contrôler qu'ils ne contiennent aucune donnée : 0 ligne dans `cover_projects`, 0 fichier dans le bucket `covers` (déjà vérifié : bucket vide), et aucune ligne liée dans les autres tables portant un `user_id`.
3. Supprimer uniquement ces deux comptes via l'API d'administration Auth. Aucun autre compte n'est touché.
4. Recontrôler après suppression : aucun compte `rlstest-` restant, aucun résidu de données.

## Opération 2 — Test réel d'expiration d'une URL signée

1. Créer un fichier temporaire minuscule dans le bucket privé `covers`, dans un dossier de test dédié.
2. Générer une URL signée valable 60 secondes.
3. Appel HTTP immédiat → attendu : 200 (le fichier se télécharge).
4. Attente de l'expiration (environ 75 secondes, par vérifications successives).
5. Nouvel appel HTTP avec la **même** URL → attendu : refus (400, `jwt expired`).
6. Suppression du fichier temporaire et vérification que le bucket est de nouveau vide.

## Livrable

Un compte rendu court : comptes supprimés, données trouvées avant suppression, codes HTTP avant et après expiration, confirmation de la suppression du fichier temporaire. Puis arrêt, en attente de votre validation pour l'étape 2.
