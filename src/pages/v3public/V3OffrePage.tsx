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
        title="Offre EbookStudio V2 — V3 incluse le 1er octobre"
        description="Rejoignez EbookStudio V2 maintenant à tarif avantageux. Le 1er octobre 2026, le premier plan V3 est inclus sans surcoût."
        canonical="https://video-lexicon-translator-08.lovable.app/v3/offre"
      />

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-5 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6"
            style={{ background: "#fff4c7", color: GOLD_DEEP, border: `1px solid ${GOLD}` }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Offre passerelle V2 → V3 · 1er octobre 2026
          </span>

          <h1 className="font-semibold leading-[1.05]" style={{ fontFamily: SERIF, color: EMERALD }}>
            <span className="block text-5xl md:text-6xl">Prenez la V2 maintenant.</span>
            <span className="block text-5xl md:text-6xl italic mt-1" style={{ color: GOLD_DEEP }}>
              La V3 sera incluse au 1er octobre.
            </span>
          </h1>

          <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-600">
            En attendant l'ouverture officielle de la V3, vous pouvez rejoindre
            EbookStudio V2 à un tarif avantageux, commencer vos livres tout de suite,
            puis recevoir le <strong>premier plan V3 sans surcoût</strong> le 1er octobre.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/commander"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-black text-sm shadow-lg"
              style={{ background: GOLD, color: INK, boxShadow: "0 18px 40px -22px rgba(6,78,59,0.7)" }}
            >
              Je prends la V2 maintenant <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#details-offre"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-bold text-sm bg-white"
              style={{ color: EMERALD, border: `1px solid ${EMERALD}33` }}
            >
              Voir ce qui est inclus
            </a>
          </div>

          <div className="mt-10">
            <Countdown />
          </div>

          <div className="mt-8">
            <PreRegisterForm />
            <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Rappel gratuit si vous voulez attendre le 1er octobre.
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
            <h3 className="font-bold" style={{ color: EMERALD }}>Le message est simple : vous ne perdez rien à commencer maintenant.</h3>
            <p className="text-sm text-slate-700 mt-1">
              La V2 reste disponible tout de suite pour créer vos livres. Le 1er octobre,
              vous serez averti·e de l'ouverture V3 et le premier plan V3 sera ajouté
              à votre accès <strong>sans supplément</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* OFFRE ACTUELLE */}
      <section id="details-offre" className="max-w-5xl mx-auto px-5 py-14">
        <div className="rounded-3xl p-8 md:p-10 bg-white" style={{ border: `2px solid ${GOLD}`, boxShadow: "0 22px 60px -34px rgba(6,78,59,0.45)" }}>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD_DEEP }}>
                Offre en attendant la V3
              </div>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
                V2 maintenant + premier plan V3 offert le 1er octobre
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Cette page n'est pas une vente anticipée de la V3 seule. C'est l'offre
                de transition : vous démarrez avec EbookStudio V2, vous profitez du tarif
                actuel, et vous recevez l'accès V3 de premier niveau dès l'ouverture.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {[
                  "Accès V2 immédiat pour créer et publier sans attendre octobre",
                  "Tarif avantageux réservé aux prospects avant le lancement V3",
                  "Premier plan V3 inclus sans surcoût le 1er octobre 2026",
                  "Alerte email le jour de l'ouverture avec le lien d'accès V3",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={17} className="shrink-0 mt-0.5" style={{ color: EMERALD }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#fff9e6", border: `1px solid ${GOLD}88` }}>
              <div className="text-sm font-bold" style={{ color: EMERALD }}>Accès immédiat</div>
              <div className="mt-2 text-4xl font-black" style={{ color: EMERALD }}>V2</div>
              <p className="mt-2 text-sm text-slate-700">Puis bascule vers le premier plan V3 le 1er octobre, sans payer deux fois.</p>
              <a
                href="/commander"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-black text-sm"
                style={{ background: EMERALD, color: GOLD }}
              >
                Rejoindre avec l'offre V2 <ArrowRight className="w-4 h-4" />
              </a>
            </div>
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
            Ensuite, au 1er octobre
          </div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
            Les plans V3 seront ouverts progressivement
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
            Les nouveaux forfaits arriveront le jour du lancement. L'avantage actuel :
            commencer en V2 maintenant et obtenir le premier plan V3 sans surcoût.
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
                  Ouverture V3 le 1er octobre
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
            Premier plan V3 inclus — dès l'ouverture
          </h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Si vous rejoignez la V2 maintenant, vous ne repartez pas de zéro en octobre :
            le premier plan V3 sera inclus dans votre accès, sans supplément, pour découvrir
            le nouveau parcours IA.
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
              Offre passerelle — avant le lancement V3
            </h3>
            <p className="text-sm text-slate-700 mt-2">
              L'objectif est de permettre aux prospects de commencer avec la V2 au tarif actuel,
              puis de recevoir le premier accès V3 le 1er octobre sans frais supplémentaires.
            </p>
          </div>
        </div>
      </section>

      {/* PARRAINAGE */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{ background: "#fff", border: `1px solid ${GOLD}55`, boxShadow: "0 20px 60px -30px rgba(6,78,59,0.35)" }}>
          <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full grid place-items-center shrink-0"
              style={{ background: EMERALD, color: GOLD }}>
              <Users className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full mb-2"
                style={{ background: `${GOLD}22`, color: GOLD_DEEP, border: `1px solid ${GOLD}55` }}>
                Nouveau — Octobre 2026
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: SERIF, color: EMERALD }}>
                Programme de parrainage
              </h3>
              <p className="text-sm md:text-base text-slate-700 mt-2 leading-relaxed">
                Dès le 1ᵉʳ octobre, chaque abonné V3 recevra un <strong>lien de parrainage unique</strong>.
                Pour chaque ami qui rejoint EbookStudio, vous gagnez <strong>1 mois offert</strong> sur votre
                forfait — et votre filleul reçoit <strong>−20 %</strong> sur son premier mois. Cumulable sans limite.
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Les détails complets et votre tableau de bord parrainage seront disponibles le jour de l'ouverture.
              </p>
            </div>
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
              q: "Si je prends la V2 maintenant, est-ce que je paie encore pour la V3 ?",
              a: "Non pour le premier plan V3 : il sera inclus sans surcoût le 1er octobre 2026 pour les personnes qui rejoignent avec cette offre de transition.",
            },
            {
              q: "Est-ce que je peux créer mes livres avant octobre ?",
              a: "Oui. Vous accédez à la V2 immédiatement : vous pouvez planifier, écrire, exporter et avancer vos projets sans attendre l'ouverture officielle de la V3.",
            },
            {
              q: "Qu'est-ce qui arrive le 1er octobre ?",
              a: "Vous recevez l'information d'ouverture V3 et l'accès au premier plan V3 inclus. Les plans supérieurs resteront optionnels pour ceux qui veulent plus de volumes ou de modules Pro.",
            },
            {
              q: "Pourquoi prendre la V2 maintenant ?",
              a: "Parce que vous commencez tout de suite à produire vos livres, vous gardez le tarif avantageux actuel et vous sécurisez l'accès au premier plan V3 sans supplément.",
            },
            {
              q: "Le lien de paiement fonctionne-t-il ?",
              a: "Oui. Le bouton d'inscription renvoie vers la page de paiement actuelle. Les pages sur ebookstudio.fr/v3 peuvent encore dépendre de la publication du domaine, donc ce bouton utilise le lien de paiement direct.",
            },
            {
              q: "Où en suis-je si je m'inscris aujourd'hui ?",
              a: "Vous démarrez en V2 maintenant, puis vous recevez l'accès au premier plan V3 le 1er octobre 2026, sans supplément.",
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
          Rejoindre maintenant ou recevoir le rappel
        </h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Si vous êtes prêt·e, prenez la V2 maintenant. Sinon, laissez simplement votre email
          pour recevoir l'ouverture V3 le 1er octobre.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="/commander"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-black text-sm"
            style={{ background: GOLD, color: INK }}
          >
            Je prends la V2 maintenant <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-6">
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
