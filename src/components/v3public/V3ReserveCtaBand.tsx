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
            background: 'linear-gradient(160deg,#064e3b 0%,#053e2f 60%,#0a5a45 100%)',
            border: '1px solid rgba(201,168,76,0.35)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--v3-gold)', border: '1px solid rgba(201,168,76,0.35)' }}
          >
            <span aria-hidden>🎁</span> Ouverture le 1er octobre
          </span>
          <h2 className="v3-serif mt-4 text-2xl font-semibold leading-tight text-white md:text-3xl">
            Réservez votre place dès maintenant
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-white/85">
            Laissez votre email : vous serez prévenu à l'ouverture et vous recevez tout de suite
            le kit de démarrage + 10 niches rentables, offerts.
          </p>
          <Button
            type="button"
            size="lg"
            onClick={() => setCaptureOpen(true)}
            className="mt-6 h-auto min-h-12 max-w-full whitespace-normal px-6 py-3 text-center text-[14px] font-bold sm:text-[15px]"
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
