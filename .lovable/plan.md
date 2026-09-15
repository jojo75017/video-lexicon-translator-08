# Image jeunesse en arrière-plan du bandeau Studio BD & Jeunesse (47 €)

## Objectif
Sur `/v3`, le bandeau « Studio BD & Jeunesse — 47 € à vie » affiche une vraie image jeunesse en fond, dans l'esprit de la référence Bolt (main d'enfant qui dessine, crayons de couleur), tout en gardant le texte parfaitement lisible.

## Étapes

1. **Générer l'image (IA)**
   - Image photoréaliste (pas de cartoon) : main d'enfant tenant un crayon de couleur au-dessus d'un pot de crayons, lumière douce et joyeuse, tons chauds compatibles avec la palette ivoire/encre/vert/or de la page.
   - Format paysage, sauvegardée dans `src/assets/`.

2. **L'intégrer dans `BdComicNewsBanner.tsx` (version pleine largeur uniquement)**
   - Colonne de droite (ou fond du panneau droit) remplie par l'image avec coins arrondis, comme sur la référence.
   - Voile dégradé ivoire/discret côté texte pour garantir la lisibilité (norme de contraste).
   - Les 3 points forts (personnages, planches, exports KDP) restent visibles — éventuellement superposés sur l'image avec fond papier semi-opaque.
   - Texte, prix 47 €, bouton et lien `/bd-offre` inchangés.
   - La version `compact` (listes/upsells) n'est pas modifiée.

3. **Vérifications**
   - TypeScript + aperçu navigateur de `/v3` : image visible, texte lisible, aucun débordement.
   - Aucun changement : base de données, paiements, routes, prix.

## Hors périmètre
Pas de modification de l'offre, du checkout, ni des autres sections de la page d'accueil.
