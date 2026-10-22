import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import robot from '@/assets/plans/vc-books-robot.png';

const FORMATS = [
  { value: 'poche', label: 'Poche (12,7 × 20,3 cm)' },
  { value: 'demi-lettre', label: 'Demi-lettre (14 × 21,6 cm)' },
  { value: '6x9', label: '6 × 9 pouces (15,2 × 22,9 cm)' },
] as const;

export default function V3VCBooksCreatePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get('livre');

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState<string>('poche');
  const [pages, setPages] = useState('200');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(editId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    void (async () => {
      const { data, error: loadError } = await supabase
        .from('vc_books')
        .select('title, author_name, theme, description, format, target_pages')
        .eq('id', editId)
        .maybeSingle();
      if (cancelled) return;
      if (loadError || !data) {
        setError('Impossible de charger ce livre.');
      } else {
        setTitle(data.title);
        setAuthor(data.author_name);
        setTheme(data.theme);
        setDescription(data.description);
        setFormat(data.format);
        setPages(String(data.target_pages));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [editId]);

  async function save() {
    if (busy) return;
    setError('');
    const targetPages = Number.parseInt(pages, 10);
    if (!title.trim()) { setError('Le titre est obligatoire.'); return; }
    if (!Number.isFinite(targetPages) || targetPages < 40 || targetPages > 300) {
      setError('Le nombre de pages doit être entre 40 et 300.');
      return;
    }
    setBusy(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error('Connectez-vous pour enregistrer votre livre.');
      const payload = {
        title: title.trim(),
        author_name: author.trim(),
        theme: theme.trim(),
        description: description.trim(),
        format,
        target_pages: targetPages,
      };
      if (editId) {
        const { error: updateError } = await supabase.from('vc_books').update(payload).eq('id', editId);
        if (updateError) throw updateError;
        toast.success('Livre mis à jour.');
      } else {
        const { error: insertError } = await supabase.from('vc_books').insert({ ...payload, user_id: userId });
        if (insertError) throw insertError;
        toast.success('Livre enregistré dans votre bibliothèque VC Books.');
      }
      navigate('/v3/vc-books/bibliotheque');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'L’enregistrement a échoué.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="v3-shell max-w-3xl py-8">
      <Button asChild variant="ghost" size="sm">
        <Link to="/v3/vc-books/bibliotheque"><ArrowLeft className="mr-2 h-4 w-4" />Bibliothèque VC Books</Link>
      </Button>
      <header className="mb-8 mt-4 flex items-center gap-4 border-b border-border pb-6">
        <img src={robot} alt="Robot VC Books" className="h-20 w-20 object-contain" />
        <div>
          <p className="text-sm font-semibold text-primary">VC Books</p>
          <h1 className="v3-serif text-3xl text-foreground">{editId ? 'Modifier le livre' : 'Créer un livre'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">La fiche de votre livre humoristique — l’atelier d’images la reprendra tout seul.</p>
        </div>
      </header>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Chargement…</p>
      ) : (
        <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void save(); }}>
          <div className="space-y-2">
            <Label htmlFor="vc-book-title">Titre du livre</Label>
            <Input id="vc-book-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required placeholder="Ex. Le Petit Cabinet des grandes curiosités" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vc-book-author">Nom d’auteur</Label>
            <Input id="vc-book-author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={100} placeholder="Le nom qui apparaîtra sur la couverture" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vc-book-theme">Thème</Label>
            <Input id="vc-book-theme" value={theme} onChange={(e) => setTheme(e.target.value)} maxLength={200} placeholder="Ex. curiosités insolites, histoire vraie amusante, records absurdes" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vc-book-desc">Description</Label>
            <Textarea id="vc-book-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={2000} placeholder="De quoi parle le livre ? Quel ton, quel public ?" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vc-book-format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="vc-book-format"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMATS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vc-book-pages">Nombre de pages visé</Label>
              <Input id="vc-book-pages" type="number" min={40} max={300} value={pages} onChange={(e) => setPages(e.target.value)} />
              <p className="text-xs text-muted-foreground">De 40 à 300 pages — un livre de 200 pages et plus est accepté.</p>
            </div>
          </div>
          {error && <p role="alert" className="rounded-md border border-destructive p-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy || !title.trim()} className="w-full sm:w-auto">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {busy ? 'Enregistrement…' : editId ? 'Enregistrer les modifications' : 'Enregistrer le livre'}
          </Button>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Après l’enregistrement, retrouvez le livre dans la bibliothèque et ouvrez-le dans l’atelier d’images.
          </p>
        </form>
      )}
    </main>
  );
}
