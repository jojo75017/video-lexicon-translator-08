import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Skull, Calculator, ListChecks, ArrowRight } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Skull, label: "7 arnaques classiques décortiquées" },
  { icon: Calculator, label: "Calculateur d'enchère max intégré" },
  { icon: ListChecks, label: "Checklist J-1 à J+30 prête à l'emploi" },
];

export default function KdpAdsTeaser() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden border-2 border-[#008296]/20 shadow-xl">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-gradient-to-br from-[#232F3E] to-[#008296] p-8 text-white flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-6 w-6" />
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Bonus inclus</span>
              </div>
              <h3 className="text-3xl font-bold mb-3">Guide Anti-Arnaque KDP Ads</h3>
              <p className="text-sm opacity-90">
                Évite les pièges qui font cramer 500 € en 2 semaines à 90 % des nouveaux auteurs KDP.
                Pédagogie pure, zéro promesse magique.
              </p>
            </div>

            <CardContent className="md:col-span-3 p-8 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-[#232F3E] mb-4">
                Ce que tu apprends en 30 minutes :
              </h4>
              <ul className="space-y-3 mb-6">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-[#232F3E]">
                    <div className="w-9 h-9 rounded-full bg-[#008296]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-[#008296]" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/kdp-ads-guide")}
                className="bg-[#008296] hover:bg-[#FF9E2D] text-white font-semibold gap-2 w-fit"
                size="lg"
              >
                Découvrir le guide complet <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Inclus dans l'abonnement EbookStudio Pro · Aucune campagne réelle n'est lancée depuis EbookStudio.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}
