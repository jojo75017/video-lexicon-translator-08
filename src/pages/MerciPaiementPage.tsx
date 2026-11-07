import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Mail,
  Loader2,
  ArrowRight,
  Phone,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import SeoHead from '@/components/funnel/SeoHead';

const BOOKING_URL = 'https://calendly.com/pro-georgesboubet/30min';
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);
const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 12;

/**
 * Page de remerciement affichée dès le retour de Stripe (return_url).
 * Elle n'invente aucun statut : elle vérifie en base, pour le compte
 * connecté, si l'accès vient bien d'être activé.
 */
export default function MerciPaiementPage() {
  const [params] = useSearchParams();
  const planLabel = params.get('plan') ?? '';

  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessActive, setAccessActive] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const polls = useRef(0);

  const checkAccess = useCallback(async () => {
    polls.current += 1;
    setAttempts(polls.current);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoggedIn(false);
        setChecking(false);
        return;
      }
      setLoggedIn(true);
      const env = getStripeEnvironment();
      const { data } = await supabase.rpc('get_my_v3_installment_orders');
      const paid = (data ?? []).some(
        (row: any) =>
          row.environment === env &&
          PAID_STATUSES.has(String(row.status ?? '').toLowerCase()),
      );
      if (paid) {
        setAccessActive(true);
        setChecking(false);
        return;
      }
    } catch {
      // Le statut reste « en cours » : rien n'est affirmé sans preuve.
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    void checkAccess();
    const timer = setInterval(() => {
      if (polls.current >= MAX_POLLS) {
        clearInterval(timer);
        return;
      }
      void checkAccess();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [checkAccess]);

  const waiting = !accessActive && polls.current < MAX_POLLS;

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-14">
      <SeoHead
        title={accessActive ? 'Merci ! Votre accès V3 est actif' : 'Merci — vérification de votre accès V3'}
        description="Retrouvez les étapes après paiement : confirmation, activation de votre accès et réception du code personnel par email."
        canonical="/merci"
        noindex
      />

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-[#008296] mx-auto" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#232F3E]">
            {accessActive ? 'Merci, votre accès est actif ! 🎉' : 'Merci, bienvenue sur EbookStudio V3'}
          </h1>
          {planLabel ? (
            <p className="text-lg text-[#232F3E]/80">
              Formule <strong>{planLabel}</strong>
            </p>
          ) : null}
          <p className="text-[#232F3E]/80 max-w-xl mx-auto">
            Après confirmation de votre paiement, votre code d'accès personnel est envoyé par email.
            Une visite de cette page ne confirme pas un paiement. Vérifiez vos indésirables si vous ne voyez pas le message.
          </p>
        </div>

        <Card className="border-[#008296]/30 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              {accessActive ? (
                <CheckCircle2 className="w-6 h-6 text-[#008296] shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="w-6 h-6 text-[#008296] animate-spin shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#232F3E]">
                  {accessActive
                    ? 'Votre accès est activé'
                    : checking
                      ? 'Activation de votre accès…'
                      : waiting
                        ? "Votre accès est en cours d'activation"
                        : 'Votre accès arrive encore'}
                </h2>
                <p className="text-sm text-[#232F3E]/75">
                  {accessActive
                    ? 'Ouvrez votre atelier : les outils disponibles de votre formule vous attendent.'
                    : loggedIn
                      ? 'Cette vérification se fait toute seule, sans recharger la page. Gardez simplement cet onglet ouvert.'
                      : 'Vous n\'êtes pas connecté ici : ouvrez votre email et utilisez le code reçu pour entrer dans votre espace.'}
                </p>
              </div>
            </div>

            {accessActive ? (
              <Button
                asChild
                className="w-full bg-[#008296] hover:bg-[#006d7e] text-white font-bold py-6"
              >
                <Link to="/v3">
                  Ouvrir mon atelier
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            ) : loggedIn ? (
              <Button
                variant="outline"
                onClick={() => void checkAccess()}
                className="w-full border-[#008296] text-[#008296] font-semibold"
              >
                <Loader2 className="w-4 h-4 mr-2" />
                Vérifier à nouveau
              </Button>
            ) : (
              <Button
                asChild
                className="w-full bg-[#008296] hover:bg-[#006d7e] text-white font-bold py-6"
              >
                <Link to="/connexion-abonne">
                  <Mail className="w-5 h-5 mr-2" />
                  me connecter avec mon code
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-[#232F3E] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF9E2D]" />
            Les ressources incluses avec votre abonnement actif
          </h2>
          <ul className="text-sm text-[#232F3E]/80 space-y-2 list-disc pl-5">
            <li>Vos livres, vos couvertures et vos traductions dans un seul atelier.</li>
            <li>Les guides de vos 25 tutoriels ; les vidéos non encore publiées sont annoncées à venir prochainement.</li>
            <li>Avec votre abonnement actif, un appel de 30 minutes inclus avec Georges, sur réservation et selon les disponibilités.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-[#FF9E2D] text-[#232F3E] hover:bg-[#FF9E2D]/10"
          >
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <Phone className="w-4 h-4 mr-2" />
              Réserver mon appel de 30 min
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-[#008296] text-[#008296] hover:bg-[#008296]/10"
          >
            <Link to="/assistance">
              <LifeBuoy className="w-4 h-4 mr-2" />
              Une question&nbsp;? Assistance
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="ghost"
            className="text-[#008296] font-semibold"
          >
            <Link to="/v3">
              Aller directement à mon espace V3
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-[#232F3E]/60">
          Vous avez payé sans être connecté&nbsp;? Après confirmation du paiement, le code est envoyé à l'adresse
          indiquée dans Stripe. Écrivez-nous depuis l'assistance si rien
          n'arrive d'ici une heure.
        </p>
      </div>
    </div>
  );
}
