# Plan : envoyer les relances commerciales directement via Resend

## Contexte
La migration vers Systeme.io par tags demande de créer 15 automations manuellement dans l'interface Systeme.io. L'utilisateur trouve cela trop complexe. On revient à un envoi direct par notre edge function, mais en remplaçant Brevo par Resend.

## Objectif
Modifier `send-sales-email` pour envoyer les 6 emails de séquence + 3 relances directement via l'API Resend, sans passer par Systeme.io. Aucune automation externe n'est nécessaire.

## Pourquoi Resend
- Tu as déjà une clé `RESEND_API_KEY` configurée dans les secrets du projet.
- Resend est conçu pour l'envoi d'emails par API, avec un endpoint simple `/emails`.
- Aucune interface d'automation à configurer : notre code gère le timing, le contenu et l'envoi.

## Étapes techniques

1. **Restaurer le contenu des emails**
   - Récupérer depuis l'historique git les fonctions `getEmailBody`, `getInteresseEmailBody`, `getRelanceEmailBody`, `RELANCE_VARIANTS` et les sujets.
   - Les réintégrer proprement dans `supabase/functions/send-sales-email/index.ts` (ou un fichier partagé `_shared/salesEmailContent.ts` si on veut alléger l'index).

2. **Remplacer l'appel Systeme.io par Resend**
   - Supprimer l'import et l'appel à `pushToSystemeIo`.
   - Ajouter un appel `fetch('https://api.resend.com/emails', ...)` avec la clé `RESEND_API_KEY`.
   - Envoyer un email par prospect avec :
     - `from` : une adresse vérifiée sur ton domaine Resend (à définir avec toi),
     - `to` : l'email du prospect,
     - `subject` : le sujet de l'étape,
     - `html` : le contenu HTML de l'email,
     - optionnel `text` : une version texte brut.

3. **Conserver la logique métier**
   - Garder la sélection des prospects, `current_step`, `next_email_at`, `completed`, `relance_round`.
   - Garder la sécurité cron/admin.
   - Si l'appel Resend échoue, compter une erreur et ne pas avancer l'étape (même comportement qu'avec Brevo).

4. **Nettoyer Systeme.io**
   - Supprimer l'import de `pushToSystemeIo`.
   - Supprimer les helpers de tags `seqTag`/`relanceTag` si inutiles.
   - La clé `SYSTEMEIO_API_KEY` peut rester en place mais ne sera plus utilisée par cette fonction.

## Prérequis côté Resend

- Avoir un domaine vérifié dans Resend (sinon les envois partiront depuis `onboarding@resend.dev` en test, ou seront refusés en production).
- Confirmer l'adresse d'expéditeur à utiliser (ex. `contact@ebookstudio.fr`).

## Livrables

- `supabase/functions/send-sales-email/index.ts` mis à jour pour envoyer via Resend.
- Contenu des 15 emails restauré et intégré.
- Edge function déployée.

## Hors périmètre

- Aucune modification des automations Resend (il n'y en a pas besoin).
- Les autres emails Resend existants (accès, support, audiobook) restent inchangés.
