import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, ShieldCheck, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  V3_PLANS,
  formatPrice,
  getV3PriceId,
  getYearlySavingsAmount,
  type V3BillingInterval,
  type V3PlanId,
} from '@/data/v3Pricing';
import useLaunchSettings from '@/hooks/useLaunchSettings';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';

/**
 * Inscription du lancement : compte + forfait, premier mois offert.
 * La première facture tombe le 1er novembre 2026 ; l'accès au studio
 * s'ouvre le 1er octobre 2026 (salle d'attente en attendant).
 */
export default function EssaiInscriptionPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const trialId = params.get('trial') ?? undefined;
  const { settings } = useLaunchSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [planId, setPlanId] = useState<V3PlanId>('edition');
  const [interval, setInterval] = useState<V3BillingInterval>('month');
  const [creating, setCreating] = useState(false);
  const [accountReady, setAccountReady] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const plan = useMemo(() => V3_PLANS.find((p) => p.id === planId)!, [planId]);
  const firstMonthFree = settings.first_month_free_open.enabled && interval === 'month';

  useEffect(() => {
    document.title = 'Créer mon compte — premier mois offert | EbookStudio';
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setEmail(data.user.email);
        setAccountReady(true);
      }
    })();
  }, []);

  const createAccount = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Email invalide.');
      return;
    }
    if (password.length < 8) {
      toast.error('Choisissez un mot de passe de 8 caractères minimum.');
      return;
    }
    setCreating(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/v3/attente`,
          data: { first_name: firstName.trim() || null },
        },
      });
      if (error && !/already registered/i.test(error.message)) throw error;

      // Si le compte existait déjà, on ouvre simplement la session.
      if (error) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signInError) {
          toast.error('Ce compte existe déjà. Utilisez votre mot de passe habituel.');
          setCreating(false);
          return;
        }
      }

      setAccountReady(true);
      toast.success('Compte créé. Dernière étape : votre forfait.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Création du compte impossible.');
    } finally {
      setCreating(false);
    }
  };

  const startCheckout = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      toast.error('Créez d’abord votre compte.');
      return;
    }
    try {
      await supabase.functions.invoke('launch-waitlist-join', {
        body: { plan: planId, interval, trialChapterId: trialId, source: 'essai-chapitre-1' },
      });
    } catch {
      // La liste d'attente n'est pas bloquante pour le paiement.
    }
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/essai" className="v3-serif text-lg font-bold text-[#2A2118]">
            EbookStudio
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F2E1F]">
            Membre fondateur · ouverture le 1<sup>er</sup> octobre 2026
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[0.95fr_1.05fr] items-start">
        {/* Étape 1 : le compte */}
        <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <h1 className="v3-serif text-3xl font-bold leading-tight text-[#2A2118]">
            Écrivez la suite de votre livre
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5B5245]">
            Votre chapitre 1 est conservé. Créez votre compte, choisissez votre forfait :{' '}
            <strong>le premier mois est offert</strong> et la première facture tombe le 1
            <sup>er</sup> novembre 2026.
          </p>

          {accountReady ? (
            <p className="mt-6 flex items-center gap-2 rounded-xl bg-[#0F2E1F]/5 p-4 text-sm font-semibold text-[#0F2E1F]">
              <CheckCircle2 className="h-5 w-5" /> Compte prêt : {email}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-[#2A2118]">
                Prénom <span className="font-normal text-[#8A8072]">(facultatif)</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-[#2A2118]">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-[#2A2118]">
                Mot de passe
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                />
              </label>
              <button
                type="button"
                onClick={createAccount}
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2E1F] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#14532D] disabled:opacity-60"
              >
                {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                Créer mon compte
              </button>
            </div>
          )}

          <div className="mt-7 space-y-3 rounded-xl bg-[#FBF8F3] p-5 text-sm text-[#5B5245]">
            <p className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#0F2E1F]" />
              Résiliable en un clic pendant tout le mois offert, sans justification.
            </p>
            <p className="flex items-start gap-2">
              <Gift className="mt-0.5 h-4 w-4 flex-none text-[#8A6D1B]" />
              Vos 3 cadeaux de membre fondateur sont accessibles immédiatement, avant l'ouverture.
            </p>
          </div>
        </section>

        {/* Étape 2 : le forfait */}
        <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Votre forfait</h2>
            <div className="flex rounded-full border border-black/10 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInterval('month')}
                className={`rounded-full px-3 py-1.5 ${interval === 'month' ? 'bg-[#0F2E1F] text-white' : 'text-[#5B5245]'}`}
              >
                Mensuel
              </button>
              <button
                type="button"
                onClick={() => setInterval('year')}
                className={`rounded-full px-3 py-1.5 ${interval === 'year' ? 'bg-[#0F2E1F] text-white' : 'text-[#5B5245]'}`}
              >
                Annuel — 2 mois offerts
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {V3_PLANS.map((p) => {
              const selected = p.id === planId;
              const price = interval === 'month' ? p.monthlyPrice : p.yearlyPrice;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanId(p.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition ${
                    selected
                      ? 'border-[#0F2E1F] bg-[#0F2E1F]/5'
                      : 'border-black/10 hover:border-[#0F2E1F]/40'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="v3-serif text-lg font-bold text-[#2A2118]">{p.name}</span>
                    <span className="text-lg font-bold text-[#0F2E1F]">
                      {formatPrice(price)}
                      <span className="text-xs font-normal text-[#8A8072]">
                        {interval === 'month' ? ' / mois' : ' / an'}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#5B5245]">{p.tagline}</p>
                  {interval === 'year' && (
                    <p className="mt-1 text-xs font-semibold text-[#8A6D1B]">
                      Vous économisez {formatPrice(getYearlySavingsAmount(p))} par an.
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <ul className="mt-5 space-y-1.5 text-sm text-[#5B5245]">
            {plan.features.slice(0, 6).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#0F2E1F]" />
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={startCheckout}
            disabled={!accountReady}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-4 text-base font-bold text-[#2A2118] transition hover:brightness-110 disabled:opacity-50"
          >
            {firstMonthFree
              ? `Activer ${plan.name} — 1er mois offert`
              : `Activer ${plan.name} — ${formatPrice(interval === 'month' ? plan.monthlyPrice : plan.yearlyPrice)}`}
          </button>
          <p className="mt-3 text-center text-xs text-[#8A8072]">
            {firstMonthFree
              ? 'Aucun prélèvement aujourd’hui — première facture le 1er novembre 2026.'
              : 'Paiement sécurisé. Accès complet ouvert le 1er octobre 2026.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/v3/attente')}
            className="mt-3 w-full text-center text-xs font-semibold text-[#5B5245] underline"
          >
            Voir ma salle d'attente
          </button>
        </section>
      </main>

      {checkoutOpen && (
        <V3SubscribeCheckout
          priceId={getV3PriceId(planId, interval)}
          planName={plan.name}
          firstMonthFree={firstMonthFree}
          returnUrl={`${window.location.origin}/v3/attente?session_id={CHECKOUT_SESSION_ID}`}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
