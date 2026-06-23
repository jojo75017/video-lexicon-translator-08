Plan : remplacer l'intégration Systeme.io par un envoi direct via Resend dans la séquence commerciale

Objectif
--------
Réactiver automatiquement les 15 emails de la séquence commerciale (prospects froids + intéressés + relances) sans passer par Systeme.io. L'edge function `send-sales-email` enverra directement les emails via Resend.

Actions
-------
1. Restaurer le contenu des 15 templates email
   - 6 emails de la séquence standard
   - 6 emails de la séquence "intéressés"
   - 3 variantes de relance pour les non-cliqueurs
   - Source : historique git de `supabase/functions/send-sales-email/index.ts`

2. Supprimer la logique Systeme.io
   - Retirer `SYSTEMEIO_API_KEY`, l'import `pushToSystemeIo`, les helpers `seqTag` / `relanceTag`
   - Retirer l'appel au endpoint Systeme.io

3. Ajouter l'envoi via Resend
   - Utiliser le gateway Lovable : `https://connector-gateway.lovable.dev/resend/emails`
   - Headers : `Authorization: Bearer ${LOVABLE_API_KEY}` + `X-Connection-Api-Key: ${RESEND_API_KEY}`
   - `from` : une adresse validée dans Resend
   - Garder `to`, `subject`, `html`

4. Conserver la logique métier existante
   - Sélection des prospects selon `current_step` et `next_email_at`
   - Avancement du `current_step` seulement si l'email est bien envoyé
   - Relances automatiques après la dernière étape (`relance_round`)
   - Tracking des ouvertures et clics
   - Sécurité cron/admin

5. Déployer l'edge function
   - Déployer `send-sales-email` après les modifications

6. Vérifier en production
   - Tester l'envoi d'un email via l'admin ou le cron
   - Vérifier que les emails arrivent bien et que `current_step` avance

Prérequis
---------
- `RESEND_API_KEY` doit être configuré dans les secrets de l'edge function
- Un domaine d'envoi validé dans Resend (sinon les emails partiront depuis `onboarding@resend.dev` en test ou échoueront en prod)

Hors scope
----------
- Les autres emails Resend (accès, support, livre audio) restent inchangés
- Pas de création d'automations dans Systeme.io
- Pas de changement de base de données (pas de nouvelle table)