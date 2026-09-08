# Deux corrections : compte à rebours invisible + kit de démarrage

## 1. Compte à rebours de la page Comic Agent

Constat vérifié dans le navigateur : les chiffres du compte à rebours s'affichent bien
(12 : 23 : 37 …) mais en gris foncé sur un fond presque noir — invisibles à l'œil.

Correction :
- Redonner du contraste aux cases : fond ivoire/blanc, chiffres foncés, fine bordure dorée,
  pour rester dans l'esprit éditorial de la page.
- Rendre le bloc un peu plus grand et ajouter la mention « Fin de l'offre : 31 décembre 2026 »
  sous les chiffres, pour que le message reste clair même en un coup d'œil.
- Vérifier le rendu en clair et en sombre.

## 2. Kit de démarrage (page « Kit de démarrage »)

Constat vérifié : le fichier PDF existe et se télécharge correctement, mais la zone
« Lire en ligne » affiche le message d'échec « Votre navigateur n'affiche pas les PDF »
suivi d'un grand cadre vide de 720 px — c'est ce qui donne l'impression d'une erreur.

Correction :
- Remplacer la visionneuse actuelle par un affichage plus fiable (cadre PDF standard),
  qui fonctionne dans les navigateurs récents.
- Si le navigateur refuse toujours d'afficher le PDF, ne plus laisser de cadre vide :
  afficher à la place un encart propre avec deux boutons, « Télécharger le kit » et
  « Ouvrir dans un nouvel onglet ».
- Garder le bouton de téléchargement en haut, inchangé.

## Détails techniques

- `src/pages/comic/ComicAgentPage.tsx` : dans `Countdown`, remplacer
  `bg-foreground text-background` par des couleurs contrastées explicites
  (surface claire + texte encre), ajouter la ligne de rappel de date.
- `src/pages/v3/V3KitDemarragePage.tsx` : remplacer `<object data=…>` par un `<iframe>`
  avec `title`, hauteur responsive, plus un état de repli sans cadre vide
  (boutons télécharger / ouvrir).
- Aucun changement de base de données, de sécurité, de paiement ni de calcul KDP.

## Vérification

- Capture de la page Comic Agent : chiffres du compte à rebours lisibles.
- Capture de la page Kit de démarrage : PDF visible ou encart de repli propre,
  plus aucun cadre vide, téléchargement fonctionnel.
