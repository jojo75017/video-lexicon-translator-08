# Verrouiller l'accès admin V2 / V3 pour de bon

## Ce que montre le code aujourd'hui (vérifié)

- Le statut admin existe bien dans un état partagé (`restoring / admin / non-admin / temporary-error`) et un `admin` confirmé ne peut plus être rétrogradé pendant la session.
- Mais ce statut est **uniquement en mémoire** : à chaque rechargement de page, tout repart de `restoring`. Si la vérification du rôle tarde ou échoue (réseau, jeton en cours de rafraîchissement), l'application peut conclure « visiteur » et la racine `/` envoie alors vers `/commander`.
- Plusieurs modules refont **leur propre vérification en parallèle**, hors de l'état partagé : `useV3Mode` (bascule V2/V3 flottante), `useBookPerfectAccess`, `useProBookTier`, `EspaceHeader`. Chacun peut afficher un état différent de la barre admin, ce qui explique les onglets V2/Dashboard qui apparaissent puis disparaissent.
- La V3 dépend en plus d'un drapeau de navigateur « Voir comme un abonné » (`v3_admin_preview_as_subscriber`), qui peut réafficher le message d'ouverture au 1er octobre.
- `App.tsx` conserve un minuteur de sécurité de 8 secondes qui force une décision même si la session n'est pas encore restaurée.

## Correction

### 1. Une seule autorité, mémorisée entre les rechargements
- Le contexte d'accès admin devient la **seule** source pour toute l'application.
- Ajouter un indice persistant « cette session a déjà été confirmée admin » : il ne donne **aucun droit** par lui-même, il sert uniquement à rester en état « vérification en cours » au lieu de conclure « visiteur ». Le rôle reste toujours revalidé côté serveur.
- L'indice est effacé à la déconnexion explicite ou au changement d'utilisateur.

### 2. Supprimer toutes les vérifications concurrentes
- `useV3Mode`, `useBookPerfectAccess`, `useProBookTier` et `EspaceHeader` consomment l'état partagé au lieu d'appeler la vérification eux-mêmes.
- Résultat : la barre admin et la bascule V2/V3 s'affichent ou non de façon strictement identique partout.

### 3. Aucune redirection tant que le statut n'est pas connu
- Retirer la décision forcée après 8 secondes : en cas de lenteur ou d'erreur, rester sur l'écran de vérification avec les boutons **Dashboard admin**, **V2 — Générateur** et **Réessayer**, jamais `/commander`.
- Nouvelle tentative automatique en arrière-plan tant que le statut reste inconnu.

### 4. Destinations verrouillées pour l'admin confirmé
- `/` et `/admin` → vrai Dashboard admin.
- `/ebook-planner` → V2, accès direct.
- `/v3` → V3 en mode admin complet, jamais le mode contemplation.
- `/commander` reste accessible seulement si vous l'ouvrez volontairement.

### 5. Barre d'accès permanente, non désactivable
- `[V2 — Générateur] [V3 — Tester] [Dashboard admin] [Prospects] [Emails]` affichée sur **toutes** les pages internes, ordinateur et mobile.
- Le mode « Voir comme un abonné » n'est plus persisté : il se réinitialise à chaque chargement et ne peut plus masquer les sorties admin ni faire réapparaître le verrou du 1er octobre.

### 6. Tests de non-régression
- Une réponse tardive `false` après un `admin` confirmé est ignorée.
- Une erreur réseau ne produit jamais l'état « visiteur ».
- Rechargement de `/`, `/admin`, `/ebook-planner`, `/v3` : aucun passage par `/commander`.

## Validation avant de déclarer terminé
1. Parcours réel en navigateur avec votre session : `/` → Dashboard, puis V2, puis V3, avec rechargement complet à chaque étape.
2. Vérifier la présence permanente des cinq boutons d'accès.
3. Vérifier qu'une session abonné et une session déconnectée n'obtiennent aucun droit admin.

## Détails techniques
- `AdminAccessContext` : indice de session persistant (non autoritaire), relance automatique, plus de dégradation par minuteur.
- `adminAccess.ts` : conserver la génération de contrôle et l'anti-rétrogradation, exposer l'écriture/lecture de l'indice persistant.
- Remplacer les appels directs à `getIsCurrentSessionAdmin` dans les hooks et en-têtes par `useAdminAccess`.
- `App.tsx` : suppression du minuteur de 8 s, barre admin rendue dès `status === 'admin'`.
- `V3ContemplationMode` / `V3AdminQuickAccess` : aperçu abonné en mémoire uniquement.
- Aucun changement sur les droits abonnés, le tunnel de vente ou les pages métier.
