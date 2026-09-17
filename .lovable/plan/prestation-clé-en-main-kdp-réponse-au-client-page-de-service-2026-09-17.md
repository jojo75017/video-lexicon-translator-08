# Prestation « clé en main » KDP : réponse au client + page de service

## Le contexte

Une personne demande une prestation complète pour un manuel de français A1 de 107 pages : correction, mise en page intérieure, couverture complète, fichier Kindle, fichiers conformes KDP, titre/description/catégories/mots-clés, et publication sur son propre compte KDP, en 5 à 7 jours.

Ce n'est pas un abonnement : c'est votre temps de travail. L'abonnement Édition 47 €/mois sert à ceux qui font le travail eux-mêmes. Il faut donc une grille de prestation à part, sans jamais toucher aux tarifs 27 € / 47 € affichés.

## Tarif conseillé (à valider par vous)

Une grille en trois formules, pensée pour un livre de 100 à 150 pages :

| Formule | Contenu | Prix |
| --- | --- | --- |
| Essentiel | Couverture complète (1re, dos, 4e) + fichiers conformes KDP | 149 € |
| Complète | Essentiel + relecture-correction + mise en page intérieure + version Kindle | 349 € |
| Clé en main | Complète + titre, description, catégories, mots-clés + accompagnement à la publication | 449 € |

Options :
- Délai express 5 à 7 jours : +20 %
- Au-delà de 150 pages : +1 € par page supplémentaire

Pour ce manuel de 107 pages en 5 à 7 jours, la réponse à lui envoyer sera donc **449 € + 90 € d'urgence = 539 €**, couverture comprise.

La publication directe sur son compte KDP reste **à décider** : la page annoncera « accompagnement à la publication (visio ou pas à pas) », et la question des accès sera traitée au cas par cas dans le devis. Rien n'affirmera que vous publiez à sa place.

## Ce que je vais créer

1. **Une nouvelle page publique `/prestation-kdp`** : présentation du service, les trois formules avec leurs prix, les options, le délai, ce qui est inclus et ce qui n'est pas inclus, puis un formulaire de demande de devis (nom, e-mail, type de livre, nombre de pages, délai souhaité, description du besoin). Style éditorial ivoire / encre / émeraude / or, comme le reste du site.
2. **Le formulaire réutilise l'envoi existant** utilisé par la page d'offre couverture : la demande arrive dans votre boîte, sans nouvelle table ni nouveau réglage.
3. **Un message prêt à copier** : je le mets dans un encadré de la page d'administration existante des devis si elle s'y prête, sinon je vous le donne directement en réponse ici, avec le prix, le délai, le détail de ce qui est inclus et la mention claire sur la publication KDP.
4. **Un lien discret** vers `/prestation-kdp` depuis la page d'offre couverture, pour les visiteurs qui veulent une prestation plutôt que l'outil.

## Ce que je ne touche pas

Les tarifs 27 € et 47 €, les paiements, la base de données, la sécurité, les calculs KDP, les crédits, le module V4, la page d'accueil V3 et l'ouverture du 1er octobre restent inchangés.

## Détails techniques

- Nouvelle page `src/pages/PrestationKdpPage.tsx`, route publique `/prestation-kdp` déclarée dans `src/App.tsx`, `SeoHead` avec titre et description dédiés.
- Grille tarifaire dans un fichier de données dédié `src/data/prestationKdp.ts` (source unique), séparé de `v3Pricing.ts` pour ne pas mélanger prestation et abonnements.
- Formulaire branché sur la fonction existante `send-subscriber-contact` avec `category: 'Devis prestation KDP'` : aucune migration, aucune fonction à déployer.
- Le texte de réponse client est stocké comme constante dans `src/data/prestationKdp.ts` et affiché avec un bouton « Copier » réservé à l'administrateur.
