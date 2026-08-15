# Rétablir définitivement votre Dashboard admin et vos Prospects

## Diagnostic vérifié

- Le compte `boubetgeorges@gmail.com` possède bien le rôle **admin** dans la base.
- Dans une session sans authentification admin active, `/admin` et `/gestion-prospects` renvoient actuellement vers `/auth`, la barre permanente n’apparaît pas, et `/v3` affiche le mode « ouverture le 1er octobre ».
- Le Planner V2 est artificiellement ouvert sur le domaine de prévisualisation même sans session admin. Cela donne accès à une « autre page » V2, mais sans Dashboard ni Prospects, et masque le vrai problème de session.
- La connexion par code abonné redirige encore explicitement vers `/v3`, alors que la règle du projet impose la V2 aux abonnés. Ce chemin concurrent entretient les mauvaises destinations.
- Les pages correctes existent déjà : Dashboard `/admin`, Prospects `/gestion-prospects`, V2 `/ebook-planner`, V3 test `/v3`.

## Correction

### 1. Créer une entrée administrateur unique et sans ambiguïté

- Faire de `/auth` l’unique connexion administrateur.
- Après mot de passe ou lien reçu par email, attendre la restauration effective de la session puis confirmer le rôle côté serveur avant toute navigation.
- Un admin confirmé arrive toujours sur `/admin`, ou sur la page admin demandée initialement comme `/gestion-prospects`.
- Si aucune session admin n’existe réellement, afficher clairement la connexion admin au lieu d’ouvrir une fausse V2 de prévisualisation.

### 2. Supprimer les chemins concurrents qui envoient vers la mauvaise page

- Retirer l’accès V2 automatique accordé uniquement parce que l’application tourne dans la prévisualisation.
- Corriger la connexion abonné pour qu’elle arrive sur `/ebook-planner`, jamais sur `/v3`.
- Garder la règle unique : admin → `/admin`, abonné V2 → `/ebook-planner`, visiteur → `/commander`.
- Aucune erreur temporaire de vérification ne sera transformée en statut visiteur ou abonné.

### 3. Verrouiller les accès administrateur visibles

Dès que le rôle est confirmé, afficher en permanence sur Dashboard, Prospects, Emails, V2 et V3 :

```text
[V2 — Générateur] [V3 — Tester] [Dashboard admin] [Prospects] [Emails]
```

- La barre restera visible sur ordinateur et mobile.
- Le mode « Voir comme un abonné » de la V3 ne pourra pas la masquer.
- Dashboard et Prospects resteront protégés par la validation serveur du rôle.

### 4. Rendre les échecs compréhensibles et récupérables

- Pendant la restauration, conserver un écran de vérification avec **Réessayer** sans redirection commerciale.
- Si la session est réellement absente ou expirée, proposer directement **Connexion admin**.
- Ne jamais utiliser un indicateur local comme autorisation : il peut seulement éviter une mauvaise redirection pendant la revalidation.

### 5. Validation réelle avant de déclarer terminé

1. Se connecter avec le compte administrateur réel.
2. Vérifier `/` → `/admin`.
3. Recharger complètement `/admin`, `/gestion-prospects`, `/apercu-emails`, `/ebook-planner` et `/v3`.
4. Confirmer sur chacune la présence des cinq accès permanents.
5. Confirmer que la V3 admin n’affiche jamais le verrou du 1er octobre.
6. Fermer et rouvrir une nouvelle session navigateur, puis refaire le parcours.
7. Vérifier séparément qu’un abonné arrive bien sur la V2 et ne voit ni Dashboard ni Prospects.

## Détails techniques

- `App.tsx` : retirer le contournement `isPlannerPreviewHost` de la politique d’accès et appliquer la destination centrale.
- `SubscriptionAuth.tsx` : remplacer la redirection forcée `/v3` par la destination abonné V2.
- `AuthPage.tsx` et `AdminAccessContext` : fiabiliser l’hydratation après lien magique/mot de passe et préserver la destination admin demandée.
- `AdminGate` / `AdminQuickNav` : distinguer clairement session absente, vérification temporaire et admin confirmé.
- Ajouter des tests de routage couvrant admin, abonné et visiteur, puis vérifier le parcours réel dans le navigateur.