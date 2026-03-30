/**
 * Règles typographiques françaises professionnelles
 * Conforme aux standards de l'Imprimerie nationale
 */

// Espace insécable fine (narrow no-break space)
const NNBSP = '\u202F';
// Espace insécable standard
const NBSP = '\u00A0';

/**
 * Applique toutes les règles typographiques françaises à un texte
 */
export function applyFrenchTypography(text: string): string {
  if (!text || typeof text !== 'string') return text || '';

  let result = text

    // ========== GUILLEMETS FRANÇAIS ==========
    // Remplacer les guillemets anglais par des guillemets français « »
    // Guillemet ouvrant : début de ligne ou après espace/ponctuation
    .replace(/(?:^|(?<=[\s({\[]))"/gm, '«\u00A0')
    // Guillemet fermant : avant espace/ponctuation ou fin
    .replace(/"(?=[\s)}\].,;:!?\n]|$)/gm, '\u00A0»')
    // Fallback : guillemets doubles restants
    .replace(/"([^"]+)"/g, '«\u00A0$1\u00A0»')
    
    // Corriger les espaces autour des guillemets français existants
    .replace(/«\s*/g, '«\u00A0')
    .replace(/\s*»/g, '\u00A0»')

    // ========== ESPACES INSÉCABLES AVANT PONCTUATION DOUBLE ==========
    // Point-virgule : espace fine insécable avant
    .replace(/\s*;/g, `${NNBSP};`)
    // Deux-points : espace insécable avant
    .replace(/\s*:/g, `${NBSP}:`)
    // Point d'exclamation : espace fine insécable avant
    .replace(/\s*!/g, `${NNBSP}!`)
    // Point d'interrogation : espace fine insécable avant
    .replace(/\s*\?/g, `${NNBSP}?`)

    // ========== TIRETS DE DIALOGUE ==========
    // Remplacer les tirets simples en début de ligne par des tirets cadratins
    .replace(/^[-–]\s+/gm, '—\u00A0')
    // Tiret cadratin avec espace insécable
    .replace(/^—\s*/gm, '—\u00A0')

    // ========== POINTS DE SUSPENSION ==========
    // Remplacer trois points par le caractère Unicode
    .replace(/\.\.\./g, '…')

    // ========== APOSTROPHES TYPOGRAPHIQUES ==========
    // Remplacer les apostrophes droites par des apostrophes courbes
    .replace(/'/g, '\u2019')

    // ========== NOMBRES ET ESPACES ==========
    // Espace insécable dans les grands nombres (1 000, 10 000, etc.)
    .replace(/(\d)\s(\d{3})\b/g, `$1${NBSP}$2`)
    // Espace insécable avant % € $
    .replace(/(\d)\s*(%|€|\$)/g, `$1${NBSP}$2`)
    // Espace insécable après n° N°
    .replace(/(n°|N°)\s*/g, `$1${NBSP}`)

    // ========== LIGATURES FRANÇAISES ==========
    // Œ/œ pour les mots courants
    .replace(/\bOe(?=uvre|il|uf)/g, 'Œ')
    .replace(/\boe(?=uvre|il|uf)/g, 'œ')
    // Cœur, sœur, nœud, vœu, bœuf, mœurs
    .replace(/\bc(oe)(ur)/gi, (m, oe, ur) => m[0] === 'C' ? `Cœ${ur}` : `cœ${ur}`)
    .replace(/\bs(oe)(ur)/gi, (m, oe, ur) => m[0] === 'S' ? `Sœ${ur}` : `sœ${ur}`)
    .replace(/\bn(oe)(ud)/gi, (m, oe, ud) => m[0] === 'N' ? `Nœ${ud}` : `nœ${ud}`)
    .replace(/\bv(oe)(u)/gi, (m, oe, u) => m[0] === 'V' ? `Vœ${u}` : `vœ${u}`)
    .replace(/\bb(oe)(uf)/gi, (m, oe, uf) => m[0] === 'B' ? `Bœ${uf}` : `bœ${uf}`)
    .replace(/\bm(oe)(urs)/gi, (m, oe, urs) => m[0] === 'M' ? `Mœ${urs}` : `mœ${urs}`)

    // ========== CORRECTIONS FINALES ==========
    // Éviter les doubles espaces insécables
    .replace(/\u00A0{2,}/g, NBSP)
    .replace(/\u202F{2,}/g, NNBSP)
    // Ne pas ajouter d'espace insécable dans les URLs
    .replace(/(https?:)\u00A0/g, '$1')
    .replace(/(https?:)\u202F/g, '$1')
    // Corriger les espaces multiples
    .replace(/  +/g, ' ');

  return result;
}

/**
 * Applique la typographie française uniquement aux dialogues
 * Préserve le reste du texte intact
 */
export function applyDialogueTypography(text: string): string {
  if (!text) return text || '';

  return text
    // Tirets cadratins pour les dialogues
    .replace(/^[-–]\s+/gm, '—\u00A0')
    // Guillemets français pour les citations
    .replace(/"([^"]+)"/g, '«\u00A0$1\u00A0»')
    // Apostrophes typographiques
    .replace(/'/g, '\u2019');
}

/**
 * Vérifie la conformité typographique d'un texte
 * Retourne un score et les problèmes détectés
 */
export function checkTypographyCompliance(text: string): {
  score: number;
  issues: Array<{ type: string; count: number; severity: 'error' | 'warning' }>;
} {
  if (!text) return { score: 100, issues: [] };

  const issues: Array<{ type: string; count: number; severity: 'error' | 'warning' }> = [];

  // Guillemets anglais au lieu de français
  const englishQuotes = (text.match(/"/g) || []).length;
  if (englishQuotes > 0) {
    issues.push({ type: 'Guillemets anglais au lieu de « »', count: englishQuotes, severity: 'error' });
  }

  // Espace manquant avant ponctuation double
  const missingSpaceBefore = (text.match(/[^\s\u00A0\u202F][;:!?]/g) || []).length;
  if (missingSpaceBefore > 0) {
    issues.push({ type: 'Espace manquant avant ;:!?', count: missingSpaceBefore, severity: 'error' });
  }

  // Apostrophes droites
  const straightApostrophes = (text.match(/'/g) || []).length;
  if (straightApostrophes > 0) {
    issues.push({ type: 'Apostrophes droites au lieu de \u2019', count: straightApostrophes, severity: 'warning' });
  }

  // Trois points au lieu de …
  const threeDots = (text.match(/\.\.\./g) || []).length;
  if (threeDots > 0) {
    issues.push({ type: 'Trois points au lieu de …', count: threeDots, severity: 'warning' });
  }

  // Tirets simples pour dialogues
  const simpleDashes = (text.match(/^[-–]\s/gm) || []).length;
  if (simpleDashes > 0) {
    issues.push({ type: 'Tirets simples au lieu de — (dialogue)', count: simpleDashes, severity: 'warning' });
  }

  // Calculer le score
  const totalIssues = issues.reduce((sum, i) => sum + i.count * (i.severity === 'error' ? 2 : 1), 0);
  const textLength = text.length;
  const score = Math.max(0, Math.round(100 - (totalIssues / textLength) * 1000));

  return { score, issues };
}
