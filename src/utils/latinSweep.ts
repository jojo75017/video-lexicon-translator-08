/**
 * Détection déterministe des expressions en latin, faux latin, pseudo-langue
 * ou mots inventés « décoratifs » dans un texte français.
 *
 * Objectif : ne plus dépendre du bon vouloir du modèle. Après chaque correction IA,
 * on vérifie mécaniquement qu'il ne reste rien, et on relance une passe ciblée
 * si nécessaire.
 */

/** Locutions latines réellement courantes en français : on ne les touche pas. */
const WHITELIST = new Set([
  'a priori', 'a posteriori', 'a fortiori', 'a contrario', 'ad hoc', 'ad hominem',
  'alter ego', 'de facto', 'de jure', 'ex aequo', 'et cetera', 'etc',
  'in extremis', 'in fine', 'in situ', 'in vitro', 'in vivo', 'grosso modo',
  'modus operandi', 'post mortem', 'statu quo', 'via', 'vice versa', 'curriculum vitae',
  'mea culpa', 'nota bene', 'sine qua non', 'stricto sensu', 'a minima', 'ad vitam',
  'bis', 'idem', 'ibidem', 'versus', 'quiproquo', 'agenda', 'album', 'aquarium',
  'maximum', 'minimum', 'referendum', 'sanatorium', 'stade', 'forum', 'medium',
  'omnium', 'podium', 'sérum', 'symposium', 'ultimatum', 'vademecum', 'critérium',
  'consortium', 'delirium', 'requiem', 'te deum', 'imperium', 'auditorium',
  'sanctuaire', 'santé', 'unanimité', 'université', 'humanité',
]);

/** Mots latins fréquents dans les textes « décoratifs » générés. */
const LATIN_WORDS = [
  'intra', 'inter', 'supra', 'circa', 'contra', 'ultra', 'infra', 'juxta',
  'cruor', 'cruorem', 'cruoris', 'sanguis', 'sanguine', 'sanguinem', 'sanguinis',
  'matrimonium', 'matrimonii', 'cineres', 'cinerem', 'cinis', 'cineribus',
  'mortis', 'mortem', 'mors', 'morte', 'vita', 'vitae', 'vitam',
  'pactum', 'pacti', 'pacto', 'foedus', 'foederis',
  'tenebrae', 'tenebris', 'tenebrarum', 'lux', 'lucis', 'lucem',
  'nox', 'noctis', 'noctem', 'dies', 'diei', 'anima', 'animae', 'animam',
  'corpus', 'corporis', 'cor', 'cordis', 'manus', 'manibus',
  'dominus', 'domini', 'domine', 'deus', 'dei', 'deo', 'rex', 'regis', 'regem',
  'terra', 'terrae', 'terram', 'aqua', 'aquae', 'ignis', 'ignem',
  'bellum', 'belli', 'pax', 'pacis', 'pacem', 'amor', 'amoris', 'amorem',
  'odium', 'odii', 'ira', 'irae', 'fidelis', 'fidei', 'fides',
  'veritas', 'veritatis', 'veritatem', 'silentium', 'silentii',
  'memoria', 'memoriae', 'memoriam', 'aeternum', 'aeterna', 'aeterni',
  'omnia', 'omnes', 'omnis', 'nihil', 'nemo', 'semper', 'numquam', 'nunquam',
  'sicut', 'quia', 'quod', 'quam', 'quem', 'qui', 'quae', 'cum', 'sine', 'sub',
  'ante', 'post', 'pro', 'per', 'praeter', 'propter', 'erat', 'erit', 'sunt',
  'esse', 'fuit', 'fecit', 'facit', 'dixit', 'venit', 'vidit', 'vicit',
  'sancta', 'sanctus', 'sancti', 'gloria', 'gloriae', 'requiem', 'aeternam',
  'filius', 'filii', 'filia', 'mater', 'matris', 'pater', 'patris',
  'frater', 'fratris', 'soror', 'sororis', 'domus', 'urbs', 'urbis',
  'lex', 'legis', 'legem', 'ius', 'iuris', 'jus', 'juris', 'ordo', 'ordinis',
  'vindicta', 'vindictae', 'ultio', 'ultionis', 'poena', 'poenae',
];

const LATIN_WORD_SET = new Set(LATIN_WORDS);

/** Terminaisons typiquement latines, utilisées pour repérer les mots inventés. */
const LATIN_ENDINGS = /(?:orum|arum|ibus|orem|erunt|entur|antur|issimus|issima|atio|ationem|itas|itatem|ium|ius|iae|eus|aeum|orum)$/i;

const STRIP = /^[^\p{L}]+|[^\p{L}]+$/gu;

function normalizeWord(word: string): string {
  return word.replace(STRIP, '').toLowerCase();
}

/** Un mot latin isolé peut être un nom propre : on ignore les mots capitalisés seuls. */
function looksLikeProperNoun(raw: string, isSentenceStart: boolean): boolean {
  const first = raw.replace(STRIP, '').charAt(0);
  return !isSentenceStart && !!first && first === first.toUpperCase() && first !== first.toLowerCase();
}

export interface LatinHit {
  /** Expression exacte trouvée dans le texte. */
  expression: string;
  /** Extrait de phrase autour, pour affichage. */
  context: string;
}

/**
 * Repère les expressions suspectes. On ne signale que :
 *  - une séquence de 2 mots latins consécutifs ou plus (le cas le plus courant) ;
 *  - un mot latin isolé non capitalisé et hors liste blanche ;
 *  - un mot à terminaison latine absent du français courant.
 */
export function detectLatin(text: string): LatinHit[] {
  if (!text) return [];
  const hits: LatinHit[] = [];
  const seen = new Set<string>();

  const sentences = text.split(/(?<=[.!?…])\s+|\n+/);

  for (const sentence of sentences) {
    const tokens = sentence.match(/[\p{L}''-]+/gu) || [];
    let run: string[] = [];

    const flush = () => {
      if (!run.length) return;
      const expression = run.join(' ');
      const key = expression.toLowerCase();
      const single = run.length === 1;
      if (!(single && WHITELIST.has(key)) && !seen.has(key)) {
        seen.add(key);
        hits.push({ expression, context: sentence.trim().slice(0, 220) });
      }
      run = [];
    };

    tokens.forEach((raw, i) => {
      const word = normalizeWord(raw);
      if (!word || word.length < 2) { flush(); return; }
      if (WHITELIST.has(word)) { flush(); return; }

      const isLatinWord = LATIN_WORD_SET.has(word);
      const isLatinShape = word.length > 5 && LATIN_ENDINGS.test(word) && !WHITELIST.has(word);

      if (isLatinWord || isLatinShape) {
        // Mot latin isolé et capitalisé en milieu de phrase : probablement un nom propre.
        if (run.length === 0 && looksLikeProperNoun(raw, i === 0)) { flush(); return; }
        run.push(raw.replace(STRIP, ''));
        return;
      }
      flush();
    });
    flush();
  }

  // On garde en priorité les séquences (2 mots et plus) : signal le plus fiable.
  const sequences = hits.filter((h) => h.expression.trim().includes(' '));
  const singles = hits.filter((h) => !h.expression.trim().includes(' '));
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
