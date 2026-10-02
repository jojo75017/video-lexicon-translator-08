import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Niches10Offer from '@/components/marketing/Niches10Offer';
import { trackCaptureEvent } from '@/lib/captureTracking';

/**
 * Bande de rappel « Réserver ma place » — même action que le hero :
 * ouvre le formulaire d'inscription email existant (Niches10Offer →
 * funnel-capture-lead, cadeau « 10-niches-offertes »).
 */
export default function V3ReserveCtaBand() {
  const [captureOpen, setCaptureOpen] = useState(false);

  return (
    <>
      <section className="v3-shell py-8">
        <div
          className="rounded-3xl px-6 py-8 text-center md:px-10"
          style={{
            background: 'var(--v3-joy-cream)',
            border: '1px solid var(--v3-joy-orange-soft)',
            boxShadow: '0 18px 40px -30px rgba(30, 41, 59, 0.35)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
          >
            <span aria-hidden>🎁</span> EbookStudio V3 est ouvert
          </span>
          <h2 className="v3-serif mt-4 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
            Réservez votre place dès maintenant
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>
            Laissez votre email : vous serez prévenu à l'ouverture et vous recevez tout de suite
            le kit de démarrage + 10 niches rentables, offerts.
          </p>
          <Button
            type="button"
            size="lg"
            data-contemplation-allow="true"
            className="v3-joy-cta mt-6 h-auto min-h-12 max-w-full whitespace-normal px-6 py-3 text-center text-[14px] font-bold sm:text-[15px]"
            onClick={() => {
              void trackCaptureEvent('v3', 'reserve_open', { leadMagnet: '10-niches-offertes' });
              setCaptureOpen(true);
            }}
          >
            <Gift className="h-4 w-4 shrink-0" />
            Réserver ma place — kit + 10 niches offerts
          </Button>
        </div>
      </section>

      <Dialog open={captureOpen} onOpenChange={setCaptureOpen}>
        <DialogContent data-contemplation-allow="true" className="max-h-[90vh] max-w-xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Réserver ma place pour EbookStudio V3</DialogTitle>
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
