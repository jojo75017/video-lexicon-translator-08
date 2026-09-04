import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Lock, Sparkles, WandSparkles } from 'lucide-react';
import coverProBanner from '@/assets/cover-pro-banner.jpg';

const POINTS = [
  { icon: WandSparkles, label: 'Illustration IA haute résolution, sans aucun texte' },
  { icon: Sparkles, label: 'Titre, sous-titre et auteur en calques modifiables' },
  { icon: Lock, label: 'Espace privé : vos couvertures restent à vous' },
];

/**
 * Bannière d'accueil « Cover Studio KDP Pro » (67 €, paiement unique).
 * Purement visuelle et promotionnelle : aucune logique d'accès ni de paiement ici,
 * le tunnel reste géré par la page /v3/cover-pro.
 */
export default function V3CoverProBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-10 md:px-8">
      <div
        className="group relative overflow-hidden rounded-[28px] shadow-2xl"
        style={{
          background:
            'radial-gradient(120% 140% at 12% 0%, #1b2350 0%, #101731 45%, #070a18 100%)',
          border: '1px solid rgba(212, 175, 55, 0.28)',
        }}
      >
        {/* Voile doré animé très discret */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(100deg, transparent, rgba(212,175,55,0.16), transparent)',
            animation: 'v3CoverProSheen 2.4s ease-in-out infinite',
          }}
        />
        <style>{`@keyframes v3CoverProSheen{0%{transform:translateX(0)}100%{transform:translateX(340%)}}`}</style>

        <div className="relative grid items-stretch gap-0 lg:grid-cols-[1fr_1.08fr]">
          {/* Texte */}
          <div className="p-7 sm:p-10 lg:p-12">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#e8c86a',
              }}
            >
              <Crown className="h-3 w-3" /> Nouveau module Pro
            </span>

            <h2
              className="v3-serif mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]"
              style={{ color: '#f6f4ee' }}
            >
              Une couverture digne
              <br />
              <span
                style={{
                  background: 'linear-gradient(96deg, #e8c86a 0%, #f3e3ae 45%, #c9a227 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                d'une maison d'édition
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(246,244,238,0.76)' }}>
              Cover Studio KDP Pro génère l'illustration, vous posez le texte par-dessus.
              Kindle, broché, relié : les dimensions Amazon sont respectées, sans jamais
              demander d'ISBN.
            </p>

            <ul className="mt-6 space-y-2.5">
              {POINTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(246,244,238,0.9)' }}>
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgba(212,175,55,0.16)', color: '#e8c86a' }}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/v3/cover-pro?checkout=1"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(96deg, #e8c86a 0%, #c9a227 100%)',
                  color: '#141a34',
                }}
              >
                Découvrir Cover Studio Pro <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="leading-tight">
                <p className="text-lg font-bold" style={{ color: '#f6f4ee' }}>
                  67 € <span className="text-xs font-medium" style={{ color: 'rgba(246,244,238,0.62)' }}>une seule fois</span>
                </p>
                <p className="text-[11px]" style={{ color: 'rgba(246,244,238,0.56)' }}>
                  3 générations offertes, puis votre propre clé API
                </p>
              </div>
            </div>
          </div>

          {/* Visuel */}
          <div
            className="relative min-h-[240px] lg:min-h-[380px]"
            style={{
              maskImage: 'linear-gradient(90deg, transparent 0%, #000 30%)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 30%)',
            }}
          >
            <img
              src={coverProBanner}
              alt="Trois couvertures de livres haut de gamme aux ornements dorés, générées avec Cover Studio KDP Pro"
              loading="lazy"
              width={1536}
              height={1024}
              className="h-full w-full object-cover object-center transition-transform duration-[1200ms] group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(16,23,49,0.5) 0%, rgba(7,10,24,0.12) 45%, rgba(7,10,24,0) 100%)',
              }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 lg:hidden"
              style={{ background: 'linear-gradient(180deg, transparent, #070a18)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
