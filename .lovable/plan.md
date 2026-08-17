# Plan — Nouvel onglet « Biographie — Le récit de votre vie »

## Idée validée
Raconter sa vie n'est pas la même chose qu'écrire un livre. On crée donc un espace dédié, séparé du « Sommaire IA », avec ses propres questions, son vocabulaire (souvenirs, personnes, lieux, dates) et une garantie : vos mots sont conservés, jamais résumés.

## Ce que l'abonné verra
- Un nouvel onglet en évidence dans la barre latérale, en haut de la section création : **📖 Biographie — Le récit de votre vie**, badge `Nouveau`.
- Une carte dédiée sur l'accueil V3, avant les autres modules de création.
- Une page à deux colonnes :
  - Gauche : entretien guidé de biographie (voir plus bas).
  - Droite, toujours visible : `Mes souvenirs` (texte intégral, mot pour mot), `Personnes & lieux`, `Frise chronologique`, `Sommaire de ma biographie`.
- Un compteur permanent : `mots que vous avez écrits / mots conservés dans le livre`.

## L'entretien guidé (parcours de vie, pas parcours de livre)
Étapes courtes, une question à la fois, réponses libres et sans limite de longueur :
1. Origines : lieu et année de naissance, famille, contexte.
2. Enfance.
3. École, apprentissage, premiers métiers.
4. Rencontres et amours.
5. Épreuves et tournants.
6. Vie adulte, travail, enfants.
7. Aujourd'hui, ce que vous voulez transmettre.
Chaque réponse est enregistrée comme un souvenir daté et numéroté, visible immédiatement à droite. Aucune réponse n'est reformulée pendant l'entretien.

## Règles propres à la biographie
- Chronologie stricte : les chapitres suivent l'ordre de la vie, jamais un regroupement thématique décidé par l'IA.
- Aucun fait, prénom, lieu ou date inventé : uniquement ce que l'auteur a dit.
- L'IA corrige et développe, elle ne raccourcit jamais : le texte final ne peut pas contenir moins de mots que le souvenir d'origine.
- Le résumé de présentation reste affiché à part, jamais à la place du récit.
- Chaque chapitre indique de quels souvenirs il est issu.

## Sommaire de biographie
- Construit période par période à partir des souvenirs, proposé par tranches (3 chapitres à la fois) et validé par l'auteur.
- Chapitres nommés dans la langue de l'auteur, avec la période couverte (ex. « 1952-1958 — Berck-sur-Mer »).
- Bouton `Recentrer sur ma vie` si une proposition s'éloigne des faits racontés.
- Rédaction bloquée tant que le sommaire n'est pas validé.

## Séparation avec l'existant
- `Sommaire IA (dialogue)` reste tel quel pour les livres classiques (méthode, roman, non-fiction).
- La biographie devient un mode distinct, avec sa propre page, ses propres questions et ses propres garde-fous. Rien n'est retiré à l'existant.

## Détails techniques
- Nouvelle route `/v3/biographie` (page dédiée) + entrée en tête de la section « Créer » dans `src/components/v3public/V3Sidebar.tsx` avec badge `Nouveau`.
- Nouveau composant d'entretien biographique réutilisant la mémoire de conversation existante (`book_conversations`) avec un `mode: 'biography'` dans le brief.
- `src/lib/v3/bookBrief.ts` : ajout d'un mode biographie (souvenirs numérotés déjà présents via `listSourcePassages`, plus champs `period` par chapitre).
- Prompts côté fonction `v3-genie-brief` : jeu d'instructions « biographie » (chronologie stricte, zéro invention, jamais de résumé), sélectionné par le mode.
- Rédaction : le mode biographie transmet les souvenirs assignés au chapitre, en clair, sans compression.
- Carte de mise en avant sur `V3HomePage.tsx`.

## Vérifications
- Saisir 5 souvenirs dont deux très courts : tous restent visibles après rechargement.
- Le sommaire proposé suit l'ordre des années racontées.
- Un chapitre rédigé ne contient jamais moins de mots que les souvenirs qui le composent.
- Le mode livre classique fonctionne comme avant.
