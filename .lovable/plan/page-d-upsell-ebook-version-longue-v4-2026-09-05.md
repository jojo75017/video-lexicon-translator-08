# Page d’upsell — Ebook Version Longue V4

Objectif : créer une page de vente sombre à haute conversion pour l’offre **Ebook Version Longue**, distincte du Studio BD et de la couverture V4.

## Position dans le parcours

Nouvelle adresse dédiée : **`/v3/offre-version-longue`**.

Cette adresse évite tout mélange avec `/bd-upsell`, `/v3/cover-pro` et `/v3/offre-couverture-v4`. Le bouton de refus ramène vers **`/v3`**, l’espace membre général.

```text
Commande principale
       │
       ▼
/v3/offre-version-longue
       ├── OUI, ajouter 47 € ──► paiement intégré ──► espace membre
       └── Non merci ───────────────────────────────► /v3
```

## Structure de la page

```text
┌──────────────────────────────────────────────────┐
│ OFFRE SPÉCIALE UNIQUE — NE FERMEZ PAS CETTE PAGE │
├──────────────────────────────────────────────────┤
│ PROCHAINEMENT V4 — MISE À JOUR INCLUSE           │
│                                                  │
│ Générez des Ebooks Complets et Longs Format      │
│ (100+ pages) en quelques clics                   │
│                                                  │
│ [Aperçu visuel d'un vrai livre structuré]        │
├──────────────────────────────────────────────────┤
│ PLAN H2/H3 → CHAPITRES → EXEMPLES → COUVERTURE   │
│              → FAQ                               │
├──────────────────────────────────────────────────┤
│ 5 MODULES CLÉS                                   │
├──────────────────────────────────────────────────┤
│ 197 € barré       47 € paiement unique           │
│ [OUI ! AJOUTER EBOOK VERSION LONGUE — 47 €]      │
│ Stripe · PayPal · Garantie 30 jours              │
│ [Non merci, je passe à mon espace membre]        │
└──────────────────────────────────────────────────┘
```

### 1. En-tête d’urgence

- Bandeau pleine largeur : **« OFFRE SPÉCIALE UNIQUE — NE FERMEZ PAS CETTE PAGE »**.
- Badge lumineux : **« PROCHAINEMENT V4 — MISE À JOUR INCLUSE GRATUITEMENT »**.
- Titre : **« Générez des Ebooks Complets et Longs Format (100+ pages) en quelques clics »**.
- Sous-titre : **« Fini les textes superficiels de 5 pages : créez de véritables livres d’autorité, romans et guides pratiques prêts à publier. »**

### 2. Démonstration du module Version Longue

Créer un bloc interactif en quatre étapes :

1. **Plan détaillé H2/H3** — sommaire hiérarchisé visible.
2. **Rédaction approfondie** — progression chapitre par chapitre.
3. **Exemples et analogies** — enrichissement des passages trop généraux.
4. **Couverture et FAQ** — finalisation éditoriale du livre.

Au clic ou au survol, chaque étape devient active et montre un petit aperçu réaliste du résultat. Sur mobile, les étapes deviennent une liste verticale tactile.

Le visuel reste une démonstration de parcours, sans lancer de génération ni consommer de crédit.

### 3. Modules clés

Cinq cartes sombres avec accent orange/néon :

- **Moteur de Rédaction Longue Durée**
- **Générateur de Plans SEO & Sommaires**
- **Créateur de Couvertures HD**
- **Export Multi-formats** — PDF, EPUB et Word
- **Suite Marketing** — e-mails et pages de vente

Les capacités déjà disponibles seront présentées comme incluses. Toute capacité encore en préparation sera clairement marquée **« Disponible avec la V4 »**, afin de ne pas vendre comme active une fonction qui ne l’est pas encore.

### 4. Offre à 47 €

- Prix de référence **197 €** barré et prix spécial **47 €** très visible.
- Mention **paiement unique**, sans abonnement.
- Bouton principal exact : **« OUI ! AJOUTER EBOOK-VERSION_LONGUE À MA COMMANDE (47 €) »**.
- Après le clic, le paiement Stripe s’ouvre directement dans la page, sans redirection vers une présentation intermédiaire.
- Alternative PayPal sous le bouton.
- Bouton secondaire : **« Non merci, je refuse cette offre unique et je passe à mon espace membre. »**, vers `/v3`.
- Bloc confiance : Stripe, PayPal et garantie 30 jours satisfait ou remboursé.

## Direction visuelle

- Fond ultra-sombre utilisant les couleurs sémantiques du site, avec contraste proche de `slate-950`.
- Orange lumineux réservé aux actions et aux étapes actives ; touches cyan discrètes pour les informations V4.
- Typographie très lisible, grands titres, textes courts, aucun effet agressif.
- Cartes compactes, angles sobres, fins contours lumineux ; pas de surcharge ni de faux compte à rebours.
- Mise en page responsive : deux colonnes sur ordinateur quand utile, une colonne et boutons pleine largeur sur mobile.

## Réalisation technique

- Nouvelle page dédiée et nouvelle route `/v3/offre-version-longue`.
- Petit composant isolé pour la démonstration interactive des quatre étapes.
- Contenu de l’offre centralisé dans une source unique, séparée des offres BD et couverture.
- Ajout du pack `ebook_version_longue` à 47 € au catalogue de paiement existant, avec paiement Stripe intégré et suivi de commande identique aux autres packs.
- PayPal relié au même produit et au même prix.
- Aucun changement aux offres BD, couverture, abonnements, calculs KDP ou autres modules.

## Contrôles avant livraison

- Vérifier la page en ordinateur et mobile, sans débordement ni texte coupé.
- Vérifier les quatre étapes interactives du module de démonstration.
- Vérifier que le bouton principal ouvre bien le paiement intégré à 47 €.
- Vérifier que PayPal utilise bien l’offre Ebook Version Longue.
- Vérifier que « Non merci » mène à `/v3`.
- Vérifier que la page ne consomme aucun crédit IA.
- Fournir une capture ordinateur et une capture mobile.
