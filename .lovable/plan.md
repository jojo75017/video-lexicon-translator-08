
## 🎨 Objectif
Rendre les illustrations des **cahiers scolaires** beaucoup plus riches, dans l'esprit des manuels Hatier que vous avez envoyés (mascottes, bulles colorées, bannières, scènes pédagogiques vivantes) — au lieu du style "flat vector blanc" actuel qui est trop plat.

## 🔍 Diagnostic
- `supabase/functions/generate-educational-image` impose un style très minimaliste par défaut :
  > *"Clean educational illustration, flat vector style, bright friendly colors, white background, simple shapes…"*
- `EbookScolaireGenerator` n'envoie **aucun `style`** → il hérite de ce style fade.
- Le `context` envoyé est juste `"matière niveau - titre du chapitre"` → trop pauvre pour produire une scène illustrée.

## 🛠️ Plan d'action (3 changements ciblés)

### 1. Nouveau preset `style` "Cahier Hatier" dans l'edge function
Ajouter une logique côté `generate-educational-image` qui accepte un champ `preset` :
- `preset: 'hatier-school'` (défaut pour Scolaire) → prompt enrichi :
  > *"Vibrant educational illustration in the style of a modern Hatier school workbook. Friendly cartoon mascot character (young teacher or student) demonstrating the concept, colorful speech bubbles, bright banners with arrows, playful didactic scene, energetic composition, hand-drawn cartoon style, rich saturated colors (orange, teal, yellow, purple), white background with colored accent shapes, dynamic and engaging, suitable for ages 10-17. No text, no letters, no numbers."*
- `preset: 'soft-planner'` → garde le style aquarelle actuel pour Agenda.
- Fallback : style minimaliste actuel.

### 2. Enrichir le `context` envoyé par `EbookScolaireGenerator`
Au lieu de `subject + level + title`, construire :
```
"Pedagogical scene illustrating <title> in <subject> for <level> students. 
Show a mascot character explaining the concept with visual metaphors 
(diagrams, objects, arrows). Pillar: <pillar/methode/exos/quiz>."
```
Cela donne à Gemini de la matière pour composer une vraie scène.

### 3. Ajouter un sélecteur de style dans l'UI Scolaire
Petit dropdown au-dessus du bouton "Générer toutes les illustrations" :
- 🎨 Style Hatier (mascotte + couleurs) — défaut
- ✏️ Style épuré (flat vector blanc) — actuel
- 🖌️ Style aquarelle douce

Choix mémorisé dans le state du générateur, envoyé via `body.preset`.

## ✅ Garanties
- Aucune régression : Agenda continue d'utiliser son style aquarelle (preset `soft-planner`).
- Le bouton "regénérer" force un bypass du cache pour récupérer immédiatement les nouvelles images.
- Pas de texte généré dans l'image (contrainte conservée pour la cohérence pédagogique).

## 📎 Hors scope (à faire séparément si besoin)
- Personnalisation du nom/visage de la mascotte par projet.
- Génération d'images "encadrés" (À noter / Le récap') comme dans les pages Hatier.

Souhaitez-vous que j'implémente ces 3 changements ?
