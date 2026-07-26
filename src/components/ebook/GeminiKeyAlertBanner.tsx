import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';

const DISMISS_KEY = 'gemini_alert_dismissed_at';
const VISIBLE_PREFIXES = [
  '/ebook', '/kdp', '/audit-pilot', '/practical-sheets', '/word-count',
  '/ai-chat', '/bd-studio', '/audiobook', '/espace', '/saas',
  '/tableau-de-bord', '/hub-v3', '/hub', '/v3',
];

/**
 * Bandeau d'alerte global : affiché aux abonnés connectés qui n'ont
 * AUCUNE clé IA valide configurée (Gemini / Claude / OpenAI / OpenRouter).
 * Sans clé, les edge functions IA retournent une erreur non-2xx.
 */
const GeminiKeyAlertBanner = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (raw) {
      const ts = Number(raw);
      // Réaffiche après 24h
      if (Date.now() - ts < 24 * 60 * 60 * 1000) setDismissed(true);
    }
    const id = window.setInterval(() => setTick((n) => n + 1), 3000);
    return () => window.clearInterval(id);
  }, []);

  if (!isAuthenticated || dismissed) return null;
  if (!VISIBLE_PREFIXES.some((p) => location.pathname.startsWith(p))) return null;

  const provider = getProvider();
  const key = getProviderKey(provider);
  const hasValid = !!key && validateKeyFormat(provider, key);
  if (hasValid) return null;

  const openKeys = () => window.dispatchEvent(new CustomEvent('open-api-keys'));
  const close = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-amber-500 text-white shadow-lg" role="alert">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <div className="text-sm flex-1 min-w-0">
          <strong>Clé IA manquante.</strong>{' '}
          <span className="opacity-95">
            Sans clé Gemini, l'EBOOKBOT, la recherche Amazon KDP et le workflow ne fonctionnent pas.
            Configurez-la en 90 sec (gratuit).
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 h-8 px-3 rounded-md bg-white/20 hover:bg-white/30 text-white text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Obtenir ma clé
          </a>
          <button
            type="button"
            onClick={openKeys}
            className="h-8 px-3 rounded-md bg-white text-amber-700 text-xs font-bold hover:bg-amber-50"
          >
            Coller ma clé
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiKeyAlertBanner;
