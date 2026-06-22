import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackCaptureEvent } from '@/lib/captureTracking';
import { MASTERCLASS_LEAD_MAGNET } from '@/data/masterclassModules';

interface Props {
  onUnlock: () => void;
}

const BENEFITS = [
  'Module 2 — Génération de contenu par IA',
  'Module 3 — Design & couverture professionnelle',
  'Module 4 — Métadonnées & SEO Amazon KDP',
  'Module 5 — Automatisation & stratégie marketing',
];

const MasterclassUnlockGate: React.FC<Props> = ({ onUnlock }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    trackCaptureEvent('inline', 'view', { leadMagnet: MASTERCLASS_LEAD_MAGNET });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }
    setSubmitting(true);
    try {
      const utm = getStoredUtm();
      await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: email.trim().toLowerCase(),
          lead_magnet: MASTERCLASS_LEAD_MAGNET,
          ref_code: getStoredRefCode(),
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url:
            utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackCaptureEvent('inline', 'click', { leadMagnet: MASTERCLASS_LEAD_MAGNET });
      toast.success('Accès débloqué ! Bonne masterclass 🎓');
      onUnlock();
    } catch {
      toast.error('Une erreur est survenue, réessayez dans un instant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground leading-tight">
              Débloquez les 4 modules suivants
            </h3>
            <p className="text-xs text-muted-foreground">100% gratuit · accès immédiat</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Entrez votre email pour accéder à l'intégralité de la masterclass (4h supplémentaires) :
        </p>

        <ul className="space-y-2 mb-5">
          {BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="text-base py-3"
            required
          />
          <Button type="submit" disabled={submitting} className="font-semibold py-3 w-full">
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Déblocage…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Débloquer les 4 modules
              </span>
            )}
          </Button>
        </form>
        <p className="text-[11px] text-muted-foreground mt-3 text-center">
          Gratuit · Pas de spam · Désinscription en 1 clic
        </p>
      </div>
    </div>
  );
};

export default MasterclassUnlockGate;
