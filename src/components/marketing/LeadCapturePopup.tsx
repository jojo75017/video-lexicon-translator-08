import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';
import { isMarketingExcluded, isExpatPath } from '@/lib/marketingExclusions';
import { getAbCopy } from '@/lib/abTest';
import { trackCaptureEvent } from '@/lib/captureTracking';
import coverImg from '@/assets/lead-magnet-cover.png';

const SESSION_KEY = 'ebs_lead_popup_shown';
const DONE_KEY = 'ebs_lead_popup_done';

const BULLETS_GENERAL = [
  'Les 5 niches d’ebooks rentables en 2026',
  'Les mots-clés Amazon à fort volume',
  'Un plan d’ebook prêt à remplir',
];

const BULLETS_EXPAT = [
  'Créer un compte KDP depuis votre pays',
  'Être payé sur votre compte local (CHF, EUR, CAD)',
  'Le formulaire fiscal expliqué simplement',
];

/**
 * Pop-up de capture email global.
 * Déclenché uniquement sur intention de sortie OU après 40 % de défilement :
 * plus d'apparition automatique au chargement, qui faisait fuir les visiteurs.
 * Une seule fois par session, sur les pages publiques marketing uniquement.
 */
const LeadCapturePopup: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const armed = useRef(false);

  const isExcluded = isMarketingExcluded(location.pathname);
  const isExpat = isExpatPath(location.pathname);
  const { variant, copy } = getAbCopy(isExpat);
  const bullets = isExpat ? BULLETS_EXPAT : BULLETS_GENERAL;
  const leadMagnet = isExpat ? 'publier-kdp-etranger' : '5-niches-rentables-2026';

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
      trackCaptureEvent('popup', 'view', { abVariant: variant, leadMagnet });
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.4) trigger();
    };
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
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
          ab_variant: variant,
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackFormSubmit(`lead_popup_${variant}`, email);
      trackLeadMagnetDownload(isExpat ? 'publier-kdp-etranger' : '5-niches-rentables-2026');
      localStorage.setItem(DONE_KEY, '1');
      setDone(true);
    } catch {
      toast.error("Une erreur est survenue, réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95"
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute top-2 right-2 z-10 h-11 w-11 flex items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-bold text-foreground">C’est envoyé !</h2>
            <p className="text-sm text-muted-foreground">
              Ouvrez votre boîte mail : votre guide vous attend. Pensez à vérifier les spams si vous ne le voyez pas
              dans 2 minutes.
            </p>
            <Button onClick={() => setOpen(false)} className="w-full font-semibold">
              Continuer la visite
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-[150px_1fr] gap-0">
            <div className="hidden sm:flex items-center justify-center bg-muted/50 p-4">
              <img
                src={coverImg}
                alt="Couverture du guide gratuit EbookStudio"
                className="w-full rounded-md shadow-lg"
                width={400}
                height={512}
                loading="lazy"
              />
            </div>

            <div className="p-6 sm:p-7">
              <p className="inline-block mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                GUIDE PDF GRATUIT
              </p>
              <h2 id="lead-popup-title" className="text-xl font-bold text-foreground leading-snug">
                {copy.popupTitle}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">{copy.popupSubtitle}</p>

              <ul className="mt-4 space-y-1.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="mt-5 space-y-2.5">
                <label htmlFor="lead-popup-email" className="block text-sm font-semibold text-foreground">
                  Où souhaitez-vous recevoir le guide ?
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lead-popup-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-9 text-base h-12"
                    maxLength={255}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full font-bold h-12 text-base">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Envoi…
                    </span>
                  ) : (
                    copy.popupCta
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  100 % gratuit · Aucune carte bancaire · Désinscription en 1 clic
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCapturePopup;
