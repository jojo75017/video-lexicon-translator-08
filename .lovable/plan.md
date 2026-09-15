# Rendre « Faire ma couverture » réellement modifiable

## Constat vérifié
- Le bouton **« Faire ma couverture »** du livre ouvre actuellement l’ancien Cover Studio dans une fenêtre du Hub V3.
- Le parcours récent `/v3/couverture-express` possède déjà les champs modifiables nécessaires : titre, sous-titre, auteur, synopsis, genre et format.
- L’éditeur de projet `/v3/mes-couvertures/:id` possède déjà les outils de texte, d’image, de luminosité et d’export.

## Correction
1. Faire ouvrir **« Faire ma couverture »** directement sur `/v3/couverture-express`, avec les informations disponibles du livre préremplies.
2. Garantir que les champs du parcours restent modifiables après ce préremplissage, sans état grisé ni lecture seule.
3. Après création, conserver la redirection immédiate vers le véritable éditeur du projet.
4. Dans l’éditeur, rendre évident le déverrouillage d’un calque verrouillé afin que ses réglages puissent être modifiés.

## Vérification
- Ouvrir « Faire ma couverture » depuis un livre existant.
- Modifier le titre, le sous-titre, l’auteur, le synopsis et le genre.
- Créer la couverture, arriver dans l’éditeur, modifier un texte et éclaircir l’image.
- Vérifier sur ordinateur et mobile que les commandes ne sont plus grisées ou inaccessibles.

## Limites
Aucun changement à la base, à la sécurité, aux paiements, aux crédits IA ou aux calculs KDP.
