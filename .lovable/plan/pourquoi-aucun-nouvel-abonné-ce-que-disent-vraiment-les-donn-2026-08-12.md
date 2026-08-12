# Pourquoi aucun nouvel abonné : ce que disent vraiment les données

## Chiffres relevés en base aujourd'hui (7 derniers jours)

| Étape | Valeur |
| --- | --- |
| Emails marquées « envoyées » | 2 301 |
| Événements de livraison / rebond enregistrés | 0 |
| Ouvertures | 692 |
| Clics dans les emails | 11 (dont 9 depuis ta propre adresse) |
| Affichages des encarts de capture sur le site | 249 |
| Clics sur ces encarts | 2 |
| Emails laissés sur le site | 3 |
| Paiements démarrés (hors emails de test) | 0 depuis le 3 août |
| Commandes payées | 1 seule au total (03/08) |
| Témoignages approuvés | 0 |

La page `/commander` a été ouverte en direct sur le domaine public : elle s'affiche
correctement, prix 47 €, carte + PayPal, aucune erreur console. **Le blocage n'est
donc pas la page de vente.**

## Diagnostic

Trois trous, dans l'ordre de gravité :

1. **On ne sait pas si les emails arrivent.** 2 301 envois, et zéro événement de
   livraison, de rebond ou de plainte enregistré. 692 ouvertures pour 2 301 envois
   avec seulement 2 vrais clics de prospects, c'est le profil typique d'emails
   partis en spam ou vers des adresses mortes. Tant que ce point n'est pas mesuré,
   tout le reste est aveugle.
2. **Les clics réels sont quasi nuls** : 11 clics, dont 9 les tiens. Sur 14 jours,
   6 prospects distincts seulement ont cliqué.
3. **Personne n'entre en paiement.** Les seuls clics arrivés sur `/commander`
   n'ont produit aucune ouverture de checkout : la page est vue, le bouton n'est
   pas pressé.

Point à vérifier avant conclusion définitive sur le point 1 : l'état réel de
livraison chez le prestataire d'envoi (aucune donnée dans notre base).

## Plan d'action

### Étape 1 — Rendre la délivrabilité visible (à faire en premier)
- Brancher les événements du prestataire (delivered, bounce, spam, unsubscribe)
  sur `email_send_log.last_event`, afin d'avoir un vrai taux de livraison.
- Nettoyer la liste : mettre en pause les adresses jamais ouvertes après 5 envois
  et celles en rebond dur.
- Tableau « Santé emails » dans l'admin : envoyés / livrés / rebonds / spam /
  ouvertures / clics, par modèle.

### Étape 2 — Test de réception réel
- Envoi contrôlé du modèle actuel vers plusieurs boîtes témoins (Gmail, Outlook,
  Orange, Yahoo) et relevé : boîte principale, promotions ou spam.
- Si le message tombe en spam : version texte allégée, un seul lien, pas d'image
  lourde, expéditeur nominatif.

### Étape 3 — Rendre le clic évident
- Un seul lien par email, un seul appel à l'action, placé dans les 3 premières
  lignes.
- Objet et première phrase réécrits autour d'un résultat concret, pas de l'offre.
- Reprise en 2 vagues : les 6 prospects qui ont cliqué reçoivent un message
  individuel court avec une question ; les ouvreurs non-cliqueurs reçoivent une
  preuve visuelle (livre complet, export réel).

### Étape 4 — Débloquer le passage à l'acte sur /commander
- Suivi de clic sur le bouton de paiement (événement dédié) pour savoir si le
  bouton est vu et ignoré, ou pas atteint.
- Réassurance et bonus remontés au-dessus du bouton : garantie, PayPal, 2×/3×.
- Relance automatique de tout panier resté en attente plus de 2 h.

### Étape 5 — Créer la preuve absente (0 témoignage)
- Demande de témoignage aux 13 abonnés actifs, dépôt sur page publique,
  validation en admin, affichage sur `/commander` et `/demo`.

### Étape 6 — Réparer la capture sur le site
- 249 affichages pour 2 clics : une seule promesse chiffrée par encart, champ
  email unique, déclenchement à la sortie de page ou à 40 % de défilement.

## Détails techniques

- Webhook prestataire → nouvelle fonction Edge qui met à jour `email_send_log`
  (`last_event`, `error_message`) par `message_id` ; suppression des adresses en
  rebond dur de `sales_prospects` (`status = 'bounced'`, `auto_send = false`).
- Hygiène de liste : requête planifiée marquant `auto_send = false` pour les
  prospects sans aucune ouverture après 5 envois.
- Admin : nouveau panneau lisant les agrégats de `email_send_log`, `email_opens`,
  `email_clicks` par `template_name`.
- Suivi bouton : `capture_events` avec `event_type = 'checkout_click'` et
  `surface = 'commander'`, posé sur le bouton de paiement de
  `src/pages/v3public/V3CommanderPage.tsx`.
- Relance panier : lecture de `v3_installment_orders` (`status = 'pending'`,
  `created_at < now() - 2h`, hors adresses de test) + envoi via `send-sales-email`,
  marquage dans `metadata` pour ne jamais relancer deux fois.
- Témoignages : `book_testimonials` (`approved = false` au dépôt), photos dans le
  bucket `testimonials`, affichage filtré `approved = true` sans email.
- Aucun changement de tarif : 47 € à vie jusqu'au 30/09/2026.
