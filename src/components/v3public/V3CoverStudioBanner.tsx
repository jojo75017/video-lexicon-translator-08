import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Layers, Lock, Ruler, WandSparkles } from 'lucide-react';
import coverProBanner from '@/assets/cover-pro-banner.jpg';

const POINTS = [
  { icon: WandSparkles, t: 'Illustration IA', d: 'Haute résolution, sans texte incrusté' },
  { icon: Layers, t: 'Calques modifiables', d: 'Titre, sous-titre, auteur, ornements' },
  { icon: Ruler, t: 'Dos au millimètre', d: 'Kindle, broché, relié — normes KDP' },
  { icon: Lock, t: '100 % privé', d: 'Vos visuels restent à vous' },
];

/**
 * Module unique « Maison d'Édition Couverture » (fusion des anciennes bannières
 * Cover Studio Pro + Mes couvertures). Purement présentationnel : aucun appel IA,
 * aucun crédit consommé, aucune logique de paiement ici.
 */
export default function V3CoverStudioBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
      <div
        className="group relative overflow-hidden rounded-[28px] shadow-2xl"
        style={{
          background: 'radial-gradient(120% 140% at 12% 0%, #1b2350 0%, #101731 45%, #070a18 100%)',
          border: '1px solid rgba(212, 175, 55, 0.32)',
        }}
      >
        <div className="relative grid items-stretch gap-0 lg:grid-cols-[1fr_1.02fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{
                background: 'rgba(212,175,55,0.14)',
                border: '1px solid rgba(212,175,55,0.45)',
                color: '#e8c86a',
              }}
            >
              <Crown className="h-3 w-3" /> Nouveauté V4 — en avance
            </span>

            <h2
              className="v3-serif mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]"
              style={{ color: '#f6f4ee' }}
            >
              Votre maison d'édition
              <br />
              <span
                style={{
                  background: 'linear-gradient(96deg, #e8c86a 0%, #f3e3ae 45%, #c9a227 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                de couvertures
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: 'rgba(246,244,238,0.78)' }}>
              Un seul module pour tout : l'illustration générée par l'IA, les modèles
              professionnels, les calques de texte, le dos calculé au millimètre et
              l'export Kindle ou broché prêt à envoyer sur Amazon KDP.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {POINTS.map(({ icon: Icon, t, d }) => (
                <li
                  key={t}
                  className="rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Icon className="h-4 w-4" style={{ color: '#e8c86a' }} />
                  <div className="mt-2 text-sm font-bold" style={{ color: '#f6f4ee' }}>{t}</div>
                  <div className="text-xs" style={{ color: 'rgba(246,244,238,0.66)' }}>{d}</div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/v3/mes-couvertures"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(96deg, #e8c86a 0%, #c9a227 100%)', color: '#141a34' }}
              >
                Ouvrir le studio de couverture <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/v3/cover-pro?checkout=1"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#f6f4ee',
                  border: '1px solid rgba(255,255,255,0.24)',
                }}
              >
                Voir l'offre 67 € (une seule fois)
              </Link>
            </div>
            <p className="mt-3 text-[11px]" style={{ color: 'rgba(246,244,238,0.55)' }}>
              3 générations offertes, puis votre propre clé API. L'éditeur ne consomme aucun crédit.
            </p>
          </div>

          <div
            className="relative min-h-[240px] lg:min-h-[400px]"
            style={{
              maskImage: 'linear-gradient(90deg, transparent 0%, #000 30%)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 30%)',
            }}
          >
            <img
              src={coverProBanner}
              alt="Trois couvertures de livres haut de gamme aux ornements dorés créées avec le studio de couverture EbookStudio"
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
