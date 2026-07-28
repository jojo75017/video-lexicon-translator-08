import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

/**
 * Bouton retour réutilisable — utilise history.back() par défaut,
 * ou navigue vers `to` si fourni. À placer en haut de chaque page V3.
 */
export function BackButton({ to, label = 'Retour', className }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className={cn('gap-1 text-neutral-700 hover:text-neutral-900', className)}
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </Button>
  );
}

export default BackButton;
