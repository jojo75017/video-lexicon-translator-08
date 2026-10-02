import { useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useV3Mode } from '@/hooks/useV3Mode';
import { openV3 } from '@/lib/openV3';

const LS_V3_MODE_KEY = 'ebookstudio_v3_mode';

interface V2V3FloatingSwitchProps {
  forceVisible?: boolean;
}

function readPreviewV3Mode() {
  try {
    return localStorage.getItem(LS_V3_MODE_KEY) === '1';
  } catch {
    return false;
  }
}

function writePreviewV3Mode(next: boolean) {
  try {
    if (next) localStorage.setItem(LS_V3_MODE_KEY, '1');
    else localStorage.removeItem(LS_V3_MODE_KEY);
  } catch {
    /* ignore */
  }
}

function resetV2PlannerEntryPoint() {
  try {
    localStorage.setItem('ebook_planner_active_tab', 'workflow-dashboard');
  } catch {
    /* ignore */
  }
}

export function V2V3FloatingSwitch({ forceVisible = false }: V2V3FloatingSwitchProps) {
  const { isAdmin, checking, v3Mode, setV3Mode } = useV3Mode();
  const navigate = useNavigate();
  const [previewV3Mode, setPreviewV3Mode] = useState(() => readPreviewV3Mode());

  if (checking && !forceVisible) return null;

  const canShow = isAdmin || forceVisible;
  if (!canShow) return null;

  const displayV3Mode = isAdmin ? v3Mode : previewV3Mode;

  const handleClick = () => {
    const next = !displayV3Mode;
    if (isAdmin) {
      setV3Mode(next);
    } else {
      writePreviewV3Mode(next);
      setPreviewV3Mode(next);
    }

    if (next) {
      toast.success('Bascule vers la V3', {
        description: 'Ouverture du Hub V3 (mode admin).',
        icon: '👑',
        position: 'top-center',
        duration: 3500,
        style: { zIndex: 99999 },
      });
      openV3(navigate);
    } else {
      resetV2PlannerEntryPoint();
      toast.success('Ouverture de la V2', {
        description: 'Générateur V2 — onglet Workflow.',
        icon: '✨',
        position: 'top-center',
        duration: 3500,
        style: { zIndex: 99999 },
      });
      navigate('/ebook-planner?tab=workflow-dashboard', { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={displayV3Mode ? 'Revenir à EbookStudio V2' : 'Ouvrir EbookStudio V3'}
      title={displayV3Mode ? 'Revenir à EbookStudio V2' : 'Ouvrir EbookStudio V3'}
      className="fixed left-4 top-[6.5rem] z-[9998] inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-xl"
      style={{
        background: 'linear-gradient(90deg,#FF9E2D 0%,#FF6B35 100%)',
        textShadow: '0 1px 0 rgba(0,0,0,0.12)',
      }}
    >
      {displayV3Mode ? <Crown className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      <span className="tracking-wide">{displayV3Mode ? 'Revenir à la V2' : 'Ouvrir la V3'}</span>
    </button>
  );
}

export default V2V3FloatingSwitch;
