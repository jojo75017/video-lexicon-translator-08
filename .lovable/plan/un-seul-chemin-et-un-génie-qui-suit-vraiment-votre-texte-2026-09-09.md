# Un seul chemin, et un Génie qui suit vraiment votre texte

Aujourd'hui la page mélange **deux systèmes de questions** et **six encadrés** sur le même écran. C'est là que ça devient incompréhensible :

- un « entretien guidé en 6 étapes » écrit à l'avance (public visé, promesse, ton…) qui ne lit pas du tout ce que vous écrivez ;
- et, en dessous, les vraies questions du Génie tirées de votre texte.

Résultat : on vous pose des questions génériques qui n'ont aucun rapport avec votre récit, pendant que vos vraies phrases attendent ailleurs. On supprime le premier système.

## Le chemin, en image

```text
   ┌─────────────────────────────────────────────────────────────┐
   │   ① J'ÉCRIS   →   ② MON SOMMAIRE   →   ③ MON LIVRE          │
   │   (étape en cours en doré, les autres en gris, pas de saut)  │
   └─────────────────────────────────────────────────────────────┘

   ÉTAPE ① — UN SEUL ÉCRAN, RIEN D'AUTRE
   ┌──────────────────────────────────────────────────────────┐
   │ Racontez ou collez votre texte                           │
   │ ┌──────────────────────────────────────────────────────┐ │
   │ │ Mon frère Michel, ma sœur Anne, l'été 1974…          │ │
   │ └──────────────────────────────────────────────────────┘ │
   │              [ Envoyer au Génie ]                        │
   └──────────────────────────────────────────────────────────┘
                              ↓
   ┌──────────────────────────────────────────────────────────┐
   │ LE GÉNIE A LU VOTRE TEXTE 1 (412 mots)                   │
   │ Il a retenu : Michel (frère) · Anne (sœur) · été 1974    │
   │                                                          │
   │ « Vous parlez de l'été 1974 avec Michel. Que s'est-il    │
   │   passé ce jour-là au bord de la rivière ? »             │
   │ ┌──────────────────────────────────────────────────────┐ │
   │ │ Votre réponse (elle entre dans le livre)             │ │
   │ └──────────────────────────────────────────────────────┘ │
   │   [ Ajouter au récit ]     [ Je n'ai rien à ajouter ]    │
   └──────────────────────────────────────────────────────────┘
                              ↓
   ┌──────────────────────────────────────────────────────────┐
   │ VOTRE TEXTE 1, CORRIGÉ                                   │
   │  Version du Génie ▸ [ Je garde ] [ Je modifie ] [Refaire]│
   │  Mes mots d'origine ▸ (un clic pour les revoir)          │
   └──────────────────────────────────────────────────────────┘
                              ↓
        [ + Écrire le texte 2 ]   ou   [ Passer au sommaire ▸ ]

   ÉTAPE ② — le sommaire est déduit de vos textes validés.
   ÉTAPE ③ — rédaction, relecture, export Word/PDF, couverture, Amazon, audio.

   En bas, toujours visible : Enregistré à 14:02 · Reprendre plus tard
```

## Ce qui change concrètement

**1. Une seule question à la fois, et elle vient de votre texte.** L'entretien pré-écrit (public visé, promesse, ton, style) disparaît de l'écran d'écriture. Le Génie ne pose que des questions nées de vos phrases, deux au maximum, en citant le détail concerné.

**2. Votre réponse va dans le livre, visiblement.** Aujourd'hui on ne sait pas où atterrit une réponse. Chaque réponse devient un passage du récit, affiché comme tel, rattaché au texte qui l'a provoquée.

**3. Un seul écran à la fois.** À l'étape ①, on ne voit que : la zone d'écriture, la question du Génie, le texte corrigé. Le sommaire, les réglages, les clés, le récapitulatif et la barre d'actions ne s'affichent plus ici.

**4. Fin du double affichage du récit.** Le récit n'existe qu'à un seul endroit : la liste « Texte 1, Texte 2, Texte 3 » avec, pour chacun, son état (à corriger / corrigé / validé).

**5. Les réglages deviennent une porte, pas un mur.** Titre, sous-titre, ton, ambiance, clés IA : un seul lien « Réglages du livre » replié, à consulter quand on veut.

**6. Sauvegarde lisible en bas d'écran.** Une seule ligne : « Enregistré sur votre compte à 14:02 » ou « Conservé sur cet appareil — connectez-vous pour reprendre ailleurs ». Plus de message qui promet une sauvegarde qui n'a pas eu lieu.

## Détails techniques

- `V3GenieDialog.tsx` : suppression de `currentInterviewStep` / `stepLabel` / `answerChoice` / `skipStep` / `showExample` et de la liste `steps` (4 puces) de l'écran d'écriture ; on ne garde que la zone de saisie, le bloc « ce que le Génie a retenu » (`factMemory`) et les `questions` renvoyées par `v3-genie-brief`, limitées à 2, avec un champ de réponse par question (`refine` → `ask`, déjà sans préfixe technique).
- `supabase/functions/v3-genie-brief/index.ts` : les `questions` doivent obligatoirement citer un élément présent dans le texte source (nom, lieu, date) ; aucune question de cadrage marketing (public, promesse, ton) tant que le récit fait moins de ~1 500 mots.
- `V3CreatePage.tsx` : à `desk === 1`, rendre uniquement `V3GenieDialog` puis `V3PassageCorrector` ; `V3BriefRecap`, `V3AmbiancePicker`, `V3KeyHint`, `V3PipelinePanel`, `V3BookActionsBar` passent dans un `<details>` « Réglages du livre » et ne s'affichent qu'à l'étape ③.
- `V3GenieOutlinePanel.tsx` : une seule liste de passages ; statut d'enregistrement basé uniquement sur `BOOK_DRAFT_STATUS_EVENT` / `cloudSavedAt`, jamais sur l'événement local.
- Aucun changement de base, de sécurité, de calcul KDP, de paiement, de tarif ni de verrouillage payant. Vérification sans consommer de crédit IA (typage + parcours navigateur).
