# Les 10 Spécialistes IA d'Ebookstudio — un agent, une mission

Objectif : l'abonné ne choisit plus un « outil » mais un **spécialiste** qui sait exactement quel type de livre produire. Chaque spécialiste porte un nom propre à Ebookstudio (aucun nom repris ailleurs), un domaine unique, un brief adapté et un module déjà existant derrière lui.

## Les 10 spécialistes (noms originaux Ebookstudio)

| # | Spécialiste | Domaine | Ce qu'il produit |
|---|---|---|---|
| 1 | **Camille** | Histoires pour enfants | Contes illustrés 3-10 ans, texte + images cohérentes |
| 2 | **Victor** | Business & marketing | Guides pro, méthodes, études de cas |
| 3 | **Noémie** | Maths, puzzles, énigmes | Grilles, problèmes, corrigés vérifiés |
| 4 | **Basile** | Livres interactifs | Cahiers d'exercices, checklists, plannings |
| 5 | **Iris** | Coloriage enfant & adulte | Planches au trait, mandalas, cherche & trouve |
| 6 | **Gaspard** | Pratique & tutoriels | Pas-à-pas, manuels, fiches techniques |
| 7 | **Prune** | Cuisine & nutrition | Recettes, plans de repas, tables nutritionnelles |
| 8 | **Aurèle** | Développement personnel | Confiance, productivité, motivation, exercices |
| 9 | **Solène** | Romance & fiction | Nouvelles, romans courts, arcs narratifs |
| 10 | **Timothée** | Éducatif & scolaire | Sciences, histoire, fiches de révision |

Chaque fiche affiche : nom, domaine, 1 phrase de mission, 3 exemples de livres réalisables, et un bouton **« Confier mon livre à … »** qui ouvre le bon module avec le brief pré-réglé.

## Nouvel écran « Mes spécialistes IA »

- Route : `/v3/specialistes`, accessible depuis la barre latérale (au-dessus de Fonctionnalités) et depuis l'accueil V3.
- Grille de 10 cartes (identité visuelle V3 : fond clair, accents teal/or), recherche par mot-clé (« coloriage », « recette », « énigme ») qui met en avant le bon spécialiste.
- Bloc d'accroche en tête, reprenant la promesse : écrire n'importe quel livre en quelques minutes, dans n'importe quelle langue, 100 % des droits, vente sur KDP / Etsy / Gumroad / site.
- Chaque carte indique aussi si le spécialiste est inclus dans le forfait de l'abonné ou verrouillé (essai gratuit : Camille, Victor, Aurèle, Solène, Timothée ; les autres restent visibles avec cadenas).

## Une mission réellement différente par spécialiste

Aujourd'hui les types de livres partagent en grande partie le même prompt. Chaque spécialiste reçoit :

- un **rôle éditorial** (ce qu'il est, pour qui il écrit) ;
- des **règles de forme** propres (longueur de chapitre, présence d'illustrations, ton, niveau de langue, mise en page KDP attendue) ;
- des **contrôles de sortie** propres : Noémie vérifie ses corrigés, Prune vérifie quantités et temps de cuisson, Camille borne le vocabulaire par âge, Iris ne produit que du trait exploitable en impression, Timothée cite un niveau scolaire.

Le français reste imposé partout (aucun mot latin ni inventé), avec choix de la langue de sortie en début de projet.

## Détails techniques

- Nouveau fichier source unique `src/data/aiSpecialists.ts` : `id`, `name`, `domain`, `mission`, `examples[]`, `route`, `moduleId`, `promptProfile`, `trialAllowed`.
- Nouveau composant `src/components/v3public/V3SpecialistsGrid.tsx` + page `src/pages/v3public/V3SpecialistsPage.tsx`, route ajoutée dans `src/App.tsx`, entrée ajoutée dans `V3Sidebar.tsx`.
- Routage vers l'existant, sans dupliquer de générateur : histoires illustrées, jeux & énigmes, cherche & trouve, coloriage, cuisine, documentaire, scolaire, roman, workflow 15 agents, correcteur — tous déjà en place (`SPECIAL_BOOK_TABS`, `v2ToolsRegistry`).
- Les profils de prompt sont ajoutés côté Edge Functions existantes (`complete-book-workflow`, `short-stories-generate`, `strict-proofread`) via un paramètre `specialist` : un bloc d'instructions par spécialiste, sans toucher aux moteurs.
- Verrouillage réutilisé tel quel : `TrialGate` / `TRIAL_LOCKED_PATHS` pour les spécialistes non inclus dans l'essai.
- Les 15 agents du pipeline (P1→P15) restent inchangés : les 10 spécialistes sont la porte d'entrée, le pipeline reste le moteur.

## Ordre de réalisation

1. Fichier des 10 spécialistes + page et grille `/v3/specialistes`, liens sidebar et accueil.
2. Branchement de chaque bouton sur le bon module avec brief pré-rempli.
3. Profils de prompt par spécialiste dans les Edge Functions + contrôles de sortie spécifiques.
4. Verrouillage essai / forfait, puis test réel d'un livre par spécialiste sur 3 cas (Camille, Noémie, Prune).
