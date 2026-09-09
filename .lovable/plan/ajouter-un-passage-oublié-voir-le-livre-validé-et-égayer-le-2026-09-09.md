# Ajouter un passage oublié, voir le livre validé, et égayer le texte

Trois corrections sur l'écran d'écriture, sans rien changer aux paiements, aux accès, aux calculs Amazon ni à la base.

## 1. Un passage ajouté est corrigé et fondu dans le récit

Aujourd'hui « Ajouter un passage ici » enregistre bien le texte, mais il reste brut : personne ne le corrige et il ne se raccorde pas au texte voisin.

Après la correction :

```text
   Texte 3  ────────────────────────────────────────────────
   « J'ai oublié : mon frère Michel était là ce jour-là. »
                        ↓  [ Ajouter au récit ]
   ① le passage est inséré à sa place, les textes suivants gardent leur numéro
   ② le Génie le corrige tout seul (« Correction en cours… »)
   ③ il le raccorde au texte qui précède : même ton, transition naturelle,
      aucun fait retiré, aucun mot en moins
   ④ le passage apparaît « Correction proposée, à valider »
```

Le sommaire se réajuste ensuite tout seul, comme aujourd'hui, puisque le nombre de mots a changé.

## 2. Le livre validé se voit, en crème

- Chaque texte validé passe sur un fond **crème** (papier), avec une pastille « Validé — dans le livre ».
- Les textes en attente restent sur fond blanc, la correction proposée sur fond doré léger.
- En haut de la liste : une bande « Votre livre : X textes validés · N mots » et, juste en dessous, un bouton **« Lire mon livre »** qui affiche le récit validé bout à bout, en pleine largeur, sur ce même fond crème — c'est le vrai aperçu du livre.

## 3. Des emojis dans le texte, avec un interrupteur

Vous avez choisi les emojis **dans le texte du livre**. Comme ils apparaîtront aussi dans le livre imprimé, ils restent réglables :

- un interrupteur « Quelques emojis dans mon texte » dans les réglages du livre, mémorisé par livre ;
- quand il est allumé, le Génie en place **au maximum un ou deux par passage**, jamais dans une phrase grave (deuil, maladie, accident), jamais en début de phrase ;
- quand il est éteint (choix par défaut), le texte n'en contient aucun ;
- vous pouvez toujours les retirer à la main avec « Modifier la proposition ».

## Détails techniques

- `V3PassageCorrector.tsx` : `addPassage()` déclenche le pipeline de correction existant sur le nouvel index (même mécanique que `pendingPolishIndex`), avec `stitchAfter` = texte précédent envoyé en contexte ; styles crème/blanc/doré selon `validatedAt` ; nouveau panneau replié « Lire mon livre » alimenté par `narrativeForBook()`, sans appel IA.
- `bookBrief.ts` : ajout de `emojis?: boolean` dans `BookBrief` (par défaut absent = désactivé).
- `supabase/functions/v3-genie-brief` (mode `polish-passage`) : nouveaux champs facultatifs `previousPassage` (raccord) et `emojis` (0 à 2 emojis, jamais sur un passage grave). Les règles existantes restent prioritaires : 100 % français, aucun fait retiré, jamais moins de mots que l'auteur.
- Inchangé : base de données, RLS, crédits, tarifs, paiements, export, couverture, sommaire, sauvegarde cloud (`draft_state`).
- Vérification : typage, tests utilitaires, et une correction réelle sur un passage court pour contrôler le raccord et les emojis.
