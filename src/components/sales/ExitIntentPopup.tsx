import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { trackExitIntent } from "@/utils/analytics";

const CAPTURE_URL = "https://www.trafic-affiliation.com/ebookstudio_capture";

interface ExitIntentPopupProps {
  onContinueToOffer?: () => void;
}

const ExitIntentPopup = ({ onContinueToOffer }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasAutoShownRef = useRef(false);

  const openPopup = useCallback(() => {
    if (hasAutoShownRef.current) return;
    hasAutoShownRef.current = true;
    trackExitIntent('shown');
    setIsOpen(true);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) openPopup();
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaUp = lastScrollY - currentY;
      const reachedTopZone = lastScrollY > 260 && currentY < 120;
      const fastUpNearTop = deltaUp > 120 && currentY < 220;
      if (reachedTopZone || fastUpNearTop) openPopup();
      lastScrollY = currentY;
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => openPopup(), 30000);
    };

    const handleActivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => openPopup(), 30000);
    };

    const activationTimer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("mousemove", handleActivity, { passive: true });
      inactivityTimer = setTimeout(() => openPopup(), 30000);
    }, 1000);

    return () => {
      clearTimeout(activationTimer);
      clearTimeout(inactivityTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleActivity);
    };
  }, [openPopup]);

  const handleManualOpen = () => { trackExitIntent('shown'); setIsOpen(true); };

  const handleGetGuide = () => {
    trackExitIntent('converted');
    window.open(CAPTURE_URL, "_blank");
    setIsOpen(false);
  };

  const handleContinueToOffer = () => {
    setIsOpen(false);
    onContinueToOffer?.();
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  const benefits = [
    "10 niches peu concurrentielles et très demandées",
    "Le potentiel KDP réel de chaque niche",
    "Des stratégies pour maximiser vos ventes",
    "Un plan d'action étape par étape",
  ];

  return (
    <>
      {/* Barre fixe en haut — redirige directement vers le tunnel */}
      <a
        href={CAPTURE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackExitIntent('converted')}
        className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-foreground font-bold px-4 py-2.5 shadow-lg transition-all duration-300 text-sm md:text-base cursor-pointer"
      >
        <Gift className="w-4 h-4 flex-shrink-0 animate-bounce" />
        <span>🎁 OFFERT : 10 Niches KDP Rentables à Exploiter → Récupérez-les !</span>
        <ArrowRight className="w-4 h-4 flex-shrink-0" />
      </a>

      {/* Dialog popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 bg-background text-foreground shadow-2xl shadow-primary/20 z-[100]">
          <VisuallyHidden>
            <DialogTitle>Cadeau exclusif - 10 Niches KDP gratuites</DialogTitle>
            <DialogDescription>Recevez gratuitement 10 niches KDP rentables prêtes à exploiter</DialogDescription>
          </VisuallyHidden>

          {/* Header gradient */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Gift className="w-6 h-6 text-foreground animate-bounce" />
                <span className="text-foreground font-black text-xl tracking-wide uppercase">Attendez !</span>
                <Gift className="w-6 h-6 text-foreground animate-bounce" />
              </div>
              <p className="text-foreground/90 text-sm font-medium">
                Ne partez pas les mains vides...
              </p>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 text-center space-y-5">
            <div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                Recevez <span className="text-amber-400">10 Niches KDP</span>
              </h3>
              <p className="text-lg text-violet-300 font-semibold italic">
                rentables prêtes à exploiter
              </p>
            </div>

            {/* Value box */}
            <div className="bg-gradient-to-br from-violet-900/60 to-violet-800/30 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-amber-400 text-sm uppercase tracking-wide">
                  Accès immédiat & 100% gratuit
                </span>
              </div>
              <div className="space-y-2 text-left">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-400 text-xs">
              La majorité des auteurs échouent sur KDP à cause d'un mauvais choix de niche. Ne faites pas cette erreur.
            </p>

            {/* CTA principal */}
            <Button
              onClick={handleGetGuide}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-foreground font-black py-6 text-lg shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gift className="w-5 h-5 mr-2" />
              Oui, je veux les 10 niches KDP !
            </Button>

            <Button
              onClick={handleContinueToOffer}
              variant="ghost"
              className="w-full text-violet-400 hover:text-violet-300 hover:bg-violet-900/30 py-4"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Voir l'offre EbookStudio à 67€
            </Button>

            <button
              onClick={() => { trackExitIntent('dismissed'); setIsOpen(false); }}
              className="text-xs text-gray-600 hover:text-gray-400 underline"
            >
              Non merci, je ne veux pas de guide gratuit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExitIntentPopup;
