import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Check, Mail, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import { trackFormSubmit, trackLeadMagnetDownload } from '@/utils/analytics';
import { trackCaptureEvent, type CaptureSurface } from '@/lib/captureTracking';
import {
  NICHES_10_LEAD_MAGNET,
  NICHES_10_PATH,
  rememberNiches10Email,
  readNiches10Email,
} from '@/lib/niches10Pack';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';

export const NICHES_10_HOOKS: Record<string, { title: string; subtitle: string }> = {
  commander: {
    title: "3 mois d'écriture pour 4 ventes ? Le problème n'était pas votre livre : c'était la niche.",
    subtitle: '10 niches KDP où la demande existe déjà — offertes, affichées immédiatement.',
  },
  popup: {
    title: 'Avant de partir : vos 10 niches où la demande existe déjà',
    subtitle: 'Affichées en 5 secondes, avec les mots-clés Amazon exacts. Gratuit, sans carte bancaire.',
  },
  signup: {
    title: 'Bienvenue. Commencez par une niche qui se vend déjà — voici les 10.',
    subtitle: 'Votre pack est prêt : mots-clés, BSR cible et niveau de concurrence pour chacune.',
  },
  v3: {
    title: 'Votre prochain livre mérite une niche validée',
    subtitle: '10 niches prêtes à écrire, incluses dans votre accès.',
  },
  default: {
    title: "Arrêtez d'écrire des livres que personne ne cherche.",
    subtitle:
      'Voici 10 niches KDP où la demande existe déjà — vérifiées, avec les mots-clés exacts. Offertes, affichées immédiatement.',
  },
};

const BULLETS = [
  '10 niches avec le mot-clé Amazon exact à viser',
  'BSR cible, niveau de concurrence et prix constaté',
  'Un bouton « Écrire ce livre » qui prépare votre projet',
];

interface Props {
  /** Surface de capture, utilisée pour le suivi et le choix de l'accroche. */
  surface: CaptureSurface;
  /** Clé d'accroche dans NICHES_10_HOOKS. */
  hook?: keyof typeof NICHES_10_HOOKS | string;
  variant?: 'hero' | 'compact' | 'popup';
  className?: string;
  /** Email déjà connu (abonné connecté) : le formulaire est remplacé par un bouton direct. */
  knownEmail?: string | null;
  onDone?: () => void;
}

/**
 * Bloc « 10 niches offertes ».
 * Le visiteur laisse son email et arrive IMMÉDIATEMENT sur la page cadeau interne
 * (plus d'attente d'un email, plus de redirection vers un site externe).
 */
const Niches10Offer: React.FC<Props> = ({
  surface,
  hook = 'default',
  variant = 'hero',
  className = '',
  knownEmail = null,
  onDone,
}) => {
  const navigate = useNavigate();
  const copy = NICHES_10_HOOKS[hook] || NICHES_10_HOOKS.default;
  const alreadyCaptured = knownEmail || readNiches10Email();
  const [email, setEmail] = useState(knownEmail || '');
  const [submitting, setSubmitting] = useState(false);

  const goToPack = () => {
    onDone?.();
    navigate(NICHES_10_PATH);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value.includes('@') || value.length > 255) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }
    setSubmitting(true);
    trackCaptureEvent(surface, 'click', { leadMagnet: NICHES_10_LEAD_MAGNET });
    try {
      const utm = getStoredUtm();
      await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: value,
          lead_magnet: NICHES_10_LEAD_MAGNET,
          ref_code: getStoredRefCode(),
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url:
            utm.landing_url || (typeof window !== 'undefined' ? window.location.href : null),
        },
      });
      trackFormSubmit(`niches10_${surface}`, value);
      trackLeadMagnetDownload(NICHES_10_LEAD_MAGNET);
      trackCaptureEvent(surface, 'submit', { leadMagnet: NICHES_10_LEAD_MAGNET });
    } catch {
      // La capture ne doit jamais bloquer l'accès au cadeau promis.
    } finally {
      rememberNiches10Email(value);
      setSubmitting(false);
      goToPack();
    }
  };

  const isCompact = variant === 'compact';

  return (
    <section
      className={`rounded-2xl border shadow-sm ${isCompact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'} ${className}`}
      style={{ background: '#fbfaf6', borderColor: `${GOLD}66` }}
      aria-labelledby={`niches10-title-${surface}`}
    >
      <div className="flex items-start gap-3">
        <Gift className={isCompact ? 'w-6 h-6 shrink-0' : 'w-8 h-8 shrink-0'} style={{ color: GOLD }} />
        <div className="min-w-0 flex-1">
          <p
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
            style={{ background: `${GOLD}22`, color: EMERALD }}
          >
            <Clock className="w-3 h-3" /> Cadeau · affiché immédiatement
          </p>
          <h2
            id={`niches10-title-${surface}`}
            className={`mt-2 font-bold leading-snug ${isCompact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}
            style={{ color: EMERALD }}
          >
            {copy.title}
          </h2>
          <p className={`mt-1.5 text-muted-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {copy.subtitle}
          </p>

          {!isCompact && (
            <ul className="mt-3 space-y-1.5">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: EMERALD }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {alreadyCaptured ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={goToPack}
                className="h-11 font-bold text-white"
                style={{ background: EMERALD }}
              >
                Voir mes 10 niches <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Déjà débloqué — consultable à vie.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
              <label htmlFor={`niches10-email-${surface}`} className="sr-only">
                Votre adresse email
              </label>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`niches10-email-${surface}`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  maxLength={255}
                  required
                  className="pl-9 h-12 text-base bg-background"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 font-bold text-white px-6"
                style={{ background: EMERALD }}
              >
                {submitting ? 'Ouverture…' : 'Voir mes 10 niches'}
                {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          )}

          <p className="mt-2 text-[11px] text-muted-foreground">
            Gratuit · sans carte bancaire · un livre publié dans une mauvaise niche, c'est 40 heures perdues.{' '}
            <Link to={NICHES_10_PATH} className="underline">
              Voir le pack
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Niches10Offer;
