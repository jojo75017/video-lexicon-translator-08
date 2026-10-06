/**
 * Règles typographiques françaises professionnelles
 * Conforme aux standards de l'Imprimerie nationale
 */

// Espace insécable fine (narrow no-break space)
const NNBSP = '\u202F';
// Espace insécable standard
const NBSP = '\u00A0';

/**
 * Une ligne introduite par un tiret est-elle une vraie réplique de dialogue ?
 * Les éléments de liste (courts, sans ponctuation finale, souvent en minuscule
 * ou terminés par « : ») ne doivent PAS recevoir de tiret cadratin, sinon tout
 * le livre se remplit de faux dialogues.
 */
export function isDialogueLine(rest: string): boolean {
  const t = (rest || '').trim();
  if (!t) return false;
  // Titre / intitulé de liste
  if (/[:;]$/.test(t)) return false;
  // Une réplique se termine par une ponctuation de phrase
  if (!/[.!?…»"]$/.test(t)) return false;
  // Commence par une majuscule, un guillemet ou des points de suspension.
  // Les répliques courtes (« — Oui. », « — Non ! ») restent des dialogues.
  if (!/^[«"“…A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]/.test(t)) return false;
  return true;
}

/**
 * Rétablit la mise en page d'un roman dont les dialogues sont collés au récit
 * (« Cette nuit ?— Le temps… ») ou dont le titre est soudé au numéro
 * (« CHAPITRE 1L'APPEL »). Chaque réplique repart sur sa propre ligne avec un
 * tiret cadratin suivi d'une espace insécable.
 */
export function restoreDialogueLayout(text: string): string {
  if (!text) return text || '';
  const laidOut = text
    // Numéro de chapitre soudé au titre
    .replace(/^(CHAPITRE\s+\d+)(?=[A-ZÀ-Ü«"])/gim, '$1\n')
    // Tiret cadratin collé après une ponctuation de fin de phrase : nouvelle réplique
    .replace(/([.!?…»:])[ \t\u00A0\u202F]*—[ \t\u00A0\u202F]*(?=[«"“…A-ZÀ-Ü])/g, '$1\n—\u00A0')
    // Tiret cadratin en début de ligne : espace insécable normalisée
    .replace(/^[ \t]*—[ \t\u00A0\u202F]*(?=\S)/gm, '—\u00A0');
  return spaceGuillemets(repairBrokenParagraphs(laidOut));
}

/**
 * Guillemets soudés au récit : « …le monde.« Vous » → « …le monde. « Vous »,
 * « …dessus. »Claire » → « …dessus. » Claire ».
 */
export function spaceGuillemets(text: string): string {
  if (!text) return text || '';
  return text
    .replace(/([^\s\n(\[{«'’*—])«/g, '$1 «')
    .replace(/»(\*{1,3})(?=[\p{L}\d—«])/gu, '»$1 ')
    .replace(/»(?=[\p{L}\d—«])/gu, '» ');
}

/**
 * Recolle les paragraphes coupés au milieu d'une phrase :
 *  - un paragraphe qui commence par une minuscule prolonge le précédent
 *    (« ce matin ?\n\ndemanda-t-elle ») ;
 *  - une réplique ouverte par « et coupée avant son » se poursuit dans le
 *    paragraphe suivant quand celui-ci referme le guillemet.
 */
export function repairBrokenParagraphs(text: string): string {
  if (!text || !text.includes('\n\n')) return text || '';
  const paras = text.split(/\n[ \t]*\n/);
  const out: string[] = [];
  for (const raw of paras) {
    const p = raw.trim();
    if (!p) continue;
    const prev = out[out.length - 1];
    if (prev !== undefined) {
      const startsLower = /^[a-zàâäéèêëîïôöùûüç]/.test(p);
      const prevEndsSentence = /[.!?…»"”]\*{0,3}$/.test(prev);
      const unclosedQuote = (prev.match(/«/g) || []).length > (prev.match(/»/g) || []).length;
      const nextCloses = (p.match(/»/g) || []).length > (p.match(/«/g) || []).length;
      // Coupure sans ponctuation finale, ou incise de dialogue (« ? demanda-t-elle »).
      if (startsLower && (!prevEndsSentence || /[?!…]\*{0,3}$/.test(prev) || unclosedQuote)) {
        out[out.length - 1] = `${prev} ${p}`;
        continue;
      }
      if (unclosedQuote && nextCloses && !/^—/.test(p)) {
        out[out.length - 1] = `${prev} ${p}`;
        continue;
      }
    }
    out.push(p);
  }
  return out.join('\n\n');
}

/**
 * Un chapitre doit se terminer par une phrase complète : si le texte est coupé
 * en plein mot (génération interrompue), on retire la phrase inachevée pour
 * finir sur le dernier point (ou « ! », « ? », « … », éventuellement suivi de « »).
 */
export function ensureCompleteEnding(text: string): string {
  if (!text) return text || '';
  const t = text.replace(/[\s\\*_#`|-]+$/u, '');
  if (/[.!?…][\u00A0\u202F\s]*[»"”]?$/.test(t)) return t;
  const re = /[.!?…](?:[\u00A0\u202F\s]*[»"”])?(?=\s)/g;
  let last = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) last = m.index + m[0].length;
  // Ne coupe jamais plus d'un tiers du chapitre
  if (last < 0 || last < t.length * 0.66) return t;
  return t.slice(0, last).trimEnd();
}

/** Reconvertit en puces les faux tirets de dialogue d'un texte déjà généré. */
export function dashesToBullets(text: string): string {
  if (!text) return text || '';
  return text.replace(/^—[\u00A0\s]+(.*)$/gm, (full, rest: string) =>
    isDialogueLine(rest) ? full : `• ${String(rest).trim()}`,
  );
}

/**
 * Applique toutes les règles typographiques françaises à un texte
 */

export function applyFrenchTypography(text: string): string {
  if (!text || typeof text !== 'string') return text || '';
  text = restoreDialogueLayout(text);
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
    // Un tiret en début de ligne ne devient un cadratin QUE s'il s'agit d'une
    // vraie réplique de dialogue. Les listes et énumérations restent des puces.
    .replace(/^[-–]\s+(.*)$/gm, (full, rest: string) => (isDialogueLine(rest) ? `—\u00A0${rest}` : full))


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

  // Heures : « 23h12 » → « 23 h 12 » (espaces insécables, norme française)
  result = result.replace(/\b([01]?\d|2[0-3])h([0-5]\d)\b/g, `$1${NBSP}h${NBSP}$2`);

  return spaceGuillemets(result);
}

/**
 * Applique la typographie française uniquement aux dialogues
 * Préserve le reste du texte intact
 */
export function applyDialogueTypography(text: string): string {
  if (!text) return text || '';

  return text
    // Tirets cadratins pour les vraies répliques de dialogue uniquement
    .replace(/^[-–]\s+(.*)$/gm, (full, rest: string) => (isDialogueLine(rest) ? `—\u00A0${rest}` : full))

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
    issues.push({ type: 'Tirets simples au lieu de - (dialogue)', count: simpleDashes, severity: 'warning' });
  }

  // Calculer le score
  const totalIssues = issues.reduce((sum, i) => sum + i.count * (i.severity === 'error' ? 2 : 1), 0);
  const textLength = text.length;
  const score = Math.max(0, Math.round(100 - (totalIssues / textLength) * 1000));

  return { score, issues };
}
