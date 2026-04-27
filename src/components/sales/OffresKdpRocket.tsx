import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, Crown, ArrowRight, Star, Zap, BookOpen, Trophy, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ════════════════════════════════════════════════════════════════════════════════
// OffresKdpRocket — Style KDP Rocket (cards blanches, bordure orange, bulle verte)
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
    id: "founder",
    icon: Rocket,
    badge: "Offre Fondateur",
    title: "Pack Fondateur 67€",
    subtitle: "Accès total à EbookStudio Pro pendant 1 an",
    score: 98,
    price: "67€",
    oldPrice: "147€",
    highlights: [
      "1 an d'accès illimité",
      "15 agents IA inclus",
      "Garantie 7 jours",
    ],
    longDescription:
      "Le tarif de lancement réservé aux 100 premiers fondateurs. Vous obtenez l'accès complet à la suite EbookStudio Pro pendant 12 mois : tous les outils, toutes les mises à jour, toute la formation.",
    features: [
      "Workflow complet 15 agents IA (P1 à P15)",
      "Générateur d'ebooks illimité",
      "Studio Couverture IA + bibliothèque",
      "Recherche de niches KDP en temps réel",
      "Export EPUB / PDF / DOCX professionnels",
      "Module audiobook + hébergement public",
      "CRM + module marketing intégrés",
      "Communauté privée + support direct",
      "Toutes les mises à jour pendant 1 an",
      "Garantie satisfait ou remboursé 7 jours",
    ],
    cta: "Je rejoins les fondateurs",
    ctaUrl: "/paiement-manuel?offer=founder&price=67",
    recommended: true,
  },
  {
    id: "creator",
    icon: BookOpen,
    badge: "Créateur",
    title: "Pack Créateur",
    subtitle: "Pour publier vos premiers ebooks KDP",
    score: 92,
    price: "47€",
    highlights: [
      "5 ebooks générés inclus",
      "Studio couverture",
      "Export KDP-ready",
    ],
    longDescription:
      "Idéal si vous démarrez sur KDP. Vous générez vos 5 premiers ebooks complets avec couvertures professionnelles, et vous êtes prêts à publier sur Amazon en moins d'une semaine.",
    features: [
      "5 ebooks complets générés par IA",
      "5 couvertures Studio IA inclus",
      "Export EPUB + PDF KDP",
      "Recherche de niches (50 requêtes)",
      "Templates marketing inclus",
      "Email d'onboarding personnalisé",
    ],
    cta: "Démarrer mon pack créateur",
    ctaUrl: "/paiement-manuel?offer=creator&price=47",
  },
  {
    id: "audiobook",
    icon: Sparkles,
    badge: "Audio",
    title: "Pack Audiobook",
    subtitle: "Transformez vos ebooks en livres audio premium",
    score: 89,
    price: "37€",
    highlights: [
      "TTS OpenAI Nova HD",
      "Hébergement inclus",
      "Page publique sur mesure",
    ],
    longDescription:
      "Convertissez n'importe quel manuscrit en audiobook professionnel avec la voix Nova d'OpenAI. Hébergement, page de vente publique et lecteur intégré inclus.",
    features: [
      "Workflow Audio Express (A1-A9)",
      "Voix OpenAI Nova HD",
      "Fusion audio professionnelle FFmpeg",
      "Hébergement public illimité",
      "Page de vente avec slug personnalisé",
      "Lecteur intégré responsive",
    ],
    cta: "Lancer mon audiobook",
    ctaUrl: "/paiement-manuel?offer=audiobook&price=37",
  },
  {
    id: "lifetime",
    icon: Crown,
    badge: "Lifetime",
    title: "Accès À Vie",
    subtitle: "Une seule fois, accès illimité pour toujours",
    score: 95,
    price: "297€",
    oldPrice: "597€",
    highlights: [
      "Aucun abonnement à renouveler",
      "Toutes les futures mises à jour",
      "Support prioritaire à vie",
    ],
    longDescription:
      "L'option ultime : payez une seule fois et accédez à EbookStudio Pro à vie, avec toutes les futures mises à jour et fonctionnalités.",
    features: [
      "Accès illimité à VIE",
      "Toutes les mises à jour incluses",
      "Support prioritaire VIP",
      "Accès anticipé aux nouveautés",
      "Bonus formation premium",
      "Statut Membre Fondateur",
    ],
    cta: "Verrouiller mon accès à vie",
    ctaUrl: "/paiement-manuel?offer=lifetime&price=297",
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
            Choisissez l'offre <span className="text-[#FF6B1A]">qui vous correspond</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cliquez sur une carte pour voir le détail complet et activer votre accès en quelques secondes.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-xs text-gray-600 mt-1">Paiement sécurisé · Garantie 7 jours</p>
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
