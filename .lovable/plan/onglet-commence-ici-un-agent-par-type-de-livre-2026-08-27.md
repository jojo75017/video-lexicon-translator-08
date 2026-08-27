# Onglet « Commence ici » — un agent par type de livre

Objectif : un seul point d'entrée en haut de la barre latérale, **« 🚀 Commence ici »**, qui affiche tous les agents-personnages. Chaque encart = un agent + son type de livre, et le clic ouvre directement la page de création correspondante (déjà existante). Création visuelle 100 % originale : pas de reprise de la grille « Book Agents » vue ailleurs (ni prénoms anglais Emma/James/Sophia, ni médaillons ronds, ni fond violet/néon).

## La grille des agents (un agent = une catégorie de livre)

Chaque agent est branché sur une page déjà en place (`/v3/livres/<type>` ou l'outil dédié).

| # | Agent | Sa spécialité | Ouvre |
|---|-------|---------------|-------|
| 01 | Camille | Structure & sommaire stratégique | Sommaire IA |
| 02 | Victor | Roman / récit long | Roman |
| 03 | Noémie | Livres enfants & histoires du soir | Histoires courtes & contes illustrés |
| 04 | Basile | Business, méthode, développement pro | Roman/guide (mode non-fiction) |
| 05 | Margaux | Livre de cuisine & recettes | Cuisine |
| 06 | Léandre | Guide de voyage | Voyage |
| 07 | Prune | Coloriages & cherche-et-trouve | Coloriage + Cherche & Trouve |
| 08 | Gaspard | Niches & données Amazon | Espion Amazon / niches |
| 09 | Iris | Couvertures & direction artistique | Cover Studio Pro |
| 10 | Aurèle | Correction éditoriale professionnelle | Correcteur |
| 11 | Solène | Marketing, fiche produit, mots-clés KDP | Données KDP / mots-clés |
| 12 | Timothée | Traduction 10 langues & audio | Traducteur + audio |
| 13 | Hugo | BD / Manga | BD |
| 14 | Ariane | Atlas & encyclopédie | Atlas, Encyclopédie |
| 15 | Félix | Documentaire & manuel scolaire | Documentaire, Scolaire |
| 16 | Clémence | Agenda, planner, journal | Agenda, Journal |
| 17 | Oscar | Jeux & énigmes, cahiers d'activités | Jeux & Énigmes |
| 18 | Théa | Fiches nature (oiseaux, aquariophilie) | Oiseaux, Aquariophilie |
| 19 | Nathan | Saga multi-tomes & univers | Saga, Univers |
| 20 | Zoé | Workflow complet 15 agents | Workflow 15 Agents |

Aucune catégorie de livre existante n'est laissée sans agent : toutes les entrées de la liste des livres spéciaux (18 types) sont couvertes, plus les agents transverses (sommaire, couverture, correction, KDP, traduction, workflow).

## Contenu d'un encart

- Portrait du personnage (illustration couleur maison, style « atelier d'édition », cohérent d'un agent à l'autre).
- Prénom + une ligne de mission.
- 2 ou 3 livrables concrets (« 30 recettes + photos + fiche KDP »).
- Bouton **« Commencer avec … »** → route directe vers la page de création.
- Badge « Inclus dans votre formule » ou cadenas si l'outil est réservé.

## Identité visuelle (anti-plagiat)

- Palette maison V3 : fond clair, émeraude/or, texte encre — jamais le violet néon du modèle montré.
- Cartes rectangulaires, portrait en bandeau haut, numéro en filigrane, pas de médaillon rond centré.
- Illustrations générées spécialement pour Ebookstudio (personnages colorés, cohérents, sans texte incrusté).
- Grille responsive : 2 colonnes mobile, 3 tablette, 4 desktop, avec filtres rapides (Fiction / Enfants / Pratique / Publier / Vendre).

## Technique

- `src/data/v3Agents.ts` : source unique (id, prénom, mission, livrables, catégorie de filtre, route, avatar, accès requis).
- `src/components/v3public/V3AgentsStartGrid.tsx` : la grille + les filtres.
- Nouvelle page `src/pages/v3public/V3StartHerePage.tsx`, route `/v3/commence-ici`.
- `V3Sidebar.tsx` : entrée « 🚀 Commence ici » en tout premier ; tuile équivalente en haut de `/v3`.
- Avatars : 20 illustrations générées puis importées depuis `src/assets/agents/`.
- Routes réutilisées telles quelles (`/v3/livres/:type`, Cover Studio, correcteur, traducteur, workflow) : aucun nouveau moteur, aucun changement de tarif ni de quota.

## Suite

Un audit complet des agents et des pages qu'ils ouvrent est prévu juste après, pour vérifier que chaque bouton mène bien à un outil fonctionnel.
