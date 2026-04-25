## Diagnostic

La sidebar paraît "condensée" parce que **6 blocs fixes consomment plus de la moitié de la hauteur d'écran** AVANT que la liste des outils n'apparaisse :

```text
┌─────────────────────────┐  ↑
│ 1. Header logo (72px)   │  │  Tout ceci est FIXE
│ 2. Projet actif (90px)  │  │  et prend ~520 px
│ 3. Recherche (52px)     │  │  sur 900 px d'écran
│ 4. Guide outils (44px)  │  │  → il ne reste que
│ 5. Favoris (~120px)     │  │  ~380 px pour les
│ 6. Onboarding (~200px)  │  │  44 OUTILS qui doivent
├─────────────────────────┤  ↓  scroller dans <nav>
│ <nav> outils  ⬇         │
│   = scroll étroit       │
├─────────────────────────┤
│ Quota (80px)            │
│ Footer (90px)           │
└─────────────────────────┘
```

Résultat : les abonnés voient un mur compact et doivent scroller pour trouver chaque outil.

---

## Solution : libérer la hauteur et aérer

### Ce que verra l'abonné

```text
┌─────────────────────────────────┐
│ 📚 EbookStudio          🌙      │  ← Header compact (1 ligne)
│ 📁 Mon ebook ▾   [+ Nouveau]    │  ← Projet actif (1 ligne)
│ 🔍 Rechercher...                │
├─────────────────────────────────┤
│ ⭐ FAVORIS (3)            ▾     │  ← REPLIABLE (replié par défaut)
├─────────────────────────────────┤
│ 🚀 Démarrage  [Afficher guide]  │  ← Bandeau réduit à 1 LIGNE
├─────────────────────────────────┤  ← À partir d'ici : OUTILS
│                                  │
│  1️⃣  PRÉPARER              6 ▾ │  ← Police +20%, padding +60%
│      • Plan de l'ebook           │
│      • Personnages               │
│      • Importer Word             │
│      + 3 outils avancés          │
│                                  │
│  2️⃣  ÉCRIRE                15 ▾ │
│  3️⃣  PUBLIER               12 ▾ │
│  4️⃣  VENDRE                 4 ▾ │
│  ⚙️  MON COMPTE              7 ▾ │
│                                  │
│  ↕ Tout replier                  │
└─────────────────────────────────┘
│ 👑 PRO • ∞ illimité              │  ← Quota compact 1 ligne
│ ◀ Réduire                        │
└─────────────────────────────────┘
```

### 4 changements clés

1. **Onboarding compressé**
   - Avant : carte 200 px avec 4 étapes empilées toujours visibles.
   - Après : ligne 36 px "🚀 Par où commencer ? [Afficher]" qui déplie un popover/accordéon SEULEMENT au clic.
   - Les nouveaux abonnés voient le bouton mais n'ont pas le mur de 4 cartes.

2. **Favoris repliables**
   - Avant : toujours déplié, 3 favoris = 120 px.
   - Après : header "⭐ Favoris (3) ▾" avec accordéon. Replié par défaut s'il n'y a aucun favori, déplié sinon — mais avec espacement plus serré (py-1.5 → py-1).

3. **Projet actif sur 1 ligne**
   - Avant : `SidebarHeader` empile titre projet + 2 boutons sur 90 px.
   - Après : ligne unique 44 px : `📁 Titre projet ▾` + bouton compact `[+]` à droite. Le menu déroulant montre les projets récents.

4. **Liste outils aérée**
   - Augmenter `py-2` → `py-3` sur les boutons d'outils.
   - Augmenter `text-sm` → `text-[14px]` (plus lisible).
   - Augmenter `space-y-1` → `space-y-1.5` entre items.
   - Augmenter `mb-1` → `mb-2` entre groupes.
   - Plus de blanc à gauche (`pl-3` → `pl-4` sur les items).
   - Header de groupe `py-2.5` → `py-3` avec icône emoji plus grosse.

### Bonus : option "vraiment plus large"

Augmenter la largeur de la sidebar de `w-72` (288 px) à `w-[320px]` pour donner ~30 px de respiration horizontale. Les labels d'outils ne seront plus tronqués.

---

## Détails techniques

### Fichiers modifiés

1. **`src/components/layout/SidebarOnboarding.tsx`**
   - Remplacer la carte 200 px par un bouton ligne 36 px + Popover (composant `@/components/ui/popover` déjà présent) qui affiche les 4 étapes au clic.
   - Conserver `localStorage` `sidebar_onboarding_dismissed_v1`.

2. **`src/components/layout/SidebarFavorites.tsx`**
   - Wrapper l'affichage dans un `<button>` toggle "⭐ Favoris (N) ▾" + état local `favoritesOpen` (défaut : `true` si N≥1, `false` sinon).
   - Réduire `py` des items.

3. **`src/components/layout/SidebarHeader.tsx`**
   - Compacter en 1 ligne : `📁 [titre tronqué] ▾` à gauche, `[+]` à droite (Tooltip "Nouveau projet").
   - Le `▾` ouvre un `Popover` listant les projets récents + "Voir tous mes projets".

4. **`src/components/layout/ModernSidebar.tsx`**
   - Largeur : `w-72` → `w-[320px]` (et `isCollapsed` reste `w-[72px]`).
   - Espacement nav : `space-y-1` → `space-y-1.5`, `py-2` → `py-3` sur `MenuItemButton`.
   - Headers de groupe : `py-2.5` → `py-3`, `text-[13px]` → `text-[14px]`, emoji `text-base` → `text-lg`.
   - Items outils : `py-2` → `py-2.5`, `text-sm` → `text-[14px]`, `gap-2.5` → `gap-3`.
   - Bordure gauche du contenu déplié : `border-l-2` → `border-l-[3px]` (mieux visible).
   - Marge inter-groupes : `mb-1` → `mb-2`.

### Comportement
- Aucun outil supprimé ni déplacé.
- Les abonnés existants gardent favoris, projet actif, état d'onboarding.
- L'option "Afficher le guide de démarrage" reste accessible via le bouton repliable (et toujours via custom event `sidebar-onboarding-show` depuis Paramètres).

### Hors-scope
- Pas de changement de logique métier.
- Pas de modification des outils, du Workflow IA, ni des routes.
- Pas de refonte du `MagazineSidebar.tsx` (legacy).

---

## Ce que ça change pour vos abonnés

✅ **Plus d'espace vertical** pour les outils (gain ~250 px).
✅ **Liste outils aérée** : items plus grands, plus lisibles, mieux espacés.
✅ **Sidebar 30 px plus large** : labels d'outils ne sont plus tronqués.
✅ **Onboarding non intrusif** : bouton discret au lieu d'une grosse carte.
✅ **Favoris repliables** : on peut les masquer pour gagner encore plus de place.
✅ **Projet actif compact** : 1 ligne au lieu de 3.
