# Verrouiller définitivement votre vraie page administrateur

## Constat vérifié
- Avec votre session administrateur actuelle, `/` arrive bien sur `/admin`, `/admin` reste ouvert et `/ebook-planner` ouvre la V2.
- Malgré cela, le statut administrateur est encore vérifié séparément dans `App.tsx`, `AdminGate`, les pages de connexion et certains contrôles d’accès.
- Une vérification ancienne peut encore terminer après une vérification récente et republier `false`. Le cache actuel protège certains appels, mais `publish(false)` peut toujours remplacer un `true` déjà confirmé.
- `App.tsx` peut aussi conclure « aucune session » après seulement 600 ms, avant la fin réelle de la restauration de session.
- C’est cette concurrence résiduelle qu’il faut supprimer pour que le problème ne puisse plus revenir de façon aléatoire.

## Correction définitive

### 1. Une seule autorité pour l’accès administrateur
- Créer un état administrateur partagé au niveau principal de l’application : `restauration`, `admin`, `non-admin`, `erreur temporaire`.
- Toutes les routes et interfaces (`/`, `/admin`, `/ebook-planner`, `/v3`) consommeront exactement ce même état.
- Retirer les vérifications concurrentes des composants de garde et des pages qui redemandent indépendamment le rôle.
- Le rôle restera validé par le backend ; aucun droit ne sera accordé depuis le stockage du navigateur.

### 2. Rendre impossible une rétrogradation tardive
- Associer chaque vérification à la session et à une version de contrôle.
- Ignorer tout résultat provenant d’une ancienne session ou d’une ancienne tentative.
- Une fois `admin` confirmé, interdire à un résultat tardif `false`, à une erreur réseau ou à un rafraîchissement de jeton de remplacer ce statut.
- Réinitialiser ce verrou uniquement lors d’une déconnexion explicite ou d’un réel changement d’utilisateur.

### 3. Attendre la restauration complète de la session
- Ne plus conclure « visiteur » après un délai arbitraire de 600 ms.
- Attendre l’initialisation de l’authentification, puis valider l’utilisateur et son rôle côté backend.
- En cas de retard ou d’erreur réseau, rester sur l’écran de vérification avec **Dashboard admin**, **V2 — Générateur** et **Réessayer** ; ne jamais envoyer vers la page de vente.

### 4. Verrouiller les destinations
- `/` avec votre session administrateur mène toujours à `/admin`.
- `/admin` ne peut quitter le dashboard que sur une déconnexion explicite ou un refus de rôle confirmé pour la session courante.
- `/ebook-planner` reste votre vraie V2 et accepte directement l’administrateur confirmé.
- Sur `/v3`, les sorties **Dashboard admin** et **V2 — Générateur** restent visibles, y compris en mode « Voir comme un abonné » et sur mobile.
- `/commander` reste accessible uniquement quand vous l’ouvrez volontairement ; aucune panne ou attente de session ne pourra vous y envoyer.

### 5. Éliminer les doubles décisions de connexion
- Après connexion par mot de passe ou lien email, attendre la confirmation du statut partagé avant toute navigation.
- Faire utiliser la même destination `/admin` à la connexion admin classique, à la connexion directe et à la restauration après rechargement.
- Supprimer les effacements de cache et contrôles locaux susceptibles de relancer une course pendant la connexion.

## Validation obligatoire
1. Tester avec votre session : `/`, `/admin`, `/ebook-planner`, puis `/v3`.
2. Recharger chaque route plusieurs fois et vérifier qu’aucun passage par `/commander`, `/v3/auth` ou `/connexion-abonne` ne se produit.
3. Enchaîner `/admin` → V2 → V3 → Dashboard admin.
4. Activer « Voir comme un abonné » dans la V3 et vérifier que les sorties administrateur restent présentes.
5. Simuler une restauration lente et un rafraîchissement de jeton : le dashboard doit rester verrouillé sur le statut admin confirmé.
6. Tester ordinateur et mobile.
7. Ajouter des tests de régression couvrant le cas critique : une ancienne réponse `false` arrive après une confirmation `true` et doit être ignorée.

## Détails techniques
- Centraliser l’état dans un provider/hook unique alimenté par `src/lib/adminAccess.ts`.
- Faire consommer cet état par `App.tsx`, `AdminGate`, `SubscriberGate`, `AuthPage` et les accès rapides V3, sans nouvelle requête concurrente.
- Ajouter un identifiant de génération/session aux contrôles asynchrones et une règle atomique anti-rétrogradation.
- Ne modifier ni les droits des abonnés, ni les pages métier, ni le tunnel de vente.