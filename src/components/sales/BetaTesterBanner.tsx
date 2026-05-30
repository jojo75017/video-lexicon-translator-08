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
    <div className="bg-accent text-foreground border-b border-accent">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Gift className="w-4 h-4 shrink-0" />
          Programme bêta-testeurs : accès gratuit à vie
        </span>
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-2.5 py-0.5 text-xs">
            {left} / {TOTAL_SLOTS} {left > 1 ? "places restantes" : "place restante"}
          </span>
        </span>
        <Button
          size="sm"
          onClick={() => navigate("/activer-beta")}
          className="h-8 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full px-4"
        >
          Activer mon code bêta
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default BetaTesterBanner;
