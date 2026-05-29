# Système de codes bêta-testeurs — EbookStudio Pro V2

Objectif : permettre d'offrir un accès gratuit à vie à des bêta-testeurs via des codes promo à usage unique, avec page d'activation, dashboard admin et email de bienvenue automatique.

## Comment l'accès gratuit est réellement accordé

Sur EbookStudio, un utilisateur se connecte avec **email + code d'accès `EBK-XXXXXX`** (table `subscribers`). Pour donner un accès gratuit à vie, on crée donc, au moment de l'activation, un abonné `plan_type = 'lifetime'` avec un code d'accès personnel `EBK-XXXXXX`, puis on l'envoie par email. Le code bêta `BETA-EBOOK-XXXX` sert uniquement à débloquer cette création (usage unique).

## 1. Base de données

Nouvelle table `beta_promo_codes` :
- `code` (texte unique, format `BETA-EBOOK-XXXX`)
- `status` (`available` / `used`)
- `used_by_email`, `used_at`
- champs standards (id, created_at)

Sécurité (RLS) :
- Les admins peuvent tout voir / créer / modifier.
- Les codes ne sont **jamais** lisibles publiquement (la validation passe par une fonction backend sécurisée avec clé service).
- Insertion initiale des **5 codes** : `BETA-EBOOK-4872`, `BETA-EBOOK-1953`, `BETA-EBOOK-7341`, `BETA-EBOOK-2608`, `BETA-EBOOK-9174`.

## 2. Fonction backend d'activation (`redeem-beta-code`)

Logique atomique (anti double-usage) :
1. Reçoit `email` + `code`.
2. Code inexistant → message **« Code invalide… »**.
3. Code déjà `used` → message **« Ce code a déjà été utilisé… »** (avec l'adresse tranboub75017@gmail.com).
4. Code `available` :
   - marque le code `used` (avec email + date),
   - crée/met à jour l'abonné en `plan_type = 'lifetime'`, statut `active`, avec un code d'accès `EBK-XXXXXX` généré,
   - envoie l'email de bienvenue,
   - retourne le succès + le code d'accès `EBK-XXXXXX` pour connexion.

## 3. Page d'activation `/activer-beta`

Design identique à EbookStudio (mêmes tokens, composants `Card`/`Input`/`Button`, thème KDP) :
- Champ email, champ code promo, bouton « Activer mon accès ».
- Message de succès : **« Félicitations ! Votre accès gratuit à vie à EbookStudio Pro V2 est activé. Bienvenue dans la communauté ! »**, suivi du code d'accès `EBK-XXXXXX` et d'un bouton vers la connexion.
- Messages d'erreur exactement comme demandé (code déjà utilisé / code invalide).

## 4. Email de bienvenue automatique

Envoyé via Resend (déjà configuré) depuis `redeem-beta-code` :
- **Sujet** : « Bienvenue chez EbookStudio Pro V2 — Votre accès est activé »
- **Corps** (FR) : message demandé + ajout du code d'accès `EBK-XXXXXX` et du lien de connexion pour que le bêta-testeur puisse se connecter immédiatement. Signature : « Georges » (modifiable).
- Mise en page HTML aux couleurs de la marque.

## 5. Dashboard admin `/admin/codes-beta`

Protégé par le système admin existant (connexion par mot de passe de votre compte admin, validé côté serveur via `AdminGate` — plus sûr qu'un mot de passe en dur). Ajout d'un onglet « Codes Bêta » dans la navigation admin.

Affiche :
- Liste des 5 codes (et suivants),
- Statut (utilisé / disponible),
- Email du bêta-testeur ayant utilisé chaque code,
- Date + heure d'activation,
- Compteur : codes utilisés vs restants.

Action : bouton **« Générer de nouveaux codes »** (format `BETA-EBOOK-XXXX`, 4 chiffres aléatoires uniques, avec contrôle d'unicité).

## Détails techniques

- Format code bêta : `BETA-EBOOK-` + 4 chiffres aléatoires uniques.
- Anti-collision : génération avec vérification d'unicité côté base, nouvelle migration pour la table + RLS + seed des 5 codes.
- Activation traitée intégralement côté serveur (clé service) pour éviter toute fraude depuis le navigateur.
- Route `/activer-beta` ajoutée dans `App.tsx` (publique), route admin sous `AdminGate`.
- Réutilisation de la logique existante d'abonné lifetime (`subscribers`) et de Resend.

## Note sur le « mot de passe admin »

Vous disposez déjà d'un système admin sécurisé (votre compte `boubetgeorges@gmail.com`, vérifié côté serveur). J'utiliserai ce système pour protéger la page — c'est plus sûr qu'un mot de passe écrit dans le code, qui serait visible et facilement contournable. Si vous préférez vraiment un mot de passe dédié distinct, dites-le-moi.