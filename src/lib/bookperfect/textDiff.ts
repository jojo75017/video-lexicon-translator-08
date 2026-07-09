/**
 * BookPerfect AI — Diff mot-à-mot léger (LCS) pour l'affichage.
 * Produit des segments à colorer (égal / supprimé / ajouté) afin de
 * comparer visuellement le texte original et le texte corrigé.
 * Utilisé UNIQUEMENT pour l'affichage — ne mute rien.
 */

export type DiffType = 'equal' | 'removed' | 'added';

export interface DiffSegment {
  type: DiffType;
  text: string;
}

/** Découpe en "tokens" (mots + espaces + ponctuation) en conservant tout. */
function tokenize(text: string): string[] {
  // Capture mots, espaces et le reste (ponctuation), sans rien perdre.
  return text.match(/\s+|[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+/gu) || [];
}

/**
 * Diff mot-à-mot via une matrice LCS classique.
 * Renvoie une liste de segments consécutifs regroupés par type.
 */
export function diffWords(original: string, corrected: string): DiffSegment[] {
  const a = tokenize(original);
  const b = tokenize(corrected);
  const n = a.length;
  const m = b.length;

  // Matrice LCS (n+1) x (m+1).
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const raw: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      raw.push({ type: 'equal', text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      raw.push({ type: 'removed', text: a[i] });
      i++;
    } else {
      raw.push({ type: 'added', text: b[j] });
      j++;
    }
  }
  while (i < n) raw.push({ type: 'removed', text: a[i++] });
  while (j < m) raw.push({ type: 'added', text: b[j++] });

  // Fusionne les segments consécutifs de même type.
  const merged: DiffSegment[] = [];
  for (const seg of raw) {
    const last = merged[merged.length - 1];
    if (last && last.type === seg.type) last.text += seg.text;
    else merged.push({ ...seg });
  }
  return merged;
}
