# Tester le tunnel BD & Jeunesse en tant qu'admin

## Ce que vous pouvez déjà faire aujourd'hui (sans aucune modification)

1. Page de vente : ouvrez `/bd-offre` — c'est la page publique, visible par tous.
2. Page d'upsell : ouvrez `/bd-upsell` (elle s'affiche normalement après paiement, mais l'URL est accessible directement pour la relire).
3. Page de remerciement : `/bd-merci`.
4. Dashboard : `/bd-studio` — en tant qu'admin vous y entrez toujours, sans paiement, avec toutes les options Pro débloquées (le contrôle d'accès accorde l'accès complet aux admins).

Donc pour créer un vrai livre BD dès maintenant : allez sur `/bd-studio`, choisissez un style, générez le scénario puis les cases, et exportez.

## Ce qui manque pour un test réaliste

Deux choses ne sont pas testables en l'état :

- Voir la page verrouillée comme un visiteur non payant : l'admin est toujours autorisé, il est donc impossible de vérifier la redirection vers `/bd-offre`.
- Vérifier que le paiement débloque bien l'accès sans dépenser 17 € réels.

## Ce que je propose d'ajouter

### 1. Bouton « Voir comme un visiteur » pour le Studio BD
Le contrôle d'accès BD respectera l'interrupteur admin déjà existant « Voir comme un abonné » : quand il est activé, l'admin est traité comme un visiteur sans achat et voit exactement le parcours réel (redirection vers la page de vente, écran verrouillé).

### 2. Panneau de test du tunnel dans l'admin
Un petit encart dans l'espace admin avec :
- les 4 liens du tunnel (`/bd-offre`, `/bd-upsell`, `/bd-merci`, `/bd-studio`) ;
- un bouton « M'accorder l'accès 17 € » et « M'accorder l'accès Pro 47 € » qui écrit une entitlement de test pour votre email, pour vérifier le déverrouillage sans paiement ;
- un bouton « Retirer mes accès de test » pour revenir à zéro.

### 3. Test du paiement en mode test
Rappel affiché dans ce panneau : le paiement carte utilise l'environnement Stripe configuré ; en mode test vous pouvez payer avec la carte de test 4242 4242 4242 4242 pour valider tout le parcours de bout en bout, webhook inclus.

## Détails techniques
- `useBdComicAccess` : prendre en compte `isPreviewingAsSubscriber()` pour neutraliser le raccourci admin.
- Nouveau composant admin `BdTunnelTestPanel` ajouté à une page admin existante, appelant une fonction serveur protégée admin qui insère/supprime des lignes `module_entitlements` (`bd-comic`, `bd-comic-pro`) marquées comme test.
- Aucun `npm run build` : uniquement le serveur de dev.
