import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Check, Download, Image as ImageIcon, Loader2, LockKeyhole, Plus, Printer, RotateCcw, Save, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ILLUSTRATION_STYLES } from '@/config/kidsBookConfig';
import {
  ALBUM_PAGE_COUNTS,
  buildLockedCharactersPrompt,
  createAlbumCharacter,
  createIllustratedAlbumDraft,
  type AlbumCharacter,
  type AlbumPage,
  type IllustratedAlbumDraft,
} from '@/config/illustratedAlbumConfig';
import { useProjectSave } from '@/hooks/useProjectSave';

const STORAGE_KEY = 'v3_illustrated_album_draft_v1';
const PROJECT_KEY = 'v3_illustrated_album_project_id';
const STEPS = ['Le livre', 'Personnages', 'Pages', 'Illustrations', 'Export'];

function loadDraft(): IllustratedAlbumDraft {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as IllustratedAlbumDraft;
  } catch { /* brouillon neuf */ }
  return createIllustratedAlbumDraft();
}

function safeSlug(value: string) {
  return (value || 'album-illustre').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

export default function V3IllustratedAlbumPage() {
  const [draft, setDraft] = useState<IllustratedAlbumDraft>(loadDraft);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [imageProgress, setImageProgress] = useState({ done: 0, total: 0 });
  const [projectId, setProjectId] = useState<string | null>(() => localStorage.getItem(PROJECT_KEY));
  const { saveSpecializedProject, updateSpecializedProject } = useProjectSave();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const lockedCount = useMemo(() => draft.characters.filter((character) => character.locked && character.referenceUrl).length, [draft.characters]);
  const illustratedCount = useMemo(() => draft.pages.filter((page) => page.illustrationUrl).length, [draft.pages]);
  const update = (patch: Partial<IllustratedAlbumDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const updateCharacter = (id: string, patch: Partial<AlbumCharacter>) => update({ characters: draft.characters.map((character) => character.id === id ? { ...character, ...patch, ...(patch.referenceUrl === undefined ? { locked: false } : {}) } : character) });
  const updatePage = (id: string, patch: Partial<AlbumPage>) => update({ pages: draft.pages.map((page) => page.id === id ? { ...page, ...patch } : page) });

  const requireBook = () => {
    if (!draft.title.trim() || !draft.authorName.trim() || !draft.pitch.trim()) {
      toast.error('Complétez le titre, le nom d’auteur et l’histoire avant de continuer.');
      setStep(0);
      return false;
    }
    return true;
  };

  const generateReference = async (character: AlbumCharacter) => {
    if (!character.name.trim() || !character.physical.trim() || !character.outfit.trim()) {
      return toast.error('Indiquez le nom, l’apparence et la tenue du personnage.');
    }
    setBusy(`character-${character.id}`);
    try {
      const style = ILLUSTRATION_STYLES.find((item) => item.id === draft.style)?.prompt || '';
      const { data, error } = await supabase.functions.invoke('agent-illustrator', {
        body: {
          bookId: 'album-reference',
          storyId: character.id,
          characterBible: buildLockedCharactersPrompt([character]),
          scene: `Planche de référence du personnage ${character.name}, vue de face en pied, pose neutre, expression chaleureuse, fond uni clair, aucun texte.`,
          stylePrompt: style,
        },
      });
      if (error || !data?.url) throw new Error(data?.error || error?.message || 'Image non reçue');
      updateCharacter(character.id, { referenceUrl: data.url, locked: false });
      toast.success('Référence créée. Vérifiez-la puis verrouillez le personnage.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de créer la référence.');
    } finally {
      setBusy(null);
    }
  };

  const generateStoryBoard = async () => {
    if (!requireBook()) return;
    if (draft.characters.some((character) => !character.locked || !character.referenceUrl)) {
      setStep(1);
      return toast.error('Créez puis verrouillez chaque personnage avant le découpage.');
    }
    setBusy('storyboard');
    try {
      const { data, error } = await supabase.functions.invoke('album-illustrated-story', {
        body: {
          title: draft.title,
          targetAge: draft.targetAge,
          pitch: draft.pitch,
          moral: draft.moral,
          pageCount: draft.pageCount,
          characters: draft.characters.map(({ referenceUrl: _referenceUrl, locked: _locked, ...character }) => character),
        },
      });
      if (error || !Array.isArray(data?.pages)) throw new Error(data?.error || error?.message || 'Découpage non reçu');
      const pages = data.pages.slice(0, draft.pageCount).map((page: Partial<AlbumPage>, index: number) => ({
        id: crypto.randomUUID(),
        pageNumber: index + 1,
        text: String(page.text || ''),
        scene: String(page.scene || ''),
        characters: Array.isArray(page.characters) ? page.characters.map(String) : [],
      }));
      if (pages.length !== draft.pageCount) throw new Error(`Le découpage contient ${pages.length} pages au lieu de ${draft.pageCount}.`);
      update({ pages });
      setStep(2);
      toast.success(`${pages.length} pages créées. Relisez-les avant les illustrations.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de créer le découpage.');
    } finally {
      setBusy(null);
    }
  };

  const generatePageImage = async (page: AlbumPage) => {
    const references = draft.characters.filter((character) => page.characters.includes(character.name) && character.referenceUrl);
    const fallbackReferences = references.length ? references : draft.characters.filter((character) => character.referenceUrl);
    const style = ILLUSTRATION_STYLES.find((item) => item.id === draft.style)?.prompt || '';
    const { data, error } = await supabase.functions.invoke('agent-illustrator', {
      body: {
        bookId: projectId || 'album-draft',
        storyId: page.id,
        characterBible: buildLockedCharactersPrompt(draft.characters),
        referenceImageUrls: fallbackReferences.map((character) => character.referenceUrl),
        scene: `Page ${page.pageNumber} sur ${draft.pageCount}. ${page.scene}. Le texte ne doit pas apparaître dans l’image. Continuité stricte avec la page précédente et les références.`,
        stylePrompt: style,
      },
    });
    if (error || !data?.url) throw new Error(data?.error || error?.message || 'Illustration non reçue');
    updatePage(page.id, { illustrationUrl: data.url });
    return data.url as string;
  };

  const generateAllImages = async () => {
    if (!draft.pages.length) return toast.error('Créez d’abord le découpage page par page.');
    setBusy('images');
    setStep(3);
    setImageProgress({ done: illustratedCount, total: draft.pages.length });
    let completed = illustratedCount;
    for (const page of draft.pages) {
      if (page.illustrationUrl) continue;
      try {
        await generatePageImage(page);
        completed += 1;
        setImageProgress({ done: completed, total: draft.pages.length });
      } catch (error) {
        toast.error(`Page ${page.pageNumber} : ${error instanceof Error ? error.message : 'échec'}`);
        break;
      }
    }
    setBusy(null);
    if (completed === draft.pages.length) toast.success('Toutes les illustrations sont terminées.');
  };

  const regeneratePage = async (page: AlbumPage) => {
    setBusy(`page-${page.id}`);
    try {
      await generatePageImage(page);
      toast.success(`Illustration de la page ${page.pageNumber} mise à jour.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de régénérer cette page.');
    } finally {
      setBusy(null);
    }
  };

  const saveProject = async () => {
    if (!requireBook()) return;
    setBusy('save');
    const payload = {
      title: draft.title,
      author_name: draft.authorName,
      project_type: 'ebook' as const,
      target_audience: draft.targetAge,
      book_summary: draft.pitch,
      narrative_format: 'album_illustre_3_6',
      number_of_chapters: draft.pages.length || draft.pageCount,
      characters: draft.characters,
      chapters: draft.pages.map((page) => ({ chapter_number: page.pageNumber, title: `Page ${page.pageNumber}`, content: page.text, synopsis: page.scene, illustration_url: page.illustrationUrl || null })),
      ebook_images: draft.pages.filter((page) => page.illustrationUrl).map((page) => ({ type: 'album_page', page: page.pageNumber, url: page.illustrationUrl })),
      writing_style: draft.style,
      preface: draft.moral,
      conclusion: draft.backCoverText,
      detail_level: JSON.stringify({ illustratedAlbumDraft: draft }),
    };
    const savedId = projectId
      ? (await updateSpecializedProject(projectId, payload) ? projectId : null)
      : await saveSpecializedProject(payload);
    if (savedId) {
      setProjectId(savedId);
      localStorage.setItem(PROJECT_KEY, savedId);
    }
    setBusy(null);
  };

  const exportAlbum = () => {
    if (!draft.pages.length) return toast.error('Le livre ne contient encore aucune page.');
    const sections = draft.pages.map((page) => `<section class="page">${page.illustrationUrl ? `<img src="${page.illustrationUrl}" alt="Illustration page ${page.pageNumber}">` : '<div class="placeholder">Illustration à terminer</div>'}<div class="copy"><span>${page.pageNumber}</span><p>${escapeHtml(page.text)}</p></div></section>`).join('');
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(draft.title)}</title><style>@page{size:21.59cm 21.59cm;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#232f3e}.page{width:21.59cm;height:21.59cm;page-break-after:always;position:relative;overflow:hidden;background:#fafafa}.page img{width:100%;height:100%;object-fit:cover}.placeholder{height:100%;display:grid;place-items:center;color:#777}.copy{position:absolute;left:1.4cm;right:1.4cm;bottom:1.2cm;background:rgba(255,255,255,.92);padding:.45cm .65cm;border-radius:.3cm}.copy span{font-size:9pt;color:#777}.copy p{font-size:17pt;line-height:1.35;margin:.08cm 0 0}</style></head><body>${sections}</body></html>`;
    const win = window.open('', '_blank');
    if (!win) return toast.error('Autorisez les fenêtres pour ouvrir l’export.');
    win.document.write(html);
    win.document.close();
    win.onload = () => setTimeout(() => win.print(), 500);
  };

  const reset = () => {
    if (!window.confirm('Effacer ce brouillon d’album ? Les projets déjà enregistrés restent disponibles.')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROJECT_KEY);
    setDraft(createIllustratedAlbumDraft());
    setProjectId(null);
    setStep(0);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/v3/commence-ici" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Commence ici</Link>
          <div className="flex gap-2"><Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Nouvel album</Button><Button onClick={saveProject} disabled={busy === 'save'}>{busy === 'save' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Enregistrer</Button></div>
        </div>

        <header className="border-b border-border pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent"><LockKeyhole className="h-3.5 w-3.5" /> Personnages illustrés verrouillés</div>
          <h1 className="text-3xl font-bold md:text-4xl">Studio Album Illustré 3–6 ans</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">Une seule histoire suivie, jusqu’à 30 pages, avec les mêmes personnages du début à la fin.</p>
        </header>

        <nav className="grid grid-cols-5 gap-1" aria-label="Étapes de création">
          {STEPS.map((label, index) => <Button key={label} variant={step === index ? 'default' : 'outline'} className="h-auto min-h-14 flex-col gap-1 px-1 text-xs" onClick={() => setStep(index)}><span>{index + 1}</span><span className="hidden sm:block">{label}</span></Button>)}
        </nav>

        <div className="grid gap-3 sm:grid-cols-3">
          <Status label="Pages écrites" value={`${draft.pages.length}/${draft.pageCount}`} complete={draft.pages.length === draft.pageCount} />
          <Status label="Personnages verrouillés" value={`${lockedCount}/${draft.characters.length}`} complete={lockedCount === draft.characters.length} />
          <Status label="Images terminées" value={`${illustratedCount}/${draft.pageCount}`} complete={illustratedCount === draft.pageCount} />
        </div>

        {step === 0 && <Card><CardHeader><CardTitle>1. Préparer l’histoire</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Titre du livre"><input value={draft.title} onChange={(event) => update({ title: event.target.value })} placeholder="Le grand voyage de Léo" className="form-field" /></Field>
          <Field label="Nom d’auteur"><input value={draft.authorName} onChange={(event) => update({ authorName: event.target.value })} placeholder="Votre nom sur la couverture" className="form-field" /></Field>
          <Field label="Âge visé"><input value={draft.targetAge} onChange={(event) => update({ targetAge: event.target.value })} className="form-field" /></Field>
          <Field label="Nombre de pages"><select value={draft.pageCount} onChange={(event) => update({ pageCount: Number(event.target.value) as IllustratedAlbumDraft['pageCount'], pages: [] })} className="form-field">{ALBUM_PAGE_COUNTS.map((count) => <option key={count} value={count}>{count} pages</option>)}</select></Field>
          <Field label="Histoire à raconter" wide><textarea value={draft.pitch} onChange={(event) => update({ pitch: event.target.value })} rows={5} placeholder="Décrivez le héros, son problème, son aventure et la fin souhaitée…" className="form-field" /></Field>
          <Field label="Message ou morale" wide><input value={draft.moral} onChange={(event) => update({ moral: event.target.value })} placeholder="Par exemple : apprendre à demander de l’aide" className="form-field" /></Field>
          <Field label="Style des illustrations" wide><select value={draft.style} onChange={(event) => update({ style: event.target.value as IllustratedAlbumDraft['style'] })} className="form-field">{ILLUSTRATION_STYLES.map((style) => <option key={style.id} value={style.id}>{style.label}</option>)}</select></Field>
          <div className="md:col-span-2 flex justify-end"><Button onClick={() => requireBook() && setStep(1)}>Créer mes personnages <Sparkles className="ml-2 h-4 w-4" /></Button></div>
        </CardContent></Card>}

        {step === 1 && <Card><CardHeader><CardTitle>2. Verrouiller les personnages</CardTitle><p className="text-sm text-muted-foreground">Validez leur image de référence. Elle sera transmise à chaque illustration.</p></CardHeader><CardContent className="space-y-5">
          {draft.characters.map((character, index) => <div key={character.id} className="grid gap-4 border-b border-border pb-5 last:border-0 md:grid-cols-[1fr_180px]">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label={`Personnage ${index + 1} — nom`}><input value={character.name} onChange={(event) => updateCharacter(character.id, { name: event.target.value })} className="form-field" /></Field>
              <Field label="Âge"><input value={character.age} onChange={(event) => updateCharacter(character.id, { age: event.target.value })} className="form-field" /></Field>
              <Field label="Apparence exacte" wide><textarea value={character.physical} onChange={(event) => updateCharacter(character.id, { physical: event.target.value })} rows={2} placeholder="Visage, cheveux ou pelage, yeux, taille, couleurs…" className="form-field" /></Field>
              <Field label="Tenue exacte" wide><textarea value={character.outfit} onChange={(event) => updateCharacter(character.id, { outfit: event.target.value })} rows={2} placeholder="Vêtements et couleurs conservés sur toutes les pages" className="form-field" /></Field>
              <Field label="Signe distinctif"><input value={character.distinctiveFeatures} onChange={(event) => updateCharacter(character.id, { distinctiveFeatures: event.target.value })} placeholder="Lunettes rondes, tache blanche…" className="form-field" /></Field>
              <Field label="Personnalité"><input value={character.personality} onChange={(event) => updateCharacter(character.id, { personality: event.target.value })} className="form-field" /></Field>
              <div className="flex flex-wrap gap-2 md:col-span-2"><Button variant="outline" onClick={() => generateReference(character)} disabled={busy === `character-${character.id}`}>{busy === `character-${character.id}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}{character.referenceUrl ? 'Refaire la référence' : 'Créer la référence'}</Button>{character.referenceUrl && <Button variant={character.locked ? 'default' : 'outline'} onClick={() => updateCharacter(character.id, { locked: !character.locked, referenceUrl: character.referenceUrl })}>{character.locked ? <Check className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}{character.locked ? 'Personnage verrouillé' : 'Valider et verrouiller'}</Button>}{draft.characters.length > 1 && <Button variant="ghost" size="icon" title="Supprimer ce personnage" onClick={() => update({ characters: draft.characters.filter((item) => item.id !== character.id) })}><Trash2 className="h-4 w-4" /></Button>}</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-md border border-border bg-muted">{character.referenceUrl ? <img src={character.referenceUrl} alt={`Référence de ${character.name}`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center px-4 text-center text-xs text-muted-foreground">La référence apparaîtra ici</div>}</div>
          </div>)}
          <div className="flex flex-wrap justify-between gap-2"><Button variant="outline" onClick={() => update({ characters: [...draft.characters, createAlbumCharacter()] })} disabled={draft.characters.length >= 3}><Plus className="mr-2 h-4 w-4" /> Ajouter un personnage</Button><Button onClick={generateStoryBoard} disabled={busy === 'storyboard'}>{busy === 'storyboard' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Créer les {draft.pageCount} pages</Button></div>
        </CardContent></Card>}

        {step === 2 && <Card><CardHeader><CardTitle>3. Relire le chemin de fer</CardTitle><p className="text-sm text-muted-foreground">Chaque page appartient à la même histoire. Modifiez le texte ou la scène avant d’illustrer.</p></CardHeader><CardContent className="space-y-3">{draft.pages.length ? draft.pages.map((page) => <div key={page.id} className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-[70px_1fr_1fr]"><div className="text-sm font-bold text-primary">Page {page.pageNumber}</div><textarea value={page.text} onChange={(event) => updatePage(page.id, { text: event.target.value })} rows={3} aria-label={`Texte page ${page.pageNumber}`} className="form-field" /><textarea value={page.scene} onChange={(event) => updatePage(page.id, { scene: event.target.value })} rows={3} aria-label={`Scène page ${page.pageNumber}`} className="form-field" /></div>) : <Empty message="Aucun découpage. Revenez aux personnages pour créer l’histoire." />}<div className="flex justify-end"><Button onClick={generateAllImages} disabled={!draft.pages.length || busy === 'images'}><ImageIcon className="mr-2 h-4 w-4" /> Illustrer les pages</Button></div></CardContent></Card>}

        {step === 3 && <Card><CardHeader><CardTitle>4. Contrôler les illustrations</CardTitle>{busy === 'images' && <p className="text-sm text-muted-foreground">Création en cours : {imageProgress.done}/{imageProgress.total}</p>}</CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{draft.pages.length ? draft.pages.map((page) => <article key={page.id} className="overflow-hidden rounded-md border border-border bg-card"><div className="aspect-square bg-muted">{page.illustrationUrl ? <img src={page.illustrationUrl} alt={`Page ${page.pageNumber}`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Page {page.pageNumber} en attente</div>}</div><div className="space-y-2 p-3"><p className="text-sm font-bold">Page {page.pageNumber}</p><p className="line-clamp-3 text-xs text-muted-foreground">{page.text}</p><Button variant="outline" size="sm" className="w-full" onClick={() => regeneratePage(page)} disabled={busy !== null}>{busy === `page-${page.id}` ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-2 h-3.5 w-3.5" />}{page.illustrationUrl ? 'Refaire cette image' : 'Créer cette image'}</Button></div></article>) : <Empty message="Créez d’abord le chemin de fer." />}</div>{draft.pages.length > 0 && illustratedCount < draft.pages.length && <div className="mt-5 flex justify-center"><Button onClick={generateAllImages} disabled={busy === 'images'}>{busy === 'images' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />} Continuer les illustrations ({illustratedCount}/{draft.pages.length})</Button></div>}</CardContent></Card>}

        {step === 4 && <Card><CardHeader><CardTitle>5. Exporter l’album</CardTitle></CardHeader><CardContent className="space-y-5"><div className="rounded-md border border-border bg-muted/40 p-4"><BookOpen className="mb-2 h-6 w-6 text-primary" /><p className="font-semibold">Album carré 21,59 × 21,59 cm</p><p className="text-sm text-muted-foreground">{draft.pages.length} pages intérieures préparées, dont {illustratedCount} illustrées.</p></div><Field label="Texte de quatrième de couverture"><textarea value={draft.backCoverText} onChange={(event) => update({ backCoverText: event.target.value })} rows={4} className="form-field" /></Field><div className="flex flex-wrap gap-2"><Button onClick={exportAlbum} disabled={!draft.pages.length}><Printer className="mr-2 h-4 w-4" /> Exporter en PDF</Button><Button variant="outline" onClick={() => { const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${safeSlug(draft.title)}-sauvegarde.json`; link.click(); URL.revokeObjectURL(url); }}><Download className="mr-2 h-4 w-4" /> Sauvegarde complète</Button><Button variant="outline" onClick={saveProject}><Save className="mr-2 h-4 w-4" /> Enregistrer dans mes livres</Button></div></CardContent></Card>}
      </div>
    </main>
  );
}

function Status({ label, value, complete }: { label: string; value: string; complete: boolean }) {
  return <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3"><span className="text-xs text-muted-foreground">{label}</span><span className={`text-sm font-bold ${complete ? 'text-accent' : 'text-foreground'}`}>{complete && <Check className="mr-1 inline h-4 w-4" />}{value}</span></div>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? 'space-y-1.5 md:col-span-2' : 'space-y-1.5'}><span className="text-sm font-semibold">{label}</span>{children}</label>;
}

function Empty({ message }: { message: string }) {
  return <div className="col-span-full rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{message}</div>;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
}