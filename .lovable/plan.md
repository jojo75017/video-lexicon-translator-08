# Sommaire Stratégique : un plan de livre qui vise le marché, pas seulement l'esthétique

Changement d'ambition : on ne fait plus « un sommaire mieux édité », on fait un **sommaire qui sait pourquoi chaque chapitre existe** — appuyé sur la demande Amazon, sur votre récit, et directement exploitable pour l'écriture et la fiche produit KDP.

## 1. Le sommaire part de la demande réelle du marché

- Avant de proposer des chapitres, le Génie interroge les données de niche déjà branchées (Espion Amazon / mots-clés KDP) sur votre sujet.
- Il en tire les **questions que les lecteurs se posent réellement** et les **manques des livres concurrents**.
- Chaque chapitre proposé affiche : la question lecteur qu'il traite, le mot-clé porteur associé, et si les concurrents la traitent déjà ou non (« angle libre »).
- Un bouton **« Chapitres que personne ne traite »** génère les 3 chapitres différenciants du livre.

## 2. Un score d'attractivité, chapitre par chapitre

Chaque ligne du sommaire reçoit une note claire (fort / moyen / faible) sur 4 critères :

- promesse : le titre donne-t-il envie d'ouvrir le chapitre ;
- utilité : apporte-t-il une réponse ou juste du remplissage ;
- appui : repose-t-il sur votre récit / vos faits, ou l'IA a-t-elle inventé ;
- position : arrive-t-il au bon moment dans la progression.

Sur un chapitre faible : **« Améliorer ce chapitre »** propose 3 titres plus forts avec la raison du changement. On voit donc **quoi corriger**, pas seulement une liste propre.

## 3. Budget du livre calculé avant d'écrire

Un bandeau au-dessus du sommaire : mots visés par chapitre, total du livre, **pages KDP estimées**, prix conseillé et royalties correspondantes.
On ajuste le nombre de chapitres ou la longueur cible, et les chiffres bougent en direct. Le sommaire devient une décision d'édition, plus un simple plan.

## 4. Le sommaire pilote vraiment la rédaction

- Chaque chapitre porte ses **points à traiter** (3-6 puces) + une note privée à l'auteur.
- Ces points sont envoyés au rédacteur : le chapitre écrit suit le plan validé, plus de dérive ni de résumé.
- **Zéro trou** : la couverture de votre récit est vérifiée (« 4 passages sur 37 ne sont dans aucun chapitre ») avec bouton pour créer les chapitres manquants.
- **Zéro doublon** : deux chapitres qui racontent la même chose sont signalés et fusionnables en un clic.

## 5. Deux structures comparées, vous tranchez

- **« Proposer une autre structure »** : une variante complète du plan, affichée côte à côte, avec le score de chacune. On adopte l'une, ou on récupère chapitre par chapitre.
- Historique de versions déjà en place, complété d'un libellé et d'un aperçu des différences (ajoutés / retirés / renommés).

## 6. Manipulation et sortie

- Glisser-déposer, fusionner, scinder, insérer, dupliquer, annuler / rétablir.
- **Export du sommaire** (texte, Word, PDF habillé or) et **« Copier pour la fiche Amazon »** : version courte du sommaire prête à coller dans la description KDP.
- Verrou après validation, déverrouillage explicite qui préserve les chapitres déjà écrits.

## Détails techniques

- `src/lib/v3/bookBrief.ts` : `BriefOutlineChapter` gagne `points?: string[]`, `note?: string`, `keyword?: string`, `readerQuestion?: string`, `score?: { promesse; utilite; appui; position }` ; helpers `mergeChapters`, `splitChapter`, `insertChapterAt`, `moveChapter`, `outlineCoverage(outline, passages)`, `outlineDuplicates`.
- Nouveau `src/lib/v3/outlineScore.ts` : calcul local du score (titre générique, longueur, absence de passage source, redite) + appel IA seulement pour la reformulation d'un chapitre faible — pas de dépense IA sur le score.
- Nouveau `src/lib/v3/outlineBudget.ts` : mots par chapitre → total → pages KDP (réutilise `kdpPageDensity.ts`) → prix conseillé / royalties.
- Nouveau `src/lib/v3/outlineHistory.ts` : annuler / rétablir (10 pas).
- `supabase/functions/v3-genie-brief/index.ts` : modes `outline-market` (questions lecteurs + angles libres à partir des données de niche), `outline-points`, `outline-variant`, `outline-improve` (3 titres plus forts pour un chapitre), `outline-fill-gaps`. Repli clé utilisateur → clé serveur → Lovable AI, 100 % français, aucun titre générique.
- Données marché : réutilise l'analyse de niche Amazon existante (Firecrawl / mots-clés KDP) ; si aucune donnée n'est disponible, le sommaire fonctionne sans le volet marché (dégradation propre, aucun blocage).
- Nouveaux composants : `V3OutlineScoreBar.tsx`, `V3OutlineBudgetBar.tsx`, `V3OutlineChapterRow.tsx` (drag, actions, points, note, score), `V3OutlineVariantCompare.tsx` — intégrés dans `V3OutlinePanel.tsx` et `V3OutlineCoBuilder.tsx`, glisser-déposer HTML5 natif, aucune nouvelle dépendance.
- Export : réutilise `docxExportEngine` ; `saveOutlineVersion` accepte un `label`. Aucune nouvelle table, aucun changement de tarif ni de quota.
