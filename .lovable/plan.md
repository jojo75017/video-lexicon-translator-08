# Plan — Estimation de pages fiable via un sélecteur de format KDP

## Problème
Le nombre de pages affiché dans les tableaux/stats est faux car il est **figé à 250 mots/page** dans ~15 endroits (`manuscriptStats.ts`, `EbookGlobalDashboard.tsx`, `EbookManuscriptDashboard.tsx`, `EbookPriceEstimator.tsx`, etc.). Ta mise en page KDP réelle tourne plutôt à ~305 mots/page selon le format (trim size), la police et l'interligne. Résultat : 67 200 mots affichés en ~269 pages au lieu de ~220 réelles.

## Objectif
Introduire un **sélecteur de format KDP** partagé qui pilote une densité mots/page réaliste, et brancher **tous** les tableaux/estimations dessus pour une pagination cohérente.

## Densités par format (source de vérité)
On s'appuie sur les formats déjà définis dans `src/lib/bookperfect/exporters.ts` (`KdpFormatId`: `5x8`, `5.5x8.5`, `6x9`, `a4`, `a5`). Densités cible (mots/page, police roman ~11pt, interligne standard) :

```text
5 x 8       →  240 mots/page
5.5 x 8.5   →  280 mots/page
6 x 9       →  305 mots/page   (défaut, correspond à ta mise en page réelle)
A5          →  300 mots/page
A4          →  480 mots/page
```

## Implémentation

### 1. Utilitaire central `src/utils/kdpPageDensity.ts` (nouveau)
- `KDP_PAGE_DENSITY: Record<KdpFormatId, number>` (table ci-dessus).
- `DEFAULT_KDP_FORMAT: KdpFormatId = '6x9'`.
- `getWordsPerPage(formatId)` et `estimatePages(words, formatId)` (= `Math.ceil(words / densité)`).

### 2. Réglage partagé persistant `src/hooks/useKdpFormat.ts` (nouveau)
- Hook léger lisant/écrivant le format choisi dans `localStorage` (clé `kdp_page_format`), défaut `6x9`, avec event pour synchro entre composants.
- Expose `{ formatId, setFormatId, wordsPerPage }`.

### 3. Sélecteur d'UI réutilisable `src/components/ebook/KdpFormatSelect.tsx` (nouveau)
- Petit `Select` (shadcn) listant les formats + densité affichée (« 6×9 — ~305 mots/page »).
- Branché sur `useKdpFormat`. À placer au-dessus des tableaux principaux (dashboard global, dashboard manuscrit, tableau mots/chapitre).

### 4. Brancher les estimations existantes
Remplacer les `/ 250` codés en dur par `estimatePages(words, formatId)` / `getWordsPerPage(formatId)` :
- `src/utils/manuscriptStats.ts` : ajouter un paramètre `formatId` (défaut `6x9`) à `computeManuscriptStats`; `WORDS_PER_PAGE_KDP` devient dynamique pour `totalPages` et `pages` par chapitre.
- `src/components/ebook/EbookGlobalDashboard.tsx` : `estimatedPages` via `useKdpFormat` + `estimatePages`.
- `src/components/ebook/EbookManuscriptDashboard.tsx` : idem (ligne 62).
- `src/components/ebook/EbookStatisticsTools.tsx` : passer `formatId` à `computeManuscriptStats`.
- `src/components/ebook/EbookChapterWordCount.tsx` : afficher la cible mots/chapitre en cohérence (optionnel : ajuster `targetWordsPerChapter` par défaut selon densité).
- `src/components/ebook/EbookPriceEstimator.tsx` (ligne 116, `pages * 250`) : utiliser la densité du format.
- Autres composants listés avec `/250` (export, workflow V3, series) : rebrancher sur `estimatePages` pour rester cohérents « partout ».

### 5. Affichage tableau
Là où le tableau de répartition est montré (page courante incluse), afficher le `KdpFormatSelect` juste au-dessus, avec une légende « Pagination estimée selon le format KDP sélectionné ». Le tableau se recalcule en direct au changement de format.

## Hors périmètre
- Aucun changement backend, base de données, tarifs, ni workflow de génération/anti-doublons.
- Pas de recalcul de l'export DOCX/PDF lui-même (déjà géré par `exporters.ts`) — on aligne seulement les **estimations affichées** sur le format choisi.

## Détails techniques
- Densités choisies pour coller aux moyennes KDP réelles (roman, marges officielles) ; `6x9 = 305` reproduit ta mesure 67 200 ÷ 220.
- Chaque composant qui affiche des pages consomme `useKdpFormat()` puis `estimatePages(words, formatId)` — une seule source de vérité, zéro constante dupliquée.
