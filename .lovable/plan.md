# Des couvertures dignes d'une offre à 67 €

## Le vrai problème visible

Dans l'éditeur, deux galeries se contredisent :

- « Modèles de référence » (3 modèles) : vraies couvertures finies, avec image, cadre, ornements. Correct.
- « Modèles professionnels » (15 modèles) : de simples rectangles dégradés avec du faux texte, sans aucune illustration. C'est ce qui donne l'impression d'amateurisme sur la page.

Résultat : l'abonné qui paie 67 € voit d'abord 15 vignettes vides et ternes, avant de comprendre que la vraie qualité est ailleurs.

## Ce que je propose de faire

1. **Supprimer les vignettes vides.** Les 15 modèles ne s'affichent plus comme des rectangles dégradés : chaque vignette est dessinée avec le même moteur de rendu que les modèles de référence, sur une vraie illustration (celle du projet en cours si elle existe, sinon une image de démonstration du genre). L'abonné voit une couverture crédible avant de cliquer.

2. **Réduire à une seule galerie claire.** Un seul bloc « Modèles de couverture », avec les filtres par genre déjà existants, et les 3 modèles de référence mis en avant en premier. Plus de doublon, plus de confusion.

3. **Remonter la qualité perçue des vignettes.** Format uniforme (proportion Kindle), ombre portée légère, titre/sous-titre/auteur du projet réellement affichés dans la vignette (pas « Titre du livre »).

4. **Relever la qualité de l'illustration générée.** La direction artistique par défaut passe en rendu photographique/pictural haut de gamme, avec des consignes renforcées contre l'aspect générique, et le choix de style reste visible et explicite avant de générer.

5. **Message clair quand il n'y a pas encore d'illustration.** À la place d'un aplat de couleur, un encart qui invite à générer l'illustration, avec le bouton orange déjà existant.

## Ce que je ne touche pas

Base de données, sécurité, paiements, crédits, calculs KDP, module V4, et les exports Kindle/PDF déjà validés.

## Détails techniques

- `src/lib/cover-editor/coverTemplates.ts` : les variantes conservent leurs réglages ; seule la génération de l'aperçu change.
- `src/components/cover-editor/CoverFrontEditor.tsx` : la grille des 15 variantes rend chaque vignette sur `<canvas>` via `drawFrontComposition`, avec l'image du projet ou une image de démonstration locale ; fusion visuelle avec `ReferenceTemplateGallery`.
- `src/components/cover-editor/ReferenceTemplateGallery.tsx` : devient la galerie unique (modèles de référence + variantes filtrées par genre).
- `supabase/functions/cover-pro-generate/index.ts` : renforcement du prompt de la direction artistique par défaut (aucun changement de modèle, de coût ni de logique de crédits).
- Vérifications : typecheck, tests existants, et contrôle visuel de l'éditeur sur `/v3/mes-couvertures/:id` avec session authentifiée.
