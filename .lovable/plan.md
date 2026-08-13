# Accès admin fiable avec lien unique

## Objectif
Permettre à Georges d’ouvrir son vrai tableau de bord — celui qui contient **Prospects, V3, Ebook Planner et Livres corrigés** — sans retomber sur la connexion, la commande ou un espace abonné.

## État confirmé
- Le compte `boubetgeorges@gmail.com` possède bien le rôle **admin** dans la base.
- Le tableau demandé est la route `/admin` et elle contient déjà la navigation vers **Prospects** et **V3**.
- La connexion actuelle dépend de plusieurs vérifications asynchrones distinctes (`AuthPage`, état global, `AdminGate`), ce qui peut produire un retour vers `/auth` pendant que la session vient juste d’être créée.
- La page propose déjà un lien de connexion par email, mais le mot de passe est actuellement présenté en premier.

## Modifications prévues
1. **Faire du lien unique par email l’entrée principale**
   - Préremplir l’adresse administrateur.
   - Afficher en premier un bouton clair « Recevoir mon lien d’accès admin ».
   - Conserver le mot de passe seulement comme solution secondaire.
   - Le lien reste temporaire, personnel et validé par le backend : aucun code admin permanent ou secret stocké dans le navigateur.

2. **Créer un seul contrôle de session et de rôle**
   - Après le clic dans l’email, attendre que la session soit réellement installée.
   - Vérifier l’utilisateur avec le backend puis son rôle `admin` avec `has_role`.
   - Partager cette même logique entre la page de connexion et `AdminGate`, au lieu de faire deux contrôles concurrents.

3. **Verrouiller la destination correcte**
   - Une validation réussie mène directement à `/admin` avec remplacement de l’historique.
   - Un admin déjà connecté qui ouvre `/auth`, `/`, `/commander`, `/dashboard` ou `/admin-direct` est renvoyé vers `/admin`.
   - Supprimer tout passage admin par la validation d’abonné et empêcher les anciennes données d’abonné locales de prendre la priorité.

4. **Rendre l’échec compréhensible sans boucle**
   - Distinguer clairement : lien expiré, session absente, mauvais compte et rôle non-admin.
   - Ne jamais rediriger un compte admin vers `/subscription` ou `/commander` après une erreur transitoire.
   - Proposer immédiatement de renvoyer un nouveau lien unique.

5. **Tester le parcours réel complet**
   - Tester le départ sans session depuis `/admin`.
   - Tester le retour du lien email sur `/auth` puis l’arrivée sur `/admin`.
   - Vérifier que le tableau affiche bien les accès **Prospects**, **V3**, **Ebook Planner** et **Livres corrigés**.
   - Tester actualisation, fermeture/réouverture et accès direct à `/commander` avec une session admin.

## Détail technique
Aucun identifiant ni rôle admin ne sera enregistré dans `localStorage`. Le lien unique utilisera l’authentification existante ; l’autorisation restera fondée sur la session validée côté backend et sur la table séparée `user_roles`.
