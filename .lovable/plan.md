
# Objectif
Mettre en évidence le blog externe **https://ebookstudio.blog/#accueil** (entièrement refait) dans l'app, à plusieurs endroits stratégiques, pour qu'un visiteur/abonné ne puisse pas le rater.

## Où l'afficher

1. **Header V3 publique (`V3Header.tsx`)**
   - Ajouter un lien "Blog" visible dans la barre principale (avec petit badge doré "Nouveau").
   - Ouvre `https://ebookstudio.blog/#accueil` dans un nouvel onglet (`target="_blank" rel="noopener"`).

2. **Barre d'onglets V3 (`V3MainTabs.tsx`)**
   - Remplacer / ajouter l'onglet "Guides" pour pointer vers le blog externe au lieu de `/blog` interne.
   - Icône `BookOpen` + label "Blog" + pastille "Nouveau".

3. **Sidebar V3 (`V3Sidebar.tsx`)**
   - Entrée dédiée "Blog EbookStudio" en haut de la section ressources, style premium (or `#C97A14`).

4. **Accueil `/v3` (hub)**
   - Nouvelle bande éditoriale "Le Blog EbookStudio — nouveaux articles chaque semaine" avec CTA gros bouton doré vers `ebookstudio.blog/#accueil`.
   - Placée juste sous le hero, avant les outils.

5. **Footer V3 (`V3Footer.tsx`)**
   - Colonne "Ressources" : lien Blog en premier.

6. **Page de vente `SalesPageV3Launch.tsx`**
   - Petit encart après la section "storytelling" : "Envie de voir la méthode avant d'acheter ? Lis le blog."

7. **Composant réutilisable `BlogExternalLink.tsx`**
   - Un seul composant partagé (icône + label + badge) pour garantir la cohérence visuelle partout.
   - Constante `BLOG_URL = "https://ebookstudio.blog/#accueil"` centralisée dans `src/data/externalLinks.ts`.

## Choix retenus (par défaut, dis-moi si tu veux changer)

- **Ouverture** : nouvel onglet (le blog est sur un autre domaine, on ne veut pas sortir l'utilisateur de l'app).
- **Style** : ton or `#C97A14` + micro-badge "Nouveau" pour créer l'effet de fraîcheur, cohérent avec l'identité V3.
- **Pas de suppression** : l'ancien `/blog` interne reste en place pour ne rien casser SEO, mais tous les liens principaux pointent désormais vers le blog externe refait.

## Livrables

- `src/data/externalLinks.ts` (nouveau).
- `src/components/v3public/BlogExternalLink.tsx` (nouveau, réutilisable).
- Modifs : `V3Header.tsx`, `V3MainTabs.tsx`, `V3Sidebar.tsx`, `V3Footer.tsx`, page d'accueil `/v3`, `SalesPageV3Launch.tsx`.

Aucune logique métier touchée, aucun changement backend.
