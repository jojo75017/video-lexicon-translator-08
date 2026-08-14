# Toujours atterrir sur le dashboard admin, jamais sur la vieille page de vente

## Ce que montre le code actuel

Trois endroits décident, chacun de leur côté, que vous êtes un simple visiteur — et vous renvoient vers `/commander` (la page de vente) :

1. **Au démarrage de l'application** (`src/App.tsx`) : si la session n'est pas encore restaurée au moment de la lecture (`getSession()` renvoie vide), le code conclut `isAdmin = false` **et** marque la vérification comme terminée. La racine `/` redirige alors immédiatement vers la page de vente.
2. **Un minuteur de secours de 6 secondes** (`src/App.tsx`) force « vérification terminée » même si le rôle n'est pas encore connu. Résultat : statut « visiteur » par défaut, donc page de vente.
3. **Statut inconnu traité comme refus** (`src/lib/adminAccess.ts`) : quand la vérification ne répond pas (réseau, session en cours de restauration), la fonction renvoie `false`. Le rôle inconnu et le rôle refusé sont confondus.

S'ajoute un effet de bascule : à chaque `TOKEN_REFRESHED` / `INITIAL_SESSION`, l'application appelle `clearAdminCache()`, ce qui **efface un statut admin déjà confirmé** et relance tout le cycle — d'où le retour aléatoire sur la mauvaise page en cours de navigation.

## Correction

### 1. Une seule règle : jamais de redirection sur un statut inconnu
- Distinguer clairement trois états : `inconnu`, `admin`, `pas admin`.
- Tant que l'état est `inconnu`, aucune page ne redirige : on affiche un écran de vérification court.
- Un rôle admin confirmé n'est plus jamais rétrogradé pendant la session, sauf déconnexion explicite.

### 2. Attendre réellement la restauration de session
- Avant de conclure, attendre l'événement de session initiale au lieu de se contenter d'une seule lecture immédiate.
- En cas d'échec de la vérification du rôle, réessayer (2 tentatives espacées) avant de conclure.
- Ne plus effacer le statut admin confirmé sur un simple rafraîchissement de jeton.

### 3. Minuteur de secours qui n'invente rien
- Le minuteur ne transforme plus un statut inconnu en « visiteur ».
- Au bout du délai, si le rôle reste inconnu, afficher un écran clair avec deux sorties directes : **Dashboard admin** (`/admin`) et **V2 — Générateur** (`/ebook-planner`), plus un bouton **Réessayer**.

### 4. Destination d'arrivée verrouillée
- Une fois le rôle admin confirmé, la racine `/` mène toujours à `/admin`.
- `/admin` et `/ebook-planner` ne renvoient plus vers `/commander` sur un statut inconnu : ils patientent puis vérifient.
- La barre d'accès rapide V3 et l'en-tête gardent en permanence **Dashboard admin** et **V2 — Générateur** pour un admin confirmé.

### 5. Vérification réelle avec votre session
1. Ouvrir `/` : arrivée sur `/admin`, sans passage par la page de vente.
2. Recharger `/admin` plusieurs fois : aucune éjection.
3. Naviguer `/admin` → `/v3` → `/ebook-planner` → retour `/admin`.
4. Laisser l'onglet inactif quelques minutes (rafraîchissement de jeton) puis recharger : toujours `/admin`.
5. Vérifier en navigation mobile.

## Détails techniques
- `src/lib/adminAccess.ts` : type de retour `boolean | null` exposé aux appelants (`null` = inconnu), verrou anti-rétrogradation d'un `true` confirmé, `clearAdminCache()` réservé à la déconnexion.
- `src/App.tsx` : `accessState` reste `pending` tant que le rôle est `null` ; suppression de la conclusion « visiteur » par le minuteur ; plus de `clearAdminCache()` sur `TOKEN_REFRESHED`.
- `src/components/auth/AdminGate.tsx` : distinguer `null` (patienter/réessayer) de `false` (rediriger vers `/auth`).
- Aucun droit fondé sur le stockage navigateur : le rôle reste validé côté backend via `has_role`.
- Aucune modification des pages métier, des droits abonnés ni du tunnel de vente.
