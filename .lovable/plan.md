# Accès administrateur unique, sans retour vers la vente

## Objectif
Après toute connexion avec le compte administrateur, ouvrir systématiquement le vrai tableau de bord `/admin`. La page V3 reste accessible depuis ce tableau et Ebook Planner V2 reste disponible pour travailler, mais aucune vérification transitoire ne doit envoyer l’administrateur vers `/commander` ou une autre page de vente.

## État confirmé
- La connexion admin principale dans `AuthPage` vérifie bien le rôle puis vise `/admin`.
- La route racine `/` attend désormais la première vérification de session avant de choisir sa destination.
- Des parcours contradictoires subsistent : le bouton admin de la connexion abonné vise `/dashboard`, tandis que `/dashboard` redirige sans condition vers `/ebook-planner`.
- La connexion `/v3/auth` envoie tous les comptes vers `/v3/library` sans vérifier si le compte est administrateur.
- Les routes V3 verrouillées peuvent envoyer un rôle non encore détecté vers `/v3/offre`, qui mène ensuite au tunnel de vente.
- Le logo Ebookstudio du bandeau V3 pointe déjà vers `/v3` ; il ne pointe pas vers la vente.

## Modifications prévues
1. **Créer une seule décision de destination après authentification**
   - Session admin validée → `/admin`.
   - Abonné validé → `/v3`.
   - Visiteur sans session → page publique appropriée.
   - Réutiliser cette décision dans la racine, les deux formulaires de connexion et les anciens alias.

2. **Supprimer les destinations admin contradictoires**
   - Corriger le bouton d’accès admin de la connexion abonné pour viser `/admin`, jamais `/dashboard`.
   - Rendre `/dashboard`, `/espace`, `/tableau-de-bord` et les anciens accès intelligents : admin vers `/admin`, abonné vers `/v3`.
   - Conserver `/ebook-planner` comme route V2 explicite et accessible depuis son bouton « Basculer V2 », sans en faire la destination automatique de l’admin.

3. **Fiabiliser la connexion V3 et la restauration de session**
   - Après une connexion sur `/v3/auth`, attendre l’installation réelle de la session.
   - Vérifier immédiatement le rôle côté backend.
   - Envoyer l’admin vers `/admin` et l’abonné vers `/v3`, au lieu d’envoyer tout le monde vers la bibliothèque.
   - Pendant cette vérification, afficher un chargement neutre et ne déclencher aucune redirection commerciale.

4. **Empêcher les garde-fous V3 d’envoyer un admin vers la vente**
   - Distinguer « vérification en cours » de « utilisateur réellement non autorisé ».
   - Attendre la résolution de la session et du rôle avant l’évaluation du verrou V3.
   - En cas d’échec ou de session absente, revenir à la connexion avec la destination mémorisée ; ne jamais utiliser `/v3/offre` ou `/commander` comme solution à une erreur d’authentification admin.

5. **Nettoyer les chemins hérités sans supprimer Ebook Planner**
   - Retirer les anciens drapeaux locaux qui influencent encore la navigation admin.
   - Garder les données locales abonné uniquement pour le parcours abonné ; elles ne décideront jamais du rôle admin.
   - Maintenir un accès visible à Ebook Planner V2 depuis `/admin` et depuis le bouton V2 de la V3.

6. **Vérifier le parcours réel complet**
   - Sans session : `/admin` → connexion admin.
   - Connexion par mot de passe et par lien email → `/admin`.
   - Admin connecté ouvrant `/`, `/dashboard`, `/espace`, `/tableau-de-bord`, `/v3/auth` ou une route V3 verrouillée → jamais de page de vente.
   - Depuis `/admin` : ouverture de la V3 puis d’Ebook Planner V2, avec retour fiable au tableau admin.
   - Actualisation et nouvelle ouverture du navigateur : maintien de la bonne destination.

## Détail technique
- Centraliser la résolution `pending | admin | subscriber | visitor` au lieu de combiner plusieurs booléens indépendants.
- L’autorisation admin restera fondée sur `auth.getUser()` et la fonction backend `has_role` ; aucun rôle ne sera accordé par `localStorage` ou `sessionStorage`.
- Ajouter des tests ciblés de résolution des destinations, puis exécuter le parcours avec une vraie session administrateur dans le navigateur.