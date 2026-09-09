# Un seul écran, un seul livre, aucun jargon

Aujourd'hui l'étape « J'écris » montre **trois fois la même chose** : le livre sur fond crème, puis la même liste « Texte 1 → Texte 5 » avec « Vos mots / Version corrigée », puis le résumé du Génie. Et vos réponses courtes au Génie (« oui bien sûr ce sont mon frère et ma sœur », « ma grand mère s'appelais Germaine ») ont été rangées **dans le livre** comme s'il s'agissait de votre récit. C'est ça qui rend la page incompréhensible.

## L'écran après correction

```text
┌───────────────────────────────────────────────────────────────┐
│  1. J'ÉCRIS        2. MON SOMMAIRE        3. MON LIVRE         │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ RACONTEZ (écrivez ou collez)                                   │
│ [ .............................................. ]            │
│                                        [ Envoyer au Génie ]    │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│ VOTRE LIVRE            2 passages · 382 mots        ▲ascenseur │
│ (fond crème)                                                   │
│  Passage 1  ...........................................        │
│             [ Modifier ]  [ Corriger ]  [ Supprimer ]          │
│  Passage 2  ...........................................        │
│             [ Modifier ]  [ Corriger ]  [ Supprimer ]  ▼       │
└───────────────────────────────────────────────────────────────┘

✓ Enregistré à 17:50   [ Enregistrer maintenant ]  [ Mes livres ]

▸ Ce que le Génie retient de vous (34 informations)   ← replié, tout en bas
```

## Ce qui change

1. **Un seul livre à l'écran.** La grande liste « Texte 1 / Vos mots / Version corrigée / Pas encore corrigé » disparaît. On garde uniquement le livre crème ; les boutons Modifier, Corriger, Ajouter un passage, Supprimer s'affichent sous le passage sur lequel on clique. Aucune fonction n'est perdue.

2. **On ne dit plus « Texte », on dit « Passage ».** Et on ne parle plus de chapitres à cette étape : le mot chapitre n'apparaît qu'à l'étape 2.

3. **Vos réponses au Génie ne vont plus dans le livre.** Quand vous répondez à une question (un prénom, une date, une précision), l'information est ajoutée à ce que le Génie retient — pas à votre récit. Un bouton « Ajouter aussi à mon récit » reste disponible si vous voulez vraiment que la phrase figure dans le livre.

4. **Nettoyage de vos 5 passages actuels.** Les passages 2, 3 et 5 (vos réponses courtes) sont sortis du livre et transformés en informations retenues. Il reste vos deux vrais récits, intacts, sans un mot perdu. Vous pouvez annuler d'un clic si vous préférez les garder dans le livre.

5. **Les « indices » deviennent discrets et sans doublons.** Renommés « Ce que le Génie retient de vous », repliés en bas de page, et dédoublonnés : les 34 lignes actuelles répètent cinq fois la même naissance et le même orphelinat, il en restera une quinzaine, lisibles.

6. **Le résumé du Génie et la fiche du livre quittent l'étape 1.** Le pavé « Voilà ce que j'ai compris », le genre, les 16 chapitres × 2500 mots, l'import de document : tout part à l'étape 2, où l'on construit le sommaire. L'étape 1 ne contient plus que : raconter, lire son livre, enregistrer.

7. **La sauvegarde reste là où elle est**, juste sous le livre, avec « Enregistrer maintenant » et le retour à « Mes livres ».

## Détails techniques

- `V3PassageCorrector.tsx` : suppression du bloc d'édition dupliqué (lignes « Texte N / Vos mots / Version corrigée ») ; les actions existantes (`saveOriginalEdit`, `polishOne`, `insertSourcePassage`, `removeEmojis`, validation) sont rebranchées sur le passage sélectionné dans le livre crème.
- `V3GenieDialog.tsx` : la réponse à une question alimente `factMemory` par défaut ; `appendSourceText` n'est appelé que via l'action explicite « Ajouter aussi à mon récit ».
- `bookBrief.ts` : ajout d'un utilitaire local de dédoublonnage de `factMemory` (normalisation + comparaison) et d'un déplacement passage → fait, réversible dans la session.
- `V3CreatePage.tsx` : `V3BriefRecap`, la fiche du livre, l'import de document et les entrées « autre voie » ne sont plus montés à l'étape 1.
- Aucun changement de base, de sécurité, de tarif, de paiement, de calcul KDP ; aucun appel IA supplémentaire (le nettoyage est local, sans crédit).

## Vérification

- Ouvrir le livre en cours et compter : un seul livre affiché, deux passages de récit, plus aucune liste en double.
- Vérifier que les textes 2, 3 et 5 apparaissent désormais dans les informations retenues, et que le bouton d'annulation les remet dans le livre.
- Répondre à une question du Génie et vérifier que la réponse n'apparaît pas dans le livre.
- Recharger la page : mêmes passages, même position, sauvegarde intacte.
