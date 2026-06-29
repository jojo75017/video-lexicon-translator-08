import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, ShieldCheck, Check, Clock, Star, Gift,
  BookOpen, Wand2, Crown, Layers, Infinity as InfinityIcon,
} from 'lucide-react';
import {
  V3_MODULES, V3_PILLAR_META, getModuleAccess,
  V3_PRICE, V3_BASE_INSTALLMENTS, V3_FULL_PACK, V3_ESSENTIAL_PACKS,
  type V3Pillar,
} from '@/data/roadmapV3';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/funnel/SeoHead';

// Palette « Clair Ambre » — locale à cette page (cohérente avec le Hub V3).
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const CREAM = '#FBF6EC';
const INK = '#2A2118';
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6 },
};

/** Compte à rebours réel (24h glissantes, persistées en localStorage). */
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const KEY = 'v3_sales_deadline';
    let end = Number(localStorage.getItem(KEY));
    if (!end || end < Date.now()) {
      end = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(KEY, String(end));
    }
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return { h, m, s };
}

const pad = (n: number) => String(n).padStart(2, '0');

const SalesPageV3: React.FC = () => {
  const navigate = useNavigate();
  const { h, m, s } = useCountdown();

  // Bonus = ce que l'on a RÉELLEMENT (modules existants de la roadmap V3).
  const baseModules = useMemo(
    () => V3_MODULES.filter((mod) => getModuleAccess(mod.id) === 'included'),
    [],
  );
  const baseByPillar = useMemo(() => {
    const map = new Map<V3Pillar, typeof baseModules>();
    baseModules.forEach((mod) => {
      const arr = map.get(mod.pillar) ?? [];
      arr.push(mod);
      map.set(mod.pillar, arr);
    });
    return map;
  }, [baseModules]);

  const goBase = () => navigate('/upsell-paiement?plan=v3-base');
  const goPro = () => navigate('/upsell-paiement?plan=v3-pro');

  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen">
      <SeoHead
        title="Publication Assistée Pro V3 — De l'idée au livre publié"
        description="Le moteur complet pour écrire, illustrer, publier et vendre ton livre sur Amazon KDP. Base 197€ à vie ou Pack Pro Vendeur 347€."
        canonical="https://www.ebookstudio.fr/publication-pro"
      />

      {/* Bandeau compte à rebours */}
      <div
        className="sticky top-0 z-40 text-center text-sm font-semibold py-2 px-4 flex items-center justify-center gap-2"
        style={{ background: INK, color: CREAM }}
      >
        <Clock className="w-4 h-4" style={{ color: AMBER }} />
        Offre de lancement V3 — se termine dans
        <span className="font-mono tabular-nums" style={{ color: AMBER }}>
          {pad(h)}:{pad(m)}:{pad(s)}
        </span>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: `radial-gradient(700px 380px at 50% 0%, ${AMBER_SOFT}, transparent)` }}
        />
        <div className="max-w-3xl mx-auto">
          <motion.span
            {...fade}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6"
            style={{ background: AMBER_SOFT, color: AMBER_DEEP }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Publication Assistée Pro — V3
          </motion.span>

          <motion.h1
            {...fade}
            className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6"
            style={{ fontFamily: SERIF }}
          >
            De l'idée au livre publié sur Amazon —{' '}
            <span style={{ color: AMBER_DEEP }}>sans bloquer sur la page blanche</span>.
          </motion.h1>

          <motion.p {...fade} className="text-lg md:text-xl text-[#5b4f40] mb-9 max-w-2xl mx-auto">
            Le moteur complet qui te tient par la main : écrire, illustrer, formater aux normes KDP,
            publier proprement et lancer ton livre. Tu avances, l'IA exécute.
          </motion.p>

          <motion.div {...fade} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={goPro}
              size="lg"
              className="text-base font-bold px-8 py-7 rounded-2xl shadow-lg hover:scale-105 transition-transform border-0"
              style={{ background: INK, color: CREAM }}
            >
              <Crown className="w-5 h-5 mr-2" style={{ color: AMBER }} />
              Démarrer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <a href="#offre" className="font-semibold underline underline-offset-4" style={{ color: AMBER_DEEP }}>
              Voir les deux offres →
            </a>
          </motion.div>

          <motion.div {...fade} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#7a6c58] mt-7">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" style={{ color: AMBER }} /> Garantie 7 jours</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><InfinityIcon className="w-4 h-4" style={{ color: AMBER }} /> Accès à vie</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" style={{ color: AMBER }} /> {baseModules.length} outils inclus</span>
          </motion.div>
        </div>
      </section>

      {/* PROBLÈME / PROMESSE */}
      <section className="px-4 py-16" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fade} className="text-3xl md:text-4xl text-center mb-10" style={{ fontFamily: SERIF }}>
            Tu n'as pas un problème d'idées. Tu as un problème d'exécution.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { t: 'La page blanche', d: 'Tu sais quoi raconter, mais le manuscrit n\'avance jamais.' },
              { t: 'Les normes KDP', d: 'Marges, formats, couverture, métadonnées : un casse-tête technique.' },
              { t: 'Le lancement', d: 'Publier ne suffit pas. Sans visibilité, le livre reste invisible.' },
            ].map((b, i) => (
              <motion.div
                key={b.t}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-6 border"
                style={{ borderColor: '#efe3cf', background: CREAM }}
              >
                <h3 className="font-bold mb-2 text-lg">{b.t}</h3>
                <p className="text-[#6b5d49] text-sm">{b.d}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade} className="text-center text-lg md:text-xl mt-10 max-w-2xl mx-auto">
            La V3 prend en charge <strong>toute la chaîne</strong> : tu décides, l'IA produit,
            et tu publies un livre propre, vendable, sans dépendre d'un prestataire.
          </motion.p>
        </div>
      </section>

      {/* CE QUE TU OBTIENS — bonus réels par pilier */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4"
              style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
              <Gift className="w-3.5 h-3.5" /> Voici ce que tu obtiens
            </span>
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: SERIF }}>
              {baseModules.length} outils, tous inclus dans la base
            </h2>
            <p className="text-[#6b5d49] mt-3">Aucun bonus inventé : voici exactement les modules livrés.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {Array.from(baseByPillar.entries()).map(([pillar, mods]) => {
              const meta = V3_PILLAR_META[pillar];
              return (
                <motion.div
                  key={pillar}
                  {...fade}
                  className="rounded-2xl p-6 border bg-white"
                  style={{ borderColor: '#efe3cf' }}
                >
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span>{meta.emoji}</span> {meta.label}
                    <span className="text-xs font-normal text-[#9a8a72]">({mods.length})</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {mods.map((mod) => (
                      <li key={mod.id} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AMBER }} />
                        <span>{mod.title}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OFFRES — Base 197€ OU Pack Pro 347€ */}
      <section id="offre" className="px-4 py-16" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: SERIF }}>Choisis ton offre</h2>
            <p className="text-[#6b5d49]">
              Deux formules, un seul choix. <strong>Base 197€</strong> <em>ou</em> <strong>Pack Pro 347€</strong> — pas d'addition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Base */}
            <motion.div {...fade} className="rounded-3xl p-8 border bg-white flex flex-col" style={{ borderColor: '#efe3cf' }}>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5" style={{ color: AMBER_DEEP }} />
                <h3 className="text-xl font-bold">Base — Publier</h3>
              </div>
              <p className="text-sm text-[#6b5d49] mb-5">Tout pour écrire, illustrer, formater et publier proprement sur KDP.</p>
              <div className="mb-5">
                <span className="text-5xl font-black" style={{ fontFamily: SERIF }}>{V3_PRICE}€</span>
                <span className="text-[#9a8a72] ml-2">à vie</span>
                <p className="text-xs text-[#9a8a72] mt-1">{V3_BASE_INSTALLMENTS.join(' · ')}</p>
              </div>
              <ul className="space-y-2.5 text-sm mb-7 flex-1">
                {['Studio de création (15 agents IA)', 'Studio couvertures pro', 'Recherche de niche & concurrence',
                  'Formatage & export multi-format KDP', 'Séquence de lancement J-7', 'Optimisation listing & Ads',
                  'Mises à jour à vie', 'Garantie 7 jours'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AMBER }} /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={goBase} size="lg" variant="outline"
                className="w-full py-6 rounded-2xl font-bold border-2"
                style={{ borderColor: INK, color: INK, background: 'transparent' }}>
                Prendre la Base — {V3_PRICE}€
              </Button>
            </motion.div>

            {/* Pack Pro */}
            <motion.div {...fade}
              className="relative rounded-3xl p-8 border-2 flex flex-col shadow-xl"
              style={{ borderColor: AMBER, background: CREAM }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full"
                style={{ background: AMBER, color: INK }}>
                ⭐ Le plus complet
              </span>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" style={{ color: AMBER_DEEP }} />
                <h3 className="text-xl font-bold">{V3_FULL_PACK.title}</h3>
              </div>
              <p className="text-sm text-[#6b5d49] mb-5">La Base + les 4 packs essentiels : monétisation, distribution, trafic social et qualité éditoriale.</p>
              <div className="mb-5">
                <span className="text-2xl text-[#b6a78f] line-through mr-2">{V3_FULL_PACK.compareAt}€</span>
                <span className="text-5xl font-black" style={{ fontFamily: SERIF, color: AMBER_DEEP }}>{V3_FULL_PACK.price}€</span>
                <span className="text-[#9a8a72] ml-2">à vie</span>
                <p className="text-xs font-semibold mt-1" style={{ color: AMBER_DEEP }}>
                  Tu économises {V3_FULL_PACK.saves}€ · {V3_FULL_PACK.installments.join(' · ')}
                </p>
              </div>
              <ul className="space-y-2.5 text-sm mb-7 flex-1">
                <li className="flex items-start gap-2.5 font-semibold">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AMBER }} /> Tout ce qu'inclut la Base
                </li>
                {V3_ESSENTIAL_PACKS.map((p) => (
                  <li key={p.id} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AMBER }} /> {p.title}
                  </li>
                ))}
              </ul>
              <Button onClick={goPro} size="lg"
                className="w-full py-6 rounded-2xl font-bold border-0 hover:scale-[1.02] transition-transform"
                style={{ background: INK, color: CREAM }}>
                <Crown className="w-5 h-5 mr-2" style={{ color: AMBER }} />
                Prendre le Pack Pro — {V3_FULL_PACK.price}€
              </Button>
            </motion.div>
          </div>

          <motion.p {...fade} className="text-center text-sm text-[#9a8a72] mt-8 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: AMBER }} />
            Paiement sécurisé Stripe & PayPal · Garantie satisfait ou remboursé 7 jours
          </motion.p>
        </div>
      </section>

      {/* GARANTIE */}
      <section className="px-4 py-16">
        <motion.div {...fade}
          className="max-w-3xl mx-auto rounded-3xl p-10 text-center border-2"
          style={{ borderColor: AMBER, background: AMBER_SOFT }}>
          <ShieldCheck className="w-12 h-12 mx-auto mb-4" style={{ color: AMBER_DEEP }} />
          <h2 className="text-2xl md:text-3xl mb-3" style={{ fontFamily: SERIF }}>Zéro risque pendant 7 jours</h2>
          <p className="text-[#5b4f40] max-w-xl mx-auto">
            Teste l'outil, génère ton premier livre. Si ce n'est pas pour toi, un simple message
            et tu es remboursé intégralement. Sans justification.
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16" style={{ background: '#fff' }}>
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade} className="text-3xl md:text-4xl text-center mb-10" style={{ fontFamily: SERIF }}>
            Questions fréquentes
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: 'C\'est un abonnement ?', a: 'Non. Paiement unique, accès à vie, mises à jour incluses.' },
              { q: 'Différence entre Base et Pack Pro ?', a: `La Base (${V3_PRICE}€) couvre tout jusqu'à publier sur KDP. Le Pack Pro (${V3_FULL_PACK.price}€) ajoute les 4 packs essentiels pour vendre et scaler. C'est l'un OU l'autre, pas l'addition.` },
              { q: 'Faut-il savoir écrire ?', a: 'Non. Les 15 agents IA rédigent avec toi à partir de ton idée. Tu gardes le contrôle éditorial.' },
              { q: 'Et si ça ne me convient pas ?', a: 'Garantie 7 jours, remboursement intégral sans condition.' },
            ].map((f) => (
              <motion.div key={f.q} {...fade} className="rounded-2xl p-5 border" style={{ borderColor: '#efe3cf', background: CREAM }}>
                <h3 className="font-bold mb-1.5">{f.q}</h3>
                <p className="text-sm text-[#6b5d49]">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 py-20 text-center" style={{ background: INK, color: CREAM }}>
        <motion.div {...fade} className="max-w-2xl mx-auto">
          <Star className="w-10 h-10 mx-auto mb-5" style={{ color: AMBER }} />
          <h2 className="text-3xl md:text-5xl mb-5" style={{ fontFamily: SERIF }}>
            Ton livre n'attend que toi.
          </h2>
          <p className="text-lg text-[#d8cdbb] mb-9">
            Rejoins les auteurs qui publient au lieu d'en rêver. Démarre aujourd'hui, accès à vie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={goPro} size="lg"
              className="font-bold px-8 py-7 rounded-2xl border-0 hover:scale-105 transition-transform"
              style={{ background: AMBER, color: INK }}>
              <Crown className="w-5 h-5 mr-2" /> Pack Pro — {V3_FULL_PACK.price}€
            </Button>
            <Button onClick={goBase} size="lg" variant="outline"
              className="font-bold px-8 py-7 rounded-2xl border-2"
              style={{ borderColor: CREAM, color: CREAM, background: 'transparent' }}>
              Base — {V3_PRICE}€
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SalesPageV3;
