# Plan — Refonte du /blog avec guides illustrés (SEO public)

## Objectif
Transformer la page `/blog` (cartes à dégradé + icône) en blog de guides illustrés inspiré des captures de référence : grande illustration en haut de carte, badge catégorie en pastille orange clair, titre serif foncé, ligne auteur + date. Ajouter de nouveaux guides SEO complets pour attirer du trafic Google.

## Décisions validées
- **Auteur affiché : Georges Boubet** (sur toutes les cartes et en-têtes d'articles).
- **Images : illustrations IA 100% originales** — inspiration du style général (ton orangé KDP, ambiance auteur/édition), mais **aucune copie** des images des captures. Compositions, cadrages et sujets différents pour éviter tout plagiat.

## Ce qui change

### 1. Design des cartes (BlogPage.tsx)
- Remplacer le bloc dégradé + icône par une **illustration originale** (ratio ~16:10), badge catégorie en pastille arrondie par-dessus.
- Grille responsive 2/3 colonnes, hover léger (scale + ombre), titre serif foncé, ligne « Georges Boubet · date » sous le titre.
- Charte KDP via tokens sémantiques : fond #FAFAFA, accent teal #008296, texte #232F3E, hover #FF9E2D (pas de couleurs en dur).
- Conserver la bannière magazine ebookstudio.blog et le footer.

### 2. Données enrichies (blogArticles.ts + liste BlogPage)
- Ajout des champs `image` (illustration importée) et `author` à `BlogArticle`.
- Catégories alignées : `Auto-édition`, `Ebook & IA`, `Amazon KDP`, `Marketing`, `Site web d'auteur`.
- Fusion vers une seule source de vérité pour les cartes.

### 3. Nouveaux guides SEO (proposition éditable)
8 guides à fort potentiel KDP, chacun = article markdown complet + FAQ + table des matières + illustration IA originale :

```text
1. Auto-édition Amazon KDP : combien gagne un auteur (et par livre) ?   [Auto-édition]
2. 6 outils IA pour écrire un livre (gratuit et payant)                 [Ebook & IA]
3. 7 mots-clés Amazon KDP : comment les utiliser correctement          [Amazon KDP]
4. Fermeture / suspension de compte Amazon KDP : que faire ?            [Amazon KDP]
5. KDP Select : mon avis tranché sur la question                       [Amazon KDP]
6. Comment rédiger une biographie d'auteur (+ modèles)                  [Auto-édition]
7. Comment créer un site web d'auteur en 45 minutes                     [Site web d'auteur]
8. Gagner de l'argent avec les ebooks : stratégies rentables           [Marketing]
```

### 4. Illustrations IA (originales)
- Une illustration par guide, générée via l'outil image, sauvegardée dans `src/assets/blog/`.
- Style : illustration éditoriale premium, palette orangée KDP cohérente, ambiance bureau d'auteur / édition — **sujets et compositions inédits**, jamais des répliques des captures.
- Import ES6 dans la carte et en tête d'article ; image OG par article ; alt text descriptif ; lazy-loading.

### 5. SEO
- Titres <60 car., meta description <160 car., un seul H1 par page, JSON-LD `BlogPosting` enrichi (`image`, `author: Georges Boubet`), canonical, alt text, lazy-loading.

## Détails techniques
- `BlogArticle` (blogArticles.ts) : ajout `image: string` et `author: string`.
- Le tableau `articles` local de `BlogPage.tsx` est aligné sur `blogArticles.ts`.
- `BlogArticleTemplate.tsx` : ajout illustration d'en-tête + ligne auteur/date.
- Aucune dépendance nouvelle ; aucune logique backend.