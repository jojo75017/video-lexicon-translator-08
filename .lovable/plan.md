# Plan email ebookstudio.fr

## Objectif
Permettre l'envoi fiable des codes d'accès après paiement et des campagnes marketing, sans perturber la réception actuelle sur Amazon SES.

## État actuel vérifié
- **Domaine email Lovable** : non configuré (statut `not_started`).
- **Domaine du projet** : `ebookstudio.fr` et `www.ebookstudio.fr` sont liés comme custom domain.
- **Réception actuelle** : `ebookstudio.fr` utilise Amazon SES (ne pas toucher aux MX sans préparation).
- **Clé API Systeme.io** : déjà présente dans le projet (`SYSTEMEIO_API_KEY`).
- **Resend** : non utilisé dans le code, peut être annulé.
- **Plan Lovable** : Pro (Lovable Emails inclus).

## Configuration email proposée

### Moteur transactionnel (codes d'accès, confirmations de paiement)
- **Lovable Emails** via sous-domaine délégué `notify.ebookstudio.fr`.
- **Envoi** : depuis `noreply@notify.ebookstudio.fr` ou `contact@notify.ebookstudio.fr`.
- **Authentification** : SPF, DKIM et DMARC gérés automatiquement par Lovable après délégation NS.
- **Limite** : inclus dans le plan Pro (jusqu'à 50 000 emails transactionnels/mois).

### Moteur marketing (campagnes, relances, prospects)
- **Systeme.io** (déjà connecté via `SYSTEMEIO_API_KEY`).
- L'application pousse les nouveaux prospects et contacts vers Systeme.io.
- Les séquences de vente (offre 47 €, relances) sont gérées dans Systeme.io, pas dans l'application.

### Ce qui ne change pas
- La réception d'emails sur `ebookstudio.fr` reste sur Amazon SES.
- Aucun MX/SPF/DMARC de `ebookstudio.fr` n'est modifié.
- Aucun achat de boîte email Hostinger n'est nécessaire.

## Étapes du plan

### 1. Déléguer un sous-domaine d'envoi
Créer un sous-domaine dédié à l'envoi pour ne pas toucher à la réception actuelle.
- Sous-domaine proposé : `notify.ebookstudio.fr`
- Lovable génère automatiquement les enregistrements NS.
- L'utilisateur copie ces 2 enregistrements NS dans Hostinger.
- Lovable gère ensuite SPF, DKIM et DMARC automatiquement.

### 2. Configurer l'infrastructure email Lovable
Une fois le domaine délégué :
- Activer l'infrastructure email partagée (queues, send log, suppression, cron).
- Scaffolder les templates d'emails d'authentification (codes d'accès, confirmation de paiement, récupération de mot de passe).
- Scaffolder les templates transactionnels si nécessaire.
- Déployer les Edge Functions concernées.

### 3. Connecter les codes d'accès à Lovable Emails
Modifier les points d'envoi actuels des codes d'accès pour passer par le système Lovable transactionnel au lieu d'un système externe ou d'un envoi manuel.

### 4. Préparer la campagne marketing dans Systeme.io
- Utiliser la clé API Systeme.io existante pour synchroniser les prospects.
- Créer la séquence marketing (offre 47 €, codes d'accès, relances) directement dans Systeme.io.
- L'application n'envoie plus de campagnes marketing en masse : elle pousse les contacts vers Systeme.io.

### 5. Tester
- Envoi d'un code d'accès test.
- Envoi d'un email de confirmation de paiement test.
- Inscription d'un prospect test dans Systeme.io.

## Alternative si la délégation NS est impossible
Si Hostinger ne permet pas d'ajouter des enregistrements NS ou si l'utilisateur ne souhaite pas déléguer :
- Utiliser Systeme.io également pour les emails transactionnels (codes d'accès).
- Désactiver complètement l'envoi d'emails depuis Lovable et ne garder que Systeme.io comme moteur d'envoi.
- Cela implique de configurer l'intégration Systeme.io dans les points de code actuels (paiement, connexion, etc.).

## Livrables attendus
- Domaine `notify.ebookstudio.fr` délégué et vérifié (ou alternative Systeme.io validée).
- Infrastructure email Lovable active et testée.
- Codes d'accès envoyés automatiquement après paiement.
- Prospects synchronisés avec Systeme.io pour la campagne marketing.
