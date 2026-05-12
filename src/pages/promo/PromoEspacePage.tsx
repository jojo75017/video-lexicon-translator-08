import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  product_key: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
}

const PromoEspacePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        const lead = localStorage.getItem('ebs_lead_email');
        if (!lead) {
          navigate('/auth?redirect=/promo/espace');
          return;
        }
        setEmail(lead);
      } else {
        setEmail(session.user.email);
      }
      setLoading(false);
    })();
  }, [navigate]);

  useEffect(() => {
    if (!email) return;
    (async () => {
      const { data } = await supabase
        .from('funnel_orders')
        .select('id, product_key, amount, status, created_at, payment_method')
        .eq('email', email)
        .order('created_at', { ascending: false });
      setOrders((data as Order[]) || []);
    })();
  }, [email]);

  const productLabel = (k: string) => {
    if (k === 'main' || k === 'main_yearly') return 'EbookStudio — Accès à vie';
    if (k === 'license_extended') return 'Licence commerciale étendue';
    if (k === 'templates_premium') return 'Pack 50 templates premium';
    return k;
  };

  return (
    <FunnelLayout>
      <SeoHead
        title="Espace membre — EbookStudio"
        description="Accédez à vos commandes, votre lien d'affiliation et vos bonus EbookStudio."
        canonical="/promo/espace"
        noindex
      />
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#008296]" /></div>
      ) : (
        <section className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Bienvenue 👋</h1>
            <p className="text-gray-600">{email}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Mes commandes</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">Aucune commande pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <p className="font-semibold">{productLabel(o.product_key)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(o.created_at).toLocaleDateString('fr-FR')} · {o.payment_method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{o.amount}€</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {o.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#008296]/5 border border-[#008296]/20 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold">💸 Devenez affilié EbookStudio</h2>
            <p className="text-gray-700">
              Recommandez EbookStudio et touchez <strong>30% de commission</strong> sur chaque vente.
            </p>
            <Link to="/promo/affilie">
              <Button className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold">
                Accéder au programme d'affiliation <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-bold">🚀 Accéder à l'outil</h2>
            <p className="text-gray-700">Une fois votre paiement validé, accédez à EbookStudio.</p>
            <Link to="/offres">
              <Button variant="outline" className="border-[#008296] text-[#008296]">Aller à l'application</Button>
            </Link>
          </div>
        </section>
      )}
    </FunnelLayout>
  );
};

export default PromoEspacePage;
