## Problème

Sur la page V3 (cockpit admin), plusieurs modules affichent « En cours » alors que rien n'a avancé. La raison : le statut de chaque module est **écrit à la main** dans `src/data/roadmapV3.ts` (`status: 'in_progress'`), il n'est pas calculé d'après ce qui est réellement codé. Résultat : l'affichage ne reflète pas la réalité et on ne sait pas quoi avancer.

## Réalité du code

Dans `AdminCockpitPage.tsx`, seuls 11 modules sont **réellement construits** : ils ont un composant qui s'ouvre quand on clique dessus. Ce sont :

```text
SCOUT (P16)            → ScoutAnalysis
SAGA (P17)             → SagaArchitect
LUMEN (P18)            → LumenReadability
ÉCHO (P19)             → EchoAuthorVoice
ORACLE (P20)           → OracleManuscript
DUEL (P21)             → DuelBlurb
VIGIE (P22)            → VigieTrends
INTEL — Intelligence de Niche → NicheIntelligence
Optimiseur d'annonces KDP     → ListingOptimizer
STUDIO — Création de Livres   → BookCreationStudio
BIBLIOTHÈQUE — Mes Créations  → LibraryModule
```

Tous les autres modules **n'ont aucun composant** branché : ils ne sont pas faits. En particulier `Couverture KDP Exacte (PDF)` est marqué « En cours » mais n'est branché nulle part dans le cockpit.

## Correction proposée

Mettre les statuts en accord avec le code, pour qu'un coup d'œil suffise à voir ce qui est fait :

1. **Passer en « Fait » (`done`)** les 11 modules réellement construits listés ci-dessus.
2. **Passer en « En attente » (`todo`)** tous les modules qui n'ont pas de composant branché — y compris ceux aujourd'hui faussement marqués « En cours » (ex. `cover-pdf-exact`).
3. Plus aucun module ne reste en `in_progress`, sauf si tu m'indiques précisément un chantier que tu considères « en cours de construction » (dans ce cas je le garde en `in_progress`).

Aucune logique n'est touchée : on ne modifie que les valeurs `status` dans `src/data/roadmapV3.ts`. L'affichage des couleurs/badges (Fait / En cours / En attente) existe déjà et se mettra à jour automatiquement.

## Détails techniques

- Fichier unique modifié : `src/data/roadmapV3.ts`.
- Éditer le champ `status` de chaque entrée de `V3_MODULES` selon les règles ci-dessus.
- Aucun changement de composant, de route, ni de backend.

## Vérification

- Ouvrir `/admin-cockpit` en mode V3.
- Confirmer que les 11 modules branchés affichent le badge « Fait » (vert) et s'ouvrent au clic.
- Confirmer qu'aucun module non construit n'affiche plus « En cours » : ils sont tous en « En attente ».
