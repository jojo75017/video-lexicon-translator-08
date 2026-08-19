# Le livre affiché à côté doit être le livre corrigé et modifiable

## Le constat

Dans la colonne de droite, onglet « Mon livre », le texte affiché est exactement celui sorti de l'agent de rédaction : brut, non corrigé. La correction n'arrive que si on clique manuellement « Corriger ce chapitre » (appel simple à `strict-proofread`), et elle écrase le texte sans garder l'original ni indiquer l'état. Il n'y a aucun moyen de modifier soi-même le texte à cet endroit ni d'ajouter une info oubliée.

## Ce qui va changer

### 1. Correction automatique dès qu'un chapitre est écrit
- Chaque chapitre publié par la rédaction passe automatiquement dans la vraie chaîne professionnelle (les 4 passes : correction, typographie française, édition, contrôle de fin de chapitre), pas dans un simple appel unique.
- La correction est séquentielle et en arrière-plan : la lecture n'est jamais bloquée. Un badge par chapitre indique l'état : « brut », « correction en cours… », « corrigé ».
- Le texte brut est conservé : on peut basculer « Version corrigée / Version brute » pour comparer.

### 2. Le texte devient modifiable dans le panneau
- Bouton « Modifier ce chapitre » : le texte s'ouvre en zone d'écriture, avec « Enregistrer » / « Annuler ».
- La version modifiée à la main est prioritaire sur la version IA et sur le brut : c'est elle qui part à l'export, à l'aperçu, aux données KDP et à l'audio.
- Champ « Ajouter une info oubliée » sous chaque chapitre : la précision est réinjectée dans le chapitre par l'IA (le reste du texte est conservé, rien n'est résumé ni raccourci) ; l'ancienne version reste consultable.

### 3. Contrôles au niveau du livre
- Bouton « Corriger tout le livre » (barre du panneau) : relance la chaîne complète sur tous les chapitres encore bruts, avec compteur de progression.
- Compteur d'état en tête de panneau : « X corrigés / Y écrits », plus le total de mots réellement retenus.
- Aucune perte : brut, corrigé et modifié coexistent, on peut revenir en arrière chapitre par chapitre.

## Détails techniques

- `src/lib/v3/writtenChapters.ts` : le type `WrittenChapter` gagne `rawContent`, `correctedContent`, `editedContent`, `status` (`raw` | `correcting` | `corrected` | `failed`), `corrections`, `updatedAt`. Nouveaux helpers `setChapterStatus`, `setChapterCorrection`, `setChapterEdited`, `effectiveChapterText`. Lecture rétro-compatible de l'ancien format (`content` seul → `rawContent`).
- Nouveau `src/lib/v3/autoCorrectChapters.ts` : file d'attente séquentielle qui appelle `proofreadChapter` de `src/lib/correcteur/proofreadBook.ts` (chaîne 4 passes déjà en place, découpage en blocs, réparation des fins de chapitre, balayage latin) avec la clé BYOK via `aiWritingService`, écrit le résultat dans le store et émet `WRITTEN_CHAPTERS_EVENT`.
- Nouveau `src/lib/v3/enrichChapter.ts` : passe « info oubliée » (edge function existante `book-chapter-write` en mode révision, consigne stricte de ne rien supprimer ni résumer).
- `src/components/v3public/V3GenieOutlinePanel.tsx` : onglet « Mon livre » réécrit — badges d'état, bascule corrigé/brut, édition en ligne, champ d'ajout d'info, bouton « Corriger tout le livre ». La logique de correction sort du composant vers les libs ci-dessus.
- Tous les consommateurs de `readWrittenChapters()` (export, aperçu, KDP, audio, `V3BookActionsBar`) utilisent `effectiveChapterText` afin de toujours prendre modifié > corrigé > brut.
- Aucun changement de base de données : on reste sur le stockage local + événement déjà utilisé par le brief.
