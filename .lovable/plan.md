# Cover Studio Pro — Module V3 premium « couvertures d'une beauté incomparable »

## Objectif
Ajouter un **nouveau module V3 dédié** centré sur la qualité visuelle maximale des couvertures d'ebooks. Aujourd'hui le studio existant (`EbookAICoverStudio`) génère déjà via `generate-front-cover`, mais le rendu n'est pas poussé au niveau « premium maison d'édition ». On crée une expérience séparée, plus haut de gamme, branchée en priorité sur **OpenAI `gpt-image-2`** (clé déjà présente).

## Ce qu'on construit

### 1. Nouvelle edge function `generate-premium-cover`
Une fonction dédiée, optimisée pour la qualité, indépendante de l'existante.
- **Modèle prioritaire : `gpt-image-2`** via l'API OpenAI Images (`quality: "high"`, `size: 1024x1536` portrait), fallback `gpt-image-1` puis Gemini 3 Pro Image si OpenAI indisponible.
- **Étape 1 — Direction artistique IA** : un appel texte (Gemini flash via Lovable AI) transforme titre + sous-titre + genre + niche en un *brief d'art-director* riche (palette, composition, éclairage, références éditoriales, typographie suggérée). Ce brief alimente le prompt image.
- **Étape 2 — Génération image** avec un prompt « benchmark Penguin/HarperCollins », photoréalisme strict (respect de la règle mémoire : aucune image cartoon/basse fidélité).
- **Variations** : paramètre `count` (1 à 4) pour générer plusieurs directions d'un coup.
- Upload de chaque image dans le bucket `ebook-images` et renvoi des URLs publiques (évite de balader le base64).
- CORS complet, validation Zod de l'entrée, gestion 401/402/429 explicite.

### 2. Nouveau composant `CoverStudioPro` (admin)
`src/components/admin/CoverStudioPro.tsx`, affiché dans le dialog du Hub V3.
- Formulaire : titre, sous-titre, auteur, genre, **niche/registre** (presets bestseller), nombre de variations.
- **Presets premium par niche** (réutilise les `REGISTRES` déjà définis dans `EbookAICoverStudio` : thriller, business, fantasy, wellness, romance, mémoire…) présentés en cartes sélectionnables.
- Bouton « Générer mes couvertures premium » → appelle `generate-premium-cover`.
- Galerie de résultats : chaque variation en grand + **test miniature 200×300** (lisibilité Amazon) + bouton Télécharger + « Régénérer cette direction ».
- Esthétique alignée sur le Hub V3 (noir & or luxe).

### 3. Branchement V3
- Ajouter le module dans `src/data/roadmapV3.ts` (pilier `publier`), id `cover-studio-pro`, statut `done`, titre « Cover Studio Pro — Couvertures Premium IA ».
- Le mapper dans `src/components/admin/v3ModuleRegistry.tsx` (`V3_MODULE_COMPONENTS['cover-studio-pro'] = CoverStudioPro`) pour le rendre cliquable.

## Détails techniques
- Réutilise le pattern d'upload existant vers `ebook-images` (bucket public déjà présent).
- Secrets : `OPENAI_API_KEY` et `LOVABLE_API_KEY` déjà configurés — rien à demander.
- Pas de modification de l'edge function `generate-front-cover` existante (zéro régression sur le studio actuel).
- `verify_jwt = false` par défaut Lovable ; validation des entrées côté fonction.

## Hors périmètre (pour cette étape)
- Éditeur de typographie manuel par-dessus l'image (overlay repositionnable).
- Mockups 3D et export wrap PDF KDP (déjà couverts par `cover-pdf-exact` et `EbookBookMockup3D`).

Ces deux points pourront constituer une itération « Cover Studio Pro v2 » si tu valides d'abord la qualité de génération.

## Résultat attendu
Un module V3 distinct qui produit, en quelques secondes, plusieurs couvertures photoréalistes haut de gamme avec direction artistique automatique et test de lisibilité miniature — au niveau visuel d'une vraie maison d'édition.