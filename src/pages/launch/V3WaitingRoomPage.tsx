import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Crown, Clock, BookOpen, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import useLaunchSettings from '@/hooks/useLaunchSettings';

interface WaitlistRow {
  rank: number | null;
  plan: string | null;
  billing_interval: string | null;
  created_at: string;
}

const GIFTS = [
  {
    title: '10 niches Amazon à fort potentiel',
    text: 'Le pack de niches analysées, prêtes à publier — livré en PDF.',
    to: '/10-niches-offertes',
  },
  {
    title: 'Le kit de démarrage V3',
    text: '16 pages illustrées pour prendre le studio en main dès le 1er octobre.',
    to: '/v3/kit-demarrage',
  },
  {
    title: 'Le guide des avis clients',
    text: 'La marche à suivre pour obtenir vos premiers avis, sans enfreindre les règles.',
    to: '/v3/avis-clients',
  },
];

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  };
}

/** Salle d'attente des membres fondateurs, avant l'ouverture du 1er octobre 2026. */
export default function V3WaitingRoomPage() {
  const { settings, loading } = useLaunchSettings();
  const opensAt = settings.v3_open.opens_at ?? '2026-10-01T08:00:00+02:00';
  const cd = useCountdown(opensAt);

  const [row, setRow] = useState<WaitlistRow | null>(null);
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    document.title = 'Ma salle d’attente — membre fondateur EbookStudio V3';
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      setEmail(auth.user?.email ?? '');
      if (auth.user) {
        const { data } = await supabase
          .from('launch_waitlist')
          .select('rank, plan, billing_interval, created_at')
          .order('created_at', { ascending: true })
          .limit(1);
        if (data?.length) setRow(data[0] as WaitlistRow);
      }
      setChecking(false);
    })();
  }, []);

  const openNow = settings.v3_open.enabled || cd.done;
  const joined = useMemo(
    () => (row?.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : null),
    [row],
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="v3-serif text-lg font-bold text-[#2A2118]">
            EbookStudio
          </Link>
          {email && <span className="text-xs font-semibold text-[#5B5245]">{email}</span>}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <section className="rounded-2xl border-2 border-[#D4AF37]/40 bg-[#0F2E1F] p-8 text-white shadow-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            <Crown className="h-3.5 w-3.5" /> Membre fondateur
          </span>
          <h1 className="v3-serif mt-4 text-3xl font-bold leading-tight md:text-4xl">
            {openNow
              ? 'Votre studio est ouvert.'
              : 'Votre place est réservée. Le studio ouvre bientôt.'}
          </h1>

          {openNow ? (
            <Link
              to="/v3"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#2A2118] transition hover:brightness-110"
            >
              <BookOpen className="h-4 w-4" /> Entrer dans mon studio
            </Link>
          ) : (
            <>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                L'accès complet à EbookStudio V3 s'ouvre le 1<sup>er</sup> octobre 2026. Votre premier
                mois reste offert : la première facture tombe le 1<sup>er</sup> novembre 2026.
              </p>
              <div className="mt-6 grid max-w-lg grid-cols-4 gap-3">
                {[
                  { v: cd.days, l: 'jours' },
                  { v: cd.hours, l: 'heures' },
                  { v: cd.minutes, l: 'minutes' },
                  { v: cd.seconds, l: 'secondes' },
                ].map((b) => (
                  <div key={b.l} className="rounded-xl bg-white/10 p-3 text-center">
                    <p className="v3-serif text-2xl font-bold text-[#D4AF37]">
                      {String(b.v).padStart(2, '0')}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-white/60">{b.l}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-7 flex flex-wrap gap-6 border-t border-white/10 pt-5 text-sm">
            {checking || loading ? (
              <span className="flex items-center gap-2 text-white/70">
                <Loader2 className="h-4 w-4 animate-spin" /> Chargement de votre place…
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-[#D4AF37]" />
                  {row?.rank ? `Vous êtes le membre fondateur n° ${row.rank}` : 'Place confirmée'}
                </span>
                {row?.plan && (
                  <span className="flex items-center gap-2 text-white/80">
                    Forfait {row.plan} · {row.billing_interval === 'year' ? 'annuel' : 'mensuel'}
                  </span>
                )}
                {joined && (
                  <span className="flex items-center gap-2 text-white/60">
                    <Clock className="h-4 w-4" /> Inscrit le {joined}
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="v3-serif text-2xl font-bold text-[#2A2118]">
            Vos 3 cadeaux, disponibles dès maintenant
          </h2>
          <p className="mt-2 text-sm text-[#5B5245]">
            Pas besoin d'attendre l'ouverture : commencez à préparer votre livre aujourd'hui.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {GIFTS.map((g) => (
              <Link
                key={g.title}
                to={g.to}
                className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Gift className="h-5 w-5 text-[#8A6D1B]" />
                <h3 className="v3-serif mt-3 text-base font-bold text-[#2A2118]">{g.title}</h3>
                <p className="mt-1 text-sm text-[#5B5245]">{g.text}</p>
                <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-[#0F2E1F]">
                  Ouvrir →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="v3-serif flex items-center gap-2 text-lg font-bold text-[#2A2118]">
            <Mail className="h-4 w-4" /> Une question, un souci ?
          </h2>
          <p className="mt-2 text-sm text-[#5B5245]">
            Écrivez-moi directement à{' '}
            <a href="mailto:boubetgeorges@gmail.com" className="font-semibold text-[#0F2E1F] underline">
              boubetgeorges@gmail.com
            </a>
            . Je réponds personnellement à chaque membre fondateur.
          </p>
        </section>
      </main>
    </div>
  );
}
