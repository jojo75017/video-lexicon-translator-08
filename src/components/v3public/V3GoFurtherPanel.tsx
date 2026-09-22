import { Users, Workflow, LineChart } from 'lucide-react';
import AgentAvatar from '@/components/v3public/AgentAvatar';
import { V3_AGENTS } from '@/data/v3Agents';

/**
 * « Pour aller plus loin » — présentation NON cliquable en avant-première :
 * les modules ouvrent le 1er octobre, aucun lien ne mène dans l'appli.
 */
export default function V3GoFurtherPanel() {
  const avatars = ['margaux', 'leandre', 'noemie', 'zoe']
    .map((id) => V3_AGENTS.find((a) => a.id === id))
    .filter(Boolean) as typeof V3_AGENTS;

  const card =
    'flex flex-col rounded-2xl border bg-white p-4';
  const iconWrap = 'grid h-9 w-9 place-items-center rounded-full';
  const iconStyle = { background: 'var(--v3-gold-soft)', color: '#6a4f10' } as const;
  const availability = (
    <span className="mt-3 text-[12px] font-semibold" style={{ color: 'var(--v3-muted)' }}>
      Disponible à l'ouverture · 1er octobre
    </span>
  );

  return (
    <section className="v3-shell">
      <div className="v3-note">
        <h2 className="v3-serif text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          Pour aller plus loin
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {/* 25 agents par type de livre */}
          <div className={card} style={{ borderColor: 'var(--v3-line)' }}>
            <span className={iconWrap} style={iconStyle}>
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
            {availability}
          </div>

          {/* Pipeline 15 agents */}
          <div className={card} style={{ borderColor: 'var(--v3-line)' }}>
            <span className={iconWrap} style={iconStyle}>
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
            {availability}
          </div>

          {/* KDP Pilot */}
          <div className={card} style={{ borderColor: 'var(--v3-line)' }}>
            <span className={iconWrap} style={iconStyle}>
              <LineChart className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              Suivre mes ventes réelles sur Amazon
            </p>
            <p className="mt-1 flex-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
              KDP Pilot, outil partenaire, avec un code réservé aux abonnés.
            </p>
            {availability}
          </div>
        </div>
      </div>
    </section>
  );
}
