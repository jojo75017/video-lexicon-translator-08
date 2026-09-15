# Sommaire : retrouver les 40 chapitres de « Noces de Vendetta »

## Ce qui est confirmé

- En base, le livre « Noces de Vendetta » contient bien **40 chapitres**, tous avec leur titre et leur texte (de « L'Ombre du Sang » à « La piste qui déraille — seconde vague »). Rien n'est perdu.
- Le brouillon de travail enregistré pour ce livre est vide : il n'y a donc **aucun texte source** côté écran quand on ouvre le livre.
- Dans l'écran « Mon sommaire », le nombre de chapitres visé est calculé à partir du texte source saisi à l'écran. Sans texte source, ce calcul retombe sur le minimum (3), ce qui explique un sommaire réduit à 3-4 lignes au lieu des 40 existants.
- Ce même écran peut remplacer un sommaire existant par une nouvelle proposition courte sans demander confirmation.

Ce que je ne peux pas encore affirmer : si l'affichage à 4 chapitres vient de ce calcul ou d'un remplacement déjà effectué. La première étape ci-dessous le vérifie avant toute correction.

## Étape 1 — Vérifier l'écran

Ouvrir le livre dans le navigateur et relever ce que l'écran contient réellement (nombre de chapitres chargés, sommaire affiché, texte source). Aucune génération, aucun crédit consommé.

## Étape 2 — Le sommaire suit toujours le livre ouvert

- À l'ouverture d'un livre, le sommaire affiché reprend les chapitres réellement enregistrés (ici 40), titres compris, et le nombre visé est aligné sur ce nombre.
- Sans texte source à l'écran, le nombre visé ne retombe plus au minimum : il garde le nombre de chapitres du livre.
- Le nombre visé devient réglable à la main (3 à 40) avec un rappel au-delà de 30.

## Étape 3 — Ne jamais écraser un sommaire existant sans accord

- Une nouvelle proposition de sommaire sur un livre qui en a déjà un demande une confirmation claire : « Remplacer le sommaire de 40 chapitres ? »
- Le bouton « Annuler » de l'écran sommaire permet de revenir au sommaire précédent.
- Un repère visible indique : « Livre ouvert : Noces de Vendetta — 40 chapitres enregistrés ».

## Limites respectées

Aucune modification de la base de données, de la sécurité, des calculs KDP, des paiements ni des crédits. Aucun texte de chapitre existant n'est réécrit.

## Détails techniques

- `src/pages/v3public/V3CreatePage.tsx` : le brief écrit à l'ouverture fixe `chapters` sur la longueur réelle de `ebook_projects.chapters` (déjà le cas) et cette valeur doit être respectée en aval.
- `src/components/v3public/V3OutlineCoBuilder.tsx` : `target` calculé via `suggestChapterCount(sourceWords)` retombe à `CHAPTER_MIN` (3) quand `sourceWords > 0` mais faible, et n'utilise `brief.chapters` que si `sourceWords === 0` ; à corriger en `Math.max(suggested, outline.length, Number(brief.chapters) || 0)`.
- `src/components/v3public/V3OutlinePanel.tsx` : `generate()` / `applyOutline()` remplacent `brief.outline` sans confirmation → ajouter un garde-fou quand `outline.length >= 3`.
- Vérification : `npx tsgo --noEmit -p tsconfig.app.json` + tests Vitest existants du dossier v3.
