

## Rapport — Pages et composants encore en thème sombre

Après scan complet, **15 fichiers** utilisent encore les anciennes couleurs sombres (`bg-slate-950`, `bg-slate-900`, `text-white`, etc.) au lieu du thème Amazon KDP clair.

---

### Pages (8 fichiers)

| # | Fichier | Problème |
|---|---------|----------|
| 1 | `src/pages/EmailPreviewPage.tsx` | `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`, tout le contenu en `text-white` |
| 2 | `src/pages/ElementorExportPage.tsx` | `bg-slate-950 text-white`, cartes `bg-slate-900/50`, bordures `border-slate-800` (~20 occurrences) |
| 3 | `src/pages/BlogPage.tsx` | `bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950`, header/footer sombres |
| 4 | `src/pages/UnifiedMarketingDashboard.tsx` | `bg-slate-950 text-white`, cartes `bg-slate-900/60` |
| 5 | `src/pages/HierarchyPage.tsx` | Boutons `bg-blue-600 text-white` hardcodés (pas le fond, mais incohérent) |
| 6 | `src/pages/FormationVideosPage.tsx` | Gradient violet `from-violet-600 to-purple-600` sur le badge (mineur) |
| 7 | `src/pages/Nouveautes2026Page.tsx` | Gradients colorés sur icônes (mineur, acceptable) |
| 8 | `src/pages/SeoCreerEbookIaPage.tsx` | CTA section `bg-gradient-to-r from-primary to-accent text-white` (acceptable) |

### Composants (7 fichiers)

| # | Fichier | Problème |
|---|---------|----------|
| 9 | `src/components/blog/BlogArticleTemplate.tsx` | `from-slate-950 via-slate-900 to-slate-950`, header/footer sombres |
| 10 | `src/components/ebook/EbookMarketing.tsx` | 5 cartes `bg-slate-900/80` avec bordures colorées, `text-white` |
| 11 | `src/components/ebook/EbookCoverGenerator.tsx` | Hero `from-slate-900 via-purple-900`, textarea `bg-slate-900` |
| 12 | `src/components/ebook/WorkflowDashboard.tsx` | Cartes `bg-slate-900/80`, `bg-slate-900/60` |
| 13 | `src/components/ebook/WorkflowOnboarding.tsx` | `from-slate-900 via-slate-900/95 to-amber-950/20` |
| 14 | `src/components/onboarding/OnboardingGuide.tsx` | Dialog `bg-slate-900 text-white` |
| 15 | `src/components/admin/SubscriberActivityPopup.tsx` | Popup `bg-slate-900 border-violet-500/30` |

---

### Plan de correction

Pour chaque fichier, le travail est identique :
- Remplacer `bg-slate-950`, `bg-slate-900` → `bg-background`, `bg-card`
- Remplacer `text-white` → `text-foreground`, `text-white/60` → `text-muted-foreground`
- Remplacer `border-slate-800` → `border-border`
- Remplacer `border-violet/cyan/emerald-500/30` → `border-primary/20`
- Supprimer les gradients sombres (`from-slate-950 via-slate-900`)

**Priorité** :
1. **Critiques** (pages principales) : `EmailPreviewPage`, `ElementorExportPage`, `UnifiedMarketingDashboard`, `BlogPage` — ce sont des pages entières en noir
2. **Importants** (composants du générateur) : `EbookMarketing`, `WorkflowDashboard`, `EbookCoverGenerator`, `WorkflowOnboarding`
3. **Mineurs** (popups/dialogs) : `OnboardingGuide`, `SubscriberActivityPopup`, `BlogArticleTemplate`

15 fichiers à migrer. Aucun changement de logique, uniquement des classes CSS.

