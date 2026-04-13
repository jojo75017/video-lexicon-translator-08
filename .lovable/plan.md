

# Diagnostic et Plan de Correction -- Accès EbookPlanner bloqué

## Probleme identifie

Deux problemes distincts empechent l'acces a `/ebook-planner` :

### 1. Timeout de l'authentification (Safety Timer)
Les logs console montrent "Safety timer triggered" a chaque chargement. La verification admin via l'Edge Function `check-admin` prend plus de 8 secondes, ce qui force le timeout. Resultat : `isAdmin = false`, meme si vous etes admin.

### 2. SubscriberGate bloque l'acces
Quand ni `isAdmin` ni `isAuthenticated` ne sont `true`, le `SubscriberGate` redirige vers `/subscription`, qui redirige vers `/auth`. Boucle.

## Cause technique

- L'Edge Function `check-admin` est lente (>8s) probablement a cause du cold start Deno
- Le `SubscriberGate` appelle AUSSI `getIsCurrentSessionAdmin()` en interne (double appel, double attente)
- Le `initAuth` dans App.tsx ne met pas `setIsCheckingAuth(false)` assez vite quand la reponse traine

## Plan de correction

### Etape 1 : Augmenter le safety timer et optimiser initAuth
- Passer le safety timer de 8s a 12s
- Ajouter un `setIsCheckingAuth(false)` immediatement apres la partie subscriber (avant le check admin), pour que les subscribers ne soient pas bloques par le check admin
- Separer la logique : d'abord terminer le check subscriber (rapide, localStorage), puis lancer le check admin en parallele sans bloquer le rendu

### Etape 2 : Optimiser SubscriberGate
- Ajouter un timeout de 5s dans le `SubscriberGate` pour le check `getIsCurrentSessionAdmin()` : si ca depasse, continuer avec la validation subscriber normale au lieu de bloquer
- Eviter le double appel admin quand `isAdmin` est deja passe en prop

### Etape 3 : Ajouter un cache court pour le statut admin
- Apres un check admin reussi dans `App.tsx`, stocker le resultat en memoire (state React, pas localStorage) pour eviter de re-appeler l'Edge Function dans `SubscriberGate`

## Fichiers modifies
- `src/App.tsx` : restructurer initAuth pour ne pas bloquer les subscribers
- `src/components/auth/SubscriberGate.tsx` : ajouter timeout au check admin interne
- `src/lib/adminAccess.ts` : ajouter cache memoire temporaire (30s)

## Detail technique

```text
AVANT:
initAuth() -> check localStorage -> check admin (8s+) -> setIsCheckingAuth(false)
                                     ^^ bloque tout

APRES:
initAuth() -> check localStorage -> setIsCheckingAuth(false) si subscriber OK
                                  -> check admin en parallele (met a jour isAdmin quand pret)
```

