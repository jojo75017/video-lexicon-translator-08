# Module couverture 67 € : niveau maison d'édition

Objectif : que l'abonné qui paie 67 € obtienne un vrai studio de couverture — Kindle, broché **et** relié — avec la possibilité d'enregistrer et de télécharger l'image générée à tout moment.

## 1. Enregistrer et télécharger l'image générée

Aujourd'hui l'image sert seulement de fond dans l'éditeur.

- Sous chaque image générée : deux boutons toujours visibles, **« Enregistrer dans mes couvertures »** et **« Télécharger l'image »** (fichier JPEG haute définition, sans titre ni texte par-dessus).
- Une petite galerie « Mes images générées » sous l'aperçu : les propositions précédentes du projet, cliquables pour revenir à l'une d'elles, chacune avec son bouton de téléchargement.
- Rien n'est public : l'image reste dans votre espace privé, le téléchargement se fait dans le navigateur.

## 2. Les trois formats, vraiment complets

Un sélecteur clair en haut du projet : **Kindle · Broché · Relié**.

- **Kindle** : 1600 × 2560 px, JPEG < 5 Mo (déjà en place), plus un aperçu miniature Amazon pour vérifier la lisibilité du titre.
- **Broché** : couverture complète 1re + tranche + 4e, tranche calculée depuis le nombre de pages, fonds perdus, exports PDF / PNG / 1re seule / mockup (déjà en place, conservé).
- **Relié (nouveau)** : même logique, avec la géométrie propre au relié KDP — jaquette, rabats, tranche plus épaisse — repères visibles et export PDF prêt à envoyer.

Chaque format affiche ses dimensions réelles et le contrôle de conformité avant téléchargement.

## 3. Plus professionnel dans l'éditeur

- **Variantes en un clic** : 3 propositions de mise en page (titre haut / centré / bas) générées depuis vos textes, sans nouvelle image ni crédit.
- **Palette extraite de l'image** : le titre, le sous-titre et l'auteur peuvent prendre les couleurs dominantes de l'illustration, avec contrôle automatique du contraste.
- **Alignement assisté** : repères de centrage, marges de sécurité, verrouillage des calques.
- **Contrôle qualité renforcé** : titre trop petit en miniature, texte trop près d'un bord, contraste insuffisant, image de résolution trop faible pour le format choisi.
- **Retouche locale** : luminosité, contraste, saturation, chaleur, cadrage et miroir (déjà en place) réunis dans un même panneau lisible, avec remise à zéro.

## 4. Ce qui ne change pas

Prix, paiements, crédits, base de données, sécurité, calculs KDP existants et module V4 : aucune modification.

## Détails techniques

- `src/config/coverFormats.ts` + nouveau `src/lib/cover-editor/kdpHardcoverSpecs.ts` : géométrie relié (jaquette + rabats, tranche par pages), réutilisation du moteur `wrapComposition`.
- `src/components/cover-editor/CoverWrapEditor.tsx` : mode `hardcover`, repères rabats, exports PDF/PNG via `wrapExports.ts`.
- `src/pages/v3/mes-couvertures/CouvertureProjetPage.tsx` : sélecteur de format persistant sur le projet (colonne `format_id` existante, aucune migration).
- `src/components/cover-editor/IllustrationGeneratorPanel.tsx` et `src/components/cover-studio-pro/CoverProIllustrationPanel.tsx` : boutons enregistrer (fonction `cover-studio-save-image` existante) + téléchargement local de l'illustration brute, galerie d'historique privé.
- `src/lib/cover-editor/frontComposition.ts` / `coverExports.ts` : variantes de mise en page, extraction de palette et contrôle de contraste, tout en local.
- `src/components/cover-editor/CoverQualityPanel.tsx` : nouvelles règles (contraste, résolution, marges par format).

Aucun changement de base, de sécurité, de paiement, de crédits ni du module V4.
