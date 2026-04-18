import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FIRST_VISIT_KEY = 'ebookstudio_first_visit_banner_dismissed';

/**
 * Yellow banner displayed on first visit to /ebook-planner.
 * Invites the subscriber to read /guide-outils (2 min) before diving in.
 * Dismissed permanently via localStorage.
 */
export const FirstVisitBanner = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(FIRST_VISIT_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // ignore
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(FIRST_VISIT_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const goToGuide = () => {
    dismiss();
    navigate('/guide-outils');
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-kdp-orange/15 via-amber-200/20 to-kdp-orange/10 border-b border-kdp-orange/30">
      <div className="container mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-kdp-orange/20 flex-shrink-0">
          <Sparkles className="h-4 w-4 text-kdp-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            👋 Bienvenue sur EbookStudio !
          </p>
          <p className="text-xs text-muted-foreground">
            Découvrez le guide des outils en 2 min pour ne pas vous perdre dans les 44 outils disponibles.
          </p>
        </div>
        <Button
          size="sm"
          onClick={goToGuide}
          className="bg-kdp-orange hover:bg-kdp-orange/90 text-white rounded-lg flex-shrink-0"
        >
          Voir le guide
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="p-1.5 rounded-md hover:bg-background/40 text-muted-foreground flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FirstVisitBanner;
