import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function V3OffresMerciPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const plan = params.get('plan') || 'V3';

  return (
    <div className="v3pub min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-lg w-full text-center bg-white border border-black/10 rounded-2xl p-8 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-[var(--v3-orange,#E8951E)]/15 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[var(--v3-orange,#E8951E)]" />
        </div>
        <h1 className="v3-serif text-3xl font-bold mt-4 text-[var(--v3-ink,#2A2118)]">
          Bienvenue dans {plan} !
        </h1>
        <p className="mt-3 text-[var(--v3-muted,#6B6257)]">
          Votre abonnement est actif. Vous pouvez commencer à créer vos livres tout de suite.
        </p>
        {sessionId && (
          <p className="mt-4 text-[11px] text-[var(--v3-muted)] break-all">
            Référence : {sessionId}
          </p>
        )}
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/v3/create" className="v3-btn v3-btn-primary">
            Créer mon premier livre
          </Link>
          <Link to="/v3" className="v3-btn v3-btn-outline">
            Accueil V3
          </Link>
        </div>
      </div>
    </div>
  );
}
