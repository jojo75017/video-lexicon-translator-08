import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, X, ArrowRight } from "lucide-react";

const STORAGE_KEY = "coaching_vip_banner_dismissed_v1";

const CoachingVipBanner = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (hidden) return null;

  return (
    <div className="bg-gradient-to-r from-[#008296] via-[#00a3b4] to-[#FF9E2D] text-white">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Flame className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <span className="font-bold truncate">
            <span className="hidden sm:inline">Offre privée — </span>
            10 places coaching VIP 30 jours
          </span>
          <span className="hidden md:inline opacity-90">·</span>
          <span className="hidden md:inline opacity-95 line-through">197€</span>
          <span className="font-black bg-white text-[#008296] px-2 py-0.5 rounded-full text-xs">
            47€
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/coaching-vip"
            className="inline-flex items-center gap-1 bg-white text-[#232F3E] hover:bg-[#FFE9CC] transition-colors px-3 py-1.5 rounded-full font-bold text-xs"
          >
            Voir l'offre
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setHidden(true);
            }}
            aria-label="Fermer la bannière"
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachingVipBanner;
