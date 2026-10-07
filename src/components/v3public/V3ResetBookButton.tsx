import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AgentPortrait from './AgentPortrait';
import { resetBookProject } from '@/lib/v3/bookBrief';
import { clearWrittenChapters } from '@/lib/v3/writtenChapters';

type V3ResetBookButtonProps = {
  navigateTo?: string;
  title?: string;
  subtitle?: string;
};

/** Efface le brouillon en cours (fiche, sommaire, chapitres) — jamais « Mes livres ». */
export default function V3ResetBookButton({ navigateTo, title = 'Nouveau livre', subtitle = 'remettre à zéro' }: V3ResetBookButtonProps) {
  const navigate = useNavigate();

  const onClick = () => {
    if (!window.confirm('Effacer le livre en cours et repartir de zéro ?\n\nLe titre, le sommaire et les chapitres en cours seront effacés. Vos livres enregistrés dans « Mes livres » restent intacts.')) return;
    resetBookProject();
    try { clearWrittenChapters(); } catch { /* noop */ }
    toast.success('Livre effacé. Vous repartez d’une page blanche.');
    if (navigateTo) {
      navigate(navigateTo);
      return;
    }
    setTimeout(() => window.location.reload(), 400);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="v3-btn v3-btn-reset-green v3-btn-newbook"
      title="Effacer le livre en cours et repartir d’une page blanche"
    >
      <span className="v3-newbook-face" aria-hidden="true">
        <AgentPortrait id="camille" name="Camille" />
      </span>
      <span className="v3-newbook-labels">
        <span className="v3-newbook-title">{title}</span>
        <span className="v3-newbook-sub">{subtitle}</span>
      </span>
      <RotateCcw className="v3-newbook-icon" aria-hidden="true" />
    </button>
  );
}
