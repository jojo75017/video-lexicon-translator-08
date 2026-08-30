import { useEffect, useMemo, useState } from 'react';
import Helmet from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Clock, Gift, Loader2, Lock, ShieldCheck, Sparkles, TrendingUp,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useReferralTracking, getStoredRefCode } from '@/hooks/useReferralTracking';
import {
  trackFormError, trackFormSubmit, trackLeadFormClick, trackLeadMagnetDownload,
  trackPageView, trackSignUp,
} from '@/utils/analytics';
import { getNiches5Pack, rememberNiches5Email, readNiches5Email, NICHES_5_LEAD_MAGNET } from '@/lib/nichesPack5';
import { CAMPAGNE, CAMPAGNE_BONUSES, BONUS_TOTAL_VALUE } from '@/data/campagneUnique';
import { commanderUrl } from '@/data/externalLinks';

const TEAL = '#008296';
const INK = '#232F3E';
const OFFER_END = new Date('2026-09-30T23:59:59+02:00');

function useCountdown(target: Date) {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left <= 0) return null;
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor((left % 86_400_000) / 3_600_000),
    minutes: Math.floor((left % 3_600_000) / 60_000),
  };
}

/**
 * Page cadeau — le seul lien des emails.
 * Les 5 niches sont visibles tout de suite, l'inscription débloque les bonus,
 * et le seul appel à l'action payant est le bouton « Commander ».
 */
export default function CadeauPage() {
  useReferralTracking();
  const [params] = useSearchParams();
  const src = params.get('src') || 'cadeau';
  const niches = useMemo(() => getNiches5Pack(), []);
  const countdown = useCountdown(OFFER_END);

  const [email, setEmail] = useState(() => (params.get('email') || '').trim().toLowerCase());
  const [firstName, setFirstName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(() => Boolean(readNiches5Email()));

  useEffect(() => {
    trackPageView('/cadeau', 'Page cadeau — 5 niches + bonus');
  }, []);

  const commander = commanderUrl(src);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    trackLeadFormClick('cadeau_5_niches', 'page_cadeau');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      trackFormError('cadeau_5_niches', 'email_invalide');
      toast.error('Merci d\'entrer un email valide.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: value,
          first_name: firstName.trim() || undefined,
          lead_magnet: NICHES_5_LEAD_MAGNET,
          landing_url: window.location.href,
          ref_code: getStoredRefCode() || undefined,
        },
      });
      if (error) throw error;
      rememberNiches5Email(value);
      trackLeadMagnetDownload(NICHES_5_LEAD_MAGNET);
      trackFormSubmit('cadeau_5_niches', value);
      trackSignUp('page_cadeau', NICHES_5_LEAD_MAGNET);
      setUnlocked(true);
      toast.success('Vos bonus sont débloqués juste en dessous.');
      setTimeout(() => {
        document.getElementById('bonus')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error(err);
      trackFormError('cadeau_5_niches', 'erreur_serveur');
      toast.error('Erreur, réessayez dans un instant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24" style={{ color: INK }}>
      <Helmet>
        <title>5 niches Amazon KDP rentables offertes | EbookStudio</title>
        <meta
          name="description"
          content="Découvrez 5 niches Amazon KDP à forte demande avec le mot-clé exact à viser, puis débloquez vos bonus gratuitement. Sans carte bancaire."
        />
        <link rel="canonical" href="https://ebookstudio.fr/cadeau" />
      </Helmet>

      {/* Barre discrète : le seul bouton payant, toujours accessible */}
      <div className="sticky top-0 z-30 border-b border-[#008296]/20 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-2.5">
          <span className="text-sm font-semibold">
            Accès à vie {CAMPAGNE.price} — jusqu'au {CAMPAGNE.deadline}
          </span>
          <Button asChild size="sm" className="rounded-xl bg-[#FF9E2D] font-bold text-[#232F3E] hover:bg-[#f59015]">
            <a href={commander}>Commander</a>
          </Button>
        </div>
      </div>

      {/* 1. Les 5 niches, immédiatement */}
      <section className="mx-auto max-w-5xl px-5 pt-12">
        <Badge className="rounded-full bg-[#008296] px-4 py-1 text-white hover:bg-[#008296]">
          <Gift className="mr-2 h-3.5 w-3.5" /> Votre cadeau, sans rien télécharger
        </Badge>
        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
          Vos 5 niches Amazon où la demande existe déjà
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#232F3E]/75">
          Pour chaque niche : le sujet exact, le mot-clé Amazon à viser, le niveau de concurrence
          et le prix constaté. Extraites de notre base de 600 niches réelles.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {niches.map((n, i) => (
            <Card key={n.id} className="rounded-2xl border-[#008296]/15 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#008296]">
                    Niche n°{i + 1} · {n.categoryLabel}
                  </p>
                  <h2 className="mt-1.5 text-lg font-bold">{n.niche}</h2>
                </div>
                <Badge variant="outline" className="shrink-0 border-[#FF9E2D] text-[#B4690E]">
                  Potentiel {n.potentiel}/5
                </Badge>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#232F3E]/60">Mot-clé Amazon</dt>
                  <dd className="text-right font-semibold">{n.motCleAmazon}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#232F3E]/60">Concurrence</dt>
                  <dd className="text-right font-semibold">{n.concurrence}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#232F3E]/60">BSR cible</dt>
                  <dd className="text-right font-semibold">{n.bsrCible.toLocaleString('fr-FR')}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#232F3E]/60">Prix constaté</dt>
                  <dd className="text-right font-semibold">{n.exemplePrix.toFixed(2)} €</dd>
                </div>
              </dl>

              <p className="mt-4 rounded-xl bg-[#F3FAFA] p-3 text-sm text-[#232F3E]/80">
                <TrendingUp className="mr-1.5 inline h-4 w-4 text-[#008296]" />
                {n.angle}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Ce que vous pouvez en faire ce soir */}
      <section className="mx-auto mt-16 max-w-5xl px-5">
        <div className="rounded-3xl border border-[#008296]/20 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#008296]">
            Ce que vous pouvez en faire ce soir
          </p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            La même niche transformée en livre prêt pour Amazon
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              'Le Sommaire IA construit le plan chapitre par chapitre à partir de la niche choisie.',
              'La rédaction se fait chapitre par chapitre, en tenant compte des précédents.',
              'La correction professionnelle relit tout : répétitions, incohérences, fins de chapitres.',
              'L\'export sort un Word et un PDF conformes aux exigences d\'Amazon KDP.',
              'La couverture est recadrée aux dimensions exactes d\'Amazon, aucun fichier refusé.',
              'La fiche Amazon est prête : titre, description, mots-clés, catégories.',
            ].map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-[#232F3E]/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#008296]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Le formulaire qui débloque les bonus */}
      <section id="bonus" className="mx-auto mt-16 max-w-3xl px-5">
        <Card className="rounded-3xl border-[#008296]/25 bg-white p-8 shadow-sm">
          {!unlocked ? (
            <>
              <h2 className="text-2xl font-bold">Débloquez vos bonus maintenant</h2>
              <p className="mt-3 text-[#232F3E]/75">
                Laissez votre email : les {CAMPAGNE_BONUSES.length} bonus ({BONUS_TOTAL_VALUE} de valeur)
                s'ouvrent immédiatement sur cette page, et vous recevez vos 5 niches par email.
                Sans carte bancaire, désabonnement en un clic.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  className="h-12 rounded-xl"
                  autoComplete="given-name"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.fr"
                  className="h-12 rounded-xl"
                  autoComplete="email"
                  required
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 rounded-xl bg-[#008296] px-6 font-bold text-white hover:bg-[#00707f]"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Débloquer'}
                </Button>
              </form>
              <div className="mt-5 grid gap-2">
                {CAMPAGNE_BONUSES.map((b) => (
                  <p key={b.key} className="flex items-center gap-2 text-sm text-[#232F3E]/70">
                    <Lock className="h-3.5 w-3.5" />
                    <span className="font-semibold">{b.title}</span>
                    <span className="text-[#232F3E]/50">— {b.value}</span>
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <Badge className="rounded-full bg-[#008296] text-white hover:bg-[#008296]">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Bonus débloqués
              </Badge>
              <h2 className="mt-4 text-2xl font-bold">Vos {CAMPAGNE_BONUSES.length} bonus sont ouverts</h2>
              <p className="mt-2 text-[#232F3E]/75">
                Tout est accessible maintenant. Vos 5 niches restent affichées plus haut sur cette page.
              </p>
              <div className="mt-6 grid gap-3">
                {CAMPAGNE_BONUSES.map((b) => (
                  <div
                    key={b.key}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#008296]/15 p-4"
                  >
                    <div className="min-w-[200px] flex-1">
                      <p className="font-semibold">{b.title}</p>
                      <p className="text-sm text-[#232F3E]/70">{b.description}</p>
                    </div>
                    {b.download ? (
                      <Button asChild variant="outline" className="rounded-xl border-[#008296] text-[#008296]">
                        <a href={b.to} target="_blank" rel="noopener noreferrer">Télécharger</a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="rounded-xl border-[#008296] text-[#008296]">
                        <Link to={b.to}>Ouvrir</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </section>

      {/* 4. L'offre — le seul bouton payant */}
      <section className="mx-auto mt-16 max-w-3xl px-5">
        <Card className="rounded-3xl border-2 border-[#FF9E2D]/60 bg-white p-8 text-center shadow-sm">
          {countdown && (
            <p className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E3] px-4 py-1.5 text-sm font-bold text-[#B4690E]">
              <Clock className="h-4 w-4" />
              Il reste {countdown.days} j {countdown.hours} h {countdown.minutes} min
            </p>
          )}
          <h2 className="mt-5 text-2xl font-bold md:text-3xl">
            Écrivez ce livre : {CAMPAGNE.price} une fois, accès à vie
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#232F3E]/75">
            Un seul paiement, aucune reconduction. Après le {CAMPAGNE.deadline}, EbookStudio passe en{' '}
            {CAMPAGNE.afterOffer}.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-7 rounded-xl bg-[#FF9E2D] px-10 text-base font-black text-[#232F3E] hover:bg-[#f59015]"
          >
            <a href={commander}>
              Commander — {CAMPAGNE.price} <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#232F3E]/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Garantie 30 jours
            </span>
            <span>Carte bancaire ou PayPal</span>
            <span>Accès immédiat</span>
          </p>
        </Card>
      </section>
    </main>
  );
}
