# V3 — Couverture KDP exacte en PDF + cohérence « wow »

## Objectif
Aujourd'hui le Studio Couverture ne produit qu'un **gabarit PNG** et des dimensions à recopier. La V3 doit livrer un **vrai PDF de couverture complète** (4e de couv + dos + 1re de couv) aux **dimensions exactes KDP**, prêt à uploader. Le tout présenté comme un **nouveau module V3 dédié**, avec un rendu homogène et premium (effet « wouhaa »).

---

## 1. Nouveau module dans la roadmap V3
Dans `src/data/roadmapV3.ts`, ajouter un module pilier `publier` :
```text
id: 'cover-pdf-exact'
title: 'Couverture KDP Exacte (PDF)'
description: 'Génère le PDF wrap complet (4e+dos+1re) aux dimensions exactes KDP, bleed + zone ISBN, prêt à uploader.'
status: 'in_progress'
```

## 2. Moteur de génération PDF exact
Nouveau fichier `src/lib/kdpCoverPdf.ts` (utilise `jsPDF`, déjà installé) :
- Entrées : format trim (po), nb de pages, type de papier (facteur dos), bleed, image 1re de couv (URL/dataURL), titre/auteur, texte 4e de couv.
- Calcule la **largeur totale** = `2×(trim_w + bleed) + (pages × facteur_papier)` et **hauteur** = `trim_h + 2×bleed` (mêmes formules que `KdpCoverStudio`).
- Crée un PDF `unit: 'in'` à la taille exacte (donc 300 DPI à l'impression), une seule page paysage.
- Place : image de couv sur le panneau avant (avec bleed), bloc dos (titre + auteur verticaux centrés sur la tranche), 4e de couv (fond + description + réserve **zone ISBN 2"×1.2"** en bas à droite laissée blanche).
- Repères de sécurité optionnels désactivés dans l'export final (PDF propre).
- Export `downloadKdpCoverPdf()` + retour `Blob` réutilisable.

## 3. Brancher dans le Studio Couverture
Dans `src/components/ebook/KdpCoverStudio.tsx` : à côté du bouton « Télécharger le gabarit », ajouter **« Télécharger le PDF couverture (exact KDP) »** qui appelle le nouveau moteur avec l'image de couverture actuelle, le format, le nb de pages et le papier sélectionnés.

## 4. Intégrer la couverture full au Pack KDP
Dans `src/lib/kdpPackZip.ts` : permettre de fournir le **Blob PDF couverture** (et l'ajouter comme `couverture-complete.pdf`) en plus des images, pour un pack 100 % cohérent.

## 5. Page / accès module dédié
- Ajouter une route `/couverture-kdp` (lazy import) dans `src/App.tsx`, mirroring `/audit-pilot`.
- Page wrapper réutilisant `UnifiedCoverStudio`/`KdpCoverStudio` avec en-tête module V3.

## 6. Homogénéité « wouhaa »
Uniformiser sur la charte KDP (fond `#FAFAFA`, teal `#008296`, texte `#232F3E`, hover `#FF9E2D`) via tokens sémantiques :
- Hero, badges et boutons du Studio Couverture alignés sur le style des autres modules V3.
- Cohérence des libellés/CTA et des états de chargement.

## 7. Correctif rapide
Erreur runtime « Failed to fetch dynamically imported module EbookPlannerPage.tsx » : vérifier qu'elle est bien transitoire (chunk obsolète après les derniers edits) après le build ; corriger si un import casse réellement.

---

## Détails techniques
- Pas de backend nécessaire : génération 100 % client (`jsPDF`).
- Images chargées en dataURL avant insertion (gestion CORS/fetch comme `fetchAsBlob`).
- Facteurs papier et bleed repris à l'identique de `KdpCoverStudio` pour cohérence des calculs.
- PDF en pouces = dimensions physiques exactes ; on documente CMJN/300 DPI dans la checklist existante.

Je confirmerai chaque export en QA (conversion PDF→image) avant livraison.