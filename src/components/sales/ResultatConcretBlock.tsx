import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Mic, ArrowRight, Gift, PlayCircle } from "lucide-react";
import { trackCTAClick } from "@/utils/analytics";

const examples = [
  {
    icon: BookOpen,
    title: "Un ebook publiable Amazon KDP",
    desc: "Manuscrit + couverture + description optimisée, prêt à uploader.",
    badge: "Format complet",
  },
  {
    icon: FileText,
    title: "Une fiche pratique vendable",
    desc: "Mini-produit court (10–30 pages) à vendre 7€ à 17€.",
    badge: "Mini-produit",
  },
  {
    icon: Mic,
    title: "Une version audio (audiobook)",
    desc: "Voix pro générée, hébergée et vendable depuis ton lien.",
    badge: "Bonus audio",
  },
];

const ResultatConcretBlock = () => {
  return (
    <section className="py-14 px-4 bg-joy-cream">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-joy-sun text-joy-ink text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Ce que tu obtiens vraiment
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-joy-ink mb-2">
            Pas un outil de plus. Un résultat concret.
          </h2>
          <p className="text-joy-ink/70 max-w-2xl mx-auto">
            En quelques heures, tu sors un produit fini que tu peux vendre — pas juste des
            “fonctionnalités cool”.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border-2 border-joy-ink/5 shadow-joy hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-[hsl(var(--joy-mint)/0.5)] flex items-center justify-center">
                  <ex.icon className="w-5 h-5 text-joy-ink" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-joy-ink/60 bg-joy-cream px-2 py-1 rounded-full">
                  {ex.badge}
                </span>
              </div>
              <h3 className="font-black text-joy-ink mb-1">{ex.title}</h3>
              <p className="text-sm text-joy-ink/70">{ex.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA faible friction */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[hsl(var(--joy-peach))] shadow-joy flex flex-col md:flex-row items-center gap-5">
          <div className="text-5xl flex-shrink-0">🎁</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black text-joy-ink mb-1">
              Pas encore prêt(e) à acheter ? Teste gratuitement.
            </h3>
            <p className="text-joy-ink/70 text-sm">
              Lance la démo en 5 minutes : tu vois exactement ce que la plateforme produit pour toi,
              sans payer, sans CB.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Link
              to="/demo"
              onClick={() => trackCTAClick("free_demo", "resultat_concret_block")}
              className="w-full sm:w-auto"
            >
              <Button className="w-full bg-joy-ink text-joy-cream hover:bg-joy-ink/90 font-black rounded-full px-6">
                <PlayCircle className="w-4 h-4 mr-2" />
                Démo gratuite (5 min)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link
              to="/cadeau"
              onClick={() => trackCTAClick("free_gift", "resultat_concret_block")}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full border-2 border-joy-ink/20 hover:border-joy-ink/40 text-joy-ink font-bold rounded-full px-6"
              >
                <Gift className="w-4 h-4 mr-2" />
                Recevoir le guide offert
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultatConcretBlock;
