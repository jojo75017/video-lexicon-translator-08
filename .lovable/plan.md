# Brand Book Premium — EbookStudio Publisher Suite

Ouvrage fondateur d'environ **120 pages** (densité premium, pas de remplissage), livré en **PDF mis en page** ET **DOCX éditable**, palette **Hub V3**, contenu mêlant **fonctionnalités réelles + récit de marque premium**, **visuels IA inclus**, et **accessible directement depuis le Hub V3** via un lien de téléchargement soigné.

## Identité visuelle (palette Hub V3 « Clair Ambre »)

```text
Ambre principal    #E8951E     Ambre profond   #C97A14
Ambre doux         #FFF3DF     Crème           #FBF6EC
Encre chaude       #2A2118     Vert éditorial  #0B6E4C / #0F8A5F
```

- Titres : **Instrument Serif** · Corps : **Inter**.
- Style Apple / Figma / Notion / Stripe / Linear : blancs généreux, filets ambre fins, encadrés teintés, numérotation soignée, pieds de page discrets.

## Visuels générés (IA)

- 1 **couverture** pleine page (livre ouvert + plume, ambiance ambre/crème premium).
- **7 ouvertures de partie** (une ambiance par partie).
- 2-3 **illustrations conceptuelles** (écosystème produit, pipeline d'agents).
- Captures d'interface = **marqueurs de placement détaillés** `[Capture —…]` (pas d'UI factice).

## Structure

Front Matter (couverture, copyright, préface, lettre du fondateur, TOC) · **I Vision** · **II Le Produit** (Workspace, Publisher, AI Studio, Prompt Studio, Media Studio, Library, Dashboard, Marketplace) · **III Les Agents IA** (Mission, Compétences, Personnalité, Workflow, Prompt, Cas d'usage) · **IV Design System** · **V Product Blueprint** · **VI Prompt Studio** · **VII Vision Future** · Back Matter (glossaire, bibliographie, index, versions, à propos).

## Règles de rédaction (chaque chapitre)

Ouverture par **citation** · **intro** par partie · **conclusion** par chapitre · encadrés **Principes fondateurs / Bonnes pratiques / Note UX / Note UI / Conseil produit / Recommandation de conception** · exemples, schémas textuels, marqueurs `[Illustration —…]` / `[Capture —…]` · hiérarchie stricte **H1/H2/H3**, ton premium, paragraphes courts.

## Accès depuis le Hub V3 (nouvel élément app)

- Ajout d'une **carte / bouton « Brand Book » élégant** dans `V3HubPage.tsx` (cohérent avec la charte Clair Ambre : fond crème, filet ambre, icône livre, micro-animation au survol).
- Le bouton propose le **téléchargement direct du PDF** (et un lien secondaire DOCX), sans que l'utilisateur ait à chercher le fichier.
- Les fichiers finaux sont **uploadés en assets Lovable (CDN)** ; le Hub référence ces URLs stables via des pointeurs `.asset.json`.
- Emplacement : bloc dédié dans l'onglet approprié du Hub (visible et valorisé), design « très beau à regarder » aligné sur les cartes existantes.

## Production (phase build)

1. **Ancrage projet** : lecture du pipeline P1-P15, piliers/outils du Hub, `roadmapV3.ts`, `v3Launch.ts`.
2. **Rédaction** FR complète en Markdown maître (~120 pages).
3. **Génération des visuels** IA.
4. **DOCX** (`docx` JS) : styles Instrument Serif / Inter, couverture image, TOC, encadrés colorés, citations en exergue, pieds de page numérotés.
5. **PDF** : conversion soignée depuis le DOCX (LibreOffice), charte conservée.
6. **QA visuelle obligatoire** : chaque page en image, inspection (débordements, contrastes, encadrés, pagination), corrections, re-vérification.
7. **Upload assets CDN** + **ajout du bloc de téléchargement dans le Hub V3**, puis vérification build.
8. **Livraison** dans `/mnt/documents/` : `EbookStudio-Brand-Book.pdf`, `EbookStudio-Brand-Book.docx`.

Seule modification app : le bloc « Brand Book » dans le Hub V3 (frontend/présentation).