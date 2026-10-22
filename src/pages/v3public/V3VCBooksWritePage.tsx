import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileDown, FileText, Loader2, PenLine, Save, Square, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import robot from '@/assets/plans/vc-books-robot.png';
import { defaultPauseCount, writeVCPauses, VC_PAUSES_MAX, VC_PAUSES_MIN, type VCPause } from '@/lib/vcBooksWriter';
import { buildVCDocx, buildVCPdf, downloadBlob, vcFileName, VC_FORMATS } from '@/lib/vcBooksExport';

interface Book { id: string; title: string; subtitle: string; author_name: string; theme: string; description: string; format: string; target_pages: number; pauses: VCPause[] }

export default function V3VCBooksWritePage() {
  const [params] = useSearchParams();
  const id = params.get('livre');
  const [book, setBook] = useState<Book | null>(null);
  const [pauses, setPauses] = useState<VCPause[]>([]);
  const [total, setTotal] = useState(60);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState('');
  const stop = useRef({ stopped: false });

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    void (async () => {
      const { data, error: e } = await supabase.from('vc_books')
        .select('id, title, subtitle, author_name, theme, description, format, target_pages, pauses').eq('id', id).maybeSingle();
      if (e || !data) setError('Livre introuvable dans votre bibliothèque.');
      else {
        const p = Array.isArray(data.pauses) ? (data.pauses as unknown as VCPause[]) : [];
        setBook({ ...data, pauses: p } as Book);
        setPauses(p);
        setTotal(Math.max(p.length, defaultPauseCount(data.target_pages)));
      }
      setLoading(false);
    })();
  }, [id]);

  async function save(list: VCPause[], quiet = false) {
    if (!book) return;
    const { error: e } = await supabase.from('vc_books')
      .update({ pauses: list as unknown as never, status: list.length ? 'redige' : 'brouillon' }).eq('id', book.id);
    if (e) toast.error('Enregistrement impossible.');
    else if (!quiet) toast.success('Livre enregistré.');
  }

  async function write() {
    if (!book) return;
    setError(''); setWriting(true); stop.current = { stopped: false };
    try {
      const result = await writeVCPauses(book, total, pauses, (list) => { setPauses(list); void save(list, true); }, stop.current);
      toast.success(`${result.length} pauses rédigées.`);
    } catch (e) {
      setError((e as Error).message);
    } finally { setWriting(false); }
  }

  const update = (i: number, field: keyof VCPause, value: string) =>
    setPauses((prev) => prev.map((p, j) => (j === i ? { ...p, [field]: value } : p)));

  const exportBook = { title: book?.title ?? '', subtitle: book?.subtitle ?? '', author_name: book?.author_name ?? '', format: book?.format ?? '6x9', pauses };

  if (loading) return <main className="v3-shell py-8"><Loader2 className="h-5 w-5 animate-spin" /></main>;
  if (!book) return (
    <main className="v3-shell py-8">
      <p role="alert" className="text-sm text-destructive">{error || 'Choisissez d’abord un livre dans votre bibliothèque.'}</p>
      <Button asChild className="mt-4"><Link to="/v3/vc-books/bibliotheque">Ma bibliothèque</Link></Button>
    </main>
  );

  return (
    <main className="v3-shell py-8">
      <Button asChild variant="ghost" size="sm"><Link to="/v3/vc-books/bibliotheque"><ArrowLeft className="mr-2 h-4 w-4" />Ma bibliothèque</Link></Button>
      <header className="mb-6 mt-4 flex flex-wrap items-center gap-4 border-b border-border pb-6">
        <img src={robot} alt="Robot VC Books" className="h-20 w-20 object-contain" />
        <div>
          <p className="text-sm font-semibold text-primary">Robot d’écriture VC Books</p>
          <h1 className="v3-serif text-3xl text-foreground">{book.title}</h1>
          <p className="text-sm text-muted-foreground">{book.subtitle} · {VC_FORMATS[book.format]?.label ?? book.format}</p>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-border bg-card p-5">
        <p className="mb-3 text-sm text-muted-foreground">Le robot écrit les pauses 10 par 10 avec votre clé de rédaction (« Choisir mon IA »), sans jamais répéter un sujet. Tout est enregistré au fur et à mesure.</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">Nombre de pauses ({VC_PAUSES_MIN} à {VC_PAUSES_MAX})
            <Input type="number" min={VC_PAUSES_MIN} max={VC_PAUSES_MAX} value={total} disabled={writing}
              onChange={(e) => setTotal(Math.min(VC_PAUSES_MAX, Math.max(VC_PAUSES_MIN, Number(e.target.value) || VC_PAUSES_MIN)))} className="mt-1 w-32" />
          </label>
          {!writing ? (
            <Button onClick={() => void write()} disabled={pauses.length >= total}>
              <PenLine className="mr-2 h-4 w-4" />{pauses.length ? 'Continuer la rédaction' : 'Lancer le robot d’écriture'}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => { stop.current.stopped = true; }}><Square className="mr-2 h-4 w-4" />Arrêter après ce lot</Button>
          )}
          <Button variant="outline" onClick={() => void save(pauses)} disabled={writing}><Save className="mr-2 h-4 w-4" />Enregistrer</Button>
          <Button variant="outline" disabled={!pauses.length || writing} onClick={async () => downloadBlob(await buildVCDocx(exportBook), vcFileName(book.title, 'docx'))}><FileText className="mr-2 h-4 w-4" />Exporter Word</Button>
          <Button variant="outline" disabled={!pauses.length || writing} onClick={() => downloadBlob(buildVCPdf(exportBook), vcFileName(book.title, 'pdf'))}><FileDown className="mr-2 h-4 w-4" />Exporter PDF intérieur</Button>
        </div>
        <p className="mt-3 text-sm font-medium" aria-live="polite">
          {writing && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}{pauses.length} / {total} pauses rédigées
        </p>
        {error && <p role="alert" className="mt-2 rounded-md border border-destructive p-3 text-sm text-destructive">{error}</p>}
      </section>

      <div className="space-y-4">
        {pauses.map((p, i) => (
          <article key={i} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">Pause n°{i + 1}</span>
              <Input value={p.title} onChange={(e) => update(i, 'title', e.target.value)} aria-label={`Titre pause ${i + 1}`} />
              <Button size="sm" variant="ghost" aria-label={`Supprimer pause ${i + 1}`} onClick={() => setPauses((prev) => prev.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <Textarea rows={5} value={p.text} onChange={(e) => update(i, 'text', e.target.value)} aria-label={`Texte pause ${i + 1}`} />
            <Input className="mt-2" value={p.encart} placeholder="Encart (le saviez-vous, blague…)" onChange={(e) => update(i, 'encart', e.target.value)} aria-label={`Encart pause ${i + 1}`} />
          </article>
        ))}
      </div>
    </main>
  );
}
