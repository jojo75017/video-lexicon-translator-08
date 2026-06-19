# Expansion francophone européenne (sans traduction)

## Décision
Abandon de la version anglaise. À la place : viser les **francophones d'Europe** (Suisse, Belgique, Luxembourg, Allemagne, Canada) qui cherchent à créer et vendre des ebooks sur Amazon KDP. Tout le contenu reste **en français** — aucun support, email ou génération IA à traduire. C'est une expansion de marché, pas de langue.

## Pourquoi cette approche
- Le créateur ne parle pas anglais → support/emails/mises à jour ingérables en EN.
- L'IA est verrouillée en français (`Réponds en français` dans les edge functions) → un client anglophone serait déçu.
- Les données Analytics montrent déjà du trafic DE/CH/BE : très probablement des francophones expatriés, public idéal.
- Marchés CH/LU/BE = fort pouvoir d'achat pour l'offre 67€.

## Périmètre — pages d'acquisition (en français)
Adapter/créer des pages ciblant les francophones à l'étranger :

1. **Nouvelle page** `/creer-ebook-kdp-etranger` (ou `/francophones`) — landing dédiée :
   - Message : « Français expatrié ? Crée et vends ton ebook sur Amazon KDP depuis la Suisse, la Belgique, le Luxembourg, l'Allemagne ou le Canada. »
   - Rassure : KDP accepte les auteurs hors de France, paiement international, fiscalité simple, le produit est 100% en français.
   - CTA vers l'offre / la démo.
2. **Bloc « depuis l'étranger »** sur la page d'accueil et `/offres` : mention que ça marche partout dans le monde francophone (lève l'objection « est-ce que ça marche depuis mon pays ? »).
3. **FAQ** : ajouter 3-4 questions (« Puis-je publier sur KDP depuis la Suisse ? », « Comment suis-je payé à l'étranger ? », etc.).

## SEO
- Cibler des requêtes francophones géolocalisées (ex. « créer un ebook depuis la Suisse », « publier sur Amazon KDP depuis la Belgique », « gagner de l'argent ebook expatrié »).
- `<head>` par page : title/description/canonical auto-référents (méthode déjà en place dans le projet).
- Ajouter la/les nouvelle(s) URL(s) à `public/sitemap.xml`.
- Vérification recommandée avant rédaction : un check Semrush rapide sur 3-4 requêtes francophones (bases `ch`, `be`, `fr`) pour confirmer les volumes et choisir les meilleurs mots-clés à intégrer dans les titres.

## Hors périmètre
- Toute version anglaise du site.
- Génération d'ebooks en anglais.
- i18n (le projet reste mono-langue français).

## Étape suivante après mise en ligne
Suivre dans Analytics les visites des pays francophones (CH, BE, LU, DE, CA) et les clics CTA pendant 2-3 semaines pour valider le filon avant d'aller plus loin.
