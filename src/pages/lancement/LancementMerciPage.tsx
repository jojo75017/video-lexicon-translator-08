// Page de remerciement du tunnel de lancement — /lancement/merci
// Confirme le paiement côté serveur puis affiche l'accès et le code.
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, Copy, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { trackCaptureEvent } from '@/lib/captureTracking';

interface ConfirmResult {
  status: 'paid' | 'pending';
  email: string | null;
  plan?: string | null;
  planLabel?: string;
  accessCode?: string;
  emailSent?: boolean;
}

export default function LancementMerciPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const isPaypal = params.get('paypal') === '1';
  // PayPal renvoie l'identifiant d'abonnement ; on garde aussi celui mémorisé
  // au moment du clic pour ne jamais perdre la commande.
  const paypalSubId =
    params.get('subscription_id') ||
    (isPaypal ? localStorage.getItem('paypal_sub_id') : null);
  const canConfirm = Boolean(sessionId || paypalSubId);
  const [result, setResult] = useState<ConfirmResult | null>(null);
  const [loading, setLoading] = useState(canConfirm);
  const [failed, setFailed] = useState(false);
  const attempts = useRef(0);

  usePageMeta({ title: 'Merci — votre accès EbookStudio', noindex: true });

  const confirm = useCallback(async () => {
    if (!sessionId && !paypalSubId) return;
    try {
      const { data, error } = await supabase.functions.invoke('lancement-confirm', {
        body: sessionId ? { sessionId } : { subscriptionId: paypalSubId },
      });
      if (error) throw new Error(error.message);
      const res = data as ConfirmResult;
      setResult(res);
      if (res.status === 'paid') {
        setLoading(false);
        void trackCaptureEvent('lancement', 'paid');
        return;
      }
      // Paiement encore en cours de confirmation : nouvelle tentative.
      attempts.current += 1;
      if (attempts.current < 6) {
        setTimeout(() => void confirm(), 3000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Confirmation lancement:', (err as Error).message);
      setFailed(true);
      setLoading(false);
    }
  }, [sessionId, paypalSubId]);

  useEffect(() => {
    void confirm();
  }, [confirm]);

  const copyCode = () => {
    if (!result?.accessCode) return;
    void navigator.clipboard.writeText(result.accessCode);
    toast.success('Code copié.');
  };

  const paid = result?.status === 'paid';

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="mx-auto max-w-2xl px-4 py-16">
        {loading && (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="mt-5 text-2xl font-bold">Nous confirmons votre paiement…</h1>
            <p className="mt-2 text-muted-foreground">
              Merci de rester sur cette page quelques secondes.
            </p>
          </div>
        )}

        {!loading && paid && (
          <div className="rounded-2xl border bg-card p-8">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h1 className="mt-5 text-3xl font-bold">Bienvenue, votre accès est ouvert !</h1>
            <p className="mt-3 text-muted-foreground">
              Paiement confirmé : <strong>{result?.planLabel}</strong>. Un email vient de partir vers{' '}
              <strong>{result?.email}</strong> avec votre code d'accès.
            </p>

            {result?.accessCode && (
              <div className="mt-6 rounded-xl border bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">Votre code d'accès personnel</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-bold tracking-widest text-primary">
                    {result.accessCode}
                  </span>
                  <Button size="sm" variant="outline" onClick={copyCode}>
                    <Copy className="mr-2 h-4 w-4" />Copier
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Conservez ce code : il vous permet de retrouver votre accès à tout moment.
                </p>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <Button size="lg" className="w-full" asChild>
                <Link to="/connexion-abonne">Ouvrir mon espace</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link to="/v3">Découvrir l'atelier</Link>
              </Button>
            </div>

            {result?.emailSent === false && (
              <p className="mt-6 flex items-start gap-2 rounded-lg border bg-muted/40 p-4 text-sm">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                L'email n'a pas pu partir. Notez votre code ci-dessus : votre accès est bien ouvert.
              </p>
            )}
          </div>
        )}

        {!loading && !paid && (
          <div className="rounded-2xl border bg-card p-8">
            <Clock className="h-12 w-12 text-primary" />
            <h1 className="mt-5 text-2xl font-bold">
              {isPaypal ? 'Paiement PayPal en cours de validation' : 'Paiement en attente de confirmation'}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {failed
                ? 'Nous n’avons pas pu vérifier votre paiement à l’instant.'
                : 'Votre banque ou votre moyen de paiement n’a pas encore confirmé l’opération.'}{' '}
              Dès qu’il est confirmé, votre accès s’ouvre automatiquement et vous recevez votre code
              par email.
            </p>
            <div className="mt-8 space-y-3">
              <Button size="lg" className="w-full" onClick={() => { attempts.current = 0; setFailed(false); setLoading(true); void confirm(); }} disabled={!canConfirm}>
                Vérifier à nouveau
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link to="/lancement/offres">Revenir aux offres</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Une question ? Écrivez-nous et nous vérifions votre commande nous-mêmes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
