import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { resetBookProject } from '@/lib/v3/bookBrief';
import { clearWrittenChapters } from '@/lib/v3/writtenChapters';

/** Efface le brouillon en cours (fiche, sommaire, chapitres) — jamais « Mes livres ». */
export default function V3ResetBookButton() {
  const onClick = () => {
    if (!window.confirm('Effacer le livre en cours et repartir de zéro ?\n\nLe titre, le sommaire et les chapitres en cours seront effacés. Vos livres enregistrés dans « Mes livres » restent intacts.')) return;
    resetBookProject();
    try { clearWrittenChapters(); } catch { /* noop */ }
    toast.success('Livre effacé. Vous repartez d’une page blanche.');
    setTimeout(() => window.location.reload(), 400);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="v3-btn text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
      style={{ background: 'var(--v3-emerald, #064e3b)', borderColor: 'var(--v3-emerald, #064e3b)' }}
    >
      <RotateCcw className="w-3.5 h-3.5" /> Nouveau livre (remettre à zéro)
    </button>
  );
}
