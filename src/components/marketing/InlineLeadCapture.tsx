import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';
import { trackCaptureEvent } from '@/lib/captureTracking';

interface InlineLeadCaptureProps {
  /** Lead magnet à délivrer : 'publier-kdp-etranger' (expatriés) ou guide général par défaut */
  leadMagnet?: 'publier-kdp-etranger' | '5-niches-rentables-2026';
  title?: string;
  subtitle?: string;
  bullets?: string[];
  className?: string;
}

const DEFAULT_BULLETS_GENERAL = [
  '5 niches d\'ebooks rentables en 2026 (données Amazon réelles)',
  'Les mots-clés à fort volume pour chaque niche',
  'Un plan d\'ebook prêt à l\'emploi',
];

const DEFAULT_BULLETS_EXPAT = [
  'Créer un compte KDP depuis la Suisse, la Belgique, le Canada…',
  'Être payé sur votre compte bancaire local (CHF, EUR, CAD)',
  'Le formulaire fiscal expliqué simplement',
];

/**
 * Bloc de capture email réutilisable, inséré dans les pages publiques à fort trafic
 * (SEO, blog, expatriés). Branché sur l'edge function funnel-capture-lead.
 */
const InlineLeadCapture: React.FC<InlineLeadCaptureProps> = ({
  leadMagnet = '5-niches-rentables-2026',
  title,
  subtitle,
  bullets,
  className = '',
}) => {
  const isExpat = leadMagnet === 'publier-kdp-etranger';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const resolvedBullets = bullets ?? (isExpat ? DEFAULT_BULLETS_EXPAT : DEFAULT_BULLETS_GENERAL);
  const resolvedTitle =
    title ?? (isExpat ? 'Publier sur Amazon KDP depuis l\'étranger 🌍' : 'Recevez votre guide gratuit 🎁');
  const resolvedSubtitle =
    subtitle ??
    (isExpat
      ? 'Le guide complet pour créer et vendre un ebook en français depuis votre pays de résidence.'
      : 'Les 5 niches d\'ebooks les plus rentables en 2026 + un plan prêt à l\'emploi.');

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
          lead_magnet: isExpat ? 'publier-kdp-etranger' : undefined,
          ref_code: getStoredRefCode(),
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackFormSubmit('inline_lead_capture', email);
      trackLeadMagnetDownload(leadMagnet);
      setDone(true);
      toast.success('Parfait ! Votre guide arrive dans votre boîte mail. 📩');
    } catch {
      toast.error('Une erreur est survenue, réessayez dans un instant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`my-10 ${className}`}>
      <div className="max-w-2xl mx-auto rounded-2xl border-2 border-primary/30 bg-card shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{resolvedTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{resolvedSubtitle}</p>

        {done ? (
          <div className="flex items-center gap-2 text-primary font-semibold py-3">
            <CheckCircle2 className="w-5 h-5" /> Vérifiez votre boîte mail, votre guide est en route !
          </div>
        ) : (
          <>
            <ul className="space-y-2 mb-5">
              {resolvedBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="text-base py-3 flex-1"
                required
              />
              <Button type="submit" disabled={submitting} className="font-semibold py-3 whitespace-nowrap">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Envoi…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Recevoir le guide
                  </span>
                )}
              </Button>
            </form>
            <p className="text-[11px] text-muted-foreground mt-2 text-center sm:text-left">
              Gratuit · Pas de spam · Désinscription en 1 clic
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default InlineLeadCapture;
