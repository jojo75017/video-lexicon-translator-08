import { useNavigate } from 'react-router-dom';
import { Rocket, Palette, Sparkles, Save, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { clearBookBrief, readBookBrief, writeBookBrief } from '@/lib/v3/bookBrief';

/**
 * Barre d'actions rapides V3 (équivalent de la barre V2) :
 * Workflow IA · Couverture · Ambiances · Sauvegarder · Nouveau · Formulaire manuel.
 */
export default function V3QuickActionsBar() {
  const navigate = useNavigate();

  const saveNow = () => {
    const brief = readBookBrief();
    if (!brief || !(brief.title || '').trim()) {
      toast.error('Rien à sauvegarder', { description: 'Saisissez d’abord le titre de votre livre.' });
      return;
    }
    writeBookBrief({ ...brief });
    toast.success('Fiche du livre sauvegardée', { description: brief.title });
  };

  const startNew = () => {
    if (!confirm('Commencer un nouveau livre ? La fiche en cours sera effacée.')) return;
    clearBookBrief();
    toast.success('Nouveau livre', { description: 'La fiche est vide, vous pouvez repartir.' });
    navigate('/v3/create');
  };

  const solid = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors';
  const outline = 'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors';

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => navigate('/v3/create')}
        className={solid}
        style={{ background: 'var(--v3-emerald, #064e3b)', color: '#fff' }}
      >
        <Rocket className="h-3.5 w-3.5" /> Workflow IA
      </button>
      <button
        type="button"
        onClick={() => navigate('/cover-studio')}
        className={outline}
        style={{ borderColor: 'rgba(201,168,76,0.7)', color: '#8a6d1f', background: '#fff' }}
      >
        <Palette className="h-3.5 w-3.5" /> 🎨 Couverture
      </button>
      <button
        type="button"
        onClick={() => navigate('/ambiances')}
        className={outline}
        style={{ borderColor: 'rgba(6,78,59,0.3)', color: 'var(--v3-emerald, #064e3b)', background: '#fff' }}
      >
        <Sparkles className="h-3.5 w-3.5" /> Ambiances
      </button>
      <button
        type="button"
        onClick={saveNow}
        className={outline}
        style={{ borderColor: 'rgba(6,78,59,0.3)', color: 'var(--v3-emerald, #064e3b)', background: '#fff' }}
      >
        <Save className="h-3.5 w-3.5" /> Sauvegarder
      </button>
      <button
        type="button"
        onClick={startNew}
        className={solid}
        style={{ background: '#c9a84c', color: '#1a1a1a' }}
      >
        <Plus className="h-3.5 w-3.5" /> Nouveau
      </button>
      <button
        type="button"
        onClick={() => navigate('/v3/create?manuel=1')}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold underline-offset-4 hover:underline"
        style={{ color: 'var(--v3-muted, #6b7280)' }}
      >
        <FileText className="h-3.5 w-3.5" /> Formulaire manuel
      </button>
    </div>
  );
}
