## Problème 1 — Éditeur P1 ne renvoie plus les 5 titres alternatifs avec scores

**Cause** : dans `supabase/functions/editorial-director/index.ts`, l'appel "full-analysis" demande tout (promesse, angle, cible, erreurs, vision, 5 titres, meilleur titre, score original) en un seul JSON limité à `maxTokens: 4000`. Avec un sujet long ou une réponse verbeuse, le JSON est tronqué → `tryParseJSON` échoue → on tombe dans le fallback partiel (sans titres ou avec liste vide). Le front (`EbookEditorialDirector.tsx`) relance bien via `regenerateTitles` quand `titles.length < 3`, mais si Gemini renvoie un quota/timeout, l'utilisateur n'a plus aucun titre.

**Fix edge function `editorial-director/index.ts`** :
- Passer `maxTokens` de 4000 → 6000 pour le full-analysis.
- Si le JSON parsé n'a pas 5 titres valides (`suggestionsTitle.length < 5`), appeler systématiquement `generateTitlesOnly()` et fusionner — déjà partiellement fait mais à durcir : remplacer la liste seulement si le retour est ≥ 5 items avec `scoreKdp` numérique.
- Garantir `titreOriginalScore` non-null (forces/faiblesses) — fournir defaults si absent pour que la barre de progression "Votre titre actuel" s'affiche toujours.

**Fix front `EbookEditorialDirector.tsx`** :
- Si `analysis.suggestionsTitle.length === 0` après analyse, afficher un encart "Aucun titre généré — Cliquer Régénérer" + auto-trigger silencieux de `regenerateTitles` (au lieu de simplement masquer la carte).

## Problème 2 — Doublon "CHAPITRE 2" dans l'export PDF

**Cause** : dans `src/components/ebook/EbookAdvancedExport.tsx` (lignes 294-303), l'export PDF imprime systématiquement :
1. `CHAPITRE {i+1}` (petit, gris, centré, ligne 300)
2. puis `ch.title` (gros, gras, ligne 303)

Quand l'utilisateur (ou la génération IA) nomme son chapitre `Chapitre 2` ou `CHAPITRE 2`, les deux libellés sont identiques → effet "titre dupliqué" visible sur la capture.

Même problème dans :
- `EbookAdvancedExport.tsx` ligne 135 (export EPUB) : `<h1>Chapitre {i+1}<br/>...{ch.title}</h1>`
- À vérifier mais probablement pas affecté : `ebookPdfExporter.ts` ligne 275 (n'imprime que `s.title`).

**Fix** : normaliser et dédupliquer. Ajouter un helper :
```ts
const stripChapterNumber = (title: string, i: number) => {
  const patterns = [
    new RegExp(`^\\s*chapitre\\s*${i+1}\\s*[:\\-–—.]?\\s*`, 'i'),
    new RegExp(`^\\s*chapter\\s*${i+1}\\s*[:\\-–—.]?\\s*`, 'i'),
  ];
  let t = title.trim();
  for (const p of patterns) t = t.replace(p, '');
  return t.trim();
};
```
Utiliser ce helper dans l'export PDF (l.303) et EPUB (l.135) : si après strip le titre est vide ou identique au libellé "Chapitre N" déjà imprimé, ne pas afficher la seconde ligne.

## Hors scope

- Pas de changement sur le workflow IA, le header, la sidebar, ou les autres exports (DOCX/TXT/HTML qui n'ont pas le doublon).
- Pas de refonte de l'éditeur P1 — uniquement fiabilisation des titres.
