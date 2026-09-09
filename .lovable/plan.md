# Une page de création qui s'explique d'elle-même

Deux problèmes à régler : la page reste chargée (4 bureaux + panneau de droite + réglages + actions), et votre premier texte semble ne pas être pris en compte — le second devient « Chapitre 1 ».

## Le schéma

```text
┌───────────────────────────────────────────────────────────────────────┐
│  MA MAISON D'ÉDITION                                                  │
│                                                                       │
│  Comment ça marche, en 3 phrases :                                    │
│  1. Vous racontez avec vos mots (livre ou récit de votre vie).         │
│  2. Le Génie corrige votre texte — il ne le résume jamais.             │
│  3. Il en fait des chapitres, puis le livre, la couverture, l'export.  │
│                                                                       │
│        [ Je raconte mon livre ]     [ Je raconte ma vie ]              │
└───────────────────────────────────────────────────────────────────────┘

        ①  J'ÉCRIS   →   ②  MON SOMMAIRE   →   ③  MON LIVRE
        (une seule étape visible à la fois, dans cet ordre)

┌───────────────────────── ÉTAPE OUVERTE ──────────────────────────────┐
│ ① J'ÉCRIS                                                            │
│   ┌────────────────────────────────────────────────┐                  │
│   │ Mon texte, tel qu'il me vient…                 │                  │
│   └────────────────────────────────────────────────┘                  │
│   [ Envoyer au Génie ]                                                │
│                                                                       │
│   Mes envois, dans l'ordre, aucun perdu :                             │
│   • Texte 1 — corrigé ✓   [ Je garde ]  [ Refaire ]  [ Mes mots ]     │
│   • Texte 2 — corrigé ✓                                               │
└───────────────────────────────────────────────────────────────────────┘

┌────────────── VOTRE LIVRE (replié, s'ouvre d'un clic) ───────────────┐
│  Titre · 12 chapitres · 3 écrits · Enregistré à 14:02                │
│  ▸ Voir mes chapitres      ▸ Réglages du livre                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────── VOS ACTIONS (inchangées, toujours en bas) ──────────────────┐
│ Sommaire · Rédaction · Enregistrer · Corriger · Lire · Word · PDF ·  │
│ Couverture · KDP · Traduire · Audio · Avis                          │
└───────────────────────────────────────────────────────────────────────┘
```

## Ce qui change

**1. Une explication avant de commencer.** En haut, un encadré court « Comment ça marche » en 3 phrases, avec deux boutons de départ : *Je raconte mon livre* / *Je raconte ma vie*. Rien d'autre au-dessus.

**2. Trois étapes au lieu de quatre bureaux.** « J'écris », « Mon sommaire », « Mon livre ». L'ancien bureau ④ (relecture, export, couverture) rejoint « Mon livre » : les boutons ne bougent pas, ils sont simplement au même endroit.

**3. La colonne de droite disparaît.** Elle devient un bandeau replié « Votre livre » sous l'étape en cours : titre, nombre de chapitres, chapitres écrits, heure du dernier enregistrement. Un clic déplie la liste des chapitres, un autre les réglages. La page ne montre donc plus qu'une seule chose à la fois.

**4. Vos textes numérotés et jamais perdus.** Sous la zone d'écriture, la liste de vos envois dans l'ordre : *Texte 1, Texte 2…* avec leur état (corrigé / en attente) et les boutons Je garde · Refaire · Voir mes mots. Le numéro affiché est celui de votre envoi, pas un numéro de chapitre : plus de confusion entre « mon texte » et « Chapitre 1 ».

**5. Le premier texte à vérifier d'abord.** Le comportement décrit (premier envoi absent, second annoncé « Chapitre 1 ») n'est pas encore confirmé côté code : la première action sera de reproduire l'envoi n°1 et de vérifier qu'il est bien enregistré dans le récit source, puis corriger la cause réelle avant tout le reste. Si le premier envoi est bien enregistré mais mal affiché, la correction sera dans l'affichage seul.

Aucune modification des tarifs, des paiements, de la base, de la sécurité, des calculs KDP, ni des appels IA.

## Détails techniques

- Étape 1 : reproduire l'envoi n°1 dans `V3GenieDialog` et vérifier `appendSourceText` / `rebuildSourceText` / `listSourcePassages` (`src/lib/v3/bookBrief.ts`) ainsi que la numérotation dans `V3PassageCorrector`. Corriger la cause identifiée (perte du premier passage OU décalage d'index d'affichage), sans changer le format de `sourceText`.
- `src/pages/v3public/V3CreatePage.tsx` : `DESKS` passe de 4 à 3 (`write | outline | book`) ; l'ancien contenu du bureau 4 (`V3AmbiancePicker`, `V3KeyHint`, `V3PipelinePanel`, `V3BriefRecap`) est déplacé dans l'étape « Mon livre » derrière des `<details>` ; suppression de la grille `lg:grid-cols-[1fr_380px]` et de l'`aside`, remplacée par un bloc pleine largeur ; ajout de l'encadré « Comment ça marche » + 2 boutons de départ (le second écrit `mode: 'biography'` dans la fiche via `writeBookBrief`).
- `src/components/v3public/V3GenieOutlinePanel.tsx` : rendu en carte repliable (résumé toujours visible : titre, chapitres, écrits, horodatage) ; sommaire et chapitres écrits dans des `<details>`, aucune fonction retirée.
- `src/components/v3public/V3PassageCorrector.tsx` : libellés « Texte 1 / Texte 2 » explicites et rappel « ceci n'est pas encore un chapitre ».
- `V3BookActionsBar` inchangé, toujours monté sous l'étape courante.
