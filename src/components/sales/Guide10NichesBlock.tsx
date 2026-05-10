import { Button } from "@/components/ui/button";
import { Gift, ArrowRight, CheckCircle2 } from "lucide-react";
import { trackCTAClick, trackLeadMagnetDownload } from "@/utils/analytics";

const LEAD_MAGNET_URL = "https://www.trafic-affiliation.com/niches_ebookstudio";

const bullets = [
  "10 niches validées sur Amazon KDP (vraie demande, peu de concurrence)",
  "Les mots-clés à viser pour chaque niche",
  "Des exemples de titres qui se vendent déjà",
];

const Guide10NichesBlock = () => {
  const handleClick = () => {
    trackCTAClick("guide_10_niches", "offres_lead_magnet_block");
    trackLeadMagnetDownload("10_niches_kdp");
  };

  return (
    <section id="guide-10-niches" className="py-14 px-4 bg-joy-cream">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-[hsl(var(--joy-peach))] shadow-joy">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-7xl md:text-8xl flex-shrink-0 animate-joy-float">🎯</div>

            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-joy-sun text-joy-ink text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                100% gratuit
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-joy-ink mb-3 leading-tight">
                Reçois gratuitement les <span className="underline decoration-[hsl(var(--joy-bubblegum))] decoration-4 underline-offset-4">10 niches KDP rentables 2026</span>
              </h2>

              <ul className="space-y-2 mb-5">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-joy-ink/80">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--joy-bubblegum))] flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href={LEAD_MAGNET_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-block w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-joy-ink text-joy-cream hover:bg-joy-ink/90 font-black rounded-full px-7 py-6 text-base shadow-joy">
                  <Gift className="w-5 h-5 mr-2" />
                  Recevoir mes 10 niches gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>

              <p className="text-xs text-joy-ink/50 mt-3">
                Gratuit · Pas de CB · Désinscription en 1 clic
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guide10NichesBlock;
