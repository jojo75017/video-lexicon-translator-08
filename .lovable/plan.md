## Objectif

Le bloc d'export multi-format du livre reste **toujours visible en haut** du parcours (comme aujourd'hui), mais on ajoute **un second bloc d'export contextuel** qui n'apparaît qu'une fois **toute la Phase 6 — Mise en page** validée (les 3 étapes cochées : préparer le manuscrit, rédiger les pages de fin/remerciements, générer la page copyright).

Ainsi l'utilisateur voit l'export apparaître naturellement au bon moment du parcours, juste après avoir terminé les pages de remerciements et la mise en page — sans perdre l'accès rapide du haut.

## Comportement

- **Bloc du haut** : inchangé, toujours affiché.
- **Nouveau bloc contextuel** : affiché uniquement quand les étapes cœur de la Phase 6 sont toutes cochées (`manuscript-converter`, `back-matter-builder`, `copyright-page`). Tant qu'elles ne sont pas toutes validées, il reste masqué.
- Ce bloc s'affiche à la fin de la carte de la Phase 6 (mise-en-page), avec un court libellé du type « Ta mise en page est prête — exporte ton livre ».

## Détails techniques

Fichier : `src/components/admin/V3Workflow30.tsx`

1. Calculer un booléen `miseEnPageDone` = les 3 `moduleId` cœur de la phase `mise-en-page` sont tous dans le set `done` (on ignore l'étape premium `quality-label`).
2. Dans le rendu de la carte de phase (bloc `PHASES.filter(...).map`), lorsque `phase.key === 'mise-en-page'` et que la phase est ouverte (ou en bas de la carte), afficher conditionnellement un `<V3ExportPanel />` avec les mêmes props que le bloc du haut (`manuscript`, `title`, `subtitle`, `author`) précédé d'un petit intitulé vert, uniquement si `miseEnPageDone`.
3. Aucune modification du bloc d'export existant en haut (lignes ~1319-1327).

Aucune logique métier ni format d'export modifié : uniquement le placement/conditionnel d'affichage.