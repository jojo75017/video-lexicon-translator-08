# Compteur de jours depuis le paiement — page « Mes Abonnés »

## Objectif
Sur la page d'administration « Mes Abonnés » (`/admin`), afficher pour chaque abonné depuis combien de jours il est inscrit (date de paiement → aujourd'hui).

## Ce qui existe aujourd'hui (vérifié)
- La page `/admin` (`src/pages/AdminPage.tsx`) affiche deux tableaux : abonnés **actifs** (lignes 789-844) et abonnés **inactifs** (lignes 860+), avec colonnes Email / Code / Plan / Actions — aucune date affichée.
- Chaque abonné a une date `created_at` en base qui correspond au moment du paiement (vérifié sur les vraies données : les lignes de test de paiement ont bien leur `created_at` au jour du paiement).
- Le composant `SubscribersTable.tsx` existe mais n'est utilisé nulle part — on ne le touche pas.

## Changements
1. **`src/pages/AdminPage.tsx`** — dans le tableau des abonnés actifs et celui des inactifs :
   - Nouvelle colonne « Inscrit depuis » entre « Plan » et « Actions ».
   - Affichage : `X j` en gras + en dessous la date exacte (`depuis le 08/09/2026`) en petit texte gris.
   - Calcul : différence entre aujourd'hui et `created_at`, en jours entiers.
   - Badge coloré discret : vert < 7 jours (« nouveau »), neutre 7-30 j, gris au-delà — pour repérer d'un coup les nouveaux payants.
2. **Petit résumé en haut du tableau actifs** : « X abonnés actifs · ancienneté moyenne : Y jours ».
3. Aucun changement en base de données, aucun changement côté abonné — c'est un affichage admin uniquement.

## Vérification
- Contrôle visuel sur `/admin` : la colonne apparaît avec les bons nombres de jours (comparaison avec les dates réelles en base).
