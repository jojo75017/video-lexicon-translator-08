# Plan — Accueil V3 plus éditorial, moins vert

## Objectif
Rééquilibrer uniquement la page d’accueil `/v3` pour lui donner l’allure d’une maison d’édition premium : davantage de papier ivoire, d’encre et d’or, moins de grands aplats verts, une vidéo présentée comme une pièce éditoriale, et un bandeau de lancement nettement plus fin.

Le module **Studio de couverture V4**, ses boutons, ses textes, sa page dédiée et son fonctionnement resteront strictement inchangés.

## Schéma visuel proposé

```text
ACCUEIL V3
│
├── Module Studio de couverture V4
│   └── INCHANGÉ
│
├── Bandeau lancement très fin
│   ├── Fond encre / bleu nuit, sans vert
│   ├── Offre + date sur une seule ligne
│   ├── Compteur compact
│   └── Un bouton principal + liens secondaires discrets
│
├── Présentation principale V3
│   ├── Fond papier ivoire
│   ├── Titre éditorial sombre
│   ├── Or utilisé seulement en accent
│   └── Fonctionnalités sous forme de mentions légères
│
├── Vidéo dans un cadre éditorial
│   ├── Largeur généreuse mais contenue
│   ├── Double filet fin façon couverture de livre
│   ├── En-tête de chapitre : titre, durée, sous-titres
│   ├── Fond papier/encre, sans grand aplat vert
│   └── Ombre sobre et coins peu arrondis
│
└── Suite de la page
    ├── Alternance papier blanc / ivoire / gris encre
    ├── Vert réservé aux petites actions et repères
    └── Or réservé aux filets, numéros et détails premium
```

## 1. Réduire le bandeau de lancement
- Passer d’un grand bloc sur deux rangées à un bandeau horizontal compact sur ordinateur.
- Remplacer son fond vert par un ton **encre / bleu nuit** afin de rompre la répétition visuelle.
- Conserver les informations essentielles : échéance du 30 septembre, offre à 47 €, ouverture V3 et compteur.
- Réduire les quatre cases du compteur et rapprocher les éléments pour diminuer fortement la hauteur.
- Garder un seul bouton principal visible ; transformer les autres choix en liens secondaires plus discrets.
- Sur téléphone, autoriser deux lignes propres sans retrouver la hauteur actuelle.
- Conserver le comportement actuel, le compte à rebours et toutes les destinations.

## 2. Alléger la présentation principale
- Remplacer le grand fond émeraude du bloc d’introduction par une composition papier ivoire, texte encre et filets dorés.
- Garder le même titre, la même promesse et les mêmes liens.
- Transformer les cinq pastilles Kindle, broché, couverture, audio et métadonnées en repères fins et lumineux plutôt qu’en éléments posés sur un fond sombre.
- Utiliser l’émeraude uniquement comme accent secondaire, pas comme surface dominante.

## 3. Donner à la vidéo un vrai cadre éditorial
- Conserver la vidéo actuelle et sa largeur déjà contenue.
- Remplacer l’écrin sombre vert actuel par une section papier ou encre neutre, avec un cadre inspiré d’une couverture de livre : double filet or, petite mention de collection et titre en serif.
- Mettre la vidéo dans un cadre rectangulaire sobre, moins arrondi, avec une ombre légère.
- Afficher clairement « Présentation V3 », « 7 minutes » et « Sous-titrée en français » sans surcharger.
- Préserver les commandes natives, le format 16:9 et la lecture actuelle.

## 4. Rééquilibrer les couleurs du reste de l’accueil
- Examiner les sections de `/v3` qui utilisent actuellement de grands fonds verts et remplacer seulement les répétitions les plus fortes par :
  - papier blanc ;
  - ivoire doux ;
  - gris encre pour une seule section de contraste ;
  - or en détail.
- Conserver le vert sur les boutons d’action, petits badges et indicateurs lorsque cela aide à comprendre l’interface.
- Ne changer ni l’ordre des sections, ni leurs contenus, ni leurs liens.
- Préserver le thème sombre avec des contrastes lisibles.

## 5. Vérification
- Contrôler l’accueil complet sur ordinateur et téléphone.
- Vérifier que le bandeau de lancement est réellement moins haut et que son compteur reste lisible.
- Vérifier la lecture de la vidéo et son cadrage 16:9.
- Vérifier qu’aucun texte ni bouton ne se chevauche.
- Vérifier toutes les destinations conservées et l’absence d’erreur dans la console.
- Comparer visuellement la quantité de vert avant/après et fournir des captures de l’accueil et du cadre vidéo.

## Périmètre strict
- Modifications limitées à la présentation de l’accueil V3, du bandeau de lancement et du cadre de la vidéo.
- **Aucune modification du module V4**, de sa bannière, de ses routes, de son offre, de son paiement ou de ses outils.
- Aucun changement de base de données, sécurité, IA, crédits, génération, export, tarifs ou calculs KDP.
