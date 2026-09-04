# Trois modèles de référence vraiment vendables

Objectif : ne pas ajouter de fonctionnalités ni 15 modèles. Refaire les **trois** modèles de référence existants pour qu'ils atteignent le niveau des exemples fournis (composition riche, calques réels, miniatures avec vraie image de démonstration). Aucun appel IA, aucun crédit de génération.

## Ce qui existe déjà
- `referenceTemplates.ts` construit bien 3 modèles avec des calques réels (formes, cadre, ornements, textes).
- La galerie dessine déjà les miniatures avec le moteur de rendu partagé et une image de démonstration locale (`cover-demo-*.jpg`).
- Le panneau des calques permet déjà sélection, déplacement, masquage, verrouillage, suppression.
- L'export Kindle utilise le même moteur de rendu que l'aperçu.

Le manque est la **richesse graphique** : les modèles ressemblent encore à des aplats de couleur + typographie.

## Ce qui sera refait

### Modèle 1 — Guide professionnel
- Fond bleu nuit avec dégradé subtil et texture de bandeaux.
- Grande zone géométrique du titre à deux couleurs typographiques (mot fort en doré).
- Séparation diagonale nette entre haut et bas.
- Zone photographie déplaçable en bas à droite (cadre + filet doré).
- Quatre blocs avec **pictogramme réel** (nouveau type de calque « pictogramme » : coche, étoile, cible, éclair) et texte modifiable à côté.
- Bandeau inférieur avec nom d'auteur inversé.

### Modèle 2 — Non-fiction spectaculaire
- Illustration plein écran, sujet préservé (voile dégradé haut/bas au lieu d'un aplat).
- Trois bandeaux superposés, décalés, derrière le titre, chacun un calque distinct.
- Titre sur trois lignes, très grand, avec couleurs différenciées par ligne, contour et ombre puissants.
- Placement automatique du bloc titre dans la zone la plus calme (haut ou bas) pour ne pas masquer le sujet.

### Modèle 3 — Roman premium
- Illustration plein écran assombrie + voile automatique derrière le texte.
- Double cadre doré (trait fin + trait épais) et quatre ornements d'angle plus travaillés (volutes, pas de simples traits).
- Grand titre Serif doré avec halo lumineux léger (ombre dorée diffuse).
- Sous-titre en petites capitales espacées et nom d'auteur sur filet doré.

Tous les éléments (formes, cadres, ornements, pictogrammes, bandeaux, textes) restent des calques sélectionnables, déplaçables, modifiables, masquables, verrouillables et supprimables.

## Détails techniques
- `frontComposition.ts` : ajout du type de forme `icon` (pictogramme vectoriel dessiné au canvas, jeu fermé de 6 glyphes) + support `gradient` optionnel sur `rect` (voiles dégradés) et `glow` sur les calques texte. `FRONT_COMPOSITION_VERSION` reste `1`, tous les champs sont optionnels et la lecture des compositions existantes est préservée.
- `referenceTemplates.ts` : réécriture des trois constructeurs, ornements et pictogrammes plus détaillés, placement automatique du titre selon la luminosité estimée de l'illustration.
- `ShapeLayersPanel.tsx` : les pictogrammes apparaissent dans la liste des calques avec les mêmes actions que les autres formes (aucune nouvelle fonctionnalité, simple étiquetage).
- Miniatures : inchangées dans leur principe, elles refléteront automatiquement les nouveaux modèles.
- Aucun changement à la base, à la sécurité, aux calculs KDP, aux paiements, ni à `/v3/cover-studio-pro`.

## Vérification
1. Appliquer les trois modèles au projet « Les Flammes du Passé » (titre, sous-titre « Roman », auteur « Georges Boubet »).
2. Trois captures lisibles de l'aperçu, une par modèle.
3. Export Kindle 1600 × 2560 JPEG d'un modèle et comparaison visuelle avec l'aperçu.
4. Contrôle qu'aucun appel IA / crédit n'est consommé, et que chaque calque reste éditable.

Arrêt après ces trois modèles, en attente de validation avant d'étendre à 15 modèles.
