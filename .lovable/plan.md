# Plan — Supprimer les doublons dans la génération d'ebook

## Problème constaté
Les 4 types de doublons viennent tous de la même cause racine : **chaque chapitre est rédigé sans connaître le contenu des autres**. Aujourd'hui l'IA reçoit la synopsis + un résumé du chapitre précédent, mais pas la liste complète des chapitres ni de consigne anti-répétition. Elle réintroduit donc le contexte, les personnages et des passages déjà écrits ailleurs, et le plan peut contenir des titres qui se recoupent.

## Objectif
Faire en sorte qu'un ebook regénéré (ex. ton thriller « Le Chuchoteur de l'Oubli ») n'ait plus : passages répétés, titres similaires, réintros de contexte, ni chapitres en double — sans toucher au backend, aux prix ni au workflow V3.

## Corrections (toutes dans `src/hooks/useSubscriptionGeneration.ts`)

### 1. Plan : titres uniques et périmètres distincts
Renforcer le prompt de `generateEbookPlan` :
- Exiger des **titres de chapitres tous différents**, sans recoupement thématique.
- Demander que **chaque chapitre couvre une étape distincte** de l'arc narratif (situation → montée → climax → résolution), sans zone qui empiète sur une autre.
- Interdire explicitement de répéter un même événement/thème dans plusieurs chapitres.

### 2. Chapitre : passer le plan complet + anti-répétition
Modifier `generateChapterContent` pour recevoir et injecter la **liste de tous les titres de chapitres** (numérotés), avec des consignes :
- « Rédige UNIQUEMENT ce qui relève de ce chapitre. Les autres chapitres traitent les sujets ci-dessus — n'empiète pas dessus. »
- « Ne réintroduis PAS le contexte, le décor ou les personnages déjà présentés : suppose que le lecteur a lu les chapitres précédents. »
- « Ne réutilise aucune phrase, formule d'accroche ni passage déjà écrit ailleurs. »

Mettre à jour l'appel dans `src/pages/EbookPlannerPage.tsx` (boucle de génération, ~ligne 1064) pour transmettre `currentChapters` (tous les titres) à `generateChapterContent`.

### 3. Garde-fou de déduplication (après génération du plan)
Dans `generateEbookPlan`, après le parsing JSON :
- **Dédupliquer les titres** identiques ou quasi identiques (comparaison normalisée : minuscules, sans accents/ponctuation). Si un doublon est détecté, le renuméroter/renommer ou le retirer et compléter pour garder `numberOfChapters`.
- Garantir qu'aucun chapitre en double ne subsiste dans la liste renvoyée.

### 4. Détection visuelle des passages répétés (léger, front)
Dans `EbookPlannerPage.tsx`, ajouter une petite vérification en mémoire (après génération complète) qui repère les paragraphes quasi identiques présents dans ≥ 2 chapitres et affiche un `toast.warning` non bloquant listant les chapitres concernés, pour que l'auteur puisse relancer/corriger ces chapitres ciblés. Aucune modification automatique du texte.

## Hors périmètre
- Aucun changement backend, base de données, tarifs ni workflow V3.
- Pas de réécriture automatique du contenu existant (non destructif).
- Le compteur chapitres/sous-chapitres/pages/mots déjà en place n'est pas modifié.

## Détails techniques
- `generateChapterContent(chapter, wordsPerChapter, synopsis, chapterIndex, totalChapters, previousChapterSummary, allChapterTitles?)` — ajout d'un paramètre optionnel `allChapterTitles: string[]` injecté dans le prompt.
- Normalisation pour la dedup : `str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()`.
- Détection de paragraphes dupliqués : découpe par `\n\n`, ignore les paragraphes < 40 mots, compare les versions normalisées, signale les collisions inter-chapitres.
