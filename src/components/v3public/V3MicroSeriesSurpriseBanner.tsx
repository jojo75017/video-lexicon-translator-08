import { ArrowRight, Captions, Clapperboard, Play, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MICRO_SERIES_OFFER } from '@/data/microSeriesOffer';

const EPISODES = [
  { number: '01', label: 'Accrocher', duration: '30 s', icon: Play },
  { number: '02', label: 'Captiver', duration: '45 s', icon: Smartphone },
  { number: '03', label: 'Donner envie', duration: '60 s', icon: Clapperboard },
];

const BENEFITS = [
  'Scripts courts prêts pour TikTok, Reels et Shorts',
  'Découpage scène par scène et voix off minutée',
  'Sous-titres SRT synchronisés pour le montage',
];

/** Avant-première V4 mise en évidence sur l'accueil, sans débloquer le module. */
export default function V3MicroSeriesSurpriseBanner() {
  return (
    <section className="v3-shell py-6" aria-labelledby="micro-series-surprise-title">
      <div
        className="relative overflow-hidden rounded-2xl border-2 p-6 md:p-8"
        style={{ background: 'hsl(222 30% 12%)', borderColor: 'var(--v3-joy-orange-600)' }}
      >
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'hsl(30 100% 70%)', background: 'hsl(30 100% 55% / 0.15)' }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Une surprise avant la V4 · Studio Micro-Séries
            </div>

            <h2
              id="micro-series-surprise-title"
              className="v3-serif mt-4 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl"
              style={{ color: 'hsl(0 0% 100%)' }}
            >
              Votre livre devient une série verticale.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed md:mx-0 md:text-base" style={{ color: 'hsl(220 15% 78%)' }}>
              Transformez vos histoires en mini-séries captivantes pour faire découvrir vos livres là où vos lecteurs passent leur temps.
            </p>

            <ul className="mx-auto mt-4 max-w-xl space-y-2 text-left md:mx-0">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm" style={{ color: 'hsl(0 0% 95%)' }}>
                  <Captions className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'hsl(30 100% 60%)' }} />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-center gap-2 md:items-start">
              <Link
                to={MICRO_SERIES_OFFER.route}
                className="v3-joy-cta inline-flex min-h-12 items-center gap-2 rounded-lg px-6 py-3 text-center font-bold shadow-lg transition-transform hover:scale-[1.02]"
              >
                Précommander l'accès à vie — {MICRO_SERIES_OFFER.price} €
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'hsl(220 15% 70%)' }}>
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: 'hsl(140 60% 55%)' }} />
                Paiement unique · Accès réservé pour la V4 · Aucun abonnement
              </span>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-3" aria-label="Aperçu d'une micro-série en trois épisodes">
            {EPISODES.map(({ number, label, duration, icon: Icon }, index) => (
              <div
                key={number}
                className={`relative aspect-[9/16] overflow-hidden rounded-2xl border-4 p-2 shadow-xl ${index === 1 ? '-translate-y-3' : ''}`}
                style={{
                  borderColor: 'hsl(222 20% 28%)',
                  background: 'linear-gradient(180deg, hsl(25 60% 30%), hsl(222 40% 10%))',
                }}
              >
                <div className="mx-auto mb-2 h-1 w-6 rounded-full" style={{ background: 'hsl(222 20% 35%)' }} />
                <span className="block text-[9px] font-bold uppercase tracking-widest" style={{ color: 'hsl(30 100% 70%)' }}>
                  Ép. {number}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: 'hsl(0 0% 100% / 0.2)', color: 'hsl(0 0% 100%)' }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="absolute inset-x-2 bottom-2 text-center">
                  <span className="block text-[11px] font-semibold" style={{ color: 'hsl(0 0% 100%)' }}>{label}</span>
                  <span className="text-[9px]" style={{ color: 'hsl(220 15% 75%)' }}>{duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
