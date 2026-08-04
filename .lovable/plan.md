# État des lieux et remise au propre du parcours client

## État constaté

### 1. Les routes mélangent achat et connexion

- La racine `/` envoie tout visiteur non connecté vers `/commander`, donc le site donne immédiatement l’impression d’être uniquement une page d’achat.
- La route inconnue `*` renvoie elle aussi vers `/commander`. Une ancienne URL, une faute de frappe ou un lien périmé conduit donc silencieusement à l’achat au lieu d’afficher une page introuvable ou de proposer la connexion.
- `/login` et `/connexion` redirigent désormais correctement vers `/connexion-abonne`.
- `/subscription` est déclarée deux fois : une première fois comme redirection vers la connexion, puis une seconde fois comme page d’abonnement. Cette duplication rend le comportement ambigu et la seconde définition inutile.
- `/offres` renvoie un visiteur vers `/commander`, mais renvoie un client déjà reconnu vers le Planner. Elle ne joue donc plus réellement le rôle de page « offres ».
- De nombreuses anciennes routes commerciales (`/offre-59`, `/59`, `/sales`, `/v3-offre`, `/essai-gratuit`, etc.) convergent vers `/commander` sans distinguer l’intention d’achat, de connexion ou d’information.
- Il existe plusieurs pages de paiement ou anciennes étapes encore routées : `/commande-v3`, `/v3-paiement`, `/promo/commande`, `/promo/paiement`, `/paiement-manuel`, `/upsell-paiement`.

### 2. Les emails mélangent plusieurs offres

- Les campagnes récentes utilisent simultanément des noms et messages autour de **47 €**, **59 €** et d’anciennes relances V2/V3.
- Le moteur d’onboarding encore présent annonce une offre à vie à **67 €** et envoie vers `/promo/commande`.
- Ce même onboarding utilise `/subscription` comme lien « accéder à mon espace », alors que cette route est actuellement redirigée vers la connexion et existe en double.
- L’email de paiement standard annonce encore **67 € et 12 mois**, tandis que l’email du tunnel `/commander` annonce **47 € et accès à vie**.
- L’outil d’ajout manuel d’abonné utilise encore d’anciens forfaits `27 €/mois`, `67 €/mois` et « Lifetime », avec un bouton « Commencer maintenant » dont le lien vaut `#`.
- Une adresse expéditeur contient une faute : `noreply@ebookstudio.frr`.

### 3. Plusieurs moteurs d’envoi coexistent

- Des campagnes ponctuelles envoient directement les offres commerciales.
- Un ancien moteur automatique de séquences envoie encore via un premier fournisseur.
- Un second moteur d’onboarding utilise un autre fournisseur et la même table de séquences.
- Les emails de paiement, de code d’accès, d’administration, d’essai et de cadeaux sont encore envoyés directement depuis plusieurs fonctions différentes.
- La base contient actuellement **5 séquences `welcome` actives et en retard depuis janvier 2026**, ainsi que **2 séquences `promo_funnel` actives**. Cela confirme que d’anciens automatismes n’ont pas été complètement arrêtés.
- Sur les 45 derniers jours, le journal contient environ **14 418 envois marqués envoyés** et **88 367 entrées marquées en erreur**. Le volume d’erreurs montre des relances ou tentatives historiques très importantes qu’il faut neutraliser et analyser avant toute nouvelle campagne.

### 4. Pourquoi l’administrateur reçoit des emails sans paiement

- `boubetgeorges@gmail.com` est utilisé comme destinataire de test des campagnes A/B et comme adresse de réponse/administration.
- Les derniers emails reçus à cette adresse sont bien des campagnes marketing de test ou des relances, pas des confirmations de paiement.
- Les notifications administrateur peuvent également être déclenchées lors d’un ajout ou d’une mise à jour manuelle d’abonné, sans qu’un paiement soit nécessaire.
- La table principale des commandes du tunnel ne montre actuellement qu’une ancienne commande PayPal de test en attente ; elle ne justifie pas les emails marketing reçus récemment.

### 5. Accès client

- Les deux comptes vérifiés (`pacheco97223@gmail.com` et `boubetgeorges@gmail.com`) possèdent maintenant un code `EBK-XXXXXX` valide et un accès actif.
- La récupération de code répare désormais les anciens comptes sans code et renvoie vers `/connexion-abonne`.
- Il reste toutefois deux interfaces de récupération : la fenêtre intégrée à la connexion et la page `/mon-code`, avec des retours différents (`/subscription` contre `/connexion-abonne`).

## Parcours cible unique

```text
Prospect
  -> /commander
  -> paiement intégré
  -> confirmation vérifiée côté serveur
  -> création/activation de l'accès
  -> un seul email « paiement confirmé + code »
  -> /connexion-abonne
  -> /ebook-planner

Client existant
  -> /connexion-abonne
  -> code perdu : /mon-code
  -> /ebook-planner
```

## Plan de remise au propre

### Étape 1 — Sécuriser les routes

- Conserver trois entrées publiques explicites : `/commander` pour acheter, `/connexion-abonne` pour se connecter, `/mon-code` pour récupérer le code.
- Faire de `/login`, `/connexion` et `/subscription` de simples alias vers `/connexion-abonne`, avec une seule déclaration par route.
- Supprimer la définition dupliquée de `/subscription`.
- Remplacer la redirection générale des URLs inconnues vers l’achat par une page claire proposant « Acheter » ou « Déjà client ? Se connecter ».
- Classer les anciens liens commerciaux : alias vers `/commander` uniquement s’ils correspondent réellement à l’offre actuelle ; sinon retrait ou redirection informative.
- Harmoniser tous les retours après récupération de code vers `/connexion-abonne`.

### Étape 2 — Geler les automatismes obsolètes

- Désactiver les séquences `welcome` périmées et empêcher les anciens moteurs de reprendre des envois.
- Mettre en pause les campagnes automatiques commerciales tant que l’inventaire des destinataires, tarifs et liens n’est pas validé.
- Conserver les journaux historiques, sans supprimer les preuves d’envoi.
- Séparer strictement les emails de test administrateur des campagnes réelles, avec un marquage visible `[TEST]` dans l’objet.

### Étape 3 — Unifier l’offre commerciale actuelle

- Définir une seule source de vérité pour le prix, la durée de l’offre, les avantages et l’URL `/commander`.
- Retirer des flux actifs toutes les mentions contradictoires à 59 € ou 67 € tant que l’offre publique est à 47 €.
- Archiver les modèles anciens au lieu de les laisser appelables par les automatismes.
- Vérifier chaque CTA : aucun `#`, aucune ancienne page promo, aucun lien vers une route ambiguë.

### Étape 4 — Unifier les emails clients indispensables

- Garder quatre familles clairement séparées : paiement confirmé, code d’accès, assistance, notifications administrateur.
- N’envoyer « paiement confirmé » qu’après confirmation serveur du paiement, jamais lors d’une simple création manuelle ou d’une visite.
- Générer et enregistrer le code avant l’envoi, puis refuser l’envoi si le code est vide.
- Utiliser partout le même bouton vers `/connexion-abonne`, le même nom EbookStudio et le même expéditeur valide.
- Faire des ajouts manuels d’abonnés un flux distinct intitulé « accès créé manuellement », sans vocabulaire de paiement.

### Étape 5 — Contrôler et tester le parcours complet

- Tester séparément : visiteur, acheteur 1 fois, paiement fractionné, paiement refusé, client existant, code perdu et ajout manuel.
- Vérifier pour chaque scénario la route finale, le statut en base, le code créé et le nombre exact d’emails reçus.
- Contrôler les liens depuis les anciens emails encore en circulation.
- Ajouter une vue administrateur dédupliquée du journal d’emails pour distinguer tests, campagnes, accès et paiements.

## Résultat attendu

- Un prospect ne peut plus confondre achat et connexion.
- Une URL erronée ne conduit plus automatiquement au paiement.
- Un paiement confirmé produit exactement un accès et un email client cohérent.
- Un email marketing ne peut plus être pris pour une confirmation de vente.
- Un seul tarif et un seul tunnel sont actifs à un instant donné.
