import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  to?: string;
  /** Destination utilisée quand il n'y a pas d'historique interne exploitable. */
  fallback?: string;
  label?: string;
  className?: string;
}

/**
 * Bouton retour réutilisable.
 * - `to` fourni : navigation directe.
 * - sinon : navigation directe vers `fallback` (par défaut la page des agents).
 *   On n'utilise jamais l'historique : une redirection intermédiaire pourrait
 *   sinon ramener à tort vers l'accueil ou une page de vente.
 */
export function BackButton({ to, fallback = '/v3/commence-ici', label = 'Retour', className }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) { navigate(to); return; }
    navigate(fallback, { replace: false });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn('gap-1 text-neutral-700 hover:text-neutral-900', className)}
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </Button>
  );
}

export default BackButton;
