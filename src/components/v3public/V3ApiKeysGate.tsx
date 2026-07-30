import { useCallback, useEffect, useState } from 'react';

import { CheckCircle2, ChevronDown, ChevronUp, KeyRound, TriangleAlert } from 'lucide-react';
import ApiProviderQuickSettings from '@/components/ebook/ApiProviderQuickSettings';
import { getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';

/** Vrai si au moins une clé IA valide est enregistrée. */
function hasValidKey(): boolean {
  try {
    const providers = ['gemini', 'openrouter', 'claude', 'openai'] as const;
    return providers.some((p) => {
      const key = getProviderKey(p);
      return Boolean(key) && validateKeyFormat(p, key);
    });
  } catch {
    return false;
  }
}

async function openAiStudio() {
  const url = 'https://aistudio.google.com/app/apikey';
  const { toast } = await import('sonner');
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Lien copié. Collez-le dans un nouvel onglet si le clic ne fonctionne pas.', { duration: 7000 });
  } catch { /* clipboard indisponible */ }
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    toast.info('Le nouvel onglet a été bloqué. Le lien est déjà copié : collez-le manuellement.', { duration: 9000 });
  }
}

type Props = {
  /** Texte d'alerte adapté au contexte (recherche, écriture…). */
  context?: string;
  className?: string;
};

/**
 * Encart « Vos clés IA » placé juste avant les zones de recherche / de création.
 * Clé manquante : alerte ambre ouverte. Clé active : ligne verte repliée.
 */
export default function V3ApiKeysGate({
  context = 'Collez ici votre clé Gemini, OpenAI, Claude ou OpenRouter : sans clé, la recherche Amazon et l’écriture ne démarrent pas.',
  className = '',
}: Props) {
  const [ready, setReady] = useState<boolean>(() => hasValidKey());
  // Le tableau doit rester immédiatement visible, même lorsqu'une clé existe déjà.
  const [open, setOpen] = useState<boolean>(true);

  const refresh = useCallback(() => setReady(hasValidKey()), []);

  useEffect(() => {
    const forceOpen = () => {
      setOpen(true);
      requestAnimationFrame(() => {
        document.getElementById('cles-ia')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    };
    if (window.location.hash === '#cles-ia') forceOpen();
    window.addEventListener('v3-open-keys', forceOpen);
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('v3-open-keys', forceOpen);
    };
  }, [refresh]);

  const openFloating = () => window.dispatchEvent(new CustomEvent('open-api-keys'));

  return (
    <section
      id="cles-ia"
      className={`scroll-mt-24 rounded-2xl border p-4 md:p-5 ${className}`}
      style={
        ready
          ? { borderColor: 'rgba(6,78,59,0.25)', background: '#ecf5f1' }
          : { borderColor: '#f0c36d', background: '#fdf6e6' }
      }
    >
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-start gap-3">
          <span
            className="grid place-items-center w-8 h-8 rounded-full shrink-0"
            style={ready ? { background: '#064e3b', color: '#fff' } : { background: '#c9a84c', color: '#1a1408' }}
          >
            {ready ? <CheckCircle2 className="w-4 h-4" /> : <TriangleAlert className="w-4 h-4" />}
          </span>
          <div>
            <p className="text-[13.5px] font-bold" style={{ color: ready ? '#064e3b' : '#7a5a0b' }}>
              {ready ? 'Clé IA active ✓' : 'Vos clés IA (Gemini, OpenAI, Claude, OpenRouter) — indispensable avant de commencer'}
            </p>
            {!ready && <p className="text-[12.5px] mt-0.5" style={{ color: '#7a5a0b' }}>{context}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!ready && (
            <>
              <button type="button" onClick={openAiStudio} className="v3-btn v3-btn-gold text-[12.5px] whitespace-nowrap cursor-pointer">
                Obtenir ma clé gratuite
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="v3-btn v3-btn-outline text-[12.5px] whitespace-nowrap"
              >
                Coller ma clé ici
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="v3-btn v3-btn-ghost text-[12.5px] whitespace-nowrap"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {open ? 'Masquer' : ready ? 'Modifier' : 'Configurer'}
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 rounded-xl bg-white p-4" style={{ border: '1px solid rgba(6,78,59,0.12)' }}>
          <ApiProviderQuickSettings onOpenAdvanced={openFloating} onStatusChange={refresh} />
        </div>
      )}
    </section>
  );
}
