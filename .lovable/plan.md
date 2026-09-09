# Revenir à l'écran en deux colonnes, et un Génie qui enrichit au lieu de raccourcir

## Ce qui ne va pas aujourd'hui

- L'écran d'écriture empile tout verticalement : on ne voit plus le livre pendant qu'on parle.
- Le Génie pose des questions même quand vous collez un long texte, et il faut y répondre avant d'avancer.
- Aucun emoji n'apparaît : l'option existe mais elle est éteinte par défaut.
- Chaque relance coûte des crédits parce que la correction repart trop souvent d'elle-même.

## Le chemin visé

```text
┌───────────────────────────────┬───────────────────────────────┐
│  À GAUCHE — JE PARLE          │  À DROITE — MON LIVRE         │
│                               │  (fond crème, toujours visible)│
│  Zone d'écriture / collage    │  Passage 1 ..... validé        │
│  [ Ajouter à mon récit ]      │  Passage 2 ..... validé        │
│                               │  Passage 3 ..... à corriger    │
│  Le Génie (facultatif)        │                               │
│  « 2 questions max »          │  [Corriger] [Valider]         │
│  [ Répondre ] [ Plus tard ]   │  [Modifier] [Emojis]          │
│                               │  Enregistré · reprise auto     │
└───────────────────────────────┴───────────────────────────────┘
        ↓ quand le récit est assez long
   ② Mon sommaire  →  ③ Mon livre (export + couverture)
```

## Ce qui change

1. **Deux colonnes de retour.** Sur ordinateur : à gauche la conversation et la zone de texte, à droite le livre crème qui se remplit en direct. Sur téléphone, les deux se suivent l'un sous l'autre.
2. **Le livre reste visible en permanence** avec son propre ascenseur, ses passages numérotés et les actions au même endroit (corriger, valider, modifier, insérer, supprimer, emojis).
3. **Coller un texte n'oblige plus à répondre.** Le texte entre immédiatement dans le livre. Les questions du Génie (2 au maximum) deviennent facultatives, affichées à gauche, avec « Plus tard ». Vos réponses viennent **s'ajouter** au passage, elles ne le remplacent pas.
4. **Jamais plus court que vos mots.** Si la version corrigée contient moins de mots que la vôtre, elle est refusée automatiquement et le Génie complète le passage au lieu de le résumer. Un message le dit clairement à l'écran.
5. **Emojis activés par défaut, à un niveau discret** (au plus un par passage, jamais dans un passage grave), avec un interrupteur pour tout retirer et des boutons pour en placer soi-même.
6. **Moins de crédits consommés.** Une correction = une demande, déclenchée par vous. Plus de correction automatique en arrière-plan, plus de double appel quand un passage est déjà validé, et un passage validé n'est jamais recorrigé sans votre clic.
7. **Sauvegarde et reprise visibles** sous le livre : « Enregistré à telle heure » et reprise exacte au retour.

## Détails techniques

- `src/pages/v3public/V3CreatePage.tsx` : bureau ① passe en grille deux colonnes (`lg:grid-cols-2`), `V3GenieDialog` à gauche, `V3PassageCorrector` + `SaveStatusLine` à droite (fin de l'usage de `progressContent` pour l'empilement).
- `src/components/v3public/V3GenieDialog.tsx` : questions non bloquantes, bouton « Plus tard », réponses ajoutées en complément du passage courant (pas de remplacement), plus d'appel automatique au collage.
- `src/components/v3public/V3PassageCorrector.tsx` : panneau crème avec hauteur bornée et scroll interne, emojis activés par défaut, correction uniquement sur action explicite (suppression du déclenchement par `pendingPolishIndex`), message visible quand la correction est rejetée pour cause de raccourcissement.
- `supabase/functions/v3-genie-brief/index.ts` : quand `shorter` est vrai, une seule relance avec consigne d'expansion (compléter, jamais résumer) ; si la relance reste plus courte, on renvoie l'original avec un avertissement. `emojis` par défaut à `true` côté appelant.
- Aucun changement de base, de sécurité, de calculs KDP, de paiements ni de tarifs. Aucun test consommant des crédits.
