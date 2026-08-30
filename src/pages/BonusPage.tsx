import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Clock, Gift, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CAMPAGNE, CAMPAGNE_BONUSES, BONUS_TOTAL_VALUE } from '@/data/campagneUnique';
import { commanderUrl } from '@/data/externalLinks';
import { readNiches5Email, rememberNiches5Email } from '@/lib/nichesPack5';

/**
 * Page des bonus.
 * Les bonus sont la récompense de l'inscription : ils s'ouvrent dès qu'un email
 * est inscrit (mémorisé localement ou passé dans le lien de l'email).
 * Le seul appel à l'action payant reste le bouton « Commander ».
 */
export default function BonusPage() {
  const [params] = useSearchParams();
  const src = params.get('src') ?? 'bonus';
  const emailParam = (params.get('email') || '').trim().toLowerCase();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (emailParam && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailParam)) {
      rememberNiches5Email(emailParam);
      setUnlocked(true);
      return;
    }
    setUnlocked(Boolean(readNiches5Email()));
  }, [emailParam]);

  useEffect(() => {
    document.title = 'Vos bonus offerts | EbookStudio';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        'content',
        `${CAMPAGNE_BONUSES.length} bonus offerts (${BONUS_TOTAL_VALUE} de valeur) débloqués dès votre inscription, puis l'accès à vie à ${CAMPAGNE.price} jusqu'au ${CAMPAGNE.deadline}.`,
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20 text-[#232F3E]">
      <section className="border-b border-[#008296]/20 bg-gradient-to-b from-white to-[#F3FAFA]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center">
          <Badge className="mb-5 rounded-full bg-[#008296] px-4 py-1 text-white hover:bg-[#008296]">
            <Gift className="mr-2 h-3.5 w-3.5" />
            {CAMPAGNE_BONUSES.length} bonus — {BONUS_TOTAL_VALUE} de valeur
          </Badge>

          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {unlocked ? 'Vos bonus sont ouverts' : 'Vos bonus vous attendent'}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#232F3E]/80">
            {unlocked
              ? 'Tout est accessible ci-dessous, sans rien acheter. Quand vous voudrez écrire votre livre, l\'atelier complet est à un clic.'
              : 'Ils se débloquent dès votre inscription sur la page cadeau, en même temps que vos 5 niches Amazon.'}
          </p>

          {!unlocked && (
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-xl bg-[#008296] px-8 text-base font-semibold text-white hover:bg-[#00707f]"
            >
              <Link to="/cadeau">
                Voir mes 5 niches et débloquer mes bonus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {CAMPAGNE_BONUSES.map((bonus) => (
            <Card
              key={bonus.key}
              className="flex flex-col gap-3 rounded-2xl border-[#008296]/15 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#008296]/10 text-[#008296]">
                    <Gift className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-semibold">{bonus.title}</h2>
                </div>
                <Badge variant="outline" className="shrink-0 border-[#FF9E2D] text-[#B4690E]">
                  {bonus.value}
                </Badge>
              </div>

              <p className="text-sm leading-relaxed text-[#232F3E]/75">{bonus.description}</p>

              <div className="mt-auto pt-2">
                {unlocked ? (
                  bonus.download ? (
                    <Button asChild variant="outline" className="rounded-xl border-[#008296] text-[#008296]">
                      <a href={bonus.to} target="_blank" rel="noopener noreferrer">
                        <Check className="mr-2 h-4 w-4" /> Télécharger
                      </a>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="rounded-xl border-[#008296] text-[#008296]">
                      <Link to={bonus.to}>
                        <Check className="mr-2 h-4 w-4" /> Ouvrir
                      </Link>
                    </Button>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#232F3E]/55">
                    <Lock className="h-3.5 w-3.5" /> Débloqué à l'inscription
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5">
        <Card className="rounded-3xl border-2 border-[#FF9E2D]/60 bg-white p-8 text-center shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E3] px-4 py-1.5 text-sm font-bold text-[#B4690E]">
            <Clock className="h-4 w-4" /> Jusqu'au {CAMPAGNE.deadline}
          </p>
          <h2 className="mt-5 text-2xl font-bold md:text-3xl">
            L'atelier complet : {CAMPAGNE.price} une fois, à vie
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#232F3E]/75">
            Sommaire IA, rédaction chapitre par chapitre, correction professionnelle, exports Word et
            PDF aux normes KDP, couvertures aux dimensions Amazon, fiche produit. Un seul paiement,
            aucune reconduction. Ensuite : {CAMPAGNE.afterOffer}.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-7 rounded-xl bg-[#FF9E2D] px-10 text-base font-black text-[#232F3E] hover:bg-[#f59015]"
          >
            <a href={commanderUrl(src)}>
              Commander — {CAMPAGNE.price} <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#232F3E]/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Garantie 30 jours
            </span>
            <span>Carte bancaire ou PayPal</span>
          </p>
        </Card>
      </section>
    </main>
  );
}
