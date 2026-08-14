# Audit V3 + accès admin de test (V2 et V3)

## Ce que j'ai vérifié dans le code

- `src/components/v3/V3ContemplationMode.tsx` démarre **verrouillé** (`useState(!V3_LAUNCH_UNLOCKED)`, donc `true`) et ne se déverrouille qu'après la réponse de `getIsCurrentSessionAdmin()`. Tant que cette réponse n'arrive pas, tous vos clics sont interceptés et affichent « La V3 ouvre le 1ᵉʳ octobre 2026 ».
- Ce composant ne réécoute **jamais** l'état d'authentification : si le contrôle admin part avant que la session soit restaurée (le log console « Safety timer triggered – forcing auth check complete » montre que la session met plus de 6 s à se résoudre), le verrou reste actif jusqu'à un rechargement complet.
- `src/lib/adminAccess.ts` ne mémorise pas le résultat positif : chaque composant relance `auth.getUser()` + `has_role`. En cas de lenteur ou d'erreur réseau, la fonction renvoie `false` — c'est-à-dire « pas admin » — sans nouvelle tentative.
- `V3LockedGate` et `useV3Entitlement` utilisent le même contrôle : un `false` transitoire renvoie l'admin vers `/v3/auth` au lieu de la page demandée.
- Aucun élément d'interface n'indique à l'admin qu'il est en mode test, et aucun bouton ne permet de basculer volontairement entre « vue abonné (verrouillée) » et « vue admin (tout ouvert) ».

## Ce que je corrige

### 1. Un seul contrôle admin, fiable et partagé
- `adminAccess.ts` : mémoriser le résultat pour la session en cours, réessayer une fois en cas d'erreur réseau, et invalider au `SIGNED_OUT`.
- Nouveau hook `useIsAdmin` abonné à `onAuthStateChange` : dès que la session est restaurée, le statut admin est recalculé et diffusé à toute l'application (contemplation, `V3LockedGate`, `useV3Entitlement`).

### 2. Plus jamais de verrou pendant le contrôle
- Le mode contemplation reste **neutre pendant la vérification** : aucun clic bloqué, aucun toast, aucune pastille tant que le statut n'est pas connu.
- Le verrou ne s'applique qu'après confirmation explicite « session non admin ».
- `V3LockedGate` affiche un état de chargement au lieu de rediriger quand le statut est encore inconnu.

### 3. Barre de test admin V2 / V3
Une barre visible uniquement pour l'admin, sur toutes les pages V3 :
- Pastille **« Mode admin — test complet V3 »** (remplace la pastille « contemplation » pour vous).
- Bouton **V2 — Générateur** (`/ebook-planner`), **Admin** (`/admin`), **Prospects**, **Emails** — je vérifie que les 4 cibles répondent.
- Interrupteur **« Voir comme un abonné »** : réactive volontairement le mode contemplation pour tester le parcours visiteur, puis le désactive d'un clic.

### 4. Reste de l'audit — points à améliorer trouvés
| Point | Constat | Traitement |
|---|---|---|
| Session lente | Le minuteur de secours de 6 s dans `App.tsx` conclut « vérification terminée » sans statut admin | Le statut admin devient réactif, donc le minuteur ne fige plus l'accès |
| Doublons de contrôle | `App.tsx`, `V3LockedGate`, `useV3Entitlement`, contemplation appellent chacun le contrôle admin | Tous passent par le hook partagé (moins de requêtes, un seul résultat) |
| Sidebar | Deux entrées mènent à `/v3/compte` (« Mon compte » et « Mon abonnement ») | Fusion en une seule entrée |
| Correcteur | Le rapport de correction n'est pas exportable | Ajout d'un bouton « Copier le rapport d'édition » (passes, typographie, latin restant, fins de chapitre) |

## Détails techniques
- Fichiers touchés : `src/lib/adminAccess.ts`, `src/hooks/useIsAdmin.ts` (nouveau), `src/hooks/useV3Entitlement.ts`, `src/components/v3/V3ContemplationMode.tsx`, `src/components/v3/V3LockedGate.tsx`, `src/components/v3public/V3AdminQuickAccess.tsx`, `src/components/v3public/V3Sidebar.tsx`, `src/pages/v3public/V3CorrecteurPage.tsx`.
- `V3_LAUNCH_UNLOCKED` reste à `false` : l'ouverture publique demeure au 1ᵉʳ octobre 2026, seul votre accès admin est réparé.
- Aucune modification de base de données ni de fonction serveur.
- Vérification finale avec une session admin réelle : `/v3`, `/v3/corriger`, `/v3/avis`, `/v3/fonctionnalites`, `/ebook-planner` et `/admin` doivent s'ouvrir sans toast de verrouillage.
