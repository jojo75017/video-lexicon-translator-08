import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { readWrittenProgress, WRITTEN_CHAPTERS_EVENT, type WrittenProgress } from '@/lib/v3/writtenChapters';

type WorkflowSnapshot = {
  currentStepIndex?: number;
  stepResults?: Record<string, unknown>;
};

const AGENTS = 15;

function readWorkflow(): WorkflowSnapshot {
  try {
    return JSON.parse(localStorage.getItem('ebook_workflow_progress') || '{}') as WorkflowSnapshot;
  } catch {
    return {};
  }
}

/** Avancement réellement enregistré : agents, chapitres terminés et aperçu du dernier texte. */
export default function V3LiveBookProgress() {
  const [written, setWritten] = useState<WrittenProgress>(() => readWrittenProgress());
  const [workflow, setWorkflow] = useState<WorkflowSnapshot>(() => readWorkflow());

  useEffect(() => {
    const sync = () => {
      setWritten(readWrittenProgress());
      setWorkflow(readWorkflow());
    };
    sync();
    const timer = window.setInterval(sync, 1500);
    window.addEventListener(WRITTEN_CHAPTERS_EVENT, sync);
    window.addEventListener('ebook_workflow_results_updated', sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(WRITTEN_CHAPTERS_EVENT, sync);
      window.removeEventListener('ebook_workflow_results_updated', sync);
    };
  }, []);

  const agentIndex = Math.max(0, Number(workflow.currentStepIndex) || 0);
  const completedAgents = Object.keys(workflow.stepResults || {}).length;
  const totalChapters = Math.max(written.total, written.chapters.length);
  const chapterPercent = totalChapters ? Math.round((written.chapters.length / totalChapters) * 100) : 0;
  const latest = written.chapters[written.chapters.length - 1];
  const totalWords = useMemo(() => written.chapters.reduce((sum, chapter) => sum + chapter.words, 0), [written.chapters]);

  return (
    <section id="livre-en-direct" className="scroll-mt-24 rounded-[24px] border p-4 sm:p-5" style={{ borderColor: 'var(--v3-gold)', background: 'var(--v3-paper)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--v3-orange-600)' }}>
            <Loader2 className="h-4 w-4 animate-spin" /> Votre livre en cours de réalisation
          </span>
          <h3 className="v3-serif mt-1 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
            {written.chapters.length ? `${written.chapters.length} chapitre(s) déjà lisible(s)` : 'Préparation du manuscrit en cours'}
          </h3>
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
          Agent {Math.min(AGENTS, agentIndex + 1)} / {AGENTS}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-3" style={{ borderColor: 'var(--v3-border)' }}>
          <div className="text-2xl font-bold">{completedAgents}/{AGENTS}</div>
          <div className="text-xs" style={{ color: 'var(--v3-muted)' }}>étapes enregistrées</div>
        </div>
        <div className="rounded-xl border p-3" style={{ borderColor: 'var(--v3-border)' }}>
          <div className="text-2xl font-bold">{written.chapters.length}/{totalChapters || '—'}</div>
          <div className="text-xs" style={{ color: 'var(--v3-muted)' }}>chapitres écrits</div>
        </div>
        <div className="rounded-xl border p-3" style={{ borderColor: 'var(--v3-border)' }}>
          <div className="text-2xl font-bold">{totalWords.toLocaleString('fr-FR')}</div>
          <div className="text-xs" style={{ color: 'var(--v3-muted)' }}>mots visibles</div>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--v3-orange-50)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${chapterPercent}%`, background: 'var(--v3-orange-600)' }} />
      </div>

      {latest ? (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'var(--v3-border)' }}>
          <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--v3-ink)' }}>
            <CheckCircle2 className="h-4 w-4" /> Chapitre {latest.index + 1} — {latest.title}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
            {latest.content.slice(0, 900)}{latest.content.length > 900 ? '…' : ''}
          </p>
          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('v3:show-written-book'))}
            className="v3-btn v3-btn-outline mt-3 text-xs">
            <BookOpen className="h-3.5 w-3.5" /> Lire tous les chapitres écrits
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm" style={{ color: 'var(--v3-muted)' }}>
          Le premier chapitre apparaîtra ici dès qu'il sera enregistré. Cette page se met à jour automatiquement.
        </p>
      )}
    </section>
  );
}