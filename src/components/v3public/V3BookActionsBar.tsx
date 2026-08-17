import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Rocket, Save, Wand2, BookOpen, BarChart3, Languages, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import { BOOK_BRIEF_EVENT, readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
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

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const outline = brief.outline || [];
  const hasOutline = outline.length > 0;
  const validated = Boolean(brief.outlineValidated) && hasOutline;
  const projectId = brief.projectId || '';
  const written = Boolean(projectId);

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
        <button type="button" onClick={validate} disabled={!hasOutline || validating}
          className="v3-btn v3-btn-outline justify-center text-xs disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> {validated ? 'Sommaire validé' : 'Valider le sommaire'}
        </button>

        <button type="button" onClick={onLaunch} disabled={!validated}
          className="v3-btn v3-btn-primary justify-center text-xs disabled:opacity-50">
          <Rocket className="h-3.5 w-3.5" /> Commencer la rédaction
        </button>

        <button type="button" onClick={save} disabled={!validated}
          title={validated ? 'Enregistrer' : 'Validez d’abord votre sommaire'}
          className="v3-btn v3-btn-outline justify-center text-xs disabled:opacity-50">
          <Save className="h-3.5 w-3.5" /> {saved ? 'Enregistré' : 'Enregistrer mon livre'}
        </button>

        {validated ? (
          <Link to="/v3/corriger" className="v3-btn v3-btn-outline justify-center text-xs" title={written ? 'Correction professionnelle' : soon}>
            <Wand2 className="h-3.5 w-3.5" /> Corriger mon livre
          </Link>
        ) : (
          <button type="button" disabled title="Validez d’abord votre sommaire" className="v3-btn v3-btn-outline justify-center text-xs opacity-50">
            <Wand2 className="h-3.5 w-3.5" /> Corriger mon livre
          </button>
        )}

        {written && validated ? (
          <Link to={`/v3/book/${projectId}`} className="v3-btn v3-btn-outline justify-center text-xs">
            <BookOpen className="h-3.5 w-3.5" /> Voir mon livre
          </Link>
        ) : (
          <button type="button" disabled title={validated ? soon : 'Validez d’abord votre sommaire'} className="v3-btn v3-btn-outline justify-center text-xs opacity-50">
            <BookOpen className="h-3.5 w-3.5" /> Voir mon livre
          </button>
        )}

        {written && validated ? (
          <Link to={`/v3/book/${projectId}?tab=kdp`} className="v3-btn v3-btn-outline justify-center text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> Données KDP
          </Link>
        ) : (
          <button type="button" disabled title={validated ? soon : 'Validez d’abord votre sommaire'} className="v3-btn v3-btn-outline justify-center text-xs opacity-50">
            <BarChart3 className="h-3.5 w-3.5" /> Données KDP
          </button>
        )}

        {validated ? (
          <Link to="/v3/outils/traduction" className="v3-btn v3-btn-outline justify-center text-xs">
            <Languages className="h-3.5 w-3.5" /> Traduire (10 langues)
          </Link>
        ) : (
          <button type="button" disabled title="Validez d’abord votre sommaire" className="v3-btn v3-btn-outline justify-center text-xs opacity-50">
            <Languages className="h-3.5 w-3.5" /> Traduire (10 langues)
          </button>
        )}

        {validated ? (
          <Link to="/v3/upsells" className="v3-btn v3-btn-outline justify-center text-xs">
            <Headphones className="h-3.5 w-3.5" /> Version audio (9,99 €)
          </Link>
        ) : (
          <button type="button" disabled title="Validez d’abord votre sommaire" className="v3-btn v3-btn-outline justify-center text-xs opacity-50">
            <Headphones className="h-3.5 w-3.5" /> Version audio (9,99 €)
          </button>
        )}

      </div>
    </div>
  );
}
