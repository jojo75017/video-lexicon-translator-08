# Pourquoi « rien ne part » — diagnostic Resend et remise en route

## Ce que montrent réellement les données (vérifié)

- Les envois **fonctionnent** : dernier envoi réel aujourd'hui **14 août à 09h37 UTC**, 90 emails du modèle `cloture-47-1`, tous en statut `sent`.
- Historique récent : 250 le 12 août, 635 le 13 août, 90 le 14 août. Aucune erreur enregistrée sur les 3 derniers jours (0 ligne `error`).
- Les nouveaux tarifs **sont déjà dans les emails** : les lettres de clôture parlent bien de « 47 € une seule fois jusqu'au 30 septembre » puis « 17 €/mois à partir du 1er octobre ». Il n'y a donc pas de texte obsolète à corriger côté prix.
- Il reste **102 destinataires éligibles** pour `cloture-47-1` (ouvreurs sans clic, jamais contactés sur cette lettre). Donc ce n'est pas un manque de cibles.

## Diagnostic (à confirmer en 1 appel, pas encore prouvé)

L'arrêt net après 90 envois, sans aucune erreur enregistrée, correspond au comportement du garde-fou de quota Resend : dès que Resend renvoie `daily_quota_exceeded`, le lot s'arrête immédiatement et les destinataires restants ne sont **pas** journalisés. C'est l'hypothèse la plus cohérente avec 90 envois puis silence.

Deuxième hypothèse à écarter dans le même passage : le verrou `EMAIL_SENDING_ENABLED`. S'il n'était pas à `true`, plus rien ne partirait — mais 90 emails sont partis ce matin, donc il est très probablement actif.

## Étape 1 — Confirmer la cause (rapide, quasi sans crédit)

1. Lire les logs de la fonction d'envoi de clôture pour la fenêtre 09h30–10h00 UTC aujourd'hui et repérer le message exact renvoyé par Resend.
2. Si le message contient `daily_quota_exceeded` : cause confirmée, quota journalier atteint.
3. Si le message est autre (clé invalide, 403 domaine, verrou), je vous le cite tel quel et j'adapte l'étape 2.

## Étape 2 — Reprendre les envois sans les perdre

Selon la cause confirmée :

**Cas quota journalier atteint**
- Ajouter un compteur d'envois du jour et un **arrêt propre** : la fonction envoie jusqu'à la limite, journalise ce qui est parti, et renvoie « quota atteint, X restants ».
- Afficher dans « Gestion Prospects » un état lisible : *envoyés aujourd'hui / restants / reprise possible demain*.
- Reprise le lendemain sur les 102 restants uniquement, sans doublon (la déduplication par email existe déjà).

**Cas clé ou domaine**
- Mettre à jour le secret `RESEND_API_KEY` avec la clé que vous me donnerez, ou corriger l'expéditeur pour utiliser un domaine vérifié, puis un seul email de test vers votre adresse avant reprise.

## Étape 3 — Décharger le volume vers LearnyBox

Le quota Resend est trop court pour vos ~470 ouvreurs. Répartition proposée :
- **Resend** garde uniquement les emails critiques et à faible volume : codes d'accès, bienvenue, récupération, notifications admin.
- **LearnyBox** prend les campagnes de masse (clôture 47 €, séquence 10 niches, relances). Le paramétrage LearnyBox reste celui du plan précédent, avec un sous-domaine d'envoi distinct de `notify.ebookstudio.fr`.

## Étape 4 — Contrôle final

- Un envoi de test unique vers votre adresse.
- Vérification dans le journal d'envoi que la ligne apparaît bien en `sent`.
- Reprise des 102 restants, puis compte-rendu chiffré : envoyés, restants, erreurs.

## Détails techniques

- Garde-fou existant : `supabase/functions/_shared/resendThrottle.ts` (8 req/s, arrêt sur `daily_quota_exceeded`) et `supabase/functions/_shared/emailSendingGuard.ts` (`EMAIL_SENDING_ENABLED`).
- Fonction concernée : `supabase/functions/send-closing-47/index.ts` (modes test / dry-run / envoi réel, déduplication via `email_send_log`).
- Aucun changement de prix ni de texte d'email n'est nécessaire : les modèles sont déjà alignés sur 47 € puis 17 €/mois.
- Ajout limité à : compteur journalier, message de reprise, affichage d'état admin.
