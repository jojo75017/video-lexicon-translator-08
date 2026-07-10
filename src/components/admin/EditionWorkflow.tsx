import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ChevronDown, Lock, Play, Trophy, BookOpen, ArrowRight, Sparkles, FileText,
  Clock, FileText as FileTextIcon,
} from 'lucide-react';
import { getModuleById, type V3Module } from '@/data/roadmapV3';
import {
  EDITION_AGENTS, EDITION_DEPARTMENTS, EDITION_PHASES, EDITION_PHASE_INTRO, getPhaseForAgent,
  V3_AGENT_COUNT, V4_AGENT_COUNT, type EditionAgent, type EditionTier,
} from '@/data/editionAgents';
import WorkflowBookConfigForm from '@/components/ebook/WorkflowBookConfigForm';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EbookSettingsPanel } from '@/components/ebook/EbookSettingsPanel';
import { ApiProviderQuickSettings } from '@/components/ebook/ApiProviderQuickSettings';
import { EditorialControlPanel } from '@/components/ebook/EditorialControlPanel';
import { parseManuscript, countWords } from '@/lib/manuscriptParser';
import { estimatePages } from '@/utils/kdpPageDensity';


// Palette « Clair Ambre » (identique au Hub).
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const GREEN = '#1f9d6b';
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const DONE_KEY = 'edition_workflow_done_v1';
const CONFIG_KEY = 'edition_book_config_v1';
const TARGET_WORDS_KEY = 'edition_chapter_target_words_v1';
const REVISION_PASSES_KEY = 'edition_revision_passes_v1';

const REVISION_PASS_LABELS = [
  { n: 1, title: 'Rédaction', desc: 'Écriture du premier jet chapitre par chapitre.' },
  { n: 2, title: 'Relecture stylistique', desc: 'Correction, cohérence et fluidité du texte.' },
  { n: 3, title: 'Polissage final', desc: 'Voix d\'auteur, suppression des clichés, finitions.' },
];

function readRevisionPasses(): number {
  try {
    const raw = localStorage.getItem(REVISION_PASSES_KEY);
    const n = raw ? Number(raw) : 2;
    return Number.isFinite(n) && n >= 1 && n <= 3 ? Math.round(n) : 2;
  } catch {
    return 2;
  }
}

interface EditionBookConfig {
  title: string;
  subtitle: string;
  author: string;
  description: string;
  genre: string;
  targetAudience: string;
  numberOfChapters: number;
}

const EMPTY_CONFIG: EditionBookConfig = {
  title: '', subtitle: '', author: '', description: '',
  genre: '', targetAudience: '', numberOfChapters: 8,
};

function readConfig(): EditionBookConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return { ...EMPTY_CONFIG };
    return { ...EMPTY_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_CONFIG };
  }
}

function readDone(): Set<number> {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return new Set();
    return new Set<number>(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function readTargetWords(): number {
  try {
    const raw = localStorage.getItem(TARGET_WORDS_KEY);
    const n = raw ? Number(raw) : 2500;
    return Number.isFinite(n) && n >= 250 ? Math.round(n) : 2500;
  } catch {
    return 2500;
  }
}

/**
 * Extraction défensive des titres de chapitres depuis le manuscrit sauvegardé
 * (workflow results). On lit les étapes structure/rédaction puis on repère les
 * lignes « Chapitre N … » ou les titres markdown « ## … ».
 */
function readChapterTitles(): string[] {
  try {
    const raw = localStorage.getItem('ebook_workflow_results');
    if (!raw) return [];
    const data = JSON.parse(raw);
    const texts: string[] = [];
    for (const key of ['P3', 'P4', 'P10']) {
      const c = data?.[key]?.displayContent;
      if (typeof c === 'string' && c.length > 20) texts.push(c);
    }
    const blob = texts.join('\n');
    if (!blob) return [];
    const titles: string[] = [];
    const seen = new Set<string>();
    const push = (t: string) => {
      const clean = t.trim().replace(/\s+/g, ' ').slice(0, 120);
      const norm = clean.toLowerCase();
      if (clean.length >= 3 && !seen.has(norm)) { seen.add(norm); titles.push(clean); }
    };
    for (const line of blob.split(/\r?\n/)) {
      const chap = line.match(/^\s*(?:#{1,3}\s*)?chapitre\s+\d+\s*[:\-–.]?\s*(.+)$/i);
      if (chap && chap[1]) { push(chap[1]); continue; }
      const md = line.match(/^\s*#{2,3}\s+(.{3,})$/);
      if (md && md[1]) push(md[1]);
    }
    return titles.slice(0, 60);
  } catch {
    return [];
  }
}

interface ChapterStat { title: string; words: number; planned?: boolean; }
interface ManuscriptStats {
  chapters: ChapterStat[];
  totalWords: number;
  chapterCount: number;
  pages: number;
  readingMin: number;
  hasContent: boolean;
}

interface TextCandidate { text: string; score: number; }

function plannedChapters(config: EditionBookConfig): ChapterStat[] {
  const count = Math.max(1, Math.min(60, Math.round(Number(config.numberOfChapters) || EMPTY_CONFIG.numberOfChapters)));
  const titles = readChapterTitles();
  return Array.from({ length: count }, (_, i) => ({
    title: titles[i] || `Chapitre ${i + 1} · À rédiger`,
    words: 0,
    planned: true,
  }));
}

function scoreText(text: string, keyPath: string): number {
  const lowerPath = keyPath.toLowerCase();
  const chapterSignals = (text.match(/(?:^|\n)\s*(?:#{1,3}\s*)?(?:chapitre|partie|prologue|épilogue|epilogue|introduction)\b/gim) || []).length;
  let score = text.length + chapterSignals * 5000;
  if (/p20|p10|manuscript|manuscrit|chapters|chapitres|displaycontent|content|result|texte|text|output/.test(lowerPath)) score += 3000;
  if (/plan|brief|config|title|subtitle|author|description/.test(lowerPath)) score -= 1200;
  return score;
}

function collectTextCandidates(value: unknown, keyPath = '', candidates: TextCandidate[] = [], depth = 0): TextCandidate[] {
  if (depth > 7 || value == null) return candidates;
  if (typeof value === 'string') {
    const text = value.trim();
    if (text.length >= 50) candidates.push({ text, score: scoreText(text, keyPath) });
    return candidates;
  }
  if (Array.isArray(value)) {
    const joinedParts = value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          return [obj.title, obj.heading, obj.content, obj.text, obj.body, obj.displayContent]
            .filter((x): x is string => typeof x === 'string')
            .join('\n');
        }
        return '';
      })
      .filter((part) => part.trim().length >= 20);
    if (joinedParts.length >= 2) {
      const joined = joinedParts.join('\n\n');
      candidates.push({ text: joined, score: scoreText(joined, `${keyPath}.array`) + 2000 });
    }
    value.forEach((item, index) => collectTextCandidates(item, `${keyPath}.${index}`, candidates, depth + 1));
    return candidates;
  }
  if (typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
      collectTextCandidates(child, keyPath ? `${keyPath}.${key}` : key, candidates, depth + 1);
    });
  }
  return candidates;
}

/** Reconstitue le manuscrit depuis tout ebook_workflow_results, puis compte les mots par chapitre. */
function readManuscriptStats(config: EditionBookConfig): ManuscriptStats {
  const fallback = plannedChapters(config);
  const empty: ManuscriptStats = {
    chapters: fallback,
    totalWords: 0,
    chapterCount: fallback.length,
    pages: 0,
    readingMin: 0,
    hasContent: false,
  };
  try {
    const raw = localStorage.getItem('ebook_workflow_results');
    if (!raw) return empty;
    const data = JSON.parse(raw);
    const candidates = collectTextCandidates(data).sort((a, b) => b.score - a.score);
    const blob = candidates[0]?.text ?? '';
    if (!blob) return empty;
    const sections = parseManuscript(blob, 'Contenu');
    const chapters: ChapterStat[] = sections.map((s) => {
      const text = [s.title, ...s.blocks.map((b) => b.text)].join(' ');
      return { title: s.title, words: countWords(text) };
    }).filter((c) => c.words > 0);
    if (!chapters.length) return empty;
    const totalWords = chapters.reduce((n, c) => n + c.words, 0);
    return {
      chapters,
      totalWords,
      chapterCount: chapters.length,
      pages: estimatePages(totalWords),
      readingMin: Math.max(1, Math.ceil(totalWords / 230)),
      hasContent: true,
    };
  } catch {
    return empty;
  }
}

const EditionWorkflow: React.FC<{ onOpenModule: (m: V3Module) => void }> = ({ onOpenModule }) => {
  const navigate = useNavigate();
  const { hasFull, isAdmin, loading } = useV3Entitlement();
  const canV4 = hasFull || isAdmin;

  const [config, setConfig] = useState<EditionBookConfig>(() => readConfig());
  const [done, setDone] = useState<Set<number>>(() => readDone());
  const [openChapters, setOpenChapters] = useState(true);
  const [stats, setStats] = useState<ManuscriptStats>(() => readManuscriptStats(readConfig()));
  const [targetWords, setTargetWords] = useState(() => readTargetWords());
  const [openConfig, setOpenConfig] = useState(() => !readConfig().title.trim());
  const [keysOpen, setKeysOpen] = useState(false);
  // Onglet d'offre affiché : V3 (197€) ou V4 (347€).
  const [activeTier, setActiveTier] = useState<EditionTier>('v3');


  const updateConfig = useCallback((patch: Partial<EditionBookConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(CONFIG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      try { window.dispatchEvent(new Event('edition_book_config_updated')); } catch { /* ignore */ }
      return next;
    });
  }, []);

  useEffect(() => {
    const refresh = () => setStats(readManuscriptStats(config));
    refresh();
    window.addEventListener('ebook_workflow_results_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('ebook_workflow_results_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [config]);

  const updateTargetWords = useCallback((value: number) => {
    const next = Math.max(250, Math.min(20000, Math.round(value || 2500)));
    setTargetWords(next);
    try { localStorage.setItem(TARGET_WORDS_KEY, String(next)); } catch { /* ignore */ }
  }, []);

  const updateChapters = useCallback((value: number) => {
    const next = Math.max(3, Math.min(40, Math.round(value || EMPTY_CONFIG.numberOfChapters)));
    updateConfig({ numberOfChapters: next });
  }, [updateConfig]);

  const persist = useCallback((next: Set<number>) => {
    setDone(new Set(next));
    try { localStorage.setItem(DONE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
  }, []);

  const toggleDone = useCallback((order: number) => {
    const next = new Set(done);
    if (next.has(order)) next.delete(order); else next.add(order);
    persist(next);
  }, [done, persist]);

  // Agents de l'onglet actif (V3 = 197€, V4 = bonus 347€).
  const tierAgents = useMemo(() => EDITION_AGENTS.filter((a) => a.tier === activeTier), [activeTier]);
  const v3Count = useMemo(() => EDITION_AGENTS.filter((a) => a.tier === 'v3').length, []);
  const v4Count = useMemo(() => EDITION_AGENTS.filter((a) => a.tier === 'v4').length, []);
  const total = tierAgents.length;
  const completed = tierAgents.filter((a) => done.has(a.order)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const chapterGoalTotal = Math.max(0, Math.round((Number(config.numberOfChapters) || 0) * targetWords));
  const chapterGoalPages = estimatePages(chapterGoalTotal);

  const openAgent = useCallback((agent: EditionAgent) => {
    const mod = getModuleById(agent.moduleId);
    if (mod) onOpenModule(mod);
  }, [onOpenModule]);


  return (
    <div className="rounded-3xl border shadow-sm overflow-hidden" style={{ background: '#fff', borderColor: '#eadfc9' }}>
      {/* En-tête */}
      <div className="px-5 sm:px-7 pt-6 pb-5" style={{ background: `linear-gradient(180deg, ${AMBER_SOFT}, #fff)` }}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white"
            style={{ background: canV4 ? AMBER_DEEP : AMBER }}>
            {canV4 ? `V4 · ${V4_AGENT_COUNT} agents` : `V3 · ${V3_AGENT_COUNT} agents`}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: '#a18a6c' }}>
            Votre maison d'édition, du manuscrit à la vente
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black leading-tight" style={{ fontFamily: SERIF, color: INK }}>
          L'atelier d'édition
        </h2>
        <p className="mt-1 text-[13px]" style={{ color: '#6f5e47' }}>
          Suivez les agents dans l'ordre. Chaque métier fait avancer votre livre d'une étape claire.
        </p>

        {/* Sélecteur d'offre : 197€ (V3) vs 347€ (V4) */}
        <div className="mt-4 inline-flex rounded-xl p-1 border" style={{ background: '#fff', borderColor: '#eadfc9' }}>
          <button
            onClick={() => setActiveTier('v3')}
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors"
            style={{
              background: activeTier === 'v3' ? AMBER : 'transparent',
              color: activeTier === 'v3' ? '#fff' : '#8a7860',
            }}>
            V3 · 197€ <span className="opacity-80">({v3Count} agents)</span>
          </button>
          <button
            onClick={() => setActiveTier('v4')}
            className="ml-1 px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors inline-flex items-center gap-1.5"
            style={{
              background: activeTier === 'v4' ? AMBER_DEEP : 'transparent',
              color: activeTier === 'v4' ? '#fff' : '#8a7860',
            }}>
            V4 · 347€ <span className="opacity-80">({v4Count} agents)</span>
            {!canV4 && <Lock className="h-3 w-3" />}
          </button>
        </div>

        {/* Carte clé IA (BYOK Gemini / OpenRouter…) */}
        <ApiProviderQuickSettings key={keysOpen ? 'api-open' : 'api-closed'} onOpenAdvanced={() => setKeysOpen(true)} />


        {/* Progression */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: INK }}>{completed} / {total} agents validés</span>
            <span className="text-sm font-black" style={{ color: completed === total && total > 0 ? GREEN : AMBER_DEEP }}>{pct}%</span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: '#f0e7d4' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: completed === total && total > 0 ? `linear-gradient(90deg, ${GREEN}, #2fc488)` : `linear-gradient(90deg, ${AMBER}, #FFB44D)` }} />
          </div>
          {completed === total && total > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}>
              <Trophy className="h-4 w-4" /> Bravo, votre livre est passé entre les mains de toute la maison d'édition !
            </p>
          )}
        </div>
      </div>

      {/* Fiche du livre — infos du manuscrit à rédiger */}
      <div className="border-t px-5 sm:px-7 py-4" style={{ borderColor: '#f0e7d4', background: '#fff' }}>
        <button onClick={() => setOpenConfig((v) => !v)}
          className="w-full flex items-center gap-2 text-left" aria-expanded={openConfig}>
          <FileText className="h-4 w-4" style={{ color: AMBER_DEEP }} />
          <span className="text-sm font-bold" style={{ color: INK }}>Fiche du livre</span>
          {config.title.trim() ? (
            <span className="text-[11px] truncate max-w-[55%]" style={{ color: '#a18a6c' }}>
              Livre en cours : <strong style={{ color: AMBER_DEEP }}>{config.title.trim()}</strong>
              {config.author.trim() ? ` — ${config.author.trim()}` : ''}
            </span>
          ) : (
            <span className="text-[11px]" style={{ color: '#c0392b' }}>à remplir avant de lancer les agents</span>
          )}
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openConfig ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
        </button>
        {openConfig && (
          <div className="mt-4">
            <WorkflowBookConfigForm
              variant="plain"
              ebookTitle={config.title}
              bookSubtitle={config.subtitle}
              authorName={config.author}
              bookDescription={config.description}
              genre={config.genre}
              targetAudience={config.targetAudience}
              numberOfChapters={config.numberOfChapters}
              onUpdateTitle={(v) => updateConfig({ title: v })}
              onUpdateSubtitle={(v) => updateConfig({ subtitle: v })}
              onUpdateAuthor={(v) => updateConfig({ author: v })}
              onUpdateDescription={(v) => updateConfig({ description: v })}
              onUpdateGenre={(v) => updateConfig({ genre: v })}
              onUpdateTargetAudience={(v) => updateConfig({ targetAudience: v })}
              onUpdateNumberOfChapters={(v) => updateConfig({ numberOfChapters: v })}
            />
          </div>
        )}
      </div>


      {/* Structure du livre — comptage mots & chapitres */}
      <div className="border-t px-5 sm:px-7 py-4" style={{ borderColor: '#f0e7d4', background: '#FCF8F0' }}>
        <button onClick={() => setOpenChapters((v) => !v)}
          className="w-full flex items-center gap-2 text-left" aria-expanded={openChapters}>
          <BookOpen className="h-4 w-4" style={{ color: AMBER_DEEP }} />
          <span className="text-sm font-bold" style={{ color: INK }}>Structure du livre</span>
          <span className="text-[11px]" style={{ color: '#a18a6c' }}>
            {stats.hasContent
              ? `${stats.chapterCount} chapitres · ${stats.totalWords.toLocaleString('fr-FR')} mots`
              : `${stats.chapterCount} chapitres prévus · mots à rédiger`}
          </span>
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openChapters ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
        </button>
        {openChapters && (
          <div className="mt-3">
            {/* Bandeau synthèse */}
            <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: FileTextIcon, value: stats.totalWords.toLocaleString('fr-FR'), label: stats.hasContent ? 'mots rédigés' : 'mots' },
                { icon: BookOpen, value: stats.chapterCount, label: stats.hasContent ? 'chapitres' : 'chapitres prévus' },
                { icon: FileText, value: stats.hasContent ? `~${stats.pages}` : '—', label: 'pages' },
                { icon: Clock, value: stats.hasContent ? `${stats.readingMin} min` : '—', label: 'lecture' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="rounded-xl border p-2.5 text-center" style={{ borderColor: '#eadfc9', background: '#fff' }}>
                    <Icon className="h-4 w-4 mx-auto mb-1" style={{ color: AMBER_DEEP }} />
                    <div className="text-base font-black leading-none" style={{ color: INK }}>{m.value}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#a18a6c' }}>{m.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Curseur chapitres + objectif mots / chapitre */}
            <div className="mb-3 rounded-xl border p-3" style={{ borderColor: '#eadfc9', background: '#fff' }}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="chapter-count-slider" className="text-[12px] font-bold" style={{ color: INK }}>
                      Nombre de chapitres
                    </label>
                    <input
                      id="chapter-count-input"
                      type="number"
                      min={3}
                      max={40}
                      step={1}
                      value={config.numberOfChapters}
                      onChange={(e) => updateChapters(Number(e.target.value))}
                      className="h-8 w-20 rounded-lg border px-2 text-right text-[13px] font-bold outline-none"
                      style={{ borderColor: '#eadfc9', color: INK, background: '#FCF8F0' }}
                    />
                  </div>
                  <input
                    id="chapter-count-slider"
                    type="range"
                    min={3}
                    max={40}
                    step={1}
                    value={config.numberOfChapters}
                    onChange={(e) => updateChapters(Number(e.target.value))}
                    className="w-full accent-[#008296]"
                  />
                  <div className="flex justify-between text-[10px]" style={{ color: '#a18a6c' }}>
                    <span>3 chapitres</span>
                    <span>40 chapitres max</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="chapter-word-target" className="text-[12px] font-bold" style={{ color: INK }}>
                      Mots par chapitre
                    </label>
                    <input
                      id="chapter-word-target"
                      type="number"
                      min={250}
                      max={20000}
                      step={100}
                      value={targetWords}
                      onChange={(e) => updateTargetWords(Number(e.target.value))}
                      className="h-8 w-28 rounded-lg border px-2 text-right text-[13px] font-bold outline-none"
                      style={{ borderColor: '#eadfc9', color: INK, background: '#FCF8F0' }}
                    />
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={8000}
                    step={100}
                    value={Math.min(8000, Math.max(500, targetWords))}
                    onChange={(e) => updateTargetWords(Number(e.target.value))}
                    className="w-full accent-[#008296]"
                  />
                  <div className="text-[11px]" style={{ color: '#8a7860' }}>
                    Objectif total : <strong style={{ color: AMBER_DEEP }}>{chapterGoalTotal.toLocaleString('fr-FR')} mots</strong> · environ {chapterGoalPages} pages
                  </div>
                </div>
              </div>
              {!stats.hasContent && (
                <p className="mt-3 text-[11px]" style={{ color: '#8a7860' }}>
                  Le tableau est prêt ; il affiche les chapitres prévus et se remplira dès que le manuscrit sera généré.
                </p>
              )}
            </div>

            {/* Tableau par chapitre */}
            <ol className="grid gap-1.5">
              {stats.chapters.map((c, i) => {
                const ratio = Math.min(1, c.words / targetWords);
                return (
                  <li key={`${c.title}-${i}`} className="flex items-center gap-2.5 text-[13px]" style={{ color: '#4a3f30' }}>
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black"
                      style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="hidden sm:block h-1.5 w-28 rounded-full overflow-hidden shrink-0" style={{ background: '#f0e7d4' }}>
                      <span className="block h-full rounded-full" style={{ width: `${ratio * 100}%`, background: c.words ? `linear-gradient(90deg, ${AMBER}, #FFB44D)` : '#e6d9c4' }} />
                    </span>
                    <span className="shrink-0 tabular-nums text-[12px] font-semibold w-24 text-right" style={{ color: c.words ? AMBER_DEEP : '#a18a6c' }}>
                      {c.words ? `${c.words.toLocaleString('fr-FR')} mots` : 'à rédiger'}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>


      {/* Départements & agents */}
      <div className="divide-y" style={{ borderColor: '#f0e7d4' }}>
        {EDITION_DEPARTMENTS.map((dept) => {
          const agents = tierAgents.filter((a) => a.department === dept);
          if (!agents.length) return null;
          const deptDone = agents.filter((a) => done.has(a.order)).length;
          const isPro = agents.every((a) => a.tier === 'v4');
          return (
            <div key={dept} className="px-5 sm:px-7 py-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: AMBER_DEEP }}>{dept}</h3>
                {isPro && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: AMBER_DEEP }}>V4 · 347€</span>
                )}
                <span className="ml-auto text-[11px]" style={{ color: '#a18a6c' }}>{deptDone}/{agents.length}</span>
              </div>

              <div className="grid gap-2.5">
                {agents.map((agent) => {
                  const isDone = done.has(agent.order);
                  const locked = agent.tier === 'v4' && !canV4;
                  const tierLabel = agent.tier === 'v4' ? 'V4 · 347€' : 'V3 · 197€';
                  const visibleOrder = tierAgents.findIndex((a) => a.order === agent.order) + 1;
                  return (
                    <div key={agent.order}
                      className="flex items-start gap-3 rounded-2xl border p-3.5 transition-colors"
                      style={{
                        borderColor: isDone ? `${GREEN}55` : '#eadfc9',
                        background: isDone ? `${GREEN}0d` : locked ? '#FBFAF7' : '#fff',
                      }}>
                      {/* Pastille numéro / état */}
                      <button onClick={() => !locked && toggleDone(agent.order)} disabled={locked}
                        title={locked ? 'Réservé V4' : isDone ? 'Marquer non fait' : 'Marquer comme fait'}
                        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-black border-2 transition-transform hover:scale-105 disabled:cursor-not-allowed"
                        style={{
                          borderColor: isDone ? GREEN : locked ? '#e3d6bd' : AMBER,
                          background: isDone ? GREEN : '#fff',
                          color: isDone ? '#fff' : locked ? '#bcaa8c' : AMBER_DEEP,
                        }}>
                        {isDone ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : visibleOrder}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className={`text-sm font-bold leading-tight ${isDone ? 'opacity-70' : ''}`}
                            style={{ fontFamily: SERIF, color: INK }}>
                            {agent.role}
                          </div>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                            style={agent.tier === 'v4'
                              ? { background: AMBER_SOFT, color: AMBER_DEEP, border: `1px solid ${AMBER}55` }
                              : { background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}44` }}
                          >
                            {tierLabel}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] leading-snug" style={{ color: '#6f5e47' }}>{agent.mission}</p>
                      </div>

                      {/* Action */}
                      {locked ? (
                        <button onClick={() => navigate('/publication-pro')}
                          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
                          style={{ background: AMBER_DEEP }}>
                          <Sparkles className="h-3.5 w-3.5" /> Débloquer V4
                        </button>
                      ) : (
                        <button onClick={() => openAgent(agent)}
                          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
                          style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}>
                          <Play className="h-3.5 w-3.5" /> Lancer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bandeau upsell V4 — affiché dans l'onglet V4 quand l'abonné n'a pas la V4 */}
      {activeTier === 'v4' && !canV4 && !loading && (
        <div className="border-t px-5 sm:px-7 py-5" style={{ borderColor: '#f0e7d4', background: AMBER_SOFT }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black" style={{ color: INK }}>Passez en V4 — 347€ · {V4_AGENT_COUNT} agents</div>
              <p className="text-[12.5px]" style={{ color: '#6f5e47' }}>
                Studio A/B/C (titre, 4e, couverture avec version recommandée), Stratège de Positionnement,
                illustrations, audiobook, traductions + tout le Département Commercial (presse, social, Ads, distribution…).
              </p>
            </div>
            <button onClick={() => navigate('/publication-pro')}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: AMBER_DEEP }}>
              Voir l'offre V4 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Panneau clés IA (BYOK) */}
      <Dialog open={keysOpen} onOpenChange={setKeysOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisir mon IA · Clés API & réglages</DialogTitle>
          </DialogHeader>
          <EbookSettingsPanel />
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default EditionWorkflow;
