

## Problème

1. **Préface/Introduction lue dans l'audio** alors que l'utilisateur n'en veut pas — le code inclut automatiquement le champ `introduction` comme segment audio séparé (lignes 288-304) ET le concatène aussi dans le texte nettoyé (ligne 194)
2. **JSON résiduel au début du fichier audio** — le contenu des chapitres injecté depuis le workflow P1-P15 contient encore des fragments JSON bruts que `cleanForAudio` ne capture pas complètement

## Corrections

### 1. Supprimer la préface/introduction du pipeline audio

**Fichier : `src/components/ebook/AudioExpressWorkflow.tsx`**

- **Ligne 194** : Supprimer l'ajout de `brief.introduction` dans `handleCleanText` — le texte nettoyé ne doit contenir que les chapitres
- **Lignes 288-304** : Supprimer entièrement le bloc "Préface / Introduction" dans `handleGenerateAudio` — plus de fichier `01-Preface.mp3`
- **Ligne 120** : Supprimer l'initialisation `useState(preface || '')` — le champ introduction reste disponible mais n'est plus injecté dans l'audio
- **Numérotation ZIP** : Les chapitres commencent à `01-` au lieu de `02-` (l'intro titre/auteur reste en `00-Intro.mp3`)

### 2. Renforcer le nettoyage JSON dans `cleanForAudio`

**Fichier : `src/utils/textCleaner.ts`**

- Ajouter en début de `cleanForAudio` un pré-nettoyage agressif qui détecte et supprime tout bloc JSON complet en début de texte (pattern `{...}` ou `[...]` avant le premier paragraphe de prose)
- Ajouter un pattern pour supprimer les lignes qui commencent par des clés JSON typiques (`"titre":`, `"content":`, `"chapters":`, `"numero":`, etc.)
- Renforcer la suppression des accolades/crochets orphelins et des fragments `json` en début de contenu

### 3. Nettoyer le champ UI

**Fichier : `src/components/ebook/AudioExpressWorkflow.tsx`**

- Renommer le label du champ "Introduction / Résumé" en "Notes (non lu dans l'audio)" pour clarifier qu'il ne sera pas inclus dans la synthèse vocale
- Ou supprimer complètement ce champ de l'interface A1 si non nécessaire

### Résultat attendu

- Audio : `00-Intro.mp3` (titre+auteur, 3s) → `01-Chapitre-1.mp3` → `02-Chapitre-2.mp3`...
- Plus aucune préface/introduction lue
- Plus de JSON audible dans le fichier audio

