# Vos livres : afficher vos vraies couvertures

## Ce que j'ai vérifié

- Dans votre bibliothèque de livres, une carte n'affiche une image que si le livre lui-même contient une image enregistrée. Sur vos 20 derniers livres, la grande majorité n'en a aucune : ces cartes affichent donc toutes le **même fond marron avec le titre**. C'est ce que vous voyez comme « la même couverture ».
- Vos vraies couvertures (Les Flammes du Passé, Les Murmures du Profond, l'amour en héritage, les Larmes de Sang, Les sentiers du nord…) existent bien et sont intactes dans le studio de couvertures. Elles ont chacune leur propre miniature.
- Mais la bibliothèque de livres ne va jamais les chercher : les deux espaces ne se parlent pas. D'où l'impression de les avoir perdues.
- Deux anciennes couvertures « Reconversion professionnelle après 40 ans » sont rangées sous un ancien espace de stockage et n'apparaissent plus dans la liste. Elles seront récupérées aussi.

Aucune couverture n'a été supprimée.

## Ce que je propose de faire

1. **Relier les deux espaces.** Chaque carte de livre cherche d'abord une couverture du studio portant le même titre (comparaison sans accents ni majuscules) et l'affiche. Vos couvertures réapparaissent immédiatement là où vous les attendez.
2. **Bouton « Choisir une couverture »** sur chaque carte : une petite fenêtre montre toutes vos couvertures du studio, vous en choisissez une pour ce livre, et le choix est mémorisé.
3. **Fin des cartes jumelles.** Quand aucune couverture n'existe encore, la carte reste sobre mais devient reconnaissable (teinte propre au livre, titre et auteur mieux mis en page), avec le bouton pour créer la couverture.
4. **Récupérer les anciennes couvertures** rangées sous l'ancien espace de stockage, afin qu'elles réapparaissent dans la liste.

## Détails techniques

- `V3LibraryPage.tsx` (`BookCard`) : résolution de la vignette en cascade — `ebook_images[0].url` / `cover_concepts` existants, sinon miniature `cover_projects` correspondante via `getSignedCoverUrl`, sinon repli visuel.
- Chargement des projets de couverture une seule fois au niveau de la page (`listCoverProjects`) puis index par titre normalisé, passé aux cartes ; pas d'appel par carte.
- Choix manuel : sélecteur listant les `cover_projects` avec miniature signée ; enregistrement de l'URL signée résolue dans `ebook_projects.ebook_images` comme aujourd'hui (aucun nouveau champ, aucune migration).
- Repli visuel : teinte dérivée de l'identifiant du livre parmi une petite palette éditoriale existante (ivoire/encre/émeraude/or), pas de couleur codée en dur hors tokens.
- `coverLibrary.ts` : lecture additionnelle de l'ancien préfixe de stockage en plus de l'identifiant courant, sans jamais y écrire.
- Aucun changement de base, de sécurité, de règles KDP, de paiement ni de crédits ; aucune génération d'image.
