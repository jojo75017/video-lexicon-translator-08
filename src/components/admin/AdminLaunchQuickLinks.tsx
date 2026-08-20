import { useNavigate } from 'react-router-dom';
import { Rocket, Mail, Eye, Crown, Gift, Headphones } from 'lucide-react';

type Tile = {
  to: string;
  label: string;
  hint: string;
  icon: any;
};

const TILES: Tile[] = [
  { to: '/admin/lancement', label: 'Pilotage du lancement', hint: 'Audio, dates, interrupteurs', icon: Rocket },
  { to: '/gestion-prospects', label: 'Base emails & envois', hint: 'Séquence + statut par destinataire', icon: Mail },
  { to: '/apercu-emails', label: 'Aperçu des emails', hint: 'Vérifier avant envoi', icon: Eye },
  { to: '/v3/attente', label: 'Salon des fondateurs', hint: 'Compte à rebours 1er octobre', icon: Crown },
  { to: '/essai', label: 'Essai gratuit', hint: 'Chapitre 1 offert', icon: Gift },
  { to: '/message', label: 'Message audio', hint: 'Page d’écoute du MP3', icon: Headphones },
];

/** Raccourcis « Lancement & Emails » toujours visibles en haut du tableau de bord admin. */
export default function AdminLaunchQuickLinks({ className = '' }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <section
      className={`rounded-2xl border p-4 ${className}`}
      style={{ borderColor: 'rgba(212,175,55,0.35)', background: '#0F2E1F' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>
        Lancement & Emails
      </p>
      <h2 className="mt-0.5 text-sm font-semibold text-white md:text-base">
        Tout le pilotage du lancement V3 en un seul endroit
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.to}
              type="button"
              onClick={() => navigate(tile.to)}
              className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.06] p-3 text-left transition hover:border-[#D4AF37]/60 hover:bg-white/[0.12]"
            >
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'rgba(212,175,55,0.18)' }}
              >
                <Icon className="h-4 w-4" style={{ color: '#D4AF37' }} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-white">{tile.label}</span>
                <span className="block truncate text-[11px] text-white/70">{tile.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
