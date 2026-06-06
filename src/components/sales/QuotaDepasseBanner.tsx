import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Bandeau d'information : le quota de l'offre à 47€ est dépassé.
 * L'offre est désormais à 67€ à vie.
 */
const QuotaDepasseBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-[#232F3E] text-white text-center py-2.5 px-10 text-sm font-semibold flex items-center justify-center gap-2 flex-wrap">
      <AlertTriangle className="w-4 h-4 text-[#FF9E2D] shrink-0" />
      <span>
        Quota atteint — l'offre à{' '}
        <span className="line-through opacity-70">47€</span> n'existe plus.
        Tarif désormais{' '}
        <strong className="text-[#FF9E2D]">67€ à vie</strong>.
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Fermer le bandeau"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuotaDepasseBanner;
