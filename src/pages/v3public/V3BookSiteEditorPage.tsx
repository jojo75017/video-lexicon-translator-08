import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ExternalLink, Globe, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BookSiteView } from '@/pages/livre/BookSitePage';
import { loadStudioCovers, indexCoversByTitle, normalizeTitle, LONG_SIGNED_TTL } from '@/lib/studioCovers';
import { getSignedCoverUrl } from '@/lib/coverProjects';
import { BOOK_SITE_BACKGROUNDS } from '@/lib/bookSite/backgrounds';
import { BOOK_SITE_THEMES, detectBookSiteTheme, firstExcerpt, slugifyTitle, type BookSiteTheme } from '@/lib/bookSite/themes';

const db = supabase as unknown as { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
type Form = { id?: string; slug: string; title: string; subtitle: string; author_name: string; description: string; excerpt_title: string; excerpt: string; cover_url: string; theme: BookSiteTheme; amazon_kindle_url: string; amazon_paperback_url: string; published: boolean };

export default function V3BookSiteEditorPage() {
  const { projectId = '' } = useParams();
  const nav = useNavigate();
  const [userId, setUserId] = useState('');
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const set = (patch: Partial<Form>) => setF((p) => (p ? { ...p, ...patch } : p));

  useEffect(() => { void (async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { nav('/v3/auth'); return; }
    setUserId(auth.user.id);
    const { data: existing } = await db.from('book_sites').select('*').eq('user_id', auth.user.id).eq('project_id', projectId).maybeSingle();
    if (existing) { setF(Object.fromEntries(Object.entries(existing).map(([k, v]) => [k, v ?? ''])) as unknown as Form); return; }
    const { data: b, error } = await supabase.from('ebook_projects').select('title,author_name,kdp_description,chapters,project_type').eq('id', projectId).eq('user_id', auth.user.id).maybeSingle();
    if (error || !b) { toast.error('Livre introuvable.'); nav('/v3/mes-livres'); return; }
    const ex = firstExcerpt(b.chapters);
    const plain = (b.kdp_description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const fallback = ex.text ? ex.text.split(/\n\n/)[0].slice(0, 400) + (ex.text.length > 400 ? '…' : '') : '';
    let cover = '';
    try {
      const match = indexCoversByTitle(await loadStudioCovers())[normalizeTitle(b.title)];
      if (match?.thumbPath) cover = (await getSignedCoverUrl(match.thumbPath, LONG_SIGNED_TTL)) || '';
    } catch { /* pas de couverture trouvée */ }
    const [mainTitle, ...rest] = (b.title || '').split(/\s*:\s*/);
    setF({ slug: slugifyTitle(b.title || ''), title: mainTitle || b.title || '', subtitle: rest.join(' : '), author_name: b.author_name || '', description: plain || fallback,
      excerpt_title: ex.title, excerpt: ex.text, cover_url: cover, theme: detectBookSiteTheme(`${b.title} ${b.kdp_description || ''} ${b.project_type || ''}`),
      amazon_kindle_url: '', amazon_paperback_url: '', published: false });
  })(); }, [projectId]); // eslint-disable-line

  async function uploadCover(file: File) {
    if (file.size > 5_000_000) return toast.error('Image trop lourde (5 Mo maximum).');
    const path = `${userId}/book-sites/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
    const { error } = await supabase.storage.from('ebook-images').upload(path, file);
    if (error) return toast.error(`Envoi impossible : ${error.message}`);
    set({ cover_url: supabase.storage.from('ebook-images').getPublicUrl(path).data.publicUrl });
  }

  async function save(publish: boolean) {
    if (!f) return;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug) || f.slug.length < 3) return toast.error('Adresse invalide : lettres minuscules, chiffres et tirets.');
    for (const u of [f.amazon_kindle_url, f.amazon_paperback_url, f.cover_url]) if (u && !/^https:\/\//.test(u)) return toast.error('Les liens doivent commencer par https://');
    setSaving(true);
    const n = (v: string) => v.trim() || null;
    const row = { user_id: userId, project_id: projectId, slug: f.slug, title: f.title.trim(), subtitle: n(f.subtitle), author_name: n(f.author_name), description: n(f.description),
      excerpt_title: n(f.excerpt_title), excerpt: n(f.excerpt.slice(0, 6000)), cover_url: n(f.cover_url), theme: f.theme,
      amazon_kindle_url: n(f.amazon_kindle_url), amazon_paperback_url: n(f.amazon_paperback_url), published: publish, updated_at: new Date().toISOString() };
    const q = f.id ? db.from('book_sites').update(row).eq('id', f.id).select().single() : db.from('book_sites').insert(row).select().single();
    const { data, error } = await q;
    setSaving(false);
    if (error) return toast.error(error.code === '23505' ? 'Cette adresse est déjà prise, choisissez-en une autre.' : error.message);
    set({ id: data.id, published: publish });
    toast.success(publish ? 'Site publié ✓' : 'Brouillon enregistré ✓');
  }

  if (!f) return <div className="flex justify-center p-16"><Loader2 className="animate-spin" /></div>;
  const field = 'w-full rounded border border-border bg-background px-3 py-2 text-sm';
  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[380px_1fr]">
      <aside className="book-site-editor space-y-4 rounded-lg border border-border bg-card p-4 text-card-foreground lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
        <h1 className="flex items-center gap-2 text-xl font-bold"><Globe className="h-5 w-5" /> Site web du livre</h1>
        <div><p className="mb-2 text-sm font-semibold">Ambiance</p><div className="grid grid-cols-2 gap-2">
          {BOOK_SITE_THEMES.map((t) => <button key={t.id} onClick={() => set({ theme: t.id })} className={`v3-chip-toggle overflow-hidden rounded border p-0 text-left text-xs ${f.theme === t.id ? 'border-primary ring-2 ring-primary' : 'border-border'}`}><img src={BOOK_SITE_BACKGROUNDS[t.id]} alt="" className="h-12 w-full object-cover" loading="lazy" /><span className="block p-2"><b className="block">{t.emoji} {t.label}</b>{t.hint}</span></button>)}
        </div></div>
        <p className="rounded border border-border bg-background p-3 text-sm text-foreground">✨ Tout est rempli automatiquement depuis votre livre : titre, auteur, présentation, extrait et couverture. Il ne reste qu’à cliquer sur « Publier le site ».</p>
        <button type="button" onClick={() => setShowDetails((v) => !v)} className="v3-chip-toggle text-sm font-semibold underline">{showDetails ? 'Masquer les détails' : 'Modifier les détails (facultatif)'}</button>
        {showDetails && <div className="space-y-4">
        <label className="block text-sm font-medium">Adresse<div className="flex items-center gap-1 text-xs text-muted-foreground">ebookstudio.fr/livre/<input className={field} value={f.slug} onChange={(e) => set({ slug: e.target.value.toLowerCase() })} /></div></label>
        <label className="block text-sm font-medium">Titre<input className={field} value={f.title} onChange={(e) => set({ title: e.target.value })} /></label>
        <label className="block text-sm font-medium">Sous-titre<input className={field} value={f.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></label>
        <label className="block text-sm font-medium">Auteur<input className={field} value={f.author_name} onChange={(e) => set({ author_name: e.target.value })} /></label>
        <label className="block text-sm font-medium">Présentation<textarea rows={5} className={field} value={f.description} onChange={(e) => set({ description: e.target.value })} /></label>
        <div className="text-sm font-medium">Couverture
          <label className="v3-btn v3-btn-outline mt-1 cursor-pointer text-xs"><Upload className="h-3.5 w-3.5" /> Choisir une image<input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && void uploadCover(e.target.files[0])} /></label></div>
        <label className="block text-sm font-medium">Lien Amazon Kindle<input className={field} placeholder="https://www.amazon.fr/dp/..." value={f.amazon_kindle_url} onChange={(e) => set({ amazon_kindle_url: e.target.value })} /></label>
        <label className="block text-sm font-medium">Lien Amazon broché<input className={field} placeholder="https://www.amazon.fr/dp/..." value={f.amazon_paperback_url} onChange={(e) => set({ amazon_paperback_url: e.target.value })} /></label>
        <label className="block text-sm font-medium">Titre de l’extrait<input className={field} value={f.excerpt_title} onChange={(e) => set({ excerpt_title: e.target.value })} /></label>
        <label className="block text-sm font-medium">Extrait (premières pages)<textarea rows={8} className={field} value={f.excerpt} onChange={(e) => set({ excerpt: e.target.value })} /></label>
        </div>}
        <div className="flex flex-wrap gap-2">
          <button disabled={saving} onClick={() => void save(false)} className="v3-btn v3-btn-outline text-xs">Enregistrer le brouillon</button>
          <button disabled={saving || !f.title.trim()} onClick={() => void save(true)} className="v3-btn v3-btn-primary text-xs">{f.published ? 'Mettre à jour le site' : 'Publier le site'}</button>
          {f.published && <a href={`/livre/${f.slug}`} target="_blank" rel="noopener" className="v3-btn v3-btn-outline text-xs"><ExternalLink className="h-3.5 w-3.5" /> Voir en ligne</a>}
        </div>
      </aside>
      <div className="overflow-hidden rounded-lg border border-border"><BookSiteView preview site={{ ...f, user_id: userId, subtitle: f.subtitle || null, author_name: f.author_name || null, description: f.description || null, excerpt_title: f.excerpt_title || null, excerpt: f.excerpt || null, cover_url: f.cover_url || null, amazon_kindle_url: f.amazon_kindle_url || null, amazon_paperback_url: f.amazon_paperback_url || null }} /></div>
    </div>
  );
}
