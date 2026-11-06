import { useSearchParams, useNavigate } from 'react-router-dom';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';

// Liens directs du tunnel : /paiement-mensuel?plan=debutant|auteur|vip
const PLANS: Record<string, { priceId: string; name: string }> = {
  debutant: { priceId: 'v3m_debutant_monthly', name: 'Débutant · 19 €/mois' },
  auteur: { priceId: 'v3m_auteur_monthly', name: 'Auteur · 29 €/mois' },
  vip: { priceId: 'v3m_vip_monthly', name: 'Édition VIP · 59 €/mois' },
  // Tarif fidélité -20 % : le serveur vérifie que le compte connecté est ancien client V2.
  'debutant-fidelite': { priceId: 'v3m_debutant_monthly_legacy', name: 'Débutant fidélité · 15,20 €/mois' },
  'auteur-fidelite': { priceId: 'v3m_auteur_monthly_legacy', name: 'Auteur fidélité · 23,20 €/mois' },
  'vip-fidelite': { priceId: 'v3m_vip_monthly_legacy', name: 'Édition VIP fidélité · 47,20 €/mois' },
};

export default function AbonnementMensuelPaiementPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const plan = PLANS[params.get('plan') ?? ''];

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      {plan ? (
        <V3SubscribeCheckout priceId={plan.priceId} planName={plan.name} onClose={() => navigate('/v3/forfaits')} />
      ) : (
        <div className="max-w-md mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-2">Formule introuvable</h1>
          <p className="text-muted-foreground">Ce lien de paiement n'est pas valide.</p>
        </div>
      )}
    </div>
  );
}
