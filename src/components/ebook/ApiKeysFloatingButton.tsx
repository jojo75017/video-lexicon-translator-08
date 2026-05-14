import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EbookSettingsPanel } from './EbookSettingsPanel';
import { cn } from '@/lib/utils';

/**
 * Bouton flottant "Clés API & Réglages" — visible sur toutes les pages
 * ebook / KDP de l'espace abonné. Ouvre le panneau EbookSettingsPanel
 * (clés Gemini / Claude / OpenAI / OpenRouter, polices, tailles, etc.).
 */
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
];

const HIDDEN_PREFIXES = ['/auth', '/logout-total', '/ebookbot'];

const ApiKeysFloatingButton = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (HIDDEN_PREFIXES.some((r) => location.pathname.startsWith(r))) return null;
  if (!VISIBLE_PREFIXES.some((r) => location.pathname.startsWith(r))) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Clés API & réglages"
        title="Clés API (Gemini / Claude / OpenAI / OpenRouter) & mise en page"
        className={cn(
          'fixed bottom-24 right-5 md:right-6 z-[9997]',
          'h-12 px-4 rounded-full shadow-xl flex items-center gap-2',
          'bg-white border border-[#008296]/30 text-[#008296]',
          'hover:bg-[#008296] hover:text-white transition-all duration-200',
          'text-sm font-semibold',
        )}
      >
        <KeyRound className="h-4 w-4" />
        <span className="hidden sm:inline">Clés API</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clés API & réglages avancés</DialogTitle>
          </DialogHeader>
          <EbookSettingsPanel />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeysFloatingButton;
