---
name: Fournisseurs email — Resend + Systeme.io uniquement
description: Brevo abandonné ; depuis le 24/08/2026 100 % des campagnes marketing partent de Systeme.io (contact@ebookstudio-mail.fr) et Resend reste en offre gratuite pour les emails de service uniquement.
type: constraint
---
Brevo est abandonné (août 2026) : ne jamais proposer, brancher ou coder Brevo.

Répartition définitive (24/08/2026) :
- **Systeme.io** — 100 % des campagnes marketing, depuis le domaine vérifié `ebookstudio-mail.fr` (expéditeur `contact@ebookstudio-mail.fr`). Aucun réglage DNS à faire chez Hostinger ni chez Lovable : ce domaine est indépendant de `ebookstudio.fr`.
- **Resend (offre GRATUITE)** — uniquement les emails de service : codes d'accès, confirmations de paiement, tests admin. Jamais d'envoi de masse.
- **Aucun envoi de masse depuis l'application.** `CampagneDiffusionPanel`, `send-campagne-unique`, `send-sales-email`, `send-closing-47` et leurs tâches cron ont été supprimés. `/admin/sequence-email` sert uniquement à copier-coller les 5 emails dans Systeme.io.
- Tags Systeme.io de la campagne unique : `PROSPECT-EBS` (entrée) et `CLIENT-47` (posé automatiquement par `payments-webhook` après achat → règle « désinscrire de la campagne »).

Synchronisation Systeme.io (mise en place le 23/08/2026) :
- Fonction `sync-systemeio-contacts` (admin) : modes `test`, `dry_run`, `sync` (arrière-plan auto-enchaîné ~100 s/lot, verrou anti double-lancement), `retag` (re-tagage des contacts déjà synchronisés, lancé auto à la fin d'une synchro), `status`.
- **Tags Systeme.io : l'API exige un `tagId` numérique, JAMAIS un nom** (`tagName` → 422 silencieux, contacts sans tags). Le helper `_shared/systemeio.ts` crée les tags manquants (POST /tags) et assigne par ID, avec cache. Correctif du 23/08/2026.
- Colonnes de suivi `systemeio_synced_at` / `systemeio_sync_error` sur `sales_prospects` et `funnel_leads`.
- Tags : `ebookstudio-prospect` + `segment-actif`/`segment-froid`, `ebookstudio-lead` + `lm-<lead_magnet>`, `ebookstudio-client` pour les payants.
- Les désabonnés (`unsubscribed = true`) ne sont JAMAIS poussés.
- Push automatique réactivé dans `quiz-lead` et `funnel-capture-lead` pour les nouveaux leads.
- Panneau de suivi admin : onglet Envoi de /gestion-prospects (`SystemeIoSyncPanel`).

DNS `ebookstudio.fr` : SPF `v=spf1 include:amazonses.com ~all` (Resend passe par SES).
DMARC `p=none` avec `rua=mailto:boubetgeorges@gmail.com` — les rapports DMARC reçus sont normaux.
L'enregistrement TXT `brevo-code:...` est à supprimer chez le registrar.
Si Systeme.io envoie avec l'adresse @ebookstudio.fr, ajouter ses enregistrements SPF/DKIM.
