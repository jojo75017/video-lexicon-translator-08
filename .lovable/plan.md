# Page « Ebook Version Longue 47 € » — lisibilité et clarté

## Ce qui fonctionne aujourd'hui (vérifié)

- Le bouton principal 47 € ouvre bien un vrai paiement par carte intégré dans la page (pack `ebook_version_longue`, 47 €, paiement unique). La commande est enregistrée pour le suivi.
- Le bouton PayPal enregistre la commande puis ouvre le lien de paiement PayPal dans un nouvel onglet.
- « Non merci » ramène bien à l'espace membre.
- La démonstration en 4 étapes est une simple animation de présentation : elle ne lance aucune génération et ne consomme aucun crédit.
- En revanche, l'outil « Version Longue » lui-même n'existe pas encore : c'est une vente en accès anticipé V4. Les cartes portent déjà la mention « Disponible avec la V4 » quand la fonction n'est pas encore active.

## Problème constaté

Le fond quasi noir fatigue les yeux et certains textes (descriptions, mentions, petits libellés gris) passent presque inaperçus. Plusieurs blocs importants (offre, garanties, refus) sont trop bas ou trop discrets.

## Ce que je propose de changer

1. **Passer la page en clair éditorial** : fond ivoire/papier, textes encre foncée, orange conservé uniquement pour l'action et les étapes actives, et une touche sobre pour les informations V4. Plus de grand fond noir.
2. **Renforcer tous les contrastes** : gris trop pâles remplacés par un gris encre lisible, petits libellés agrandis, mentions légales et bouton de refus lisibles sans effort.
3. **Remonter l'offre** : un rappel de prix et un bouton d'achat visibles dès le haut de la page, en plus du bloc d'achat complet plus bas.
4. **Rendre visible ce qui était caché** : les 5 cartes de modules et la démonstration reçoivent un fond clair contrasté, avec l'étiquette « Inclus » ou « Disponible avec la V4 » bien lisible.
5. **Ajouter une phrase d'honnêteté** juste sous le prix : accès anticipé, l'outil complet arrive avec la V4, mise à jour incluse.

## Détails techniques

- Remplacer les variables de `.longform-offer-theme` dans `src/index.css` par une palette claire (fond ~`40 30% 97%`, texte ~`222 30% 14%`, muted-foreground assombri) — thème isolé, aucune autre page touchée.
- Ajuster `EbookLongFormOfferPage.tsx` et `LongFormProcessDemo.tsx` : ombres et lueurs sombres remplacées par des bordures/ombres douces, tailles de texte relevées, ajout du bloc prix + CTA dans l'en-tête (même fonction de paiement, aucun nouveau flux).
- Aucun changement de prix, de pack, de fonction serveur, de base, de sécurité ni de crédit IA.

## Contrôles

- Vérification ordinateur et mobile : aucun texte coupé, aucun débordement, contraste suffisant.
- Le bouton 47 € ouvre toujours le paiement carte, PayPal ouvre toujours son lien, « Non merci » ramène à l'espace membre.
- Deux captures fournies (ordinateur et mobile).
