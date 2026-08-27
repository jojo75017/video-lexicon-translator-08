import BackButton from '@/components/v3/BackButton';

/**
 * Barre de navigation de retour affichée sur les ateliers d'agents.
 * Garantit que tous les boutons de retour ramènent à « Commence ici ».
 */
export default function V3AgentReturnBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <BackButton to="/v3/commence-ici" label="Retour aux agents" />
    </div>
  );
}
