# Faire venir des abonnés sans email marketing

## D'abord, un point clair sur les identifiants

Je ne peux pas — et je ne dois pas — utiliser vos mots de passe Facebook ou LinkedIn. Les deux plateformes l'interdisent (bannissement du compte possible), et stocker un identifiant personnel dans l'app serait un risque de sécurité. Il n'existe pas non plus d'API publique qui permette de « publier à votre place » sur un profil LinkedIn personnel ou dans des groupes Facebook.

La solution qui marche : l'app prépare tout le contenu (texte + visuel + lien traqué), vous n'avez plus qu'à coller. 2 minutes par jour, zéro risque.

## Levier 1 — Studio de publication sociale (copier-coller)

Une page `/v3/social` avec un calendrier de 30 jours :
- 1 post par jour prêt à copier : Facebook (groupes KDP/autoédition), LinkedIn (post pro), Instagram/TikTok (script court).
- Bouton « Copier » + « Copier avec mon lien de parrainage » (lien traqué `?ref=`).
- Visuel généré automatiquement pour chaque post (format carré + vertical).
- Case à cocher « publié » pour suivre l'avancement.

## Levier 2 — Rendre le cadeau viral

La page `/cadeau` (10 niches + kit de démarrage) devient partageable :
- Aperçu social propre (titre, description, image) quand le lien est collé sur Facebook/LinkedIn.
- Après téléchargement : écran « Offrez-le à un auteur » avec boutons de partage et le lien de parrainage de l'utilisateur.
- Compteur visible : « X auteurs ont déjà reçu le pack ».

## Levier 3 — Le chapitre gratuit comme aimant public

Chaque chapitre généré en essai obtient une page publique en lecture seule (`/chapitre/xxxx`) :
- L'auteur peut la partager fièrement ; ses lecteurs découvrent Ebookstudio en bas de page.
- Bouton « Créer le mien gratuitement » sous chaque chapitre partagé.
- Pages indexables par Google (contenu unique = trafic organique gratuit).

## Levier 4 — Parrainage mis en avant

Le système de parrainage existe déjà mais reste invisible :
- Bandeau dans la barre latérale : « Parrainez : 30 % de commission ».
- Tableau de bord clair (clics, inscrits, gains) sur `/mon-parrainage`.
- Récompense non monétaire aussi : 1 filleul abonné = 1 mois offert.

## Levier 5 — Vitrine publique des livres

Une galerie publique `/livres` des livres créés (avec accord de l'auteur) : couverture, titre, extrait. C'est la preuve la plus convaincante, et ça crée des dizaines de pages indexées.

## Levier 6 — SEO de fond

- Vérifier titres/descriptions des pages publiques clés (`/cadeau`, `/essai`, `/commander`, `/v3`).
- Données structurées (produit, avis, FAQ) pour apparaître plus large dans Google.
- Lien croisé systématique avec le blog existant.

## Ordre proposé

1. Studio de publication sociale + liens traqués (impact immédiat, effort maîtrisé)
2. Cadeau viral + parrainage visible
3. Chapitre gratuit public + galerie publique
4. Passe SEO

## Détails techniques

- Le partage social se fait par balises Open Graph / Twitter Card côté pages publiques, avec image générée.
- Les liens traqués réutilisent `affiliate_clicks` et `referral_codes` déjà en place.
- Les pages publiques de chapitre/galerie n'exposent que ce que l'auteur a explicitement rendu public (colonne dédiée + politique d'accès en lecture seule).
- Aucun stockage d'identifiants tiers : rien de nouveau côté secrets.
