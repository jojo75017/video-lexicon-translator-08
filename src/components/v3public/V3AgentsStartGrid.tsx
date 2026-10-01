import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AGENT_FILTERS, V3_AGENTS, type AgentFilter } from '@/data/v3Agents';
import AgentPortrait from './AgentPortrait';

/**
 * Grille « Commence ici » : un agent-personnage par type de livre.
 * Cartes rectangulaires, portrait coloré en bandeau, numéro en filigrane.
 */
export default function V3AgentsStartGrid() {
  const [filter, setFilter] = useState<AgentFilter | 'tous'>('tous');

  const agents = useMemo(
    () => (filter === 'tous' ? V3_AGENTS : V3_AGENTS.filter((a) => a.filter === filter)),
    [filter],
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {AGENT_FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                active
                  ? 'bg-[var(--v3-emerald,#065F46)] text-white'
                  : 'bg-black/[0.04] text-[var(--v3-ink,#232F3E)] hover:bg-black/[0.08]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            to={agent.route}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative h-36 overflow-hidden bg-muted">
              <span
                className="absolute right-3 top-2 z-10 text-3xl font-black leading-none opacity-25"
                style={{ color: agent.accent }}
              >
                {agent.num}
              </span>
              <AgentPortrait id={agent.id} name={agent.name} />
              <span className="absolute inset-x-0 bottom-0 h-px bg-border" aria-hidden="true" />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <p className="text-[15px] font-bold text-foreground">{agent.name}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: agent.accent }}>
                {agent.role}
              </p>
              <p className="mt-2 text-[12.5px] leading-snug text-muted-foreground">{agent.mission}</p>

              <ul className="mt-3 space-y-1">
                {agent.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-1.5 text-[11.5px] text-muted-foreground">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: agent.accent }} />
                    {d}
                  </li>
                ))}
              </ul>

              <span
                className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold"
                style={{ color: agent.accent }}
              >
                Commencer avec {agent.name}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
