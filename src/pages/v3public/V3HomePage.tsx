import { Link } from 'react-router-dom';
import {
  Sparkles, BookOpen, Library, ArrowRight,
  Wand2, Feather, Rocket, Palette, ListTree, PenLine,
} from 'lucide-react';

import V3BriefRecap from '@/components/v3public/V3BriefRecap';
import V3CapabilitiesPanel from '@/components/v3public/V3CapabilitiesPanel';
import V3StartBookBar from '@/components/v3public/V3StartBookBar';
import V3ResumeBookCard from '@/components/v3public/V3ResumeBookCard';
import V3QuickActionsBar from '@/components/v3public/V3QuickActionsBar';

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
import V3BeforeYouStartPanel from '@/components/v3public/V3BeforeYouStartPanel';
import V3GoFurtherPanel from '@/components/v3public/V3GoFurtherPanel';
import V3StartIdeaCTA from '@/components/v3public/V3StartIdeaCTA';
import ReadingGate from '@/components/marketing/ReadingGate';
import V3PricingOverview from '@/components/v3public/V3PricingOverview';

const FEATURED_TOOLS = [
  { icon: Wand2, title: 'Sommaire IA — le meneur', desc: 'Dialogue avec l’IA : vos idées sont corrigées et deviennent le plan qui guide tout le livre.', to: '/v3/create?sommaire=ia', badge: 'Commencer ici' },
  { icon: Feather, title: 'Biographie — Le récit de votre vie', desc: 'Racontez votre vie période par période : vos mots sont gardés, jamais résumés.', to: '/v3/biographie', badge: 'Nouveau' },
  { icon: PenLine, title: 'Lancer mon livre', desc: 'Fiche + 15 agents, en 4 étapes guidées.', to: '/v3/lancer', badge: 'V3' },
  { icon: Palette, title: 'Cover Studio Pro', desc: 'Couverture haut de gamme, direction artistique IA.', to: '/v3/hub?tab=cover-pro', badge: 'Pro' },
  { icon: Rocket, title: 'KDP Pilot', desc: 'Audit complet avant publication Amazon.', to: '/audit-pilot', badge: 'Populaire' },
  { icon: ListTree, title: 'Sommaire Ultime', desc: 'Table des matières éditable et exportable.', to: '/v3/outils/sommaire-ultime', badge: 'Nouveau' },
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

      {/* 2. DEUX ENCARTS DISCRETS — juste au-dessus de la promesse */}
      <div className="v3-shell">
        <V3StartIdeaCTA variant="discreet" />
      </div>

      {/* 3. PROMESSE PRINCIPALE */}
      <V3HeroBanner />

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

      {/* 5. AVANT DE COMMENCER — clé Gemini + migration V2 */}
      <V3BeforeYouStartPanel />

      {/* 6. CE QUI A CHANGÉ + MOTEURS IA */}
      <V3WhatsNewPanel />
      <V3EngineStrip />
      <V3EngineGrid />
      <V3ClosingRecallPanel />

      {/* 7. COMMENCER SON LIVRE */}
      <div className="v3-shell">
        <V3QuickActionsBar />
      </div>
      <div className="v3-shell">
        <V3ResumeBookCard compact />
      </div>

      <V3StartBookBar />

      <V3BriefRecap />

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
                  <Link
                    key={t.title}
                    to={t.to}
                    className="group block rounded-2xl bg-white p-5 transition-all hover:-translate-y-0.5"
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
                    <div className="mt-3 flex items-center gap-1 text-[12px] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
                      Ouvrir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* AUTEUR INVITÉ */}
          <section className="v3-section-dark">
            <div className="v3-shell py-16">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <span
                    className="v3-chip"
                    style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--v3-gold)', borderColor: 'transparent' }}
                  >
                    Auteur invité
                  </span>
                  <h2 className="v3-serif mt-4 text-3xl font-semibold text-white md:text-4xl">Mr Georges Boubet</h2>
                  <p className="mt-2 max-w-xl text-sm text-white/60">
                    71 livres publiés. Thrillers, sagas, jeunesse — le catalogue d'un auteur passionné.
                  </p>
                </div>
                <a href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="v3-btn v3-btn-gold">
                  Voir sur Amazon <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {AUTHOR_BOOKS.map((b) => (
                  <a
                    key={b.asin}
                    href={amazonBookUrl(b.asin)}
                    target="_blank" rel="noopener noreferrer"
                    className="group block"
                    title={b.title}
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-lg bg-black/40 shadow-lg ring-1 ring-white/10 transition-transform group-hover:-translate-y-1 group-hover:shadow-2xl">
                      <img
                        src={coverUrl(b.asin)}
                        alt={`Couverture ${b.title}`}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src !== fallbackCoverUrl(b.asin)) img.src = fallbackCoverUrl(b.asin);
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-2 line-clamp-2 text-[11px] leading-tight text-white/70">{b.title}</div>
                  </a>
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

          {/* CTA final */}
          <section className="v3-shell pb-20 text-center">
            <div className="v3-card mx-auto max-w-3xl">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'var(--v3-gold-soft)' }}>
                <Library className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
              </div>
              <h2 className="v3-serif mt-4 text-3xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
                Vos sauvegardes vous attendent
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
                Retrouvez tous les livres que vous avez créés, mis en favori ou en cours de rédaction.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/v3/create" className="v3-btn v3-btn-gold">
                  <Sparkles className="h-4 w-4" /> Ebookstudio-Génie — créer mon livre
                </Link>
                <Link to="/v3/library" className="text-sm font-semibold underline" style={{ color: 'var(--v3-emerald)' }}>
                  <BookOpen className="mr-1 inline h-4 w-4" /> Ma bibliothèque
                </Link>
              </div>
            </div>
          </section>
        </div>
      </ReadingGate>
    </div>
  );
}
