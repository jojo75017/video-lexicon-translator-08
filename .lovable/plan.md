# Plan de correction prioritaire V3

## Objectif

Stabiliser le parcours de création V3 pour que :
- le livre soit réellement sauvegardé dans la bibliothèque,
- le brouillon ne disparaisse plus,
- le sommaire soit généré et validé avant le workflow,
- le workflow ne produise plus de chapitres vides ou cassés.

## Diagnostic confirmé

- Le bouton « Sauvegarder brouillon » de `/v3/create` sauvegarde seulement dans le navigateur, pas dans la base.
- La page `/v3/library` lit les livres depuis la table `ebook_projects`, donc les brouillons locaux n’y apparaissent pas.
- La table `ebook_projects` a bien des règles par utilisateur, mais il manque les droits explicites d’accès côté application pour `authenticated`, ce qui peut bloquer la lecture/écriture même si les règles sont bonnes.
- Le workflow final appelle `onComplete(bookData)`, mais la page V3 ne persiste pas automatiquement ce résultat dans `ebook_projects`.

## Étape 1 — Réparer l’accès base pour les livres

Créer une migration courte pour `ebook_projects` :

- donner à l’utilisateur connecté les droits nécessaires pour créer, lire, modifier et supprimer ses propres livres,
- donner au backend les droits complets nécessaires,
- ne rien ouvrir au public anonyme.

Aucune donnée personnelle ne sera rendue publique.

## Étape 2 — Sauvegarder dès le brouillon

Modifier `V3CreateWizard.tsx` pour que « Sauvegarder brouillon » crée ou mette à jour un vrai projet dans `ebook_projects` avec :

- titre,
- auteur,
- synopsis/description,
- catégorie,
- ton,
- nombre de chapitres,
- mots par chapitre,
- personnages,
- statut brouillon via les champs existants.

Le bouton affichera un retour clair :

```text
Sauvegardé dans Mes livres
```

## Étape 3 — Auto-sauvegarde avant lancement du workflow

Quand l’utilisateur clique sur « Générer le livre » :

1. sauvegarder immédiatement le projet en base,
2. conserver l’identifiant du projet,
3. lancer le workflow seulement après cette sauvegarde.

Ainsi, même si la génération plante ou si la page est fermée, le livre reste visible dans « Mes livres ».

## Étape 4 — Sauvegarder automatiquement le livre terminé

Quand le workflow 30 agents se termine :

- récupérer `completedBook`,
- mettre à jour le même projet dans `ebook_projects`,
- remplir les chapitres générés,
- remplir la conclusion/préface si disponibles,
- conserver la couverture si elle existe.

Résultat : le livre final apparaît dans « Terminés » dans la bibliothèque.

## Étape 5 — Ajouter une étape « Sommaire » avant génération

Ajouter une étape visible dans `/v3/create` :

```text
Idée -> Style -> Sommaire -> Personnages -> Titre -> Génération
```

Dans cette étape :
- bouton « Générer le sommaire »,
- affichage de tous les chapitres,
- modification manuelle des titres/objectifs,
- ajout/suppression de chapitres,
- validation obligatoire avant génération.

Chaque chapitre devra avoir un vrai titre, pas « Chapitre 1 ».

## Étape 6 — Injecter le sommaire validé dans le workflow

Le sommaire validé sera transmis au workflow dans la configuration du livre, pour que les 30 agents suivent la structure choisie au lieu de la réinventer.

## Étape 7 — Corriger la fonction de génération qui produit les sommaires cassés

Dans `complete-book-workflow` :

- nettoyer les titres contenant des morceaux JSON cassés,
- refuser les titres génériques,
- arrêter les remplissages automatiques du type « À détailler »,
- augmenter les limites de génération pour les livres longs,
- utiliser un fallback propre basé sur le titre, le synopsis et la catégorie si l’IA renvoie une structure invalide.

## Résultat attendu

Le parcours devient fiable :

```text
Assistant IA -> réglages -> sommaire validé -> sauvegarde base -> workflow -> livre terminé sauvegardé
```

Tu ne devras plus refaire un livre perdu, et la bibliothèque deviendra la source fiable de tous les projets.