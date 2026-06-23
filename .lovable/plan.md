# Basculer les relances commerciales de Brevo vers Systeme.io

## Objectif

Tu n'as plus de crédits Brevo. La fonction `send-sales-email` (séquence de 6 emails + 3 relances) est la seule à utiliser Brevo. Au lieu d'envoyer les emails nous-mêmes, on va **pousser chaque prospect dans Systeme.io avec un tag par étape**. Ce sont ensuite les **automations Systeme.io** (côté ton compte) qui enverront les emails. La logique de timing/anti-doublon actuelle reste intégralement dans notre code : à chaque échéance, on n'envoie plus le mail, on applique le tag de l'étape concernée.

`SYSTEMEIO_API_KEY` est déjà configurée et le helper `pushToSystemeIo` existe déjà.

## Tags validés (à créer côté Systeme.io)

Séquence principale (prospects froids) : `ebs-seq-1` … `ebs-seq-6`
Séquence intéressés : `ebs-seq-interesse-1` … `ebs-seq-interesse-6`
Relances non-cliqueurs : `ebs-relance-1`, `ebs-relance-2`, `ebs-relance-3`

Pour chaque tag, tu crées dans Systeme.io une automation : **Déclencheur « Tag ajouté »  → Action « Envoyer l'email »** (sans délai si tu veux un envoi immédiat). Le contenu des emails se copie depuis les textes actuels de `send-sales-email`.

## Comment ça marchera

```text
Cron / Admin
      │
      ▼
send-sales-email  ── pour chaque prospect dû ──►  Systeme.io
      │                                          (crée/maj contact + applique le tag d'étape)
      │
      └── met à jour sales_prospects (current_step, next_email_at, relance_round...)
                                          │
                                          ▼
                          Automation Systeme.io déclenchée par le tag
                                          │
                                          ▼
                                  Email envoyé au prospect
```

## Détails techniques

Fichier modifié : `supabase/functions/send-sales-email/index.ts`

1. **Suppression de Brevo** : retirer la lecture de `BREVO_API_KEY` (et le 500 si absente) et les 3 blocs `fetch("https://api.brevo.com/v3/smtp/email", ...)`.
2. **Import** du helper : `import { pushToSystemeIo } from "../_shared/systemeio.ts";`
3. **Remplacement de chaque envoi** par un appel `pushToSystemeIo(prospect.email, prospect.first_name, [tag])` :
   - Séquence : `ebs-seq-${stepToSend}` (ou `ebs-seq-interesse-${stepToSend}` si `prospect.source === "interesses"`).
   - Relance manuelle et relance auto : `ebs-relance-${round + 1}`.
4. **Conservation intégrale de la logique métier** : sélection des prospects, calcul de `next_email_at`, `current_step`, `completed`, `relance_round`, exclusion des cliqueurs à l'étape 6, sécurité cron/admin — rien ne change. On remplace seulement « envoyer via Brevo » par « taguer dans Systeme.io ».
5. **Gestion d'erreur** : si `pushToSystemeIo` renvoie `{ ok: false }`, on compte une erreur et on ne fait pas avancer l'étape (même comportement que l'échec Brevo aujourd'hui), pour réessayer au prochain passage.
6. **Nettoyage** : le HTML envoyé par Brevo (`buildHtmlEmail`, `getEmailBody`, `getInteresseEmailBody`, `getRelanceEmailBody`, `RELANCE_VARIANTS`, sujets…) n'est plus utilisé car le contenu vit désormais dans les automations Systeme.io. Je retire le code devenu mort pour garder le fichier propre. La sélection de variante de relance reste (elle détermine le numéro de tag `ebs-relance-N`).

## Hors périmètre

- Les autres fonctions email via Resend (codes d'accès, contact support, audiobook…) : inchangées.
- La création des automations et du contenu des emails dans Systeme.io : à faire dans ton compte (je n'y ai pas accès).
- Le secret `BREVO_API_KEY` reste en place (non supprimé), simplement plus utilisé.

## Point d'attention

Le **contenu et le rythme d'envoi** seront gérés par tes automations Systeme.io, plus par notre code. Notre `day_offset` ne sert plus qu'à savoir *quand appliquer le tag* ; pour un envoi immédiat après le tag, configure l'automation sur « tag ajouté » sans délai. Le suivi des ouvertures/clics se fera dans Systeme.io (les pixels/liens traçables Brevo ne sont plus injectés).
