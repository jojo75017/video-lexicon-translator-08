import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

// Pages sans barre de retour : accueils et tunnel de vente/paiement (ne pas distraire l'acheteur).
const HIDDEN_EXACT = ['/', '/v3', '/connexion-abonne', '/admin-login', '/admin-direct'];
const HIDDEN_PREFIX = ['/formules', '/paiement', '/commander', '/commande', '/oto', '/lancement', '/checkout'];

export default function GlobalBackBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (HIDDEN_EXACT.includes(pathname) || HIDDEN_PREFIX.some((p) => pathname.startsWith(p))) return null;

  const home = isAuthenticated ? '/v3' : '/';
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(home);
  };

  const btn =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90';
  const style = { background: 'rgba(21,29,44,0.92)', color: '#E6F4F1', border: '1px solid rgba(94,234,212,0.45)' };

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 gap-2 print:hidden" role="navigation" aria-label="Retour">
      <button type="button" onClick={goBack} className={btn} style={style}>
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Précédent
      </button>
      <button type="button" onClick={() => navigate(home)} className={btn} style={style}>
        <Home className="h-3.5 w-3.5" aria-hidden="true" /> Accueil
      </button>
    </div>
  );
}
