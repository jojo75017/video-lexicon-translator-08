import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import V3SubscriberHome from '@/components/v3public/V3SubscriberHome';
import {
  ArrowRight,
  Wand2, Feather, Rocket, Palette, ListTree, PenLine,
} from 'lucide-react';
import { trackCaptureEvent } from '@/lib/captureTracking';

import V3UpsellRotator from '@/components/v3public/V3UpsellRotator';
import V3CoverStudioBanner from '@/components/v3public/V3CoverStudioBanner';
import BdComicNewsBanner from '@/components/bd/BdComicNewsBanner';
import Niches10Offer from '@/components/marketing/Niches10Offer';
import { V3EngineStrip, V3EngineGrid } from '@/components/v3public/V3EngineBanner';
import V3LaunchBanner from '@/components/v3public/V3LaunchBanner';
import V3HeroBanner from '@/components/v3public/V3HeroBanner';
import V3StartHereHomeBanner from '@/components/v3public/V3StartHereHomeBanner';
import V3MicroSeriesSurpriseBanner from '@/components/v3public/V3MicroSeriesSurpriseBanner';
import V3PresentationVideo from '@/components/v3public/V3PresentationVideo';
import V3ClosingRecallPanel from '@/components/v3public/V3ClosingRecallPanel';
import V3AnchorNav from '@/components/v3public/V3AnchorNav';
import V3WhatIsPanel from '@/components/v3public/V3WhatIsPanel';
import V3WhatsNewPanel from '@/components/v3public/V3WhatsNewPanel';
import V3HowItWorksSteps from '@/components/v3public/V3HowItWorksSteps';
import V3GoFurtherPanel from '@/components/v3public/V3GoFurtherPanel';
import ReadingGate from '@/components/marketing/ReadingGate';
import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import V3FormatsMarquee from '@/components/v3public/V3FormatsMarquee';
import V3SubscriberZoomHelp from '@/components/v3public/V3SubscriberZoomHelp';
import V3KdpFeatureShowcase from '@/components/v3public/V3KdpFeatureShowcase';
import V3KdpFeatureShowcase2 from '@/components/v3public/V3KdpFeatureShowcase2';
import V3KdpFeatureShowcase3 from '@/components/v3public/V3KdpFeatureShowcase3';
import V3KdpFeatureShowcase4 from '@/components/v3public/V3KdpFeatureShowcase4';
import V3KdpFeatureShowcase5 from '@/components/v3public/V3KdpFeatureShowcase5';
import V3KdpFeatureShowcase6 from '@/components/v3public/V3KdpFeatureShowcase6';
import V3KdpFeatureShowcase7 from '@/components/v3public/V3KdpFeatureShowcase7';
import V3KdpFeatureShowcase8 from '@/components/v3public/V3KdpFeatureShowcase8';
import V3KdpFeatureShowcase9 from '@/components/v3public/V3KdpFeatureShowcase9';
import V3KdpFeatureShowcase10 from '@/components/v3public/V3KdpFeatureShowcase10';

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
  // Visite de la page d'avant-première : alimente le tableau de bord admin du tunnel.
  useEffect(() => {
    void trackCaptureEvent('v3', 'page_view');
  }, []);

  // Abonné connecté : tableau de bord à la place du contenu de vente d'avant lancement.
  const [user, setUser] = useState<any>(undefined);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="v3-home pb-4">
      {/* 1. LANCEMENT — bande fine */}
      {user ? (
        <V3SubscriberHome user={user} />
      ) : user === null ? (
        <>
          <V3LaunchBanner />
          {/* 2. PROMESSE PRINCIPALE */}
          <V3HeroBanner />
        </>
      ) : null}

      {/* BANDEAUX DÉFILANTS — tout ce qu'on peut créer */}
      <V3FormatsMarquee />

      {/* VIDÉO DE PRÉSENTATION — juste au-dessus du bloc d'aide Zoom (écrin prêt pour une future vidéo plus grande) */}
      {user && <V3PresentationVideo userId={user.id} />}

      {/* AIDE HUMAINE — visible uniquement pour les abonnés connectés */}
      {user && <V3SubscriberZoomHelp />}

      {/* Fonctionnalités KDP détaillées — visible uniquement pour les abonnés connectés */}
      {user && <V3KdpFeatureShowcase />}
      {user && <V3KdpFeatureShowcase2 />}
      {user && <V3KdpFeatureShowcase3 />}
      {user && <V3KdpFeatureShowcase4 />}
      {user && <V3KdpFeatureShowcase5 />}
      {user && <V3KdpFeatureShowcase6 />}
      {user && <V3KdpFeatureShowcase7 />}
      {user && <V3KdpFeatureShowcase8 />}
      {user && <V3KdpFeatureShowcase9 />}
      {user && <V3KdpFeatureShowcase10 />}

      {/* POINT DE DÉPART ABONNÉ — accès direct au choix des spécialistes */}
      {!user && <V3StartHereHomeBanner />}

      {/* SURPRISE V4 — précommande Studio Micro-Séries */}
      <V3MicroSeriesSurpriseBanner />

      {/* PREUVE AUTEUR — livres publiés + nom d'auteur, avant les offres */}
      <section className="v3-shell py-8">
        <div
          className="rounded-3xl bg-white p-6 md:p-10"
          style={{ border: '1px solid var(--v3-joy-orange-soft)', boxShadow: '0 18px 40px -30px rgba(30, 41, 59, 0.35)' }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span
                className="v3-chip"
                style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)', borderColor: 'transparent' }}
              >
                L'auteur derrière EbookStudio
              </span>
              <h2 className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
                Georges Boubet — 71 livres publiés sur Amazon
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>
                Chaque livre ci-dessous a été écrit et publié avec la méthode EbookStudio.
                Cliquez sur une couverture pour voir la fiche Amazon réelle.
              </p>
            </div>
            <a href={AUTHOR_AMAZON_URL} target="_blank" rel="noopener noreferrer" className="v3-btn v3-joy-cta shrink-0">
              Voir la page auteur Amazon <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {AUTHOR_BOOKS.map((b) => (
              <a
                key={b.asin}
                href={amazonBookUrl(b.asin)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                title={b.title}
              >
                <div
                  className="aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-transform group-hover:-translate-y-1 group-hover:shadow-xl"
                  style={{ background: 'var(--v3-joy-cream)', border: '1px solid var(--v3-joy-orange-soft)' }}
                >
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
                <p className="mt-2 line-clamp-2 text-center text-xs font-semibold leading-snug" style={{ color: 'var(--v3-joy-ink)' }}>
                  {b.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trois offres — aperçu discret, détail sur /v3/forfaits */}
      <V3PricingOverview />


      {/* 4. LES DEUX NOUVEAUTÉS — couvertures puis Studio BD & Jeunesse */}
      <section className="v3-shell">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-joy-orange-600)' }}>
          Les nouveautés
        </div>
        <h2 className="v3-serif mt-1 text-2xl font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>
          Deux ateliers qui viennent d’ouvrir
        </h2>
      </section>
      <V3CoverStudioBanner />
      <BdComicNewsBanner />

      {/* 6. CE QUI A CHANGÉ + MOTEURS IA */}
      <V3WhatsNewPanel />
      <V3EngineStrip />
      <V3EngineGrid />
      {!user && <V3ClosingRecallPanel />}

      {/* 8. POUR ALLER PLUS LOIN — agents, workflow, KDP Pilot */}
      <V3GoFurtherPanel />

      {/* 9. PRÉSENTATION LONGUE — comprendre la V3 */}
      {!user && <V3AnchorNav />}
      <V3WhatIsPanel />

      {/* La suite est offerte contre l'email pour les visiteurs inconnus. */}
      <ReadingGate surface="v3" title="La suite de la visite est offerte">
        <div className="v3-home">
          <V3HowItWorksSteps />

          {/* Pack de 10 niches, inclus dans l'accès */}
          <div className="v3-shell">
            <Niches10Offer surface="inline" hook="v3" variant="compact" source="v3-reservation" />
          </div>

          <V3UpsellRotator />

          {/* OUTILS VEDETTES */}
          <section className="v3-shell">
            <div className="rounded-3xl p-8" style={{ background: 'var(--v3-joy-cream)', border: '1px solid var(--v3-joy-orange-soft)' }}>
              <div className="mb-8 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-joy-orange-600)' }}>
                  Les incontournables
                </div>
                <h2 className="v3-serif mt-2 text-3xl font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>
                  Les outils au cœur du studio
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {FEATURED_TOOLS.map(({ icon: Icon, ...t }) => (
                  <div
                    key={t.title}
                    className="block rounded-2xl bg-white p-5"
                    style={{ border: '1px solid var(--v3-joy-orange-soft)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-full"
                        style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="v3-badge">{t.badge}</span>
                    </div>
                    <div className="v3-serif mt-3 text-[18px] font-semibold" style={{ color: 'var(--v3-joy-ink)' }}>
                      {t.title}
                    </div>
                    <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-joy-muted)' }}>{t.desc}</p>
                    <div className="mt-3 text-[12px] font-semibold" style={{ color: 'var(--v3-joy-muted)' }}>
                      Disponible
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
                background: 'var(--v3-joy-cream)',
                border: '1px solid var(--v3-joy-orange-soft)',
                boxShadow: '0 18px 40px -30px rgba(30, 41, 59, 0.35)',
              }}
            >
              <div className="grid items-center gap-6 px-6 py-8 md:grid-cols-[1fr_auto] md:px-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-joy-orange-600)' }}>
                    Blog · nouvelle édition
                  </span>
                  <h2 className="v3-serif mt-3 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
                    Le Blog EbookStudio — la méthode, en clair
                  </h2>
                  <p className="mt-2 max-w-2xl text-[14px]" style={{ color: 'var(--v3-joy-muted)' }}>
                    Articles, guides pratiques et retours d'expérience pour écrire, illustrer et publier
                    votre livre.
                  </p>
                </div>
                <div className="flex md:justify-end">
                  <span
                    className="v3-btn inline-flex items-center gap-2 whitespace-nowrap px-6 py-3 text-[15px] font-semibold"
                    style={{ background: 'var(--v3-joy-orange)', color: '#ffffff' }}
                  >
                    Ouvrir le blog
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </a>
          </section>

          <div className="pb-12" />
        </div>
      </ReadingGate>
    </div>
  );
}
