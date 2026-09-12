# Lettre cadeau « 10 niches Amazon offertes »

Un nouvel email dédié au cadeau, envoyé d'abord aux prospects qui n'ont jamais cliqué. Le cadeau est livré sur votre page du site, avec en plus un bouton pour télécharger le PDF Google Drive.

## 1. La lettre

- Objet : « 10 niches Amazon rentables, offertes »
- Promesse unique : le cadeau d'abord, sans condition d'achat.
- Corps court : ce que contient le cadeau (10 niches réelles, une par catégorie, potentiel et concurrence), pourquoi c'est utile avant d'écrire, puis un rappel discret de l'offre 47 € jusqu'au 30 septembre.
- Un seul bouton : « Recevoir mes 10 niches », vers votre page du site avec suivi du clic.
- Même mise en page que les 4 emails existants (même en-tête, même signature, pixel d'ouverture, mention de désinscription), français strict.

## 2. La page du cadeau

Sur la page « 10 niches offertes » déjà en ligne :

- Ajout d'un bouton clair « Télécharger le PDF des 10 niches » pointant vers votre fichier Google Drive (lien de téléchargement direct).
- Les 10 niches restent affichées à l'écran, la page reste accessible sans achat.
- L'offre 47 € reste présentée juste en dessous, comme aujourd'hui.

## 3. Qui reçoit, et dans quel ordre

- Priorité 1 : les prospects qui n'ont jamais cliqué.
- Priorité 2 : le reste de la base, ensuite.
- Exclusions automatiques inchangées : clients, abonnés, désinscrits, adresses en erreur, adresses internes, et toute adresse ayant déjà reçu cette lettre.
- Envoi par lots de 100 par jour (limite de la messagerie), reprise sans doublon le lendemain.

## 4. Suivi dans l'admin

Sur la page « Emails lancement » : la nouvelle lettre apparaît comme une étape à part, avec envoyés, clics, échecs, total du jour, et un bouton « Envoyer un lot de 100 ». Un envoi de test vers votre adresse est prévu avant le premier lot.

## Détails techniques

- Nouvelle entrée dans `LAUNCH_EMAILS` de `send-launch-sequence` : `step: 5`, `template: "v3l-niches-offertes"`, `shortKey: "l5"`, CTA vers `/10-niches-offertes` via le lien court tracké. Aucune nouvelle fonction Edge.
- Ajout de `l5` dans `src/data/campagneUnique.ts` (redirection `/r/...` → `/10-niches-offertes?src=l5`).
- Segmentation « non-cliqueurs » : prospects sans entrée de clic ; déduplication par `email_send_log` sur `template = v3l-niches-offertes`.
- `Niches10OffertesPage.tsx` : bouton de téléchargement vers `https://drive.google.com/uc?export=download&id=16QCOAqSsDbGR0A4KYfzkagjDl40wrqax`.
- `AdminLancementEmailsPage.tsx` : l'étape 5 s'affiche automatiquement à partir de la liste des emails, avec les mêmes compteurs.
- Aucun changement de tarif, de paiement, de base de données ni de sécurité.
