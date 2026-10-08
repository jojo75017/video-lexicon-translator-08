import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WritingEngineBadgeProps {
  tier?: 'debutant' | 'expert' | 'auteur';
  isPro?: boolean;
  onUpgrade?: () => void;
}
export function WritingEngineBadge({ tier, isPro, onUpgrade }: WritingEngineBadgeProps) {
  const pro = tier ? tier === 'auteur' : isPro === true;
  return <section className="rounded-lg border bg-card p-4 text-card-foreground">
    <p className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-primary" />{pro ? 'Vos outils professionnels' : 'Votre atelier d’écriture'}</p>
    <p className="mt-2 text-sm text-muted-foreground">Vos droits actuels restent conservés. L’accès EbookStudio se choisit à vie, sans nouvel abonnement.</p>
    {!pro && onUpgrade && <Button onClick={onUpgrade} variant="outline" className="mt-3">Voir le Pack Édition Pro à 97 € <ArrowUpRight className="h-4 w-4" /></Button>}
  </section>;
}
export default WritingEngineBadge;
