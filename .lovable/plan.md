# Ouverture de la V3 le 1er octobre : admin, abonnés, bascule

## 1. Un interrupteur d'ouverture, sans republier

Aujourd'hui l'ouverture dépend d'une valeur figée dans le code (`V3_LAUNCH_UNLOCKED = false`) :
il faut republier le site pour ouvrir. L'interrupteur `v3_open` existe déjà en base et est
déjà visible dans le tableau de bord « Lancement V3 », mais il ne commande rien.

À faire : c'est `v3_open` qui décide de l'ouverture. Vous ouvrez ou refermez la V3
depuis votre tableau de bord, à distance, en un clic. Tant que le statut est en cours de
lecture, on ne verrouille rien (jamais d'éjection d'un abonné ou d'un admin).

## 2. Ce que voit l'admin

- Accès complet à la V2 et à la V3, avant comme après le 1er octobre.
- Dans « Lancement V3 » : interrupteur « V3 ouverte au public » + date d'ouverture, et
  un rappel de l'état réel (ouverte / fermée, compte à rebours).
- Le bouton « Voir comme un abonné » reste : il affiche exactement l'écran d'un abonné
  (modules verrouillés, prix remisés), les onglets réservés à l'admin restant grisés.
- Bascule V2 / V3 par le bouton flottant, inchangée.

## 3. Ce que voit l'abonné

### Avant le 1er octobre
- Connexion → sa V2, comme aujourd'hui.
- Une bannière discrète annonce la V3 avec le compte à rebours et le lien
  « Ancien client V2 » (3 nouveautés offertes + −20 % à vie).

### Après l'ouverture
- Connexion → **écran de choix** : « Continuer sur ma V2 » ou « Découvrir la V3 ».
  Son choix est mémorisé ; il peut changer d'avis à tout moment (bouton dans les deux
  interfaces). Aucune bascule forcée, la V2 reste intacte.
- Dans la V3, il voit **tout le catalogue** :
  - ses 3 nouveautés offertes à vie, utilisables (Génie + sommaire, Correcteur, Export premium) ;
  - tous les autres modules **visibles mais cadenassés**, avec leur prix affiché
    remisé −20 % « ancien client » et un bouton pour débloquer ;
  - un bandeau « Vous êtes ancien client : −20 % à vie sur Plume et Édition ».
- Un module cadenassé cliqué ouvre une explication + l'offre, jamais une page d'erreur
  ni une redirection surprise.

## 4. La bascule des abonnés existants

1. **Reconnaissance automatique.** Tout compte présent dans la base des abonnés (offre V2
   à vie ou abonnement actif) est reconnu comme « ancien client V2 » et reçoit ses
   3 nouveautés + la remise, sans achat ni action de sa part. Aujourd'hui la
   reconnaissance ne regarde que les commandes V3 : elle sera étendue aux abonnés V2.
2. **Écran de choix** à la première connexion après l'ouverture (point 3).
3. **Emails** (Systeme.io, textes fournis, envoi manuel par vous) : J−7 annonce,
   J−1 rappel, J0 « la V3 est ouverte », J+3 relance −20 %. Liens courts `ebookstudio.fr/r/…`.
4. **Aucune perte** : projets, livres et exports V2 restent où ils sont ; la V3 est un
   espace en plus, pas un remplacement.

```text
Connexion abonné (après le 1er oct.)
        │
        ▼
 ┌─────────────────────────┐
 │  Où voulez-vous aller ? │
 └───────┬─────────┬───────┘
         │         │
    Ma V2 ◄─── change d'avis ───► V3
 (inchangée)                (3 modules offerts
                             + reste cadenassé −20 %)
```

## 5. Détails techniques

- `src/config/v3Launch.ts` : `V3_LAUNCH_UNLOCKED` devient une valeur de repli ; l'état
  réel vient de `launch_settings.v3_open` via `useLaunchSettings` (aucune migration :
  la clé et la table existent). Nouveau hook `useV3Open()` (ouvert / fermé / inconnu).
- `V3LockedGate` et `V3ContemplationMode` consomment `useV3Open()` au lieu de la
  constante ; état inconnu = attente, jamais de redirection.
- `useV3Entitlement` : ajout de la détection abonné V2 via `subscribers`
  (statut actif ou offre à vie) en plus des plans `v2_*` de `v3_installment_orders`.
  Lecture seule, aucune écriture, aucune modification de schéma ni de RLS.
- Nouvelle page `/v3/bienvenue` (écran de choix) + mémorisation locale du choix
  (`ebookstudio_espace_choisi`) ; `getAuthenticatedHomePath` renvoie cet écran pour un
  abonné quand la V3 est ouverte, sinon `/ebook-planner` comme aujourd'hui.
- `V3PublicLayout` : la redirection actuelle « abonné → V2 » ne s'applique que V3 fermée.
  Ouverte, l'abonné reste dans la V3.
- Modules cadenassés : composant de verrou réutilisable (titre, bénéfice, prix −20 %,
  bouton), branché sur `V2_LEGACY_UNLOCKED_PATHS` déjà défini dans `v2LegacyAccess.ts`.
- `AdminLancementPage` : libellés et aperçu de l'état d'ouverture.
- Aucun changement : paiements, prix, calculs KDP, sécurité, base de données,
  modules V4 (couverture, Version Longue), V2.

## 6. Vérifications

Compte admin : accès complet V2 + V3, interrupteur qui ouvre et referme réellement.
Compte abonné, V3 fermée : arrivée sur la V2 + bannière. V3 ouverte : écran de choix,
V3 avec 3 modules actifs, autres modules cadenassés à −20 %, retour V2 possible.
Visiteur non connecté : pages de vente inchangées. Captures avant/après pour les
deux profils.
