# Onglet KDP — page 1 : Fiche Audit EbookStudio KDP

Création d'un onglet « KDP » dans la barre d'onglets V3, conçu pour accueillir plusieurs pages au fil du temps. On commence par une seule page : **Fiche Audit**. On colle un ASIN, on obtient la description de vente, les 7 mots-clés backend et le contenu A+ en 4 modules. Aucun copiage : mise en page maison (ivoire, encre, émeraude, or) et notre propre logique de rédaction.

## L'onglet KDP

- Nouvelle entrée « KDP » dans la barre d'onglets, avec un menu listant les pages de l'espace.
- Au lancement, le menu contient : **Fiche Audit** (nouvelle) et les outils KDP déjà existants (données KDP, KDP Pilot), regroupés au même endroit.
- Structure prévue pour ajouter d'autres pages plus tard sans retoucher la navigation : une simple liste de pages KDP dans un fichier de données.

## Page 1 — `/v3/kdp/fiche-audit`

1. **En haut** : champ ASIN + choix du marché (fr, com, co.uk, de, es, it) + bouton « Analyser la fiche ». Bouton de retour visible.
2. **Carte livre** : couverture, titre, auteur, prix, avis, note, classement, pages, catégories, lien vers Amazon. Données réelles issues de notre outil d'extraction existant. Mention claire quand une donnée n'est pas disponible — jamais de valeur inventée.
3. **Bloc Description** : description de vente prête à coller, compteur de caractères (limite 4 000), bouton Copier.
4. **Bloc 7 mots-clés** : exactement 7 expressions, chacune avec son nombre de caractères et un bouton Copier, plus « Tout copier ».
5. **Bloc Contenu A+** : 4 modules (bannière, 3 colonnes de bénéfices, texte enrichi, tableau comparatif), copiables séparément, avec une suggestion de visuel entre crochets.
6. **Bouton « Tout exporter »** : fichier texte téléchargé en local, sans passer par le serveur.

## Comportement

- Un seul clic lance l'extraction puis la rédaction ; une barre d'état indique l'étape en cours.
- ASIN introuvable ou mauvais marché : message clair et possibilité de réessayer.
- Textes 100 % en français, aucun latin ni mot inventé.
- Tous les textes sont modifiables dans la page avant copie.
- Historique local des 10 derniers ASIN analysés.

## Accès

L'onglet KDP suit les règles actuelles de la V3 : rien de changé aux verrous, aux tarifs ni au mode contemplation avant le 1er octobre.

## Détails techniques

- Réutilise `kdp-asin-scraper` (mode `asin`) pour les données produit, sans le modifier.
- Nouvelle fonction `kdp-fiche-audit` : reçoit les données produit, renvoie un seul JSON `{ description, keywords[7], aplus[4] }`. Authentification `supabase.auth.getUser()`, CORS, validation d'entrée, gestion 429/timeout avec message explicite.
- Clé IA : modèle BYOK comme les autres outils (clé Gemini ou OpenRouter de l'abonné), erreur explicite renvoyant vers les réglages de clé si absente.
- Nouveaux fichiers : `src/data/kdpTabPages.ts` (liste des pages de l'onglet), `src/pages/v3public/kdp/V3KdpFicheAuditPage.tsx`, quelques composants de bloc, `supabase/functions/kdp-fiche-audit/index.ts`. Modifications minimales : route dans `src/App.tsx`, onglet dans la barre d'onglets V3.
- Intouchés : base de données, sécurité, paiements, crédits, calculs KDP, V4, générateur A+ admin existant.

## Vérification

Analyser un ASIN réel sur amazon.fr, contrôler que les données correspondent à la fiche Amazon, que les mots-clés sont bien au nombre de 7, que chaque bouton Copier fonctionne, que l'onglet KDP apparaît et que l'export texte contient les trois parties.
