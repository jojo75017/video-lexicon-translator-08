/**
 * Moteur d'export DOCX professionnel – Standard éditorial
 * 
 * Garantit un document Word prêt-publication :
 * - Hiérarchie claire des titres (HeadingLevel natifs Word)
 * - Propreté typographique (doubles espaces, sauts cassés, orphelins)
 * - Paragraphes équilibrés et fluides
 * - Page de titre, copyright, TDM, chapitres, conclusion
 * - Compatible KDP sans restructuration
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  convertInchesToTwip,
  UnderlineType,
  TabStopType,
  Tab,
  LevelFormat,
  SectionType,
} from 'docx';
import { saveAs } from 'file-saver';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { applyFrenchTypography } from '@/utils/frenchTypography';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface DocxChapter {
  title: string;
  content?: string;
  subChapters: Array<{
    title: string;
    content?: string;
  }>;
}

export interface DocxCharacter {
  name: string;
  role?: string;
  description?: string;
}

export interface DocxExportOptions {
  title: string;
  authorName?: string;
  preface?: string;
  conclusion?: string;
  epilogue?: string;
  chapters: DocxChapter[];
  characters?: DocxCharacter[];
  fontFamily?: string;
  fontSize?: number; // in pt (e.g. 12)
  includeTableOfContents?: boolean;
  includeCoverPage?: boolean;
  includePageNumbers?: boolean;
  includeCopyrightPage?: boolean;
  pageFormat?: '6x9' | 'a4' | 'letter';
}

export interface DocxOutlineEntry {
  number: number;
  title: string;
  subChapters: Array<{ number: string; title: string }>;
}

export interface DocxChapterAudit {
  number: number;
  title: string;
  wordCount: number;
  valid: boolean;
  issues: string[];
}

export interface DocxValidationResult {
  valid: boolean;
  readyCount: number;
  totalCount: number;
  chapters: DocxChapterAudit[];
}

// ═══════════════════════════════════════════════════════════
// NETTOYAGE TYPOGRAPHIQUE ÉDITORIAL
// ═══════════════════════════════════════════════════════════

/**
 * Décide si un saut de ligne simple doit être conservé
 * (vrai paragraphe/transition) ou fusionné (ligne orpheline cassée).
 */
function shouldKeepSingleLineBreak(previousLine: string, nextLine: string): boolean {
  const prev = previousLine.trim();
  const next = nextLine.trim();

  if (!prev || !next) return true;

  // Conserver pour les structures explicites
  if (/^#{1,6}\s/.test(next)) return true;
  if (/^[-–—•●▪▸►]\s+/.test(next)) return true;
  if (/^\d+[.)]\s+/.test(next)) return true;

  // Conserver un vrai changement de bloc narratif
  if (/[.!?…]$/.test(prev) && /^["'«(\[]?[A-ZÀ-ÖØ-Þ]/.test(next)) return true;

  // Conserver les lignes très courtes (souvent titres/interludes)
  if (prev.length <= 40 && !/[.!?…]$/.test(prev)) return true;

  return false;
}

/**
 * Normalise les espaces manquants entre phrases/mots collés.
 */
function normalizeBrokenSpacing(text: string): string {
  return text
    // caractères invisibles pouvant coller les mots
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // "Phrase.suivante" => "Phrase. suivante"
    .replace(/([.!?…])(?=[A-Za-zÀ-ÖØ-öø-ÿ«"'([{])/g, '$1 ')
    // ",mot" ";mot" ":mot" => ajout d'espace après ponctuation
    .replace(/([,;:])(?=[A-Za-zÀ-ÖØ-öø-ÿ«"'([{])/g, '$1 ')
    // Collage type "motSuivant" (heuristique minimale)
    .replace(/([a-zà-öø-ÿ])([A-ZÀ-ÖØ-Þ])/g, '$1 $2')
    // éviter les espaces multiples recréés par les règles ci-dessus
    .replace(/ {2,}/g, ' ');
}

/**
 * Nettoyage éditorial profond du texte avant insertion DOCX.
 * Va au-delà du textCleaner standard pour garantir la propreté typographique.
 */
/**
 * Pré-nettoyage JSON agressif avant le nettoyage standard.
 * Intercepte les structures JSON brutes AVANT que la typographie française
 * ne transforme les guillemets et rende les patterns indétectables.
 */
function preCleanJSON(raw: string): string {
  let text = raw;
  
  // Supprimer les blocs JSON complets enveloppant le contenu
  text = text.replace(/^\s*\{[\s\S]*?"(?:page[_ ]?de[_ ]?titre|préface|preface|chapitres?|conclusion|personnages|introduction|table[_ ]?des[_ ]?mati[eè]res)"[\s\S]*\}\s*$/gi, (match) => {
    const textValues: string[] = [];
    const valueRegex = /:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = valueRegex.exec(match)) !== null) {
      const val = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      if (val.length > 30 && !/^(?:page[_ ]?de[_ ]?titre|préface|preface|chapitres?|conclusion|personnages|introduction)/i.test(val)) {
        textValues.push(val);
      }
    }
    return textValues.length > 0 ? textValues.join('\n\n') : match;
  });

  // Supprimer les clés JSON avec guillemets (droits ou français) - liste exhaustive
  text = text.replace(/[«»"\u201C\u201D]?\s*(?:json)?(?:page[_ ]?de[_ ]?titre|pr[eé]face|table[_ ]?des[_ ]?mati[eè]res|chapitres?[_ ]?liste|texte[_ ]?int[eé]gral|conclusion|[eé]pilogue|personnages|introduction|[eé]l[eé]ments?|sous[_ ]?chapitres?|contenu|titre[_ ]?principal|titre|r[eé]sum[eé]|description|auteur|genre|th[eè]me|format|sections?)\s*[«»"\u201C\u201D]?\s*:\s*/gi, '');
  
  // Supprimer les clés JSON anglaises/techniques
  text = text.replace(/[«»"\u201C\u201D]?\s*(?:title|content|chapters?|sub[_ ]?chapters?|text|body|summary|description|author|name|role|numero|number|type|id)\s*[«»"\u201C\u201D]?\s*:\s*/gi, '');

  // Supprimer les structures de listes JSON françaises : [ « item1 », « item2 » ]
  text = text.replace(/\[\s*[«»"\u201C\u201D]\s*[^[\]]{0,60}\s*[«»"\u201C\u201D]\s*(?:,\s*[«»"\u201C\u201D]\s*[^[\]]{0,60}\s*[«»"\u201C\u201D]\s*)*\]/g, '');

  // Supprimer "json" isolé en début de ligne
  text = text.replace(/^\s*json\s*/gim, '');
  
  // Supprimer les balises de code markdown ```json ... ```
  text = text.replace(/```(?:json)?\s*/gi, '');
  
  // Supprimer crochets/accolades JSON orphelins
  text = text.replace(/^\s*[\[{]\s*$/gm, '');
  text = text.replace(/^\s*[\]}],?\s*$/gm, '');
  text = text.replace(/^,\s*/gm, '');
  
  // Supprimer les blocs terminaux type , « personnages » : [ {
  text = text.replace(/,?\s*[«»"\u201C\u201D]?\s*personnages\s*[«»"\u201C\u201D]?\s*:\s*\[[\s\S]*$/gi, '');
  
  // Supprimer les guillemets français orphelins autour de rien
  text = text.replace(/[«»]\s*[«»]/g, '');

  return text;
}

/**
 * Nettoie un titre de chapitre : si >150 car., c'est du JSON - on extrait le vrai titre
 */
function cleanChapterTitle(rawTitle: string): string {
  if (!rawTitle) return 'Sans titre';
  
  let title = preCleanJSON(rawTitle);
  title = cleanGeneratedText(title);
  
  // Si le titre est encore trop long, c'est du JSON résiduel
  if (title.length > 150) {
    // Chercher un pattern "titre Principal :" ou "titre :"
    const titleMatch = title.match(/titre\s*(?:principal)?\s*[:]\s*([^«»"\n]{5,80})/i);
    if (titleMatch) return titleMatch[1].trim();
    
    // Prendre la première phrase courte
    const firstSentence = title.match(/^([^.!?\n]{5,80})[.!?]/);
    if (firstSentence) return firstSentence[1].trim();
    
    return 'Sans titre';
  }
  
  // Retire les code fences et fragments JSON résiduels ("numero": 2, / "titre":)
  title = title
    .replace(/```(?:json|javascript|js|ts|typescript|md|markdown)?/gi, '')
    .replace(/```/g, '')
    .replace(/\b(?:numero|number|numéro|titre|title|nom|chapterTitle|heading|objectif|resume|summary|description|content|contenu)\s*["'»«]?\s*:\s*["'«]?\s*\d*\s*,?/gi, '')
    .replace(/[{}[\]"«»""]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Supprimer les numéros de chapitre redondants en début (avec OU sans séparateur)
  title = title.replace(/^\**\s*chapitre\s+\d+\s*[:–—\-.,)]*\s*/i, '');
  title = title.replace(/^\**\s*|\s*\**$/g, '').trim();
  // Ponctuation résiduelle en début/fin
  title = title.replace(/^[\s:–—\-,.]+|[\s:–—,.]+$/g, '').trim();

  // Un vrai titre est court : si ça ressemble à de la prose, on tente de le raccourcir
  // (les titres descriptifs non-fiction sont légitimes) avant d'abandonner.
  if (isProseLike(title)) {
    const shortened = shortenProseTitle(title);
    return shortened || 'Sans titre';
  }

  return title.trim() || 'Sans titre';
}

/** Réduit une phrase à un intitulé exploitable (première proposition, sans ponctuation finale). */
function shortenProseTitle(t: string): string | null {
  const s = (t || '').trim();
  if (!s) return null;
  const firstClause = (s.split(/(?<=[.!?…])\s+/)[0] || s)
    .split(/\s+[–—-]\s+/)[0]
    .replace(/[.!?…,;:\s]+$/, '')
    .trim();
  const words = firstClause.split(/\s+/).filter(Boolean);
  const candidate = words.length > 20 ? words.slice(0, 20).join(' ') : firstClause;
  if (candidate.length < 3) return null;
  return candidate.length > 120 ? `${candidate.slice(0, 117).trim()}…` : candidate;
}

/** Détecte un fragment de prose (phrase de contenu) plutôt qu'un titre. */
function isProseLike(t: string): boolean {
  const s = (t || '').trim();
  if (!s) return true;
  if (s.length > 120) return true;
  if (/[.!?]\s+\S/.test(s)) return true; // plusieurs phrases
  if (s.split(/\s+/).length > 20) return true;
  return false;
}


/** Un titre est "générique" s'il ne contient pas de vrai intitulé (ex: "Chapitre 2", "12", vide). */
function isGenericTitle(t: string | undefined | null): boolean {
  const n = (t || '').trim().replace(/^[\s:–—\-,.]+|[\s:–—\-,.]+$/g, '');
  return !n || /^chapitre\s*\d*$/i.test(n) || /^\d+$/.test(n) || /^sans titre$/i.test(n);
}



/** Retire un marqueur de chapitre redondant en début de contenu ("2, " / "2." / "Chapitre 2 –"). */
function stripLeadingChapterMarker(content: string, num: number): string {
  let t = (content || '').replace(/^[\s\u00A0]+/, '');
  // Retire un éventuel titre Markdown "# ..." ou "## ..." en tête
  t = t.replace(/^#{1,3}\s+[^\n]{0,120}\n+/, '');
  // Retire "Chapitre N : Titre" / "**Chapitre N — Titre**" en tête
  t = t.replace(new RegExp(`^\\*{0,2}\\s*(?:chapitre\\s*)?0*${num}\\s*[\\.,:\\-–—\\)]\\s*[^\\n]{0,120}\\*{0,2}\\s*\\n+`, 'i'), '');
  t = t.replace(new RegExp(`^(?:chapitre\\s*)?0*${num}\\s*[\\.,:\\-–—\\)]\\s*`, 'i'), '');
  t = t.replace(/^\*{0,2}\s*chapitre\s*\d+\s*[\.,:\-–—\)]?\s*[^\n]{0,120}\*{0,2}\s*\n+/i, '');
  t = t.replace(/^chapitre\s*\d+\s*[\.,:\-–—\)]?\s*/i, '');
  return t.replace(/^[\s\u00A0]+/, '');
}

/**
 * Extrait un titre "inline" placé en tête du contenu quand le champ titre est générique.
 * Gère uniquement des titres explicites : Markdown (# Titre), gras (**Titre**),
 * ou une première ligne courte isolée. Aucune heuristique sur la prose :
 * mieux vaut "Chapitre 4" qu'un début de phrase en guise de titre.
 */
function extractInlineTitle(body: string): { title: string; rest: string } | null {
  const trimmed = (body || '').replace(/^[\s\u00A0]+/, '');
  if (!trimmed) return null;

  const accept = (rawTitle: string, rest: string) => {
    const title = cleanChapterTitle(rawTitle);
    if (isGenericTitle(title) || isProseLike(title)) return null;
    if (rest.trim().length < 40) return null;
    return { title, rest: rest.replace(/^[\s\u00A0]+/, '') };
  };

  // 0) Markdown heading "# Titre"
  const mdHeading = trimmed.match(/^#{1,3}\s+([^\n]{4,110})\n+([\s\S]+)$/);
  if (mdHeading) {
    const r = accept(mdHeading[1], mdHeading[2]);
    if (r) return r;
  }

  // 0b) Gras Markdown "**Titre**" seul sur la première ligne
  const boldHeading = trimmed.match(/^\*\*([^\n*]{4,110})\*\*\s*\n+([\s\S]+)$/);
  if (boldHeading) {
    const r = accept(boldHeading[1], boldHeading[2]);
    if (r) return r;
  }

  // 1) Première ligne courte isolée (vrai retour à la ligne avant le corps)
  const nl = trimmed.indexOf('\n');
  if (nl > 4 && nl <= 90) {
    const r = accept(trimmed.slice(0, nl), trimmed.slice(nl));
    if (r) return r;
  }

  return null;
}

/** Calcule le titre affichable + le corps nettoyé d'un chapitre. */
function resolveChapter(
  chapter: { title: string; content?: string },
  index: number,
): { displayTitle: string; body: string } {
  let displayTitle = cleanChapterTitle(chapter.title);
  let body = stripLeadingChapterMarker(chapter.content || '', index + 1);

  if (isGenericTitle(displayTitle)) {
    const ext = extractInlineTitle(body);
    if (ext) {
      displayTitle = ext.title;
      body = ext.rest;
    } else {
      displayTitle = '';
    }
  } else {
    // Titre présent : évite qu'il soit répété en tête du corps (Markdown, gras, ou brut).
    const norm = (s: string) => s.toLowerCase().replace(/[«»"'*#]/g, '').replace(/\s+/g, ' ').trim();
    const nt = norm(displayTitle);
    const firstLineMatch = body.match(/^([^\n]{1,140})\n+([\s\S]*)$/);
    if (firstLineMatch && nt.length >= 4 && norm(firstLineMatch[1]).includes(nt)) {
      body = firstLineMatch[2].replace(/^[\s\u00A0]+/, '');
    }
  }

  return { displayTitle, body };
}

/** Retire les marqueurs qui ne constituent pas un contenu publiable. */
function meaningfulText(raw?: string): string {
  if (!raw) return '';
  return raw
    .replace(/\[[^\]]*(?:à\s*r[ée]diger|a\s*venir|à\s*venir|todo|placeholder|contenu)[^\]]*\]/gi, '')
    .replace(/\((?:contenu\s*)?à\s*r[ée]diger\)/gi, '')
    .replace(/```[a-z]*|```/gi, '')
    .replace(/[\s\u00A0]+/g, ' ')
    .trim();
}

function countMeaningfulWords(raw?: string): number {
  return meaningfulText(raw).split(/\s+/).filter(Boolean).length;
}

/** Audit bloquant : aucun brouillon incomplet ne doit sortir comme livre final. */
export function validateDocxChapters(chapters: DocxChapter[]): DocxValidationResult {
  const audits = (chapters || []).map((chapter, index) => {
    const number = index + 1;
    const rawTitle = chapter.title || '';
    const title = cleanChapterTitle(rawTitle);
    const subWords = (chapter.subChapters || []).reduce(
      (sum, sub) => sum + countMeaningfulWords(sub.content),
      0,
    );
    const words = countMeaningfulWords(chapter.content) + subWords;
    const issues: string[] = [];
    const embeddedNumber = rawTitle.match(/\bchapitre\s+(\d+)\b/i);

    if (isGenericTitle(title)) issues.push('Titre manquant ou générique');
    if (words === 0) issues.push('Chapitre vide');
    if (embeddedNumber && Number(embeddedNumber[1]) !== number) {
      issues.push(`Numéro incohérent : le titre indique chapitre ${embeddedNumber[1]}`);
    }
    if (/```|[\[{]\s*"?(?:numero|number|titre|title|content)"?\s*:/i.test(rawTitle)) {
      issues.push('Artefact JSON ou Markdown dans le titre');
    }

    return { number, title, wordCount: words, valid: issues.length === 0, issues };
  });

  const readyCount = audits.filter((chapter) => chapter.valid).length;
  return {
    valid: audits.length > 0 && readyCount === audits.length,
    readyCount,
    totalCount: audits.length,
    chapters: audits,
  };
}

/** Source unique du sommaire et des chapitres exportés. */
function prepareRenderableChapters(chapters: DocxChapter[], expectedCount?: number) {
  const seenContent = new Set<string>();
  const seenStubTitles = new Set<string>();

  const prepared = (chapters || [])
    .map((chapter, sourceIndex) => {
      const resolved = resolveChapter(chapter, sourceIndex);
      const validSubChapters = (chapter.subChapters || []).filter((sub) => meaningfulText(sub.content).length > 0);
      return { chapter: { ...chapter, subChapters: validSubChapters }, ...resolved };
    })
    .map((entry) => {
      const subContent = entry.chapter.subChapters.reduce(
        (total, sub) => total + meaningfulText(sub.content).length,
        0,
      );
      const hasContent = meaningfulText(entry.body).length > 0 || subContent > 0;
      const normalizedTitle = (entry.displayTitle || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const signature = meaningfulText(entry.body).slice(0, 300).toLowerCase().replace(/\s+/g, ' ').trim();

      // Anti-doublon : deux fois le même chapitre (même texte) = une seule entrée.
      let keep = true;
      if (hasContent && signature) {
        if (seenContent.has(signature)) keep = false;
        else seenContent.add(signature);
      }
      // Un chapitre vide qui répète le titre d'un autre chapitre vide est un artefact de fusion.
      if (keep && !hasContent && normalizedTitle) {
        if (seenStubTitles.has(normalizedTitle)) keep = false;
        else seenStubTitles.add(normalizedTitle);
      }

      // Un chapitre sans texte reste dans le livre (zone à compléter) : on ne perd jamais de chapitre.
      return { ...entry, hasContent, keep, isStub: !hasContent };
    })
    .filter((entry) => entry.keep);

  // Plafond dur : jamais plus de chapitres que ce que l'auteur a demandé.
  const capped = expectedCount && expectedCount > 0 ? prepared.slice(0, expectedCount) : prepared;

  return capped.map((entry, index) => ({ ...entry, num: index + 1 }));
}



export function getDocxOutline(chapters: DocxChapter[], expectedCount?: number): DocxOutlineEntry[] {
  return prepareRenderableChapters(chapters, expectedCount).map(({ chapter, num, displayTitle }) => ({

    number: num,
    title: isGenericTitle(displayTitle) ? `Chapitre ${num}` : `Chapitre ${num} – ${displayTitle}`,
    subChapters: chapter.subChapters
      .map((sub, subIndex) => {
        const title = cleanChapterTitle(sub.title);
        return isGenericTitle(title) ? null : { number: `${num}.${subIndex + 1}`, title };
      })
      .filter((entry): entry is { number: string; title: string } => entry !== null),
  }));
}


function editorialClean(raw: string): string {
  if (!raw) return '';

  // 0. Pré-nettoyage JSON AVANT le nettoyage standard
  let text = cleanGeneratedText(preCleanJSON(raw));

  // 1. Normaliser les retours Windows et les espaces cassés
  text = text.replace(/\r\n/g, '\n');
  text = normalizeBrokenSpacing(text);

  // 2. Fusionner intelligemment les lignes orphelines
  const lines = text.split('\n');
  const rebuilt: string[] = [];

  for (const currentLine of lines) {
    const normalizedLine = currentLine.replace(/^ +| +$/g, '');

    if (rebuilt.length === 0) {
      rebuilt.push(normalizedLine);
      continue;
    }

    const previousLine = rebuilt[rebuilt.length - 1];

    if (!previousLine || !normalizedLine) {
      rebuilt.push(normalizedLine);
      continue;
    }

    if (shouldKeepSingleLineBreak(previousLine, normalizedLine)) {
      rebuilt.push(normalizedLine);
    } else {
      rebuilt[rebuilt.length - 1] = `${previousLine} ${normalizedLine}`;
    }
  }

  text = rebuilt.join('\n');

  // 3. Supprimer les triples+ sauts de ligne
  text = text.replace(/\n{3,}/g, '\n\n');

  // 4. Supprimer les doubles espaces
  text = text.replace(/ {2,}/g, ' ');

  // 5. Supprimer les espaces en début/fin de ligne
  text = text.replace(/^ +| +$/gm, '');

  // 6. Supprimer les lignes ne contenant que des espaces
  text = text.replace(/^\s+$/gm, '');

  // 7. Supprimer les artefacts markdown résiduels qui ne doivent pas apparaître dans le DOCX
  // (les titres # sont traités séparément dans buildContentParagraphs)
  // Supprimer les séparateurs --- *** ===
  text = text.replace(/^[=\-_*]{3,}\s*$/gm, '');
  // Supprimer les balises HTML résiduelles
  text = text.replace(/<\/?(?:br|p|div|span|h[1-6])\s*\/?>/gi, '\n');
  // Supprimer les images markdown résiduelles
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Supprimer les liens markdown mais garder le texte
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // 8. Typographie française professionnelle
  text = applyFrenchTypography(text);

  return text.trim();
}

/**
 * Découpe le texte nettoyé en paragraphes exploitables.
 * Filtre les paragraphes vides et les artefacts.
 */
function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];

  const cleaned = editorialClean(text);
  const lines = cleaned.split('\n');
  const paragraphs: string[] = [];
  let current = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (current.trim()) paragraphs.push(current.trim());
      current = '';
      continue;
    }

    if (!current) {
      current = line;
      continue;
    }

    // Si une nouvelle phrase forte démarre sur une nouvelle ligne,
    // on considère qu'il s'agit d'un nouveau paragraphe éditorial.
    if (/[.!?…]$/.test(current) && /^["'«(\[]?[A-ZÀ-ÖØ-Þ]/.test(line)) {
      paragraphs.push(current.trim());
      current = line;
      continue;
    }

    current = `${current} ${line}`;
  }

  if (current.trim()) paragraphs.push(current.trim());

  return paragraphs.filter(p => p.length > 0 && p !== '---' && p !== '***' && !p.match(/^[=\-_]{3,}$/));
}

// ═══════════════════════════════════════════════════════════
// PARSEUR MARKDOWN → TEXTRUNS WORD
// ═══════════════════════════════════════════════════════════

function parseToTextRuns(text: string, sizeHalfPt: number, font: string): TextRun[] {
  if (!text || text.trim() === '') {
    return [new TextRun({ text: '', size: sizeHalfPt, font })];
  }

  const runs: TextRun[] = [];
  const tokenRegex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|__[\s\S]+?__|~~[\s\S]+?~~|<u>[\s\S]+?<\/u>|\*[^*\n]+?\*|_[^_\n]+?_)/g;

  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const normal = text.substring(lastIndex, match.index);
      if (normal) runs.push(new TextRun({ text: normal, size: sizeHalfPt, font }));
    }

    const m = match[0];
    if (m.startsWith('***') && m.endsWith('***')) {
      runs.push(new TextRun({ text: m.slice(3, -3), bold: true, italics: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('**') && m.endsWith('**')) {
      runs.push(new TextRun({ text: m.slice(2, -2), bold: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('__') && m.endsWith('__')) {
      runs.push(new TextRun({ text: m.slice(2, -2), bold: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('~~') && m.endsWith('~~')) {
      runs.push(new TextRun({ text: m.slice(2, -2), underline: { type: UnderlineType.SINGLE }, size: sizeHalfPt, font }));
    } else if (m.startsWith('<u>') && m.endsWith('</u>')) {
      runs.push(new TextRun({ text: m.slice(3, -4), underline: { type: UnderlineType.SINGLE }, size: sizeHalfPt, font }));
    } else if (m.startsWith('*') && m.endsWith('*')) {
      runs.push(new TextRun({ text: m.slice(1, -1), italics: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('_') && m.endsWith('_')) {
      runs.push(new TextRun({ text: m.slice(1, -1), italics: true, size: sizeHalfPt, font }));
    }

    lastIndex = match.index + m.length;
  }

  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex);
    if (remaining) runs.push(new TextRun({ text: remaining, size: sizeHalfPt, font }));
  }

  return runs.length > 0 ? runs : [new TextRun({ text, size: sizeHalfPt, font })];
}

/**
 * Détecte si un paragraphe est une liste à puces ou numérotée.
 */
function detectListItem(text: string): { type: 'bullet' | 'number' | 'none'; content: string; number?: number } {
  // Puces : •, -, –, —, ●, ▪, ▸, ►
  const bulletMatch = text.match(/^[\s]*[-–—•●▪▸►]\s+(.*)/);
  if (bulletMatch) return { type: 'bullet', content: bulletMatch[1] };

  // Numérotées : 1. ou 1)
  const numberMatch = text.match(/^[\s]*(\d+)[.\)]\s+(.*)/);
  if (numberMatch) return { type: 'number', content: numberMatch[2], number: parseInt(numberMatch[1]) };

  return { type: 'none', content: text };
}

// ═══════════════════════════════════════════════════════════
// CONSTRUCTION DES PARAGRAPHES WORD
// ═══════════════════════════════════════════════════════════

function buildContentParagraphs(
  rawContent: string,
  sizeHalfPt: number,
  font: string,
): Paragraph[] {
  const paragraphs = splitIntoParagraphs(rawContent);
  const result: Paragraph[] = [];

  for (const para of paragraphs) {
    // Filtrer les lignes qui ressemblent à des clés/structures JSON résiduelles
    if (/^[«»"\u201C\u201D]?\s*(?:json|page[_ ]?de[_ ]?titre|pr[eé]face|chapitres?[_ ]?liste|texte[_ ]?int[eé]gral|[eé]l[eé]ments?|sous[_ ]?chapitres?|personnages|contenu|titre[_ ]?principal)\s*[«»"\u201C\u201D]?\s*:?\s*$/i.test(para)) {
      continue;
    }
    // Ignorer les lignes très courtes qui sont juste des accolades/crochets
    if (/^[\s{}\[\],]+$/.test(para)) {
      continue;
    }

    // Vérifier si c'est un sous-titre inline (ligne courte en gras ou commençant par #)
    const headingMatch = para.match(/^#{1,3}\s+(.*)/);
    if (headingMatch) {
      // Ne pas traiter comme heading si ça ressemble à du JSON
      const headingText = headingMatch[1];
      if (/^[«»"]?\s*(?:json|titre|content|chapitres?)/i.test(headingText)) {
        continue;
      }
      result.push(new Paragraph({
        children: [new TextRun({ text: headingText, bold: true, size: Math.round(sizeHalfPt * 1.2), font })],
        spacing: { before: 360, after: 200 },
      }));
      continue;
    }

    // Traiter les lignes individuelles pour détecter les listes
    const lines = para.split('\n');
    const isMultiLineList = lines.length > 1 && lines.every(l => detectListItem(l).type !== 'none');

    if (isMultiLineList) {
      // Bloc de liste
      for (const line of lines) {
        const item = detectListItem(line);
        const bullet = item.type === 'number' ? `${item.number}. ` : '•  ';
        result.push(new Paragraph({
          children: parseToTextRuns(`${bullet}${item.content}`, sizeHalfPt, font),
          spacing: { after: 80 },
          indent: { left: convertInchesToTwip(0.4), hanging: convertInchesToTwip(0.25) },
        }));
      }
      // Espacement après la liste
      result.push(new Paragraph({ spacing: { after: 120 } }));
    } else {
      // Vérifier si c'est un item de liste isolé
      const singleItem = detectListItem(para);
      if (singleItem.type !== 'none') {
        const bullet = singleItem.type === 'number' ? `${singleItem.number}. ` : '•  ';
        result.push(new Paragraph({
          children: parseToTextRuns(`${bullet}${singleItem.content}`, sizeHalfPt, font),
          spacing: { after: 120 },
          indent: { left: convertInchesToTwip(0.4), hanging: convertInchesToTwip(0.25) },
        }));
      } else {
        // Paragraphe standard avec alinéa et justification
        result.push(new Paragraph({
          children: parseToTextRuns(para, sizeHalfPt, font),
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 360 }, // Interligne 1.5
          indent: { firstLine: convertInchesToTwip(0.3) },
        }));
      }
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════
// GÉNÉRATEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════

export async function generateProfessionalDocx(options: DocxExportOptions, previewMode = false): Promise<Blob> {
  const {
    title,
    authorName = '',
    preface = '',
    conclusion = '',
    epilogue = '',
    chapters,
    characters = [],
    fontFamily = 'Georgia',
    fontSize = 12,
    includeTableOfContents = true,
    includeCoverPage = true,
    includePageNumbers = true,
    includeCopyrightPage = true,
    pageFormat = '6x9',
  } = options;

  const audit = validateDocxChapters(chapters);
  if (!audit.valid) {
    const details = audit.chapters
      .filter((chapter) => !chapter.valid)
      .map((chapter) => `Chapitre ${chapter.number} : ${chapter.issues.join(', ')}`)
      .join(' ; ');
    // On n'empêche jamais le téléchargement : le DOCX est généré avec les zones à compléter.
    console.warn(`[DOCX] Manuscrit incomplet, export généré avec avertissements. ${details}`);
  }


  const font = fontFamily;
  const baseSize = fontSize * 2; // half-points
  const titleSize = 72; // 36pt toujours
  const chapterTitleSize = Math.round(fontSize * 2.5);
  const subTitleSize = Math.round(fontSize * 1.75);

  // Dimensions de page
  const pageDimensions = {
    '6x9': { width: 6, height: 9, marginTop: 0.75, marginBottom: 0.75, marginLeft: 0.75, marginRight: 0.5 },
    'a4': { width: 8.27, height: 11.69, marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1 },
    'letter': { width: 8.5, height: 11, marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1 },
  }[pageFormat];

  const children: Paragraph[] = [];

  // ═══ PAGE DE TITRE ═══
  if (includeCoverPage) {
    children.push(new Paragraph({ spacing: { before: 4000 } }));
    children.push(new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: titleSize, font })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: '─────────────────', size: 24, color: '999999' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }));
    if (authorName) {
      children.push(new Paragraph({
        children: [new TextRun({ text: authorName, italics: true, size: 36, font })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }));
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ PAGE DE COPYRIGHT ═══
  if (includeCopyrightPage) {
    children.push(new Paragraph({ spacing: { before: 6000 } }));
    const year = new Date().getFullYear();
    const copyrightLines = [
      `© ${year} ${authorName || 'Auteur'}. Tous droits réservés.`,
      '',
      'Aucune partie de cette publication ne peut être reproduite, stockée dans un système de récupération ou transmise sous quelque forme ou par quelque moyen que ce soit sans l\'autorisation écrite préalable de l\'auteur.',
      '',
      `Première édition : ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
    ];
    for (const line of copyrightLines) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line, size: 20, font, color: '666666' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: line === '' ? 200 : 80 },
      }));
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ CHAPITRES RETENUS (numérotation continue, sans trous) ═══
  const renderChapters = prepareRenderableChapters(chapters, expectedChapterCount);

  if (renderChapters.length === 0) {
    throw new Error("Export impossible : aucun chapitre rédigé n'a été détecté. Rechargez le manuscrit ou générez ses chapitres avant de télécharger le DOCX.");
  }


  // ═══ TABLE DES MATIÈRES ═══

  if (includeTableOfContents) {

    children.push(new Paragraph({
      children: [new TextRun({ text: 'TABLE DES MATIÈRES', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }));

    if (preface) {
      children.push(new Paragraph({
        children: [new TextRun({ text: 'Préface', size: baseSize, font })],
        spacing: { after: 120 },
      }));
    }

    renderChapters.forEach(({ chapter, num, displayTitle }) => {
      const safeTocTitle = isGenericTitle(displayTitle)
        ? `Chapitre ${num}`
        : `Chapitre ${num} – ${displayTitle}`;
      children.push(new Paragraph({
        children: [new TextRun({
          text: safeTocTitle,
          size: baseSize,
          font,
        })],
        spacing: { after: 100 },
        // Retrait négatif : les titres longs se replient alignés sous le premier mot
        indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.35) },
      }));

      chapter.subChapters.forEach((sub, subIdx) => {
        const subTitle = cleanChapterTitle(sub.title);
        if (isGenericTitle(subTitle)) return;
        children.push(new Paragraph({
          children: [new TextRun({
            text: `${num}.${subIdx + 1}  ${subTitle}`,
            size: Math.round(baseSize * 0.9),
            font,
            color: '555555',
          })],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.4) },
        }));
      });
    });


    if (conclusion) {
      children.push(new Paragraph({
        children: [new TextRun({ text: 'Conclusion', size: baseSize, font })],
        spacing: { after: 120 },
      }));
    }

    if (characters.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: 'Personnages', size: baseSize, font })],
        spacing: { after: 120 },
      }));
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ PRÉFACE ═══
  if (preface) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'PRÉFACE', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    children.push(...buildContentParagraphs(preface, baseSize, font));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ CHAPITRES ═══
  renderChapters.forEach(({ chapter, num, displayTitle, body }, position) => {
    // Un seul vrai Heading 1 contient numéro + titre : le sommaire Word reste cohérent.
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `CHAPITRE ${num}`, bold: true, size: subTitleSize, font, color: '888888' }),
        new TextRun({ text: displayTitle.toUpperCase(), bold: true, size: chapterTitleSize, font, break: 1 }),
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 600 },
    }));

    // Contenu du chapitre
    if (body && body.trim().length > 0) {
      children.push(...buildContentParagraphs(body, baseSize, font));
    } else if (!(chapter.subChapters || []).some((sub) => (sub.content || '').trim().length > 0)) {
      children.push(new Paragraph({
        children: [new TextRun({ text: '[Contenu à rédiger]', italics: true, size: baseSize, font, color: '888888' })],
        spacing: { after: 240 },
      }));
    }



    // Sous-chapitres
    (chapter.subChapters || []).forEach((sub, subIdx) => {
      const subTitle = cleanChapterTitle(sub.title);
      const subLabel = isGenericTitle(subTitle) ? `${num}.${subIdx + 1}` : `${num}.${subIdx + 1}  ${subTitle}`;

      // Sous-chapitre vide : on saute (pas de "[Contenu à rédiger]" dans un livre vendu)
      if (!sub.content || sub.content.trim().length === 0) return;

      // Séparateur visuel subtil avant le sous-chapitre
      children.push(new Paragraph({ spacing: { before: 240 } }));

      children.push(new Paragraph({
        children: [new TextRun({
          text: subLabel,
          bold: true,
          size: subTitleSize,
          font,
        })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 480, after: 240 },
      }));

      children.push(...buildContentParagraphs(sub.content, baseSize, font));
    });

    // Saut de page entre chapitres
    if (position < renderChapters.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });


  // ═══ CONCLUSION ═══
  if (conclusion) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'CONCLUSION', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    children.push(...buildContentParagraphs(conclusion, baseSize, font));
  }

  // ═══ ÉPILOGUE ═══
  if (epilogue) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'ÉPILOGUE', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    children.push(...buildContentParagraphs(epilogue, baseSize, font));
  }

  // ═══ PERSONNAGES ═══
  if (characters.length > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'PERSONNAGES', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));

    for (const character of characters) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: character.name || 'Personnage', bold: true, size: subTitleSize, font }),
          ...(character.role ? [new TextRun({ text: `  (${character.role})`, italics: true, size: baseSize, font, color: '666666' })] : []),
        ],
        spacing: { before: 240, after: 80 },
      }));

      if (character.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: editorialClean(character.description), size: baseSize, font, color: '444444' })],
          spacing: { after: 200 },
          indent: { left: convertInchesToTwip(0.2) },
        }));
      }
    }
  }

  // ═══ PAGES DE FIN (BACK MATTER) ═══
  const authorDisplay = (authorName || '').trim();
  const authorForText = authorDisplay || "l'auteur";

  const backPage = (heading: string, paragraphs: string[]) => {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: heading, bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    paragraphs.forEach((p) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: p, size: baseSize, font })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200, line: 360 },
      }));
    });
  };

  // 1/ Remerciements
  backPage('REMERCIEMENTS', [
    `Merci à vous, cher lecteur, d'avoir accordé votre temps et votre confiance à « ${title} ».`,
    `Ce livre n'aurait pu voir le jour sans le soutien de celles et ceux qui ont accompagné ${authorForText} tout au long de ce projet : famille, proches et lecteurs fidèles. Votre présence et vos encouragements ont nourri chaque page.`,
    `Du fond du cœur, merci.`,
  ]);

  // 2/ Mot de l'auteur
  backPage("MOT DE L'AUTEUR", [
    `J'ai écrit ce livre avec l'envie sincère de vous transmettre quelque chose d'utile, et j'espère qu'il aura trouvé un écho en vous.`,
    `Si ces pages vous ont apporté ne serait-ce qu'une idée, une émotion ou une nouvelle perspective, alors ma mission est accomplie.`,
    `Au plaisir de vous retrouver dans un prochain ouvrage.`,
    authorDisplay ? `— ${authorDisplay}` : '— L\'auteur',
  ]);

  // 3/ Demande d'avis (courtoise)
  backPage('UN DERNIER MOT', [
    `Si vous avez aimé ce livre, accepteriez-vous de prendre un instant pour partager votre avis ?`,
    `Un simple commentaire, déposé en toute liberté et sans aucune obligation, aide énormément les lecteurs à découvrir cet ouvrage et encourage ${authorForText} à poursuivre ce travail.`,
    `Quelques mots suffisent, et chaque retour est reçu avec une profonde gratitude.`,
    `Merci infiniment pour votre lecture et votre bienveillance.`,
  ]);

  // ═══ CONSTRUCTION DU DOCUMENT ═══
  const doc = new Document({
    creator: authorName || 'Auteur',
    title: title,
    description: `Ebook – ${title}`,
    styles: {
      default: {
        document: {
          run: {
            size: baseSize,
            font: font,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: chapterTitleSize, bold: true, font },
          paragraph: { spacing: { before: 600, after: 300 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: subTitleSize, bold: true, font },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: {
            width: convertInchesToTwip(pageDimensions.width),
            height: convertInchesToTwip(pageDimensions.height),
          },
          margin: {
            top: convertInchesToTwip(pageDimensions.marginTop),
            right: convertInchesToTwip(pageDimensions.marginRight),
            bottom: convertInchesToTwip(pageDimensions.marginBottom),
            left: convertInchesToTwip(pageDimensions.marginLeft),
          },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: title, size: 18, font, color: 'AAAAAA', italics: true })],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      footers: includePageNumbers ? {
        default: new Footer({
          children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: 'Georgia' })],
            alignment: AlignmentType.CENTER,
          })],
        }),
      } : undefined,
      children,
    }],
  });

  return Packer.toBlob(doc);
}

/**
 * Export et téléchargement direct.
 */
export async function exportProfessionalDocx(options: DocxExportOptions): Promise<void> {
  const blob = await generateProfessionalDocx(options);
  const safeName = (options.title || 'Mon-Ebook').replace(/[^a-zA-Z0-9àâäéèêëïîôöùûüçÀ-ÿ\s-]/gi, '').trim().replace(/\s+/g, '_');
  saveAs(blob, `${safeName}_KDP.docx`);
}
