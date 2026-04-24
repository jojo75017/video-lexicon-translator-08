import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
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

  // Hide on certain routes
  if (HIDDEN_ROUTES.some(r => location.pathname.startsWith(r))) return null;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 z-[9998] w-[calc(100vw-2rem)] sm:w-[400px] animate-in slide-in-from-bottom-4 duration-300">
          <EbookbotChat variant="floating" />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'fixed bottom-5 right-5 md:right-6 z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300',
          'bg-gradient-to-br from-orange-500 to-orange-600 hover:scale-110 hover:shadow-orange-300',
          open && 'rotate-180'
        )}
        aria-label={open ? 'Fermer EBOOKBOT' : 'Ouvrir EBOOKBOT'}
      >
        {pulse && !open && (
          <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-60" />
        )}
        {open ? (
          <X className="w-6 h-6 text-white relative" />
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow">IA</span>
        )}
      </button>
    </>
  );
};

export default EbookbotFloatingButton;
