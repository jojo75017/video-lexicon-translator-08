import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

/**
 * Barre de retour affichée en haut d'un outil ouvert depuis un encart upsell
 * (`?from=upsells`). Même principe que la barre « Retour aux agents ».
 */
export default function V3UpsellReturnBar() {
  const location = useLocation();
  const from = new URLSearchParams(location.search).get('from');
  if (from !== 'upsells') return null;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2"
      style={{ background: 'var(--v3-cream)', borderBottom: '1px solid var(--v3-line)' }}
    >
      <span className="inline-flex items-center gap-2 text-[12px] font-semibold" style={{ color: 'var(--v3-muted)' }}>
        <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--v3-gold-600)' }} />
        Ouvert depuis les compléments & packs
      </span>
      <Link
        to="/v3/upsells"
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold"
        style={{ background: 'var(--v3-surface)', border: '1px solid var(--v3-line)', color: 'var(--v3-ink)' }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour aux upsells
      </Link>
    </div>
  );
}
