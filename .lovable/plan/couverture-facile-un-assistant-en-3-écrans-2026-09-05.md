# Couverture facile : un assistant en 3 écrans

Objectif : un abonné qui n'a jamais fait de couverture arrive, répond à quelques questions simples, et repart avec une couverture finie. L'éditeur détaillé actuel reste en place, inchangé, accessible pour ceux qui veulent tout régler.

## Nouveau parcours (nouvelle adresse, rien de supprimé)

Une nouvelle page « Créer ma couverture en 3 étapes », ajoutée à côté de l'existant.

### Écran 1 — Mon livre
Une seule colonne, cinq champs, rien d'autre :
- Titre
- Sous-titre (facultatif)
- Nom d'auteur
- Genre du livre (liste simple : Roman, Thriller, Romance, Fantasy, Développement personnel, Guide pratique, Business, Jeunesse, Cuisine, Biographie)
- Format : eBook Kindle ou Livre broché

Un bouton unique en bas : « Étape suivante ».

### Écran 2 — Je choisis mon style
- L'assistant propose 3 couvertures complètes, déjà remplies avec le titre, le sous-titre et l'auteur saisis, dans le style correspondant au genre choisi.
- L'abonné clique sur celle qu'il préfère. Aucun réglage obligatoire.
- Trois boutons discrets seulement : « Changer l'illustration », « Autres propositions », « Couleur plus claire / plus foncée ».
- Un lien discret « Régler chaque détail moi-même » ouvre l'éditeur complet existant avec la couverture déjà en place.

### Écran 3 — Je télécharge
- Grand aperçu de la couverture retenue.
- Bouton principal : « Télécharger ma couverture ». Pour l'eBook, le fichier Kindle 1600 × 2560. Pour le broché, le fichier d'impression.
- Bouton secondaire : « Enregistrer et continuer plus tard ».
- Une phrase rassurante : où retrouver le fichier et à quoi il sert sur Amazon.

## Rendre le résultat digne d'un vrai livre

Les propositions de l'écran 2 partent des trois modèles de référence déjà validés, avec, par genre : la bonne police, la bonne taille de titre selon sa longueur, un voile automatique si l'illustration est trop claire, et le nom d'auteur toujours à la même place. L'abonné ne voit aucun de ces réglages.

## Guidage permanent

- En haut : « 1. Mon livre → 2. Mon style → 3. Mon fichier », l'étape en cours en évidence.
- Une phrase d'explication par écran, en français simple, sans terme technique.
- Un encadré d'état clair sur les images : nombre d'illustrations restantes, ou invitation à ajouter sa clé personnelle, avec le lien direct.

## Points d'entrée

- Le bandeau « Votre maison d'édition de couvertures » sur l'accueil V3 pointe en premier vers l'assistant, avec un second lien « Éditeur avancé ».
- La page « Mes couvertures » gagne un bouton « Créer avec l'assistant » à côté du bouton actuel.
- Les adresses actuelles continuent de fonctionner exactement comme aujourd'hui.

## Détails techniques

- Nouvelle route `/v3/couverture-express` avec une page à trois étapes (état local, pas de nouvelle table).
- Réutilisation stricte de l'existant : `referenceTemplates.ts`, `coverTemplates.ts`, `coverFonts.ts`, `frontComposition.ts`, `kindleExport.ts`, `coverExports.ts`, `IllustrationGeneratorPanel` et la fonction sécurisée `cover-pro-generate`.
- Enregistrement dans `cover_projects` via les fonctions déjà utilisées par `MesCouverturesPage`, sans changement de schéma, de RLS ni de grants.
- Aucune modification des paiements, du chiffrement des clés, des calculs KDP, de `CoverFrontEditor`, `CoverWrapEditor` ni de l'ancien `/v3/cover-studio-pro`.
- Exports produits dans le navigateur : aucun crédit consommé au téléchargement.

## Vérification

Parcours complet avec un livre test : saisie du titre, choix d'un style, téléchargement du fichier Kindle vérifié en 1600 × 2560 et moins de 5 Mo, puis ouverture du même projet dans l'éditeur avancé pour confirmer qu'il est identique. Captures des trois écrans fournies.
