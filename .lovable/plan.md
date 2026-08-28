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

## Un bonus par email — c'est ça qui fait cliquer

Personne ne clique pour « en savoir plus ». On clique pour recevoir quelque chose. Chaque email offre donc un bonus concret, gratuit, livré immédiatement dans l'application, sans carte bancaire et sans inscription payante.

Les 5 bonus, du plus attractif au plus engageant :

| Bonus | Ce que la personne reçoit | Page de retrait |
|---|---|---|
| Les 10 niches rentables | 10 niches Amazon analysées, avec la demande et la concurrence | `/cadeau` (existe déjà) |
| Le sommaire de votre livre, offert | Elle donne son idée, l'IA lui rend un sommaire complet à télécharger | nouvelle page `/bonus/sommaire` |
| Votre couverture, offerte | Une couverture générée aux dimensions exactes Amazon, en PNG | nouvelle page `/bonus/couverture` |
| Les 30 titres qui vendent | 30 modèles de titres et sous-titres prêts à adapter | nouvelle page `/bonus/titres` |
| Le premier chapitre écrit | Un vrai chapitre rédigé sur son sujet, prêt à relire | `/essai` (existe déjà) |

Chaque bonus est une page unique, claire, avec un seul bouton. Le bonus est délivré d'abord ; l'offre payante n'apparaît qu'après, en bas de page, jamais avant le cadeau.

Un compteur de retraits par bonus dans le panneau admin : vous verrez lequel attire, et lequel ne sert à rien.

## Les emails que je vous livre

Deux séquences séparées, rédigées et prêtes à coller dans Systeme.io. Un email = un bonus = un lien.

**Séquence chauds — 4 emails sur 8 jours**
1. J+0 — bonus : les 10 niches rentables
2. J+2 — bonus : le sommaire de votre livre, offert (+ preuve en images d'un livre terminé)
3. J+5 — bonus : votre couverture offerte (répond à « c'est trop technique »)
4. J+8 — bonus : le premier chapitre écrit, puis décision et échéance claire

**Séquence froids — 3 emails sur 10 jours**
1. J+0 — bonus : les 30 titres qui vendent (le plus facile à réclamer)
2. J+4 — bonus : les 10 niches rentables
3. J+10 — bonus : le sommaire offert, puis sortie propre proposée

Règles appliquées à tous : objet de 45 caractères maximum, aucun prix dans l'objet, aucune majuscule criée, aucun emoji, un seul lien principal répété deux fois au plus, signature avec votre adresse directe.


## Mesure des résultats

Chaque lien porte une source par email (`?src=sio-chaud-1`, etc.). Les visites, les commandes créées et les commandes payées venant de Systeme.io deviennent visibles séparément dans votre suivi existant — vous saurez quel message a produit quelle vente, sans dépendre des statistiques de Systeme.io.

## Marche à suivre dans Systeme.io

Je vous donne la procédure écrite, écran par écran : créer les deux campagnes, coller les emails, régler les délais, brancher le déclencheur sur les tags. Vous n'avez rien à deviner.

## Détails techniques

- Nouveau mode `tag_segments` dans `sync-systemeio-contacts` : calcule les deux segments depuis `email_opens`, `email_clicks`, `email_send_log` et `sales_prospects`, plafonne à 300 par segment (les plus récents d'abord), assigne `seq-chaud` / `seq-froid` par `tagId` numérique via `_shared/systemeio.ts`, avec reprise sur erreur et journal.
- Exclusions codées en dur : `unsubscribed = true`, statut rebond dans `email_send_log`, contacts déjà clients (`ebookstudio-client`).
- Nouveau fichier de contenu `src/data/systemeioSequences.ts` : les 7 emails avec objet, corps, bonus associé et lien tracké, affichés dans le panneau admin avec un bouton copier pour chacun.
- Pages bonus : `src/pages/bonus/BonusSommairePage.tsx`, `BonusCouverturePage.tsx`, `BonusTitresPage.tsx` + routes `/bonus/sommaire`, `/bonus/couverture`, `/bonus/titres` dans `App.tsx`. Réutilisation des fonctions existantes (génération de sommaire, `generate-ai-cover` avec `kdpCoverNormalize`), capture email avant livraison via `funnel-capture-lead`, offre payante en bas de page uniquement.
- Compteurs de retrait par bonus via `trackCaptureEvent` (surface `cadeau`, champ `lead_magnet` = clé du bonus) — aucune nouvelle table.
- Panneau admin : bloc « Séquence Systeme.io » dans `SystemeIoSyncPanel` — aperçu des compteurs, bouton de tagage, liste des emails à copier, retraits par bonus.
- Suivi des sources via `utmTracking.ts` / `captureTracking.ts` déjà en place, aucun schéma à modifier.
- Aucun changement sur Resend : les emails applicatifs (commandes, essais, support) restent inchangés.

## Ordre d'exécution

1. Les 3 nouvelles pages bonus + compteurs de retrait.
2. Mode `tag_segments` + aperçu des compteurs (validation ensemble avant tagage réel).
3. Tagage des 300 + 300 dans Systeme.io.
4. Livraison des 7 emails dans le panneau admin + procédure de paramétrage.
5. Vous montez les deux campagnes dans Systeme.io, on vérifie un envoi test vers votre adresse avant l'ouverture des vannes.

