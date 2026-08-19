import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Rocket, Save, Wand2, BookOpen, BarChart3, Languages, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import { BOOK_BRIEF_EVENT, readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import { readWrittenProgress, WRITTEN_CHAPTERS_EVENT } from '@/lib/v3/writtenChapters';
import { saveOutlineVersion } from '@/lib/v3/genieThread';

/**
 * Barre d'actions unique sous le dialogue : l'abonné voit tout de suite le
 * chemin complet (valider → rédiger → enregistrer → corriger → lire → KDP →
 * traduire → audio). Ce qui n'est pas encore disponible reste visible, désactivé.
 */
export default function V3BookActionsBar({ onLaunch }: { onLaunch: () => void }) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [saved, setSaved] = useState(false);
  const [validating, setValidating] = useState(false);
  const [writtenCount, setWrittenCount] = useState(0);

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  useEffect(() => {
    const sync = () => setWrittenCount(readWrittenProgress().chapters.length);
    sync();
    window.addEventListener(WRITTEN_CHAPTERS_EVENT, sync);
    return () => window.removeEventListener(WRITTEN_CHAPTERS_EVENT, sync);
  }, []);

  const outline = brief.outline || [];
  const hasOutline = outline.length > 0;
  const validated = Boolean(brief.outlineValidated) && hasOutline;
  const projectId = brief.projectId || '';
  const written = writtenCount > 0 || Boolean(projectId);

  const requireOutline = (action: () => void) => {
    if (!validated) {
      toast.info('Validez d’abord le sommaire.');
      document.getElementById('sommaire-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    action();
  };

  const showBook = () => {
    // Le livre reste visible à côté : on ouvre l'onglet « Mon livre » de la colonne.
    window.dispatchEvent(new CustomEvent('v3:show-written-book'));
    if (writtenCount === 0) {
      toast.info('La colonne de droite affiche votre livre : chaque chapitre écrit s’y ajoute en direct.');
    }
  };


  const validate = async () => {
    if (!hasOutline) {
      toast.error('Demandez d’abord le sommaire au Génie.');
      return;
    }
    setValidating(true);
    const next = { ...brief, outlineValidated: true, chapters: outline.length };
    writeBookBrief(next);
    setBrief(next);
    await saveOutlineVersion(outline, { projectId: projectId || null, bookTitle: brief.title || '' });
    setValidating(false);
    toast.success(`Sommaire validé (${outline.length} chapitres) — une version a été enregistrée.`);
  };

  const save = () => {
    writeBookBrief(brief);
    setSaved(true);
    toast.success('Votre livre est enregistré : vous pourrez le reprendre plus tard.');
    setTimeout(() => setSaved(false), 2500);
  };

  const soon = 'Disponible après la rédaction de votre livre';

  return (
    <div className="rounded-[22px] border p-4 md:p-5" style={{ borderColor: 'var(--v3-gold, #c9a84c)', background: '#fff' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
          Vos actions
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          {validated ? 'Sommaire validé — vous pouvez lancer la rédaction.' : 'Validez le sommaire pour lancer la rédaction.'}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <button type="button" onClick={validate} disabled={validating}
          className="v3-btn v3-btn-outline justify-center text-xs disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> {validated ? 'Sommaire validé' : 'Valider le sommaire'}
        </button>

        <button type="button" onClick={() => requireOutline(onLaunch)}
          className="v3-btn v3-btn-primary justify-center text-xs">
          <Rocket className="h-3.5 w-3.5" /> Commencer la rédaction
        </button>

        <button type="button" onClick={() => requireOutline(save)}
          title={validated ? 'Enregistrer' : 'Validez d’abord votre sommaire'}
          className="v3-btn v3-btn-outline justify-center text-xs disabled:opacity-50">
          <Save className="h-3.5 w-3.5" /> {saved ? 'Enregistré' : 'Enregistrer mon livre'}
        </button>

        <Link to={projectId ? `/v3/corriger?projectId=${projectId}` : '/v3/corriger'} className="v3-btn v3-btn-outline justify-center text-xs" title={written ? 'Correction professionnelle' : soon}>
          <Wand2 className="h-3.5 w-3.5" /> Corriger mon livre
        </Link>

        <button type="button" onClick={() => requireOutline(showBook)} className="v3-btn v3-btn-outline justify-center text-xs">
          <BookOpen className="h-3.5 w-3.5" /> Voir mon livre{writtenCount ? ` (${writtenCount})` : ''}
        </button>

        <button type="button" onClick={() => requireOutline(() => {
          const target = document.getElementById('exports-livre');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else { onLaunch(); toast.info('Les données KDP seront visibles ici dès que le manuscrit sera terminé.'); }
        })} className="v3-btn v3-btn-outline justify-center text-xs">
          <BarChart3 className="h-3.5 w-3.5" /> Données KDP
        </button>

        <Link to={projectId ? `/v3/outils/traduction?projectId=${projectId}` : '/v3/outils/traduction'} className="v3-btn v3-btn-outline justify-center text-xs">
          <Languages className="h-3.5 w-3.5" /> Traduire (10 langues)
        </Link>

        <Link to="/v3/upsells" className="v3-btn v3-btn-outline justify-center text-xs">
          <Headphones className="h-3.5 w-3.5" /> Version audio (9,99 €)
        </Link>

      </div>
    </div>
  );
}
