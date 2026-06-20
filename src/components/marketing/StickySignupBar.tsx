import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';
import { isMarketingExcluded, isExpatPath } from '@/lib/marketingExclusions';
import { getAbCopy } from '@/lib/abTest';

const DISMISS_KEY = 'ebs_sticky_signup_dismissed';
const DONE_KEY = 'ebs_lead_popup_done';

/**
 * Bandeau d'inscription permanent (sticky bas mobile / haut desktop) affiché sur
 * toutes les pages publiques marketing. Capture l'email vers funnel-capture-lead.
 */
const StickySignupBar: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isExcluded = isMarketingExcluded(location.pathname);
  const isExpat = isExpatPath(location.pathname);
  const { variant, copy } = getAbCopy(isExpat);

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
    const t = window.setTimeout(() => setVisible(true), 4000);
    return () => window.clearTimeout(t);
  }, [isExcluded, location.pathname]);

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
          ab_variant: variant,
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackFormSubmit(`sticky_signup_bar_${variant}`, email);
      trackLeadMagnetDownload(isExpat ? 'publier-kdp-etranger' : '5-niches-rentables-2026');
      localStorage.setItem(DONE_KEY, '1');
      toast.success('Parfait ! Votre guide arrive dans votre boîte mail. 📩');
      setVisible(false);
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
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Gift className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold flex-1 min-w-0 truncate">
            {isExpat
              ? 'Guide gratuit : publier sur Amazon KDP depuis l\'étranger 🌍'
              : 'Recevez gratuitement les 5 niches d\'ebooks rentables 2026 🎁'}
          </p>

          {expanded ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="h-9 w-44 sm:w-56 bg-background text-foreground text-sm"
                required
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={submitting}
                className="h-9 whitespace-nowrap font-semibold"
              >
                {submitting ? '…' : (
                  <span className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" /> Recevoir
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setExpanded(true)}
              className="h-9 whitespace-nowrap font-semibold"
            >
              Recevoir le guide
            </Button>
          )}

          <button
            onClick={dismiss}
            aria-label="Fermer le bandeau"
            className="opacity-80 hover:opacity-100 transition-opacity shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickySignupBar;
