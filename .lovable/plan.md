# Votre livre d'un seul tenant, sans passages numérotés

## Pourquoi vous voyez encore des « passages »

La colonne de droite affiche aujourd'hui votre matière de travail : sept encadrés numérotés, dont certains portent « vos mots » (pas encore corrigés) et deux qui ne sont pas du récit mais vos réponses au Génie (« oui bien sûr ce sont mon frère et ma sœur », « ma grand mère s'appelais Germaine et son mari Oscar »). Ces deux réponses ne partent du livre que si vous cliquez sur le bandeau prévu pour ça — personne ne l'a fait, elles sont donc restées dans le livre.

## Ce que vous verrez après

```text
┌───────────────────────────────┬───────────────────────────────┐
│  À GAUCHE — JE PARLE          │  MON LIVRE (fond crème)       │
│                               │  ─────────────────────────────│
│  Zone d'écriture / collage     │  Je suis né le 8 novembre     │
│  [ Ajouter à mon récit ]       │  1952 à Berck-sur-Mer…        │
│                               │                               │
│  Le Génie (facultatif)         │  Chez ma grand-mère, la vie   │
│                               │  reprit doucement…            │
│                               │  (un seul texte continu,      │
│                               │   sans numéro, sans étiquette)│
│                               │  ─────────────────────────────│
│                               │  ▸ À corriger (2 morceaux)    │
│                               │    [ Tout corriger ]          │
│                               │  Enregistré à 20:46           │
└───────────────────────────────┴───────────────────────────────┘
```

1. **Le livre devient un seul texte continu**, sur fond crème, sans « Passage 1 », sans « vos mots », sans compteur par encadré. Un seul titre en haut : « Mon livre — X mots ».
2. **Ce qui est déjà corrigé et validé apparaît dans le livre.** Un morceau seulement corrigé (proposition non validée) apparaît aussi, discrètement signalé en marge pour que vous puissiez le valider.
3. **Ce qui n'est pas encore corrigé est regroupé plus bas**, dans une zone repliée « À corriger », avec un bouton unique **Tout corriger** et, pour chaque morceau, les boutons existants (Corriger, Modifier, Ajouter un passage, Supprimer, Emojis).
4. **Vos réponses très courtes sortent du livre toutes seules** dès l'ouverture de la page : elles rejoignent « Ce que le Génie retient de vous », avec un bandeau « Annuler » si vous préférez les garder dans le récit. Vos deux réponses actuelles partiront donc automatiquement, sans perdre un mot.
5. **Un clic sur un endroit du texte** ouvre les actions de ce morceau (modifier, corriger à nouveau, insérer un passage oublié, supprimer) : rien n'est perdu, tout est simplement rangé.
6. Sauvegarde, reprise, export, couverture, sommaire : inchangés, au même endroit.

## Détails techniques

- `src/components/v3public/V3PassageCorrector.tsx` : le panneau crème rend d'abord un flux continu (paragraphes issus de `polished[].corrected` validés ou proposés, sinon rien) ; suppression des étiquettes « Passage N — vos mots / correction à valider » du flux de lecture ; les morceaux sans `corrected` passent dans un `<details>` « À corriger » avec les actions existantes (`polishOne`, `saveOriginalEdit`, `addPassage`, `deletePassage`, `removeEmojis`, `validate`) inchangées ; clic sur un paragraphe = `setSelected(index)` et affichage du même bloc d'actions.
- Même fichier : `cleanShortAnswers()` est déclenché une fois au montage quand des passages de moins de 25 mots existent (garde locale par projet pour ne pas boucler), en conservant `undoBrief` pour le bandeau « Annuler ». Le seuil et le dédoublonnage (`dedupeFactMemory`) restent ceux déjà en place.
- Aucun appel IA supplémentaire : le regroupement et le nettoyage sont locaux, sans crédit. « Tout corriger » reste une action explicite de votre part.
- Inchangé : base de données, RLS, sécurité, crédits, tarifs, paiements, calculs KDP, export, couverture, sauvegarde cloud (`draft_state`).
- Vérification : typage, puis contrôle navigateur sur le projet en cours (un seul texte continu, deux réponses courtes passées en informations retenues, bandeau d'annulation présent, sauvegarde intacte après rechargement).
