import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import EbookbotChat from './EbookbotChat';
import { cn } from '@/lib/utils';

const HIDDEN_ROUTES = ['/ebookbot', '/auth', '/logout-total'];

const EbookbotFloatingButton = () => {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  // Ouvrir le chat depuis un autre composant (dashboard, bannière, etc.)
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-ebookbot', handleOpen);
    return () => window.removeEventListener('open-ebookbot', handleOpen);
  }, []);

  // Hide on certain routes
  if (HIDDEN_ROUTES.some(r => location.pathname.startsWith(r))) return null;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-28 right-4 md:right-6 z-[9998] w-[calc(100vw-2rem)] sm:w-[420px] animate-in slide-in-from-bottom-4 duration-300">
          <EbookbotChat variant="floating" />
        </div>
      )}

      {/* FAB avec label visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'fixed bottom-5 right-5 md:right-6 z-[9999] pl-3 pr-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300',
          'bg-gradient-to-br from-orange-500 to-orange-600 hover:scale-105 hover:shadow-orange-300/50',
          open && 'rotate-180 pr-3'
        )}
        aria-label={open ? 'Fermer EBOOKBOT' : 'Ouvrir EBOOKBOT'}
      >
        {pulse && !open && (
          <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-50" />
        )}
        {pulse && !open && (
          <span className="absolute -inset-1 rounded-full bg-orange-500/30 animate-pulse" />
        )}
        {open ? (
          <X className="w-5 h-5 text-white relative" />
        ) : (
          <div className="relative flex items-center justify-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="text-sm font-bold text-white whitespace-nowrap">EBOOKBOT</span>
          </div>
        )}
        {!open && (
          <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> IA
          </span>
        )}
      </button>
    </>
  );
};

export default EbookbotFloatingButton;
