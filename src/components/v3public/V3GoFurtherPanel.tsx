import { Link } from 'react-router-dom';
import { Users, Workflow, LineChart, ArrowRight } from 'lucide-react';
import AgentAvatar from '@/components/v3public/AgentAvatar';
import { V3_AGENTS } from '@/data/v3Agents';

/**
 * « Pour aller plus loin » — regroupe les entrées annexes de l'accueil
 * (25 agents, pipeline 15 agents, KDP Pilot) dans un seul encadré sobre.
 */
export default function V3GoFurtherPanel() {
  const avatars = ['margaux', 'leandre', 'noemie', 'zoe']
    .map((id) => V3_AGENTS.find((a) => a.id === id))
    .filter(Boolean) as typeof V3_AGENTS;

  return (
    <section className="v3-shell">
      <div className="v3-note">
        <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          Pour aller plus loin
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {/* 25 agents par type de livre */}
          <Link
            to="/v3/commence-ici"
            className="group flex flex-col rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
            style={{ borderColor: 'var(--v3-line)' }}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ background: 'var(--v3-gold-soft)', color: '#6a4f10' }}
            >
              <Users className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              Un agent par type de livre
            </p>
            <p className="mt-1 flex-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
              Roman, cuisine, voyage, enfants, coloriage, BD, atlas, jeux, agenda : 25 agents,
              chacun spécialiste de son format.
            </p>
            <span className="mt-3 flex items-center -space-x-2">
              {avatars.map((a) => (
                <span key={a.id} className="rounded-full bg-white ring-2 ring-white">
                  <AgentAvatar seed={a.id} accent={a.accent} robot={a.robot} size={30} />
                </span>
              ))}
            </span>
            <span
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: 'var(--v3-gold-600)' }}
            >
              Choisir mon agent <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Pipeline 15 agents */}
          <Link
            to="/v3/lancer"
            className="group flex flex-col rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
            style={{ borderColor: 'var(--v3-line)' }}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ background: 'var(--v3-gold-soft)', color: '#6a4f10' }}
            >
              <Workflow className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              Écrire mon livre avec les 15 agents
            </p>
            <p className="mt-1 flex-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
              Niche, structure, rédaction, humanisation, correction, métadonnées KDP, verdict final.
              Vous suivez l'avancement étape par étape.
            </p>
            <span className="mt-3 flex flex-wrap gap-1">
              {Array.from({ length: 15 }, (_, i) => (
                <span
                  key={i}
                  className="grid h-5 w-7 place-items-center rounded-full text-[9.5px] font-bold"
                  style={{ background: 'rgba(201,168,76,0.18)', color: '#8a6d1f' }}
                >
                  P{i + 1}
                </span>
              ))}
            </span>
            <span
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: 'var(--v3-gold-600)' }}
            >
              Ouvrir le workflow <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* KDP Pilot */}
          <Link
            to="/v3/kdp-pilot"
            className="group flex flex-col rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
            style={{ borderColor: 'var(--v3-line)' }}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ background: 'var(--v3-gold-soft)', color: '#6a4f10' }}
            >
              <LineChart className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              Suivre mes ventes réelles sur Amazon
            </p>
            <p className="mt-1 flex-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
              KDP Pilot, outil partenaire, avec un code réservé aux abonnés.
            </p>
            <span
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: 'var(--v3-gold-600)' }}
            >
              Voir KDP Pilot <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
