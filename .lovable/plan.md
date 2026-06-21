# Refonte complète — Extension KDP « EbookStudio Scanner » + accès gratuit dans le Hub V3

## Constat actuel
L'extension lit le DOM Amazon en local (`content.js`) avec des sélecteurs fragiles :
- **Données peu fiables** : BSR / prix / avis souvent vides ou faux, estimations de ventes en paliers grossiers codés en dur.
- **UI moche** : badge flottant et popup au dégradé orange/teal basique, peu lisible.
- **Pas assez d'infos** : ni saisonnalité, ni comparaison à la niche, ni vraie analyse de concurrence.

Le backend a déjà ce qu'il faut : `kdp-asin-scraper` + `paapi.ts` (Amazon Product Advertising API : BSR, prix, avis, note, pages, catégories), et `background.js` sait déjà l'appeler.

## Stratégie : données fiables d'abord
On passe d'un mode « scraping DOM local » à un mode **hybride** :
1. Lecture DOM rapide pour l'ASIN + affichage instantané (skeleton de chargement).
2. Appel backend `kdp-asin-scraper` (PA-API officielle) → vraies métriques qui remplacent le DOM.
3. Fallback DOM uniquement si le backend ne répond pas.

## Plan d'exécution

### 1. Backend — fiabiliser & enrichir
- `kdp-asin-scraper` renvoie un payload normalisé : `{ asin, title, author, bsr, price, reviews, rating, pages, categories, imageUrl, publishedAt }`.
- Estimation ventes/revenus calculée **côté serveur**, calibrée par catégorie + marketplace, avec indice de fiabilité.
- Bloc **analyse de niche** : score /100, niveau de concurrence, fourchette de prix saine, 2-3 recommandations.

### 2. Extension — couche données
- Centraliser les appels backend (scan ASIN + niche) avec gestion d'erreur et cache court (`chrome.storage.local`).
- `content.js` : garde la détection ASIN / page recherche, délègue les métriques au backend, DOM en fallback.

### 3. Extension — refonte UI « superbe »
Direction visuelle pro et premium (charte EbookStudio : fond clair #FAFAFA, accent teal #008296, hover orange #FF9E2D, texte #232F3E), aérée, typographie nette, micro-animations discrètes, états de chargement soignés — fini le dégradé criard.
- **Badge produit** : en-tête livre (miniature couverture + titre + auteur), score circulaire animé, verdict clair, grille de stats lisible, bloc « revenus estimés » avec indice de fiabilité, onglets Score / Mots-clés / Niche.
- **Badge recherche** : synthèse de niche + pépites mises en valeur.
- **Popup** : refonte `popup.html` (guide + historique + export CSV) au même langage visuel, états vides soignés.
- Skeleton/spinner pendant l'attente backend.

### 4. Analyses enrichies (onglet Niche + recherche)
- Comparaison du livre à la moyenne de sa catégorie (BSR, prix, avis).
- Concurrence détaillée (faible / moyenne / forte + nb d'acteurs dominants).
- Recommandations actionnables (prix sous-évalué, peu d'avis = opportunité, etc.).
- Mots-clés principaux + longue traîne (améliorés).

### 5. Accès gratuit dans le Hub V3
- Nouveau module/carte **« Extension Scanner KDP — Gratuit pour tous »** dans le Hub V3 (zone création/outils KDP).
- Page ou panneau de présentation : aperçu visuel, bénéfices, bouton **Télécharger l'extension** (fetch + blob du ZIP servi depuis `public/`), et instructions d'installation Chrome (mode développeur / load unpacked).
- Accessible **sans abonnement** (pas derrière `V3Gate`/`SubscriberGate`) — visible et téléchargeable par tous les utilisateurs.

### 6. Packaging
- Re-zipper l'extension dans `public/ebookstudio-scanner.zip` et brancher le bouton de téléchargement.

## Détails techniques
- `kdp-asin-scraper` appelé via l'`ANON_KEY` (déjà dans `background.js`) — aucune clé sensible côté client.
- Estimations centralisées serveur pour rester cohérentes avec EbookStudio.
- MV3 conservé (service worker, `chrome.storage.local`, pas de `localStorage`).
- Téléchargement dans le Hub via `fetch('/ebookstudio-scanner.zip')` → blob (les liens `<a download>` directs échouent dans le preview).
- Fallback DOM préservé pour ne jamais afficher un badge vide.

## Hors périmètre
- Multi-marketplaces déjà supportés (juste normalisés).
- Pas de login/compte ajouté dans l'extension.