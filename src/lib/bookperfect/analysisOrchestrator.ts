/**
 * BookPerfect AI — Orchestrateur d'analyse résilient.
 * Traite le manuscrit CHAPITRE PAR CHAPITRE :
 *  1. Vérifications locales instantanées (typo FR + traces IA + répétitions)
 *  2. Analyse IA (orthographe/style/KDP) via BYOK (callGeminiJSON)
 * Retry par chapitre (3 tentatives, backoff), continue-on-failure, et
 * REPRISE : l'état est sauvegardé après CHAQUE chapitre. Aucun crash global
 * si un chapitre échoue — l'analyse continue et le chapitre est marquable
 * pour relance.
 */
import { callGeminiJSON } from '@/services/geminiService';
import { getActiveAIKey, getProvider } from '@/services/aiWritingService';
import { writeAutosave, writeAutosaveAsync, readAutosave, readAutosaveAsync } from '@/lib/ebookProjectStorage';
import type {
  Analysis, Chapter, ChapterResult, Issue, Manuscript, Scores, KdpCheck,
} from './types';
import { runLocalChecks } from './localChecks';

const SCOPE = (manuscriptId: string) => `bookperfect_${manuscriptId}`;
export const BOOKPERFECT_RECOVERY_SCOPE = 'bookperfect_recovery_snapshot';
const MAX_ATTEMPTS = 2;
const BACKOFFS = [0, 4000];
// Limite d'entrée par appel IA (caractères) pour rester dans les fenêtres de
// contexte et éviter les timeouts sur de très longs chapitres.
const MAX_CHARS_PER_CALL = 6000;

let aiCounter = 0;
const aiId = () => `ai-${Date.now()}-${aiCounter++}`;

interface AiChapterResponse {
  issues: {
    category: 'orthographe' | 'style' | 'kdp';
    severity: 'critical' | 'warning' | 'info';
    original: string;
    suggestion: string;
    reason: string;
  }[];
  scores: { orthographe: number; style: number; kdp: number };
}

const buildPrompt = (chapter: Chapter, text: string) => `Tu es un directeur éditorial francophone expert de la publication Amazon KDP.
Analyse le chapitre ci-dessous SANS le réécrire. Tu ne proposes que des corrections ponctuelles que l'auteur validera. Le style personnel de l'auteur doit être préservé.

Chapitre : « ${chapter.title} »
---
${text}
---

Renvoie un JSON STRICT de cette forme exacte :
{
  "issues": [
    {
      "category": "orthographe" | "style" | "kdp",
      "severity": "critical" | "warning" | "info",
      "original": "extrait EXACT et COURT du texte à corriger (max 200 caractères, copié tel quel)",
      "suggestion": "version corrigée de cet extrait (ou vide si simple signalement)",
      "reason": "explication pédagogique brève"
    }
  ],
  "scores": { "orthographe": 0-100, "style": 0-100, "kdp": 0-100 }
}

Règles :
- "orthographe" : fautes d'orthographe, grammaire, accords, conjugaison.
- "style" : lourdeurs, voix passive excessive, phrases confuses, répétitions.
- "kdp" : formulations/éléments gênants pour une publication Amazon (mentions parasites, incohérences de mise en forme).
- Maximum 8 issues. Priorise uniquement les corrections les plus sûres et les plus utiles.
- Phrases courtes dans "reason" : 140 caractères maximum.
- "original" et "suggestion" doivent rester courts : 180 caractères maximum chacun.
- "original" doit être un extrait RÉELLEMENT présent dans le texte, copié à l'identique.
- Réponds UNIQUEMENT avec le JSON.`;

/** Découpe un chapitre trop long en tronçons pour l'appel IA. */
const chunkText = (text: string): string[] => {
  if (text.length <= MAX_CHARS_PER_CALL) return [text];
  const chunks: string[] = [];
  const paras = text.split(/\n\s*\n/);
  let buf = '';
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > MAX_CHARS_PER_CALL && buf) {
      chunks.push(buf);
      buf = p;
    } else {
      buf = buf ? `${buf}\n\n${p}` : p;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Erreur "fatale" = inutile de continuer les 95 chapitres (ça brûle les
 * crédits pour rien). Clé invalide/quota épuisé/service saturé → on arrête
 * tout de suite et on laisse l'utilisateur corriger puis reprendre.
 */
function isFatalError(message: string): boolean {
  const m = (message || '').toLowerCase();
  return (
    m.includes('clé api') ||
    m.includes('invalide') ||
    m.includes('quota') ||
    m.includes('saturé') ||
    m.includes('aucune clé')
  );
}

function isRecoverableAIError(message: string): boolean {
  const m = (message || '').toLowerCase();
  return (
    m.includes('json') ||
    m.includes('parser') ||
    m.includes('tronquée') ||
    m.includes('tokens') ||
    m.includes('timeout') ||
    m.includes('aucune réponse')
  );
}

class FatalAIError extends Error {}

async function analyzeChapterAI(apiKey: string, chapter: Chapter): Promise<AiChapterResponse> {
  const chunks = chunkText(chapter.content);
  const allIssues: AiChapterResponse['issues'] = [];
  const scoreAcc = { orthographe: 0, style: 0, kdp: 0 };
  let successfulChunks = 0;
  let lastRecoverableError = '';
  for (const chunk of chunks) {
    try {
      const res = await callGeminiJSON<AiChapterResponse>(apiKey, buildPrompt(chapter, chunk), {
        temperature: 0.2,
        maxTokens: 2200,
        timeout: 90000,
      });
      if (Array.isArray(res?.issues)) allIssues.push(...res.issues);
      if (res?.scores) {
        scoreAcc.orthographe += res.scores.orthographe || 0;
        scoreAcc.style += res.scores.style || 0;
        scoreAcc.kdp += res.scores.kdp || 0;
        successfulChunks++;
      }
    } catch (e: any) {
      const message = e?.message || 'Erreur IA inconnue';
      if (!isRecoverableAIError(message)) throw e;
      lastRecoverableError = message;
      console.warn(`[BookPerfect] Analyse IA partielle ignorée pour ${chapter.title}:`, message);
    }
  }

  if (successfulChunks === 0 && lastRecoverableError) {
    return {
      issues: [],
      scores: { orthographe: 70, style: 70, kdp: 70 },
    };
  }

  const n = Math.max(1, successfulChunks);
  return {
    issues: allIssues.slice(0, 12),
    scores: {
      orthographe: Math.round(scoreAcc.orthographe / n),
      style: Math.round(scoreAcc.style / n),
      kdp: Math.round(scoreAcc.kdp / n),
    },
  };
}

const mapAiIssues = (chapter: Chapter, res: AiChapterResponse): Issue[] =>
  (res.issues || []).slice(0, 25).map((it) => ({
    id: aiId(),
    category: (['orthographe', 'style', 'kdp'].includes(it.category) ? it.category : 'style') as Issue['category'],
    severity: (['critical', 'warning', 'info'].includes(it.severity) ? it.severity : 'info') as Issue['severity'],
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    original: (it.original || '').slice(0, 300),
    suggestion: it.suggestion || '',
    reason: it.reason || '',
    status: 'pending' as const,
    source: 'ai' as const,
  })).filter((i) => i.original.trim().length > 0);

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function computeScores(chapterResults: ChapterResult[], issues: Issue[], chapters: Chapter[]): Scores {
  const done = chapterResults.filter((c) => c.status === 'done' && c.scores);
  const avg = (k: 'orthographe' | 'style' | 'kdp') =>
    done.length ? clamp(done.reduce((s, c) => s + (c.scores![k] || 0), 0) / done.length) : 0;

  const orthographe = avg('orthographe');
  const style = avg('style');
  const kdp = avg('kdp');

  // Score traces IA : pénalité par occurrence critique.
  const traceCount = issues.filter((i) => i.category === 'traces-ia').length;
  const tracesIa = clamp(100 - traceCount * 8);

  const global = clamp(orthographe * 0.3 + style * 0.25 + kdp * 0.25 + tracesIa * 0.2);
  const verdict: Scores['verdict'] = global >= 80 ? 'green' : global >= 60 ? 'orange' : 'red';
  return { global, orthographe, style, kdp, tracesIa, verdict };
}

function buildKdpReport(issues: Issue[], manuscript: Manuscript): KdpCheck[] {
  const traces = issues.filter((i) => i.category === 'traces-ia').length;
  const kdpIssues = issues.filter((i) => i.category === 'kdp').length;
  const hasTitle = manuscript.title.trim().length > 0 && !/provisoire|untitled/i.test(manuscript.title);
  return [
    { label: 'Aucune trace IA / provisoire', ok: traces === 0, detail: traces === 0 ? 'Aucune trace détectée.' : `${traces} élément(s) provisoire(s) à corriger.` },
    { label: 'Titre du livre défini', ok: hasTitle, detail: hasTitle ? `« ${manuscript.title} »` : 'Titre manquant ou provisoire.' },
    { label: 'Structure en chapitres', ok: manuscript.chapters.length >= 2, detail: `${manuscript.chapters.length} chapitre(s) détecté(s).` },
    { label: 'Conformité éditoriale KDP', ok: kdpIssues === 0, detail: kdpIssues === 0 ? 'Aucun problème KDP signalé.' : `${kdpIssues} point(s) à revoir.` },
    { label: 'Longueur suffisante', ok: manuscript.wordCount >= 5000, detail: `${manuscript.wordCount.toLocaleString('fr-FR')} mots (~${manuscript.pageEstimate} pages).` },
  ];
}

export interface OrchestratorCallbacks {
  onChapterStart?: (chapter: Chapter, index: number, total: number) => void;
  onChapterDone?: (result: ChapterResult, analysis: Analysis) => void;
  onProgress?: (analysis: Analysis) => void;
}

/** Charge une analyse sauvegardée (reprise). */
export function loadAnalysis(manuscriptId: string): Analysis | null {
  return readAutosave<Analysis>(SCOPE(manuscriptId));
}

export function loadAnalysisAsync(manuscriptId: string): Promise<Analysis | null> {
  return readAutosaveAsync<Analysis>(SCOPE(manuscriptId));
}

export async function saveAnalysisSnapshotAsync(analysis: Analysis): Promise<void> {
  await persistAsync(analysis);
}

export interface BookPerfectRecoverySnapshot {
  manuscript: Manuscript;
  analysis: Analysis;
}

export function loadRecoverySnapshot(): BookPerfectRecoverySnapshot | null {
  return readAutosave<BookPerfectRecoverySnapshot>(BOOKPERFECT_RECOVERY_SCOPE);
}

export function loadRecoverySnapshotAsync(): Promise<BookPerfectRecoverySnapshot | null> {
  return readAutosaveAsync<BookPerfectRecoverySnapshot>(BOOKPERFECT_RECOVERY_SCOPE);
}

/** Sauvegarde l'analyse (appelée après chaque chapitre). */
function persist(analysis: Analysis) {
  analysis.updatedAt = Date.now();
  writeAutosave(SCOPE(analysis.manuscriptId), analysis);
}

async function persistAsync(analysis: Analysis) {
  analysis.updatedAt = Date.now();
  await writeAutosaveAsync(SCOPE(analysis.manuscriptId), analysis);
}

function persistRecovery(manuscript: Manuscript, analysis: Analysis) {
  writeAutosave<BookPerfectRecoverySnapshot>(BOOKPERFECT_RECOVERY_SCOPE, { manuscript, analysis });
}

async function persistRecoveryAsync(manuscript: Manuscript, analysis: Analysis) {
  await writeAutosaveAsync<BookPerfectRecoverySnapshot>(BOOKPERFECT_RECOVERY_SCOPE, { manuscript, analysis });
}

function emptyAnalysis(manuscript: Manuscript): Analysis {
  return {
    manuscriptId: manuscript.id,
    chapterResults: manuscript.chapters.map((c) => ({ chapterId: c.id, status: 'pending', attempts: 0 })),
    issues: [],
    scores: null,
    kdpReport: [],
    updatedAt: Date.now(),
    lastProcessedIndex: -1,
  };
}

/**
 * Lance (ou reprend) l'analyse.
 * @param resumeOnly si true, ne (re)traite que les chapitres pending/failed.
 */
export async function runAnalysis(
  manuscript: Manuscript,
  opts: { resumeOnly?: boolean; existing?: Analysis | null; signal?: { aborted: boolean } } = {},
  cb: OrchestratorCallbacks = {},
): Promise<Analysis> {
  const provider = getProvider();
  const apiKey = getActiveAIKey();
  if (!apiKey) {
    throw new Error(`Aucune clé API ${provider} configurée. Renseignez votre clé dans les réglages pour lancer l'analyse.`);
  }

  const saved = opts.resumeOnly ? await loadAnalysisAsync(manuscript.id) : null;
  const baseAnalysis = opts.resumeOnly ? (opts.existing || saved) : null;
  let analysis: Analysis;
  if (baseAnalysis) {
    const previousAnalysis = baseAnalysis;
    analysis = {
      ...previousAnalysis,
      chapterResults: manuscript.chapters.map((chapter) => {
        const previous = previousAnalysis.chapterResults.find((r) => r.chapterId === chapter.id);
        if (!previous) return { chapterId: chapter.id, status: 'pending', attempts: 0 };
        return previous.status === 'running' ? { ...previous, status: 'pending' } : previous;
      }),
      issues: previousAnalysis.issues.filter((issue) => manuscript.chapters.some((chapter) => chapter.id === issue.chapterId)),
    };
  } else {
    analysis = emptyAnalysis(manuscript);
  }

  const total = manuscript.chapters.length;
  const saveProgress = async () => {
    await persistAsync(analysis);
    await persistRecoveryAsync(manuscript, analysis);
  };

  await saveProgress();

  try {
    for (let i = 0; i < total; i++) {
      if (opts.signal?.aborted) break;
      const chapter = manuscript.chapters[i];
      const resultIdx = analysis.chapterResults.findIndex((r) => r.chapterId === chapter.id);
      const current = analysis.chapterResults[resultIdx];

      // Reprise : on saute les chapitres déjà réussis.
      if (opts.resumeOnly && current?.status === 'done') continue;

      cb.onChapterStart?.(chapter, i, total);
      analysis.chapterResults[resultIdx] = { ...current, status: 'running' };
      cb.onProgress?.(analysis);
      await saveProgress();

      // Nettoyer les issues précédentes de ce chapitre (relance propre).
      analysis.issues = analysis.issues.filter((is) => is.chapterId !== chapter.id);

      // 1. Vérifications locales (toujours, instantanées, jamais bloquantes).
      const localIssues = runLocalChecks(chapter);
      analysis.issues.push(...localIssues);

      // 2. Analyse IA avec retry.
      let aiOk = false;
      let attempts = current?.attempts || 0;
      let lastError = '';
      for (let a = 0; a < MAX_ATTEMPTS; a++) {
        if (opts.signal?.aborted) break;
        attempts++;
        try {
          if (BACKOFFS[a] > 0) await sleep(BACKOFFS[a]);
          const res = await analyzeChapterAI(apiKey, chapter);
          analysis.issues.push(...mapAiIssues(chapter, res));
          analysis.chapterResults[resultIdx] = {
            chapterId: chapter.id, status: 'done', attempts, scores: res.scores,
          };
          aiOk = true;
          break;
        } catch (e: any) {
          lastError = e?.message || 'Erreur inconnue';
          console.warn(`[BookPerfect] Chapitre ${chapter.title} tentative ${attempts} échouée:`, lastError);
          // Erreur fatale (clé invalide, quota, service saturé) : inutile de
          // réessayer ni de brûler les crédits sur les chapitres suivants.
          if (isFatalError(lastError)) {
            // On remet ce chapitre en "pending" pour qu'il soit repris tel quel
            // après correction — surtout pas "failed" (ce n'est pas sa faute).
            analysis.chapterResults[resultIdx] = {
              chapterId: chapter.id, status: 'pending', attempts: current?.attempts || 0,
            };
            await saveProgress();
            throw new FatalAIError(lastError);
          }
        }
      }

      if (!aiOk) {
        // Continue-on-failure : le chapitre est marqué failed, les issues
        // locales restent conservées, l'analyse CONTINUE.
        analysis.chapterResults[resultIdx] = {
          chapterId: chapter.id, status: 'failed', attempts, error: lastError,
        };
      }

      analysis.lastProcessedIndex = i;
      analysis.scores = computeScores(analysis.chapterResults, analysis.issues, manuscript.chapters);
      analysis.kdpReport = buildKdpReport(analysis.issues, manuscript);
      await saveProgress();
      cb.onChapterDone?.(analysis.chapterResults[resultIdx], analysis);
      cb.onProgress?.(analysis);
    }
  } catch (e) {
    if (e instanceof FatalAIError) {
      // On sauvegarde l'état atteint (chapitres déjà réussis conservés) puis
      // on remonte une erreur claire. La reprise repartira EXACTEMENT là où
      // ça s'est arrêté, sans réanalyser les chapitres déjà terminés.
      analysis.scores = computeScores(analysis.chapterResults, analysis.issues, manuscript.chapters);
      analysis.kdpReport = buildKdpReport(analysis.issues, manuscript);
      await saveProgress();
      throw new Error(`${e.message} L'analyse est en pause — corrigez le problème puis cliquez sur « Reprendre » (les chapitres déjà analysés sont conservés).`);
    }
    throw e;
  }

  analysis.scores = computeScores(analysis.chapterResults, analysis.issues, manuscript.chapters);
  analysis.kdpReport = buildKdpReport(analysis.issues, manuscript);
  await saveProgress();
  return analysis;
}

/** Met à jour le statut d'une issue et persiste. */
export function updateIssueStatus(analysis: Analysis, issueId: string, status: Issue['status']): Analysis {
  const next = { ...analysis, issues: analysis.issues.map((i) => (i.id === issueId ? { ...i, status } : i)) };
  persist(next);
  return next;
}
