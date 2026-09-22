import { useEffect, useState } from 'react';
import { Sparkles, BookOpen, BookMarked, ImageIcon, AudioLines, Tags, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Niches10Offer from '@/components/marketing/Niches10Offer';

const PILLS = [
  { label: 'Kindle', icon: BookOpen },
  { label: 'Livre broché', icon: BookMarked },
  { label: 'Couverture', icon: ImageIcon },
  { label: 'Livre audio', icon: AudioLines },
  { label: 'Métadonnées', icon: Tags },
];

const OPENING_DATE = new Date('2026-10-01T00:00:00+02:00').getTime();

const remainingUntilOpening = () => {
  const difference = Math.max(0, OPENING_DATE - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
  };
};

const CountdownValue = ({ value, label }: { value: number; label: string }) => (
  <div className="min-w-[72px] px-3 py-2 text-center" style={{ borderRight: '1px solid var(--v3-line)' }}>
    <div className="v3-serif text-2xl font-semibold tabular-nums" style={{ color: 'var(--v3-emerald)' }}>
      {String(value).padStart(2, '0')}
    </div>
    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--v3-muted)' }}>
      {label}
    </div>
  </div>
);

/** Premier module de l'accueil V3 — accroche « agent d'édition IA multi-modèle ». */
export default function V3HeroBanner({ className = '' }: { className?: string }) {
  const [remaining, setRemaining] = useState(remainingUntilOpening);
  const [captureOpen, setCaptureOpen] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(remainingUntilOpening()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <section
        className={`relative overflow-hidden ${className}`}
        style={{
          background: 'var(--v3-ivory)',
          borderBottom: '1px solid var(--v3-line)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }} />

        <div className="relative v3-shell py-10 text-center md:py-14">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--v3-gold-600)', background: 'var(--v3-gold-soft)', border: '1px solid color-mix(in srgb, var(--v3-gold) 45%, transparent)' }}
          >
            <Sparkles className="h-3 w-3" /> Ouverture le 1er octobre
          </span>

          <div
            className="mx-auto mt-4 inline-flex overflow-hidden rounded-lg"
            style={{ background: 'var(--v3-paper)', border: '1px solid var(--v3-line)' }}
            aria-label={`${remaining.days} jours, ${remaining.hours} heures et ${remaining.minutes} minutes avant l'ouverture`}
          >
            <CountdownValue value={remaining.days} label="jours" />
            <CountdownValue value={remaining.hours} label="heures" />
            <div className="min-w-[72px] px-3 py-2 text-center">
              <div className="v3-serif text-2xl font-semibold tabular-nums" style={{ color: 'var(--v3-emerald)' }}>
                {String(remaining.minutes).padStart(2, '0')}
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--v3-muted)' }}>
                minutes
              </div>
            </div>
          </div>

          <h1
            className="v3-serif mx-auto mt-5 max-w-4xl text-[28px] font-semibold leading-[1.1] md:text-[40px]"
            style={{ color: 'var(--v3-editorial-ink)' }}
          >
            Publiez votre livre sur Amazon KDP — même si vous n'écrivez pas une ligne.
          </h1>

          <p className="v3-serif mt-3 text-lg italic" style={{ color: 'var(--v3-gold-600)' }}>
            Votre maison d'édition IA ouvre le 1er octobre.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-relaxed md:text-[16.5px]" style={{ color: 'var(--v3-muted)' }}>
            D'une simple idée à un livre complet, prêt pour Amazon : texte, couverture, version Kindle et brochée,
            livre audio et métadonnées. Réservez votre place et recevez dès maintenant le kit de démarrage + 10 niches rentables.
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {PILLS.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
                style={{ background: 'var(--v3-paper)', border: '1px solid var(--v3-line)', color: 'var(--v3-editorial-ink-soft)' }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: 'var(--v3-gold-600)' }} /> {label}
              </li>
            ))}
          </ul>

          <Button
            type="button"
            size="lg"
            data-contemplation-allow="true"
            onClick={() => setCaptureOpen(true)}
            className="mt-7 h-auto min-h-12 max-w-full whitespace-normal px-6 py-3 text-center text-[14px] font-bold sm:text-[15px]"
          >
            <Gift className="h-4 w-4 shrink-0" />
            Réserver ma place — kit + 10 niches offerts
          </Button>
        </div>
      </section>

      <Dialog open={captureOpen} onOpenChange={setCaptureOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Réserver ma place pour EbookStudio V3</DialogTitle>
            <DialogDescription>
              Inscrivez votre email pour recevoir le kit de démarrage et les 10 niches offertes.
            </DialogDescription>
          </DialogHeader>
          <Niches10Offer surface="inline" hook="v3" variant="hero" />
        </DialogContent>
      </Dialog>
    </>
  );
}
