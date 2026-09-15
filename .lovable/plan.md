# Rendre visibles « Livres spéciaux » et « Forfaits » dans la barre d'onglets V3

## Diagnostic (mesuré)

La barre d'onglets est limitée à 1280 px de large (`max-w-7xl`), quelle que soit la taille de l'écran.
Après déduction du bouton « Tous les outils », il reste **1067 px** pour les onglets, alors que leur
largeur totale est de **1321 px**. Il manque donc **254 px en permanence** — c'est pourquoi
« Livres spéciaux » (148 px) et « Forfaits » (104 px) sont toujours cachés, même sur grand écran.

Largeurs mesurées des onglets :

```text
Accueil 116 | Offre V3 · 1er oct. 176 | UPSELLS + badge 242
Créer 92 | Écrire 101 | Habiller 107 | Publier 101 | Vendre 100
Livres spéciaux 148 | Forfaits 104        ← invisibles aujourd'hui
```

## Ce qui sera fait (affichage uniquement)

1. **Élargir uniquement la barre d'onglets** de 1280 à 1440 px (le contenu des pages reste à 1280 px).
   Gain : ~160 px.
2. **Compacter le badge UPSELLS** : « 6 compléments » devient « 6 » (le détail reste sur la page /v3/upsells).
   Gain : ~90 px.
3. **Réduire légèrement l'espacement** des onglets de catégories (marges internes un peu plus petites,
   texte 13 px au lieu de 13,5 px). Gain : ~60 px.
4. Total gagné : ~310 px, soit plus que les 254 px manquants → **les 7 catégories et tous les boutons
   sont visibles d'un coup d'œil à partir de 1280 px de large d'écran**, sans aucun défilement.
5. Le défilement doux reste en place en secours pour les écrans plus petits que 1280 px (tablettes),
   et le menu « Catégories » mobile ne change pas.

## Ce qui ne change PAS

- Aucun libellé de catégorie, aucun lien, aucune route.
- Pas de changement de prix, de paiement, de base de données ni de sécurité.
- Le style visuel (couleurs, panneaux déroulants, badge « Nouveau ») reste identique.

## Vérification

- Compilation TypeScript + tests de l'en-tête.
- Captures navigateur à 1280, 1440 et 1587 px : compter visuellement que
  Accueil, Offre V3, UPSELLS, Créer, Écrire, Habiller, Publier, Vendre,
  **Livres spéciaux, Forfaits** et Tous les outils sont tous visibles.
