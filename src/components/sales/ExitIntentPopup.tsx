import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Download, Sparkles, CheckCircle } from "lucide-react";
import { generateKdpNichesPdf } from "@/utils/generateKdpNichesPdf";
import { toast } from "sonner";
import { trackExitIntent } from "@/utils/analytics";

interface ExitIntentPopupProps {
  onContinueToOffer?: () => void;
}

const ExitIntentPopup = ({ onContinueToOffer }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const hasAutoShownRef = useRef(false);

  const openPopup = useCallback(() => {
    if (hasAutoShownRef.current) return;
    hasAutoShownRef.current = true;
    trackExitIntent('shown');
    setIsOpen(true);
  }, []);

  // Exit-intent detection: mouse leaves viewport OR retour rapide vers le haut OR inactivité
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) openPopup();
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaUp = lastScrollY - currentY;

      // Déclenchement plus tolérant quand on remonte vers le haut de la page
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

  const handleDownloadBonus = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      generateKdpNichesPdf();
      trackExitIntent('converted');
      toast.success("🎉 Votre guide PDF a été téléchargé !");
      setTimeout(() => setIsOpen(false), 1500);
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleContinueToOffer = () => {
    setIsOpen(false);
    onContinueToOffer?.();
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Barre fixe en haut */}
      <button
        onClick={handleManualOpen}
        className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-4 py-2.5 shadow-lg transition-all duration-300 text-sm md:text-base"
      >
        <Gift className="w-4 h-4 flex-shrink-0" />
        <span>🎁 Guide GRATUIT : 10 Niches KDP Rentables → Cliquez ici !</span>
      </button>

      {/* Dialog popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-2 border-amber-500/50 bg-background shadow-2xl z-[100]">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gift className="w-6 h-6 text-white animate-bounce" />
              <span className="text-white font-bold text-xl">CADEAU EXCLUSIF</span>
              <Gift className="w-6 h-6 text-white animate-bounce" />
            </div>
            <p className="text-white/90 text-sm font-medium">
              Un guide offert rien que pour vous !
            </p>
          </div>

          {/* Contenu principal */}
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Recevez GRATUITEMENT
            </h3>
            
            <div className="bg-violet-50 dark:bg-violet-950/40 border-2 border-violet-300 dark:border-violet-700 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span className="font-bold text-violet-700 dark:text-violet-300 text-lg">
                  Guide PDF Exclusif
                </span>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-1">
                "10 Niches KDP Rentables en 2026"
              </h4>
              <p className="text-sm text-muted-foreground">
                Valeur : <span className="line-through">47€</span> → <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRATUIT</span>
              </p>
            </div>

            {/* Ce que contient le guide */}
            <div className="text-left space-y-2 mb-6">
              <p className="font-semibold text-foreground text-sm">
                Dans ce guide, vous découvrirez :
              </p>
              <div className="space-y-1.5">
                {[
                  "10 niches peu concurrentielles et très demandées",
                  "Les volumes de recherche et prix optimaux",
                  "Des exemples de titres qui convertissent",
                  "Conseils stratégiques pour chaque niche"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <Button
                onClick={handleDownloadBonus}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-6 text-lg shadow-lg"
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger Mon Guide Gratuit
                  </>
                )}
              </Button>

              <Button
                onClick={handleContinueToOffer}
                variant="outline"
                className="w-full border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/50 py-5"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Voir l'offre spéciale à 97€
              </Button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Non merci, continuer ma visite
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/50 px-6 py-3 text-center border-t">
            <p className="text-xs text-muted-foreground">
              🔒 Aucun email requis • Téléchargement instantané • 100% gratuit
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExitIntentPopup;
