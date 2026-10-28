import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Copy, ArrowLeft, FileDown, FileText, ImageIcon, Loader2, PenLine, Plus, Square, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { VC_FORMATS } from '@/lib/vcBooksExport';
import {
  GUIDE_CHAPTERS_MAX, GUIDE_CHAPTERS_MIN, GUIDE_IMAGE_STYLES, buildGuideDocx, buildGuidePdf, generateChapterImage,
  guideFileName, writeChapter, writeOutline, writeSheet, generateGuideCover, buildBookMockup, searchStockPhotos, trackStockPhoto, photoCredit, composePhotoCover, type StockPhoto, type GuideBook, type GuideChapter,
} from '@/lib/illustratedGuide';

type Row = GuideBook & { id: string; updated_at?: string };
const EMPTY = { title: '', subtitle: '', author_name: '', subject: '', audience: '', description: '', categories: '', image_style: 'photo', format: '6x9', chapter_count: 12 };
const sel = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

function download(blob: Blob, name: string) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export default function V3GuidesIllustresPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const id = params.get('guide');
  const [list, setList] = useState<Row[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [guide, setGuide] = useState<Row | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const stop = useRef({ stopped: false });

  async function loadList() {
    const { data } = await supabase.from('illustrated_guides').select('id, title, subtitle, author_name, subject, audience, image_style, format, chapter_count, chapters, cover_url, updated_at').order('updated_at', { ascending: false });
    setList((data ?? []) as unknown as Row[]);
  }
  useEffect(() => { void loadList(); }, []);
  useEffect(() => {
    if (!id) { setGuide(null); return; }
    void supabase.from('illustrated_guides').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!data) { setError('Guide introuvable.'); return; }
      setGuide({ ...(data as unknown as Row), chapters: Array.isArray(data.chapters) ? (data.chapters as unknown as GuideChapter[]) : [] });
    });
  }, [id]);

  async function persist(g: Row) {
    setGuide({ ...g });
    const { error: e } = await supabase.from('illustrated_guides').update({ chapters: g.chapters as unknown as never }).eq('id', g.id);
    if (e) toast.error('Enregistrement impossible.');
  }

  const [filling, setFilling] = useState(false);
  async function fillWithAI() {
    setError(''); setFilling(true);
    try { const sh = await writeSheet(form.title); setForm((f) => ({ ...f, ...sh })); toast.success('Fiche remplie par l’IA — vous pouvez tout modifier.'); }
    catch (e) { setError((e as Error).message); } finally { setFilling(false); }
  }

  // Sélecteur de photos Unsplash / Pixabay : target = index du chapitre ou 'cover'.
  const [picker, setPicker] = useState<{ target: number | 'cover'; query: string; photos: StockPhoto[] } | null>(null);
  const openPicker = (target: number | 'cover') => {
    const q = target === 'cover' ? (guide?.title ?? '') : (guide?.chapters[target]?.title ?? '');
    setPicker({ target, query: q, photos: [] }); void doSearch(target, q);
  };
  const doSearch = (target: number | 'cover', q: string) => run('search', async () => {
    const photos = await searchStockPhotos(q); setPicker({ target, query: q, photos });
    if (!photos.length) toast.info('Aucune photo trouvée, essayez d’autres mots-clés.');
  });
  const choosePhoto = (p: StockPhoto) => run('pick', async () => {
    if (!guide || !picker) return; trackStockPhoto(p);
    if (picker.target === 'cover') {
      const { data: u } = await supabase.auth.getUser(); if (!u.user) throw new Error('Connectez-vous.');
      const blob = await composePhotoCover(p.full, guide);
      const path = `${u.user.id}/guides/${guide.id}-cover-${Date.now()}.jpg`;
      const { error: ue } = await supabase.storage.from('ebook-images').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
      if (ue) throw new Error('Envoi de la couverture impossible.');
      const url = supabase.storage.from('ebook-images').getPublicUrl(path).data.publicUrl;
      await supabase.from('illustrated_guides').update({ cover_url: url }).eq('id', guide.id);
      setGuide({ ...guide, cover_url: url }); toast.success(`Couverture créée — ${photoCredit(p)}`);
    } else {
      const i = picker.target; const chapters = [...guide.chapters];
      chapters[i] = await savePhotoToChapter(guide.id, i, chapters[i], p);
      await persist({ ...guide, chapters }); toast.success('Photo ajoutée au chapitre.');
    }
    setPicker(null);
  });

  async function savePhotoToChapter(gid: string, i: number, c: GuideChapter, p: StockPhoto): Promise<GuideChapter> {
    // Les liens Pixabay expirent : la photo choisie est recopiée dans l'espace de l'auteur.
    const { data: u } = await supabase.auth.getUser(); if (!u.user) throw new Error('Connectez-vous.');
    const res = await fetch(p.full); if (!res.ok) throw new Error('Téléchargement de la photo impossible.');
    const path = `${u.user.id}/guides/${gid}-ch${i + 1}-${Date.now()}.jpg`;
    const { error: ue } = await supabase.storage.from('ebook-images').upload(path, await res.blob(), { contentType: 'image/jpeg', upsert: true });
    if (ue) throw new Error('Enregistrement de la photo impossible.');
    const url = supabase.storage.from('ebook-images').getPublicUrl(path).data.publicUrl;
    return { ...c, imageUrl: url, caption: `${c.caption ? c.caption + ' — ' : ''}${photoCredit(p)}` };
  }
  const photosForAll = () => run('photos-all', async () => {
    if (!guide) return; const g = { ...guide, chapters: [...guide.chapters] }; let added = 0;
    for (let i = 0; i < g.chapters.length; i++) {
      const c = g.chapters[i]; if (c.imageUrl) continue;
      let photos = await searchStockPhotos(`${guide.title} ${c.title}`.slice(0, 90));
      if (!photos.length) photos = await searchStockPhotos(c.title);
      if (!photos.length) photos = await searchStockPhotos(guide.title);
      const p = photos.find((x) => x.width >= x.height) ?? photos[0]; if (!p) continue;
      trackStockPhoto(p); g.chapters[i] = await savePhotoToChapter(g.id, i, c, p); added++;
      await persist({ ...g, chapters: [...g.chapters] });
    }
    toast.success(added ? `${added} photo(s) réaliste(s) ajoutée(s). Changez-les une à une si besoin.` : 'Tous les chapitres ont déjà une image.');
  });

  const makeCover = () => run('cover', async () => {
    if (!guide) return; const url = await generateGuideCover(guide);
    const { error: e } = await supabase.from('illustrated_guides').update({ cover_url: url }).eq('id', guide.id);
    if (e) throw new Error('Couverture créée mais non enregistrée.');
    setGuide({ ...guide, cover_url: url }); toast.success('Couverture créée.');
  });
  const makeMockup = () => run('mockup', async () => {
    if (!guide?.cover_url) return; download(await buildBookMockup(guide.cover_url), guideFileName(guide.title + '-mockup', 'png'));
  });
  const downloadCover = () => run('dlcover', async () => {
    if (!guide?.cover_url) return; download(await (await fetch(guide.cover_url)).blob(), guideFileName(guide.title + '-couverture', 'png'));
  });
  const copy = (t: string) => { void navigator.clipboard.writeText(t); toast.success('Copié.'); };

  async function create() {
    if (!form.title.trim()) { toast.error('Indiquez le titre du guide.'); return; }
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { toast.error('Connectez-vous pour créer un guide.'); return; }
    const count = Math.min(GUIDE_CHAPTERS_MAX, Math.max(GUIDE_CHAPTERS_MIN, Number(form.chapter_count) || 12));
    const { data, error: e } = await supabase.from('illustrated_guides').insert({ ...form, chapter_count: count, user_id: u.user.id }).select('id').single();
    if (e || !data) { toast.error('Création impossible.'); return; }
    toast.success('Guide enregistré.'); setForm(EMPTY); void loadList(); nav(`/v3/guides-illustres?guide=${data.id}`);
  }

  async function run<T>(label: string, fn: () => Promise<T>) {
    setError(''); setBusy(label);
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  }

  const outline = () => run('outline', async () => { if (!guide) return; const chapters = await writeOutline(guide); await persist({ ...guide, chapters }); toast.success(`Sommaire de ${chapters.length} chapitres prêt.`); });

  const writeAll = () => run('write', async () => {
    if (!guide) return; stop.current = { stopped: false };
    const g = { ...guide, chapters: [...guide.chapters] };
    for (let i = 0; i < g.chapters.length; i++) {
      if (stop.current.stopped) break;
      if (g.chapters[i].text) continue;
      g.chapters[i] = await writeChapter(g, g.chapters, i);
      await persist({ ...g, chapters: [...g.chapters] });
    }
  });

  const illustrate = (i: number) => run(`img-${i}`, async () => {
    if (!guide) return; const c = guide.chapters[i];
    const url = await generateChapterImage(guide.title, guide.image_style, c.imagePrompt || c.title);
    const chapters = [...guide.chapters]; chapters[i] = { ...c, imageUrl: url };
    await persist({ ...guide, chapters }); toast.success('Illustration ajoutée.');
  });

  function edit(i: number, patch: Partial<GuideChapter>) {
    if (!guide) return; const chapters = [...guide.chapters]; chapters[i] = { ...chapters[i], ...patch }; setGuide({ ...guide, chapters });
  }

  async function remove(gid: string) {
    if (!confirm('Supprimer ce guide ?')) return;
    await supabase.from('illustrated_guides').delete().eq('id', gid); void loadList();
  }

  const exportAs = (kind: 'docx' | 'pdf') => run(`exp-${kind}`, async () => {
    if (!guide) return;
    const blob = kind === 'docx' ? await buildGuideDocx(guide) : await buildGuidePdf(guide);
    download(blob, guideFileName(guide.title, kind));
  });

  if (guide) {
    const written = guide.chapters.filter((c) => c.text).length;
    const illustrated = guide.chapters.filter((c) => c.imageUrl).length;
    return <main className="v3-shell py-8">
      <Button asChild variant="ghost" size="sm"><Link to="/v3/guides-illustres"><ArrowLeft className="mr-2 h-4 w-4" />Mes guides illustrés</Link></Button>
      <header className="mb-6 mt-4 border-b border-border pb-5">
        <p className="text-sm font-semibold text-primary">Guide illustré · {GUIDE_IMAGE_STYLES[guide.image_style] ?? 'Photo réaliste'} · {VC_FORMATS[guide.format]?.label}</p>
        <h1 className="v3-serif text-3xl text-foreground">{guide.title}</h1>
        {guide.subtitle && <p className="text-muted-foreground">{guide.subtitle}</p>}
        <p className="mt-2 text-sm text-muted-foreground">{guide.chapters.length} chapitres · {written} rédigés · {illustrated} illustrés</p>
      </header>
      <section className="mb-6 grid gap-5 rounded-lg border border-border bg-card p-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-2">
          {guide.cover_url ? <img src={guide.cover_url} alt={`Couverture ${guide.title}`} className="w-full rounded-md border border-border" /> : <div className="flex aspect-[2/3] items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">Pas encore de couverture</div>}
          <Button size="sm" className="w-full" onClick={makeCover} disabled={!!busy}>{busy === 'cover' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}{guide.cover_url ? 'Refaire avec l’IA' : 'Couverture IA'}</Button>
          <Button size="sm" variant="secondary" className="w-full" onClick={() => openPicker('cover')} disabled={!!busy}><Search className="mr-2 h-4 w-4" />Couverture avec une photo</Button>
          {guide.cover_url && <>
            <Button size="sm" variant="outline" className="w-full" onClick={downloadCover} disabled={!!busy}><FileDown className="mr-2 h-4 w-4" />Télécharger la couverture</Button>
            <Button size="sm" variant="outline" className="w-full" onClick={makeMockup} disabled={!!busy}>{busy === 'mockup' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}Mockup 3D pour tunnel de vente</Button>
          </>}
        </div>
        <div className="space-y-3 text-sm">
          <h2 className="font-semibold text-foreground">Fiche KDP</h2>
          {([['Titre', guide.title], ['Sous-titre', guide.subtitle], ['Auteur', guide.author_name], ['Catégories', guide.categories || ''], ['Description', guide.description || '']] as const).map(([k, v]) => v ? <div key={k} className="flex items-start justify-between gap-2 border-b border-border pb-2"><div className="min-w-0"><p className="text-xs font-semibold text-muted-foreground">{k}</p><p className="whitespace-pre-line text-foreground">{v}</p></div><Button size="icon" variant="ghost" aria-label={`Copier ${k}`} onClick={() => copy(v)}><Copy className="h-4 w-4" /></Button></div> : null)}
          <p className="text-xs text-muted-foreground">Le prix et l’ISBN se renseignent directement sur KDP. Le mockup est un PNG transparent à poser dans vos pages de vente.</p>
        </div>
      </section>
      {error && <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={outline} disabled={!!busy}>{busy === 'outline' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}{guide.chapters.length ? 'Refaire le sommaire' : '1. Créer le sommaire'}</Button>
        {guide.chapters.length > 0 && (busy === 'write'
          ? <Button variant="outline" onClick={() => { stop.current.stopped = true; }}><Square className="mr-2 h-4 w-4" />Arrêter après ce chapitre</Button>
          : <Button onClick={writeAll} disabled={!!busy || written === guide.chapters.length}><PenLine className="mr-2 h-4 w-4" />2. Rédiger les chapitres</Button>)}
        {written > 0 && <>
          <Button variant="secondary" onClick={photosForAll} disabled={!!busy || !guide.chapters.length}>{busy === 'photos-all' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}3. Photos réalistes pour tous les chapitres</Button>
          <Button variant="outline" onClick={() => exportAs('docx')} disabled={!!busy}><FileText className="mr-2 h-4 w-4" />Export Word</Button>
          <Button variant="outline" onClick={() => exportAs('pdf')} disabled={!!busy}><FileDown className="mr-2 h-4 w-4" />Export PDF</Button>
        </>}
      </div>
      {busy === 'write' && <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Rédaction en cours, chapitre {written + 1}… chaque chapitre est enregistré dès qu’il est prêt.</p>}
      <p className="mb-4 text-sm text-muted-foreground">La rédaction utilise votre clé IA personnelle. Chaque illustration utilise le moteur d’images inclus.</p>
      <ol className="space-y-5">
        {guide.chapters.map((c, i) => <li key={i} className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
            <div className="space-y-2">
              {c.imageUrl ? <img src={c.imageUrl} alt={c.caption || c.title} className="w-full rounded-md border border-border object-cover" /> : <div className="flex aspect-[2/3] items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">Pas encore d’image</div>}
              <Button size="sm" variant="outline" className="w-full" onClick={() => illustrate(i)} disabled={!!busy}>{busy === `img-${i}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}{c.imageUrl ? 'Refaire en image IA' : 'Image IA'}</Button>
              <Button size="sm" variant="secondary" className="w-full" onClick={() => openPicker(i)} disabled={!!busy}><Search className="mr-2 h-4 w-4" />Photo Unsplash / Pixabay</Button>
            </div>
            <div className="space-y-2">
              <Input value={c.title} onChange={(e) => edit(i, { title: e.target.value })} onBlur={() => persist(guide)} className="font-semibold" aria-label={`Titre du chapitre ${i + 1}`} />
              <Label className="text-xs">Image souhaitée</Label>
              <Input value={c.imagePrompt} onChange={(e) => edit(i, { imagePrompt: e.target.value })} onBlur={() => persist(guide)} />
              <Textarea value={c.text} placeholder={c.summary} onChange={(e) => edit(i, { text: e.target.value })} onBlur={() => persist(guide)} rows={c.text ? 10 : 3} />
            </div>
          </div>
        </li>)}
      </ol>
      {picker && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={() => setPicker(null)}>
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-background p-5" onClick={(e) => e.stopPropagation()}>
          <h2 className="mb-3 font-semibold">{picker.target === 'cover' ? 'Photo de couverture' : `Photo du chapitre ${picker.target + 1}`} · Unsplash et Pixabay</h2>
          <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); void doSearch(picker.target, picker.query); }}>
            <Input value={picker.query} onChange={(e) => setPicker({ ...picker, query: e.target.value })} placeholder="poisson clown, aquarium récifal…" />
            <Button type="submit" disabled={!!busy}>{busy === 'search' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </form>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {picker.photos.map((p) => <button key={p.id} type="button" disabled={!!busy} onClick={() => choosePhoto(p)} className="group overflow-hidden rounded-md border border-border text-left">
              <img src={p.thumb} alt={photoCredit(p)} loading="lazy" className="aspect-[2/3] w-full object-cover transition group-hover:opacity-80" />
              <span className="block truncate px-2 py-1 text-xs text-muted-foreground">{photoCredit(p)}</span>
            </button>)}
          </div>
          {busy === 'pick' && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Préparation de la photo…</p>}
          <div className="mt-4 text-right"><Button variant="ghost" onClick={() => setPicker(null)}>Fermer</Button></div>
        </div>
      </div>}
    </main>;
  }

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  return <main className="v3-shell py-8">
    <header className="mb-8 border-b border-border pb-6">
      <p className="text-sm font-semibold text-primary">Livres spéciaux · Auteur et Édition</p>
      <h1 className="v3-serif text-3xl text-foreground">Guides illustrés</h1>
      <p className="mt-1 text-muted-foreground">Des guides pratiques type « L’aquarium de A à Z » : texte complet chapitre par chapitre, une image par chapitre, export Word et PDF au format KDP.</p>
    </header>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <form className="space-y-4 rounded-lg border border-border bg-card p-5" onSubmit={(e) => { e.preventDefault(); void create(); }}>
        <h2 className="flex items-center gap-2 font-semibold"><Plus className="h-4 w-4" />Nouveau guide</h2>
        <div className="space-y-1"><Label htmlFor="g-title">Titre</Label><Input id="g-title" value={form.title} onChange={set('title')} placeholder="L’aquarium de A à Z" maxLength={200} /></div>
        <Button type="button" variant="secondary" className="w-full" onClick={fillWithAI} disabled={filling || !form.title.trim()}>{filling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Remplir toute la fiche avec l’IA</Button>
        {error && !guide && <p className="rounded-md border border-destructive/40 bg-destructive/5 p-2 text-sm text-destructive">{error}</p>}
        <div className="space-y-1"><Label htmlFor="g-sub">Sous-titre</Label><Input id="g-sub" value={form.subtitle} onChange={set('subtitle')} maxLength={250} /></div>
        <div className="space-y-1"><Label htmlFor="g-author">Auteur</Label><Input id="g-author" value={form.author_name} onChange={set('author_name')} maxLength={120} /></div>
        <div className="space-y-1"><Label htmlFor="g-subject">Sujet et contenu attendu</Label><Textarea id="g-subject" value={form.subject} onChange={set('subject')} rows={3} placeholder="Installer, peupler et entretenir un aquarium d’eau douce" /></div>
        <div className="space-y-1"><Label htmlFor="g-aud">Public</Label><Input id="g-aud" value={form.audience} onChange={set('audience')} placeholder="Débutants adultes" /></div>
        <div className="space-y-1"><Label htmlFor="g-desc">Description Amazon (≈ 150 mots)</Label><Textarea id="g-desc" value={form.description} onChange={set('description')} rows={6} /></div>
        <div className="space-y-1"><Label htmlFor="g-cat">Catégories KDP</Label><Input id="g-cat" value={form.categories} onChange={set('categories')} /></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1"><Label htmlFor="g-n">Chapitres</Label><Input id="g-n" type="number" min={GUIDE_CHAPTERS_MIN} max={GUIDE_CHAPTERS_MAX} value={form.chapter_count} onChange={(e) => setForm({ ...form, chapter_count: Number(e.target.value) })} /></div>
          <div className="space-y-1"><Label htmlFor="g-style">Images</Label><select id="g-style" className={sel} value={form.image_style} onChange={set('image_style')}>{Object.entries(GUIDE_IMAGE_STYLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          <div className="space-y-1"><Label htmlFor="g-fmt">Format</Label><select id="g-fmt" className={sel} value={form.format} onChange={set('format')}>{Object.entries(VC_FORMATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        </div>
        <Button type="submit" className="w-full">Enregistrer et ouvrir le guide</Button>
      </form>
      <section>
        <h2 className="mb-3 font-semibold">Mes guides</h2>
        {!list.length && <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">Aucun guide pour l’instant.</p>}
        <ul className="space-y-2">{list.map((g) => {
          const ch = Array.isArray(g.chapters) ? g.chapters : [];
          return <li key={g.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
            <Link to={`/v3/guides-illustres?guide=${g.id}`} className="min-w-0"><p className="truncate font-medium text-foreground">{g.title}</p><p className="text-xs text-muted-foreground">{ch.filter((c) => c.text).length}/{ch.length || g.chapter_count} chapitres rédigés · {ch.filter((c) => c.imageUrl).length} images</p></Link>
            <Button size="icon" variant="ghost" aria-label="Supprimer" onClick={() => remove(g.id)}><Trash2 className="h-4 w-4" /></Button>
          </li>;
        })}</ul>
      </section>
    </div>
  </main>;
}
