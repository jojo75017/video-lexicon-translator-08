# Écrire son livre sans passer par le sommaire

Aujourd'hui, sur la page de création, l'abonné doit traverser les cinq étapes (fiche, style, sommaire, personnages, titre) avant de lancer la rédaction. Le sommaire n'est pas bloquant — il est complété automatiquement si on le laisse vide — mais il faut quand même passer devant, ce qui allonge inutilement le parcours.

## 1. Bouton « Écrire maintenant » dès la fiche du livre

- Dès l'étape 1, sous le bouton habituel, un second bouton **« Écrire maintenant — les agents s'occupent du reste »**.
- Condition unique : l'idée du livre décrite (même règle qu'aujourd'hui pour avancer). Rien d'autre n'est exigé.
- Au clic : les réglages manquants prennent leurs valeurs par défaut (ton, nombre de chapitres, mots par chapitre), le sommaire est construit en coulisse par les agents, et la rédaction démarre directement.
- Une phrase de réassurance sous le bouton : « Vous pourrez relire et modifier le sommaire à tout moment. »
- Le parcours en cinq étapes reste disponible tel quel pour celui qui veut tout régler lui-même.

## 2. Le sommaire modifié à la main n'est jamais écrasé

- Si l'abonné a déjà retouché des titres de chapitres, ce sommaire est repris tel quel par « Écrire maintenant » : aucun remplacement automatique, aucune régénération.
- Le remplissage automatique ne s'applique qu'aux chapitres réellement vides ou encore génériques.
- Un rappel discret à côté du bouton quand un sommaire retouché existe : « Votre sommaire modifié sera utilisé. »

## 3. Le sommaire reste consultable pendant l'écriture

- Aucun changement de fond ici : le panneau sommaire déjà affiché à droite pendant la rédaction continue d'afficher le plan réellement utilisé, y compris celui construit par les agents.

Rien d'autre ne change : les cinq étapes, les agents, la correction, les couvertures et les exports restent identiques.

## Détails techniques

- `src/components/v3public/V3CreateWizard.tsx` :
  - nouveau bouton à l'étape 0 appelant une fonction `startWritingNow()` : garde `canStepOne`, applique `setFinalTitle(finalTitle || title)`, complète l'outline via `buildFallbackOutline` **uniquement pour les entrées manquantes ou génériques** (`hasRepeatedFallbackTitles` réutilisé par chapitre au lieu du remplacement global), puis appelle `launchWorkflow()`.
  - extraction d'un utilitaire local `mergeOutlineWithFallback(existing, fallback)` qui conserve chaque chapitre déjà édité (titre non générique) et ne remplit que les trous — réutilisé aussi dans `goNext` (lignes ~1307-1318) pour que l'avance par étapes cesse d'écraser un sommaire retouché.
  - indicateur `hasEditedOutline` (au moins un titre différent du plan de secours) pour afficher le rappel et éviter toute régénération.
- Aucun changement de base de données, d'edge function, de tarif ni de prompt d'agent.
