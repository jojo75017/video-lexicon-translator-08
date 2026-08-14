import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { isMarketingExcluded, isExpatPath } from '@/lib/marketingExclusions';
import { getAbCopy } from '@/lib/abTest';
import { trackCaptureEvent } from '@/lib/captureTracking';
import { NICHES_10_LEAD_MAGNET, NICHES_10_PATH } from '@/lib/niches10Pack';

const DISMISS_KEY = 'ebs_sticky_signup_dismissed';
const DONE_KEY = 'ebs_lead_popup_done';

/**
 * Bandeau permanent (bas mobile / haut desktop) sur les pages publiques.
 *
 * Il ne demande plus d'email : un champ froid dans un bandeau ne convertissait
 * pas (537 affichages pour 1 clic). Il porte désormais une seule action —
 * aller voir la démonstration gratuite, où le sommaire est construit en direct.
 * L'email est demandé plus tard, une fois le résultat sous les yeux.
 */
const StickySignupBar: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const isExcluded = isMarketingExcluded(location.pathname);
  const isExpat = isExpatPath(location.pathname);
  const { variant, copy } = getAbCopy(isExpat);
  const leadMagnet = isExpat ? 'publier-kdp-etranger' : NICHES_10_LEAD_MAGNET;

  useEffect(() => {
    if (isExcluded) {
      setVisible(false);
      return;
    }
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(DISMISS_KEY) || localStorage.getItem(DONE_KEY)) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => {
      setVisible(true);
      trackCaptureEvent('sticky', 'view', { abVariant: variant, leadMagnet });
    }, 4000);
    return () => window.clearTimeout(t);
  }, [isExcluded, location.pathname]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible || isExcluded) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-0 z-[60] animate-in slide-in-from-bottom-4 sm:slide-in-from-top-4">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="relative max-w-5xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1 pr-8 sm:pr-0">
            <Sparkles className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold min-w-0">
              {isExpat ? copy.stickyMessage : '10 niches KDP vérifiées — offertes. Ne perdez pas un livre de plus.'}
            </p>
          </div>

          <Link
            to={isExpat ? '/demo' : NICHES_10_PATH}
            onClick={() => trackCaptureEvent('sticky', 'click', { abVariant: variant, leadMagnet })}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-background px-5 text-sm font-bold text-foreground whitespace-nowrap transition-transform hover:-translate-y-0.5"
          >
            {isExpat ? copy.stickyCta : 'Voir mes 10 niches'} <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="hidden md:block text-[11px] opacity-90 whitespace-nowrap">
            Gratuit · sans carte bancaire
          </p>

          <button
            onClick={dismiss}
            aria-label="Fermer le bandeau"
            className="absolute right-2 top-1.5 sm:static h-9 w-9 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickySignupBar;
