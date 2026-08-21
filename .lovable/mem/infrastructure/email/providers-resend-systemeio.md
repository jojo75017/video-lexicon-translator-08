---
name: Fournisseurs email — Resend + Systeme.io uniquement
description: Brevo abandonné ; envois via Resend (app) et Systeme.io (marketing). SPF ebookstudio.fr = amazonses.com.
type: constraint
---
Brevo est abandonné (août 2026) : ne jamais proposer, brancher ou coder Brevo.

Fournisseurs retenus :
- **Resend** — tous les emails de l'application et des campagnes envoyées depuis le projet (via `RESEND_API_KEY`).
- **Systeme.io** — automatisations marketing côté plateforme externe.

DNS `ebookstudio.fr` : SPF `v=spf1 include:amazonses.com ~all` (Resend passe par SES).
DMARC `p=none` avec `rua=mailto:boubetgeorges@gmail.com` — les rapports DMARC reçus sont normaux.
L'enregistrement TXT `brevo-code:...` est à supprimer chez le registrar.
Si Systeme.io envoie avec l'adresse @ebookstudio.fr, ajouter ses enregistrements SPF/DKIM.
