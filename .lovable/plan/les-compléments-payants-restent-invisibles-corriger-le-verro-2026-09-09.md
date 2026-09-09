# Les compléments payants restent invisibles : corriger le verrou d'avant-lancement

## Ce qui se passe réellement

Le verrouillage des compléments (grisé + prix + bouton « Débloquer ») a bien été posé sur les pages concernées, mais il ne s'affiche jamais, parce qu'un **premier verrou plus ancien passe devant** :

- L'interrupteur de lancement V3 est encore sur « fermé » (ouverture prévue le 1er octobre).
- Tant qu'il est fermé, chaque page V3 affiche soit la carte « module réservé aux formules payantes / offre −20 % », soit renvoie vers la page de connexion.
- Résultat : l'abonné ne voit ni l'outil grisé, ni le prix, ni le bouton d'achat — exactement ce que vous constatez sur la page Données KDP.

Il existe aussi un second verrou (essai gratuit 7 jours) qui affiche « réservé aux abonnés » à la place de l'outil.

## Ce que je propose de changer

Sur les pages qui correspondent à un complément payant, l'ordre des verrous est inversé : c'est **l'encart d'achat qui gagne**.

```text
Aujourd'hui :  page → verrou lancement → (rien à voir)
Après :        page → est-ce un complément payant ?
                       oui → aperçu grisé + prix + « Débloquer »
                       non → verrou lancement inchangé
```

Concrètement, pour un abonné connecté qui ouvre un complément non acheté :
- il voit l'outil en aperçu grisé, inactif ;
- il voit le titre, la promesse en une phrase et le prix ;
- le bouton « Débloquer — 27 € / 47 € » ouvre réellement le paiement ;
- après paiement, l'outil s'ouvre pour lui.

Les personnes non connectées continuent d'être invitées à se connecter. Vous (admin) et les clients du forfait Édition gardent l'accès complet. Les pages incluses dans l'abonnement gardent le comportement d'avant-lancement actuel.

## Question de fond à confirmer

L'affichage grisé + bouton d'achat ne sert à rien si personne ne peut acheter avant le 1er octobre. Deux possibilités :
- **A.** On affiche dès maintenant l'aperçu grisé et l'achat est actif tout de suite (recommandé : ça permet de vendre avant l'ouverture).
- **B.** On affiche l'aperçu grisé mais le bouton indique « en vente le 1er octobre ».

Je partirai sur **A** sauf indication contraire.

## Détails techniques

- `V3ModulePaywall` devient prioritaire : il est monté **au-dessus** de `V3LockedGate` / `TrialGate` dans `App.tsx` pour les routes listées dans `v3ModuleAccess.ts`, ou bien `V3LockedGate` reçoit un indicateur « une route à complément payant délègue au paywall » — la première option évite de modifier la logique de lancement.
- Condition d'affichage du paywall : utilisateur authentifié et sans droit sur le module (`useModuleAccess` inchangé : admin → `hasFull` → `get_my_module_entitlements` filtré par environnement Stripe).
- Sans session : redirection `/v3/auth` conservée telle quelle.
- `TrialGate` n'est plus appliqué aux routes de compléments payants (le paywall couvre déjà le cas), afin d'éviter deux écrans de verrou concurrents.
- Aucun changement de base de données, de RLS, de calculs KDP, de tarifs, ni des fonctions de paiement (`v3-upsell-checkout`, `payments-webhook`, `V3SubscribeCheckout`).
- `V3_LAUNCH_UNLOCKED` et l'interrupteur en base restent inchangés.

## Vérification

- Compte abonné sans achat sur `/v3/donnees-kdp` : aperçu grisé visible, prix visible, « Débloquer » ouvre le paiement.
- Compte admin : accès direct, aucun voile.
- Page V3 non payante (ex. accueil, mes livres) : comportement d'avant-lancement inchangé.
- Visiteur déconnecté : toujours redirigé vers la connexion.
