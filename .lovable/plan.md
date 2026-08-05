# Plan : activer Lovable Emails simplement

## Objectif

Utiliser la solution d'emails intégrée de Lovable (incluse dans Pro) pour envoyer les emails transactionnels depuis l'application. C'est plus simple qu'un SMTP externe : pas de configuration de boîte email chez Hostinger, pas de DNS MX, pas de SPF/DKIM/DMARC manuels.

## Principe

Lovable délègue un sous-domaine dédié à l'envoi (ex. `notify.ebookstudio.fr`). Lovable gère automatiquement les enregistrements SPF, DKIM et MX. Cela ne perturbe pas les emails reçus sur `ebookstudio.fr` s'ils sont actuellement gérés par Amazon.

## Étapes

1. **Ouvrir l'assistant d'emails Lovable**
   - Utiliser le bouton de configuration email.
   - Saisir le domaine racine `ebookstudio.fr` (pas `notify.ebookstudio.fr`, afin d'éviter `notify.notify.ebookstudio.fr`).
   - Lovable génère automatiquement le sous-domaine d'envoi.

2. **Ajouter les enregistrements NS dans Hostinger**
   - L'assistant fournit 2 valeurs NS exactes.
   - Les copier dans Hostinger, DNS de `ebookstudio.fr`, en tant qu'enregistrements NS pour le sous-domaine choisi.
   - Attendre la propagation DNS (jusqu'à 72h, souvent quelques minutes).

3. **Vérifier le domaine**
   - Revenir dans l'assistant Lovable et cliquer sur vérification.
   - Une fois actif, les emails de l'application peuvent partir.

4. **Scaffolder les emails transactionnels**
   - Configurer l'infrastructure email (queues, tables, Edge Functions) pour le projet.
   - Scaffolder les templates d'emails d'authentification et les emails applicatifs si nécessaire.

5. **Tester l'envoi**
   - Envoyer un email de test (code d'accès, confirmation).
   - Vérifier la réception et que l'expéditeur est bien `xxx@ebookstudio.fr`.

## Nettoyage externe

- Resend n'est pas connecté au projet et n'est pas utilisé dans le code. Vous pouvez annuler votre abonnement Resend directement dans le tableau de bord Resend. L'envoi via Lovable Emails est inclus dans le plan Pro, sans surcoût.

## Limites importantes

- Lovable Emails est réservé aux emails transactionnels (codes d'accès, confirmations, réinitialisations, notifications applicatives). Il ne permet pas les campagnes marketing en masse.
- Pour les newsletters et campagnes marketing, il faudra toujours un service externe (GetResponse, Brevo, Mailerlite, etc.).

## Alternative si Lovable Emails reste bloqué

- Utiliser un connecteur standard (Resend, Brevo ou Mailgun) via Lovable. Cela demande un compte chez le fournisseur et de vérifier un domaine ou sous-domaine, mais c'est souvent plus rapide que de configurer un SMTP classique.
