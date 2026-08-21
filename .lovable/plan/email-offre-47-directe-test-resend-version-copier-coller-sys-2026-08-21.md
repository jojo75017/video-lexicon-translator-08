# Email « Offre 47 € directe » — test Resend + version copier-coller Systeme.io

## Objectif

Vérifier si les clics passent : un email très simple, une seule promesse, **un seul bouton vers la page d'achat** (`/commander`). Envoyé d'abord en test à `boubetgeorges@gmail.com`, puis, après votre accord, en vague réelle. En parallèle, une version prête à copier-coller dans Systeme.io pour comparer les résultats entre les deux outils : si Resend enregistre des clics et Systeme.io non, le problème vient de Systeme.io, pas du message.

## Étape 1 — Nouvel email « offre-47-directe » (Resend)

Un modèle court, sans détour :

- **Objet** (≤ 45 caractères) : « 47 € une fois, à vie — jusqu'au 31 août »
- **Corps** : 8 à 10 lignes maximum. Promesse dès la première ligne (votre livre prêt pour Amazon, à vie, 47 € une seule fois), liste courte de ce qui est inclus, date de fin le 31 août.
- **Un seul bouton** « Je prends l'accès à 47 € » vers `https://ebookstudio.fr/commander`, **lien tracké** via la route `/r` (comme les campagnes actuelles) pour compter chaque clic dans le tableau admin.
- Signature Georges + `boubetgeorges@gmail.com`, désabonnement en pied.
- Français strict, aucun latin, aucun lien mort, aucun `#`.

## Étape 2 — Test avant tout envoi réel

- Envoi d'un exemplaire `[TEST]` à `boubetgeorges@gmail.com` via la fonction d'envoi existante (Resend).
- Contrôle : rendu, objet, et surtout **les 2 liens** (bouton + lien texte) qui doivent aboutir sur `/commander` avec le clic enregistré.
- Vous validez, puis seulement ensuite je lance la vague réelle sur les prospects (par lots de 100, comme d'habitude).

## Étape 3 — Version copier-coller pour Systeme.io

Deux fichiers livrés dans `public/email-templates/` (comme le modèle GetResponse existant) :

- `offre-47-directe-systemeio.html` — le même email en HTML simple compatible Systeme.io (à coller dans l'éditeur).
- Le texte brut équivalent dans le même fichier, en commentaire, pour le champ « version texte ».
- Le bouton pointe vers `https://ebookstudio.fr/commander?src=systemeio` : les visites venant de Systeme.io seront **visibles séparément** dans le suivi (`src=systemeio`), ce qui permet la comparaison directe avec Resend.

## Étape 4 — Lecture des résultats

Après 48 h, comparaison dans le panneau admin :

- clics enregistrés côté Resend (route `/r`) ;
- visites `/commander?src=systemeio` côté Systeme.io.

Si Resend clique et pas Systeme.io → le réglage à corriger est chez Systeme.io (domaine d'expédition, liens réécrits). Si aucun des deux ne clique → le problème est le message ou la liste, pas l'outil.

## Détails techniques

- Nouveau modèle ajouté à la fonction d'envoi existante (`send-sales-email` / `send-closing-47`, même moteur, pas de nouvelle fonction Edge), déclaré dans `src/data/canonicalEmailCampaign.ts` avec `template: 'offre-47-directe'`.
- Lien tracké : `/r?e=...&t=offre-47-directe&u=/commander` (enregistrement du clic via `track-email-click`, puis redirection).
- Exclusions habituelles pour la vague réelle : clients existants, désabonnés, rebonds, adresses déjà ayant reçu `offre-47-directe` (journal `email_send_log`).
- Quota Resend respecté : lots de 100/jour avec reprise le lendemain.
- Aucun changement de tarif, de page de vente ou de tunnel : 47 € accès à vie jusqu'au 31 août 2026, bouton vers `/commander`.
- Aucune intégration Systeme.io ajoutée au code : c'est un simple fichier à copier-coller, l'envoi et le suivi Systeme.io restent chez eux.

## Ordre d'exécution

1. Rédaction et ajout du modèle `offre-47-directe`.
2. Envoi du test `[TEST]` à votre adresse + vérification des liens.
3. Création du fichier HTML/texte pour Systeme.io.
4. Après votre feu vert sur le test : lancement de la vague réelle par lots de 100.
