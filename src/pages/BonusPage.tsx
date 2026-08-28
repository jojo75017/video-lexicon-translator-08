import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Clock, Gift, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BONUS_TOTAL_VALUE,
  LAUNCH_BONUSES,
  LAUNCH_OFFER,
} from '@/data/systemeioSequences';
import { commanderUrl } from '@/data/externalLinks';

/**
 * Page d'atterrissage unique de la séquence Systeme.io.
 * Un seul objectif : le visiteur voit ce qu'il reçoit, puis clique.
 */
export default function BonusPage() {
  const [params] = useSearchParams();
  const src = params.get('src') ?? 'bonus';

  useEffect(() => {
    document.title = 'Vos bonus offerts + dernière offre de lancement | EbookStudio';
    const desc = document.querySelector('meta[name="description"]');
    const content = `Recevez ${BONUS_TOTAL_VALUE} de bonus offerts et l'accès à vie à ${LAUNCH_OFFER.price} jusqu'au ${LAUNCH_OFFER.deadline}, V3 incluse d'office.`;
    if (desc) desc.setAttribute('content', content);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20">
      <section className="border-b border-[#008296]/20 bg-gradient-to-b from-white to-[#F3FAFA]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center">
          <Badge className="mb-5 rounded-full bg-[#008296] px-4 py-1 text-white hover:bg-[#008296]">
            <Clock className="mr-2 h-3.5 w-3.5" />
            Jusqu'au {LAUNCH_OFFER.deadline}
          </Badge>

          <h1 className="text-3xl font-bold leading-tight text-[#232F3E] md:text-4xl">
            Dernière offre de lancement : {LAUNCH_OFFER.price} une fois, à vie
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#232F3E]/80">
            La V3 sort le 1er octobre. Si vous prenez l'accès avant le {LAUNCH_OFFER.deadline},
            vous l'aurez <strong>d'office, incluse</strong>, sans rien payer de plus. Après cette
            date, l'entrée se fera uniquement par abonnement mensuel.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-[#008296] px-8 text-base font-semibold text-white hover:bg-[#00707f]"
            >
              <a href={commanderUrl(src)}>
                Prendre l'accès à vie à {LAUNCH_OFFER.price}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <span className="text-sm text-[#232F3E]/60">
              Paiement unique — carte ou PayPal
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#008296]">
            Inclus avec l'accès à vie
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#232F3E] md:text-3xl">
            {LAUNCH_BONUSES.length} bonus — {BONUS_TOTAL_VALUE} de valeur
          </h2>
          <p className="mt-3 text-[#232F3E]/70">
            Ces bonus ne sont pas vendus séparément et ne sont pas distribués en dehors de cette
            offre. Ils se débloquent dans votre espace dès que le paiement est validé.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {LAUNCH_BONUSES.map((bonus) => (
            <Card
              key={bonus.key}
              className="flex flex-col gap-3 rounded-2xl border-[#008296]/15 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#008296]/10 text-[#008296]">
                    <Gift className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-semibold text-[#232F3E]">{bonus.title}</h3>
                </div>
                <Badge variant="outline" className="shrink-0 border-[#FF9E2D] text-[#B4690E]">
                  {bonus.value}
                </Badge>
              </div>

              <p className="text-sm leading-relaxed text-[#232F3E]/75">{bonus.description}</p>

              <div className="mt-auto pt-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#232F3E]/55">
                  <Lock className="h-3.5 w-3.5" />
                  Débloqué après votre accès
                </span>
              </div>

            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-[#008296] text-base font-semibold text-white hover:bg-[#00707f]"
          >
            <a href={commanderUrl(src)}>
              Débloquer les {LAUNCH_BONUSES.length} bonus avec l'accès à {LAUNCH_OFFER.price}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>


      <section className="mx-auto max-w-3xl px-5">
        <Card className="rounded-2xl border-[#008296]/20 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#232F3E]">Ce que vous obtenez exactement</h2>
          <ul className="mt-5 space-y-3 text-[#232F3E]/85">
            {[
              `Accès à vie à EbookStudio pour ${LAUNCH_OFFER.price} une fois — aucun abonnement, aucune reconduction.`,
              "La V3 complète incluse d'office dès sa sortie le 1er octobre.",
              `Les ${LAUNCH_BONUSES.length} bonus ci-dessus, soit ${BONUS_TOTAL_VALUE} de valeur, débloqués dans votre espace dès le paiement validé.`,
              'Toutes les améliorations futures de votre palier, sans supplément.',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#008296]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            className="mt-8 w-full rounded-xl bg-[#008296] text-base font-semibold text-white hover:bg-[#00707f]"
          >
            <a href={commanderUrl(src)}>
              Je prends l'accès à vie avant le {LAUNCH_OFFER.deadline}
            </a>
          </Button>

          <p className="mt-4 text-center text-sm text-[#232F3E]/60">
            Après le {LAUNCH_OFFER.deadline}, l'offre à vie n'existe plus : EbookStudio passe en{' '}
            {LAUNCH_OFFER.afterOffer}, résiliable à tout moment.
          </p>

        </Card>
      </section>
    </main>
  );
}
