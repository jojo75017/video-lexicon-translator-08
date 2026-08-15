# Faire convertir les emails (et la page de vente) — plan d'action

## Les chiffres réels (30-45 derniers jours)

- 679 destinataires touchés
- 413 ont ouvert (~61 % : très bon)
- 34 seulement ont cliqué (~5 % : trop faible)
- 208 n'ont jamais ouvert
- 440 ont ouvert sans jamais cliquer
- 552 vues de la page `/commander`
- 7 leads, **0 commande créée, 0 commande payée**

Diagnostic : les emails arrivent bien et sont lus. Deux fuites seulement :
1. **le clic** (95 % des lecteurs ne cliquent pas),
2. **la page d'achat** (552 visites, aucune commande).

Tant que ces deux points ne sont pas corrigés, augmenter le volume d'envoi ne servira à rien.

## Pourquoi les emails actuels ne font pas cliquer

- Ils vendent un abonnement avant d'avoir rien donné : le lecteur doit payer pour savoir si l'outil marche.
- Un seul type de lien : « acheter ». Aucune raison de cliquer si on n'est pas encore décidé.
- Objets centrés sur l'offre et l'échéance, pas sur le résultat du lecteur.
- Emails longs : la décision est demandée trop tard, après plusieurs écrans.
- Aucun rythme : les non-ouvreurs et les lecteurs intéressés reçoivent le même message.

## La règle qui change tout : un clic gratuit avant tout achat

Chaque email de relance aura **un seul objectif : obtenir un clic sans risque**, vers le cadeau (les 10 niches) livré immédiatement dans l'application. Le lien d'achat existe, mais en second, plus bas, jamais en concurrence avec le lien cadeau.

Ce clic gratuit fait trois choses : il crée un lead identifié, il amène le prospect dans l'application, et c'est là — et seulement là — que l'offre 47 € est présentée.

## Les 3 séquences à écrire

### Séquence A — 208 jamais ouverts (réactivation)

Objectif : obtenir une première ouverture.

- Emails très courts (5 à 7 lignes maximum), un seul lien.
- Objets courts, concrets, sans prix, sans majuscules, sans emoji : formulés comme un message personnel.
- Nouvel objet à chaque envoi ; envoi le matin ; 3 messages espacés de 3 jours puis arrêt automatique.

### Séquence B — 440 ouverts sans clic (le plus gros gisement)

Objectif : le premier clic.

1. **Cadeau immédiat** — les 10 niches offertes, rien à payer, un seul bouton.
2. **Preuve concrète** — un livre réel produit du sommaire au fichier Amazon, en 5 étapes visibles ; lien vers la démonstration.
3. **Objection principale** — « je n'écris pas bien », « c'est technique » : réponses courtes, lien vers le cadeau, puis mention de l'offre.
4. **Échéance** — l'accès à vie 47 € se termine le 30 septembre 2026 ; là seulement, le bouton d'achat est en premier.

### Séquence C — 34 cliqueurs (les plus chauds)

Objectif : la vente.

- Message personnel signé de vous, court, qui demande simplement ce qui les retient et propose votre email direct.
- Puis un rappel unique avec le lien d'achat et la levée de risque (ce qui se passe après paiement, délai d'accès, contact).

## Les règles de rédaction appliquées à tous les emails

- Un email = un objectif = un lien principal, répété au maximum deux fois.
- Objet ≤ 45 caractères, sans prix ni majuscules ; texte de pré-en-tête distinct de la première phrase.
- La promesse concrète dès la première ligne, la décision demandée avant le premier défilement.
- Français impeccable, aucun mot latin ni pseudo-texte, aucun lien mort, aucun `#`.
- Une seule signature avec votre adresse directe **boubetgeorges@gmail.com**.
- Un seul expéditeur valide, désabonnement clair, exclusion des désabonnés et des adresses en rebond.
- Marquage `[TEST]` obligatoire sur vos essais pour ne jamais polluer les statistiques.
- Quota respecté : 100 envois par jour, donc envoi étalé automatiquement par lots.

## Mesurer ce qui convertit vraiment

- Chaque lien tracé par séquence et par email, pour connaître l'ouverture, le clic, le lead créé et la commande.
- Deux objets différents testés sur les deux premiers lots de chaque séquence, puis on garde le gagnant.
- Un tableau d'administration qui montre, par email : envoyés, ouverts, cliqués, leads, commandes. Sans ces colonnes, impossible de savoir quoi corriger.

## Corriger la page d'arrivée en même temps

Un email qui fait cliquer ne sert à rien si la page ne transforme pas. Sur `/commander` :

- bloc de capture « 10 niches offertes » visible sans défiler, pour ne plus perdre les visiteurs non acheteurs ;
- bouton d'achat dans le premier écran, puis répété trois fois maximum ;
- témoignages et avis placés juste avant le prix ;
- levée de risque à côté du bouton : ce qui se passe après paiement, délai d'accès, votre contact direct ;
- compte à rebours jusqu'au 30 septembre 2026 au même endroit que le bouton ;
- suivi séparé des événements « page vue », « bouton cliqué », « paiement commencé » pour localiser exactement l'abandon.

## Détails techniques

- Segments calculés depuis `email_send_log`, `email_opens`, `email_clicks`, `sales_prospects`, avec exclusion des `unsubscribed` et des statuts `bounced`.
- Nouveaux modèles ajoutés à `send-closing-47` : `reactivation-a1/a2/a3`, `clic-b1/b2/b3/b4`, `chaud-c1/c2`, tous déclarés dans `src/data/canonicalEmailCampaign.ts`.
- `ClosingCampaignPanel.tsx` : sélection de la séquence, compteur réel du segment avant envoi, simulation, étalement automatique sur plusieurs jours, colonnes ouvertures/clics/leads/commandes.
- Liens cadeau tracés vers `/10-niches-offertes`, liens d'achat vers `/commander` avec source par email.
- `V3CommanderPage.tsx` : capture cadeau, remontée du bouton, preuve sociale, levée de risque, compte à rebours.
- `captureTracking.ts` : usage systématique de `checkout_click` et `checkout_ready` pour distinguer l'abandon avant et pendant paiement.
- Tarifs inchangés : 47 € à vie jusqu'au 30/09/2026, puis Plume 17 €/mois et Édition 27 €/mois.

## Ordre d'exécution après approbation

1. Rédaction des 9 emails des séquences A, B, C.
2. Segmentation et branchement dans l'outil d'envoi, avec compteurs réels.
3. Correction de conversion de `/commander` et suivi des clics.
4. Envoi test vers votre adresse, contrôle de chaque lien, puis envoi réel étalé par lots de 100 en commençant par la séquence B (le plus gros gisement).
