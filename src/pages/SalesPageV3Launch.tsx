import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, ShieldCheck, Check, Clock, Star, Gift,
  Crown, Layers, Infinity as InfinityIcon, Flame, Quote,
} from "lucide-react";
import SeoHead from "@/components/funnel/SeoHead";
import { Button } from "@/components/ui/button";
import {
  V3_OFFERS, V3_LAUNCH_BONUSES, V3_BONUSES_TOTAL_VALUE,
} from "@/data/v3Launch";
import { V3_TOTAL_COUNT, V3_INCLUDED_COUNT } from "@/data/roadmapV3";

const AMBER = "#E8951E";
const AMBER_DEEP = "#C97A14";
const SOFT = "#FFF3DF";
const CREAM = "#FBF6EC";
const INK = "#2A2118";
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

const PROOFS = [
  { n: "300 000+", l: "livres auto-publiés chaque année sur KDP" },
  { n: "70 %", l: "de royalties sur l'ebook (jusqu'à 9,99€)" },
  { n: "24 h", l: "pour être en ligne sur Amazon" },
];

const STEPS = [
  { t: "1. L'idée devient un manuscrit", d: "15 agents IA rédigent, structurent et corrigent votre livre à partir d'une simple idée." },
  { t: "2. Une couverture qui vend", d: "Le Studio couvertures génère un visuel pro (dos + 4e + bleed) prêt pour l'impression." },
  { t: "3. Formatage & publication KDP", d: "Export multi-format conforme, puis mise en ligne sur Amazon sans prise de tête." },
  { t: "4. Le lancement qui déclenche les ventes", d: "Séquence J-7, optimisation du listing et étude de marché réelle façon BookBeam." },
];

const FAQ = [
  { q: "C'est un abonnement ?", a: "Non. Paiement unique, accès à vie, mises à jour incluses." },
  { q: "Faut-il savoir écrire ?", a: "Non. Les agents IA écrivent avec vous : vous gardez le contrôle éditorial, l'IA fait le gros du travail." },
  { q: "Quelle différence entre Base et Pack Pro ?", a: "La Base vous emmène jusqu'à publier proprement. Le Pack Pro débloque en plus tout ce qui sert à VENDRE (marketing, monétisation, étude de marché)." },
  { q: "Et si ça ne me convient pas ?", a: "Garantie 7 jours, satisfait ou remboursé, sans justification." },
];

const Countdown = () => {
  const [left, setLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = Date.now() + 1000 * 60 * 60 * 24;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({
        h: Math.floor(diff / 3.6e6),
        m: Math.floor((diff % 3.6e6) / 6e4),
        s: Math.floor((diff % 6e4) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const box = (v: number, l: string) => (
    <div className="text-center">
      <div className="rounded-xl px-3 py-2 text-2xl font-black tabular-nums" style={{ background: INK, color: AMBER }}>
        {String(v).padStart(2, "0")}
      </div>
      <span className="text-[10px] uppercase tracking-wide text-[#9a8a72]">{l}</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center gap-2">
      {box(left.h, "h")}{box(left.m, "min")}{box(left.s, "sec")}
    </div>
  );
};

const SalesPageV3Launch = () => {
  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen">
      <SeoHead
        title="Publiez et vendez votre livre sur Amazon KDP — Publication Assistée Pro V3"
        description="La méthode + les outils IA pour transformer votre idée en livre publié et rentable sur Amazon KDP. Accès à vie, garantie 7 jours."
        canonical="https://www.ebookstudio.fr/vente-v3"
      />

      {/* HERO */}
      <section className="px-4 pt-14 pb-12 text-center max-w-3xl mx-auto">
        <motion.div {...fade}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5" style={{ background: SOFT, color: AMBER_DEEP }}>
            <Sparkles className="w-3.5 h-3.5" /> Publication Assistée Pro — V3
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: SERIF }}>
            Transformez une idée en livre publié <span style={{ color: AMBER_DEEP }}>et rentable</span> sur Amazon.
          </h1>
          <p className="text-lg text-[#5c5142] mt-5">
            {V3_TOTAL_COUNT} modules et une armée d'agents IA pour écrire, illustrer, publier et vendre — sans agence, sans compétence technique.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/commande-v3?offre=v3-pro">
              <Button size="lg" className="w-full sm:w-auto py-6 px-8 text-lg font-bold rounded-xl border-0" style={{ background: AMBER, color: INK }}>
                Je démarre maintenant <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#offres">
              <Button size="lg" variant="outline" className="w-full sm:w-auto py-6 px-8 text-lg font-bold rounded-xl border-2" style={{ borderColor: INK, color: INK }}>
                Voir les offres
              </Button>
            </a>
          </div>
          <p className="text-xs text-[#9a8a72] mt-4 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Paiement unique · Accès à vie · Garantie 7 jours
          </p>
        </motion.div>
      </section>

      {/* PREUVES CHIFFRÉES */}
      <section className="px-4 pb-14">
        <motion.div {...fade} className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROOFS.map((p) => (
            <div key={p.l} className="rounded-2xl bg-white border p-6 text-center" style={{ borderColor: "#efe3cf" }}>
              <div className="text-3xl font-black" style={{ color: AMBER_DEEP }}>{p.n}</div>
              <p className="text-sm text-[#5c5142] mt-1">{p.l}</p>
            </div>
          ))}
        </motion.div>
        <p className="text-center text-[11px] text-[#9a8a72] mt-3">Sources : chiffres publics du marché de l'auto-édition Amazon KDP.</p>
      </section>

      {/* STORYTELLING / DÉMONSTRATION */}
      <section className="px-4 pb-16">
        <motion.div {...fade} className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-black" style={{ fontFamily: SERIF }}>De l'idée floue au livre qui se vend</h2>
          <p className="text-[#5c5142] mt-3">La plupart abandonnent entre « j'ai une idée » et « c'est en ligne ». V3 supprime chaque point de friction.</p>
        </motion.div>
        <div className="max-w-3xl mx-auto grid gap-4">
          {STEPS.map((s, i) => (
            <motion.div key={s.t} {...fade} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl bg-white border p-5 flex gap-4" style={{ borderColor: "#efe3cf" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black" style={{ background: SOFT, color: AMBER_DEEP }}>
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold">{s.t}</h3>
                <p className="text-sm text-[#5c5142] mt-1">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BONUS DE LANCEMENT */}
      <section className="px-4 pb-16">
        <motion.div {...fade} className="max-w-3xl mx-auto rounded-3xl border-2 border-dashed p-6" style={{ borderColor: AMBER, background: "#FFFDF8" }}>
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: AMBER, color: INK }}>
              <Gift className="w-3.5 h-3.5" /> Bonus de lancement offerts
            </span>
            <p className="text-sm text-[#5c5142] mt-3">
              Inclus gratuitement avec votre commande — valeur totale <strong>{V3_BONUSES_TOTAL_VALUE}€</strong>
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {V3_LAUNCH_BONUSES.map((b) => (
              <div key={b.title} className="rounded-2xl bg-white border p-4 flex gap-3" style={{ borderColor: "#efe3cf" }}>
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{b.title}</h3>
                    <span className="text-[11px] font-black" style={{ color: AMBER_DEEP }}>{b.value}€ offert</span>
                  </div>
                  <p className="text-[12px] text-[#5c5142] mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* OFFRES */}
      <section id="offres" className="px-4 pb-16">
        <motion.div {...fade} className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-black" style={{ fontFamily: SERIF }}>Voici ce que vous obtenez</h2>
          <p className="text-[#5c5142] mt-3">Deux formules. Vous choisissez <strong>l'une OU l'autre</strong> — jamais les deux additionnées.</p>
        </motion.div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          {V3_OFFERS.map((o) => (
            <motion.div key={o.key} {...fade}
              className="rounded-3xl bg-white border-2 p-6 flex flex-col"
              style={{ borderColor: o.highlight ? AMBER : "#efe3cf", boxShadow: o.highlight ? `0 20px 40px -24px ${AMBER}` : "none" }}>
              <div className="flex items-center gap-2 mb-1">
                {o.key === "v3-pro" ? <Crown className="w-5 h-5" style={{ color: AMBER_DEEP }} /> : <Layers className="w-5 h-5" style={{ color: AMBER_DEEP }} />}
                <span className="font-bold">{o.name}</span>
                {o.highlight && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: AMBER, color: INK }}>RECOMMANDÉ</span>}
              </div>
              <p className="text-sm text-[#5c5142]">{o.tagline}</p>
              <div className="flex items-baseline gap-2 my-4">
                {o.compareAt && <span className="text-lg line-through text-[#9a8a72]">{o.compareAt}€</span>}
                <span className="text-4xl font-black" style={{ color: AMBER_DEEP }}>{o.price}€</span>
                <span className="text-xs text-[#9a8a72]">à vie</span>
              </div>
              <ul className="grid gap-2 mb-5">
                {o.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AMBER }} /> {f}
                  </li>
                ))}
              </ul>
              <Link to={`/commande-v3?offre=${o.key}`} className="mt-auto">
                <Button size="lg" className="w-full py-6 text-base font-bold rounded-xl border-0"
                  style={o.highlight ? { background: AMBER, color: INK } : { background: INK, color: CREAM }}>
                  Choisir cette offre <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-[11px] text-[#9a8a72] text-center mt-2">ou {o.installments.slice(1).join(" · ")}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GARANTIE + URGENCE */}
      <section className="px-4 pb-16">
        <motion.div {...fade} className="max-w-3xl mx-auto rounded-3xl p-8 text-center" style={{ background: INK, color: CREAM }}>
          <ShieldCheck className="w-10 h-10 mx-auto mb-3" style={{ color: AMBER }} />
          <h2 className="text-2xl font-black" style={{ fontFamily: SERIF }}>Garantie 7 jours, zéro risque</h2>
          <p className="opacity-80 mt-2">Testez tout. Si V3 ne vous convient pas sous 7 jours, vous êtes remboursé sans justification.</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <Flame className="w-4 h-4" style={{ color: AMBER }} /> Offre de lancement — se termine dans :
          </div>
          <div className="mt-3"><Countdown /></div>
          <Link to="/commande-v3?offre=v3-pro" className="inline-block mt-6">
            <Button size="lg" className="py-6 px-8 text-lg font-bold rounded-xl border-0" style={{ background: AMBER, color: INK }}>
              J'en profite maintenant <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20">
        <motion.div {...fade} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-6" style={{ fontFamily: SERIF }}>Questions fréquentes</h2>
          <div className="grid gap-3">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl bg-white border p-5" style={{ borderColor: "#efe3cf" }}>
                <h3 className="font-bold flex items-center gap-2"><Quote className="w-4 h-4" style={{ color: AMBER_DEEP }} />{f.q}</h3>
                <p className="text-sm text-[#5c5142] mt-2">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center flex items-center justify-center gap-1 mt-8">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4" style={{ fill: AMBER, color: AMBER }} />)}
            <span className="text-[#9a8a72] text-sm ml-1">Créé par Georges Boubet · {V3_INCLUDED_COUNT} modules inclus dans la Base</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SalesPageV3Launch;
