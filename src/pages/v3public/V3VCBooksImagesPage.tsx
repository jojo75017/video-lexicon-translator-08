import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookMarked, Download, ImagePlus, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { buildVCImagePrompt, type VCImageKind } from '@/lib/vcBooksImages';
import reference from '@/assets/vc-books/style-reference.png.asset.json';
import robot from '@/assets/plans/vc-books-robot.png';
import V3VCBooksKdpSheet from '@/components/v3public/V3VCBooksKdpSheet';

interface GeneratedImage { id: string; url: string; title: string; kind: VCImageKind }
interface VCBookRef { id: string; title: string; author_name: string; theme: string; cover_url: string | null }

export default function V3VCBooksImagesPage() {
  const [params] = useSearchParams();
  const bookId = params.get('livre');
  const [book, setBook] = useState<VCBookRef | null>(null);
  const [kind, setKind] = useState<VCImageKind>('cover');
  const [scene, setScene] = useState('Un poulpe orange à lunettes lit un livre aux toilettes, entouré d’un globe, d’une loupe et d’objets insolites. Expression curieuse et amusante.');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [withText, setWithText] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const current = images.find((image) => image.id === selected) ?? images[0];

  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from('vc_books')
        .select('id, title, author_name, theme, cover_url')
        .eq('id', bookId)
        .maybeSingle();
      if (cancelled || !data) return;
      setBook(data);
      setTitle(data.title);
      setAuthor(data.author_name);
      setWithText(true);
      if (data.theme) setScene(`Illustration humoristique sur le thème : ${data.theme}. Personnage amusant aux toilettes, entouré d’objets insolites liés au thème.`);
      if (data.cover_url) {
        const cover: GeneratedImage = { id: 'cover-actuelle', url: data.cover_url, title: data.title, kind: 'cover' };
        setImages((previous) => [cover, ...previous]);
        setSelected(cover.id);
      }
    })();
    return () => { cancelled = true; };
  }, [bookId]);

  async function saveAsCover(image: GeneratedImage) {
    if (!book || savingCover) return;
    setSavingCover(true);
    try {
      const { error: updateError } = await supabase.from('vc_books').update({ cover_url: image.url }).eq('id', book.id);
      if (updateError) throw updateError;
      setBook({ ...book, cover_url: image.url });
      toast.success('Couverture enregistrée sur le livre.');
    } catch {
      toast.error('Impossible d’enregistrer la couverture.');
    } finally {
      setSavingCover(false);
    }
  }

  async function generate() {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const prompt = buildVCImagePrompt({ kind, scene, title, subtitle, author, withText });
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Connectez-vous pour créer votre illustration.');
      const { data, error: requestError } = await supabase.functions.invoke('generate-ai-cover', {
        body: { title: title.trim() || 'VC Books', subtitle, author, format: 'kindle', userPrompt: prompt, customPrompt: prompt, genre: 'Humour et curiosités' },
      });
      if (requestError) {
        let message = requestError.message;
        if (requestError.context instanceof Response) {
          const details = await requestError.context.clone().json().catch(() => null);
          if (typeof details?.error === 'string') message = details.error;
        }
        throw new Error(message);
      }
      if (data?.error) throw new Error(data.error);
      if (typeof data?.imageUrl !== 'string' || !data.imageUrl) throw new Error('Aucune illustration reçue.');
      const image: GeneratedImage = { id: crypto.randomUUID(), url: data.imageUrl, title: title.trim() || 'VC Books', kind };
      setImages((previous) => [image, ...previous]);
      setSelected(image.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'La création de l’illustration a échoué.');
    } finally { setBusy(false); }
  }

  async function download(image: GeneratedImage) {
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error('Le téléchargement a échoué.');
      const blob = await response.blob();
      const ext = blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/webp' ? 'webp' : 'png';
      saveAs(blob, `vc-books-${image.kind}-${image.id.slice(0, 8)}.${ext}`);
    } catch { toast.error('Impossible de télécharger cette illustration.'); }
  }

  return <main className="v3-shell py-8">
    <Button asChild variant="ghost" size="sm"><Link to="/v3/vc-books/bibliotheque"><ArrowLeft className="mr-2 h-4 w-4" />Bibliothèque VC Books</Link></Button>
    <header className="mb-8 mt-4 flex items-center gap-4 border-b border-border pb-6">
      <img src={robot} alt="Robot VC Books" className="h-20 w-20 object-contain" />
      <div><p className="text-sm font-semibold text-primary">VC Books</p><h1 className="v3-serif text-3xl text-foreground">Atelier d’images</h1><p className="mt-1 text-sm text-muted-foreground">Couvertures humoristiques · Illustrations intérieures</p></div>
    </header>
    {book && <p className="mb-6 flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm text-foreground"><BookMarked className="h-4 w-4 text-primary" />Livre sélectionné : <strong>{book.title}</strong>{book.author_name ? ` — ${book.author_name}` : ''}. L’atelier a repris son titre, son auteur et son thème.</p>}
    {!book && <p className="mb-6 rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">Aucun livre sélectionné. <Link to="/v3/vc-books/bibliotheque" className="font-medium text-primary underline">Choisissez un livre dans votre bibliothèque</Link> pour que l’atelier le reprenne tout seul, ou créez une illustration libre ci-dessous.</p>}
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void generate(); }}>
        <Tabs value={kind} onValueChange={(value) => setKind(value as VCImageKind)}><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="cover">Couverture couleur</TabsTrigger><TabsTrigger value="interior">Intérieur N&B</TabsTrigger></TabsList></Tabs>
        <div className="space-y-2"><Label htmlFor="vc-scene">Scène et personnages</Label><Textarea id="vc-scene" value={scene} onChange={(event) => setScene(event.target.value)} rows={5} maxLength={4000} required /></div>
        {kind === 'cover' && <>
          <div className="flex items-center gap-2"><Checkbox id="vc-text" checked={withText} onCheckedChange={(value) => setWithText(value === true)} /><Label htmlFor="vc-text">Inclure le titre et l’auteur dans l’image</Label></div>
          <div className="space-y-2"><Label htmlFor="vc-title">Titre du livre</Label><Input id="vc-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required={withText} /></div>
          {withText && <><div className="space-y-2"><Label htmlFor="vc-subtitle">Sous-titre</Label><Input id="vc-subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={300} /></div><div className="space-y-2"><Label htmlFor="vc-author">Auteur</Label><Input id="vc-author" value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={100} /></div></>}
        </>}
        {error && <p role="alert" className="rounded-md border border-destructive p-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy || !scene.trim()} className="w-full">{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}{busy ? 'Création en cours…' : 'Créer l’illustration'}</Button>
        <details className="border-t border-border pt-4"><summary className="cursor-pointer text-sm font-medium text-foreground">Modèle de Georges</summary><img src={reference.url} alt="Couverture de référence : Le Petit Cabinet des grandes curiosités, poulpe illustré sur fond jaune" className="mt-3 max-h-96 w-full object-contain" /></details>
      </form>
      <section aria-label="Illustrations VC Books" className="min-w-0">
        <div className="flex min-h-[500px] items-center justify-center rounded-md border border-border bg-muted p-4">
          {current ? <img src={current.url} alt={current.title} className="max-h-[650px] max-w-full object-contain" /> : <div className="text-center"><ImagePlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground" /><p className="text-sm text-muted-foreground">Aucune illustration créée</p></div>}
        </div>
        {current && <div className="mt-3 flex flex-wrap gap-3"><Button variant="outline" onClick={() => void download(current)}><Download className="mr-2 h-4 w-4" />Télécharger l’image</Button>{book && current.kind === 'cover' && current.id !== 'cover-actuelle' && <Button variant="outline" onClick={() => void saveAsCover(current)} disabled={savingCover}>{savingCover ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookMarked className="mr-2 h-4 w-4" />}Définir comme couverture du livre</Button>}<Button asChild variant="ghost"><Link to="/v3/mes-couvertures">Mes couvertures</Link></Button></div>}
        {images.length > 1 && <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">{images.map((image, index) => <Button key={image.id} variant="outline" onClick={() => setSelected(image.id)} aria-label={`Voir l’illustration ${index + 1}`} className="h-36 p-1"><img src={image.url} alt="" className="h-full w-full object-contain" /></Button>)}</div>}
      </section>
    </div>
    <V3VCBooksKdpSheet key={book?.id ?? 'free'} title={title} author={author} theme={book?.theme ?? ''} />
  </main>;
}