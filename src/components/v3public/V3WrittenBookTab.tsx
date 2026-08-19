/**
 * Onglet « Mon livre » de la colonne de droite : le livre tel qu'il sera publié.
 * Chaque chapitre écrit est corrigé automatiquement par la chaîne éditoriale
 * (4 passes), reste comparable avec son premier jet, et peut être réécrit à la
 * main ou complété d'une information oubliée sans quitter la page.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Check, Loader2, PenLine, Plus, Sparkles, Star, Wand2, X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { BookBrief } from '@/lib/v3/bookBrief';
import {
  correctWholeBook, enqueueChapterCorrection, forceChapterCorrection,
} from '@/lib/v3/autoCorrectChapters';
import { enrichChapterWithInfo } from '@/lib/v3/enrichChapter';
import {
  setChapterEdited, type ChapterStatus, type WrittenChapter, type WrittenProgress,
} from '@/lib/v3/writtenChapters';

const STATUS_LABEL: Record<ChapterStatus, string> = {
  raw: 'brut',
  correcting: 'correction en cours…',
  corrected: 'corrigé',
  failed: 'correction à relancer',
};

const STATUS_COLOR: Record<ChapterStatus, string> = {
  raw: '#92400e',
  correcting: '#b45309',
  corrected: '#0f766e',
  failed: '#b91c1c',
};

function StatusBadge({ status }: { status: ChapterStatus }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]"
      style={{ borderColor: STATUS_COLOR[status], color: STATUS_COLOR[status] }}>
      {status === 'correcting' ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function V3WrittenBookTab({
  progress, brief, openIndex, onToggle,
}: {
  progress: WrittenProgress;
  brief: BookBrief;
  openIndex: number | null;
  onToggle: (index: number | null) => void;
}) {
  const written = progress.chapters;
  const [showRaw, setShowRaw] = useState<Record<number, boolean>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [infoIndex, setInfoIndex] = useState<number | null>(null);
  const [infoText, setInfoText] = useState('');
  const [enriching, setEnriching] = useState<number | null>(null);
  const queued = useRef<Set<string>>(new Set());

  // Correction automatique dès qu'un chapitre est écrit (une seule fois par jet).
  useEffect(() => {
    written.forEach((c) => {
      if (c.status !== 'raw' || c.rawContent.trim().length < 60) return;
      const signature = `${c.index}:${c.rawContent.length}`;
      if (queued.current.has(signature)) return;
      queued.current.add(signature);
      enqueueChapterCorrection(c.index);
    });
  }, [written]);

  const correctedCount = useMemo(
    () => written.filter((c) => c.status === 'corrected' || c.editedContent).length,
    [written],
  );
  const totalWords = written.reduce((sum, c) => sum + c.words, 0);

  const startEdit = (chapter: WrittenChapter) => {
    setEditing(chapter.index);
    setDraft(chapter.content);
    onToggle(chapter.index);
  };

  const saveEdit = (index: number) => {
    setChapterEdited(index, draft);
    setEditing(null);
    toast.success('Votre version est enregistrée : c’est elle qui part à l’export.');
  };

  const addInfo = async (chapter: WrittenChapter) => {
    const info = infoText.trim();
    if (!info) {
      toast.error('Écrivez l’information à ajouter.');
      return;
    }
    setEnriching(chapter.index);
    try {
      const enriched = await enrichChapterWithInfo(chapter.title, chapter.content, info);
      setChapterEdited(chapter.index, enriched);
      setInfoIndex(null);
      setInfoText('');
      toast.success('Information intégrée : rien n’a été supprimé de votre texte.');
    } catch (e: any) {
      toast.error(e?.message || 'Ajout impossible pour le moment.');
    } finally {
      setEnriching(null);
    }
  };

  if (written.length === 0) {
    return (
      <p className="mt-3 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
        <Sparkles className="mr-1 inline h-3.5 w-3.5" />
        Dès que la rédaction démarre, chaque chapitre apparaît ici — déjà corrigé, relisible et
        modifiable, sans quitter la page.
      </p>
    );
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-3 py-2"
        style={{ borderColor: 'rgba(201,168,76,0.45)', background: 'rgba(201,168,76,0.06)' }}>
        <span className="text-[11px]" style={{ color: 'var(--v3-ink)' }}>
          {correctedCount}/{written.length} chapitre(s) corrigé(s) · {totalWords.toLocaleString('fr-FR')} mots retenus
        </span>
        <button type="button" className="v3-btn v3-btn-outline text-[11px]"
          onClick={() => {
            const n = correctWholeBook();
            queued.current.clear();
            toast.success(`Correction professionnelle relancée sur ${n} chapitre(s).`);
          }}>
          <Wand2 className="h-3 w-3" /> Corriger tout le livre
        </button>
      </div>

      <div className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
        {written.map((c) => {
          const raw = Boolean(showRaw[c.index]);
          const text = raw ? c.rawContent : c.content;
          const open = openIndex === c.index;
          return (
            <div key={c.index} className="rounded-xl border px-3 py-2 text-[12.5px]" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <button type="button" onClick={() => onToggle(open ? null : c.index)} className="w-full text-left">
                <strong style={{ color: 'var(--v3-ink)' }}>{c.index + 1}. {c.title}</strong>
                <span className="mt-0.5 flex flex-wrap items-center gap-2 text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
                  <StatusBadge status={c.editedContent ? 'corrected' : c.status} />
                  {c.editedContent ? <span style={{ color: '#0f766e' }}>votre version</span> : null}
                  <span>{c.words.toLocaleString('fr-FR')} mots</span>
                  {typeof c.corrections === 'number' && c.corrections > 0 ? <span>{c.corrections} corrections</span> : null}
                  <span>· {open ? 'replier' : 'lire le texte entier'}</span>
                </span>
              </button>

              {c.error ? (
                <p className="mt-1 text-[10.5px]" style={{ color: '#b91c1c' }}>{c.error}</p>
              ) : null}

              {editing === c.index ? (
                <div className="mt-2">
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={14}
                    className="w-full rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed"
                    style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--v3-ink)' }} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" className="v3-btn v3-btn-gold text-[11px]" onClick={() => saveEdit(c.index)}>
                      <Check className="h-3 w-3" /> Enregistrer
                    </button>
                    <button type="button" className="v3-btn v3-btn-ghost text-[11px]" onClick={() => setEditing(null)}>
                      <X className="h-3 w-3" /> Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                  {open ? text : `${text.slice(0, 220)}…`}
                </p>
              )}

              {infoIndex === c.index && editing !== c.index ? (
                <div className="mt-2 rounded-xl border p-2" style={{ borderColor: 'rgba(201,168,76,0.5)' }}>
                  <textarea value={infoText} onChange={(e) => setInfoText(e.target.value)} rows={3}
                    placeholder="Ex. : j’ai oublié de dire que mon grand-père tenait la boulangerie de la rue Carnot…"
                    className="w-full rounded-lg border px-2.5 py-1.5 text-[12px]"
                    style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--v3-ink)' }} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" disabled={enriching === c.index} onClick={() => addInfo(c)}
                      className="v3-btn v3-btn-gold text-[11px] disabled:opacity-50">
                      {enriching === c.index ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      Intégrer au chapitre
                    </button>
                    <button type="button" className="v3-btn v3-btn-ghost text-[11px]"
                      onClick={() => { setInfoIndex(null); setInfoText(''); }}>
                      <X className="h-3 w-3" /> Annuler
                    </button>
                  </div>
                  <p className="mt-1 text-[10.5px]" style={{ color: 'var(--v3-muted)' }}>
                    Votre texte est conservé en entier : l’information est ajoutée, rien n’est résumé.
                  </p>
                </div>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="v3-btn v3-btn-outline text-[11px]" onClick={() => startEdit(c)}>
                  <PenLine className="h-3 w-3" /> Modifier ce chapitre
                </button>
                <button type="button" className="v3-btn v3-btn-outline text-[11px]"
                  onClick={() => { setInfoIndex(c.index); setInfoText(''); onToggle(c.index); }}>
                  <Plus className="h-3 w-3" /> Ajouter une info oubliée
                </button>
                <button type="button" disabled={c.status === 'correcting'}
                  onClick={() => { forceChapterCorrection(c.index); toast.success('Correction professionnelle relancée.'); }}
                  className="v3-btn v3-btn-ghost text-[11px] disabled:opacity-50">
                  {c.status === 'correcting' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                  Relancer la correction
                </button>
                {c.correctedContent || c.editedContent ? (
                  <button type="button" className="v3-btn v3-btn-ghost text-[11px]"
                    onClick={() => setShowRaw((s) => ({ ...s, [c.index]: !s[c.index] }))}>
                    {raw ? 'Voir la version corrigée' : 'Voir la version brute'}
                  </button>
                ) : null}
                {c.editedContent ? (
                  <button type="button" className="v3-btn v3-btn-ghost text-[11px]"
                    onClick={() => { setChapterEdited(c.index, ''); toast.success('Votre version est retirée : le texte corrigé revient.'); }}>
                    Revenir à la version corrigée
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 border-t pt-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <Link to={brief.projectId ? `/v3/corriger?projectId=${brief.projectId}` : '/v3/corriger'}
          className="v3-btn v3-btn-outline text-[11px]">
          <Wand2 className="h-3 w-3" /> Correction complète (page dédiée)
        </Link>
        <button type="button" className="v3-btn v3-btn-outline text-[11px]"
          onClick={() => document.getElementById('exports-livre')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          <BarChart3 className="h-3 w-3" /> Données KDP
        </button>
        <Link to={`/v3/avis${brief.title ? `?title=${encodeURIComponent(brief.title)}` : ''}`}
          className="v3-btn v3-btn-outline text-[11px]">
          <Star className="h-3 w-3" /> Obtenir des avis clients
        </Link>
      </div>
    </>
  );
}
