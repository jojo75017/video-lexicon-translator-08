# Partir d'une niche → fiche du livre déjà remplie

Objectif : sur la page des 600 niches, un bouton « Commencer mon livre » remplit immédiatement la fiche de création (titre, sous-titre, catégorie, nom de l'auteur, synopsis, nombre de chapitres, nombre de mots) et ouvre le parcours d'écriture. Oui, c'est possible pour les 600 niches.

## Ce que verra l'abonné

1. Sur `/niches-600`, chaque ligne de niche reçoit un bouton « Commencer mon livre ».
2. Un petit panneau s'ouvre avec la fiche pré-remplie et modifiable :
   - Titre proposé
   - Sous-titre (promesse)
   - Catégorie (celle de la niche)
   - Nom de l'auteur (repris de son profil, modifiable)
   - Synopsis (5 à 8 lignes)
   - Nombre de chapitres et nombre de mots par chapitre
3. Deux choix : « Proposer avec l'IA » (utilise sa clé déjà configurée pour un titre et un synopsis sur mesure) ou garder la proposition immédiate, disponible sans clé.
4. « Ouvrir le parcours » envoie vers la création du livre avec tous les champs déjà remplis ; il n'a plus qu'à valider le sommaire et lancer l'écriture.

Le même bouton sera ajouté sur les listes de niches déjà offertes (packs 5 et 10 niches) pour garder un comportement identique.

## Valeurs de départ par niche

Rien d'inventé côté chiffres de marché : on n'utilise que les données déjà présentes dans la base des niches (niche, sous-niche, mot-clé, catégorie).

- Fiction (romance, thriller, fantasy, jeunesse) : 24 chapitres, 2 500 mots.
- Non-fiction (développement personnel, finance, santé, cuisine, pratique, spiritualité, parascolaire) : 12 chapitres, 2 200 mots.
- Carnets et journaux : 10 chapitres, 1 800 mots.

Ces valeurs restent modifiables avant de lancer, et respectent la limite existante de 40 chapitres.

## Détails techniques

- Nouveau module `src/lib/v3/nicheToBrief.ts` : convertit un `Niche600` en brouillon de fiche (titre, sous-titre, synopsis, catégorie, chapitres, mots), de façon déterministe (aucun `Math.random`).
- Nouveau composant `src/components/v3public/NicheStartDialog.tsx` : panneau de confirmation avec champs éditables, bouton « Proposer avec l'IA » (réutilise l'appel titre/sous-titre/synopsis déjà présent dans `V3CreateWizard`, clé de l'abonné) et bouton d'ouverture du parcours.
- `src/pages/Niches600Page.tsx` : ajout du bouton par ligne + ouverture du panneau. Pas de changement de filtres, tri, export CSV.
- Écriture via `writeBookBrief` de `src/lib/v3/bookBrief.ts` (`title`, `subtitle`, `author`, `category`, `description`, `chapters`, `wordsPerChapter`, `creationPath`), puis navigation vers `/v3/create`.
- `src/components/v3public/V3CreateWizard.tsx` : lire `startingBrief.wordsPerChapter` à l'initialisation (aujourd'hui seul 2 500 par défaut est appliqué) et `startingBrief.author`, afin que le nombre de mots et l'auteur arrivent bien pré-remplis. Isolation par `projectId` conservée.
- Nom de l'auteur : profil abonné (`useSubscriberProfile`), sinon la valeur actuelle par défaut.
- Non touchés : base de données, sécurité, calculs KDP, crédits, paiements, tarifs.

## Vérifications

- `npx tsgo --noEmit` et les tests existants.
- Contrôle navigateur connecté : ouvrir une niche romance et une niche finance, vérifier que les 7 champs arrivent remplis dans le parcours et restent modifiables.
