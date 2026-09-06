import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { V2_LEGACY_DISCOUNT } from '@/data/v2LegacyAccess';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';

type Props = {
  /** Nom du module verrouillé, tel que l'abonné le voit. */
  title?: string;
  /** Bénéfice en une phrase. */
  benefit?: string;
};

/**
 * Verrou réutilisable : un module payant reste visible mais nécessite un achat.
 * Aucune redirection surprise — on explique et on propose l'offre remisée.
 */
export default function V3ModuleLockCard({
  title = 'Ce module est réservé aux formules payantes',
  benefit = "Il n'est pas inclus dans votre accès actuel, mais vous pouvez le débloquer.",
}: Props) {
  const percent = Math.round(V2_LEGACY_DISCOUNT * 100);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <div
        className="rounded-2xl border p-8"
        style={{ borderColor: 'rgba(201,168,76,0.5)', background: '#fffdf8' }}
      >
        <Lock className="mx-auto h-8 w-8" style={{ color: '#c9a84c' }} />
        <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm opacity-80">{benefit}</p>
        <p className="mt-4 text-sm font-semibold" style={{ color: '#0f2e1f' }}>
          Ancien client : −{percent}&nbsp;% à vie sur les formules Plume et Édition.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/v3/migration"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white"
            style={{ background: 'linear-gradient(90deg,#FF9E2D 0%,#FF6B35 100%)' }}
          >
            Voir mon offre −{percent}&nbsp;%
          </Link>
          <Link to="/v3" className="rounded-full border px-5 py-2.5 text-sm font-semibold">
            Retour à l'accueil
          </Link>
          <Link
            to={SUBSCRIBER_HOME_PATH}
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline"
          >
            <ArrowLeft className="h-4 w-4" /> Mon espace habituel
          </Link>
        </div>
      </div>
    </main>
  );
}
