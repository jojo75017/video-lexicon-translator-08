import { useState } from 'react';
import { Sparkles, BookOpen, BookMarked, ImageIcon, AudioLines, Tags, Gift } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Niches10Offer from '@/components/marketing/Niches10Offer';
import { trackCaptureEvent } from '@/lib/captureTracking';
import heroBg from '@/assets/v3-hero-bg.jpg';

const PILLS = [
  { label: 'Kindle', icon: BookOpen },
  { label: 'Livre broché', icon: BookMarked },
  { label: 'Couverture', icon: ImageIcon },
  { label: 'Livre audio', icon: AudioLines },
  { label: 'Métadonnées', icon: Tags },
];

/** Premier module de l'accueil V3 — style « Jovial Premium Gold ». */
export default function V3HeroBanner({ className = '' }: { className?: string }) {
  const [captureOpen, setCaptureOpen] = useState(false);

  return (
    <>
      <section
        className={`relative overflow-hidden ${className}`}
        style={{
          background: 'var(--v3-joy-cream)',
          borderBottom: '1px solid var(--v3-joy-orange-soft)',
        }}
      >
        {/* Photo de fond : contrastée et saturée, volontairement visible autour du texte */}
        <img src={heroBg} alt="" aria-hidden width={1920} height={800}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'contrast(1.26) saturate(1.2) brightness(0.95)' }} />
        {/* Léger voile crème : unit la photo sans l'effacer */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--v3-joy-cream) 34%, transparent), color-mix(in srgb, var(--v3-joy-cream) 22%, transparent) 45%, color-mix(in srgb, var(--v3-joy-cream) 40%, transparent))',
          }} />
        {/* Halos soleil doux */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-[8%] h-64 w-64 rounded-full opacity-50 blur-3xl"
          style={{ background: 'var(--v3-joy-orange-soft)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 right-[6%] h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: 'var(--v3-joy-yellow-soft)' }}
        />
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: 'linear-gradient(90deg, transparent, var(--v3-joy-orange), var(--v3-joy-yellow), transparent)' }}
        />

        <div className="relative v3-shell py-10 text-center md:py-14">
          {/* Carte crème derrière le texte : contraste garanti, photo visible autour */}
          <div
            className="mx-auto max-w-4xl rounded-3xl px-5 py-8 md:px-12 md:py-11"
            style={{
              background: 'color-mix(in srgb, var(--v3-joy-cream) 93%, transparent)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid var(--v3-joy-orange-soft)',
              boxShadow: '0 26px 60px -40px color-mix(in srgb, var(--v3-joy-ink) 65%, transparent)',
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                color: 'var(--v3-joy-orange-600)',
                border: '1px solid var(--v3-joy-orange-soft)',
                boxShadow: '0 2px 8px -4px color-mix(in srgb, var(--v3-joy-ink) 40%, transparent)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Votre maison d'édition IA
            </span>

            <h1
              className="v3-serif mx-auto mt-5 max-w-3xl text-[28px] font-semibold leading-[1.1] md:text-[40px]"
              style={{ color: 'var(--v3-joy-ink)' }}
            >
              Publiez votre livre sur{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, var(--v3-joy-orange-600), var(--v3-joy-yellow-600))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Amazon KDP
              </span>{' '}
              — même si vous n'écrivez pas une ligne.
            </h1>

            <p className="v3-serif mt-3 text-lg font-medium italic" style={{ color: 'color-mix(in srgb, var(--v3-joy-orange-600) 76%, var(--v3-joy-ink))' }}>
              De la première idée au livre que vous êtes fier de présenter.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed md:text-[16.5px]" style={{ color: 'var(--v3-joy-muted)' }}>
              D'une simple idée à un livre complet, prêt pour Amazon : texte, couverture, version Kindle et brochée,
              livre audio et métadonnées. Recevez aussi le kit de démarrage + 10 niches rentables.
            </p>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {PILLS.map(({ label, icon: Icon }, i) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-bold shadow-sm"
                  style={{
                    border: `2px solid ${i % 2 ? 'var(--v3-joy-yellow-soft)' : 'var(--v3-joy-orange-soft)'}`,
                    color: 'var(--v3-joy-ink)',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: i % 2 ? 'var(--v3-joy-yellow-600)' : 'var(--v3-joy-orange-600)' }} /> {label}
                </li>
              ))}
            </ul>

            <button
              type="button"
              data-contemplation-allow="true"
              onClick={() => {
                void trackCaptureEvent('v3', 'reserve_open', { leadMagnet: '10-niches-offertes' });
                setCaptureOpen(true);
              }}
              className="v3-joy-cta mt-7 inline-flex h-auto min-h-12 max-w-full items-center justify-center gap-2 whitespace-normal rounded-2xl px-8 py-4 text-center text-[14px] font-bold text-white transition-all hover:-translate-y-0.5 sm:text-[15px]"
              style={{
                background: 'var(--v3-joy-orange)',
                boxShadow: '0 12px 30px -10px color-mix(in srgb, var(--v3-joy-orange) 55%, transparent)',
              }}
            >
              <Gift className="h-4 w-4 shrink-0" />
              Recevoir le kit + 10 niches offerts
            </button>
            <div className="mt-4">
              <a href="/v3/tutoriels-v3" data-contemplation-allow="true"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-[14px] font-bold transition-colors"
                style={{ border: '2px solid var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}>
                🎬 Voir les Tutoriels V3 (25)
              </a>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={captureOpen} onOpenChange={setCaptureOpen}>
        <DialogContent data-contemplation-allow="true" className="max-h-[90vh] max-w-xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Recevoir le kit de démarrage et les 10 niches offertes</DialogTitle>
            <DialogDescription>
              Inscrivez votre email pour recevoir le kit de démarrage et les 10 niches offertes.
            </DialogDescription>
          </DialogHeader>
          <Niches10Offer surface="inline" hook="v3" variant="hero" source="v3-reservation" />
        </DialogContent>
      </Dialog>
    </>
  );
}
