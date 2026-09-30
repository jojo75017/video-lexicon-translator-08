import { ArrowRight, Clapperboard, Play, Smartphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MICRO_SERIES_OFFER } from '@/data/microSeriesOffer';

const EPISODES = [
  { number: '01', label: 'Accrocher', icon: Play },
  { number: '02', label: 'Captiver', icon: Smartphone },
  { number: '03', label: 'Donner envie', icon: Clapperboard },
];

/** Avant-première V4 mise en évidence sur l'accueil, sans débloquer le module. */
export default function V3MicroSeriesSurpriseBanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--v3-editorial-ink)', borderBottom: '1px solid var(--v3-gold)' }}
      aria-labelledby="micro-series-surprise-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }}
      />

      <div className="v3-shell grid items-center gap-7 py-8 md:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] md:py-10">
        <div className="text-center md:text-left">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--v3-gold)', border: '1px solid color-mix(in srgb, var(--v3-gold) 45%, transparent)', background: 'color-mix(in srgb, var(--v3-gold) 10%, transparent)' }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Une surprise avant la V4
          </div>

          <h2
            id="micro-series-surprise-title"
            className="v3-serif mt-4 text-3xl font-semibold leading-tight sm:text-4xl"
            style={{ color: 'var(--v3-on-emerald)' }}
          >
            Votre livre devient une série verticale.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 md:mx-0 md:text-base">
            Le futur Studio Micro-Séries prépare vos scripts, scènes et sous-titres pour TikTok, Reels et Shorts.
            Précommandez maintenant et recevez l’accès à vie dès sa sortie.
          </p>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal px-6 py-3 text-center font-bold" style={{ background: 'var(--v3-gold)', color: 'var(--v3-editorial-ink)' }}>
              <Link to={MICRO_SERIES_OFFER.route}>
                Précommander — {MICRO_SERIES_OFFER.price} € une fois
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-xs font-medium text-primary-foreground/65">Module séparé des forfaits · bientôt disponible</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2" aria-label="Aperçu d’une micro-série en trois épisodes">
          {EPISODES.map(({ number, label, icon: Icon }, index) => (
            <div
              key={number}
              className={`relative aspect-[9/14] overflow-hidden rounded-md border p-3 ${index === 1 ? 'translate-y-3' : ''}`}
              style={{
                borderColor: 'color-mix(in srgb, var(--v3-gold) 35%, transparent)',
                background: 'linear-gradient(160deg, color-mix(in srgb, var(--v3-gold) 14%, var(--v3-editorial-ink)), var(--v3-editorial-ink))',
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--v3-gold)' }}>
                Épisode {number}
              </span>
              <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--v3-gold)', color: 'var(--v3-editorial-ink)' }}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <span className="absolute inset-x-3 bottom-3 text-center text-[11px] font-semibold text-primary-foreground/85">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}