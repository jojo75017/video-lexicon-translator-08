/**
 * Détection STRICTE des expressions en latin / faux latin dans un texte français.
 *
 * Principe de prudence : mieux vaut laisser passer une expression douteuse que
 * signaler un mot français et déclencher une réécriture qui abîme le chapitre.
 * On ne signale donc que :
 *   - une séquence de 2 mots latins consécutifs ou plus (ex. « Pactum intra cruorem ») ;
 *   - un mot latin rare, impossible en français courant, isolé et en minuscule.
 *
 * Aucun mot pouvant exister en français (qui, cum, via, ira, post, or, sans...)
 * ne figure dans les listes, et aucune détection « par terminaison » n'est faite :
 * c'était la cause des réécritures abusives.
 */

/** Mots latins rares : aucune collision possible avec le français. */
const LATIN_STRONG = [
  'cruor', 'cruorem', 'cruoris', 'sanguis', 'sanguine', 'sanguinem', 'sanguinis',
  'matrimonium', 'matrimonii', 'cineres', 'cinerem', 'cineribus',
  'mortis', 'mortem', 'mors', 'tenebrae', 'tenebris', 'tenebrarum',
  'lucis', 'lucem', 'noctis', 'noctem', 'animae', 'animam',
  'corporis', 'cordis', 'manibus', 'dominus', 'domini', 'domine',
  'regis', 'regem', 'terrae', 'terram', 'aquae', 'ignem',
  'bellum', 'belli', 'pacis', 'pacem', 'amoris', 'amorem',
  'irae', 'fidelis', 'fidei', 'veritas', 'veritatis', 'veritatem',
  'silentium', 'silentii', 'memoriae', 'memoriam',
  'aeternum', 'aeterna', 'aeterni', 'aeternam',
  'omnia', 'omnes', 'omnis', 'nihil', 'nemo', 'semper', 'numquam', 'nunquam',
  'sicut', 'quia', 'quam', 'quem', 'praeter', 'propter',
  'erat', 'erit', 'esse', 'fuit', 'fecit', 'facit', 'dixit', 'vidit', 'vicit',
  'sanctus', 'sancti', 'gloriae', 'filius', 'filii', 'matris', 'patris',
  'fratris', 'sororis', 'domus', 'urbis', 'legis', 'legem', 'iuris', 'juris',
  'ordinis', 'vindicta', 'vindictae', 'ultionis', 'poenae',
  'pactum', 'pacti', 'pacto', 'foedus', 'foederis',
];

/**
 * Mots latins courts qui existent aussi ailleurs : ils ne comptent QUE
 * lorsqu'ils sont collés à un autre mot latin (séquence).
 */
const LATIN_WEAK = [
  'intra', 'inter', 'supra', 'circa', 'contra', 'infra', 'juxta',
  'vita', 'vitae', 'vitam', 'anima', 'terra', 'aqua', 'ignis',
  'cor', 'corpus', 'manus', 'rex', 'deus', 'dei', 'deo', 'lex', 'ius',
  'lux', 'nox', 'dies', 'diei', 'pax', 'amor', 'ira', 'fides', 'memoria',
  'gloria', 'sancta', 'requiem', 'mater', 'pater', 'frater', 'soror',
  'sunt', 'cum', 'sine', 'sub', 'ante', 'post', 'pro', 'per', 'qui', 'quae', 'quod',
  'odium', 'odii', 'poena', 'ultio', 'ordo', 'urbs',
];

const STRONG = new Set(LATIN_STRONG);
const WEAK = new Set(LATIN_WEAK);

const STRIP = /^[^\p{L}]+|[^\p{L}]+$/gu;

function normalizeWord(word: string): string {
  return word.replace(STRIP, '').toLowerCase();
}

export interface LatinHit {
  /** Expression exacte trouvée dans le texte. */
  expression: string;
  /** Extrait de phrase autour, pour affichage. */
  context: string;
}

export function detectLatin(text: string): LatinHit[] {
  if (!text) return [];
  const hits: LatinHit[] = [];
  const seen = new Set<string>();

  const sentences = text.split(/(?<=[.!?…])\s+|\n+/);

  for (const sentence of sentences) {
    const tokens = sentence.match(/[\p{L}''-]+/gu) || [];
    let run: { raw: string; strong: boolean }[] = [];

    const flush = () => {
      if (!run.length) { run = []; return; }
      const isSequence = run.length >= 2;
      const isLoneStrong =
        run.length === 1 &&
        run[0].strong &&
        run[0].raw === run[0].raw.toLowerCase(); // un mot capitalisé = nom propre probable

      if (isSequence || isLoneStrong) {
        const expression = run.map((r) => r.raw).join(' ');
        const key = expression.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          hits.push({ expression, context: sentence.trim().slice(0, 220) });
        }
      }
      run = [];
    };

    tokens.forEach((raw) => {
      const word = normalizeWord(raw);
      if (!word || word.length < 2) { flush(); return; }
      const strong = STRONG.has(word);
      const weak = WEAK.has(word);
      if (strong || weak) {
        run.push({ raw: raw.replace(STRIP, ''), strong });
        return;
      }
      flush();
    });
    flush();
  }

  // Les séquences en premier : signal le plus fiable.
  const sequences = hits.filter((h) => h.expression.includes(' '));
  const singles = hits.filter((h) => !h.expression.includes(' '));
  return [...sequences, ...singles];
}

/** Vrai si le texte contient encore du latin / pseudo-latin à remplacer. */
export function hasLatin(text: string): boolean {
  return detectLatin(text).length > 0;
}

/** Liste des expressions à envoyer au modèle pour la passe ciblée. */
export function latinExpressions(text: string, max = 25): string[] {
  return detectLatin(text).slice(0, max).map((h) => h.expression);
}
