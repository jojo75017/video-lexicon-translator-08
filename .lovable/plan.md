

## Problème identifié

L'intro du livre audio est kitsch et non professionnelle :
- **Jingle "annonce de gare"** (3s de bruit synthétique WebAudio)
- **"Bienvenue sur EbookStudio 2026"** — branding forcé
- **"Attachez vos ceintures, l'aventure commence maintenant"** — phrase cliché
- **Préface/Introduction réelle** non lue dans l'audio final
- Le texte affiché dans le champ intro contient des marqueurs `🔊 [Ambiance sonore...]` qui polluent l'affichage

## Plan de correction

### 1. Réécrire `audioIntroGenerator.ts` — Intro sobre et pro

Remplacer tout le script "immersif" par une intro simple et élégante :
- **Segment unique** : `"{Titre}, par {Auteur}."` — point final, rien d'autre
- Supprimer `generatePremiumJingle()` (le bruit de gare)
- Supprimer `generateSilenceWav()` 
- Supprimer le teaser 50 mots et "Attachez vos ceintures"
- `generateIntroForExport` : retourne un seul blob TTS avec le titre+auteur
- `buildIntroDisplayText` : retourne juste `"{Titre}, par {Auteur}."` sans emoji ni marqueurs

### 2. Intégrer la préface dans le contenu audio — `AudioExpressWorkflow.tsx`

Actuellement `handleCleanText` (A4) concatène introduction + chapitres, mais `handleGenerateAudio` (A7) ne prend que `cleanedText` qui peut ne pas inclure la préface séparément.

Correction :
- Dans `handleGenerateAudio`, après l'intro titre/auteur, générer l'audio de la **préface** (`introduction` ou `preface` prop) comme premier segment avant les chapitres
- Ajouter la préface comme fichier séparé dans le ZIP : `01-Preface.mp3`
- Inclure la préface dans le blob fusionné

### 3. Nettoyer le champ introduction par défaut

- `buildDefaultIntro` ne doit plus appeler `buildIntroDisplayText` (qui ajoutait les marqueurs emoji)
- Le champ texte "Introduction" dans A1 doit contenir le vrai texte de préface, pas le script d'intro

### Résultat attendu

Ordre audio final :
1. **Titre + Auteur** (3-5 secondes TTS)
2. **Préface / Introduction** (texte complet, lu en entier)
3. **Chapitre 1, 2, 3...** (contenu)

Plus de jingle de gare, plus de "EbookStudio 2026", plus de "Attachez vos ceintures".

