import { useMemo, useState } from 'react';
import { X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Props = {
  book: { id: string; title: string; chapters?: unknown };
  onClose: () => void;
  onSaved: () => void;
};

type Raw = Record<string, unknown>;

/** Lecture et modification d'un chapitre à la fois : seul le texte du chapitre modifié change, les autres champs sont conservés. */
export default function ChapterReaderEditor({ book, onClose, onSaved }: Props) {
  const initial = useMemo<Raw[]>(() => (Array.isArray(book.chapters) ? book.chapters : []).map((c) => (c && typeof c === 'object' ? { ...(c as Raw) } : { content: String(c ?? '') })), [book.chapters]);
  const [chapters, setChapters] = useState<Raw[]>(initial);
  const [index, setIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const current = chapters[index];
  const textKey = current && typeof current.content !== 'string' && typeof current.contenu === 'string' ? 'contenu' : 'content';
  const titleOf = (c: Raw, i: number) => String(c.title || c.titre || `Chapitre ${i + 1}`);

  const update = (field: 'title' | 'text', value: string) => {
    setChapters((list) => list.map((c, i) => {
      if (i !== index) return c;
      if (field === 'text') return { ...c, [textKey]: value };
      return { ...c, [typeof c.titre === 'string' && typeof c.title !== 'string' ? 'titre' : 'title']: value };
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('ebook_projects').update({ chapters: chapters as never }).eq('id', book.id);
    setSaving(false);
    if (error) return toast.error(`Enregistrement impossible : ${error.message}`);
    toast.success('Chapitre enregistré ✓');
    setDirty(false);
    setEditing(false);
    onSaved();
  };

  const close = () => {
    if (dirty && !confirm('Des modifications ne sont pas enregistrées. Fermer quand même ?')) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 px-3 py-6 overflow-y-auto" onClick={close}>
      <div className="v3-card mx-auto w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="v3-serif text-2xl font-bold">{book.title || 'Livre sans titre'}</h3>
          <button onClick={close} className="v3-btn v3-btn-ghost" aria-label="Fermer"><X className="h-4 w-4" /></button>
        </div>
        {chapters.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--v3-muted)]">Ce livre n’a pas encore de chapitre écrit.</p>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-[220px_1fr]">
            <nav className="max-h-[65vh] overflow-y-auto space-y-1">
              {chapters.map((c, i) => (
                <button key={i} onClick={() => { if (dirty && !confirm('Changer de chapitre sans enregistrer ?')) return; if (dirty) { setChapters(initial); setDirty(false); } setIndex(i); setEditing(false); }}
                  className={`w-full text-left rounded px-3 py-2 text-sm ${i === index ? 'bg-[var(--v3-orange)]/20 font-semibold' : 'hover:bg-white/5'}`}>
                  {i + 1}. {titleOf(c, i)}
                </button>
              ))}
            </nav>
            <div className="min-w-0">
              {editing ? (
                <>
                  <input value={titleOf(current, index)} onChange={(e) => update('title', e.target.value)} className="w-full h-10 rounded-lg border border-black/10 px-3 text-sm text-[#111827]" aria-label="Titre du chapitre" />
                  <textarea value={String(current[textKey] ?? '')} onChange={(e) => update('text', e.target.value)} className="mt-3 w-full h-[55vh] rounded-lg border border-black/10 px-3 py-2 text-sm leading-relaxed text-[#111827]" aria-label="Texte du chapitre" />
                </>
              ) : (
                <article className="max-h-[60vh] overflow-y-auto pr-2">
                  <h4 className="v3-serif text-xl font-bold mb-3">{titleOf(current, index)}</h4>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{String(current[textKey] ?? '') || 'Chapitre vide.'}</div>
                </article>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button disabled={index === 0 || dirty} onClick={() => setIndex(index - 1)} className="v3-btn v3-btn-outline text-xs"><ChevronLeft className="h-3.5 w-3.5" /> Précédent</button>
                  <button disabled={index >= chapters.length - 1 || dirty} onClick={() => setIndex(index + 1)} className="v3-btn v3-btn-outline text-xs">Suivant <ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={() => { setChapters(initial); setDirty(false); setEditing(false); }} className="v3-btn v3-btn-ghost text-xs">Annuler</button>
                    <button onClick={() => void save()} disabled={saving || !dirty} className="v3-btn v3-btn-primary text-xs"><Save className="h-3.5 w-3.5" /> {saving ? 'Enregistrement…' : 'Enregistrer'}</button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="v3-btn v3-btn-primary text-xs">Modifier ce chapitre</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
