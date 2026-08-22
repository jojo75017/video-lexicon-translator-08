# Ne jamais redemander l'email aux prospects qui cliquent depuis nos emails

## Le problème constaté

- Les emails envoyés pointent vers `/r?e=<email>&u=/v3` (relais de suivi), qui redirige vers `/v3?src=email&t=...`.
- Le verrou de lecture (`ReadingGate`) ne déverrouille que si l'URL contient `?email=...` ou si l'email est déjà en localStorage.
- Or la redirection **ne transmet pas l'email** : un prospect connu qui clique depuis notre email voit quand même le verrou et doit retaper son email pour finir de lire la page V3.
- Conséquence : friction inutile au moment précis où le prospect est chaud, et risque d'abandon avant le CTA 47 €.

## La correction (une seule modification)

**`src/pages/RedirectClickPage.tsx`** : lors de la construction de `finalUrl`, ajouter `email=<e>` aux paramètres quand le paramètre `e` est présent.

Résultat : `/v3?src=email&t=offre-47&email=jean@exemple.fr`

Le `ReadingGate` existant fait déjà tout le reste, sans autre changement :
- il détecte `?email=` → pas de verrou, lecture immédiate ;
- il mémorise l'email en localStorage → le prospect ne verra plus jamais le verrou, sur aucune page (`/v3`, `/methode`, fiches) ;
- le suivi du clic (`track-email-click` via sendBeacon) est inchangé.

## Ce qui ne change pas

- **Visiteurs inconnus** (Google, réseaux sociaux, lien direct) : le verrou reste en place — ils lisent le début, laissent leur email, reçoivent le pack 10 niches, puis finissent de lire avec le CTA 47 € à la fin.
- **Vous** : `?apercu=1` continue d'afficher les pages sans verrou pour vos relectures.
- Le suivi des clics, le prix 47 €, `/commander` : inchangés.

## Vérification

Test navigateur sur le vrai parcours : clic simulé `/r?e=test@exemple.fr&u=/v3` → vérifier l'arrivée sur `/v3` **sans verrou**, lecture complète jusqu'au bouton 47 € ; puis visite anonyme de `/v3` → verrou bien présent.
