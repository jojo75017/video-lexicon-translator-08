import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Gift, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';

const SESSION_KEY = 'ebs_lead_popup_shown';
const DONE_KEY = 'ebs_lead_popup_done';
// Pages où le pop-up n'a pas de sens (app interne, checkout, confirmation)
const EXCLUDED_PREFIXES = ['/dashboard', '/ebook', '/admin', '/paiement', '/confirmation', '/merci', '/audit-pilot', '/gestion-prospects', '/crm', '/auth'];

/**
 * Pop-up de capture email global (lead magnet "5 niches rentables 2026").
 * Déclenché sur intention de sortie OU après 30s, une seule fois par session.
 * N'apparaît que sur les pages publiques marketing.
 */
const LeadCapturePopup: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const armed = useRef(false);

  const isExcluded = EXCLUDED_PREFIXES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (isExcluded) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(DONE_KEY)) return;

    armed.current = true;
    const trigger = () => {
      if (!armed.current) return;
      armed.current = false;
      sessionStorage.setItem(SESSION_KEY, '1');
      setOpen(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const timer = window.setTimeout(trigger, 30000);
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
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
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackFormSubmit('lead_popup', email);
      trackLeadMagnetDownload(isExpat ? 'publier-kdp-etranger' : '5-niches-rentables-2026');
      localStorage.setItem(DONE_KEY, '1');
      toast.success('Parfait ! Votre guide arrive dans votre boîte mail. 📩');
      setOpen(false);
    } catch {
      toast.error("Une erreur est survenue, réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-8 animate-in zoom-in-95">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Avant de partir… 🎁</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Recevez gratuitement <strong className="text-foreground">les 5 niches d'ebooks les plus rentables en 2026</strong> (données Amazon réelles) + un plan d'ebook prêt à l'emploi.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="text-base py-3"
            required
          />
          <Button type="submit" disabled={submitting} className="w-full font-semibold py-3">
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Envoi…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Recevoir mon guide gratuit
              </span>
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Pas de spam. Désinscription en 1 clic.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadCapturePopup;
