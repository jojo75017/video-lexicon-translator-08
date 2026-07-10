import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ChevronDown, Lock, Play, Trophy, BookOpen, ArrowRight, Sparkles,
} from 'lucide-react';
import { getModuleById, type V3Module } from '@/data/roadmapV3';
import {
  EDITION_AGENTS, EDITION_DEPARTMENTS, getAgentsForTier,
  V3_AGENT_COUNT, V4_AGENT_COUNT, type EditionAgent,
} from '@/data/editionAgents';
import WorkflowBookConfigForm from '@/components/ebook/WorkflowBookConfigForm';
import useV3Entitlement from '@/hooks/useV3Entitlement';

// Palette « Clair Ambre » (identique au Hub).
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const GREEN = '#1f9d6b';
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const DONE_KEY = 'edition_workflow_done_v1';
const CONFIG_KEY = 'edition_book_config_v1';

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

const EditionWorkflow: React.FC<{ onOpenModule: (m: V3Module) => void }> = ({ onOpenModule }) => {
  const navigate = useNavigate();
  const { hasFull, isAdmin, loading } = useV3Entitlement();
  const canV4 = hasFull || isAdmin;

  const [done, setDone] = useState<Set<number>>(() => readDone());
  const [openChapters, setOpenChapters] = useState(true);
  const [chapters, setChapters] = useState<string[]>(() => readChapterTitles());
  const [config, setConfig] = useState<EditionBookConfig>(() => readConfig());
  const [openConfig, setOpenConfig] = useState(() => !readConfig().title.trim());

  const updateConfig = useCallback((patch: Partial<EditionBookConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(CONFIG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      try { window.dispatchEvent(new Event('edition_book_config_updated')); } catch { /* ignore */ }
      return next;
    });
  }, []);

  useEffect(() => {
    const refresh = () => setChapters(readChapterTitles());
    window.addEventListener('ebook_workflow_results_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('ebook_workflow_results_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const persist = useCallback((next: Set<number>) => {
    setDone(new Set(next));
    try { localStorage.setItem(DONE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
  }, []);

  const toggleDone = useCallback((order: number) => {
    const next = new Set(done);
    if (next.has(order)) next.delete(order); else next.add(order);
    persist(next);
  }, [done, persist]);

  // Agents visibles : V4 voit tout, V3 voit les 22 mais les 8 Pro restent verrouillés (teaser).
  const visibleAgents = useMemo(() => EDITION_AGENTS, []);
  const activeAgents = useMemo(() => getAgentsForTier(canV4), [canV4]);
  const total = activeAgents.length;
  const completed = activeAgents.filter((a) => done.has(a.order)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

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

      {/* Structure du livre — titres de chapitres */}
      <div className="border-t px-5 sm:px-7 py-4" style={{ borderColor: '#f0e7d4', background: '#FCF8F0' }}>
        <button onClick={() => setOpenChapters((v) => !v)}
          className="w-full flex items-center gap-2 text-left" aria-expanded={openChapters}>
          <BookOpen className="h-4 w-4" style={{ color: AMBER_DEEP }} />
          <span className="text-sm font-bold" style={{ color: INK }}>Structure du livre</span>
          <span className="text-[11px]" style={{ color: '#a18a6c' }}>
            {chapters.length ? `${chapters.length} chapitres détectés` : 'aucun chapitre pour l\'instant'}
          </span>
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openChapters ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
        </button>
        {openChapters && (
          <div className="mt-3">
            {chapters.length ? (
              <ol className="grid gap-1 sm:grid-cols-2">
                {chapters.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: '#4a3f30' }}>
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black"
                      style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>{i + 1}</span>
                    <span className="min-w-0">{t}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[12px]" style={{ color: '#8a7860' }}>
                Lancez <strong>L'Architecte du Livre</strong> puis <strong>Le Romancier</strong> : les titres de vos
                chapitres apparaîtront ici automatiquement.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Départements & agents */}
      <div className="divide-y" style={{ borderColor: '#f0e7d4' }}>
        {EDITION_DEPARTMENTS.map((dept) => {
          const agents = visibleAgents.filter((a) => a.department === dept);
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
                        {isDone ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : agent.order}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold leading-tight ${isDone ? 'opacity-70' : ''}`}
                          style={{ fontFamily: SERIF, color: INK }}>
                          {agent.role}
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

      {/* Bandeau upsell V4 si offre V3 */}
      {!canV4 && !loading && (
        <div className="border-t px-5 sm:px-7 py-5" style={{ borderColor: '#f0e7d4', background: AMBER_SOFT }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black" style={{ color: INK }}>Passez en V4 — 347€ · {V4_AGENT_COUNT} agents</div>
              <p className="text-[12.5px]" style={{ color: '#6f5e47' }}>
                Débloquez le Département Commercial (presse, social, Ads, distribution, avis…) pour vendre comme un éditeur.
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
    </div>
  );
};

export default EditionWorkflow;
