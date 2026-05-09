import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  trackCTAClick,
  trackNewsletterSignup,
  trackPlanSelect,
} from "@/utils/analytics";

// Joyful components (refonte v2)
import JoyfulBanner from "@/components/sales/joyful/JoyfulBanner";
import HeroJoyful from "@/components/sales/joyful/HeroJoyful";
import JoyfulPromise from "@/components/sales/joyful/JoyfulPromise";
import AgentsShowcaseFun from "@/components/sales/joyful/AgentsShowcaseFun";
import JoyfulJourney from "@/components/sales/joyful/JoyfulJourney";
import JoyfulLiveDemo from "@/components/sales/joyful/JoyfulLiveDemo";
import OffreUnique67 from "@/components/sales/joyful/OffreUnique67";
import JoyfulFAQ from "@/components/sales/joyful/JoyfulFAQ";
import FinalCtaJoyful from "@/components/sales/joyful/FinalCtaJoyful";

// Réutilisés tels quels
import HeroVideoTeaser from "@/components/sales/HeroVideoTeaser";
import EbookieAssistant from "@/components/sales/EbookieAssistant";
import KdpRoiCalculator from "@/components/sales/KdpRoiCalculator";

const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 147;

// ── Newsletter form (footer) ─────────────────────────────────────────────────
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("add-to-email-sequence", {
        body: { email: email.trim().toLowerCase() },
      });
      trackNewsletterSignup("footer");
      setDone(true);
    } catch {
      toast.error("Erreur");
    }
    setLoading(false);
  };

  if (done)
    return (
      <p className="text-joy-ink text-sm flex items-center gap-2">
        <CheckCircle className="w-4 h-4" /> Inscrit·e ! 🎉
      </p>
    );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white border-joy-ink/20 h-10 rounded-xl"
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-joy-ink text-joy-cream hover:bg-joy-ink/90 font-bold h-10 px-4 rounded-xl"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN SALES PAGE — version joyeuse
// ════════════════════════════════════════════════════════════════════════════

const SalesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSubscriberAccess, setHasSubscriberAccess] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) sessionStorage.setItem("referral_code", ref);
  }, [location.search]);

  useEffect(() => {
    document.title = "EbookStudio Pro — Crée ton ebook avec l'IA, en mode fun ✨";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Crée et publie ton ebook sur Amazon KDP avec 15 agents IA bienveillants. Workflow guidé, sans stress. 67€ à vie, garantie 30 jours."
      );
  }, []);

  useEffect(() => {
    const refresh = async () => {
      const savedSubscriberEmail = localStorage.getItem("subscriber_email");
      const savedSubscriberData = localStorage.getItem("subscriber_data");
      let subscriberAccess = false;
      if (savedSubscriberEmail && savedSubscriberData) {
        try {
          const parsed = JSON.parse(savedSubscriberData);
          subscriberAccess = Boolean(
            parsed?.access_code ||
              parsed?.status === "active" ||
              parsed?.plan_type === "lifetime" ||
              parsed?.plan_type === "pro"
          );
        } catch {
          subscriberAccess = false;
        }
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasSubscriberAccess(subscriberAccess);
      setHasAdminSession(Boolean(session));
    };
    void refresh();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => setTimeout(refresh, 0));
    return () => subscription.unsubscribe();
  }, []);

  const handlePlanClick = () => {
    trackPlanSelect("pro", LAUNCH_PRICE);
    trackCTAClick("plan_click", "pricing_section");
    navigate("/upsell-paiement?plan=pro");
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-joy-cream text-joy-ink overflow-x-hidden">
      <Helmet>
        <title>EbookStudio Pro — Crée ton ebook avec l'IA en mode fun ✨</title>
        <meta
          name="description"
          content="Crée et publie ton ebook sur Amazon KDP avec 15 agents IA bienveillants. Workflow guidé, sans stress. 67€ à vie, garantie 30 jours."
        />
        <meta property="og:title" content="EbookStudio Pro — Ton ebook, en mode fun" />
        <meta property="og:description" content="15 agents IA pour créer ton ebook sans stress. 67€ à vie." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ebookstudio.fr/offres" />
        <link rel="canonical" href="https://ebookstudio.fr/offres" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "EbookStudio Pro",
          "description": "Plateforme de création d'ebooks et audiobooks par IA — 15 agents pour créer, illustrer, publier sur Amazon KDP.",
          "brand": { "@type": "Brand", "name": "EbookStudio" },
          "offers": {
            "@type": "Offer",
            "price": "67",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-09-15",
            "url": "https://ebookstudio.fr/offres",
          },
        })}</script>
      </Helmet>

      {/* Bandeau jovial rotatif */}
      <JoyfulBanner />

      {/* Bandeau admin discret */}
      {hasAdminSession && (
        <div className="bg-joy-mint text-joy-ink text-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-1.5">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-3 h-3" /> Admin
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/admin")} className="underline underline-offset-2 hover:opacity-80">
                Dashboard
              </button>
              <span className="opacity-50">·</span>
              <button onClick={() => navigate("/ebook-planner")} className="underline underline-offset-2 hover:opacity-80">
                Générateur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bandeau abonné */}
      {hasSubscriberAccess && !hasAdminSession && (
        <div className="bg-[hsl(var(--joy-mint)/0.4)] border-b border-joy-ink/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
            <span className="flex items-center gap-1.5 text-joy-ink font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Ton accès est actif
            </span>
            <Button
              size="sm"
              onClick={() => navigate("/ebook-planner")}
              className="h-7 bg-joy-ink text-joy-cream hover:bg-joy-ink/90 font-bold rounded-full"
            >
              <Rocket className="w-3 h-3 mr-1" /> Ouvrir le générateur
            </Button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-joy-cream/90 backdrop-blur-xl border-b border-joy-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-joy-sun flex items-center justify-center shadow-joy">
              <BookOpen className="w-5 h-5 text-joy-ink" />
            </div>
            <div className="font-black text-lg text-joy-ink">
              EbookStudio<span className="text-[hsl(var(--joy-bubblegum))] ml-1">Pro</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#decouvrir" className="text-joy-ink/70 hover:text-joy-ink">Découvrir</a>
            <a href="#outils" className="text-joy-ink/70 hover:text-joy-ink">Les agents</a>
            <Link to="/demo" className="text-joy-ink/70 hover:text-joy-ink">Démo gratuite</Link>
            <a href="#pricing" className="text-joy-ink/70 hover:text-joy-ink">Tarif</a>
            <Link to="/subscription" className="text-joy-ink/70 hover:text-joy-ink">Connexion</Link>
          </nav>

          <Button
            onClick={scrollToPricing}
            className="bg-joy-ink text-joy-cream hover:bg-joy-ink/90 font-black rounded-full px-5 shadow-joy"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            67€ à vie
          </Button>
        </div>
      </header>

      {/* HERO */}
      <HeroJoyful onCtaClick={handlePlanClick} launchPrice={LAUNCH_PRICE} normalPrice={NORMAL_PRICE} />

      {/* PROMESSES */}
      <JoyfulPromise />

      {/* VIDÉO */}
      <section className="py-12 px-4 bg-joy-cream">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 md:p-6 shadow-joy border-2 border-[hsl(var(--joy-peach))]">
          <HeroVideoTeaser />
        </div>
      </section>

      {/* AGENTS */}
      <AgentsShowcaseFun />

      {/* COPILOTE EBOOKIE */}
      <div className="bg-joy-cream">
        <EbookieAssistant />
      </div>

      {/* PARCOURS 7 JOURS */}
      <JoyfulJourney />

      {/* DÉMO LIVE JOYEUSE */}
      <JoyfulLiveDemo onCtaClick={handlePlanClick} />

      {/* ROI */}
      <section className="py-16 px-4 bg-joy-cream">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-joy border-2 border-[hsl(var(--joy-mint))]">
          <KdpRoiCalculator onCtaClick={handlePlanClick} />
        </div>
      </section>

      {/* OFFRE UNIQUE 67€ */}
      <OffreUnique67 onCtaClick={handlePlanClick} launchPrice={LAUNCH_PRICE} normalPrice={NORMAL_PRICE} />

      {/* GARANTIE */}
      <section className="py-12 px-4 bg-joy-cream">
        <div className="max-w-2xl mx-auto bg-[hsl(var(--joy-mint)/0.4)] rounded-3xl p-8 text-center shadow-joy border-2 border-[hsl(var(--joy-mint))]">
          <div className="text-6xl mb-4 inline-block animate-joy-float">🛡️</div>
          <h3 className="text-2xl md:text-3xl font-black text-joy-ink mb-3">
            30 jours pour tester, sans stress
          </h3>
          <p className="text-joy-ink/80 leading-relaxed">
            Si dans les 30 jours tu publies pas ton 1er ebook ou si ça te plaît pas, tu m'écris et <strong>je te rembourse intégralement</strong>. Pas de question, pas de jugement. Promis.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <JoyfulFAQ />

      {/* FINAL CTA */}
      <FinalCtaJoyful onCtaClick={handlePlanClick} launchPrice={LAUNCH_PRICE} />

      {/* FOOTER */}
      <footer className="py-16 border-t border-joy-ink/10 bg-joy-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-2xl bg-joy-sun flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-joy-ink" />
                </div>
                <h3 className="text-lg font-black text-joy-ink">EbookStudio Pro</h3>
              </div>
              <p className="text-joy-ink/70 text-sm leading-relaxed">
                Le workflow IA #1 en France pour Amazon KDP — version joyeuse 🌈
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-joy-ink text-sm uppercase tracking-wider">Produit</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#demo-live" className="text-joy-ink/70 hover:text-joy-ink">Démo en direct</a></li>
                <li><button onClick={() => navigate("/formation")} className="text-joy-ink/70 hover:text-joy-ink">Formation</button></li>
                <li><button onClick={() => navigate("/extension-chrome")} className="text-joy-ink/70 hover:text-joy-ink">Extension Chrome</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-joy-ink text-sm uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/mentions-legales")} className="text-joy-ink/70 hover:text-joy-ink">Mentions légales</button></li>
                <li><button onClick={() => navigate("/cgv")} className="text-joy-ink/70 hover:text-joy-ink">CGV</button></li>
                <li><button onClick={() => navigate("/politique-confidentialite")} className="text-joy-ink/70 hover:text-joy-ink">Confidentialité</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-joy-ink text-sm uppercase tracking-wider">Newsletter</h4>
              <p className="text-joy-ink/70 text-sm mb-4">Conseils KDP & IA, en mode chill</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-joy-ink/10 pt-8 text-center">
            <p className="text-xs text-joy-ink/50">© 2026 EbookStudio Pro — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <Button
          onClick={handlePlanClick}
          className="w-full bg-joy-ink text-joy-cream font-black py-6 rounded-2xl shadow-joy-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          67€ à vie · Garantie 30j
        </Button>
      </div>
    </div>
  );
};

export default SalesPage;
