# Séquence de relance dans Systeme.io — 600 contacts (300 chauds + 300 froids)

Pas de Mailchimp : vos contacts sont déjà dans Systeme.io et la séquence automatique y est incluse. On monte la campagne là, sans nouveau DNS, sans nouveau coût, sans repartir d'une réputation à zéro.

## Ce que je prépare côté application

Un nouveau tagage précis dans Systeme.io pour que vous puissiez déclencher deux séquences distinctes :

| Segment | Volume visé | Tag Systeme.io | Critère |
|---|---|---|---|
| Chauds | 300 | `seq-chaud` | A déjà ouvert ou cliqué au moins un email |
| Froids | 300 | `seq-froid` | Jamais ouvert, jamais cliqué, jamais désabonné, pas en rebond |

Les désabonnés et les adresses en rebond sont exclus d'office, sans exception.

Le tagage se lance depuis le panneau admin (onglet Envoi de la page prospects), avec un aperçu des compteurs avant validation. Aucun email n'est envoyé par l'application : Systeme.io s'occupe de l'envoi.

## Les emails que je vous livre

Deux séquences séparées, rédigées et prêtes à coller dans Systeme.io, avec objet, corps et lien unique par message.

**Séquence chauds — 4 emails sur 8 jours**
1. J+0 — le cadeau des 10 niches, un seul lien, aucune vente
2. J+2 — la preuve : pages réelles d'un livre produit, du sommaire au fichier Amazon
3. J+5 — l'objection principale (« je n'écris pas bien ») traitée en une page
4. J+8 — décision : ce qui change, échéance claire, lien de commande

**Séquence froids — 3 emails sur 10 jours**
1. J+0 — réactivation : une seule question, réponse en un clic
2. J+4 — le cadeau, sans conditions
3. J+10 — dernier message, sortie propre proposée

Règles appliquées à tous : objet de 45 caractères maximum, aucun prix dans l'objet, aucune majuscule criée, aucun emoji, un seul lien principal répété deux fois au plus, signature avec votre adresse directe.

## Mesure des résultats

Chaque lien porte une source par email (`?src=sio-chaud-1`, etc.). Les visites, les commandes créées et les commandes payées venant de Systeme.io deviennent visibles séparément dans votre suivi existant — vous saurez quel message a produit quelle vente, sans dépendre des statistiques de Systeme.io.

## Marche à suivre dans Systeme.io

Je vous donne la procédure écrite, écran par écran : créer les deux campagnes, coller les emails, régler les délais, brancher le déclencheur sur les tags. Vous n'avez rien à deviner.

## Détails techniques

- Nouveau mode `tag_segments` dans `sync-systemeio-contacts` : calcule les deux segments depuis `email_opens`, `email_clicks`, `email_send_log` et `sales_prospects`, plafonne à 300 par segment (les plus récents d'abord), assigne `seq-chaud` / `seq-froid` par `tagId` numérique via `_shared/systemeio.ts`, avec reprise sur erreur et journal.
- Exclusions codées en dur : `unsubscribed = true`, statut rebond dans `email_send_log`, contacts déjà clients (`ebookstudio-client`).
- Nouveau fichier de contenu `src/data/systemeioSequences.ts` : les 7 emails avec objet, corps et lien tracké, affichés dans le panneau admin avec un bouton copier pour chacun.
- Panneau admin : bloc « Séquence Systeme.io » dans `SystemeIoSyncPanel` — aperçu des compteurs, bouton de tagage, liste des emails à copier.
- Suivi des sources via `utmTracking.ts` / `captureTracking.ts` déjà en place, aucun schéma à modifier.
- Aucun changement sur Resend : les emails applicatifs (commandes, essais, support) restent inchangés.

## Ordre d'exécution

1. Mode `tag_segments` + aperçu des compteurs (validation ensemble avant tagage réel).
2. Tagage des 300 + 300 dans Systeme.io.
3. Livraison des 7 emails dans le panneau admin + procédure de paramétrage.
4. Vous montez les deux campagnes dans Systeme.io, on vérifie un envoi test vers votre adresse avant l'ouverture des vannes.
