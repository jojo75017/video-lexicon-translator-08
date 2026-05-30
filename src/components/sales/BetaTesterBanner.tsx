import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const TOTAL_SLOTS = 5;

/**
 * Bandeau bêta-testeurs affiché en haut de la page offres.
 * Affiche le nombre de places restantes (sur 5) et un bouton vers /activer-beta.
 * Disparaît automatiquement quand les 5 places sont prises.
 */
const BetaTesterBanner = () => {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    supabase.functions
      .invoke("beta-slots")
      .then(({ data }) => {
        if (active && data && typeof data.remaining === "number") {
          setRemaining(data.remaining);
        } else if (active) {
          setRemaining(TOTAL_SLOTS);
        }
      })
      .catch(() => active && setRemaining(TOTAL_SLOTS));
    return () => {
      active = false;
    };
  }, []);

  // Tant qu'on ne sait pas, on affiche le bandeau (optimiste).
  if (remaining === 0) return null;

  const left = remaining ?? TOTAL_SLOTS;

  return (
    <div className="bg-gradient-to-r from-accent via-accent to-accent/90 text-foreground border-b-2 border-accent">
      <div className="max-w-5xl mx-auto px-4 py-5 sm:py-6 flex flex-col items-center text-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-extrabold uppercase tracking-wider">
          <Gift className="w-3.5 h-3.5 shrink-0" />
          Programme bêta-testeurs ouvert
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
          Rejoignez nos bêta-testeurs : accès gratuit à vie
        </h2>
        <p className="text-sm sm:text-base font-medium max-w-2xl">
          Nous ouvrons seulement <strong>{TOTAL_SLOTS} places</strong> aux premiers bêta-testeurs
          d'EbookStudio Pro V2. Soyez parmi les premiers à tester la plateforme gratuitement.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
          <span className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-4 py-1.5 text-sm font-bold">
            {left} / {TOTAL_SLOTS} {left > 1 ? "places restantes" : "place restante"}
          </span>
          <Button
            onClick={() => navigate("/activer-beta")}
            className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full px-6"
          >
            Activer mon code bêta
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BetaTesterBanner;
