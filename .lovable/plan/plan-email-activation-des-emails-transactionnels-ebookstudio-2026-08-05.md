# Plan Email : activation des emails transactionnels EbookStudio

## Situation actuelle
- `ebookstudio.fr` est connecté au projet (hébergement web). ✅
- Le contrôle du projet ne reconnaît pas encore `notify.ebookstudio.fr` comme domaine **email** configuré ou validé. Le sous-domaine peut être connecté côté Hostinger, mais sa configuration email Lovable reste à finaliser. ⚠️
- L’envoi d’emails transactionnels (codes d’accès, confirmations, relances) nécessite un sous-domaine dédié, par exemple `notify.ebookstudio.fr`.
- Objectif : utiliser Lovable Emails pour les emails transactionnels, et conserver Systeme.io pour les campagnes marketing (clé `SYSTEMEIO_API_KEY` déjà présente).
- **Mode zéro envoi demandé : aucun email d’application ou marketing ne doit partir avant validation effective du domaine email.**

## Ce qu’on va faire

### Étape 1 — Déléguer le sous-domaine email à Lovable
- Dans le projet Lovable, ouvrir la configuration email via le bouton ci-dessous.
- Sélectionner / saisir `notify.ebookstudio.fr` comme domaine d’envoi.
- Laisser le curseur **« Afficher tel qu’envoyé depuis @ ebookstudio.fr » éteint (gris)** pour éviter les conflits avec Resend/Amazon.
- Lovable fournira 2 enregistrements NS (ex: `ns1.lovable.cloud` et `ns2.lovable.cloud`).
- Ajouter ces 2 NS dans Hostinger DNS pour le sous-domaine `notify.ebookstudio.fr`.
- Attendre la propagation DNS (jusqu’à 72h, souvent 1–4h).

### Étape 1 bis — Activer le verrou « zéro envoi »
- Désactiver l’envoi d’emails personnalisés au niveau du projet pendant la validation DNS.
- Mettre la campagne canonique de 5 emails en statut inactif et empêcher les modes automatique, manuel **et test** d’appeler un fournisseur d’envoi.
- Ajouter un garde-fou central côté fonctions d’envoi : tant que l’autorisation d’envoi n’est pas activée, elles répondent « envoi suspendu » sans contacter Resend ni un autre moteur.
- Couvrir tous les parcours identifiés : campagne commerciale, code d’accès, essai gratuit, email de bienvenue et notifications administrateur.
- Les opérations métier restent enregistrées (achat, création/récupération du code, inscription) ; seul l’envoi du message est bloqué afin de ne pas casser les comptes clients.
- Afficher dans la gestion admin un état clair « Zéro envoi — domaine en attente » et désactiver les boutons d’envoi.

### Étape 2 — Créer l’infrastructure email partagée
- Une fois le domaine enregistré (même si DNS est encore en cours), appeler `email_domain--setup_email_infra`.
- Cela crée les files d’attente, les tables de log, la suppression, les tokens de désinscription et le cron de traitement.
- La création de l’infrastructure ne réactive pas les envois : le verrou reste fermé jusqu’au contrôle final.

### Étape 3 — Scaffolder les emails transactionnels
- Créer les templates React Email pour les emails transactionnels (accès, confirmation, récupération).
- Les appliquer avec les couleurs de la marque : fond blanc, accent teal `#008296`, texte `#232F3E`.
- Déployer la fonction Edge `send-transactional-email`.

### Étape 4 — Connecter les points d’envoi de l’application
- Remplacer l’envoi actuel des codes d’accès par la fonction `send-transactional-email`.
- Vérifier que les pages de confirmation de commande (`CadeauPage.tsx`, `V3CommanderPage.tsx`) peuvent alimenter Systeme.io si nécessaire.

### Étape 5 — Validation puis réactivation contrôlée
- Contrôler que `notify.ebookstudio.fr` est reconnu comme actif et validé.
- Envoyer d’abord un seul email de test à l’administrateur et vérifier sa présence dans le journal d’envoi et dans la boîte de réception.
- Réactiver uniquement les emails indispensables (accès, récupération, achat) après ce test concluant.
- La campagne marketing de 5 emails reste arrêtée jusqu’à une validation admin séparée ; la validation du domaine ne la déclenche jamais automatiquement.

## Critères de succès
- `email_domain--check_email_domain_status` passe de `not_started` à `awaiting_dns` puis `active`.
- Avant le statut `active`, chaque tentative d’envoi est bloquée sans appel au fournisseur et l’interface admin indique « zéro envoi ».
- Les emails transactionnels (code d’accès, récupération de mot de passe) arrivent dans la boîte de réception.
- Les anciens edge functions et séquences marketing obsolètes restent désactivés.

## Délai / coût
- Environ 30–60 min de configuration + propagation DNS variable.
- Coût crédits : 1 appel setup + 1 scaffold + 1 déploiement (modéré).

## Prochaine action immédiate
Ouvrir le dialogue de configuration email dans l’éditeur pour obtenir les enregistrements NS exacts à copier dans Hostinger.
