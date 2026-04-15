/**
 * Service d'audit pré-export DOCX
 * Analyse le contenu avant export et retourne un rapport de conformité
 */

export interface AuditIssue {
  type: 'json_residual' | 'title_too_long' | 'empty_chapter' | 'stuck_words' | 'markdown_artifacts' | 'duplicate_content';
  severity: 'critical' | 'warning' | 'info';
  chapter?: string;
  message: string;
}

export interface AuditReport {
  score: number;
  status: 'conforme' | 'problèmes' | 'critique';
  issues: AuditIssue[];
  canExport: boolean;
  totalChecks: number;
  passedChecks: number;
}

interface AuditInput {
  title: string;
  authorName?: string;
  preface?: string;
  conclusion?: string;
  epilogue?: string;
  chapters: Array<{
    title: string;
    content?: string;
    subChapters: Array<{ title: string; content?: string }>;
  }>;
}

// Patterns JSON résiduels
const JSON_KEY_PATTERNS = [
  /[«»"\u201C\u201D]\s*(?:json|page[_ ]?de[_ ]?titre|pr[eé]face|table[_ ]?des[_ ]?mati[eè]res|chapitres?[_ ]?liste|texte[_ ]?int[eé]gral|conclusion|[eé]pilogue|personnages|introduction|[eé]l[eé]ments?|sous[_ ]?chapitres?|contenu|titre[_ ]?principal)\s*[«»"\u201C\u201D]?\s*:/gi,
  /"(?:title|content|chapters?|sub[_ ]?chapters?|text|body|summary|description|author|name|role|numero)"\s*:/gi,
  /^\s*\{[\s]*"/m,
  /^\s*\[[\s]*\{/m,
  /^\s*\[[\s]*[«»"]/m,
];

const MARKDOWN_PATTERNS = [
  /^#{1,6}\s/m,
  /\*{2,}[^*]+\*{2,}/,
  /```/,
  /^\s*[-*]\s+/m,
];

function detectJsonResiduals(text: string, location: string): AuditIssue[] {
  if (!text) return [];
  const issues: AuditIssue[] = [];

  for (const pattern of JSON_KEY_PATTERNS) {
    const matches = text.match(new RegExp(pattern.source, pattern.flags));
    if (matches && matches.length > 0) {
      issues.push({
        type: 'json_residual',
        severity: 'critical',
        chapter: location,
        message: `JSON résiduel détecté : "${matches[0].substring(0, 60).trim()}…"`,
      });
    }
  }

  // Accolades/crochets JSON orphelins
  const braces = (text.match(/[{}[\]]/g) || []).length;
  if (braces > 4) {
    issues.push({
      type: 'json_residual',
      severity: 'warning',
      chapter: location,
      message: `${braces} accolades/crochets détectés — possible structure JSON`,
    });
  }

  return issues;
}

function detectMarkdownArtifacts(text: string, location: string): AuditIssue[] {
  if (!text) return [];
  const issues: AuditIssue[] = [];

  for (const pattern of MARKDOWN_PATTERNS) {
    if (pattern.test(text)) {
      issues.push({
        type: 'markdown_artifacts',
        severity: 'warning',
        chapter: location,
        message: `Artefact markdown détecté (${pattern.source.substring(0, 20)})`,
      });
      break; // un seul avertissement par section
    }
  }

  return issues;
}

function detectStuckWords(text: string, location: string): AuditIssue[] {
  if (!text) return [];
  const stuckPattern = /([.!?…,;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g;
  const matches = text.match(stuckPattern);
  if (matches && matches.length > 3) {
    return [{
      type: 'stuck_words',
      severity: 'warning',
      chapter: location,
      message: `${matches.length} mots collés à la ponctuation`,
    }];
  }
  return [];
}

export function runDocxAudit(input: AuditInput): AuditReport {
  const issues: AuditIssue[] = [];
  let totalChecks = 0;
  let failedChecks = 0;

  // 1. Vérifier les titres
  for (let i = 0; i < input.chapters.length; i++) {
    const ch = input.chapters[i];
    totalChecks++;

    if (ch.title.length > 150) {
      issues.push({
        type: 'title_too_long',
        severity: 'critical',
        chapter: `Chapitre ${i + 1}`,
        message: `Titre trop long (${ch.title.length} car.) — contient probablement du JSON`,
      });
      failedChecks++;
    }

    for (let j = 0; j < ch.subChapters.length; j++) {
      totalChecks++;
      if (ch.subChapters[j].title.length > 150) {
        issues.push({
          type: 'title_too_long',
          severity: 'critical',
          chapter: `Chapitre ${i + 1}, sous-chapitre ${j + 1}`,
          message: `Titre de sous-chapitre trop long (${ch.subChapters[j].title.length} car.)`,
        });
        failedChecks++;
      }
    }
  }

  // 2. Vérifier chapitres vides
  for (let i = 0; i < input.chapters.length; i++) {
    const ch = input.chapters[i];
    totalChecks++;
    const hasContent = (ch.content && ch.content.trim().length > 50) ||
      ch.subChapters.some(s => s.content && s.content.trim().length > 50);
    if (!hasContent) {
      issues.push({
        type: 'empty_chapter',
        severity: 'warning',
        chapter: `Chapitre ${i + 1}`,
        message: `Chapitre vide ou quasi-vide — "${ch.title.substring(0, 40)}"`,
      });
      failedChecks++;
    }
  }

  // 3. Vérifier JSON résiduel dans tout le contenu
  const sections = [
    { text: input.preface || '', location: 'Préface' },
    { text: input.conclusion || '', location: 'Conclusion' },
    { text: input.epilogue || '', location: 'Épilogue' },
  ];

  for (let i = 0; i < input.chapters.length; i++) {
    const ch = input.chapters[i];
    sections.push({ text: ch.title, location: `Titre Chapitre ${i + 1}` });
    sections.push({ text: ch.content || '', location: `Chapitre ${i + 1}` });
    for (let j = 0; j < ch.subChapters.length; j++) {
      sections.push({ text: ch.subChapters[j].content || '', location: `Chapitre ${i + 1}.${j + 1}` });
    }
  }

  for (const section of sections) {
    totalChecks++;
    const jsonIssues = detectJsonResiduals(section.text, section.location);
    if (jsonIssues.length > 0) {
      issues.push(...jsonIssues);
      failedChecks++;
    }

    const mdIssues = detectMarkdownArtifacts(section.text, section.location);
    issues.push(...mdIssues);

    const stuckIssues = detectStuckWords(section.text, section.location);
    issues.push(...stuckIssues);
  }

  // Calculer le score
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  const rawScore = Math.max(0, 100 - (criticalCount * 20) - (warningCount * 5));
  const score = Math.round(rawScore);

  const status: AuditReport['status'] =
    criticalCount > 0 ? 'critique' :
    warningCount > 3 ? 'problèmes' :
    'conforme';

  return {
    score,
    status,
    issues,
    canExport: criticalCount === 0,
    totalChecks,
    passedChecks: totalChecks - failedChecks,
  };
}
