# Couverture brochée : rendre l'éditeur vraiment complet

La couverture ouverte (« Les Murmures du Profond ») est une couverture **brochée** (dos + 4e de couverture). C'est pour cela que l'écran n'est pas le même que pour une couverture Kindle : cet écran-là n'a ni réglage de luminosité, ni aperçu dans les réglages KDP, ni téléchargement. Voici ce qui va être ajouté, sur ce même écran.

## 1. Modifier les textes plus simplement

- Les trois zones (Première · Dos · Quatrième) restent, mais chaque texte devient éditable directement dans une liste toujours visible à droite : titre, sous-titre, auteur, texte du dos, résumé de 4e, à propos.
- Un bouton « Ajouter un texte » propose les textes manquants au lieu de les cacher.
- Clic sur un texte du canevas = ouverture de ses réglages (police, taille, couleur, gras, alignement, ombre) sans avoir à chercher.
- Message clair quand une zone est vide : « Aucun texte sur le dos — ajoutez le titre et votre nom. »

## 2. Éclaircir ou assombrir l'illustration

- Curseur « Luminosité de l'illustration » (plus sombre ← normal → plus clair), avec bouton « Réinitialiser ».
- Effet immédiat sur le canevas, la miniature et tous les téléchargements.
- L'image d'origine n'est jamais modifiée : le réglage est réversible à tout moment.
- Réglage complémentaire « Voile de contraste » pour garder les textes lisibles sur une image chargée.

## 3. Voir la couverture dans les réglages KDP

- Le panneau « Réglages KDP » s'ouvre déjà déplié et affiche, à côté des chiffres (pages, papier, épaisseur du dos), un aperçu réel de la couverture complète avec les repères de coupe.
- Les mesures calculées (largeur totale, dos, fond perdu, zone de sécurité) restent affichées telles quelles : aucun calcul KDP n'est modifié.
- Quand le nombre de pages change, l'aperçu se met à jour immédiatement pour montrer le dos qui s'élargit.

## 4. Téléchargements (ce qui justifie le prix)

- PDF couverture complète prêt pour KDP, 300 DPI, fond perdu inclus.
- JPEG haute définition de la première de couverture seule (pour Kindle et les réseaux).
- PNG haute définition de la couverture complète.
- Visuel de présentation (livre en perspective) pour vos pages de vente.
- Tout est produit dans le navigateur : aucune IA, aucun crédit débité, aucun fichier rendu public.

## 5. Confort d'édition

- Alignement magnétique et centrage automatique par zone.
- Verrouillage d'un texte pour éviter de le déplacer par erreur.
- Duplication d'un texte d'une zone vers une autre.
- Annuler / Rétablir conservés, plus un bouton « Aperçu sans repères ».
- Statut d'enregistrement et « Retour à mes couvertures » toujours visibles en haut.

## Détails techniques

- `wrapComposition.ts` : champs optionnels `imageBrightness` (borné 0,7–1,5) et `overlay`, ajoutés en restant en `version: 2` et en respectant le déclencheur de validation existant (aucune URL ni token persistés). Valeurs par défaut inchangées pour les projets existants.
- `CoverWrapEditor.tsx` : curseur de luminosité + voile, liste de textes éditables, ajout/duplication/verrouillage, aimantation, barre de téléchargements.
- `KdpPaperbackConfigPanel.tsx` : déplié par défaut, aperçu de la couverture complète réutilisant le même rendu que le canevas.
- Nouveau `wrapExports.ts` : rendu canvas partagé (fond, illustration, luminosité, voile, textes) puis PDF/PNG/JPEG/mockup, en réutilisant la géométrie validée de `kdpPaperbackSpecs.ts`.
- Polices chargées via `document.fonts.ready` avant chaque export pour que le fichier corresponde à l'aperçu.

## Ce qui ne change pas

- Aucun changement de base de données, de droits d'accès, de paiement, de crédits ni des calculs KDP.
- Aucune nouvelle génération d'image payante : les téléchargements sont locaux.
- L'éditeur Kindle existant et la génération d'illustration restent tels quels.
