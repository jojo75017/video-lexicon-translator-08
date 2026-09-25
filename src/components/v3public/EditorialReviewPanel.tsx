import { useState } from 'react';
import { Loader2, ScanSearch, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getActiveAIKey, getOpenRouterModel } from '@/services/aiWritingService';

type Issue = { chapitre?: number; extrait?: string; probleme?: string; suggestion?: string };
type Report = { score: number | null; synthese: string; categories: Record<string, Issue[]> };

const LABELS: [string, string][] = [
  ['sujet', 'Adéquation au sujet'],
  ['personnages', 'Continuité des personnages'],
  ['chronologie', 'Chronologie'],
  ['lieux', 'Lieux'],
  ['evenements', 'Événements'],
  ['incoherences', 'Incohérences factuelles internes'],
  ['repetitions', 'Répétitions'],
  ['grammaire', 'Grammaire'],
  ['ponctuation', 'Ponctuation'],
  ['typographie', 'Typographie française'],
  ['fluidite', 'Fluidité'],
];

export type ReviewBook = { id: string; title: string; kdp_description?: string | null; chapters?: unknown };

const toChapters = (raw: unknown) =>
  (Array.isArray(raw) ? raw : []).map((c: any) => ({
    title: String(c?.title || c?.titre || ''),
    content: String(c?.content || c?.contenu || ''),
  })).filter((c) => c.content.trim().length > 0);

export default function EditorialReviewPanel({ books }: { books: ReviewBook[] }) {
  const [bookId, setBookId] = useState(books[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [active, setActive] = useState('sujet');

  const run = async () => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    const chapters = toChapters(book.chapters);
    if (!chapters.length) { toast.error('Ce livre ne contient pas encore de texte.'); return; }
    setLoading(true); setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('editorial-review', {
        body: {
          title: book.title,
          subject: subject.trim() || book.kdp_description || '',
          chapters,
          userProvider: getProvider(),
          userApiKey: getActiveAIKey(),
          userModel: getProvider() === 'openrouter' ? getOpenRouterModel() : undefined,
        },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      setReport(data as Report);
    } catch (e: any) {
      toast.error(e?.message || 'Analyse impossible.');
    } finally { setLoading(false); }
  };

  const issues = report?.categories?.[active] || [];

  return (
    <div className="mt-8 space-y-5">
      <div className="v3-card space-y-3">
        <h2 className="v3-serif text-2xl font-bold">Correction éditoriale</h2>
        <p className="text-sm text-[var(--v3-muted)]">
          Une relecture de directeur éditorial sur le livre entier : sujet, personnages, chronologie, lieux, événements,
          incohérences, répétitions, grammaire, ponctuation, typographie française et fluidité. Votre texte n'est pas modifié.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">
            Livre
            <select value={bookId} onChange={(e) => setBookId(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-black/10 px-3 text-sm normal-case tracking-normal font-normal text-[var(--v3-ink)]">
              {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--v3-muted)]">
            Sujet annoncé (facultatif)
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex. : guide pour débuter le jardinage bio" className="mt-1 w-full h-10 rounded-lg border border-black/10 px-3 text-sm normal-case tracking-normal font-normal text-[var(--v3-ink)]" />
          </label>
        </div>
        <button onClick={run} disabled={loading || !bookId} className="v3-btn v3-btn-primary">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyse du livre… (1 à 2 minutes)</> : <><ScanSearch className="w-4 h-4" /> Lancer la correction éditoriale</>}
        </button>
      </div>

      {report && (
        <div className="v3-card space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            {report.score != null && <span className="text-3xl font-bold text-[var(--v3-orange)]">{report.score}/100</span>}
            <p className="text-sm flex-1">{report.synthese}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {LABELS.map(([key, label]) => {
              const n = report.categories?.[key]?.length || 0;
              return (
                <button key={key} onClick={() => setActive(key)} className={`v3-btn text-xs ${active === key ? 'v3-btn-primary' : 'v3-btn-outline'}`}>
                  {label} <span className="ml-1 font-bold">{n}</span>
                </button>
              );
            })}
          </div>
          {issues.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-[var(--v3-muted)]"><CheckCircle2 className="w-4 h-4" /> Aucun problème relevé dans cette catégorie.</p>
          ) : (
            <ul className="space-y-3">
              {issues.map((it, i) => (
                <li key={i} className="rounded-lg border border-black/10 p-3 text-sm">
                  {it.chapitre ? <div className="text-xs font-bold text-[var(--v3-orange)]">Chapitre {it.chapitre}</div> : null}
                  {it.extrait && <blockquote className="mt-1 border-l-2 border-[var(--v3-orange)] pl-2 italic text-[var(--v3-muted)]">« {it.extrait} »</blockquote>}
                  {it.probleme && <p className="mt-1"><strong>Problème :</strong> {it.probleme}</p>}
                  {it.suggestion && <p className="mt-1"><strong>Suggestion :</strong> {it.suggestion}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
