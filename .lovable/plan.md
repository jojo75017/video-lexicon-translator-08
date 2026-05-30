# Ajout de modules V3 « en attente » à partir des captures

## Contexte
Les 6 captures correspondent aux modules 03→08 d'un guide de publication KDP. On garde l'existant tel quel (rien ne change pour la V2). On ajoute uniquement dans le dossier/fichier V3 existant `src/data/roadmapV3.ts` les idées **nouvelles**, toutes en statut `todo` (= en attente).

## Comparaison capture ↔ existant
- **03 – Couverture qui attire le clic (6 variantes + test miniature 200×300)** → l'existant `cover-pdf-exact` gère le PDF KDP exact, mais PAS la génération de 6 variantes + test miniature. → **Nouveau module.**
- **04 – Description qui vend (structure 5 parties + mots de conversion)** → pas de module dédié dans V3. → **Nouveau module.**
- **05 – Mots-clés (7 emplacements) & catégories (10 max)** → recherche mots-clés déjà en V2 ; mais le **Gestionnaire de catégories 10/livre** (2 + 8 supplémentaires) n'existe pas. → **Nouveau module.**
- **06 – Prix / redevances 70 %** → déjà couvert par `auto-pricing`. → rien à ajouter.
- **07 – Lancement velocity / équipe ARC** → `launch-sequence-j7` + `reviews-booster` existent, mais pas un **Constructeur d'équipe ARC** (recrutement 10–30 lecteurs, objectifs d'avis J14/J30/J60). → **Nouveau module.**
- **08 – Séries / formats multiples** → déjà couvert par `multi-format-express`, `bundles-boxsets`, `p17-series`. → rien à ajouter.

## Modules à ajouter (tous `status: 'todo'`)
1. `cover-variants-thumbnail` — pilier **publier** : « Cover Designer 6 Variantes + Test Miniature » — génère 6 couvertures et les affiche en 200×300 px pour valider la lisibilité du titre dans les résultats Amazon.
2. `sales-description` — pilier **monetiser** (ou marketing) : « Description Vendeuse (5 parties) » — accroche, agitation, promesse, 5–7 bénéfices, CTA + mots de conversion, longueur 1500–2500 caractères.
3. `categories-manager-10` — pilier **publier** : « Gestionnaire de Catégories 10/livre » — choix de 2 catégories optimales + demande des 8 catégories supplémentaires via support KDP.
4. `arc-team-builder` — pilier **marketing** : « Constructeur d'Équipe ARC » — recrutement de 10–30 lecteurs, envoi manuscrit, suivi des objectifs d'avis (10 à J14, 25 à J30, 50 à J60).

## Détails techniques
- Fichier unique modifié : `src/data/roadmapV3.ts`.
- Ajout de 4 entrées dans le tableau `V3_MODULES`, dans les sections correspondantes (commentaires PUBLIER / MONÉTISER / MARKETING).
- Aucun changement de prix, de pilier meta, ni de code applicatif. Les modules apparaîtront automatiquement dans la roadmap V3 existante avec le statut « en attente ».
- Pas de duplication avec les modules déjà présents (06 et 08 volontairement non dupliqués).
