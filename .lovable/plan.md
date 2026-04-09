

## Problème identifié

Les modifications précédentes ont nettoyé :
- ✅ `modernSidebarSections.ts` (groupes d'onglets)
- ✅ `TrelloBoardColumns.ts` (colonnes Trello)
- ✅ `EbookPlannerPage.tsx` (switch cases)

Mais **le fichier principal `ModernSidebar.tsx` contient encore les ~127 items** dans le tableau `allToolGroups` (lignes 68-248). C'est ce tableau qui génère tous les éléments du menu latéral. Les sections ne font que regrouper — les items restent tous visibles.

## Plan

### 1. Nettoyer `allToolGroups` dans `ModernSidebar.tsx`

Réécrire le tableau `allToolGroups` (lignes 68-248) pour ne garder que les ~35 outils fonctionnels :

**🤖 Workflow IA** (17 items) : workflow-dashboard, complete-workflow, P1-P15

**✍️ Écriture** (9 items) : planner, writing, aichat, characters, series, doc-transform, url-import, templates, strict-proofread

**📦 Publier** (10 items) : export, workflow-export, calibre-epub, cover-design-editor, cover, backcover, kdp, kdp-prepublish-checklist, audiobook, audio-express

**📣 Vendre** (2 items) : marketing, launch-plan

**⚙️ Mon Compte** (6 items) : projects, ebook-library, subscription, settings, admin, admin-panel

### Items supprimés (~90 items)

Tous les simulateurs fictifs (kdp-analytics, revenue-simulator, amazon-ads, bsr-tracker, competitor-spy, etc.), les générateurs de niches (recipe-book, coloring-book, travel-guide, etc.), les doublons (rich-editor, draft-mode, focus-mode, humanizer, ai-detector, etc.), les gadgets (video-trailer, video-creator, landing-page-generator, mockup-studio, etc.) et les formations/guides statiques.

### 2. Nettoyer les imports inutilisés

Supprimer les icônes Lucide qui ne sont plus référencées dans `allToolGroups` (Calculator, Camera, Compass, Contact, Flame, Gauge, GraduationCap, Hash, Mail, Map, Music, Paintbrush, Puzzle, ShoppingCart, Target, TestTube, Video, etc.)

### Résultat

Le menu latéral passera de ~127 entrées à ~44, en parfaite cohérence avec les switch cases et le Trello board déjà nettoyés.

