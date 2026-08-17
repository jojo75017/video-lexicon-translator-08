import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowRight } from 'lucide-react';
import { getProviderKey, validateKeyFormat } from '@/services/aiWritingService';

/** Vrai si au moins une clé IA valide est déjà enregistrée dans les paramètres. */
function hasValidKey(): boolean {
  try {
    return (['gemini', 'openrouter', 'claude', 'openai'] as const).some((p) => {
      const key = getProviderKey(p);
      return Boolean(key) && validateKeyFormat(p, key);
    });
  } catch {
    return false;
  }
}

/**
 * Rappel d'une seule ligne, affiché uniquement si AUCUNE clé n'est enregistrée.
 * La saisie des clés reste dans Fonctionnalités > Clés API : pas de formulaire ici.
 */
export default function V3KeyHint() {
  const [ready, setReady] = useState<boolean>(() => hasValidKey());

  useEffect(() => {
    const refresh = () => setReady(hasValidKey());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (ready) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-[12px]"
      style={{ borderColor: 'rgba(201,168,76,0.55)', background: 'rgba(201,168,76,0.07)', color: 'var(--v3-ink)' }}>
      <span className="inline-flex items-center gap-1.5">
        <KeyRound className="h-3.5 w-3.5" style={{ color: '#8a6d1f' }} />
        Aucune clé IA enregistrée : la rédaction ne pourra pas démarrer.
      </span>
      <Link to="/v3/fonctionnalites/cles-api" className="v3-btn v3-btn-outline text-[11px]">
        Ouvrir Fonctionnalités &gt; Clés API <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
