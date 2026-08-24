# Page essai gratuit 7 jours en thème clair

La page `/essai-gratuit-7-jours` existe déjà et fonctionne (formulaire prénom + email, anti-robot, envoi vers Systeme.io). Seul son habillage change : on abandonne le fond sombre pour l'identité claire du site.

## Ce qui change (visuel uniquement)

- Fond clair `#FAFAFA`, texte `#232F3E`, accent teal `#008296`, survol `#FF9E2D` — même identité que le reste d'EbookStudio.
- Titre principal lisible : « Essai gratuit 7 jours » + sous-titre « Sans carte bancaire ».
- Carte formulaire blanche, bordure fine, ombre douce, champs clairs, bouton teal pleine largeur.
- Deux colonnes « Inclus pendant l'essai » (coches vertes) et « Réservé aux abonnés » (cadenas gris) en cartes blanches.
- Écran de confirmation et messages d'erreur (email déjà utilisé + bouton vers l'offre) repris dans le même style clair.
- Responsive mobile conservé.

## Ce qui ne change pas

- Le formulaire, la validation, l'anti-duplication, la création de l'essai, l'envoi du contact et du tag `ESSAI_EBOOKSTUDIO` vers Systeme.io.
- L'URL `https://ebookstudio.fr/essai-gratuit-7-jours` et la redirection depuis `/essai-gratuit`.

## Détails techniques

- Refonte de `src/pages/launch/EssaiGratuit7JoursPage.tsx` : remplacement des classes/valeurs sombres codées en dur par les tokens clairs du design system, aucune modification de la logique `submit()` ni de l'appel `free-trial-signup`.
- Titre et meta description de la page vérifiés pour le partage.

## Vérification

Contrôle navigateur sur `/essai-gratuit-7-jours` : rendu clair, formulaire soumis avec un email de test, message « déjà utilisé » sur un second envoi.
