import { useEffect, useState } from 'react';
import { Settings2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

/**
 * Badge en tête du Planner qui affiche en clair le provider IA actif
 * (et le modèle OpenRouter si applicable). Cliquer ouvre le panneau de réglages.
 */
export const WorkflowAIProviderBadge = () => {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);

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

  return (
    <>
      <div className="px-4 md:px-6 pt-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={[
            'w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition-all',
            valid
              ? 'bg-[#008296]/5 border-[#008296]/30 hover:bg-[#008296]/10'
              : 'bg-orange-50 border-orange-300 hover:bg-orange-100 animate-pulse',
          ].join(' ')}
        >
          <div className="flex items-center gap-3 min-w-0">
            {valid ? (
              <CheckCircle2 className="h-5 w-5 text-[#008296] shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
            )}
            <div className="min-w-0">
              {valid ? (
                <div className="text-sm">
                  <span className="text-[#5b6675]">IA active : </span>
                  <span className="font-semibold text-[#232F3E]">
                    {PROVIDER_LABELS[provider]}
                  </span>
                  {modelLabel && (
                    <span className="text-[#232F3E]"> — {modelLabel}</span>
                  )}
                </div>
              ) : (
                <div className="text-sm font-semibold text-orange-800">
                  ⚠ Aucune IA configurée — cliquez pour choisir Gemini, Claude, ChatGPT ou OpenRouter
                </div>
              )}
            </div>
          </div>
          <span
            className={[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0',
              valid
                ? 'bg-[#008296] text-white hover:bg-[#006b7a]'
                : 'bg-[#FF9E2D] text-white hover:bg-[#e88a14]',
            ].join(' ')}
          >
            <Settings2 className="h-3.5 w-3.5" />
            {valid ? 'Changer' : 'Configurer'}
          </span>
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
