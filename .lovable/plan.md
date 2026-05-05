## Problème actuel

L'onglet **Tableau de bord** (`workflow-dashboard`) empile **3 gros composants** l'un sous l'autre :
1. `EbookHeroDashboard` (hero + best-sellers + 3 prochaines étapes)
2. `EbookProgressDashboard` (statistiques techniques)
3. `WorkflowDashboard` (autre vue workflow)

→ Résultat : redondance, pas de hiérarchie, on ne sait plus où cliquer. De plus :
- Les **outils image** (Couverture IA, Éditeur de couverture, 4ème de couverture) ne sont pas mis en avant alors que ce sont des étapes clés.
- Aucune **feuille de route post-publication** (que faire après l'export KDP : marketing, audiobook, série, etc.).

## Solution : un parcours linéaire "A → Z" en 5 phases

Remplacer l'empilement actuel par **un seul composant `EbookJourneyDashboard`** qui présente un parcours visuel clair, avec une seule timeline verticale colorée. Chaque phase = une carte cliquable avec son statut (✓ fait / 🟡 en cours / ⚪ à faire), durée estimée et CTA direct vers l'onglet.

### Les 5 phases

```text
┌─ PHASE 1 — PRÉPARATION ──────────────────────┐
│  • Idée & niche (→ /ebook-ideas)             │
│  • Titre, sous-titre, audience (→ planner)   │
│  • Plan détaillé des chapitres (→ planner)   │
└──────────────────────────────────────────────┘
            ▼
┌─ PHASE 2 — RÉDACTION ────────────────────────┐
│  • Workflow IA 15 Agents (→ complete-workflow)│
│  • Rédaction manuelle (→ writing)            │
│  • Préface & conclusion                      │
└──────────────────────────────────────────────┘
            ▼
┌─ PHASE 3 — VISUELS (mise en avant ++) ───────┐
│  🎨 Couverture IA (→ cover)                  │
│  🎨 Éditeur de couverture (→ cover-design-editor) │
│  🎨 4ème de couverture (→ backcover)         │
└──────────────────────────────────────────────┘
            ▼
┌─ PHASE 4 — PUBLICATION KDP ──────────────────┐
│  • Description & mots-clés KDP (→ kdp)       │
│  • Checklist pré-publication                 │
│  • Export PDF/EPUB (→ export)                │
└──────────────────────────────────────────────┘
            ▼
┌─ PHASE 5 — APRÈS PUBLICATION (NOUVEAU) ──────┐
│  • Plan marketing (→ marketing)              │
│  • Audiobook express (→ audio-express)       │
│  • Série / tomes (→ series)                  │
│  • Affiliation & nurture (→ launch-plan)     │
│  • Communauté / forum                        │
└──────────────────────────────────────────────┘
```

### Détails visuels

- **Header compact** : titre du projet, % global de progression, badge phase actuelle, CTA principal "Continuer là où je m'étais arrêté" (calcul de l'étape la + avancée mais pas finie).
- **Timeline verticale** avec ligne dégradée teal→orange (palette KDP). Chaque phase = carte large pliable/dépliable.
- **Phase active** : déployée par défaut, halo orange, pulse léger.
- **Phases terminées** : compactées, check vert, cliquables pour revenir.
- **Phase 3 (Visuels)** : 3 sous-cartes côte à côte avec mini-aperçu coloré et bouton "Ouvrir" → corrige le manque de liens vers les prompts image.
- **Phase 5** : entièrement nouvelle, expose enfin les outils post-KDP qui sont aujourd'hui invisibles depuis le dashboard.

### Section secondaire conservée

Sous la timeline, garder en accordéon replié par défaut :
- "Statistiques détaillées" (réutilise `EbookProgressDashboard`)
- "Inspirations best-sellers" (carrousel actuel du Hero)

→ L'utilisateur les ouvre s'il en a besoin, sans polluer la vue principale.

## Fichiers

**Créer**
- `src/components/ebook/EbookJourneyDashboard.tsx` — nouveau composant timeline 5 phases
- `src/components/ebook/journey/PhaseCard.tsx` — carte de phase réutilisable
- `src/data/ebookJourneySteps.ts` — définition des 5 phases, leurs étapes, l'onglet cible et la fonction de détection "fait / en cours / à faire" basée sur l'état réel du projet (chapitres remplis, kdpDescription présent, coverConcepts généré, etc.)

**Modifier**
- `src/pages/EbookPlannerPage.tsx` (case `workflow-dashboard`, lignes 1325-1394) :
  - Remplacer l'empilement Hero + Progress + Workflow par `<EbookJourneyDashboard …/>` + 2 sections accordéon (Stats détaillées + Inspirations).
  - Garder toutes les props/callbacks existants (`onNavigateToTab`, `onStartAutoWorkflow`, `onApplyExample`).

**Supprimer (utilisation)**
- `EbookHeroDashboard` et `WorkflowDashboard` ne sont plus rendus dans `workflow-dashboard` (les fichiers restent en cas de réutilisation ailleurs ; à confirmer ensuite).

## Règles respectées

- Aucune fausse statistique, aucun `Math.random` (mémoire core).
- Palette Amazon KDP : `#FAFAFA`, `#008296`, `#FF9E2D`, `#232F3E`.
- Aucune nouvelle dépendance.
- Pas de modification de `client.ts`, `types.ts`, `supabase/config.toml`.
- Pas de refonte du monolithe `EbookPlannerPage` au-delà du case `workflow-dashboard` (mémoire `refactoring-monolithe-ebook-planner`).
