import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EbookSettingsPanel } from './EbookSettingsPanel';
import {
  getProvider,
  getProviderKey,
  validateKeyFormat,
  getOpenRouterModel,
  PROVIDER_LABELS,
  OPENROUTER_MODELS,
} from '@/services/aiWritingService';
import { cn } from '@/lib/utils';

const VISIBLE_PREFIXES = [
  '/ebook',
  '/kdp',
  '/audit-pilot',
  '/practical-sheets',
  '/word-count',
  '/ai-chat',
  '/bd-studio',
  '/audiobook',
  '/espace',
  '/saas',
  '/admin-cockpit',
  '/tableau-de-bord',
  '/hub-v3',
  '/hub',

];
const HIDDEN_PREFIXES = ['/auth', '/logout-total', '/ebookbot'];

const ApiKeysFloatingButton = () => {
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 4000);
    return () => window.clearInterval(id);
  }, []);

  // Permet aux autres composants (ex. BookCreationStudio) d'ouvrir ce dialog
  // via window.dispatchEvent(new CustomEvent('open-api-keys')).
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-api-keys', handler);
    return () => window.removeEventListener('open-api-keys', handler);
  }, []);

  if (HIDDEN_PREFIXES.some((r) => location.pathname.startsWith(r))) return null;
  if (!VISIBLE_PREFIXES.some((r) => location.pathname.startsWith(r))) return null;

  const provider = getProvider();
  const key = getProviderKey(provider);
  const valid = !!key && validateKeyFormat(provider, key);

  let activeLabel = PROVIDER_LABELS[provider];
  if (provider === 'openrouter') {
    const m = getOpenRouterModel();
    const found = OPENROUTER_MODELS.find((x) => x.id === m);
    activeLabel = `OpenRouter · ${found ? found.label.split(' ')[0] : 'modèle'}`;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Choisir mon IA et clés API"
        title="Choisir mon IA · Clés API (Gemini / Claude / ChatGPT / OpenRouter)"
        className={cn(
          'fixed bottom-32 right-5 md:right-6 z-[9997]',
          'h-12 px-4 rounded-full shadow-2xl flex items-center gap-2',
          'text-sm font-semibold transition-all duration-200',
          valid
            ? 'bg-[#008296] text-white hover:bg-[#006b7a]'
            : 'bg-[#FF9E2D] text-white hover:bg-[#e88a14] animate-pulse ring-2 ring-[#FF9E2D]/40',
        )}
      >
        {valid ? <CheckCircle2 className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
        <span className="whitespace-nowrap">
          {valid ? `IA : ${activeLabel}` : 'Choisir mon IA · Clés API'}
        </span>
      </button>

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

export default ApiKeysFloatingButton;
