# Plan simple : envoyer les codes et les campagnes

## 1. Codes d'accès après paiement (transactionnel)

**Pourquoi** : quand un client paie, il doit recevoir immédiatement son code d'accès. C'est un email transactionnel, autorisé avec Lovable Emails.

**Solution** : activer Lovable Emails inclus dans Pro.

**Étapes** :
1. Ouvrir l'assistant de configuration email dans Lovable.
2. Saisir le domaine `ebookstudio.fr`.
3. Copier les 2 lignes NS fournies dans Hostinger (DNS de `ebookstudio.fr`).
4. Attendre la vérification (souvent instantanée, parfois 72h).
5. Scaffolder les templates d'emails de l'application.
6. Tester l'envoi d'un code d'accès.

**Coût** : inclus dans Pro.

## 2. Campagnes marketing

**Pourquoi** : envoyer des séquences de vente aux prospects.

**Solution** : utiliser Systeme.io car vous avez déjà une clé API enregistrée.

**Étapes** :
1. Connecter le projet à Systeme.io via le connecteur standard.
2. Créer ou utiliser la campagne existante dans Systeme.io.
3. Depuis l'application, ajouter les prospects à Systeme.io au lieu de les envoyer via l'application.
4. Laisser Systeme.io gérer les envois en masse.

**Avantage** : Systeme.io a une offre gratuite généreuse et gère bien les campagnes.

## 3. Nettoyage

- Annuler Resend depuis le tableau de bord Resend (il n'est pas utilisé dans le projet).
- Ne pas créer de boîte email Hostinger complexe pour l'instant.

## 4. Test final

- Tester un achat test et vérifier que le code d'accès arrive bien.
- Tester l'inscription d'un prospect à Systeme.io.
