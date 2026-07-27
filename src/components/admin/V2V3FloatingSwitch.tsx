import { Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useV3Mode } from '@/hooks/useV3Mode';

const GOLD = '#c9a84c';
const ORANGE = '#FF9E2D';

function resetV2PlannerEntryPoint() {
  try {
    localStorage.setItem('ebook_planner_active_tab', 'workflow-dashboard');
  } catch {
    /* ignore */
  }
}

export function V2V3FloatingSwitch() {
  const { isAdmin, checking, v3Mode, setV3Mode } = useV3Mode();
  const navigate = useNavigate();

  if (checking || !isAdmin) return null;

  const handleClick = () => {
    const next = !v3Mode;
    setV3Mode(next);
    if (next) {
      toast.success('Bascule vers la V3', {
        description: 'Ouverture du Hub V3 (mode admin).',
        icon: '👑',
      });
      navigate('/hub-v3');
    } else {
      // Retour V2 : éviter qu'un ancien onglet sauvegardé (ex: "admin")
      // renvoie immédiatement hors du générateur.
      resetV2PlannerEntryPoint();
      toast.success('Retour à la V2', {
        description: 'Générateur V2 — onglet Workflow.',
        icon: '✨',
      });
      navigate('/ebook-planner?tab=workflow-dashboard', { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={v3Mode ? 'Mode V3 actif — revenir en V2' : 'Basculer vers la V3'}
      title={v3Mode ? 'Mode V3 actif — cliquer pour revenir en V2' : 'Basculer vers la V3 (admin)'}
      className="fixed left-4 bottom-4 z-[9998] inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold opacity-70 shadow-md transition-all duration-200 hover:opacity-100 hover:scale-[1.04]"
      style={{
        borderColor: v3Mode ? GOLD : ORANGE,
        background: v3Mode ? '#141414' : '#ffffff',
        color: v3Mode ? GOLD : ORANGE,
      }}
    >
      {v3Mode ? <Crown className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      <span className="tracking-wide">{v3Mode ? 'V3' : 'V2'}</span>
    </button>
  );
}

export default V2V3FloatingSwitch;
