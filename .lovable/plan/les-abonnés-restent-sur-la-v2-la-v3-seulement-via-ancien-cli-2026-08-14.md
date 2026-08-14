# Les abonnés restent sur la V2 — la V3 seulement via « Ancien client V2 »

## Pourquoi ça arrive aujourd'hui

Après connexion, la règle d'aiguillage envoie tout compte non-admin vers `/v3`
(`SUBSCRIBER_HOME_PATH = '/v3'` dans `src/lib/authDestination.ts`). L'abonné se
retrouve donc sur l'accueil V3, où le correcteur de livre et les autres modules
V3 lui sont proposés — alors qu'il doit rester sur sa V2.

## Ce qu'on met en place

1. **Connexion abonné → V2.** Un abonné non-admin arrive sur le générateur V2
   (`/ebook-planner`), jamais sur `/v3`. L'admin continue d'aller sur `/admin`
   et garde l'accès complet V2 + V3.
2. **`/v3` n'est plus une destination abonné.** Si un abonné arrive sur une page
   V3 (ancien lien, favori, email), il est renvoyé sur sa V2, sauf sur la page
   « Ancien client V2 » (`/v3/migration`) qui reste ouverte.
3. **Un seul lien V3 visible pour l'abonné :** « Ancien client V2 » depuis la V2
   (offre -20 % à vie + 3 nouveautés). Aucun autre appel V3, aucune invitation à
   corriger un livre.
4. **Visiteurs non connectés inchangés** : la page de vente `/commander` et les
   pages marketing V3 publiques restent accessibles.

## Détails techniques

- `src/lib/authDestination.ts` : `SUBSCRIBER_HOME_PATH` passe à `/ebook-planner`
  et `getAuthenticatedHomePath` renvoie cette valeur pour les non-admins.
- `src/App.tsx` : les redirections basées sur `homePath` suivent automatiquement ;
  vérification que `/dashboard` et les alias pointent bien vers `/ebook-planner`.
- Nouveau garde léger sur le layout V3 (`V3PublicLayout`) : si l'utilisateur est
  un abonné connecté non-admin et que la route V3 n'est pas `/v3/migration`,
  redirection vers `/ebook-planner`. Statut inconnu = aucune redirection (on
  patiente), pour ne pas rejouer le bug d'éjection.
- Le lien « Ancien client V2 » (`/v3/migration`, déjà présent dans
  `src/data/v3HeaderMenu.ts`) est mis en avant côté V2 pour rester le seul point
  d'entrée V3.
- Aucun changement sur `V3LockedGate` / mode contemplation : ils continuent de
  protéger les modules avant l'ouverture.

## Vérification

Test navigateur : connexion abonné → arrivée sur `/ebook-planner` ; ouverture
directe de `/v3` et `/v3/corriger` → renvoi vers `/ebook-planner` ;
`/v3/migration` accessible ; compte admin → `/admin` avec accès V2 et V3 intacts.
