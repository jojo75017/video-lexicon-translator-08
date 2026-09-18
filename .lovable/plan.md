# Fiche ASIN : un code, trois livrables

Une seule page nouvelle : on colle un ASIN, on choisit le marketplace, et on obtient en une fois la description de vente, les 7 mots-clés backend et le contenu A+ en 4 modules. Rien de copié sur KDP Pilot : mise en page maison, style maison d'édition (ivoire, encre, émeraude, or), et notre propre logique de rédaction.

## La page `/v3/fiche-asin`

1. **En haut** : champ ASIN + choix du marché (fr, com, co.uk, de, es, it) + bouton « Analyser la fiche ». Bouton de retour visible.
2. **Carte livre** : couverture, titre, auteur, prix, avis, note, BSR, pages, catégories, lien vers Amazon. Données réelles issues de notre outil d'extraction existant. Une mention claire quand une donnée n'est pas disponible (jamais de valeur inventée).
3. **Bloc Description** : description de vente prête à coller, compteur de caractères (limite 4 000), bouton Copier.
4. **Bloc 7 mots-clés** : exactement 7 expressions, chacune avec son nombre de caractères et un bouton Copier, plus « Tout copier ».
5. **Bloc Contenu A+** : 4 modules (bannière, 3 colonnes de bénéfices, texte enrichi, tableau comparatif), chacun copiable séparément, avec une suggestion de visuel entre crochets.
6. **Bouton « Tout exporter »** : un fichier texte téléchargé en local, sans passer par le serveur.

## Comportement

- Un seul clic lance l'extraction puis la rédaction ; une barre d'état indique l'étape en cours.
- Si l'ASIN est introuvable ou le marché mauvais, message clair et possibilité de réessayer.
- Textes 100 % en français, aucun latin ni mot inventé.
- Tous les textes sont modifiables dans la page avant copie.
- Historique local des 10 derniers ASIN analysés, pour y revenir sans recommencer.

## Accès

Entrée « Fiche ASIN — description, mots-clés, A+ » dans le menu du header, rubrique des outils de données Amazon, à côté de KDP Pilot. Accès selon les règles actuelles de la V3 (rien de changé aux verrous ni aux tarifs).

## Détails techniques

- Réutilise `kdp-asin-scraper` (mode `asin`) pour les données produit, sans le modifier.
- Nouvelle fonction `kdp-fiche-asin` : reçoit les données produit, renvoie en un seul JSON `{ description, keywords[7], aplus[4] }`. Authentification par `supabase.auth.getUser()`, CORS, validation de l'entrée, gestion des 429/timeout avec message explicite.
- Clé IA : modèle BYOK comme les autres outils (clé Gemini ou OpenRouter de l'abonné), erreur explicite renvoyant vers les réglages de clé si absente.
- Nouveaux fichiers seulement : `src/pages/v3public/V3FicheAsinPage.tsx`, quelques composants de bloc, `supabase/functions/kdp-fiche-asin/index.ts`, route dans `src/App.tsx`, entrée de menu dans `src/data/v3HeaderMenu.ts`.
- Intouchés : base de données, sécurité, paiements, crédits, calculs KDP, V4, générateur A+ admin existant.

## Vérification

Analyser un ASIN réel sur amazon.fr, contrôler que les données correspondent à la fiche Amazon, que les mots-clés sont bien au nombre de 7, que chaque bouton Copier fonctionne et que l'export texte contient les trois parties.
