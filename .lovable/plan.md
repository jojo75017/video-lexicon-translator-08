## Objectif

Construire la vraie interface V3 « Intelligence de niche » (inspirée des captures) dans le **cockpit admin**, en **thème clair Amazon KDP**, avec 4 onglets, en réutilisant SCOUT + VIGIE et les 600 niches existantes.

## Aperçu des 4 onglets

```text
┌───────────────────────────────────────────────────────────────┐
│ [✨ Découverte] [👁 Niches cachées] [📈 Prédicteur] [💡 100 idées]│
├───────────────────────────────────────────────────────────────┤
│ contenu de l'onglet actif                                       │
└───────────────────────────────────────────────────────────────┘
```

1. **Découverte intelligente** — champ « Saisissez un sujet, un mot-clé ou un public » + bouton « Découvrez des niches ». Appelle l'edge function existante `scout-analysis` (SCOUT) et affiche la synthèse marché, concurrents, angles, mots-clés, plan d'action.
2. **Niches cachées** — sélection des niches `niches600` à **faible concurrence** et **fort potentiel**, présentées en cartes (titre = niche, sous-titre = mot-clé Amazon + catégorie), triées par potentiel. Pas d'IA, données déterministes.
3. **Prédicteur de tendances** — bloc « Prédicteur de tendances » + bouton « Prédire les niches émergentes » + champ niche. Appelle l'edge function existante `vigie-trends` (VIGIE) et affiche sujets émergents, saisonnalité, recommandations.
4. **Plus de 100 idées** — toutes les `niches600` regroupées **par catégorie** (12 catégories), en grille de cartes avec **titre** (la niche) + **sous-titre** (mot-clé / catégorie). Clic sur une carte → pré-remplit et bascule sur l'onglet « Découverte intelligente » pour lancer l'analyse SCOUT.

## Détails techniques

- **Nouveau composant** `src/components/admin/NicheIntelligence.tsx` : gère les 4 onglets (`Tabs` shadcn), l'état du champ de recherche partagé, et les appels `supabase.functions.invoke('scout-analysis' | 'vigie-trends')`. Réutilise le rendu des résultats déjà présent dans `ScoutAnalysis.tsx` / `VigieTrends.tsx` (on factorise au besoin, sinon on intègre des sous-vues légères).
- **Données** : import direct de `niches600` et `niches600Categories` depuis `src/data/niches600.ts`. Onglet « Niches cachées » = filtre `concurrence === 'Faible'` trié par `potentiel` décroissant. Onglet « 100 idées » = `groupBy(category)`.
- **Thème** : composants shadcn (`Card`, `Tabs`, `Input`, `Button`, `Badge`) avec tokens clairs existants (teal `#008296`, hover `#FF9E2D`, fond clair) — pas de fond sombre.
- **Intégration cockpit** `src/pages/AdminCockpitPage.tsx` :
  - import `NicheIntelligence`.
  - nouveau module dans `src/data/roadmapV3.ts` : `{ id: 'niche-intelligence', pillar: 'ia', status: 'in_progress', title: 'INTEL — Intelligence de Niche', description: '4 onglets : découverte IA, niches cachées, prédicteur de tendances, 100+ idées par catégorie.' }`.
  - ajouter `'niche-intelligence'` à la liste `clickable`, à la classe `DialogContent` (large, scroll), et un `case` de rendu qui affiche `<NicheIntelligence />`.
- **Pas de changement backend** : SCOUT (`scout-analysis`) et VIGIE (`vigie-trends`) sont déjà déployés et testés.

## Validation

- Ouvrir le module depuis le cockpit, vérifier le passage entre les 4 onglets.
- Tester « Découvrez des niches » (SCOUT) et « Prédire les niches émergentes » (VIGIE) via la preview.
- Vérifier le regroupement par catégorie et le clic d'une carte « 100 idées » qui pré-remplit la découverte.
