# Couvertures vraiment professionnelles (V3) + export KDP complet

## Recommandation de clé API

Ma réponse à « lequel est le mieux » : **Ideogram v3** (clé à créer sur ideogram.ai).

Raison : c'est aujourd'hui le seul modèle qui rend un **titre lisible et bien composé directement dans l'image** (les autres déforment les lettres). Coût ~0,06 $ par couverture, donc négligeable.

Mais une couverture vendable ne se fait pas « en un prompt ». Le vrai standard édition, c'est deux couches :

1. **L'illustration** générée sans aucun texte (fond, personnage, atmosphère) — Ideogram v3, avec repli automatique sur Gemini/OpenAI déjà en place si la clé manque.
2. **La typographie posée par-dessus** en vectoriel 300 DPI (titre, sous-titre, auteur, collection) dans Cover Studio Pro. C'est ce qui fait la différence « amateur / pro » : lettres nettes, jamais pixelisées, texte modifiable.

Ideogram sert aussi de mode « tout-en-un » quand l'utilisateur veut un rendu direct avec texte incrusté.

## Ce qui est corrigé / ajouté

### 1. Génération d'image haut de gamme
- Nouveau fournisseur Ideogram dans la chaîne de génération, en tête de priorité, avec repli sur l'existant.
- Prompts réécrits en direction artistique de maison d'édition : cadrage, palette, éclairage, style par genre (thriller, romance, dev perso, jeunesse, cuisine, voyage), et interdiction explicite de texte pour la couche illustration.
- Deux modes : « Illustration seule (recommandé) » et « Couverture complète avec titre ».
- Format demandé en portrait 1024x1536 puis upscale, plus de rendu carré étiré.

### 2. Typographie pro
- Presets de composition par genre (titre / sous-titre / auteur / bandeau série), polices d'édition, ombrage, contour, capitalisation.
- Ajustement automatique de la taille du titre pour qu'il tienne dans la zone sans débordement.
- Aperçu instantané sur 3 variantes de mise en page, choix en un clic.

### 3. Export KDP complet (couverture entière)
- Passage du gabarit « front seul » au gabarit **wrap complet** : 4e de couverture + tranche + 1re.
- Tranche calculée automatiquement selon le nombre de pages et le type de papier (blanc / crème / couleur).
- Zone texte 4e de couverture : synopsis + bio auteur + emplacement code-barres réservé (aucun élément dedans).
- Export **PDF/X 300 DPI avec fonds perdus 3 mm**, dimensions exactes exigées par KDP, plus export PNG front seul pour l'ebook.
- Contrôle avant téléchargement : alerte si un texte dépasse la zone sûre, si la tranche est trop fine pour du texte (<100 pages), ou si l'image est sous 300 DPI.

### 4. Parcours unifié
- Un seul point d'entrée « Couverture » qui mène à Cover Studio Pro, avec reprise automatique du titre, de l'auteur, du genre et du nombre de pages du livre ouvert.
- Les anciennes pages couverture redirigent vers ce parcours.

## Détails techniques
- `supabase/functions/generate-premium-cover/index.ts` : ajout du provider Ideogram (`IDEOGRAM_API_KEY`, secret demandé au moment de la mise en place), ordre Ideogram → OpenAI → Gemini/OpenRouter, prompts par genre, mode texte/sans-texte.
- Nouveau `src/config/kdpCoverSpecs.ts` : formats KDP, épaisseur papier, calcul de tranche, zones sûres, bleed.
- `CoverEditorPage.tsx` / `CoverCanvas.tsx` : gabarit wrap, zones 4e/tranche/1re, guides non exportés, contrôles de dépassement.
- `TemplatesPanel.tsx` : presets typographiques par genre + auto-fit du titre.
- Export : `jspdf` en mm avec dimensions exactes calculées, image insérée en qualité `NONE` (pas de recompression `FAST`).
- Pré-remplissage depuis `book_projects` / projet ouvert via query param.

## Clé à créer
Une seule : `IDEOGRAM_API_KEY` (compte ideogram.ai, plan API). Je la demanderai via le gestionnaire de secrets au lancement. Sans elle, tout fonctionne avec les modèles actuels — la qualité typographique vient alors uniquement de la couche vectorielle.
