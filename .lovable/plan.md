# Plan de correction V3 Create

## Objectif
Remplacer le générateur actuel de plan texte par un vrai parcours simple en 4 étapes, puis lancer automatiquement le workflow complet sans ouvrir de fenêtres agent par agent.

## Ce que j’ai vérifié
- La page `/v3/create` charge actuellement `BookCreationStudio`, qui fait seulement un appel IA pour produire un plan texte.
- Le workflow de rédaction complet existe déjà dans `EbookCompleteWorkflow`, mais il demande encore trop de champs, une case de confirmation, et un clic manuel.
- Le hub interne ouvre les agents dans des dialogues séparés ; ce n’est pas adapté au raisonnement que tu as montré avec les captures.

## Corrections prévues

### 1. Créer un nouveau wizard `/v3/create`
Créer `V3CreateWizard` avec 4 étapes visibles :
1. Page principale : titre + description du livre, avec objectif autour de 150 mots.
2. Style : catégorie, ton, nombre de chapitres jusqu’à 60, mots par chapitre.
3. Personnages : liste modifiable avec nom, rôle, traits.
4. Titre final : résumé clair puis bouton visible `Générer mon livre`.

### 2. Remplacer l’ancien générateur caché
Dans `V3CreatePage`, remplacer `BookCreationStudio` par ce nouveau wizard.
Le bouton ne doit plus générer seulement un plan texte.

### 3. Lancer le vrai workflow directement
Modifier `EbookCompleteWorkflow` pour accepter :
- `autoStart`
- `hideInputForm`
- `initialWordsPerChapter`
- `initialTone`

Avec ces options, le workflow :
- préremplit les informations du wizard,
- coche automatiquement la confirmation interne,
- démarre seul dès le clic `Générer mon livre`,
- n’affiche pas la grande fiche technique à remplir,
- montre seulement la progression des agents.

### 4. Supprimer les blocages inutiles
Le parcours V3 ne demandera plus de repasser par les fenêtres ou les champs lourds.
Les validations manuelles déjà supprimées après P1/P3 resteront non bloquantes.

### 5. Respecter 60 chapitres et les mots par chapitre
Mettre le maximum à 60 chapitres dans le workflow.
Transmettre `wordsPerChapter` à la fonction de génération afin que P3/P4 utilisent l’objectif choisi au lieu d’un nombre fixe.

## Résultat attendu
Sur `/v3/create`, l’utilisateur suit exactement le raisonnement des captures : idée, style, personnages, titre, puis un seul bouton lance la génération complète. Le workflow se déroule en ligne, avec progression visible, sans revenir à des fenêtres modales agent par agent.