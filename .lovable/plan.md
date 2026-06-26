# Refonte visuelle « Premium éditorial » du Hub V3

Objectif : rendre `/hub-v3` nettement plus professionnel et sobre, en gardant **exactement** la palette ambre/crème et **toute** la logique, le contenu et les encarts images existants. Changements **visuels uniquement**.

## Règles non-négociables
- Aucune modification de logique, de données, de routes, d'onglets ou de composants métier (CreateBookHub, V3Workflow30, V3PricingTiers, etc.).
- Tous les encarts images / bannières piliers / visuels actuels sont conservés.
- Palette inchangée : ambre `#E8951E`, ambre profond `#C97A14`, crème `#FBF6EC`, encre `#2A2118`.

## Direction retenue (prototype v3)
Style SaaS éditorial calme : typo serif élégante pour les titres, corps Inter, bordures fines teintées ambre plutôt que gros halos/ombres, plus de respiration, micro-interactions discrètes.

## Changements à appliquer dans `src/pages/V3HubPage.tsx`

### 1. Typographie
- Installer `@fontsource/instrument-serif` et `@fontsource/inter`, importer dans `src/main.tsx`.
- Remplacer la constante `SERIF = 'Georgia...'` par `'Instrument Serif', Georgia, serif` pour les titres (h1, titres de section, gros chiffres stats).
- Corps de texte en Inter (déjà via Tailwind base ou ajout `fontFamily`).

### 2. Allègement des effets (le cœur du « plus pro »)
- Supprimer le fond « aurora ambré global » (les 2 blobs `blur-[120px]` + `v3-grid-overlay-light`) → fond crème uni.
- Supprimer les 18 particules ambrées animées du hero.
- Retirer le tilt 3D des `ModuleCard` (handleMove/onMouseMove) ; garder un simple `hover:-translate-y-0.5` + bordure ambre qui s'accentue.
- Réduire les ombres lourdes : passer aux bordures fines `border-[#E8951E]/10` → `/40` au survol (comme le prototype), ombres très légères seulement.

### 3. Hero
- Badge pastille : point ambre + libellé `PUBLICATION ASSISTÉE PRO` en petites capitales espacées (style prototype), bordure fine.
- Titre en serif, sobre, sans effet monospace.
- Sous-titre gris chaud, largeur limitée.
- Boutons CTA conservés (mêmes actions) mais restylés : 1 bouton plein ambre + boutons secondaires à bordure fine, coins arrondis cohérents.

### 4. Barre de stats
- Reprendre la grille 4 colonnes « jointe » du prototype : `grid-cols-4 gap-px bg-[#E8951E]/20 border rounded-xl overflow-hidden`, chaque cellule fond crème, label en capitales fines + chiffre serif. (Mêmes 4 valeurs/données actuelles.)

### 5. Barre d'onglets
- Onglets en style « underline » sobre (bordure basse ambre sur l'actif, gris atténué sinon) au lieu de pastilles.
- Remplacer les emojis (🚀🛠️📚🎓💎🗺️) par les icônes lucide déjà importées (Compass, Wand2, Layers, etc.) — libellés inchangés.

### 6. Cartes modules
- Conserver la bannière image du pilier (encart visuel obligatoire).
- Carte plus sobre : bordure fine ambre, titre semi-bold, hover discret, badges d'accès conservés mais aplatis (moins criards).

### 7. Cohérence globale
- Uniformiser rayons (`rounded-xl`/`rounded-2xl`), espacements verticaux généreux (`space-y-12` entre blocs), titres de section en serif.

## Vérification
- `tsgo` (typecheck) propre.
- Capture Playwright de `/hub-v3` pour confirmer : plus de halo/particules, titres serif, onglets sans emojis, palette identique.

```text
Hero (serif, sobre)
 └─ badge · titre · sous-titre · CTA
Stats (4 cellules jointes, bordure ambre)
Onglets (underline, icônes lucide)
Sections (cartes bordure fine, images piliers conservées)
```
