import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const PAYPAL_URL = 'https://paypal.me/ebookstudio/67';

const PromoPaiementPage = () => {
  const [params] = useSearchParams();
  const [order, setOrder] = useState<{ id: string; amount: number; payment_method: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const email = (params.get('email') || localStorage.getItem('ebs_lead_email') || '').toLowerCase();
      if (!email) { setLoading(false); return; }
      const { data } = await supabase.rpc('get_my_funnel_orders');
      const rows = ((data as any[]) || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      if (rows.length > 0) setOrder(rows[0] as any);
      setLoading(false);
    })();

  }, [params]);

  const ref = order ? `EBS-${order.id.slice(0, 8).toUpperCase()}` : 'EBS-XXXXXXXX';
  const amount = order?.amount ?? 67;
  const method = order?.payment_method ?? 'paypal';

  return (
    <FunnelLayout>
      <SeoHead
        title="Instructions de paiement - Ebookstudio Pro V2"
        description="Finalisez votre paiement Ebookstudio Pro V2 par PayPal ou virement bancaire."
        canonical="/promo/paiement"
        noindex
      />
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#008296]/10 text-[#008296] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShieldCheck className="w-4 h-4" /> Commande enregistrée
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#232F3E] mb-2">Dernière étape : votre paiement</h1>
          <p className="text-gray-600">
            Réf. <strong className="text-[#232F3E]">{ref}</strong> - Montant <strong className="text-[#232F3E]">{amount}€</strong>
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Chargement…</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">💳 Paiement PayPal</h2>
              <p className="text-gray-600">
                Cliquez ci-dessous pour régler <strong>{amount}€</strong> en toute sécurité via PayPal.
                Indiquez bien la référence <strong>{ref}</strong> et votre email <strong>{order?.email}</strong> dans la note du paiement.
              </p>
              <a href={PAYPAL_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 text-base">
                  Payer {amount}€ sur PayPal <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <p className="text-xs text-gray-500 text-center">Accès envoyé sous 1h ouvrée après réception</p>
            </div>

            <div className="bg-[#008296]/5 border border-[#008296]/20 rounded-xl p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Mail className="w-5 h-5 text-[#008296]" /> Email de confirmation</h3>
              <p className="text-sm text-gray-600">
                Un email récapitulatif vient d'être envoyé à <strong>{order?.email || 'votre adresse'}</strong>.
                Si vous ne le trouvez pas, vérifiez vos spams.
              </p>
            </div>

            <div className="text-center pt-4 space-y-3">
              <Link to="/promo/bonus">
                <Button variant="outline" className="border-[#008296] text-[#008296] hover:bg-[#008296]/5">
                  🎁 Voir mes bonus exclusifs
                </Button>
              </Link>
              <p className="text-xs text-gray-500">
                Une question ? Écrivez-nous à <a href="mailto:contact@ebookstudio.fr" className="text-[#008296]">contact@ebookstudio.fr</a>
              </p>
            </div>
          </div>
        )}
      </section>
    </FunnelLayout>
  );
};

export default PromoPaiementPage;
