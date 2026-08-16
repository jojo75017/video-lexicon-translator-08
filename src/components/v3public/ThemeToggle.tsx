import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LABELS = {
  light: 'Clair',
  dark: 'Sombre',
  auto: 'Auto',
} as const;

interface Props {
  /** `dark` sur fond émeraude (header), `light` dans la barre latérale. */
  variant?: 'onDark' | 'plain';
  className?: string;
  /** Affiche le libellé texte à côté de l'icône. */
  showLabel?: boolean;
}

/** Bouton clair / sombre / automatique — visible dans le header et la barre latérale. */
export default function ThemeToggle({ variant = 'onDark', className = '', showLabel = true }: Props) {
  const { choice, cycle } = useTheme();
  const Icon = choice === 'light' ? Sun : choice === 'dark' ? Moon : MonitorSmartphone;

  const base =
    variant === 'onDark'
      ? 'v3-btn v3-btn-on-dark text-[12.5px]'
      : 'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition hover:opacity-90';

  return (
    <button
      type="button"
      onClick={cycle}
      className={`${base} ${className}`}
      style={
        variant === 'plain'
          ? { borderColor: 'var(--v3-line)', color: 'var(--v3-ink)', background: 'transparent' }
          : undefined
      }
      title={`Thème : ${LABELS[choice]} — cliquez pour changer`}
      aria-label={`Thème ${LABELS[choice]}, changer de thème`}
    >
      <Icon className="h-4 w-4" />
      {showLabel && <span>{LABELS[choice]}</span>}
    </button>
  );
}
