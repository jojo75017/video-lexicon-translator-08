import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Crown, Zap, Feather, Check, Lock, Star, ArrowRight,
  Palette, BookOpen, Rocket, Globe, Users, Wand2, ImageIcon, Mic,
  ShieldCheck, Clock, Gift, Mail,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SeoHead from "@/components/funnel/SeoHead";
import { V3_LAUNCH_DATE_ISO } from "@/config/v3Launch";
import { V3_PLANS, formatPrice, getYearlySavingsPercent } from "@/data/v3Pricing";

const EMERALD = "#064e3b";
const GOLD = "#c9a84c";
const GOLD_DEEP = "#a3831f";
const PAPER = "#fbfaf6";
const INK = "#1a1a1a";
const SERIF = "'Instrument Serif', Georgia, serif";

const NEWS: Array<{ icon: any; title: string; desc: string }> = [
  { icon: Wand2, title: "30 agents IA (P1 → P30)", desc: "Le pipeline enrichi : recherche, écriture, relecture, direction artistique, marketing." },
  { icon: Palette, title: "Cover Studio Pro", desc: "Direction artistique IA, dos automatique, 4e de couverture, 300 DPI KDP-ready." },
  { icon: BookOpen, title: "Livre illustré maternelle", desc: "Album carré 21×21 cm, illustrations cohérentes IA — 3-7 ans." },
  { icon: Rocket, title: "KDP Pilot Pro", desc: "Audit complet du livre avant publication : titre, mots-clés, catégories, prix." },
  { icon: Globe, title: "Traduction 10 langues", desc: "EN, ES, DE, IT, PT, NL, PL, JA, ZH, AR — IA + relecture premium." },
  { icon: ImageIcon, title: "Univers multi-volumes", desc: "Générez des sagas 3 à 10 tomes avec bible d'univers cohérente." },
  { icon: Mic, title: "Audiobook TTS", desc: "Conversion voix pro (Azure) pour livres audio KDP/Audible." },
  { icon: Users, title: "Forum communauté", desc: "230+ discussions, questions, retours d'expérience entre auteurs." },
];

function useCountdown(targetIso: string) {
  const [d, setD] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setD({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);
  return d;
}

function Countdown() {
  const { days, hours, mins, secs } = useCountdown(V3_LAUNCH_DATE_ISO);
  const box = (v: number, l: string) => (
    <div className="text-center">
      <div className="rounded-xl px-4 py-3 text-3xl md:text-4xl font-black tabular-nums"
        style={{ background: EMERALD, color: GOLD, minWidth: 72 }}>
        {String(v).padStart(2, "0")}
      </div>
      <span className="text-[10px] uppercase tracking-widest mt-1 block" style={{ color: EMERALD }}>{l}</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {box(days, "jours")}{box(hours, "h")}{box(mins, "min")}{box(secs, "sec")}
    </div>
  );
}

function PreRegisterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean.includes("@")) {
      toast.error("Email invalide");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("funnel_leads").insert({
        email: clean,
        lead_magnet: "v3_launch_notify",
        landing_url: typeof window !== "undefined" ? window.location.href : null,
        utm_campaign: "v3_prelaunch",
      });
      if (error && !String(error.message).includes("duplicate")) throw error;
      setDone(true);
      toast.success("Vous serez prévenu·e le 1er octobre 🚀");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: "#f0fdf4", border: `2px solid ${EMERALD}` }}>
        <Check className="w-8 h-8 mx-auto mb-2" style={{ color: EMERALD }} />
        <p className="font-semibold" style={{ color: EMERALD }}>Vous êtes bien inscrit·e !</p>
        <p className="text-sm mt-1 text-slate-600">Rendez-vous le 1er octobre 2026 pour l'ouverture officielle.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
      <div className="flex items-center gap-2 flex-1 rounded-xl bg-white px-4 py-3 border" style={{ borderColor: "#d4d4d4" }}>
        <Mail className="w-4 h-4 text-slate-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl px-6 py-3 font-bold text-sm disabled:opacity-60"
        style={{ background: GOLD, color: INK }}
      >
        {loading ? "…" : "Me prévenir le 1er octobre"}
      </button>
    </form>
  );
}

export default function V3OffrePage() {
  return (
    <div style={{ background: PAPER, color: INK }} className="min-h-screen">
      <SeoHead
        title="V3 EbookStudio — la maison d'édition IA — Ouverture 1er octobre"
        description="Découvrez la V3 EbookStudio : 30 agents IA, forfaits dès 9,99 €/mois, freemium, livres illustrés, KDP Pilot Pro. Ouverture 1er octobre 2026."
        canonical="https://www.ebookstudio.fr/v3/offre"
      />

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-5 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6"
            style={{ background: "#fff4c7", color: GOLD_DEEP, border: `1px solid ${GOLD}` }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Ouverture officielle · 1er octobre 2026
          </span>

          <h1 className="font-semibold leading-[1.05]" style={{ fontFamily: SERIF, color: EMERALD }}>
            <span className="block text-5xl md:text-6xl">La V3 arrive.</span>
            <span className="block text-5xl md:text-6xl italic mt-1" style={{ color: GOLD_DEEP }}>
              La maison d'édition IA repensée.
            </span>
          </h1>

          <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-600">
            30 agents IA, freemium gratuit, forfaits dès 9,99 €/mois, Cover Studio Pro,
            KDP Pilot Pro, livres illustrés, univers multi-volumes… L'atelier complet
            pour écrire, illustrer et publier votre livre sur Amazon.
          </p>

          <div className="mt-10">
            <Countdown />
          </div>

          <div className="mt-8">
            <PreRegisterForm />
            <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Aucune carte requise. Simple pré-inscription.
            </p>
          </div>
        </motion.div>
      </section>

      {/* BANDEAU V2 → V3 rassurance */}
      <section className="max-w-4xl mx-auto px-5 pb-8">
        <div className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: "#f0fdf4", border: `1px solid ${EMERALD}33` }}>
          <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" style={{ color: EMERALD }} />
          <div>
            <h3 className="font-bold" style={{ color: EMERALD }}>Vous êtes déjà abonné·e V2 ?</h3>
            <p className="text-sm text-slate-700 mt-1">
              <strong>Aucune action requise.</strong> Votre abonnement actuel continue
              sans interruption. Le 1er octobre, vous pourrez découvrir la V3 et
              choisir de basculer si vous le souhaitez — ou rester en V2. Tous vos
              livres, personnages et projets sont préservés.
            </p>
          </div>
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: GOLD_DEEP }}>
            Ce qui change
          </div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
            8 nouveautés majeures dans la V3
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEWS.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.title} className="rounded-2xl bg-white p-5"
                style={{ border: "1px solid #e7e5e0", boxShadow: "0 2px 6px rgba(6,78,59,0.04)" }}>
                <div className="w-10 h-10 rounded-lg grid place-items-center mb-3"
                  style={{ background: `${GOLD}22`, color: GOLD_DEEP }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[14px]" style={{ color: EMERALD }}>{n.title}</h3>
                <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FORFAITS */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: GOLD_DEEP }}>
            À l'ouverture
          </div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
            Trois forfaits, une même exigence
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
            Facturation mensuelle ou annuelle (jusqu'à -22 %). Freemium gratuit à
            l'ouverture — testez sans carte.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {V3_PLANS.map((plan) => {
            const featured = plan.id === "expert";
            const Icon = plan.id === "auteur" ? Crown : plan.id === "expert" ? Zap : Feather;
            const accent = plan.id === "expert" ? GOLD_DEEP : plan.id === "auteur" ? "#5B21B6" : EMERALD;
            const savings = getYearlySavingsPercent(plan);
            return (
              <article key={plan.id}
                className="relative rounded-2xl bg-white p-6 flex flex-col"
                style={{
                  border: featured ? `2px solid ${accent}` : "1px solid #e5e7eb",
                  boxShadow: featured ? "0 20px 40px -12px rgba(180,131,31,0.25)" : "0 4px 12px rgba(0,0,0,0.04)",
                }}>
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap"
                    style={{ background: accent }}>
                    ⭐ Le plus recommandé
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg grid place-items-center"
                    style={{ background: `${accent}15`, color: accent }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-2xl font-serif" style={{ color: EMERALD, fontFamily: SERIF }}>{plan.name}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-5 min-h-[3rem]">{plan.tagline}</p>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: EMERALD }}>{formatPrice(plan.monthlyPrice)}</span>
                    <span className="text-sm text-slate-500">/mois</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ou {formatPrice(plan.yearlyPrice)}/an · <span style={{ color: accent }}>-{savings}%</span>
                  </p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.slice(0, 6).map((f, i) => (
                    <li key={i} className="flex gap-2 text-[13px] text-slate-700">
                      <Check size={16} className="shrink-0 mt-0.5" style={{ color: accent }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled
                  className="w-full py-3 rounded-lg font-semibold text-sm cursor-not-allowed"
                  style={{ background: "#e5e7eb", color: "#6b7280" }}
                >
                  <Lock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Disponible le 1er octobre
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* FREEMIUM */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${EMERALD} 0%, #053e2f 100%)`, color: "#fff" }}>
          <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <Gift className="w-10 h-10 mx-auto mb-3" style={{ color: GOLD }} />
          <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: SERIF }}>
            Freemium gratuit — dès l'ouverture
          </h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Testez la V3 sans carte bancaire. Créez 1 livre complet (3 chapitres,
            1 personnage) pour découvrir la puissance des 30 agents IA. Passez à
            un forfait quand vous voulez plus.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: GOLD }}>
            <Clock className="w-3.5 h-3.5" /> Ouverture : 1er octobre 2026
          </div>
        </div>
      </section>

      {/* BONUS FONDATEUR */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center"
          style={{ background: "#fff9e6", border: `2px dashed ${GOLD}` }}>
          <div className="w-16 h-16 rounded-full grid place-items-center shrink-0"
            style={{ background: GOLD, color: INK }}>
            <Star className="w-8 h-8 fill-current" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
              Bonus fondateur — 100 premiers abonnés
            </h3>
            <p className="text-sm text-slate-700 mt-2">
              Les 100 premiers abonnés du 1er octobre bénéficient d'un
              <strong> mois offert</strong> sur le forfait annuel et d'un accès
              anticipé aux nouveaux modules Pro (Audiobook TTS, Mockups 3D…).
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 pb-20">
        <h2 className="text-3xl font-semibold text-center mb-8" style={{ fontFamily: SERIF, color: EMERALD }}>
          Questions fréquentes
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "Est-ce que mon abonnement V2 continue ?",
              a: "Oui, 100 %. Aucun changement pour vous : votre accès V2 reste actif, vos livres et projets sont préservés. La V3 est un nouvel espace optionnel que vous pourrez rejoindre le 1er octobre.",
            },
            {
              q: "Puis-je basculer vers la V3 le jour J ?",
              a: "Oui. Le 1er octobre, un bouton dédié apparaîtra dans votre espace V2 pour choisir un forfait V3 (Auteur, Studio ou Éditeur) au tarif de votre choix. Aucune migration technique n'est nécessaire.",
            },
            {
              q: "Freemium : combien de temps est-ce gratuit ?",
              a: "Le freemium est illimité dans le temps mais limité en volume : 1 livre, 3 chapitres, 1 personnage, pas d'export premium. C'est fait pour tester le pipeline avant de passer à un forfait.",
            },
            {
              q: "Puis-je payer à l'année pour économiser ?",
              a: "Oui. La facturation annuelle offre jusqu'à -22 % : Auteur 97 €/an, Studio 117 €/an, Éditeur 547 €/an. Paiement en une fois par carte ou PayPal.",
            },
            {
              q: "PayPal en 3× est-il possible ?",
              a: "PayPal en abonnement récurrent (mensuel ou annuel) sera disponible dès l'ouverture. Le paiement en 3× reste possible pour les forfaits annuels via PayPal.",
            },
            {
              q: "Où en suis-je si je m'inscris aujourd'hui ?",
              a: "Vous recevez un email de rappel le 1er octobre à 8h avec un lien d'accès prioritaire et le bonus fondateur activé sur votre compte.",
            },
          ].map((item) => (
            <details key={item.q} className="rounded-xl bg-white p-4"
              style={{ border: "1px solid #e5e7eb" }}>
              <summary className="cursor-pointer font-semibold text-[15px]" style={{ color: EMERALD }}>
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-3xl mx-auto px-5 pb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
          Soyez prévenu·e à l'ouverture
        </h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Un simple email suffit. Vous recevez un rappel le 1er octobre 2026 avec
          le bonus fondateur pré-activé.
        </p>
        <div className="mt-8">
          <PreRegisterForm />
        </div>

        <div className="mt-10 flex items-center justify-center gap-4 text-sm">
          <Link to="/v3" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900">
            <ArrowRight className="w-4 h-4 rotate-180" /> Retour accueil V3
          </Link>
          <span className="text-slate-300">·</span>
          <Link to="/v3/pourquoi" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900">
            Pourquoi EbookStudio V3 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
