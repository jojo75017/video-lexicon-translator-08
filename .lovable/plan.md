## Diagnostic (vérifié en base)

- `email_clicks` : 157 lignes, **30 emails uniques** depuis juin. Ce n'est pas un blocage à 19, c'est un vrai plafond d'engagement.
- Les ouvertures sont excellentes : `vrai-lien-commander-59` = **330 ouvreurs uniques**, `v3-incluse-59` = 267, `v2-lettre-perso` = 154, `v2-v3-passerelle` = 264 (dernière ouverture aujourd'hui 11h48).
- Deux causes techniques confirmées :
  1. `send-clickers-59-offer` et `send-clickers-followup` envoient des liens **directs, non trackés** → leurs clics ne sont jamais enregistrés, donc le vivier de cliqueurs ne peut pas grossir.
  2. Une partie des lignes de `email_clicks` sont des faux positifs de scanners anti-spam (noms de template en ROT13 : `fgbaebee-7` = `standard-7`, `efybadf-6` = `relance-6`), ce qui gonfle le total sans être de vrais humains.
- Conclusion : il ne faut plus recibler « les cliqueurs », mais **les ouvreurs** (≈330 personnes réellement attentives), avec un contenu neuf : la vidéo YouTube.

## Ce qui va être fait

### 1. Nouvelle campagne « vidéo » (`send-video-demo-openers`)

- **Cible** : tous les emails présents dans `email_opens` (ouvreurs réels), moins :
  - les clients payants (`funnel_orders.status = 'paid'`),
  - les désabonnés (`sales_prospects.unsubscribed = true`),
  - l'adresse admin,
  - ceux ayant déjà reçu ce template (reprise sûre en cas de relance).
- **Contenu** : email court centré sur la vidéo `https://www.youtube.com/watch?v=rOwQYrC1KYM`
  - objet orienté curiosité vidéo (ex. « je vous montre l'outil en vidéo (rien à lire) »),
  - une vignette cliquable (image YouTube + bouton play) qui pointe vers la vidéo,
  - un seul lien secondaire vers `https://www.ebookstudio.fr/commander` (59 € à vie, V3 incluse),
  - version texte brut + version HTML sobre pour la délivrabilité,
  - mention STOP en pied.
- **Tracking corrigé** : les deux liens (vidéo et commander) passent par `track-email-click` avec `t=video-demo-openers`, pixel d'ouverture inclus. On saura enfin qui clique, et sur quoi (vidéo vs offre).
- **Sécurité d'envoi** : réutilisation du throttle Resend existant (8 req/s, arrêt sur quota journalier), journalisation dans `email_send_log`, mode `{ test: true }` pour un envoi à l'admin d'abord, et `{ limit: n }` pour envoyer par lots.

### 2. Nettoyage des campagnes obsolètes

Suppression des fonctions de campagne périmées ou non trackées :
`send-clickers-59-offer`, `send-clickers-followup`, `send-v3-offre-relance`, `send-v3-incluse-59`, `send-vrai-lien-commander`, `send-marie-rachel-story`, `send-marie-rachel-story-v2`, `send-openers-reactivation`, `send-prospects-gift-59`.

Conservés : `track-email-click`, `track-email-open`, `send-v2-lettre-perso` (référence texte), et toutes les fonctions transactionnelles (accès, bêta, audiobook, bienvenue, etc.).

### 3. Correction du tracker

Dans `track-email-click`, la redirection par défaut et les liens de secours pointent encore vers l'ancien domaine `video-lexicon-translator-08.lovable.app/offres`. Ils seront redirigés vers `https://www.ebookstudio.fr/commander`, le tunnel unique.

### Détails techniques

- Nouvelle fonction : `supabase/functions/send-video-demo-openers/index.ts`, basée sur le pattern de `send-v2-lettre-perso` (pagination `fetchAll`, dédoublonnage, `sendResendEmailThrottled`).
- Vignette vidéo : image `https://i.ytimg.com/vi/rOwQYrC1KYM/hqdefault.jpg` en `<img>` cliquable (pas de vidéo embarquée, non supportée en email).
- Déploiement de la nouvelle fonction et de `track-email-click`, puis envoi test à l'admin avant l'envoi complet aux ouvreurs.
- Aucune modification de schéma base de données.
