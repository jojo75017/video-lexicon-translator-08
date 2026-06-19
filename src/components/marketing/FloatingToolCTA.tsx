import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { trackCTAClick } from '@/utils/analytics';

const DISMISS_KEY = 'ebs_tool_cta_dismissed';
const EXCLUDED_PREFIXES = ['/dashboard', '/ebook', '/admin', '/paiement', '/confirmation', '/merci', '/audit-pilot', '/gestion-prospects', '/crm', '/auth', '/demo'];

/**
 * Bouton flottant global "Tester l'outil gratuitement" — visible sur toutes les
 * pages publiques marketing pour rediriger les visiteurs vers le générateur.
 * Placé en bas à gauche pour ne pas chevaucher l'Ebookbot (bas à droite).
 */
const FloatingToolCTA: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const isExcluded = EXCLUDED_PREFIXES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (isExcluded) {
      setVisible(false);
      return;
    }
    if (typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY)) return;
    const t = window.setTimeout(() => setVisible(true), 2500);
    return () => window.clearTimeout(t);
  }, [isExcluded, location.pathname]);

  if (!visible || isExcluded) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 animate-in slide-in-from-bottom-4">
      <div className="relative flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg pl-4 pr-3 py-2.5">
        <Link
          to="/demo"
          onClick={() => trackCTAClick('floating_tool_cta', '/demo')}
          className="flex items-center gap-2 font-semibold text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Tester l'outil gratuitement
        </Link>
        <button
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, '1');
            setVisible(false);
          }}
          aria-label="Masquer"
          className="ml-1 opacity-80 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FloatingToolCTA;
