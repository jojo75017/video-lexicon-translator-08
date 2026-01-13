import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Gift, Download, Sparkles, CheckCircle } from "lucide-react";
import { generateKdpNichesPdf } from "@/utils/generateKdpNichesPdf";
import { toast } from "sonner";

interface ExitIntentPopupProps {
  onContinueToOffer?: () => void;
}

const ExitIntentPopup = ({ onContinueToOffer }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const tryOpen = useCallback(() => {
    if (hasShown) return;
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) return;

    setIsOpen(true);
    setHasShown(true);
    sessionStorage.setItem("exitIntentShown", "true");
  }, [hasShown]);

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      // Plus fiable que "mouseleave" dans les iframes :
      // - relatedTarget null => sortie du document
      // - clientY proche du haut => intention de fermer l'onglet/la fenêtre
      const leavingDocument = (e as any).relatedTarget === null;
      if (leavingDocument && e.clientY <= 10) {
        tryOpen();
      }
    },
    [tryOpen]
  );

  useEffect(() => {
    // Mode test : /offres?forceExitIntent=1
    const params = new URLSearchParams(window.location.search);
    const force = params.get("forceExitIntent") === "1";
    if (force) {
      sessionStorage.removeItem("exitIntentShown");
      setHasShown(false);
    }

    // Fallback : visibilité (changement d'onglet)
    const onVisibility = () => {
      if (document.visibilityState === "hidden") tryOpen();
    };

    // Délai avant d'activer la détection
    const activationTimeout = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("blur", tryOpen);
      document.addEventListener("visibilitychange", onVisibility);

      // Force immédiate si mode test
      if (force) {
        tryOpen();
      }
    }, 1500);

    // Fallback automatique après 25 secondes sur la page (garantit l'affichage)
    const autoShowTimeout = setTimeout(() => {
      tryOpen();
    }, 25000);

    return () => {
      clearTimeout(activationTimeout);
      clearTimeout(autoShowTimeout);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("blur", tryOpen);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [handleMouseOut, tryOpen]);

  const handleDownloadBonus = async () => {
    setIsDownloading(true);
    try {
      // Petit délai pour l'effet visuel
      await new Promise(resolve => setTimeout(resolve, 800));
      generateKdpNichesPdf();
      toast.success("🎉 Votre guide PDF a été téléchargé !");
      
      // Fermer après téléchargement
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleContinueToOffer = () => {
    setIsOpen(false);
    onContinueToOffer?.();
    // Scroll vers la section pricing
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 bg-transparent">
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
            {/* Header avec animation */}
            <div className="relative bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 p-4 text-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiIGN4PSIxMCIgY3k9IjEwIiByPSIxIi8+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Gift className="w-6 h-6 text-white animate-bounce" />
                  <span className="text-white font-bold text-xl">ATTENDEZ !</span>
                  <Gift className="w-6 h-6 text-white animate-bounce" />
                </div>
                <p className="text-white/90 text-sm font-medium">
                  Un cadeau exclusif vous attend...
                </p>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Recevez GRATUITEMENT
              </h3>
              
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-2 border-violet-200 dark:border-violet-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <span className="font-bold text-violet-700 dark:text-violet-300 text-lg">
                    Guide PDF Exclusif
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  "10 Niches KDP Rentables en 2025"
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valeur : <span className="line-through">47€</span> → <span className="text-green-600 font-bold">GRATUIT</span>
                </p>
              </div>

              {/* Ce que contient le guide */}
              <div className="text-left space-y-2 mb-6">
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Dans ce guide, vous découvrirez :
                </p>
                <div className="space-y-1.5">
                  {[
                    "10 niches peu concurrentielles et très demandées",
                    "Les volumes de recherche et prix optimaux",
                    "Des exemples de titres qui convertissent",
                    "Conseils stratégiques pour chaque niche"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 text-lg shadow-lg"
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
                  className="w-full border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/50 py-5"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Voir l'offre spéciale à 37€
                </Button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 underline"
                >
                  Non merci, je préfère partir
                </button>
              </div>
            </div>

            {/* Footer rassurant */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🔒 Aucun email requis • Téléchargement instantané • 100% gratuit
              </p>
            </div>
          </div>
        </div>

        {/* Bouton fermer custom */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
