import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, Crown, ArrowRight, Star, Zap, BookOpen, Trophy, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ════════════════════════════════════════════════════════════════════════════════
// OffresKdpRocket - Style KDP Rocket (cards blanches, bordure orange, bulle verte)
// Click sur une card → ouvre une modale avec tout le détail + CTA orange
// ════════════════════════════════════════════════════════════════════════════════

interface Offer {
  id: string;
  icon: typeof Rocket;
  badge: string;
  title: string;
  subtitle: string;
  score: number;
  price: string;
  oldPrice?: string;
  highlights: string[];
  longDescription: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  recommended?: boolean;
}

const OFFERS: Offer[] = [
  {
    id: "founder-lifetime",
    icon: Crown,
    badge: "Offre Fondateur - À VIE",
    title: "Accès À Vie 67€",
    subtitle: "Payez une seule fois, accès illimité pour toujours (offre jusqu'au 15 septembre)",
    score: 99,
    price: "67€",
    oldPrice: "197€",
    highlights: [
      "Paiement unique - aucun abonnement",
      "Accès à vie à tous les 15 agents IA",
      "Toutes les futures mises à jour incluses",
      "⏰ Tarif de lancement jusqu'au 15 septembre (puis 197€ à vie)",
    ],
    longDescription:
      "L'offre fondateur unique : payez 67€ une seule fois et accédez à Ebookstudio Pro V2 À VIE. Après le 15 septembre, le tarif passera définitivement à 197€ à vie. Aucun abonnement, aucun renouvellement, toutes les futures fonctionnalités incluses.",
    features: [
      "✅ Accès illimité À VIE (paiement unique)",
      "✅ Workflow complet 15 agents IA (P1 à P15)",
      "✅ Générateur d'ebooks illimité",
      "✅ Studio Couverture IA + bibliothèque",
      "✅ Recherche de niches KDP en temps réel",
      "✅ Export EPUB / PDF / DOCX professionnels",
      "✅ Module audiobook + hébergement public",
      "✅ CRM + module marketing intégrés",
      "✅ Communauté privée + support direct",
      "✅ Toutes les futures mises à jour à vie",
      "✅ Garantie satisfait ou remboursé 30 jours",
    ],
    cta: "Verrouiller mon accès à vie pour 67€",
    ctaUrl: "/paiement-manuel?offer=founder-lifetime&price=67",
    recommended: true,
  },
];

const ScoreBubble = ({ score }: { score: number }) => (
  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/30 shrink-0">
    <span className="text-3xl font-extrabold leading-none">{score}</span>
    <span className="text-[9px] font-semibold opacity-90 uppercase tracking-wider">SCORE</span>
  </div>
);

const OfferCard = ({ offer, onClick }: { offer: Offer; onClick: () => void }) => {
  const Icon = offer.icon;
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative text-left w-full bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
        offer.recommended
          ? "border-[#FF6B1A] shadow-xl shadow-[#FF6B1A]/20"
          : "border-[#EAE3DC] hover:border-[#FF6B1A] hover:shadow-lg hover:shadow-[#FF6B1A]/10"
      }`}
    >
      {offer.recommended && (
        <div className="absolute top-0 right-0 bg-[#FF6B1A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
          ⭐ Recommandé
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFF1E6] flex items-center justify-center text-[#FF6B1A] shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF6B1A] bg-[#FFF1E6] px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
              {offer.badge}
            </div>
            <h3 className="text-lg font-bold text-black leading-tight">{offer.title}</h3>
            <p className="text-sm text-gray-600 mt-0.5">{offer.subtitle}</p>
          </div>
          <ScoreBubble score={offer.score} />
        </div>

        {/* Highlights */}
        <ul className="space-y-2 mb-5 mt-4">
          {offer.highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-black">
              <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mb-4 pt-3 border-t border-[#EAE3DC]">
          <div>
            {offer.oldPrice && (
              <span className="text-sm text-gray-400 line-through mr-2">{offer.oldPrice}</span>
            )}
            <span className="text-3xl font-extrabold text-black">{offer.price}</span>
          </div>
        </div>

        <div className="w-full bg-gradient-to-r from-[#FF6B1A] to-[#E55300] hover:from-[#E55300] hover:to-[#FF6B1A] text-white font-bold py-3 px-4 rounded-xl text-center text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all group-hover:shadow-lg group-hover:shadow-[#FF6B1A]/40">
          Voir cette offre
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.button>
  );
};

export default function OffresKdpRocket() {
  const [selected, setSelected] = useState<Offer | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF1E6] border border-[#FF6B1A]/30 rounded-full text-[#FF6B1A] text-xs font-bold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5" />
            Top des offres de la semaine
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Une seule offre, <span className="text-[#FF6B1A]">claire et définitive</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <strong>67€ une seule fois = accès à vie.</strong> Tarif de lancement valable jusqu'au <strong>15 septembre</strong> - ensuite il passera à 197€ à vie.
          </p>
        </div>

        {/* Une seule carte centrée */}
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onClick={() => setSelected(offer)} />
          ))}
        </div>

        {/* MODAL DETAIL */}
        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-w-2xl bg-white border-2 border-[#FF6B1A]/30 p-0 overflow-hidden">
            {selected && (
              <>
                {/* Header coloré orange */}
                <div className="bg-gradient-to-br from-[#FF6B1A] to-[#E55300] text-white p-8 relative">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                      <selected.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1">
                        {selected.badge}
                      </div>
                      <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                          {selected.title}
                        </DialogTitle>
                      </DialogHeader>
                      <p className="text-white/90 mt-1 text-sm">{selected.subtitle}</p>
                    </div>
                    <ScoreBubble score={selected.score} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    {selected.longDescription}
                  </p>

                  <div>
                    <div className="text-xs font-bold text-[#FF6B1A] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Tout ce qui est inclus
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selected.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-black bg-[#F0FDF4] border border-[#22C55E]/20 rounded-lg px-3 py-2"
                        >
                          <Check className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="border-t border-[#EAE3DC] bg-[#FFF8F3] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    {selected.oldPrice && (
                      <span className="text-base text-gray-400 line-through mr-2">
                        {selected.oldPrice}
                      </span>
                    )}
                    <span className="text-4xl font-extrabold text-black">{selected.price}</span>
                    <p className="text-xs text-gray-600 mt-1">Paiement unique · Accès à vie · Garantie 30 jours</p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelected(null);
                      navigate(selected.ctaUrl);
                    }}
                    className="bg-gradient-to-r from-[#FF6B1A] to-[#E55300] hover:from-[#E55300] hover:to-[#FF6B1A] text-white font-bold px-8 py-6 rounded-xl text-base shadow-lg shadow-[#FF6B1A]/40 hover:shadow-xl transition-all"
                  >
                    {selected.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
