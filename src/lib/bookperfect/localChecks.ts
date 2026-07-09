/**
 * BookPerfect AI — Vérifications locales déterministes (sans IA).
 * Rapides, fiables, exécutées sur chaque chapitre :
 *  - Traces IA / titres provisoires / placeholders
 *  - Typographie française (espaces insécables, guillemets, apostrophes, tirets…)
 * Produisent des Issue NON destructives (proposition + raison).
 */
import type { Chapter, Issue } from './types';

const NNBSP = '\u202F'; // espace fine insécable
const NBSP = '\u00A0';  // espace insécable

let counter = 0;
const nextId = () => `loc-${Date.now()}-${counter++}`;

/** Extrait un court contexte autour d'une position. */
const context = (text: string, index: number, len: number, pad = 25): string => {
  const start = Math.max(0, index - pad);
  const end = Math.min(text.length, index + len + pad);
  return (start > 0 ? '…' : '') + text.slice(start, end).replace(/\n/g, ' ') + (end < text.length ? '…' : '');
};

/** Motifs de traces IA / contenus provisoires. */
const AI_TRACE_PATTERNS: { re: RegExp; reason: string }[] = [
  { re: /lorem ipsum/gi, reason: 'Texte de remplissage « Lorem ipsum » à retirer.' },
  { re: /\b(?:TODO|FIXME|XXX)\b/g, reason: 'Marqueur de travail (TODO/FIXME) à supprimer avant publication.' },
  { re: /\[[^\]]*(?:à (?:compléter|vérifier|rédiger|faire)|insérer|placeholder|à venir)[^\]]*\]/gi, reason: 'Zone à compléter laissée dans le texte.' },
  { re: /\b(?:à (?:compléter|vérifier|rédiger|développer)|à faire|texte provisoire|titre (?:provisoire|temporaire)|version provisoire|brouillon)\b/gi, reason: 'Mention provisoire à finaliser.' },
  { re: /\bChapitre\s+(?:X|\?+|\[[^\]]*\])/gi, reason: 'Titre de chapitre non finalisé.' },
  { re: /\b(?:en tant que (?:modèle|IA|intelligence artificielle) de langage|je ne peux pas|voici (?:un exemple|une version)|n'hésitez pas à)\b/gi, reason: 'Formulation typique d\'IA à réécrire ou retirer.' },
  { re: /\bexemple\s*\d*\s*:/gi, reason: 'Amorce « exemple : » possiblement générée automatiquement.' },
  { re: /\{[^{}\n]{0,40}\}/g, reason: 'Accolades résiduelles (variable/gabarit non remplacé).' },
];

function detectAiTraces(chapter: Chapter): Issue[] {
  const issues: Issue[] = [];
  const text = chapter.content;
  for (const { re, reason } of AI_TRACE_PATTERNS) {
    let m: RegExpExecArray | null;
    const rx = new RegExp(re.source, re.flags);
    let found = 0;
    while ((m = rx.exec(text)) !== null && found < 20) {
      found++;
      issues.push({
        id: nextId(),
        category: 'traces-ia',
        severity: 'critical',
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        original: m[0],
        suggestion: '',
        reason: `${reason} Contexte : ${context(text, m.index, m[0].length)}`,
        status: 'pending',
        source: 'local',
      });
      if (m.index === rx.lastIndex) rx.lastIndex++;
    }
  }
  // Titre de chapitre provisoire
  if (/\b(?:provisoire|temporaire|sans titre|untitled|chapitre\s+x)\b/i.test(chapter.title)) {
    issues.push({
      id: nextId(),
      category: 'traces-ia',
      severity: 'warning',
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      original: chapter.title,
      suggestion: '',
      reason: 'Le titre du chapitre semble provisoire — donnez-lui un titre définitif.',
      status: 'pending',
      source: 'local',
    });
  }
  return issues;
}

/** Détecte les problèmes typographiques FR (propose la version corrigée). */
function detectTypography(chapter: Chapter): Issue[] {
  const issues: Issue[] = [];
  const text = chapter.content;
  const push = (severity: Issue['severity'], original: string, suggestion: string, reason: string, index: number) => {
    issues.push({
      id: nextId(),
      category: 'orthographe',
      severity,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      original,
      suggestion,
      reason: `${reason} Contexte : ${context(text, index, original.length)}`,
      status: 'pending',
      source: 'local',
    });
  };

  // Doubles espaces
  let m: RegExpExecArray | null;
  const dbl = /  +/g;
  let n = 0;
  while ((m = dbl.exec(text)) !== null && n < 15) { n++; push('info', m[0], ' ', 'Espaces multiples à réduire à un seul.', m.index); }

  // Guillemets droits "..."
  const straight = /"[^"\n]{1,120}"/g;
  n = 0;
  while ((m = straight.exec(text)) !== null && n < 15) {
    n++;
    const inner = m[0].slice(1, -1).trim();
    push('warning', m[0], `«${NBSP}${inner}${NBSP}»`, 'Utilisez les guillemets français « … » pour Amazon KDP.', m.index);
  }

  // Apostrophe droite
  const apo = /\w'\w/g;
  n = 0;
  while ((m = apo.exec(text)) !== null && n < 10) { n++; push('info', m[0], m[0].replace("'", '\u2019'), 'Apostrophe typographique ’ recommandée.', m.index); }

  // Ponctuation double sans espace insécable devant : ; ! ?
  const punct = /(\S)([;!?])/g;
  n = 0;
  while ((m = punct.exec(text)) !== null && n < 15) {
    if (m[1] === NNBSP || m[1] === NBSP) continue;
    n++;
    push('info', `${m[1]}${m[2]}`, `${m[1]}${NNBSP}${m[2]}`, 'Espace fine insécable requise avant ; ! ? en français.', m.index);
  }
  const colon = /(\S):/g;
  n = 0;
  while ((m = colon.exec(text)) !== null && n < 15) {
    if (m[1] === NBSP || /\d/.test(m[1])) continue; // pas pour 12:30
    n++;
    push('info', `${m[1]}:`, `${m[1]}${NBSP}:`, 'Espace insécable requise avant « : » en français.', m.index);
  }

  // Points de suspension "..."
  const ell = /\.\.\./g;
  n = 0;
  while ((m = ell.exec(text)) !== null && n < 10) { n++; push('info', '...', '…', 'Utilisez le caractère unique « … ».', m.index); }

  // Tirets de dialogue simples en début de ligne
  const dash = /^[-–]\s+/gm;
  n = 0;
  while ((m = dash.exec(text)) !== null && n < 10) { n++; push('info', m[0], `—${NBSP}`, 'Tiret cadratin — pour les dialogues.', m.index); }

  return issues;
}

/** Détecte les répétitions rapprochées (mots significatifs répétés). */
function detectRepetitions(chapter: Chapter): Issue[] {
  const issues: Issue[] = [];
  const words = chapter.content.toLowerCase().match(/[a-zàâäéèêëïîôöùûüç]{5,}/gi) || [];
  const STOP = new Set(['leurs', 'leur', 'dans', 'avec', 'pour', 'mais', 'comme', 'plus', 'cette', 'était', 'avait', 'quand', 'alors', 'tout', 'tous', 'toute', 'toutes', 'même', 'entre', 'après', 'avant', 'aussi', 'encore', 'depuis', 'devant', 'derrière']);
  const windowSize = 40;
  const reported = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (STOP.has(w) || reported.has(w)) continue;
    let count = 1;
    for (let j = i + 1; j < Math.min(words.length, i + windowSize); j++) {
      if (words[j] === w) count++;
    }
    if (count >= 3) {
      reported.add(w);
      issues.push({
        id: nextId(),
        category: 'style',
        severity: 'info',
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        original: w,
        suggestion: '',
        reason: `Le mot « ${w} » revient ${count} fois dans un court passage — variez le vocabulaire.`,
        status: 'pending',
        source: 'local',
      });
    }
    if (reported.size > 15) break;
  }
  return issues;
}

/** Exécute toutes les vérifications locales pour un chapitre. */
export function runLocalChecks(chapter: Chapter): Issue[] {
  return [
    ...detectAiTraces(chapter),
    ...detectTypography(chapter),
    ...detectRepetitions(chapter),
  ];
}
