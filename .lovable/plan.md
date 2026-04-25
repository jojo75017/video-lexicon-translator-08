## Objectif

Rendre la sidebar **simple, lisible et orientée parcours** pour les abonnés, en réduisant la densité visuelle et en mettant en avant un chemin clair : **Préparer → Écrire → Publier → Vendre**. Les 15 agents du workflow IA et les outils avancés restent accessibles mais repliés par défaut.

---

## Ce que verra l'abonné

```text
┌─────────────────────────────────┐
│  📁 Projet actif : "Mon ebook"  │  ← inchangé
│  [+ Nouveau projet]              │
├─────────────────────────────────┤
│  🚀 PAR OÙ COMMENCER ?          │  ← NOUVEAU bandeau
│  1. Créer mon plan              │     onboarding repliable
│  2. Écrire les chapitres        │     (masqué après 1ère utilisation)
│  3. Générer la couverture       │
│  4. Exporter pour KDP           │
│  [Masquer ce guide]             │
├─────────────────────────────────┤
│  ⭐ FAVORIS                     │  ← inchangé
│   • Plan ebook                  │
│   • Exporter                    │
├─────────────────────────────────┤
│  1️⃣ PRÉPARER                   │  ← Étape 1 (toujours visible)
│   • Plan de l'ebook             │
│   • Personnages                 │
│   • Importer Word / URL         │
│   [+ 3 outils avancés]          │
├─────────────────────────────────┤
│  2️⃣ ÉCRIRE                     │  ← Étape 2
│   • Écrire les chapitres        │
│   • Assistant IA                │
│   • Relecture stricte           │
│   [🤖 Workflow 15 agents ▾]    │  ← REPLIÉ par défaut
│   [+ 4 outils avancés]          │
├─────────────────────────────────┤
│  3️⃣ PUBLIER                    │  ← Étape 3
│   • Éditeur Couverture          │
│   • Exporter (PDF/Word/ePub)    │
│   • Description KDP             │
│   • Audit Pilot KDP             │
│   [+ 5 outils avancés]          │
├─────────────────────────────────┤
│  4️⃣ VENDRE                     │  ← Étape 4
│   • Posts Réseaux Sociaux       │
│   • Plan Lancement              │
│   • Guide KDP Ads               │
├─────────────────────────────────┤
│  ⚙️ Mon Compte                  │  ← Compact en bas
│   • Mes Projets · Abonnement    │
│   • Paramètres · Communauté     │
└─────────────────────────────────┘
```

### Améliorations visuelles
- **Espacement augmenté** entre sections (py-3 → py-4) et entre items (py-1.5 → py-2.5).
- **Numérotation 1️⃣2️⃣3️⃣4️⃣** sur les piliers principaux pour suggérer l'ordre.
- **Police légèrement plus grande** pour les labels d'outils (text-sm → text-[13.5px]) et **icônes mieux contrastées**.
- **Séparateurs visuels** plus marqués entre étapes (bordure colorée à gauche selon le pilier).
- **Mode replié (icon)** : conserve les icônes des 4 étapes + favoris, plus lisible.

---

## Détails techniques

### Fichiers modifiés
1. **`src/components/layout/modernSidebarSections.ts`**
   - Renommer les 5 piliers en 4 étapes numérotées : `1️⃣ Préparer`, `2️⃣ Écrire`, `3️⃣ Publier`, `4️⃣ Vendre` + `⚙️ Mon Compte` (rétrogradé en footer).
   - Réduire `ESSENTIAL_TOOL_IDS` à 3-4 outils max par étape (le reste passe en "avancés").
   - Sortir les 15 agents P1→P15 dans un sous-groupe `WORKFLOW_AGENTS` replié.

2. **`src/components/layout/ModernSidebar.tsx`**
   - Ajouter un état `showWorkflowAgents` (défaut `false`) avec toggle `🤖 Workflow 15 agents ▾`.
   - Augmenter espacement (gap, padding) et tailles de police.
   - Ajouter une bordure gauche colorée par pilier (emerald/violet/blue/orange).
   - Compacter `⚙️ Mon Compte` en footer 2 colonnes.

3. **NOUVEAU `src/components/layout/SidebarOnboarding.tsx`**
   - Composant bandeau "🚀 Par où commencer ?" avec 4 étapes cliquables (chaque étape = onTabChange vers l'outil correspondant).
   - État persisté via `localStorage` (clé `sidebar_onboarding_dismissed_v1`).
   - Bouton "Masquer ce guide" pour les abonnés expérimentés.
   - Réafficher via lien dans `⚙️ Paramètres` ("Réafficher le guide de démarrage").

4. **`src/hooks/useSidebarFavorites.ts`** : aucun changement (déjà bon).

### Comportement
- Aucun outil supprimé — tout reste accessible via `[+ Voir avancés]` ou `[🤖 Workflow 15 agents ▾]`.
- Les abonnés existants gardent leurs favoris et leur projet actif.
- Le bandeau onboarding apparaît automatiquement aux abonnés qui ne l'ont jamais masqué (rétro-compatible : il s'affichera une fois pour tous, ils peuvent le fermer).

### Hors-scope
- Pas de refonte de `MagazineSidebar.tsx` (sidebar legacy non utilisée par les abonnés).
- Pas de modification du système d'auth ni des routes.
- Pas de changement sur la page `/offres` (la vente fonctionne déjà).

---

## Ce que ça va changer pour vos abonnés

✅ **Premier coup d'œil** : ils voient 4 étapes claires au lieu de 44 outils empilés.
✅ **Nouveaux abonnés** : un bandeau les guide pas-à-pas (Plan → Écrire → Couverture → Export).
✅ **Workflow 15 agents** : replié par défaut, n'écrase plus la sidebar.
✅ **Pros** : peuvent tout déplier d'un clic, ajouter aux favoris, ou masquer le guide.
✅ **Lisibilité** : police et espacement améliorés, hiérarchie visuelle claire.