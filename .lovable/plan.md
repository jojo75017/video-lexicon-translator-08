# 10 Spécialistes IA — identité visuelle originale

Objectif : quand la grille des 10 agents sera activée (prévu septembre), chaque agent aura son propre personnage — création 100 % originale, aucune reprise de la grille « Book Agents » vue ailleurs (ni les prénoms anglais Emma/James/Sophia…, ni les badges violets, ni la mise en page en 2 × 5 cartes rondes sur fond violet).

## Les 10 personnages (prénoms français déjà validés)

| # | Agent | Spécialité |
|---|-------|-----------|
| 01 | Camille | Structure & sommaire stratégique |
| 02 | Victor | Rédaction longue (romans, récits) |
| 03 | Noémie | Livres enfants & histoires du soir |
| 04 | Basile | Business, méthode, développement pro |
| 05 | Iris | Couvertures & direction artistique |
| 06 | Gaspard | Recherche de niches & données Amazon |
| 07 | Prune | Cahiers d'activités, jeux, coloriages |
| 08 | Aurèle | Correction éditoriale professionnelle |
| 09 | Solène | Marketing, fiche produit, mots-clés KDP |
| 10 | Timothée | Traduction & audio (10 langues) |

Chaque fiche : prénom, rôle en une ligne, 3 livrables concrets, bouton « Travailler avec … » qui ouvre l'outil correspondant déjà existant dans la V3.

## Identité visuelle (anti-plagiat)

- Portraits photoréalistes générés spécialement pour Ebookstudio (pas d'illustration cartoon / style « stock IA »), cadrage buste, lumière atelier d'édition.
- Palette maison : fond clair #FAFAFA, accent teal #008296, texte #232F3E, filet or discret — jamais le violet/néon du modèle montré.
- Mise en page distincte : cartes rectangulaires en grille responsive avec bandeau prénom en bas, numéro en filigrane, pas de médaillon rond.
- Avatars stockés comme assets du projet et réutilisés partout (grille, en-tête d'outil, messages du copilote).

## Technique

- Nouveau `src/data/v3Specialists.ts` : source unique (id, prénom, rôle, spécialité, livrables, route de l'outil, avatar).
- Nouveau composant `V3SpecialistsGrid.tsx` + page `/v3/specialistes`, entrée dans `V3Sidebar`.
- Avatars générés via l'outil d'images (10 fichiers) puis importés depuis `src/assets`.
- Aucun changement de tarifs ni de logique métier dans ce lot : uniquement la présentation des agents et le branchement vers les outils existants.

## Reste en attente

Le passage au tarif unique de lancement et la mise à niveau des anciens clients restent gelés jusqu'à votre feu vert, indépendamment de ce lot visuel.
