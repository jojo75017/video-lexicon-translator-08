import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';

/**
 * Barre de navigation de retour affichée sur les ateliers d'agents.
 * Garantit que tous les boutons de retour ramènent à « Commence ici ».
 */
export default function V3AgentReturnBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <BackButton to="/v3/commence-ici" label="Retour aux agents" />
      <Link
        to="/v3/commence-ici"
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-card px-3 py-1.5 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-black/[0.04]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <Users className="h-3.5 w-3.5" /> Tous les agents
      </Link>
    </div>
  );
}
