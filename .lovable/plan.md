# Vérifier la délivrabilité, puis écrire des emails qui font cliquer

## Ce que les vérifications montrent (fait à l'instant)

- **SPF présent et correct** sur `ebookstudio.fr` (`v=spf1 include:amazonses.com ~all`) : c'est bien celui attendu par le fournisseur d'envoi.
- **DKIM présent** (`resend._domainkey.ebookstudio.fr`).
- **DMARC cassé** : l'enregistrement publié est `v=DMARC1; p = aucun ; rua=mailto:rua@dmarc.brevo.com`. La valeur `p = aucun` n'est pas valide (elle doit être `p=none`, sans espaces, en anglais) et le rapport part chez un autre outil. Un DMARC invalide dégrade la réputation chez Gmail et Outlook, qui exigent un DMARC lisible.
- **Aucune preuve de livraison, sur aucun envoi** : sur 12 663 envois enregistrés, la colonne d'évènement de livraison est vide à 100 %. Aucun envoi n'est confirmé « livré », « rebond » ou « plainte ».
- **La synchronisation des livraisons ne peut pas fonctionner** : la clé d'envoi utilisée est restreinte à l'envoi seul. L'appel de contrôle renvoie « clé restreinte » (erreur 401), donc le panneau « Santé des emails » ne remplira jamais les statuts. C'est la cause directe du trou de visibilité.
- **Trois vagues sont restées en attente** : 236 destinataires `clic-b1`, 336 `clic-b2`, 266 `reactivation-a2` n'ont jamais été envoyés.
- Chiffres réels sur 25 jours : 12 663 envois, 4 316 ouvertures, **131 clics**, 680 adresses distinctes. Le problème est donc bien le clic, pas l'arrivée dans la boîte — mais on ne peut pas le prouver sans les statuts de livraison.

Conclusion : on ne corrige pas la conversion avant d'avoir la preuve de livraison. Les deux chantiers se font dans cet ordre.

## Étape 1 — Prouver que les emails arrivent (avant tout nouvel envoi)

1. **Réparer DMARC** : publier chez le fournisseur DNS `v=DMARC1; p=none; rua=mailto:boubetgeorges@gmail.com; fo=1` en remplacement de l'enregistrement actuel. C'est une action à faire dans l'interface DNS ; les valeurs exactes vous seront données.
2. **Remplacer la clé d'envoi par une clé à accès complet** (envoi + lecture), afin que la synchronisation des livraisons fonctionne. Sans cela, aucun statut ne remontera jamais.
3. **Brancher les évènements de livraison** : à chaque envoi on enregistre l'identifiant de message, puis la synchronisation écrit livré / rebond dur / rebond doux / plainte / échec, avec la date.
4. **Ajouter un test d'arrivée réel** avant chaque campagne : un envoi vers votre adresse Gmail plus une adresse Outlook et une Yahoo, marqué `[TEST]`, avec affichage du statut d'authentification obtenu.
5. **Nettoyer la liste** : les adresses en rebond dur et les jamais-ouvreurs après 5 envois sortent définitivement des envois.
6. **Panneau admin lisible** : par email, envoyés / livrés / rebonds / plaintes / ouvertures / clics, plus un bandeau rouge tant que le taux de livraison n'est pas confirmé.

## Étape 2 — Reprendre proprement les vagues bloquées

- Relancer uniquement les 838 destinataires en attente (`clic-b1`, `clic-b2`, `reactivation-a2`), sans doublon, par lots étalés.
- Ne rien renvoyer à ceux déjà servis, aux acheteurs, aux désinscrits et aux rebonds.

## Étape 3 — Des emails écrits pour le clic

Règle unique : **un email = un objectif = un lien**, et ce lien est gratuit (le pack de 10 niches offert), jamais la page de paiement, sauf dans les deux emails d'échéance.

- Objet ≤ 45 caractères, sans prix, sans majuscules, sans emoji.
- Promesse concrète dès la première ligne, bouton visible sans défiler.
- 6 à 10 lignes maximum, une seule signature avec votre adresse directe boubetgeorges@gmail.com.
- Version texte brut envoyée en parallèle du HTML (les emails HTML seuls sans version texte sont pénalisés).
- Poids allégé : pas d'images lourdes, aucun lien mort, aucun `#`.
- Deux objets testés sur les deux premiers lots de chaque séquence, on garde le gagnant.

Séquences (déjà en place côté outil, à réécrire) :
- **A — jamais ouverts** : 3 messages ultra-courts, objectif = une ouverture.
- **B — ouverts sans clic** : cadeau immédiat, preuve concrète, objection, échéance.
- **C — cliqueurs** : message personnel puis rappel unique avec levée de risque.

## Étape 4 — Mesurer le clic jusqu'à la commande

- Un lien tracé par séquence et par email, avec suivi : ouvert → cliqué → lead créé → commande.
- Sur `/commander` : évènements séparés « page vue », « bouton cliqué », « paiement commencé » pour localiser l'abandon exact.

## Détails techniques

- `email_send_log` : remplir `message_id`, `status`, `last_event` à l'envoi ; `email-health-sync` passe en lecture des évènements et écrit livré/rebond/plainte, puis alimente une table de suppression.
- La clé restreinte actuelle fait échouer `email-health-sync` en 401 (`restricted_api_key`) : le remplacement de la clé est un prérequis bloquant.
- `send-closing-47` / `send-sales-email` : ajout d'une version `text` à côté de `html`, reprise idempotente par `message_id`, exclusion des rebonds et désinscrits, lots étalés.
- `ClosingCampaignPanel` : colonnes livrés / rebonds / plaintes, action « reprendre les destinataires restants », test multi-fournisseurs `[TEST]`.
- DMARC et clé d'envoi sont des actions hors code, à faire par vous ; le reste est automatisé.
- Tarifs inchangés : 47 € à vie jusqu'au 30/09/2026, puis Plume 27 €, Édition 47 €, Studio Pro 97 €.

## Ordre d'exécution après approbation

1. Correction DMARC + nouvelle clé d'envoi complète.
2. Statuts de livraison réels et panneau admin.
3. Test d'arrivée Gmail / Outlook / Yahoo.
4. Reprise des 838 en attente.
5. Réécriture des 9 emails et envoi étalé, en commençant par la séquence B.
