# Images KDP A+ dans la Fiche Audit

## Résultat attendu

Dans chaque module du bloc « Contenu A+ », l’abonné pourra créer une image adaptée au format Amazon correspondant, la prévisualiser puis la télécharger localement.

## Ce qui sera ajouté

- Un bouton clair « Créer l’image » dans chacun des 4 modules A+.
- Le format indiqué avant génération : dimensions en pixels et usage Amazon.
- Une image sans texte, logo, prix, avis client, bouton d’achat ni marque Amazon afin d’éviter les refus KDP.
- Le livre et la suggestion visuelle du module servent automatiquement de consigne à l’IA.
- Prévisualisation de l’image générée, puis boutons « Télécharger » et « Recréer ».
- État de progression et message d’erreur précis pour chaque module, sans bloquer les autres.

## Formats

Les dimensions seront associées au type de module A+ et l’image finale téléchargée sera recadrée proprement dans le navigateur au format exact attendu. L’interface indiquera clairement le format produit.

## Sécurité et fonctionnement

- Génération uniquement pour un utilisateur connecté.
- Appel IA effectué côté serveur ; aucune clé secrète dans le navigateur.
- L’image est produite pour le module demandé uniquement et n’est pas publiée automatiquement.
- Aucun changement aux tarifs, paiements, droits d’accès, couvertures ou autres pages KDP.

## Vérification

- Générer une image pour chacun des 4 modules.
- Vérifier les dimensions exactes du fichier téléchargé.
- Vérifier la lisibilité de tous les boutons et leur contraste.
- Vérifier les états chargement, erreur, téléchargement et nouvelle génération.
