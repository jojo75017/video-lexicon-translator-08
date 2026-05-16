import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FIRST_VISIT_KEY = 'ebookstudio_first_visit_banner_dismissed';

/**
 * Encart de bienvenue centré, jovial, affiché à la première visite du Planner.
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
    <div className="px-4 md:px-6 lg:px-10 pt-3">
      <div className="relative mx-auto max-w-[1600px] rounded-2xl border border-[#008296]/20 bg-gradient-to-br from-white via-[#008296]/[0.03] to-[#FF9E2D]/[0.06] shadow-[0_4px_20px_-4px_rgba(0,130,150,0.1)] px-6 py-5">
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md hover:bg-white/60 text-[#5b6675]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF9E2D]/20 ring-4 ring-[#FF9E2D]/10">
            <Sparkles className="h-6 w-6 text-[#FF9E2D]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-[#232F3E]">
              👋 Bienvenue sur EbookStudio !
            </h2>
            <p className="text-sm text-[#5b6675] max-w-xl mx-auto">
              Découvrez le guide des outils en 2 min pour ne pas vous perdre dans les 44 outils disponibles.
            </p>
          </div>

          <Button
            size="sm"
            onClick={goToGuide}
            className="bg-[#FF9E2D] hover:bg-[#e88a14] text-white rounded-full px-5 font-semibold shadow-md"
          >
            Voir le guide
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstVisitBanner;
