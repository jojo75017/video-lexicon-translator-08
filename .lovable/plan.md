# Nouvelle relance « non-cliqueurs » — page de vente + 10 niches + email de bienvenue

## Ce que disent les données (vérifié)

- Base : **646 prospects**, dont **616 n'ont jamais cliqué** (44 cliqueurs seulement, 472 ouvreurs).
- Les envois Resend fonctionnent : dernier lot réel aujourd'hui 14 août à 09h37 UTC (90 emails `cloture-47-1`, aucun statut `error` sur 3 jours).
- Les textes de prix sont déjà à jour dans les modèles existants (47 € jusqu'au 30/09, puis 17 €/mois).
- Ce qui manque : **aucun email n'utilise encore la nouvelle page de vente, le cadeau 10 niches et le nouvel email de bienvenue**. C'est cette lettre qu'on va créer.

## Étape 1 — Nouvelle lettre `relance-niches-1` (non-cliqueurs)

Un seul modèle, une seule promesse, un seul bouton.

- Accroche : « 10 niches Amazon rentables, offertes — même si vous n'achetez rien aujourd'hui ».
- Corps court : le cadeau d'abord, la preuve ensuite (du sommaire au fichier prêt pour Amazon), l'offre en dernier (47 € une fois jusqu'au 30 septembre, puis 17 €/mois).
- CTA unique vers la nouvelle page de vente, lien tracké : `/commander?src=relance-niches-1&email=...`.
- Bloc « Ce que vous recevez tout de suite après paiement » : identifiants d'accès, lien des 10 niches, contact direct `boubetgeorges@gmail.com` — exactement ce que contient le nouvel email de bienvenue, pour que la promesse et la livraison coïncident.
- Français strict, aucun latin, désinscription en pied de lettre.

## Étape 2 — Segment et déduplication

- Cible : les **616 prospects sans aucun clic**.
- Exclusion automatique : clients existants, désabonnés, adresses en erreur permanente, et toute adresse ayant déjà reçu `relance-niches-1`.
- Envoi par vagues, du plus chaud au plus froid : ouvreurs sans clic d'abord, puis jamais-ouvreurs.

## Étape 3 — Respect du quota d'envoi

Le quota journalier Resend est ce qui a stoppé le lot de ce matin après 90 emails.

- La fonction d'envoi s'arrête proprement à la limite, journalise ce qui est parti et renvoie « envoyés X / restants Y ».
- Affichage dans **Gestion Prospects** : envoyés aujourd'hui, restants, reprise demain d'un clic.
- Reprise sans doublon grâce au journal d'envoi.

## Étape 4 — Livraison du cadeau

- Le lien du cadeau pointe vers la page existante `/10-niches-offertes`.
- Cette page reste accessible sans achat : c'est l'appât qui déclenche le clic, l'offre 47 € est présentée juste en dessous.
- Chaque visite est marquée `src=relance-niches-1` pour mesurer ce que la lettre rapporte.

## Étape 5 — Test puis lancement

1. Un envoi de test vers votre adresse, contrôle du rendu et des 2 liens (page de vente, cadeau).
2. Première vague de la journée jusqu'au quota.
3. Compte-rendu chiffré : envoyés, restants, ouvertures, clics, commandes attribuées à `relance-niches-1`.

## Détails techniques

- Nouveau modèle ajouté dans la fonction de relance existante (même moteur que `send-closing-47`), pas de nouvelle fonction Edge.
- Segmentation lue depuis `sales_prospects`, `email_opens`, `email_clicks` ; déduplication via `email_send_log`.
- Compteur journalier + message de reprise ajoutés au garde-fou d'envoi existant.
- Le journal d'envoi enregistre chaque destinataire avec `template_name = relance-niches-1` pour le suivi.
- Aucun changement de tarif ni de page de vente : la lettre pointe vers l'existant.
