import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { WORKFLOW_STEPS, WORKFLOW_STEP_COUNT } from '@/components/ebook/workflow/workflowAgents';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { useState } from 'react';

/**
 * Grille des 15 agents du workflow professionnel (P1 → P15).
 * L'état vient des résultats déjà enregistrés par le moteur existant :
 * terminé = résultat présent, en cours = premier agent sans résultat, sinon en attente.
 */
export default function V3AgentsGrid({ compact = false }: { compact?: boolean }) {
  const { results, hasStepResult, getStepResult, getCompletedStepsCount } = useWorkflowResults();
  const [open, setOpen] = useState<string | null>(null);

  const done = getCompletedStepsCount();
  const current = WORKFLOW_STEPS.find((s) => !hasStepResult(s.id));
  const pct = Math.round((done / WORKFLOW_STEP_COUNT) * 100);

  return (
    <div className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
          Les 15 agents de votre maison d’édition
        </h2>
        <span className="text-[12px] font-semibold" style={{ color: '#8a6d1f' }}>
          Agent {Math.min(done + (current ? 1 : 0), WORKFLOW_STEP_COUNT)} / {WORKFLOW_STEP_COUNT}
          {current ? ` — ${current.codename} : ${current.agentRole}` : ' — pipeline terminé'}
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(0,0,0,0.07)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#0d7a5f,#c9a84c)' }} />
      </div>

      <ol className={`mt-3 grid gap-2 ${compact ? 'md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {WORKFLOW_STEPS.map((step) => {
          const finished = hasStepResult(step.id);
          const isCurrent = current?.id === step.id;
          const Icon = step.icon;
          const res = getStepResult(step.id);
          return (
            <li
              key={step.id}
              className="rounded-2xl border p-3"
              style={{
                borderColor: isCurrent ? 'rgba(201,168,76,0.55)' : 'rgba(0,0,0,0.08)',
                background: finished ? 'rgba(13,122,95,0.05)' : isCurrent ? 'rgba(201,168,76,0.08)' : '#fff',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold"
                  style={{ background: 'rgba(201,168,76,0.18)', color: '#8a6d1f' }}
                >
                  {step.id}
                </span>
                <Icon className="h-4 w-4" style={{ color: '#0d7a5f' }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  {step.codename} · {step.name}
                </span>
                <span className="ml-auto">
                  {finished ? (
                    <CheckCircle2 className="h-4 w-4" style={{ color: '#0d7a5f' }} />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#8a6d1f' }} />
                  ) : (
                    <Clock className="h-4 w-4" style={{ color: 'var(--v3-muted)' }} />
                  )}
                </span>
              </div>
              <div className="mt-1.5 text-[12px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
                {step.agentMission}
              </div>
              {finished && res?.displayContent ? (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen(open === step.id ? null : step.id)}
                    className="mt-2 text-[11px] font-semibold underline"
                    style={{ color: '#0d7a5f' }}
                  >
                    {open === step.id ? 'Masquer le résultat' : 'Voir le résultat'}
                  </button>
                  {open === step.id && (
                    <pre
                      className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap rounded-xl p-2 text-[11px]"
                      style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--v3-ink)' }}
                    >
                      {String(res.displayContent).slice(0, 6000)}
                    </pre>
                  )}
                </>
              ) : null}
            </li>
          );
        })}
      </ol>

      {done > 0 && current ? (
        <div
          className="mt-3 rounded-2xl border p-3 text-[12px]"
          style={{ borderColor: 'rgba(201,168,76,0.45)', background: 'rgba(201,168,76,0.08)', color: 'var(--v3-ink)' }}
        >
          Vous pouvez reprendre où vous en étiez : agent {done + 1} / {WORKFLOW_STEP_COUNT} ({current.codename} — {current.agentRole}).
        </div>
      ) : null}

      {Object.keys(results).length === 0 ? (
        <p className="mt-3 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          Aucun agent n’a encore travaillé : lancez votre livre et l’avancement s’affichera ici, agent par agent.
        </p>
      ) : null}
    </div>
  );
}
