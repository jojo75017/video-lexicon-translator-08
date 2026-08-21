import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Gift, Loader2, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import {
  NICHES_10_LEAD_MAGNET,
  NICHES_10_PATH,
  rememberNiches10Email,
  readNiches10Email,
} from '@/lib/niches10Pack';

const READER_KEY = 'ebs_reader_unlocked';

const schema = z.object({
  first_name: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Email invalide').max(255),
});

/** Suivi discret des déblocages (table capture_events, page_path = surface). */
async function trackGate(eventType: 'reading_gate_view' | 'reading_gate_unlock', surface: string) {
  try {
    if (typeof window === 'undefined') return;
    const utm = getStoredUtm();
    await supabase.from('capture_events').insert({
      event_type: eventType,
      surface: 'inline',
      lead_magnet: NICHES_10_LEAD_MAGNET,
      ab_variant: null,
      utm_source: utm.utm_source || surface,
      utm_medium: 'reading-gate',
      utm_campaign: surface,
      page_path: window.location.pathname,
    });
  } catch {
    // silencieux
  }
}

function readUnlocked(): boolean {
  try {
    if (localStorage.getItem(READER_KEY) === '1') return true;
    if (readNiches10Email()) return true;
    if (localStorage.getItem('ebs_lead_email')) return true;
  } catch {
    // navigation privée
  }
  return false;
}

interface ReadingGateProps {
  /** Nom de la surface pour le suivi (v3, methode, fiche-histoire…). */
  surface: string;
  /** Contenu verrouillé : aperçu flouté puis débloqué après l'email. */
  children: ReactNode;
  /**
   * compact = verrouille un simple bouton (fiches) : pas d'aperçu flouté du
   * contenu, juste une carte de capture à la place du bouton.
   */
  compact?: boolean;
  /** Accroche de la carte de capture. */
  title?: string;
}

/**
 * Verrou de lecture : le visiteur lit le début, laisse son email pour
 * débloquer la suite (et reçoit le pack 10 niches), puis finit de lire.
 *
 * Ne s'affiche JAMAIS pour :
 * - un visiteur qui a déjà laissé son email (localStorage) ;
 * - un visiteur arrivant d'un email (?email=…) ;
 * - un utilisateur connecté / abonné / admin ;
 * - une relecture avec ?apercu=1.
 */
export default function ReadingGate({ surface, children, compact = false, title }: ReadingGateProps) {
  const [params] = useSearchParams();
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (params.get('apercu') === '1') return true;
    if (params.get('email')) return true; // vient d'un de nos emails
    return readUnlocked();
  });
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [loading, setLoading] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Utilisateur connecté / abonné / admin : jamais de verrou.
  useEffect(() => {
    if (unlocked) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) setUnlocked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  // Mémorise l'email venu d'une campagne pour ne jamais reverrouiller.
  useEffect(() => {
    const fromEmail = params.get('email');
    if (fromEmail) {
      try {
        localStorage.setItem(READER_KEY, '1');
        localStorage.setItem('ebs_lead_email', fromEmail);
      } catch {
        // silencieux
      }
    }
  }, [params]);

  useEffect(() => {
    if (!unlocked) void trackGate('reading_gate_view', surface);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface]);

  if (unlocked) {
    return (
      <>
        {justUnlocked && (
          <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-[#c9a84c]/50 bg-white px-5 py-4 text-center shadow-sm">
            <Gift className="h-5 w-5 shrink-0 text-[#8a6d1f]" />
            <p className="text-sm text-[#5B5245]">
              <strong className="text-[#2A2118]">Bonne lecture !</strong> Votre cadeau vous attend :
              le pack des 10 niches qui se vendent déjà.
            </p>
            <Link
              to={NICHES_10_PATH}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#064e3b] px-4 py-2 text-[13px] font-bold text-white transition hover:brightness-110"
            >
              Recevoir le pack <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
        {children}
      </>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ first_name: firstName, email });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      const utm = getStoredUtm();
      const { error } = await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: parsed.data.email,
          first_name: parsed.data.first_name,
          ref_code: getStoredRefCode(),
          lead_magnet: NICHES_10_LEAD_MAGNET,
          website,
          landing_url: window.location.href,
          utm_source: utm.utm_source || surface,
          utm_medium: utm.utm_medium || 'reading-gate',
          utm_campaign: utm.utm_campaign || surface,
        },
      });
      if (error) throw error;
      rememberNiches10Email(parsed.data.email);
      try {
        localStorage.setItem(READER_KEY, '1');
        localStorage.setItem('ebs_lead_email', parsed.data.email.trim().toLowerCase());
      } catch {
        // silencieux
      }
      void trackGate('reading_gate_unlock', surface);
      setJustUnlocked(true);
      setUnlocked(true);
    } catch (err) {
      console.error('ReadingGate capture error', err);
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <div className="relative z-10 mx-auto w-full max-w-xl rounded-3xl border-2 border-[#c9a84c]/50 bg-white p-6 shadow-xl md:p-8">
      <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a6d1f]">
        <Lock className="h-3.5 w-3.5" /> Lecture offerte
      </div>
      <h3 className="v3-serif mt-3 text-center text-2xl font-bold leading-snug text-[#2A2118]">
        {title ?? 'La suite de la lecture est offerte'}
      </h3>
      <p className="mt-2 text-center text-sm leading-relaxed text-[#5B5245]">
        Laissez votre email pour continuer la lecture immédiatement — et recevez en cadeau le
        pack des <strong className="text-[#2A2118]">10 niches qui se vendent déjà</strong> sur
        Amazon (mots-clés exacts inclus).
      </p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input
          type="text"
          placeholder="Votre prénom (optionnel)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={80}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#c9a84c]"
        />
        <input
          type="email"
          required
          placeholder="Votre meilleur email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#c9a84c]"
        />
        {/* honeypot anti-bot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF9E2D] px-6 py-4 text-base font-bold text-[#2A2118] transition hover:brightness-105 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Débloquer la suite + mon cadeau'}
        </button>
        <p className="text-center text-xs text-gray-500">
          Pas de spam. Désinscription en 1 clic.
        </p>
      </form>
    </div>
  );

  if (compact) {
    // Mode fiche : le bouton final est remplacé par la carte de capture.
    return <div className="mt-8">{card}</div>;
  }

  return (
    <div className="relative">
      {/* Aperçu flouté du contenu verrouillé */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{ maxHeight: 240, overflow: 'hidden', filter: 'blur(7px)', opacity: 0.5 }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[240px]"
        style={{ background: 'linear-gradient(180deg, rgba(251,248,243,0) 0%, rgba(251,248,243,0.92) 75%, #FBF8F3 100%)' }}
      />
      <div className="relative z-10 -mt-24 px-5 pb-4">{card}</div>
    </div>
  );
}
