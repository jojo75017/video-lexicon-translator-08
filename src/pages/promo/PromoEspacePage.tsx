import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Package, ExternalLink, Copy, Users, Wallet, TrendingUp, Gift } from 'lucide-react';

interface Order {
  id: string;
  product_key: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
}

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
  converted_at: string | null;
}

interface ReferralStats {
  total_referrals: number;
  pending: number;
  converted: number;
  total_commission: number;
  unpaid_commission: number;
  paid_commission: number;
}

const PromoEspacePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [refLoading, setRefLoading] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);

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
        setUserId(session.user.id);
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

  useEffect(() => {
    if (!userId) return;
    (async () => {
      // Referral code (one per user)
      const { data: codeRow } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', userId)
        .maybeSingle();
      if (codeRow?.code) setRefCode(codeRow.code);

      // Referrals + stats
      const [{ data: refs }, { data: statsData }] = await Promise.all([
        supabase
          .from('referrals')
          .select('id, referred_email, status, commission_amount, commission_paid, created_at, converted_at')
          .eq('referrer_id', userId)
          .order('created_at', { ascending: false }),
        supabase.rpc('get_referral_stats', { p_user_id: userId }),
      ]);
      setReferrals((refs as Referral[]) || []);
      if (statsData) setStats(statsData as unknown as ReferralStats);
    })();
  }, [userId]);

  const generateRefCode = async () => {
    if (!userId) {
      toast.error('Connectez-vous pour générer votre code affilié.');
      navigate('/auth?redirect=/promo/espace');
      return;
    }
    setRefLoading(true);
    try {
      const { data: codeData, error: rpcErr } = await supabase.rpc('generate_referral_code');
      if (rpcErr) throw rpcErr;
      const newCode = codeData as unknown as string;
      const { error: insErr } = await supabase
        .from('referral_codes')
        .insert({ user_id: userId, code: newCode });
      if (insErr) throw insErr;
      setRefCode(newCode);
      toast.success('Votre code affilié est prêt !');
    } catch (e) {
      console.error(e);
      toast.error("Impossible de générer le code. Réessayez.");
    } finally {
      setRefLoading(false);
    }
  };

  const refLink = refCode
    ? `${window.location.origin}/promo/decouverte?ref=${refCode}`
    : '';

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copié !`);
    } catch {
      toast.error('Copie impossible');
    }
  };

  const productLabel = (k: string) => {
    if (k === 'main' || k === 'main_yearly') return 'Ebookstudio Pro V2 - Accès à vie';
    if (k === 'license_extended') return 'Licence commerciale étendue';
    if (k === 'templates_premium') return 'Pack 50 templates premium';
    return k;
  };

  return (
    <FunnelLayout>
      <SeoHead
        title="Espace membre - Ebookstudio Pro V2"
        description="Accédez à vos commandes, votre lien d'affiliation et vos bonus Ebookstudio Pro V2."
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

          <Tabs defaultValue="commandes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
              <TabsTrigger value="commandes" className="data-[state=active]:bg-[#008296] data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" /> Commandes
              </TabsTrigger>
              <TabsTrigger value="affiliation" className="data-[state=active]:bg-[#008296] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" /> Affiliation
              </TabsTrigger>
              <TabsTrigger value="acces" className="data-[state=active]:bg-[#008296] data-[state=active]:text-white">
                <Gift className="w-4 h-4 mr-2" /> Accès
              </TabsTrigger>
            </TabsList>

            {/* COMMANDES */}
            <TabsContent value="commandes" className="mt-6">
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
            </TabsContent>

            {/* AFFILIATION */}
            <TabsContent value="affiliation" className="mt-6 space-y-6">
              {!userId ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center space-y-3">
                  <p className="text-gray-700">Connectez-vous pour accéder à votre espace affilié.</p>
                  <Button
                    onClick={() => navigate('/auth?redirect=/promo/espace')}
                    className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white"
                  >
                    Se connecter
                  </Button>
                </div>
              ) : (
                <>
                  {/* Code & lien */}
                  <div className="bg-[#008296]/5 border border-[#008296]/20 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      💸 Votre code affilié
                    </h2>
                    {!refCode ? (
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          Activez votre programme et touchez <strong>30 % de commission</strong> sur chaque vente que vous générez.
                        </p>
                        <Button
                          onClick={generateRefCode}
                          disabled={refLoading}
                          className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold"
                        >
                          {refLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Générer mon code affilié
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">Mon code</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-lg font-bold text-[#232F3E]">
                              {refCode}
                            </code>
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(refCode, 'Code')}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">Mon lien d'affiliation</p>
                          <div className="flex items-center gap-2">
                            <input
                              readOnly
                              value={refLink}
                              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                            />
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(refLink, 'Lien')}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Partagez ce lien : commission de 30 % (≈ <strong>20,10 €</strong>) reversée pour chaque vente à 67 €.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  {refCode && (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase">
                            <Users className="w-4 h-4" /> Filleuls
                          </div>
                          <p className="text-2xl font-bold mt-1">{stats?.total_referrals ?? 0}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase">
                            <TrendingUp className="w-4 h-4" /> Convertis
                          </div>
                          <p className="text-2xl font-bold mt-1 text-green-600">{stats?.converted ?? 0}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase">
                            <Wallet className="w-4 h-4" /> À payer
                          </div>
                          <p className="text-2xl font-bold mt-1 text-[#FF9E2D]">{Number(stats?.unpaid_commission ?? 0).toFixed(2)}€</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase">
                            <Wallet className="w-4 h-4" /> Total gagné
                          </div>
                          <p className="text-2xl font-bold mt-1 text-[#008296]">{Number(stats?.total_commission ?? 0).toFixed(2)}€</p>
                        </div>
                      </div>

                      {/* Détail commissions */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Détail de mes commissions</h3>
                        {referrals.length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            Aucune commission pour le moment. Partagez votre lien pour démarrer !
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-gray-500 text-xs uppercase border-b border-gray-100">
                                  <th className="py-2">Date</th>
                                  <th className="py-2">Filleul</th>
                                  <th className="py-2">Statut</th>
                                  <th className="py-2 text-right">Commission</th>
                                  <th className="py-2 text-right">Paiement</th>
                                </tr>
                              </thead>
                              <tbody>
                                {referrals.map((r) => (
                                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                                    <td className="py-3 font-mono text-xs">
                                      {r.referred_email.replace(/(.{2}).*(@.*)/, '$1•••$2')}
                                    </td>
                                    <td className="py-3">
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        r.status === 'converted'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-orange-100 text-orange-700'
                                      }`}>
                                        {r.status === 'converted' ? 'Converti' : 'En attente'}
                                      </span>
                                    </td>
                                    <td className="py-3 text-right font-bold">
                                      {Number(r.commission_amount).toFixed(2)}€
                                    </td>
                                    <td className="py-3 text-right">
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        r.commission_paid
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {r.commission_paid ? 'Payée' : 'À payer'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/promo/affilie">
                          <Button variant="outline" className="border-[#008296] text-[#008296]">
                            Voir la page programme <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        <Link to="/promo/affilie#kit">
                          <Button className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white">
                            🎁 Accéder au kit de promotion
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>

            {/* ACCES */}
            <TabsContent value="acces" className="mt-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
                <h2 className="text-xl font-bold">🚀 Accéder à l'outil</h2>
                <p className="text-gray-700">Une fois votre paiement validé, accédez à Ebookstudio Pro V2.</p>
                <Link to="/offres">
                  <Button variant="outline" className="border-[#008296] text-[#008296]">Aller à l'application</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      )}
    </FunnelLayout>
  );
};

export default PromoEspacePage;
