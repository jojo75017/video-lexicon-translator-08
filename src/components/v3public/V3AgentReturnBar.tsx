import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Users } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';

/**
 * Barre de navigation de retour affichée sur les ateliers d'agents.
 * Garantit qu'on revient toujours aux agents (« Commence ici ») ou à l'accueil V3,
 * même quand la page a été ouverte directement par un lien.
 */
export default function V3AgentReturnBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <BackButton label="Page précédente" />
      <Link
        to="/v3/commence-ici"
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-card px-3 py-1.5 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-black/[0.04]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <Users className="h-3.5 w-3.5" /> Tous les agents
      </Link>
      <Link
        to="/v3"
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-card px-3 py-1.5 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-black/[0.04]"
      >
        <Home className="h-3.5 w-3.5" /> Accueil V3
      </Link>
    </div>
  );
}
