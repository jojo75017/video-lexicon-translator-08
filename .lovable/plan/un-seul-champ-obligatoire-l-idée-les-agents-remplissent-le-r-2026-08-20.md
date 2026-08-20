# Un seul champ obligatoire : l'idée. Les agents remplissent le reste

Aujourd'hui sur `/v3/lancer`, l'abonné est bloqué s'il n'a pas déjà un titre (3 caractères mini) et une description de 30 caractères mini, puis il doit choisir catégorie, nombre de chapitres, ton, personnages… Résultat : il abandonne avant d'avoir vu le moindre agent travailler.

Nouvelle règle : **une phrase suffit**. À partir de son idée (ou de son synopsis collé), l'IA propose tout le reste, et l'abonné corrige seulement ce qui ne lui plaît pas.

## 1. « Je décris mon idée, les agents proposent »

En haut de l'étape 1, un encart unique :

- une zone de texte « Racontez votre idée en une phrase (ou collez votre synopsis) » ;
- un bouton **« Laissez les agents proposer »**.

En un clic, l'IA renvoie une proposition complète et pré-remplit les champs :

- titre commercial
- sous-titre
- catégorie KDP (+ 2 catégories de secours)
- nom d'auteur suggéré (modifiable, l'abonné garde le sien s'il l'a déjà saisi)
- description / synopsis de 4e de couverture
- ton, nombre de chapitres et longueur conseillés
- personnages principaux quand le genre s'y prête
- **le sommaire complet** (titres + points clés de chaque chapitre)

Chaque bloc proposé porte une étiquette « Proposé par les agents » et un bouton « Autre proposition » pour relancer uniquement ce bloc.

## 2. Plus aucun onglet obligatoire (sauf l'idée)

- Étapes 2, 3 et 4 : tous les champs deviennent facultatifs. Les boutons « Continuer » ne sont plus grisés.
- Si un champ reste vide au lancement, il est comblé automatiquement par la proposition de l'IA (ou une valeur par défaut sûre : 12 chapitres, 2 500 mots, ton « Inspirant », auteur = nom du compte).
- Les blocs avancés (Cible, Promesse, Bible de l'univers, Arbre narratif, Personnages) passent en accordéons repliés marqués **« Facultatif — les agents s'en occupent »**.
- Les messages bloquants actuels (« il manque une description », « titres de chapitres répétés ») deviennent de simples conseils non bloquants, sauf le sommaire vide qui est régénéré automatiquement.

## 3. Un récapitulatif avant le lancement

Dernière étape : une fiche récapitulative « Voici votre livre tel que les agents vont l'écrire » listant titre, sous-titre, auteur, catégorie, ton, nombre de chapitres, longueur et sommaire — chaque ligne cliquable pour la retoucher, puis **« Lancer les 15 agents »**.

## Détails techniques

- `src/components/v3public/V3CreateWizard.tsx`
  - `canStepOne` → uniquement `aiTopic` ou `title` ou `sourceText` non vide (≥ 10 caractères cumulés) ; `canStepTwo` et `canStepOutline` ne bloquent plus la navigation (conservés seulement pour l'affichage des conseils).
  - Nouvelle fonction `applyAiProposal()` : étend l'appel existant (ligne ~522, prompt `aiTopic`) pour renvoyer aussi `authorName`, `tone`, `chapters`, `wordsPerChapter`, `characters` et `outline`, puis remplit chaque `useState` **seulement s'il est encore vide** (aucun écrasement d'une saisie de l'abonné).
  - Ajout d'un état `proposedFields: Set<string>` pour afficher les badges « Proposé par les agents » et les boutons « Autre proposition ».
  - `handleLaunch` : appel d'un `fillMissingFields()` avant lancement (proposition IA si absente, sinon valeurs par défaut) + régénération du sommaire via `v3-generate-outline` si `outline` est vide ou en fallback.
- `supabase/functions/v3-generate-outline` : mode existant réutilisé ; ajout d'un mode `proposal` qui renvoie en un seul appel la fiche complète (titre, sous-titre, catégories, auteur, description, ton, chapitres, longueur, personnages, sommaire enrichi) — un seul appel IA pour économiser les crédits.
- Nouveau composant `src/components/v3public/V3ProposalSummary.tsx` : la fiche récapitulative de l'étape finale.
- Textes 100 % en français, aucun changement de tarif, de quota ni de schéma de base.
