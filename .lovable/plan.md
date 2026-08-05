# Plan Email : activation des emails transactionnels EbookStudio

## Situation actuelle
- `ebookstudio.fr` est connecté au projet (hébergement web). ✅
- **Aucun domaine email** n’est encore configuré dans le projet Lovable. ❌
- L’envoi d’emails transactionnels (codes d’accès, confirmations, relances) nécessite un sous-domaine dédié, par exemple `notify.ebookstudio.fr`.
- Objectif : utiliser Lovable Emails pour les emails transactionnels, et conserver Systeme.io pour les campagnes marketing (clé `SYSTEMEIO_API_KEY` déjà présente).

## Ce qu’on va faire

### Étape 1 — Déléguer le sous-domaine email à Lovable
- Dans le projet Lovable, ouvrir la configuration email via le bouton ci-dessous.
- Sélectionner / saisir `notify.ebookstudio.fr` comme domaine d’envoi.
- Laisser le curseur **« Afficher tel qu’envoyé depuis @ ebookstudio.fr » éteint (gris)** pour éviter les conflits avec Resend/Amazon.
- Lovable fournira 2 enregistrements NS (ex: `ns1.lovable.cloud` et `ns2.lovable.cloud`).
- Ajouter ces 2 NS dans Hostinger DNS pour le sous-domaine `notify.ebookstudio.fr`.
- Attendre la propagation DNS (jusqu’à 72h, souvent 1–4h).

### Étape 2 — Créer l’infrastructure email partagée
- Une fois le domaine enregistré (même si DNS est encore en cours), appeler `email_domain--setup_email_infra`.
- Cela crée les files d’attente, les tables de log, la suppression, les tokens de désinscription et le cron de traitement.

### Étape 3 — Scaffolder les emails transactionnels
- Créer les templates React Email pour les emails transactionnels (accès, confirmation, récupération).
- Les appliquer avec les couleurs de la marque : fond blanc, accent teal `#008296`, texte `#232F3E`.
- Déployer la fonction Edge `send-transactional-email`.

### Étape 4 — Connecter les points d’envoi de l’application
- Remplacer l’envoi actuel des codes d’accès par la fonction `send-transactional-email`.
- Vérifier que les pages de confirmation de commande (`CadeauPage.tsx`, `V3CommanderPage.tsx`) peuvent alimenter Systeme.io si nécessaire.

## Critères de succès
- `email_domain--check_email_domain_status` passe de `not_started` à `awaiting_dns` puis `active`.
- Les emails transactionnels (code d’accès, récupération de mot de passe) arrivent dans la boîte de réception.
- Les anciens edge functions et séquences marketing obsolètes restent désactivés.

## Délai / coût
- Environ 30–60 min de configuration + propagation DNS variable.
- Coût crédits : 1 appel setup + 1 scaffold + 1 déploiement (modéré).

## Prochaine action immédiate
Ouvrir le dialogue de configuration email dans l’éditeur pour obtenir les enregistrements NS exacts à copier dans Hostinger.
