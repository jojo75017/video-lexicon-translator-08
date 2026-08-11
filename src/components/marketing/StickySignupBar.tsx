import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';
import { isMarketingExcluded, isExpatPath } from '@/lib/marketingExclusions';
import { getAbCopy } from '@/lib/abTest';
import { trackCaptureEvent } from '@/lib/captureTracking';

const DISMISS_KEY = 'ebs_sticky_signup_dismissed';
const DONE_KEY = 'ebs_lead_popup_done';

/**
 * Bandeau d'inscription permanent (sticky bas mobile / haut desktop) affiché sur
 * toutes les pages publiques marketing. Le champ email est visible d'emblée :
 * l'inscription se fait en une seule action, sans clic intermédiaire.
 */
const StickySignupBar: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const isExcluded = isMarketingExcluded(location.pathname);
  const isExpat = isExpatPath(location.pathname);
  const { variant, copy } = getAbCopy(isExpat);
  const leadMagnet = isExpat ? 'publier-kdp-etranger' : '5-niches-rentables-2026';

  useEffect(() => {
    if (isExcluded) {
      setVisible(false);
      return;
    }
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(DISMISS_KEY) || localStorage.getItem(DONE_KEY)) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => {
      setVisible(true);
      trackCaptureEvent('sticky', 'view', { abVariant: variant, leadMagnet });
    }, 4000);
    return () => window.clearTimeout(t);
  }, [isExcluded, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }
    setSubmitting(true);
    trackCaptureEvent('sticky', 'click', { abVariant: variant, leadMagnet });
    try {
      const utm = getStoredUtm();
      await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: email.trim().toLowerCase(),
          lead_magnet: isExpat ? 'publier-kdp-etranger' : undefined,
          ref_code: getStoredRefCode(),
          ab_variant: variant,
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackFormSubmit(`sticky_signup_bar_${variant}`, email);
      trackLeadMagnetDownload(leadMagnet);
      localStorage.setItem(DONE_KEY, '1');
      setDone(true);
      window.setTimeout(() => setVisible(false), 4000);
    } catch {
      toast.error('Une erreur est survenue, réessayez dans un instant.');
    } finally {
      setSubmitting(false);
    }
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible || isExcluded) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-0 z-[60] animate-in slide-in-from-bottom-4 sm:slide-in-from-top-4">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {done ? (
            <p className="flex items-center gap-2 text-sm font-semibold py-1">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              C’est envoyé ! Ouvrez votre boîte mail pour récupérer votre guide.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Gift className="w-5 h-5 shrink-0" />
                <p className="text-sm font-semibold min-w-0">{copy.stickyMessage}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sticky-signup-email" className="sr-only">
                  Votre adresse email
                </label>
                <Input
                  id="sticky-signup-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="h-11 flex-1 sm:w-56 bg-background text-foreground text-base"
                  maxLength={255}
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={submitting}
                  className="h-11 px-4 whitespace-nowrap font-bold"
                >
                  {submitting ? '…' : copy.stickyCta}
                </Button>
              </form>
            </>
          )}

          <button
            onClick={dismiss}
            aria-label="Fermer le bandeau"
            className="absolute right-2 top-1 sm:static h-9 w-9 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickySignupBar;
