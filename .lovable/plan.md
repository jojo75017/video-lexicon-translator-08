# Email « pression » : devis correction/mise en forme + inscription V3

## Ce que disent vos données aujourd'hui

- 1 935 prospects (hors désinscrits) et 33 leads de tunnel : de quoi toucher largement plus de 100 personnes.
- Seulement 2 paniers réellement abandonnés en base : ce n'est pas une source suffisante, ils seront intégrés en priorité mais pas comme socle.
- 3 910 envois sur les 30 derniers jours pour 2 042 destinataires : l'offre gratuite (3 000 emails/mois) est dépassée, d'où l'impression de n'avoir « plus que 5 emails ». C'est le vrai blocage, pas la liste.

## Le point à trancher sur l'envoi

Sur l'offre gratuite, l'envoi repart au prochain cycle mensuel, environ 100 par jour. Deux chemins :

- **Attendre le nouveau cycle** : envoi étalé, 100 par jour, gratuit, la centaine de contacts est touchée le premier jour.
- **Passer à l'offre payante (~20 $/mois)** : 50 000 emails, la liste complète part en un ou deux jours.

Je prépare tout pour que ce soit prêt à partir dès que le quota le permet, sans envoi automatique.

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
- Bouton **Envoyer le lot du jour**, plafonné à 100, jamais deux fois la même adresse, arrêt net si le quota est atteint avec le message exact.
- Tableau de suivi : envoyés, restants, clics par lien.

## Détails techniques

- Nouvelle fonction `send-relance-devis-v3` (admin uniquement via `has_role`), envoi par `sendResendEmailThrottled`, expéditeur `noreply@ebookstudio.fr`, réponses vers `boubetgeorges@gmail.com`.
- Destinataires : `funnel_orders` non payés, `sales_prospects` non désinscrits, `funnel_leads` ; exclusion des payants, des adresses de test et de toute adresse déjà touchée par ce template (contrôle sur `email_send_log`).
- Version texte brut générée automatiquement, deux liens courts tracés (`/r/devis1` vers `/prestation-kdp`, `/r/v3` vers la V3) ajoutés à `SHORT_LINKS`.
- Aucune modification des tarifs, des paiements, de la base de données existante, de la sécurité, des calculs KDP ni des crédits.

## Ce que je ne fais pas

Aucun envoi de masse déclenché tout seul : rien ne part sans votre clic sur le bouton.
