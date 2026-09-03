# Cover Studio Pro — refonte complète, vendable à 67 €

Objectif : passer d'un éditeur minimal à un vrai studio de couverture professionnel, livré en une seule grosse refonte. Priorités retenues : images d'abord, puis modèles + polices pro, IA guidée, exports complets.

## 1. Débloquer les images (à faire en premier)

Le coffre de clé personnelle existe déjà (`cover-pro-key` côté serveur, `CoverProKeyVault` côté écran) mais il n'est pas accessible depuis le nouvel éditeur : c'est pour cela que l'outil paraît vide une fois les 3 crédits inclus consommés.

- Ajouter un bandeau d'état permanent dans l'éditeur et dans « Mes couvertures » : crédits inclus restants, ou « clé OpenAI personnelle active », ou invitation à en ajouter une.
- Rendre le coffre accessible en un clic depuis l'éditeur (panneau latéral, pas une nouvelle page).
- Message clair quand il n'y a ni crédit ni clé, avec le lien direct vers l'ajout de clé.
- Recréditer votre compte administrateur pour les tests réels.
- Aucune modification du chiffrement, des droits ni de la logique de réservation de crédits.

## 2. Bibliothèque de modèles professionnels

Passer de 3 à 15 modèles, répartis par genre : Roman, Thriller/Polar, Romance, Fantasy, Développement personnel, Guide pratique, Business, Jeunesse, Cuisine, Biographie.

- Chaque modèle : zones en pourcentage, hiérarchie de tailles, marges de sécurité, interligne, espacement, ombre/contour, voile, bandeau, et 3 variantes de couleurs.
- Vraies polices professionnelles (chargées via Google Fonts, avec repli) : au moins 12 familles classées Serif / Sans / Display, sélecteur avec aperçu réel du nom dans sa police.
- Ajustement automatique de la taille du titre selon sa longueur, borné par le modèle, plus contrôle de contraste automatique (voile ajouté si l'illustration est trop claire ou trop chargée).
- Filtrage des modèles par genre, aperçu miniature de chaque modèle, application non destructive avec bouton « revenir en arrière ».

## 3. IA guidée (fini le brief à la main)

- Sélecteur « partir d'un de mes livres » lisant `ebook_projects` en priorité (titre, auteur, résumé, public, ton) puis `book_projects`.
- Brief de couverture proposé automatiquement par l'IA à partir de ces données (analyse de texte uniquement, modèle rapide de la passerelle Lovable, coût négligeable), entièrement modifiable avant génération.
- Génération de 4 propositions d'illustration en une session, affichées en grille, choix par clic ; le circuit sécurisé existant `cover-pro-generate` reste seul responsable des appels image, des crédits et du stockage privé.
- Historique des illustrations du projet, avec possibilité de revenir à une image précédente.
- Une migration additive sur `cover_projects` : `source_kind`, `source_book_id`, `brief` (jsonb), `template_id`. Aucune colonne supprimée, RLS et grants inchangés.

## 4. Vrais outils de mise en page

- Panneau Calques : ordre, visibilité, verrouillage, duplication.
- Styles complets par calque : ombre, contour, opacité, bandeau, interligne, espacement des lettres, casse.
- Formes et bandeaux décoratifs, badge optionnel (« Tome 1 », « Nouvelle édition »).
- Guides d'alignement magnétiques, centrage, marges de sécurité affichables.
- Annuler / refaire, et aperçu « sans repères » d'un clic.

## 5. Exports complets

- JPEG Kindle 1600 × 2560 (déjà livré et validé, conservé tel quel).
- PNG haute définition.
- PDF broché KDP 300 DPI avec fond perdu, en réutilisant la géométrie déjà validée (`kdpPaperbackSpecs.ts`, `kdpCoverPdf.ts`), textes aplatis dans l'image pour éviter tout souci de police.
- Couverture rigide (jaquette avec rabats) à partir de la même géométrie.
- Mockup 3D de présentation (livre en perspective) pour vos pages de vente et réseaux sociaux.
- Tous les exports sont produits dans le navigateur, sans appel IA, sans crédit débité, sans copie publique, sans URL signée dans le fichier.

## 6. Interface studio

Barre supérieure : Enregistrer · Aperçu · Exporter · Retour.
Colonne gauche : Livre · Illustration · Modèles · Textes · Calques.
Canevas central avec zoom, ajustement et repères.
Colonne droite : propriétés du calque sélectionné.
Parcours visible en haut : 1. Livre → 2. Illustration → 3. Modèle → 4. Textes → 5. Export.

## Détails techniques

- Composition front étendue en `styleVersion: 2` (nouveaux champs optionnels), `version: 1` inchangé pour ne pas casser la composition broché ; migration au parsing, non destructive, les 3 projets existants doivent continuer à s'ouvrir.
- Rendu unique partagé (`drawFrontComposition`) pour l'éditeur, la miniature et tous les exports : ce qui est visible est exactement ce qui est exporté.
- Polices : chargement asynchrone avec `document.fonts.ready` avant chaque export, pour que le JPEG/PDF utilise la bonne police.
- Aucune modification des paiements, du chiffrement des clés, des calculs KDP déjà validés, ni de l'ancien `/v3/cover-studio-pro` (laissé en place, non branché).

## Test final réel

Sur le projet « Les Flammes du Passé » : clé/crédits vérifiés, 4 illustrations générées, modèle Thriller appliqué, textes ajustés, puis export JPEG Kindle (1600 × 2560, < 5 Mo), PNG, PDF broché 300 DPI et mockup. Vérification qu'aucun repère n'apparaît, que le rendu correspond à l'aperçu, et qu'un autre compte ne peut pas exporter le projet. Captures fournies.
