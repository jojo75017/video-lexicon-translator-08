# Illustration directement dans l’éditeur broché

## Modification prévue

- Placer le bloc **« Illustration de couverture »** en tête des réglages de l’éditeur broché, avant les textes, pour qu’il soit immédiatement accessible.
- Y réunir les boutons **« Générer une illustration »** et **« Importer une illustration »**, avec un aperçu de l’image actuelle juste en dessous.
- Réutiliser les commandes existantes plutôt que créer un second circuit de génération ou d’import.
- Après génération ou import, afficher immédiatement l’image dans l’aperçu et sur la première de couverture, puis conserver le choix après rechargement.
- Garder par défaut **la première illustrée, le dos et la quatrième sur fond uni avec texte seulement**.
- Import accepté : JPG, PNG et WebP, jusqu’à 20 Mo ; afficher les erreurs sans perdre la couverture existante.

## Vérification

- Vérifier l’ouverture du panneau de génération, le choix d’un fichier, l’aperçu et la conservation de l’image après rechargement.
- Aucun lancement de génération payante pendant les vérifications sans votre autorisation.
- Vérifier l’absence d’erreurs et la lisibilité des commandes.

## Limites

Aucune modification des prix, paiements, crédits, droits d’accès, calculs KDP ou autres modules. Aucun email envoyé et aucune publication.

## Détails techniques

Les commandes et l’aperçu existent déjà dans `CoverWrapEditor.tsx`, mais après la liste des textes. Déplacer et clarifier ce bloc en réutilisant `IllustrationGeneratorPanel`, l’import privé et la synchronisation de composition existants. Conserver les appels IA actuels, sans modifier le modèle ni le protocole.