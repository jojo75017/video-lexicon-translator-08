# Pourquoi seulement 100 prospects visibles (sur 2 020)

## Diagnostic confirmé

- **La base contient bien tout** : 2 014 prospects actifs + 6 inactifs = 2 020 au total (vérifié par requête SQL directe). Rien n'a été perdu.
- **C'est un choix d'affichage, pas une perte de données** : dans `src/pages/ProspectManagerPage.tsx` (ligne 80), la page charge bien tous les prospects, mais n'en **affiche que 100 à la fois** (`PAGE_SIZE = 100`). C'était volontaire : monter 2 000 lignes d'un coup (≈ 34 000 nœuds HTML) faisait planter l'onglet Chrome.
- Le compteur « 100 / 2020 affichés » et les boutons « Afficher plus » / « Tout afficher » existent… mais **uniquement en bas du tableau**, après 100 lignes. Si on ne descend pas tout en bas, on croit qu'il n'y a que 100 prospects.

## Correctif proposé

1. **Compteur visible en haut de la liste** : badge au-dessus du tableau indiquant clairement « 2 014 prospects actifs — 100 affichés », avec le bouton « Tout afficher » directement accessible en haut aussi.
2. **Barre de recherche par email/prénom** pour retrouver un prospect précis sans dérouler 2 000 lignes (recherche instantanée côté navigateur, sans coût serveur).
3. Conserver l'affichage progressif par 100 (nécessaire pour la stabilité du navigateur), simplement rendu évident.

## Détails techniques

- Un seul fichier modifié : `src/pages/ProspectManagerPage.tsx`.
- Aucun changement en base de données, aucun impact sur les campagnes d'emails en cours.
- Les 2 020 prospects restent tous éligibles aux envois : la limite de 100 est purement visuelle.
