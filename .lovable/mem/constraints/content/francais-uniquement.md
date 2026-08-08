---
name: Français uniquement dans les manuscrits
description: Interdiction du latin, faux latin, pseudo-langues et mots étrangers décoratifs dans les livres générés
type: constraint
---
Tous les textes générés (chapitres, titres, plans, étapes autopilote) doivent être 100 % en français courant.

Interdit : latin, faux latin (« Pactum intra cruorem, matrimonium intra cineres »), langues mortes, mots inventés, pseudo-langues, anglicismes et mots étrangers décoratifs, titres de chapitre en langue étrangère.

Exceptions : noms propres réels, titres d'œuvres réelles, locutions latines réellement courantes en français (a priori…), au maximum une par chapitre.

**How to apply:** la règle `LANGUE_RULE` est injectée dans `complete-book-workflow`, `v3-autopilot-step`, `v3-generate-outline`, `v3-generate-chapter-titles`. Le correcteur `strict-proofread` traduit ces expressions en français dans les deux modes.
