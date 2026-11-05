import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Minus, Plus } from 'lucide-react';
import { V3_HEADER_MENU } from '@/data/v3HeaderMenu';
import { ROBOT_THEME } from './V3MainTabs';
import AgentPortrait from './AgentPortrait';

/**
 * « Mes ateliers » — les 8 ateliers du menu principal, repliés par défaut,
 * en accordéons colorés sur fond sombre (maquette du 5 novembre).
 */
export default function V3SubscriberWorkshops() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <section id="v3-ateliers" className="v3-shell scroll-mt-24 py-10 md:py-14">
      <div className="text-center">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: 'rgba(246,189,42,0.12)', color: '#F6BD2A' }}
        >
          <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Tout est là
        </span>
        <h2 className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: '#F3EDE6' }}>
          Mes ateliers
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[14px]" style={{ color: '#B9AFA6' }}>
          Les 8 ateliers d'EbookStudio, dépliables en un clic — chaque onglet mène à une page existante.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {V3_HEADER_MENU.map((cat) => {
          const theme = ROBOT_THEME[cat.key];
          const color = theme?.color ?? '#64748B';
          const isOpen = !!open[cat.key];
          return (
            <div
              key={cat.key}
              className="overflow-hidden rounded-2xl"
              style={{ background: '#332E2B', border: `1px solid ${color}44` }}
            >
              <button
                type="button"
                onClick={() => setOpen((prev) => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:brightness-110"
                style={{ background: `linear-gradient(90deg, ${color}26, transparent 60%)` }}
              >
                {theme && (
                  <span
                    className="h-11 w-11 shrink-0 overflow-hidden rounded-full"
                    style={{ boxShadow: `0 0 0 2px ${color}` }}
                  >
                    <AgentPortrait id={theme.agent} name={theme.name} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-tight" style={{ color: '#F3EDE6' }}>
                    <span style={{ color }} aria-hidden="true">{cat.emoji}</span> {cat.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px]" style={{ color: '#B9AFA6' }}>
                    {cat.tagline} · {cat.links.length} accès
                  </span>
                </span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0" style={{ color }} />
                ) : (
                  <Plus className="h-4 w-4 shrink-0" style={{ color }} />
                )}
              </button>

              {isOpen && (
                <ul className="border-t px-2 py-2" style={{ borderColor: `${color}33` }}>
                  {cat.links.map((l) => (
                    <li key={cat.key + l.to + l.label}>
                      <Link
                        to={l.to}
                        className="block rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
                        title={l.label}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: color }}
                          />
                          <span className="flex-1 truncate text-[13.5px] font-semibold" style={{ color: '#F3EDE6' }}>
                            {l.label}
                          </span>
                          {l.badge && (
                            <span
                              className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                              style={{ background: color, color: '#fff' }}
                            >
                              {l.badge}
                            </span>
                          )}
                          <ChevronDown className="h-3.5 w-3.5 shrink-0 -rotate-90" style={{ color: '#B9AFA6' }} />
                        </span>
                        {l.desc && (
                          <span className="mt-0.5 block pl-3.5 text-[12px] leading-snug" style={{ color: '#B9AFA6' }}>
                            {l.desc}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
