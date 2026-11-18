import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { Image, Loader2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useModuleAccess from '@/hooks/useModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { stripeThankYouUrl } from '@/lib/paymentReturnUrl';

export default function MockupStudioAccess() {
  const { hasAccess, loading, reason } = useModuleAccess('mockup-3d');
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const buy = async () => {
    setBusy(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user?.email) throw new Error('Connectez-vous pour acquérir le studio sur votre compte.');
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', { body: {
        packId: 'mockup_3d', email: auth.user.email, environment: getStripeEnvironment(),
        returnUrl: stripeThankYouUrl(window.location.origin, 'Studio Mockups 3D'),
      } });
      if (error || data?.error) throw new Error(data?.error || 'Le paiement ne peut pas être ouvert pour le moment.');
      if (!data?.clientSecret) throw new Error('Le formulaire de paiement est indisponible.');
      setSecret(data.clientSecret);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Paiement indisponible.');
    } finally { setBusy(false); }
  };
  return <>
    <section aria-label="Studio Mockups 3D" className="my-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-5">
      <div className="flex items-start gap-3">
        <Image className="mt-1 h-6 w-6 shrink-0 text-primary" />
        <div><h2 className="text-lg font-semibold">Studio Mockups 3D · 5 modèles</h2>
          <p className="mt-1 text-sm text-muted-foreground">{loading ? 'Vérification de votre accès…' : hasAccess
            ? reason === 'admin' ? 'Accès administrateur' : reason === 'purchased' ? 'Votre studio est acquis' : 'Inclus dans votre formule Édition'
            : '27 € en paiement unique · accès à vie · inclus avec Édition 59 €/mois'}</p></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant={hasAccess ? 'default' : 'outline'}><Link to="/v3/outils/mockup-3d"><Image className="mr-2 h-4 w-4" />{hasAccess ? 'Ouvrir mon studio' : 'Voir les modèles'}</Link></Button>
        {!loading && !hasAccess && <Button onClick={() => void buy()} disabled={busy}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}Acquérir le studio · 27 €</Button>}
      </div>
    </section>
    <Dialog open={!!secret} onOpenChange={(open) => { if (!open) setSecret(null); }}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>Studio Mockups 3D · 27 € · paiement unique</DialogTitle></DialogHeader>
        {secret && <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret: secret }}><EmbeddedCheckout /></EmbeddedCheckoutProvider>}
      </DialogContent>
    </Dialog>
  </>;
}