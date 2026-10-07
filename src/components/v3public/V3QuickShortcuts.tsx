import { Link } from 'react-router-dom';
import AgentPortrait from './AgentPortrait';

const SHORTCUTS = [
  { label: 'Contenu KDP', to: '/v3/kdp', color: '#4D7C5B', agent: 'gaspard', name: 'Gaspard', role: 'Toutes les pages KDP' },
  { label: 'Créer', to: '/v3/create', color: '#0F766E', agent: 'camille', name: 'Camille', role: 'Lancer un livre' },
  { label: 'Écrire', to: '/v3/lancer', color: '#1D4ED8', agent: 'victor', name: 'Victor', role: 'Rédiger chapitre par chapitre' },
  { label: 'Habiller', to: '/v3/cover-pro', color: '#EC4899', agent: 'iris', name: 'Iris', role: 'Couvertures' },
  { label: 'Publier', to: '/audit-pilot', color: '#0891B2', agent: 'timothee', name: 'Timothée', role: 'Audit avant publication' },
  { label: 'Vendre', to: '/kdp-keywords', color: '#CA8A04', agent: 'solene', name: 'Solène', role: 'Mots-clés Amazon' },
  { label: 'Livres spéciaux', to: '/v3/create/illustre', color: '#9333EA', agent: 'prune', name: 'Prune', role: 'Albums et illustrés' },
  { label: 'Version audio', to: '/v3/version-audio', color: '#D97706', agent: 'aurele', name: 'Aurèle', role: 'Votre livre en audio' },
];

export default function V3QuickShortcuts() {
  return (
    <section className="v3-shell py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: '#232F3E' }}>Raccourci rapide</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="flex items-center gap-3 rounded-2xl p-3 bg-white transition hover:-translate-y-0.5"
            style={{ border: `2px solid ${s.color}`, boxShadow: `0 10px 24px -18px ${s.color}` }}
          >
            <span className="w-12 h-12 rounded-full overflow-hidden shrink-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover" style={{ boxShadow: `0 0 0 2px ${s.color}` }}>
              <AgentPortrait id={s.agent} name={s.name} />
            </span>
            <span className="min-w-0">
              <span className="block font-bold text-sm" style={{ color: s.color }}>{s.label}</span>
              <span className="block text-xs" style={{ color: '#475569' }}>{s.name} · {s.role}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
