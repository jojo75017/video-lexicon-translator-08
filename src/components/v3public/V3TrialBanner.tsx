import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Lock } from 'lucide-react';
import { useTrialAccess } from '@/hooks/useTrialAccess';

/**
 * Bandeau d'essai gratuit 7 jours.
 *  - essai en cours : jours restants + rappel du filigrane sur les exports ;
 *  - essai terminé : lecture seule + bouton d'achat (rien n'est supprimé).
 */
const V3TrialBanner: React.FC = () => {
  const { loading, isTrial, isExpired, daysRemaining } = useTrialAccess();
  if (loading || !isTrial) return null;

  if (isExpired) {
    return (
      <div className="w-full border-b border-amber-700/40 bg-[#2A1A08] px-4 py-3 text-center text-sm text-[#F6E4C8]">
        <Lock className="mr-2 inline h-4 w-4" />
        Votre essai gratuit est terminé. Votre livre reste visible en lecture seule.
        <Link
          to="/commander"
          className="ml-3 inline-block rounded-md bg-[#E8951E] px-3 py-1 font-semibold text-[#1A1206]"
        >
          Débloquer mon accès
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-emerald-700/40 bg-[#0F211A] px-4 py-2 text-center text-sm text-[#D6EFE3]">
      <Clock className="mr-2 inline h-4 w-4" />
      Essai gratuit : {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''} ·
      1 livre complet · exports filigranés
      <Link to="/commander" className="ml-3 underline">
        Passer à l’accès complet
      </Link>
    </div>
  );
};

export default V3TrialBanner;
