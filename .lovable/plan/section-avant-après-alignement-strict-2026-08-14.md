# Section Avant / Après — alignement strict

## Problème
Les deux colonnes n'ont pas la même structure : la colonne « Avant » est une liste sur une seule colonne avec des phrases longues, la colonne « Après » est une grille sur deux colonnes avec des titres courts. Résultat : hauteurs différentes, lignes qui ne se font pas face, impression de contenu manquant à droite.

## Ce que je vais faire
1. **Même nombre d'éléments, appariés ligne par ligne** : 16 paires exactement, chaque point « Avant » face à sa solution « Après » correspondante (même index, même sujet).
2. **Même structure visuelle** : les deux colonnes en liste simple sur une colonne (plus de grille 2 colonnes à droite), même taille de police, même interligne, même hauteur de ligne minimale pour que la ligne 1 de gauche soit à la même hauteur que la ligne 1 de droite.
3. **Contenu droit enrichi** : chaque item « Après » passe d'un titre sec à une phrase courte de même longueur visuelle que la gauche (ex. « Couverture KDP professionnelle prête à convertir sur Amazon »), donc autant ou plus de contenu qu'à gauche.
4. **Lisibilité** : couleur blanche forcée sur tous les textes du panneau émeraude (le style global `p, span, li` écrase l'héritage), or pour les puces numérotées.
5. Les deux cartes gardent la même hauteur (`items-stretch`) et le même padding, sur mobile comme sur desktop.

## Détail technique
Un seul fichier modifié : `src/components/v3public/V3BeforeAfterPanel.tsx`.
Remplacement des tableaux `BEFORE` / `AFTER` par un unique tableau `PAIRS` de 16 objets `{ before, after }` pour garantir l'appariement, puis rendu des deux colonnes à partir de cette source unique.
