# Page essai gratuit 7 jours : thème clair + mise en ligne

La page `/essai-gratuit-7-jours` existe dans le code et répond bien en aperçu. Sur `ebookstudio.fr`, vous tombez sur « Page introuvable » parce que la version publiée du site est antérieure à la création de cette page : la route n'existe pas encore dans le build en ligne. Il faut donc republier après la refonte visuelle.

## 1. Refonte en thème clair

- Fond clair `#FAFAFA`, texte `#232F3E`, accent teal `#008296`, survol `#FF9E2D`.
- Titre « Essai gratuit 7 jours » + sous-titre « Sans carte bancaire ».
- Carte formulaire blanche (bordure fine, ombre douce), champs clairs Prénom / Email, bouton teal pleine largeur.
- Deux cartes blanches côte à côte : « Inclus pendant l'essai » (coches) et « Réservé aux abonnés » (cadenas).
- Écran de confirmation et messages d'erreur (email déjà utilisé + bouton vers l'offre) repris dans le même style clair.
- Rendu mobile conservé.

## 2. Mise en ligne

Publication du site pour que `https://ebookstudio.fr/essai-gratuit-7-jours` serve la vraie page au lieu du 404.

## Ce qui ne change pas

- Formulaire, validation, anti-duplication, création de l'essai 7 jours.
- Envoi du contact et du tag `ESSAI_EBOOKSTUDIO` vers Systeme.io.
- L'URL et la redirection depuis `/essai-gratuit`.

## Détails techniques

- Refonte de `src/pages/launch/EssaiGratuit7JoursPage.tsx` : remplacement des valeurs sombres codées en dur par les tokens clairs du design system, sans toucher à `submit()` ni à l'appel `free-trial-signup`.
- Titre et meta description vérifiés pour le partage.
- Publication du front (les fonctions serveur sont déjà déployées).

## Vérification

Contrôle navigateur en aperçu (rendu clair, soumission d'un email de test, message « déjà utilisé » au second envoi), puis contrôle de l'URL publique après publication.
