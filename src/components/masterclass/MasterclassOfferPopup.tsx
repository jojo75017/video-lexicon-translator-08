import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PartyPopper, Flame } from 'lucide-react';
import { MASTERCLASS_CTA_URL } from '@/data/masterclassModules';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COUNTDOWN_SECONDS = 15 * 60;

const format = (s: number) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const MasterclassOfferPopup: React.FC<Props> = ({ open, onOpenChange }) => {
  const [left, setLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!open) return;
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    setLeft(COUNTDOWN_SECONDS);
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-center">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
            <PartyPopper className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Félicitations ! 🎉</h2>
          <p className="text-sm text-muted-foreground">
            Vous avez terminé la masterclass complète. Vous avez maintenant toutes les clés pour
            créer et publier votre ebook rentable.
          </p>

          <div className="w-full rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <div className="flex items-center justify-center gap-2 text-accent font-semibold mb-1">
              <Flame className="w-5 h-5" /> Offre spéciale
            </div>
            <p className="text-sm text-foreground/85 mb-2">
              Passez à l'action avec l'outil complet EbookStudio Pro.
            </p>
            <p className="text-xs text-muted-foreground">
              Offre valable encore{' '}
              <span className="font-mono font-bold text-foreground">{format(left)}</span>
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full font-bold text-base bg-gradient-to-r from-[#FF9E2D] to-[#e8492b] hover:opacity-90 animate-pulse text-white border-0"
          >
            <a href={MASTERCLASS_CTA_URL} target="_blank" rel="noopener noreferrer">
              🔥 J'accède à l'offre maintenant
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MasterclassOfferPopup;
