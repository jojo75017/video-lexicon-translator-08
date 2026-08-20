# Peu de clics, aucun acheteur : ce que disent les données et la stratégie à mettre en place

## Chiffres réels (5 derniers jours, relevés en base)

| Indicateur | Valeur |
| --- | --- |
| Emails envoyés (`rappel-47-1`) | 1 245 lignes, **623 destinataires uniques** |
| Ouvertures | 229 (**174 personnes différentes**, soit ~28 %) |
| Clics enregistrés | **2 clics, 1 seule personne** |
| Commandes créées | 1 seule, statut `pending` |
| Commandes payées | **0** |
| Encarts de capture du site | 142 affichages (sticky 85, inline 37, popup 20), **0 clic** |

Lecture : la délivrabilité et l'objet fonctionnent (28 % d'ouverture, c'est correct).
Le blocage est **entre la lecture et le clic**, puis **entre la page et le paiement**.

## Deux causes identifiées

1. **Une partie des clics n'est pas comptée.** Dans l'email, seul le bouton
   principal passe par le relais de suivi `/r`. Le bouton « Écouter le message »
   et le lien MP3 pointent en direct vers le site : ces clics n'apparaissent
   nulle part. On pilote donc à l'aveugle sur le lien le plus attractif de
   l'email.
2. **Aucune trace de passage à l'acte.** 0 clic sur les encarts du site, 0
   checkout ouvert, 1 commande jamais payée. Rien ne dit aujourd'hui si les
   visiteurs voient le bouton de paiement et l'ignorent, ou s'ils n'y arrivent
   jamais.

Tant que ces deux trous ne sont pas bouchés, toute réécriture d'email est un pari.

## Stratégie proposée (dans l'ordre)

### Étape 1 — Tout mesurer (rapide, sans envoi)
- Faire passer **tous** les liens des emails par le relais de suivi (audio, MP3,
  liens du texte), pas seulement le bouton principal.
- Poser un événement sur la page de commande : arrivée sur la page, puis clic sur
  le bouton de paiement (carte et PayPal séparément).
- Panneau admin unique : envoyés / ouvertures / clics par lien / visites
  `/commander` / clics paiement / commandes. Un seul écran pour voir où ça casse.

### Étape 2 — Un email = un clic évident
- Un seul objectif par email, un seul lien répété deux fois, dans les 3 premières
  lignes puis en bas. On supprime la concurrence audio + offre + MP3 dans le même
  message.
- Objet et première phrase centrés sur un résultat concret (« un livre complet
  prêt pour Amazon en un week-end »), pas sur l'offre ni la date limite.
- Version courte : 120 mots maximum, lisible sur mobile sans défilement.

### Étape 3 — Segmentation type GetResponse (déjà prévue, on l'active)
- **Non-ouvreurs (≈449)** : nouvel objet, renvoi 48 h plus tard, texte très court.
- **Ouvreurs sans clic (≈173)** : message de preuve — une capture du livre généré,
  un seul lien.
- **Cliqueurs (1)** : message personnel avec une question directe.

### Étape 4 — Débloquer la page de commande
- Réassurance au-dessus du bouton : paiement PayPal, 2×/3×, ce qui est livré
  immédiatement.
- Relance automatique de toute commande restée `pending` plus de 2 h (il y en a
  déjà une).

### Étape 5 — Créer la preuve qui manque
- 0 témoignage approuvé en base. Demande de témoignage aux abonnés actifs et
  affichage sur `/commander` : sans preuve, un inconnu ne paie pas 47 €.

## Détails techniques

- Suivi complet : router audio, MP3 et liens texte via `/r` (`RedirectClickPage`)
  avec `t` = nom du gabarit, dans `send-sales-email/index.ts` (`mediaBlock`,
  `ctaButton`, corps des 5 étapes).
- Événements page : `capture_events` avec `surface = 'commander'` et
  `event_type` `page_view`, `checkout_click_card`, `checkout_click_paypal`, posés
  dans `src/pages/v3public/V3CommanderPage.tsx`.
- Tableau de bord : extension de `CampaignSequencePanel.tsx` avec une colonne
  clics par lien et une ligne « visites /commander → clics paiement → payés ».
- Segments : nouveaux modes `resend_non_openers` et `resend_clickers` dans
  `send-sales-email`, calculés depuis `email_send_log`, `email_opens`,
  `email_clicks`, avec anti-doublon par gabarit.
- Relance panier : lecture de `funnel_orders` (`status = 'pending'`,
  `created_at < now() - 2h`), marquage dans `metadata` pour ne jamais relancer
  deux fois.
- Aucun changement de tarif : 47 € à vie jusqu'au 31/08/2026, V3 le 1er octobre.
- Aucun envoi de masse déclenché sans ton feu vert explicite.
