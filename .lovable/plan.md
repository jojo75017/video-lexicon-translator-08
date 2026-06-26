# Refonte du Hub V3 — Console pro à onglets

## Objectif
Transformer la page `/hub-v3` (aujourd'hui une longue page qui empile tout : parcours, récap des droits, recherche/filtres par chips, guides, tarifs, comparatif) en une **console professionnelle organisée en onglets clairs**, prête pour le lancement V3 de juillet.

C'est une **réorganisation de présentation**, pas une refonte du moteur ni du contenu.

## Règle absolue (non négociable)
**On ne supprime AUCUN encart image ni aucun visuel.** Tout ce qui est présent aujourd'hui reste présent :
- les bannières illustrées des piliers dans chaque carte module (`PILLAR_IMG` / `pillar-ia.jpg`, `pillar-publier.jpg`, `pillar-monetiser.jpg`, `pillar-marketing.jpg`),
- l'encart « Extension Scanner KDP » (avec son visuel et son badge « Gratuit pour tous »),
- le hero, la barre de stats, les halos/animations ambrés, les illustrations des composants (`CreateBookHub`, `V3GuidesSection`, `V3PricingTiers`, `MaisonEditionTab`, etc.).

Chaque élément visuel est simplement **déplacé dans le bon onglet**, jamais retiré. Vérification finale : comparer la liste des images/encarts avant et après pour garantir 0 perte.

## Constat actuel
La page mélange dans un seul scroll : hero + stats, parcours guidé 30 étapes, récap des droits (197€ vs Pack 347€), barre sticky de recherche + ~12 chips de filtre, grille de modules, guides, tarifs, comparatif V2/V3. Résultat : beaucoup de scroll, hiérarchie peu lisible.

## Nouvelle structure : 6 onglets principaux

```text
┌──────────────────────────────────────────────────────────────┐
│  HUB V3 · Publication Assistée Pro            [Visite guidée]  │
│  Hero + barre de stats (conservés tels quels, visuels inclus) │
├──────────────────────────────────────────────────────────────┤
│ [🚀 Parcours] [🛠️ Outils] [📚 Mes livres] [🎓 Guides]        │
│ [💎 Offres & Packs] [🗺️ Roadmap]                              │
├──────────────────────────────────────────────────────────────┤
│  Contenu de l'onglet actif                                    │
└──────────────────────────────────────────────────────────────┘
```

1. **🚀 Parcours** (par défaut) — parcours guidé 30 étapes (`V3Workflow30`) + bouton « Créer un livre » + l'encart visuel « Extension Scanner KDP » (conservé, mis en tête pour visibilité).
2. **🛠️ Outils** — catalogue de modules : recherche + sous-filtres par pilier (IA, Publier, Monétiser, Marketing, Édition, Distribution, Promotion) + grille de cartes `ModuleCard` **avec leurs bannières images de pilier intactes**. Inclut le sous-filtre « Mes outils ».
3. **📚 Mes livres** — hub de création/sauvegardes (`CreateBookHub`, visuels inclus) + « Mes sauvegardes » + « Image / Couverture ».
4. **🎓 Guides** — guides V3 (`V3GuidesSection`, visuels inclus).
5. **💎 Offres & Packs** — récap des droits (`V3AccessRecap`), paliers tarifaires (`V3PricingTiers`), Maison d'Édition (`MaisonEditionTab`), comparatif V2/V3 (`V2V3Compare`). Tout le volet commercial et ses visuels regroupés.
6. **🗺️ Roadmap** — la roadmap des modules (`V3RoadmapTab`).

## Détails techniques
- Réécriture de `src/pages/V3HubPage.tsx` : remplacer le système de chips `pillar`/`setPillar` qui pilote tout le rendu par un vrai composant à onglets `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` (déjà dans `@/components/ui/tabs`).
- Conserver **intégralement** : la palette « Clair Ambre » (AMBER, CREAM, INK, SERIF…), les animations `v3-rise`, le hero, la barre de stats, **tous les imports d'images** (`pillar-*.jpg`), `ModuleCard` et ses bannières, l'encart Scanner KDP, la `V3ModuleDialog`, la `V3HubTour` et tous les composants déjà importés. Aucune logique interne ni asset modifié.
- L'onglet « Outils » garde la recherche + les filtres par pilier (les chips existants y restent, cantonnés à cet onglet).
- Barre d'onglets **sticky** sous le hero, état actif ambré, responsive (scroll horizontal sur mobile).
- Persistance de l'onglet actif via l'URL (`?tab=`) ou `localStorage`.
- Les boutons du hero (« Créer un livre », « Mes sauvegardes », « Image / Couverture », « Dès 197€ ») pointeront vers le bon onglet au lieu de `setPillar`.
- Aucune modification de base de données, d'edge function ni de `roadmapV3.ts`.

## Hors périmètre
- Pas de changement des prix, des droits ni du contenu des modules.
- Pas de refonte des autres pages (CRM, gestion-prospects).
- Implémentation prévue en juillet — ceci est le plan de cadrage.
