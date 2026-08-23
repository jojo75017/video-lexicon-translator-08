---
name: Fournisseurs email — Resend + Systeme.io uniquement
description: Brevo abandonné ; Resend (app + campagnes) et Systeme.io (marketing) réactivé le 23/08/2026 avec synchro en masse des contacts.
type: constraint
---
Brevo est abandonné (août 2026) : ne jamais proposer, brancher ou coder Brevo.

Fournisseurs retenus :
- **Resend** — tous les emails de l'application et des campagnes envoyées depuis le projet (via `RESEND_API_KEY`).
- **Systeme.io** — automatisations marketing côté plateforme externe. Désactivé quelques jours en août 2026, puis **réactivé le 23/08/2026** : tous les contacts y sont synchronisés (on nettoie après).

Synchronisation Systeme.io (mise en place le 23/08/2026) :
- Fonction `sync-systemeio-contacts` (admin) : modes `test`, `dry_run`, `sync` (arrière-plan auto-enchaîné ~100 s/lot, verrou anti double-lancement), `status`.
- Colonnes de suivi `systemeio_synced_at` / `systemeio_sync_error` sur `sales_prospects` et `funnel_leads`.
- Tags : `ebookstudio-prospect` + `segment-actif`/`segment-froid`, `ebookstudio-lead` + `lm-<lead_magnet>`, `ebookstudio-client` pour les payants.
- Les désabonnés (`unsubscribed = true`) ne sont JAMAIS poussés.
- Push automatique réactivé dans `quiz-lead` et `funnel-capture-lead` pour les nouveaux leads.
- Panneau de suivi admin : onglet Envoi de /gestion-prospects (`SystemeIoSyncPanel`).

DNS `ebookstudio.fr` : SPF `v=spf1 include:amazonses.com ~all` (Resend passe par SES).
DMARC `p=none` avec `rua=mailto:boubetgeorges@gmail.com` — les rapports DMARC reçus sont normaux.
L'enregistrement TXT `brevo-code:...` est à supprimer chez le registrar.
Si Systeme.io envoie avec l'adresse @ebookstudio.fr, ajouter ses enregistrements SPF/DKIM.
