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

## Étapes de configuration

### 1. Déléguer `notify.ebookstudio.fr` dans Lovable
Actions côté interface Lovable :
1. Ouvrir la configuration email (via le bouton `Set up email domain` ou Cloud → Emails).
2. Sélectionner `ebookstudio.fr` comme domaine racine.
3. Lovable génère **2 enregistrements NS** pour `notify.ebookstudio.fr`.

Actions côté Hostinger :
1. Se connecter à la gestion DNS de `ebookstudio.fr` dans Hostinger.
2. Ajouter 2 enregistrements de type **NS** avec le nom `notify`.
3. Les valeurs sont les 2 noms de serveurs fournis par Lovable.
4. Ne pas toucher aux MX/SPF/DMARC existants de `ebookstudio.fr`.

### 2. Attendre la vérification DNS
- Propagation : jusqu'à 72 heures, souvent 10 à 30 minutes.
- Lovable passe automatiquement le domaine en statut `active`.
- SPF, DKIM et DMARC sont générés automatiquement par Lovable dans la zone déléguée.

### 3. Activer l'infrastructure email Lovable
Une fois le domaine `active` :
- Lancer `setup_email_infra` pour créer les queues, tables (`email_send_log`, `suppressed_emails`, etc.), Vault secrets et cron `process-email-queue`.
- Scaffolder les templates d'emails d'authentification (`scaffold_auth_email_templates`) :
  - signup
  - magic-link
  - recovery
  - invite
  - email-change
  - reauthentication
- Appliquer les couleurs de la marque (fond #FAFAFA, accent teal #008296, texte #232F3E) aux templates.
- Déployer l'Edge Function `auth-email-hook`.
- Scaffolder les templates transactionnels si des confirmations spécifiques sont nécessaires (paiement, export prêt, etc.).
- Déployer l'Edge Function `send-transactional-email`.

### 4. Connecter les codes d'accès à Lovable Emails
Identifier les points d'envoi actuels dans le code :
- Après paiement réussi sur `/commander`.
- Récupération d'accès via `resend-access-code`.
- Toute autre fonction d'envoi de code actuel.

Remplacer les envois manuels/externes par un appel à `supabase.functions.invoke('send-transactional-email', ...)` ou utiliser l'auth hook si applicable.

### 5. Connecter les prospects à Systeme.io
- Utiliser la clé `SYSTEMEIO_API_KEY` existante.
- Ajouter l'envoi de nouveaux prospects vers Systeme.io depuis :
  - `CadeauPage.tsx` (lead magnet).
  - `AuthorQuiz.tsx` (quiz auteur).
  - `V3CommanderPage.tsx` (acheteurs et non-acheteurs).
- Synchroniser les tags : `prospect`, `acheteur_47`, `acces_actif`, `relance_ete_2026`.

### 6. Créer la séquence marketing dans Systeme.io
- Créer un campagne/funnel dans Systeme.io avec la séquence de 5 emails.
- Thème : offre 47 € d'accès à vie (au lieu de 59 € jusqu'au 30 septembre 2026).
- Emails personnalisés avec les variables Systeme.io : `{{contact.name}}`, `{{contact.email}}`, `{{contact.code_acces}}`.
- Boutons CTA pointant vers `https://www.ebookstudio.fr/commander?src=systemeio`.

### 7. Tester
- **Transactionnel** : simuler un paiement, vérifier la réception du code d'accès.
- **Auth** : tester une récupération de mot de passe.
- **Marketing** : ajouter un email test dans Systeme.io et vérifier la réception de la séquence.
- **Logs** : vérifier `email_send_log` pour les emails transactionnels.

## Alternative si la délégation NS est impossible
Si Hostinger ne permet pas d'ajouter des enregistrements NS ou si l'utilisateur ne souhaite pas déléguer :
- Utiliser **Systeme.io** pour les emails transactionnels (codes d'accès) en plus des campagnes.
- Désactiver complètement l'envoi d'emails depuis Lovable.
- Remplacer tous les appels d'envoi de codes par des appels API Systeme.io.
- Inconvénient : moins de traçabilité directe dans Lovable, mais plus simple si le DNS est bloqué.

## Livrables attendus
- Domaine `notify.ebookstudio.fr` délégué et vérifié (ou alternative Systeme.io validée).
- Infrastructure email Lovable active avec templates auth et transactionnels déployés.
- Codes d'accès envoyés automatiquement après paiement via Lovable Emails.
- Prospects et acheteurs synchronisés avec Systeme.io.
- Campagne marketing 47 € active dans Systeme.io avec suivi des ouvertures/clics.
