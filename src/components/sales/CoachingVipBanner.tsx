import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, X, ArrowRight, Crown } from "lucide-react";
import { trackEvent } from "@/utils/analytics";

const STORAGE_KEY = "coaching_vip_banner_dismissed_v2";
const VIDEO_SRC = "/videos/coaching-vip-georges.mp4";

const CoachingVipBanner = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (hidden) return null;

  return (
    <div id="coaching-offer" className="bg-gradient-to-br from-[#008296] via-[#00a3b4] to-[#FF9E2D] text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Vidéo teaser */}
        <Link
          to="/coaching-vip"
          onClick={() => trackEvent("coaching_banner_click", { source: "video_thumb" })}
          className="relative block w-full md:w-56 aspect-video rounded-xl overflow-hidden shadow-lg ring-2 ring-white/40 flex-shrink-0 bg-black"
        >
          <video
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
          <span className="absolute bottom-1 right-1 bg-[#FF9E2D] text-[#232F3E] text-[10px] font-black px-2 py-0.5 rounded-full">
            ▶ 1 min
          </span>
        </Link>

        {/* Texte + CTA */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-95">
              Offre privée — 10 places seulement
            </span>
          </div>
          <h3 className="font-black text-base md:text-lg leading-tight">
            Coaching VIP 30 jours avec Georges
            <span className="hidden sm:inline"> — pour passer vraiment à l'action</span>
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-sm">
            <span className="line-through opacity-80">197€</span>
            <span className="font-black bg-white text-[#008296] px-2.5 py-0.5 rounded-full">
              47€
            </span>
            <span className="hidden sm:inline opacity-90 text-xs">
              · Paiement PayPal · Réponse sous 24h
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
          <Link
            to="/coaching-vip"
            onClick={() => trackEvent("coaching_banner_click", { source: "cta_button" })}
            className="inline-flex items-center gap-1.5 bg-white text-[#232F3E] hover:bg-[#FFE9CC] transition-colors px-4 py-2.5 rounded-full font-black text-sm shadow-md"
          >
            <Flame className="w-4 h-4 text-[#FF9E2D]" />
            Voir l'offre
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setHidden(true);
            }}
            aria-label="Fermer la bannière"
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachingVipBanner;
