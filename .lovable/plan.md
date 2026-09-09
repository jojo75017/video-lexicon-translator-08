# Une vraie maison d'édition : du récit au livre fini

## Pourquoi vous voyez encore des « passages »

La colonne de droite montre aujourd'hui votre matière de travail : sept encadrés numérotés, dont deux ne sont pas du récit mais vos réponses au Génie (« oui bien sûr ce sont mon frère et ma sœur », « ma grand mère s'appelais Germaine et son mari Oscar »). Elles ne quittent le livre que si vous cliquez sur un bandeau — personne ne l'a fait. Rien ne transforme non plus ces encadrés en livre continu : c'est ce que corrige ce plan.

## Le chemin complet, en image

```text
 ① JE RACONTE            ② MON SOMMAIRE          ③ MON LIVRE FINI
 ─────────────────       ─────────────────       ────────────────────
 Je parle / je colle  →  Le Génie déduit      →  Polices, justification,
 Le Génie corrige        les chapitres           pages, export, couverture
 Je valide               (2 500-3 500 mots)      Word · PDF · Amazon · audio
        │                       │                        │
        └── mon livre crème ────┴── je réordonne ────────┴── j'imprime / je vends
            (texte d'un seul tenant, toujours visible)
```

```text
┌───────────────────────────────┬────────────────────────────────┐
│  À GAUCHE — JE PARLE          │  MON LIVRE (fond crème)        │
│  Zone d'écriture / collage     │  Je suis né le 8 novembre      │
│  [ Ajouter à mon récit ]       │  1952 à Berck-sur-Mer…         │
│  Le Génie (questions faculta-  │  Chez ma grand-mère, la vie    │
│  tives, « Plus tard »)         │  reprit doucement…             │
│                               │  ── texte continu, justifié ── │
│  Barre du typographe :         │  ▸ À corriger (2 morceaux)     │
│  [Police] [Taille] [Justifié]  │    [ Tout corriger ]           │
│  [Emojis ✎] [Interligne]       │  Enregistré à 20:46 · Reprise  │
└───────────────────────────────┴────────────────────────────────┘
```

## Les fonctions de la maison d'édition (12)

1. **Le livre d'un seul tenant.** Fond crème, texte continu, plus de « Passage 1 », plus d'étiquette « vos mots » dans la lecture. Un seul en-tête : « Mon livre — X mots · environ Y pages ».
2. **Vos réponses courtes sortent du livre toutes seules** dès l'ouverture : elles deviennent des informations retenues par le Génie, avec un bandeau « Annuler » si vous les voulez dans le récit.
3. **Zone « À corriger », repliée sous le livre**, avec un bouton unique **Tout corriger** et, morceau par morceau : corriger, modifier mes mots, insérer un passage oublié, supprimer.
4. **Un clic dans le texte ouvre les actions de ce morceau** : rien n'est caché, rien n'est perdu.
5. **Texte justifié, comme un livre imprimé**, avec césure française, et un interrupteur si vous préférez le texte aligné à gauche.
6. **Le choix de la police et du confort de lecture** : trois polices de livre (Garamond, Baskerville, Lora), trois tailles, trois interlignes. C'est ce réglage qui est repris à l'export.
7. **Les emojis, à votre main.** Le Génie en pose au maximum un par passage, jamais dans un passage grave ; boutons « en mettre », « les retirer ici », « les retirer partout » et un interrupteur général.
8. **Correction fidèle et jamais raccourcie** : si la version rendue est plus courte que vos mots, vos mots restent et un message le dit. Un prénom ou un lien de famille qui semble manquer déclenche un simple avertissement, jamais un refus.
9. **Le sommaire déduit de votre récit**, quand vous le demandez : chapitres de 2 500 à 3 500 mots, de 3 à 40 chapitres, titres proposés, réordonnables, renommables, sans jamais réécrire vos textes validés.
10. **Le récit terminé : la mise en page.** Page de titre, page de dédicace, préface facultative, sommaire imprimé, numérotation des pages, séparateurs de chapitre, mot de la fin.
11. **L'export du livre** : Word et PDF avec vos polices et la justification, plus l'estimation du nombre de pages.
12. **La couverture, Amazon et l'audio** au même endroit : couverture depuis le studio, titre et description Amazon, version audio du livre.

## Ce qui se passe quand le récit est fini (expliqué à l'abonné)

Un encadré permanent, sous le livre, annonce l'étape suivante en une phrase :

```text
Récit en cours     → « Continuez à raconter : il vous reste ~X mots avant le sommaire. »
Récit assez long   → « Votre récit tient un livre : passez au sommaire. »   [ Mon sommaire ]
Sommaire prêt      → « Choisissez vos polices, puis téléchargez votre livre. » [ Mon livre ]
Livre prêt         → « Word · PDF · couverture · Amazon · audio »
```

## Détails techniques

- `src/components/v3public/V3PassageCorrector.tsx` : le panneau crème rend un flux continu (paragraphes issus de `polished[].corrected`, validés ou proposés) ; les étiquettes « Passage N — vos mots » quittent la lecture et passent dans un `<details>` « À corriger » réutilisant `polishOne`, `saveOriginalEdit`, `addPassage`, `deletePassage`, `removeEmojis`, `validate` ; clic sur un paragraphe = `setSelected(index)`. `cleanShortAnswers()` est appelé une fois au montage quand des passages de moins de 25 mots existent, avec garde par projet et `undoBrief` conservé pour le bandeau d'annulation.
- Nouveau `src/components/v3public/V3TypographyBar.tsx` + champs `bookFont`, `bookSize`, `bookLeading`, `justify`, `emojis` dans `BookBrief` (`src/lib/v3/bookBrief.ts`), appliqués au rendu crème par variables CSS et relus par les exports existants (`docxExportEngine`, export PDF) — aucun nouveau moteur d'export.
- Nouveau `src/components/v3public/V3NextStepCard.tsx` : état déduit localement de `passages`, `polished` et du sommaire existant ; liens vers les étapes ② et ③ déjà en place.
- Mise en page finale (page de titre, dédicace, préface, sommaire imprimé, numérotation) : options du brief passées aux exports existants, sans appel IA.
- Aucun appel IA supplémentaire : nettoyage, regroupement, typographie et pagination sont locaux, sans crédit. « Tout corriger » et « Mon sommaire » restent des actions explicites.
- Inchangé : base de données, RLS, sécurité, crédits, tarifs, paiements, calculs KDP, couverture, sauvegarde cloud (`draft_state`).
- Vérification : typage, tests utilitaires, puis contrôle navigateur sur le projet en cours (texte continu justifié, réponses courtes sorties du livre, bandeau d'annulation, sauvegarde intacte après rechargement).
