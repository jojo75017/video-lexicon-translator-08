import { useEffect, useState } from 'react';
import { Settings2, AlertTriangle, CheckCircle2, Loader2, XCircle, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { EbookSettingsPanel } from './EbookSettingsPanel';
import {
  getProvider,
  getProviderKey,
  validateKeyFormat,
  getOpenRouterModel,
  PROVIDER_LABELS,
  OPENROUTER_MODELS,
  type AIProvider,
} from '@/services/aiWritingService';

type TestState = 'idle' | 'testing' | 'ok' | 'fail';

/**
 * Badge en tête du Planner qui affiche en clair le provider IA actif
 * (et le modèle OpenRouter si applicable). Permet aussi de tester la clé
 * directement sans ouvrir le panneau complet.
 */
export const WorkflowAIProviderBadge = () => {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [testState, setTestState] = useState<TestState>('idle');

  // Re-évalue après fermeture du dialog (clé peut avoir changé)
  useEffect(() => {
    const onStorage = () => setTick((n) => n + 1);
    window.addEventListener('storage', onStorage);
    const id = window.setInterval(() => setTick((n) => n + 1), 4000);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.clearInterval(id);
    };
  }, []);

  const provider: AIProvider = getProvider();
  const key = getProviderKey(provider);
  const valid = !!key && validateKeyFormat(provider, key);

  let modelLabel = '';
  if (provider === 'openrouter') {
    const m = getOpenRouterModel();
    const found = OPENROUTER_MODELS.find((x) => x.id === m);
    modelLabel = found ? found.label : m;
  }

  const handleTest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!valid) return;
    setTestState('testing');
    try {
      let ok = false;
      if (provider === 'gemini') {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
        ok = r.ok || r.status === 429;
      } else if (provider === 'openai') {
        const r = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${key}` } });
        ok = r.ok || r.status === 429;
      } else if (provider === 'claude') {
        const r = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({ model: 'claude-3-5-haiku-20241022', max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] }),
        });
        ok = r.ok || r.status === 429;
      } else if (provider === 'openrouter') {
        const r = await fetch('https://openrouter.ai/api/v1/auth/key', { headers: { Authorization: `Bearer ${key}` } });
        ok = r.ok;
      }
      setTestState(ok ? 'ok' : 'fail');
      ok ? toast.success(`Clé ${PROVIDER_LABELS[provider]} valide ✓`) : toast.error('Clé rejetée par le serveur.');
    } catch {
      setTestState('fail');
      toast.error('Erreur réseau lors du test.');
    } finally {
      setTimeout(() => setTestState('idle'), 4000);
    }
  };

  return (
    <>
      <div className="px-4 md:px-6 lg:px-10 pt-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={[
            'w-full mx-auto max-w-[1600px] flex items-center justify-between gap-4 rounded-2xl border px-6 py-4 text-left transition-all shadow-[0_4px_20px_-4px_rgba(0,130,150,0.15)] hover:shadow-[0_8px_30px_-6px_rgba(0,130,150,0.25)]',
            valid
              ? 'bg-gradient-to-r from-[#008296] via-[#0a6b7a] to-[#005f6b] border-[#FF9E2D]/40 text-white'
              : 'bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100 border-orange-300 animate-pulse',
          ].join(' ')}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={[
                'flex h-10 w-10 items-center justify-center rounded-full shrink-0 ring-4',
                valid
                  ? 'bg-[#008296]/15 ring-[#008296]/10'
                  : 'bg-orange-200/60 ring-orange-200/40',
              ].join(' ')}
            >
              {valid ? (
                <CheckCircle2 className="h-5 w-5 text-[#008296]" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div className="min-w-0">
              {valid ? (
                <>
                  <div className="text-base md:text-lg font-bold text-[#232F3E] leading-tight">
                    ✨ IA active&nbsp;: {PROVIDER_LABELS[provider]}
                    {modelLabel && (
                      <span className="text-[#232F3E]"> — {modelLabel}</span>
                    )}
                  </div>
                  <div className="text-xs text-[#5b6675] mt-0.5">
                    Tous les agents P1–P15 utiliseront ce modèle
                  </div>
                </>
              ) : (
                <>
                  <div className="text-base md:text-lg font-bold text-orange-900 leading-tight">
                    ⚠ Aucune IA configurée
                  </div>
                  <div className="text-xs text-orange-800 mt-0.5">
                    Cliquez pour choisir Gemini, Claude, ChatGPT ou OpenRouter
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Test inline (visible seulement si une clé valide existe) */}
            {valid && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleTest}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTest(e as any); }}
                className={[
                  'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  testState === 'ok'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : testState === 'fail'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-[#008296]/30 text-[#008296] hover:bg-[#008296]/10 cursor-pointer',
                ].join(' ')}
                title="Tester la clé sans ouvrir le panneau"
              >
                {testState === 'testing' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                 testState === 'ok' ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                 testState === 'fail' ? <XCircle className="h-3.5 w-3.5" /> :
                 <Zap className="h-3.5 w-3.5" />}
                {testState === 'testing' ? 'Test…' :
                 testState === 'ok' ? 'OK' :
                 testState === 'fail' ? 'KO' : 'Tester'}
              </span>
            )}
            <span
              className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                valid
                  ? 'bg-[#008296] text-white hover:bg-[#006b7a]'
                  : 'bg-[#FF9E2D] text-white hover:bg-[#e88a14]',
              ].join(' ')}
            >
              <Settings2 className="h-3.5 w-3.5" />
              {valid ? 'Changer' : 'Configurer'}
            </span>
          </div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisir mon IA · Clés API & réglages</DialogTitle>
          </DialogHeader>
          <EbookSettingsPanel />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkflowAIProviderBadge;
