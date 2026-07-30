## Objectif

Trois corrections sur l'accueil V3 et la barre latérale.

## 1. Image et textes en pleine largeur, juste au-dessus de la fiche du livre

Aujourd'hui, `V3HomePage.tsx` affiche la fiche du livre (`V3BriefRecap`) puis, en dessous, un héros en deux colonnes (texte à gauche, image verticale 4/5 à droite).

- Le héros passe **au-dessus** de la fiche du livre (juste avant `<V3BriefRecap />`).
- Il devient un **bandeau pleine largeur** : image `home-hero.jpg` en fond sur toute la largeur de l'écran (hauteur maîtrisée, ~420 px mobile / ~520 px desktop, `object-cover`), voile dégradé émeraude pour la lisibilité.
- Les textes passent **par-dessus l'image, centrés et pleine largeur** : la puce « Atelier d'écriture premium », le titre « Publiez le livre que vous avez en vous. », le paragraphe de présentation, la preuve sociale (avatars + 5 étoiles + « Rejoignez les 1 247 auteurs ») et la citation « Le problème n'est pas d'écrire… ».
- Le filet doré (`v3-gold-rule`) reste sous le bandeau, comme séparateur avant la fiche.

## 2. Suppression du champ « Écrire » (double emploi)

Le champ « idée » avec son bouton **Écrire** disparaît complètement du héros : la fiche du livre juste en dessous contient déjà titre, synopsis et le bouton « Lancer le workflow ». Les éléments devenus inutiles (état `idea`, rotation des exemples d'idées, fonction d'envoi) sont retirés du composant.

## 3. Barre latérale : « Écrire un livre » juste sous « Studio Recherche KDP »

Dans `V3Sidebar.tsx`, l'entrée de création (`/v3/create`, aujourd'hui « Créer un livre », première ligne de la section « Mon espace ») est déplacée en **2ᵉ position de la section « Recherche KDP »**, directement sous « Studio Recherche KDP », et renommée **« Écrire un livre »** avec une pastille de mise en avant. Aucun doublon : elle est retirée de « Mon espace », qui commence alors par « Accueil V3 ».

## Détails techniques

- `src/pages/v3public/V3HomePage.tsx` : héros réécrit en bandeau pleine largeur avec image de fond et contenu superposé, remonté avant `V3BriefRecap`, suppression du bloc champ idée et du code associé (`idea`, `phIdx`, `IDEA_EXAMPLES`, `submitIdea`, icône `Feather`).
- `src/components/v3public/V3Sidebar.tsx` : déplacement/renommage de l'entrée `/v3/create`.
- Aucun changement de logique métier, de tarifs ni de base de données.
