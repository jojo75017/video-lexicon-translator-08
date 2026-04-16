

# Plan — Mise en conformité des couleurs avec la charte Amazon KDP

## Problème

La charte graphique définit clairement les couleurs du projet :
- **Fond** : `#FAFAFA` (via `bg-background`)
- **Accent principal** : `#008296` teal (via `bg-primary`, `text-primary`)
- **Texte** : `#232F3E` (via `text-foreground`)
- **Hover/Orange** : `#FF9E2D` (via `text-kdp-orange`)
- **Accent profond** : `#005F73` (via `bg-accent`)

Mais **1 233 occurrences** de couleurs Tailwind brutes (`cyan-400`, `emerald-500`, `slate-900`, `amber-500`, `violet-600`, `orange-500`, `blue-600`, `red-500`) sont utilisées dans **31 fichiers** au lieu des variables de la charte. C'est pour ça que les pages paraissent "noir et bleu" au lieu du style Amazon KDP clair et reposant.

## Fichiers concernés (34 fichiers)

### Pages principales
- `src/pages/SalesPage.tsx` (~957 lignes)
- `src/pages/DemoPage.tsx` (~789 lignes)

### 33 composants sales
Tout le dossier `src/components/sales/` :
AuthorQuiz, AuthorShowcase, BeforeAfterSection, CountdownTimer, ExclusiveFlashBanner, ExitIntentPopup, FloatingMobileCta, GuaranteeSection, HeroVideoTeaser, InteractiveDemo, KdpRoiCalculator, KdpTestimonials, LiveActivityNotifications, LiveEbookCounter, LiveViewerCount, PassiveRevenueProof, PriceComparison, ProgressEngagement, RoiCalculator, SalesFaq, ScrollIntentPopup, SocialProofBanner, SocialProofNotifications, SocialProofToast, SpotsCounter, StarTestimonials, StickyCtaBar, SuccessGallery, TonightOutcomes, TrustBadges, UrgencyBanner, VideoTestimonials, WhoIsThisFor

## Table de conversion des couleurs

| Couleur brute Tailwind | → Remplacement charte |
|---|---|
| `cyan-400/500/600` | `primary` (teal #008296) |
| `emerald-400/500/600` | `primary` ou `accent` (#005F73) |
| `slate-900`, `gray-900` | `foreground` (#232F3E) |
| `amber-400/500`, `orange-500` | `kdp-orange` (#FF9E2D) |
| `violet-400/500/600`, `purple-*` | `primary` ou `accent` |
| `red-500` | `destructive` |
| `blue-*` | `primary` |
| `from-cyan-* to-emerald-*` | `from-primary to-accent` |
| `from-amber-* to-orange-*` | `bg-kdp-orange` ou gradient charter |
| `dark:bg-*`, `dark:text-*` | **Supprimer** (pas de dark mode) |
| `bg-*-900/30` (fonds sombres) | `bg-muted` ou `bg-secondary` |
| `text-*-300/400` (texte clair) | `text-primary` ou `text-foreground` |

## Approche

Traiter fichier par fichier, en remplaçant systématiquement chaque classe Tailwind brute par son équivalent charte. Les gradients `from-cyan-400 via-emerald-400 to-cyan-400` deviennent `from-primary to-accent`. Les classes `dark:*` sont toutes supprimées (la charte est light-only). Les fonds sombres (`bg-emerald-900/30`) deviennent `bg-muted` ou `bg-primary/10`.

## Résultat attendu

Toutes les pages publiques (/offres, /demo) utilisent exclusivement la palette Amazon KDP : fond blanc cassé, accent teal, texte sombre, orange au survol. Plus aucune trace de cyan/emerald/slate/violet brut.

## Fichiers modifiés
- `src/pages/SalesPage.tsx`
- `src/pages/DemoPage.tsx`
- 33 fichiers dans `src/components/sales/`

