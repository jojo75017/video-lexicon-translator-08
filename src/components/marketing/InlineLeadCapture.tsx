import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';
import { trackCaptureEvent } from '@/lib/captureTracking';

interface InlineLeadCaptureProps {
  /** Lead magnet à délivrer : 'publier-kdp-etranger' (expatriés) ou guide général par défaut */
  leadMagnet?: 'publier-kdp-etranger' | '5-niches-rentables-2026';
  /**
   * Contrepartie mise en avant :
   * - 'guide' (défaut) : le PDF, adapté au blog et aux pages SEO
   * - 'demo' : essai gratuit d'un début de livre écrit par l'IA, pour les pages produit
   */
  offer?: 'guide' | 'demo';
  title?: string;
  subtitle?: string;
  bullets?: string[];
  className?: string;
}

const DEFAULT_BULLETS_GENERAL = [
  '10 niches d\'ebooks rentables en 2026 (données Amazon réelles)',
  'Les mots-clés à fort volume pour chaque niche',
  'Un plan d\'ebook prêt à l\'emploi',
];

const DEFAULT_BULLETS_EXPAT = [
  'Créer un compte KDP depuis la Suisse, la Belgique, le Canada…',
  'Être payé sur votre compte bancaire local (CHF, EUR, CAD)',
  'Le formulaire fiscal expliqué simplement',
];

const DEFAULT_BULLETS_DEMO = [
  'Le plan de votre livre généré à partir de votre idée',
  'Le premier chapitre rédigé en français, prêt à relire',
  'Un aperçu de la couverture aux normes Amazon KDP',
];

/**
 * Bloc de capture email réutilisable, inséré dans les pages publiques à fort trafic
 * (SEO, blog, expatriés). Branché sur l'edge function funnel-capture-lead.
 */
const InlineLeadCapture: React.FC<InlineLeadCaptureProps> = ({
  leadMagnet = '5-niches-rentables-2026',
  offer = 'guide',
  title,
  subtitle,
  bullets,
  className = '',
}) => {
  const isExpat = leadMagnet === 'publier-kdp-etranger';
  const isDemo = offer === 'demo';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    trackCaptureEvent(isDemo ? 'demo' : 'inline', 'view', { leadMagnet });
  }, [leadMagnet, isDemo]);

  const resolvedBullets =
    bullets ?? (isDemo ? DEFAULT_BULLETS_DEMO : isExpat ? DEFAULT_BULLETS_EXPAT : DEFAULT_BULLETS_GENERAL);
  const resolvedTitle =
    title ??
    (isDemo
      ? 'Testez gratuitement : l’IA écrit le début de votre livre'
      : isExpat
        ? 'Publier sur Amazon KDP depuis l\'étranger 🌍'
        : 'Recevez votre guide gratuit 🎁');
  const resolvedSubtitle =
    subtitle ??
    (isDemo
      ? 'Laissez votre email : vous recevez un accès à la démonstration et voyez le résultat sur votre propre sujet, avant de payer quoi que ce soit.'
      : isExpat
        ? 'Le guide complet pour créer et vendre un ebook en français depuis votre pays de résidence.'
        : 'Les 10 niches d\'ebooks les plus rentables en 2026 + un plan prêt à l\'emploi.');
  const ctaLabel = isDemo ? 'Essayer gratuitement' : 'Recevoir le guide gratuit';
  const Icon = isDemo ? Sparkles : Gift;
  const badge = isDemo ? 'DÉMO GRATUITE' : 'GUIDE PDF GRATUIT';
  const fieldId = isDemo ? 'inline-demo-email' : 'inline-guide-email';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }
    setSubmitting(true);
    trackCaptureEvent(isDemo ? 'demo' : 'inline', 'click', { leadMagnet });
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
      trackFormSubmit(isDemo ? 'inline_demo_capture' : 'inline_lead_capture', email);
      trackLeadMagnetDownload(leadMagnet);
      trackCaptureEvent(isDemo ? 'demo' : 'inline', 'submit', { leadMagnet });
      setDone(true);
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
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary">{badge}</p>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">{resolvedTitle}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{resolvedSubtitle}</p>

        {done ? (
          <div className="flex items-start gap-2 text-primary font-semibold py-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              C’est envoyé ! Ouvrez votre boîte mail{' '}
              {isDemo ? 'pour accéder à la démonstration.' : 'pour récupérer votre guide.'}
            </span>
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
            <form onSubmit={handleSubmit} className="space-y-2">
              <label htmlFor={fieldId} className="block text-sm font-semibold text-foreground">
                {isDemo ? 'Votre email pour recevoir l’accès' : 'Où souhaitez-vous recevoir le guide ?'}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id={fieldId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-9 text-base h-12"
                    maxLength={255}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="font-bold h-12 px-6 whitespace-nowrap">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Envoi…
                    </span>
                  ) : (
                    ctaLabel
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                Gratuit · Aucune carte bancaire · Désinscription en 1 clic
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default InlineLeadCapture;
