# Email « pression » : devis correction/mise en forme + inscription V3

## Ce que disent vos données aujourd'hui

- 1 935 prospects (hors désinscrits) et 33 leads de tunnel : de quoi toucher largement plus de 100 personnes.
- Seulement 2 paniers réellement abandonnés en base : ce n'est pas une source suffisante, ils seront intégrés en priorité mais pas comme socle.
- 3 910 envois sur les 30 derniers jours : l'ancienne limite gratuite était dépassée, d'où l'impression de n'avoir « plus que 5 emails ».

## L'envoi est maintenant débloqué

Vous venez de passer à l'offre payante (20 $/mois, 50 000 emails) : la contrainte de quota disparaît.

- Envoi par lots de 200 maximum, avec pause automatique entre chaque email pour rester dans la cadence autorisée.
- Toute la liste (paniers abandonnés, prospects actifs, leads) peut être traitée en une seule journée.
- Rien ne part tout seul : chaque lot est déclenché par votre clic.

## L'email (un seul, direct et ferme)

Objet de travail : « Votre livre est écrit. Il n'est pas encore publiable. »

Ton : constat cash, pas de promo, pas d'emoji. Deux blocs de poids égal :

1. **Je le fais pour vous** — correction, mise en forme, couverture, dépôt KDP. Devis à partir de 149 €, lien vers la page de prestation avec le formulaire de devis.
2. **Je le fais moi-même** — la V3 ouvre le 1er octobre, Plume 27 € ou Édition 47 €. Lien vers la page V3 et l'inscription.

Fin de message : une échéance claire (ouverture 1er octobre) et une ligne de désinscription.

## Comment ça se pilote

Un onglet **Relance devis + V3** dans l'espace admin :

- Comptage en direct des destinataires éligibles (paniers abandonnés d'abord, puis prospects actifs, puis leads).
- Aperçu du texte exact avant tout envoi.
- Bouton **Test vers ma boîte** (boubetgeorges@gmail.com) pour valider.
- Bouton **Envoyer le lot**, par paquets de 200, jamais deux fois la même adresse, arrêt net avec message exact en cas de refus de la plateforme.
- Tableau de suivi : envoyés, restants, clics par lien.

## Détails techniques

- Nouvelle fonction `send-relance-devis-v3` (admin uniquement via `has_role`), envoi par `sendResendEmailThrottled`, expéditeur `noreply@ebookstudio.fr`, réponses vers `boubetgeorges@gmail.com`.
- Destinataires : `funnel_orders` non payés, `sales_prospects` non désinscrits, `funnel_leads` ; exclusion des payants, des adresses de test et de toute adresse déjà touchée par ce template (contrôle sur `email_send_log`).
- Version texte brut générée automatiquement, deux liens courts tracés (`/r/devis1` vers `/prestation-kdp`, `/r/v3` vers la V3) ajoutés à `SHORT_LINKS`.
- Aucune modification des tarifs, des paiements, de la base de données existante, de la sécurité, des calculs KDP ni des crédits.

## Ce que je ne fais pas

Aucun envoi de masse déclenché tout seul : rien ne part sans votre clic sur le bouton.
