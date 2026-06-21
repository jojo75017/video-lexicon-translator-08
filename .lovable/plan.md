# 3 nouvelles relances pour faire cliquer les prospects à 5/5

## Problème actuel
La séquence `sales_prospects` se termine à l'étape 5 (5/5), puis une **unique** relance "non-cliqueurs" existe. L'anti-doublon (`relance_sent_at IS NULL`) empêche d'envoyer plus d'une relance par prospect : ceux à 5/5 ne reçoivent donc plus rien. On ajoute **3 nouvelles relances** qui tournent (variantes 1→2→3), partent automatiquement par le cron ET manuellement depuis la page Prospects, en alternant l'angle démo / offre.

## Ce qui sera construit

### 1. Base de données (migration légère)
Ajouter une colonne à `public.sales_prospects` :
- `relance_round` (integer, défaut `0`) — compteur de relances déjà envoyées (0 = aucune, 3 = série terminée).

GRANT déjà en place sur la table ; on conserve l'accès `service_role`.

### 2. Les 3 nouvelles relances (dans `send-sales-email`)
Un tableau `RELANCE_VARIANTS` remplace la relance unique. Chaque variante = `{ subject, body }`, angles alternés et 100% orientés clic (gros bouton CTA traçable déjà géré par `buildHtmlEmail`).

````text
Relance 1 — Démo / curiosité
  Objet : "🎬 {name}, regardez un livre s'écrire en 2 min"
  → voir l'IA générer plan + chapitres + couverture, sans CB.

Relance 2 — Offre / valeur
  Objet : "🎁 {name}, 67€ à vie = la V3 (197€) offerte"
  → rappel offre Fondateur, bénéfices, urgence douce (prix monte à la V3).

Relance 3 — Démo + dernière main tendue
  Objet : "👋 {name}, une dernière démo avant qu'on arrête"
  → "qu'est-ce qui vous retient ?", relance émotionnelle + bouton démo,
    invitation à répondre à l'email.
````

### 3. Logique d'envoi (`send-sales-email`, mode `relance`)
- La cible n'est plus filtrée sur `relance_sent_at IS NULL`, mais sur `relance_round < 3` (et non-cliqueurs / non-clients).
- À chaque envoi : on choisit `RELANCE_VARIANTS[relance_round]`, on envoie, puis on incrémente `relance_round` et on met à jour `relance_sent_at` / `relance_status`.
- Le `step` de tracking passe à `7 + relance_round` pour distinguer chaque relance dans `email_clicks`.

### 4. Envoi automatique (cron)
Le cron `email-sequence-cron` (déjà planifié) gère la séquence principale. On ajoute une passe relance : pour les prospects `completed = true`, non-cliqueurs, non-clients, avec `relance_round < 3`, et dont la dernière relance date de **+3 jours** (espacement), on déclenche la variante suivante. Une relance s'arrête dès qu'un clic est détecté (`email_clicks`) ou un achat (`funnel_orders`/`sales_prospects.completed` payé).

### 5. Page Prospects (`ProspectManagerPage.tsx`)
- Nouveau bloc "Relances supplémentaires (3 variantes)" avec :
  - un compteur de cibles disponibles (`completed`, non-cliqueurs, `relance_round < 3`),
  - un bouton **"Envoyer la prochaine relance"** (envoie la variante suivante à tous les éligibles, par lots, comme l'existant),
  - affichage par prospect du `relance_round` (ex. "Relance 2/3").
- Réutilise le mécanisme `supabase.functions.invoke('send-sales-email', { mode: 'relance', prospect_ids })` déjà en place (chunking + toasts de succès/échec conservés).

## Détails techniques
- Aucun nouveau secret nécessaire (Brevo/Resend déjà configurés).
- Liens 100% traçables via `track-email-click` (déjà implémenté) → les clics remontent dans la page.
- Anti-doublon par variante grâce à `relance_round` : un prospect ne reçoit jamais deux fois la même relance.
- Arrêt automatique dès clic ou achat, pour ne pas sur-solliciter les leads chauds.

## Fichiers touchés
- migration : `sales_prospects.relance_round`
- `supabase/functions/send-sales-email/index.ts` (variantes + logique round)
- `supabase/functions/email-sequence-cron/index.ts` (passe relance auto)
- `src/pages/ProspectManagerPage.tsx` (bouton + compteur + affichage round)
