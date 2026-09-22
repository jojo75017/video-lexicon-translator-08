import { Link } from 'react-router-dom';
import {
  Sparkles, BookOpen, Library, ArrowRight,
  Wand2, Feather, Rocket, Palette, ListTree, PenLine,
} from 'lucide-react';

import V3CapabilitiesPanel from '@/components/v3public/V3CapabilitiesPanel';
import V3ReserveCtaBand from '@/components/v3public/V3ReserveCtaBand';

import V3UpsellRotator from '@/components/v3public/V3UpsellRotator';
import V3CoverStudioBanner from '@/components/v3public/V3CoverStudioBanner';
import BdComicNewsBanner from '@/components/bd/BdComicNewsBanner';
import Niches10Offer from '@/components/marketing/Niches10Offer';
import { V3EngineStrip, V3EngineGrid } from '@/components/v3public/V3EngineBanner';
import V3LaunchBanner from '@/components/v3public/V3LaunchBanner';
import V3HeroBanner from '@/components/v3public/V3HeroBanner';
import V3PresentationVideo from '@/components/v3public/V3PresentationVideo';
import V3MarketProofPanel from '@/components/v3public/V3MarketProofPanel';
import V3GuaranteePanel from '@/components/v3public/V3GuaranteePanel';
import V3ClosingRecallPanel from '@/components/v3public/V3ClosingRecallPanel';
import V3AnchorNav from '@/components/v3public/V3AnchorNav';
import V3WhatIsPanel from '@/components/v3public/V3WhatIsPanel';
import V3WhatsNewPanel from '@/components/v3public/V3WhatsNewPanel';
import V3HowItWorksSteps from '@/components/v3public/V3HowItWorksSteps';
import V3BenefitsPanel from '@/components/v3public/V3BenefitsPanel';
import V3DifferenceTable from '@/components/v3public/V3DifferenceTable';
import V3GoFurtherPanel from '@/components/v3public/V3GoFurtherPanel';
import ReadingGate from '@/components/marketing/ReadingGate';
import V3PricingOverview from '@/components/v3public/V3PricingOverview';

const FEATURED_TOOLS = [
  { icon: Wand2, title: 'Sommaire IA — le meneur', desc: 'Dialogue avec l’IA : vos idées sont corrigées et deviennent le plan qui guide tout le livre.', badge: 'Commencer ici' },
  { icon: Feather, title: 'Biographie — Le récit de votre vie', desc: 'Racontez votre vie période par période : vos mots sont gardés, jamais résumés.', badge: 'Nouveau' },
  { icon: PenLine, title: 'Lancer mon livre', desc: 'Fiche + 15 agents, en 4 étapes guidées.', badge: 'V3' },
  { icon: Palette, title: 'Cover Studio Pro', desc: 'Couverture haut de gamme, direction artistique IA.', badge: 'Pro' },
  { icon: Rocket, title: 'KDP Pilot', desc: 'Audit complet avant publication Amazon.', badge: 'Populaire' },
  { icon: ListTree, title: 'Sommaire Ultime', desc: 'Table des matières éditable et exportable.', badge: 'Nouveau' },
];

const AUTHOR_AMAZON_URL = 'https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7';
const AUTHOR_BOOKS: Array<{ asin: string; title: string }> = [
  { asin: 'B0GXB3V5DJ', title: "L'Ancien Locataire" },
  { asin: 'B0GG7QCFTZ', title: "Axel Kiev — L'Origine du Code" },
  { asin: 'B0GY5K8GCS', title: 'Signal Zéro — Intégrale' },
  { asin: 'B0GX2SVHY4', title: 'Le Loup en Vacances' },
  { asin: 'B0GQQB7V1F', title: "Dans l'Ombre de la Villa" },
  { asin: 'B0GN34WYMK', title: 'La Bible du Voyage' },
];
const coverUrl = (asin: string) => `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
const fallbackCoverUrl = (asin: string) => `https://m.media-amazon.com/images/P/${asin}.jpg`;
const amazonBookUrl = (asin: string) => `https://www.amazon.fr/dp/${asin}/`;

export default function V3HomePage() {
  return (
    <div className="v3-home pb-4">
      {/* 1. LANCEMENT — bande fine */}
      <V3LaunchBanner />

      {/* 2. PROMESSE PRINCIPALE */}
      <V3HeroBanner />

      {/* PREUVE AUTEUR — visible avant les offres */}
      <section className="v3-section-dark">
        <div className="v3-shell py-8 md:py-10">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.8fr)_auto]">
            <div>
              <span
                className="v3-chip"
                style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--v3-gold)', borderColor: 'transparent' }}
              >
                Auteur invité
              </span>
              <h2 className="v3-serif mt-3 text-2xl font-semibold text-white md:text-3xl">Mr Georges Boubet</h2>
              <p className="mt-1 text-sm text-white/70">
                71 livres publiés sur Amazon.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {AUTHOR_BOOKS.map((b) => (
                <a
                  key={b.asin}
                  href={amazonBookUrl(b.asin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  title={b.title}
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-md bg-black/40 shadow-md ring-1 ring-white/10 transition-transform group-hover:-translate-y-1">
                    <img
                      src={coverUrl(b.asin)}
                      alt={`Couverture ${b.title}`}
                      loading="eager"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== fallbackCoverUrl(b.asin)) img.src = fallbackCoverUrl(b.asin);
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>

            <a href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="v3-btn v3-btn-gold justify-self-start lg:justify-self-end">
              Voir sur Amazon <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Trois offres — aperçu discret, détail sur /v3/forfaits */}
      <V3PricingOverview />


      {/* 3. VIDÉO DE PRÉSENTATION */}
      <V3PresentationVideo />

      {/* 4. LES DEUX NOUVEAUTÉS — couvertures puis Studio BD & Jeunesse */}
      <section className="v3-shell">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold-600)' }}>
          Les nouveautés
        </div>
        <h2 className="v3-serif mt-1 text-2xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          Deux ateliers qui viennent d’ouvrir
        </h2>
      </section>
      <V3CoverStudioBanner />
      <BdComicNewsBanner />

      {/* 6. CE QUI A CHANGÉ + MOTEURS IA */}
      <V3WhatsNewPanel />
      <V3EngineStrip />
      <V3EngineGrid />
      <V3ClosingRecallPanel />

      {/* RAPPEL DE RÉSERVATION — milieu de page */}
      <V3ReserveCtaBand />

      {/* 8. POUR ALLER PLUS LOIN — agents, workflow, KDP Pilot */}
      <V3GoFurtherPanel />

      {/* 9. PRÉSENTATION LONGUE — comprendre la V3 */}
      <V3AnchorNav />
      <V3WhatIsPanel />

      {/* La suite est offerte contre l'email pour les visiteurs inconnus. */}
      <ReadingGate surface="v3" title="La suite de la visite est offerte">
        <div className="v3-home">
          <V3HowItWorksSteps />
          <V3BenefitsPanel />
          <V3DifferenceTable />

          {/* Pack de 10 niches, inclus dans l'accès */}
          <div className="v3-shell">
            <Niches10Offer surface="inline" hook="v3" variant="compact" />
          </div>

          {/* Ce que l'outil produit */}
          <div className="v3-shell">
            <V3CapabilitiesPanel />
          </div>

          <V3UpsellRotator />

          {/* Preuve et garantie */}
          <V3MarketProofPanel />
          <V3GuaranteePanel />

          {/* OUTILS VEDETTES */}
          <section className="v3-shell">
            <div className="rounded-3xl p-8 md:p-10" style={{ background: 'var(--v3-cream)', border: '1px solid var(--v3-line)' }}>
              <div className="mb-8 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold-600)' }}>
                  Les incontournables
                </div>
                <h2 className="v3-serif mt-2 text-3xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                  Les outils au cœur du studio
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {FEATURED_TOOLS.map(({ icon: Icon, ...t }) => (
                  <div
                    key={t.title}
                    className="block rounded-2xl bg-white p-5"
                    style={{ border: '1px solid var(--v3-line)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-full"
                        style={{ background: 'var(--v3-gold-soft)', color: '#6a4f10' }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="v3-badge">{t.badge}</span>
                    </div>
                    <div className="v3-serif mt-3 text-[18px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                      {t.title}
                    </div>
                    <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>{t.desc}</p>
                    <div className="mt-3 text-[12px] font-semibold" style={{ color: 'var(--v3-muted)' }}>
                      Disponible à l'ouverture · 1er octobre
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BLOG */}
          <section className="v3-shell">
            <a
              href="https://ebookstudio.blog/#accueil"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-3xl transition-all"
              style={{
                background: 'var(--v3-editorial-ink)',
                border: '1px solid rgba(201,168,76,0.45)',
                boxShadow: '0 30px 60px -30px color-mix(in srgb, var(--v3-editorial-ink) 55%, transparent)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }} />
              <div className="grid items-center gap-6 px-6 py-8 md:grid-cols-[1fr_auto] md:px-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold)' }}>
                    Blog · nouvelle édition
                  </span>
                  <h2 className="v3-serif mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">
                    Le Blog EbookStudio — la méthode, en clair
                  </h2>
                  <p className="mt-2 max-w-2xl text-[14px] text-white/75">
                    Articles, guides pratiques et retours d'expérience pour écrire, illustrer et publier
                    votre livre.
                  </p>
                </div>
                <div className="flex md:justify-end">
                  <span
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-[15px] font-semibold"
                    style={{
                      background: 'var(--v3-gold)',
                      color: '#1a1408',
                      boxShadow: '0 10px 30px -10px rgba(201,168,76,0.7)',
                    }}
                  >
                    Ouvrir le blog
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </a>
          </section>

          {/* CTA final — réservation */}
          <div className="pb-12">
            <V3ReserveCtaBand />
          </div>
        </div>
      </ReadingGate>
    </div>
  );
}
