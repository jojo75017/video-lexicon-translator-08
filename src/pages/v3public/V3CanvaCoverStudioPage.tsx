import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { listMyBooks, type MyBookOption } from '@/lib/cover-editor/myBooks';
import { buildPaperbackPdf, renderWrapCanvas, wrapGeometry, TRIMS, type Trim, type Paper } from '@/lib/cover-editor/paperbackWrapPdf';
import { supabase } from '@/integrations/supabase/client';
import { getOpenRouterImageKey } from '@/lib/ebookExportOptions';
import { Link } from 'react-router-dom';
import useCoverProAccess from '@/hooks/useCoverProAccess';
import { COVER_GENRES, BADGE_STYLES } from '@/data/canvaCoverGenres';
import { Button } from '@/components/ui/button';
import { fitArtwork, studioCompositionPrompt, studioCoverSize, type StudioCoverFormat } from '@/lib/cover-editor/studioCoverLayout';

/** Rendu interne en 2× pour des titres nets à l'impression 300 DPI. */
const S = 2;
const SCENE_IDEAS: Record<string, string[]> = {
  thriller: ["Une silhouette sous la pluie dans une ruelle sombre éclairée par un seul réverbère, ambiance froide et tendue", "Une maison isolée la nuit au bord d'un lac brumeux, une seule fenêtre allumée", "Un couloir d'hôpital désert aux néons vacillants, une porte entrouverte au fond"],
  romance: ["Un couple de dos face à un coucher de soleil sur la mer, lumière dorée et douce", "Deux mains qui se frôlent sur une table de café parisien, pluie fine derrière la vitre", "Une jeune femme lisant une lettre dans un champ de lavande au crépuscule"],
  jeunesse: ["Un petit renard curieux dans une forêt enchantée, lucioles et champignons lumineux", "Une fillette et son chien explorent un jardin rempli de fleurs géantes", "Un ourson qui regarde les étoiles depuis sa cabane dans un arbre"],
};
const DEFAULT_IDEAS = ["Un bureau lumineux avec un carnet ouvert, une tasse de café et des plantes, ambiance inspirante", "Un chemin de montagne au lever du soleil, symbole de progression", "Une personne souriante devant un ordinateur portable dans un salon clair"];
const GENRE_STYLE: Record<string, { style: string; mood: string; lighting?: string }> = {
  guide: { style: 'clean modern editorial illustration, soft natural colours', mood: 'clear, reassuring, practical' },
  jeunesse: { style: 'bright 3D animated film style (Pixar-like), friendly cartoon characters, warm cheerful colours, NOT photographic', mood: 'joyful, warm, encouraging' },
  thriller: { style: 'photorealistic cinematic film still, 35mm film grain, chiaroscuro, rain-soaked night streets or misty forest, lone mysterious silhouette, real photography, NOT illustration, NOT cartoon', mood: 'tense, suspenseful', lighting: 'dark' },
  romance: { style: 'photorealistic cinematic photograph, golden hour natural light, shallow depth of field, real people, elegant, NOT cartoon', mood: 'tender, emotional' },
  devperso: { style: 'uplifting luminous illustration, sunrise, open landscape, airy composition', mood: 'hopeful, inspiring' },
  sf: { style: 'epic science-fiction / fantasy digital painting, cosmic scale, glowing details', mood: 'epic, wondrous', lighting: 'dark' },
};
const TITLE_COLORS: Record<string, string[]> = {
  guide: ['#232F3E', '#FF9E2D', '#008296'], jeunesse: ['#1E3A8A', '#F97316', '#0E7490'], thriller: ['#FFFFFF', '#FACC15', '#FFFFFF'],
  romance: ['#FDE68A', '#FBCFE8', '#FDE68A'], devperso: ['#004D57', '#FF9E2D', '#004D57'], sf: ['#67E8F9', '#E9D5FF', '#67E8F9'],
};
type Extra = { id: number; text: string; x: number; y: number; size: number; color: string; box: 'aucun' | 'panneau' | 'bulle' };
const COLORS = ['#FFFFFF', '#232F3E', '#FF9E2D', '#008296', '#F5C542', '#D93025'];

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(/\s+/).filter(Boolean); const lines: string[] = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}

export default function V3CanvaCoverStudioPage() {
  const pro = useCoverProAccess(); const proLoading = pro.loading;
  const [tab, setTab] = useState<'modele' | 'visuel' | 'texte' | 'macaron'>('modele');
  const [genreId, setGenreId] = useState('guide');
  const [coverFormat, setCoverFormat] = useState<StudioCoverFormat>('kindle');
  const { width: W, height: H } = studioCoverSize(coverFormat);
  const changeFormat = (format: StudioCoverFormat) => { setCoverFormat(format); setAuthorY(null); setBadgeXY(null); if (format === 'album') { setTrim('8.5x8.5'); setPaper('couleur'); } };
  const [title, setTitle] = useState('Mon titre de livre');
  const [subtitle, setSubtitle] = useState('Un sous-titre court et clair');
  const [author, setAuthor] = useState('Prénom Nom');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [badgeOn, setBadgeOn] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showSub, setShowSub] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [shade, setShade] = useState(0);
  const [tPos, setTPos] = useState<'auto' | 'haut' | 'milieu' | 'bas'>('auto');
  const [tScale, setTScale] = useState(100);
  const [tColor, setTColor] = useState('');
  const [aColor, setAColor] = useState('');
  const [stockQ, setStockQ] = useState('');
  const [stock, setStock] = useState<{ id: string; thumb: string; full: string; author: string; source: string; download?: string }[]>([]);
  const [stockMsg, setStockMsg] = useState('');
  const [badgeText, setBadgeText] = useState('Méthode prouvée');
  const [badgeStyle, setBadgeStyle] = useState('or');
  const [badgePos, setBadgePos] = useState<'haut' | 'bas'>('haut');
  const [badgeXY, setBadgeXY] = useState<{ x: number; y: number } | null>(null);
  const [badgeSize, setBadgeSize] = useState(230);
  const lastBadge = useRef({ x: 0, y: 0, r: 230 });
  const [authorY, setAuthorY] = useState<number | null>(null);
  const drag = useRef<null | { kind: 'author' } | { kind: 'badge' } | { kind: 'extra'; id: number }>(null);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [books, setBooks] = useState<MyBookOption[]>([]);
  const [bookId, setBookId] = useState('');
  useEffect(() => { listMyBooks().then(setBooks).catch(() => setBooks([])); }, []);
  const pickBook = (id: string) => { setBookId(id); const b = books.find((x) => x.id === id); if (!b) return; setTitle(b.title || ''); setSubtitle(b.subtitle || ''); if (b.author) setAuthor(b.author); setSceneText(b.synopsis || ''); setBackText(b.backCover || b.synopsis || ''); };
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState('');
  const [sceneText, setSceneText] = useState('');
  const [showWrap, setShowWrap] = useState(false);
  const [trim, setTrim] = useState<Trim>('6x9');
  const [pages, setPages] = useState(120);
  const [paper, setPaper] = useState<Paper>('blanc');
  const [marks, setMarks] = useState(false);
  const [backText, setBackText] = useState('');
  const geo = wrapGeometry(trim, pages, paper);
  const wrapInput = () => ({ front: canvasRef.current!, trim, pages, paper, marks, title, author, backText, bg: genre.bg, textColor: genre.titlePos === 'top' && !/^#0|^#1|^#3/.test(genre.bg) ? '#232F3E' : '#FFFFFF', accent: (TITLE_COLORS[genreId] ?? [genre.titleColor])[0] });
  const [wrapPreview, setWrapPreview] = useState('');
  const autoBackText = () => {
    const b = books.find((x) => x.id === bookId) ?? books.find((x) => x.title?.trim().toLowerCase() === title.trim().toLowerCase());
    const t = b?.backCover || b?.synopsis;
    if (t) return t;
    return `${title}${subtitle ? ' : ' + subtitle : ''}.\n\nDans ce livre, ${author} vous accompagne pas à pas avec des conseils clairs et concrets, faciles à appliquer au quotidien.`;
  };
  const openWrap = () => { setShowWrap((v) => { if (!v && !backText.trim()) setBackText(autoBackText()); return !v; }); };
  useEffect(() => {
    if (!showWrap || !canvasRef.current) return;
    const t = setTimeout(() => { try { const c = renderWrapCanvas(wrapInput()); const k = document.createElement('canvas'); k.width = 1400; k.height = Math.round(1400 * c.height / c.width); k.getContext('2d')!.drawImage(c, 0, 0, k.width, k.height); setWrapPreview(k.toDataURL('image/jpeg', 0.85)); } catch { /* aperçu indisponible */ } }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWrap, trim, pages, paper, backText, title, author, subtitle, genreId, img, badgeOn, badgeText, badgeStyle, badgeXY, badgeSize, extras]);
  const downloadWrap = () => {
    const blob = buildPaperbackPdf(wrapInput());
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${(title || 'couverture').replace(/\W+/g, '-')}-broche-kdp${marks ? '-reperes' : ''}.pdf`; a.click();
  };
  const createImage = async () => {
    setGenLoading(true); setGenError('');
    try {
      const gs = GENRE_STYLE[genreId] ?? GENRE_STYLE.guide;
      const scene = sceneText.trim();
      if (scene.length < 20) { setTab('visuel'); setGenError("Décrivez d'abord ce que doit montrer l'image (étape 3. Illustration), par exemple : deux voitures de course au coude-à-coude sur un circuit la nuit."); return; }
      const prompt = `Professional bestseller book cover ILLUSTRATION ONLY (artwork, no typography) for the book "${title}"${subtitle ? ` (${subtitle})` : ''}.
${(() => { const b = books.find((x) => x.id === bookId); const topic = (b?.synopsis || subtitle || '').trim(); return topic ? `What the book is about (the image MUST illustrate this subject): ${topic.slice(0, 600)}.\n` : ''; })()}Scene to depict faithfully and literally (this is the ONLY subject, do not invent another theme from the title): ${scene}.
Art style: ${gs.style}. Mood: ${gs.mood}. ${gs.lighting === 'dark' ? 'Dramatic but readable lighting.' : 'Bright, luminous, well-exposed lighting, never dark or muddy.'}
${studioCompositionPrompt(coverFormat, genre.titlePos === 'top')} Expressive characters, rich detail, art-directed publishing-house quality.
ABSOLUTELY NO TEXT: no letters, no words, no title, no logo, no watermark. Full-bleed, no border, no 3D book mockup.`;
      const { data, error } = await supabase.functions.invoke('generate-ai-cover', { body: { title, subtitle, author, genre: genre.label, format: coverFormat, customPrompt: prompt, openrouterKey: getOpenRouterImageKey() || undefined } });
      if (error) throw new Error((await (error as { context?: Response }).context?.json?.().catch(() => null))?.error || error.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error('Aucune image reçue, réessayez.');
      const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => { setImg(i); }; i.onerror = () => setGenError("L'image reçue est illisible, réessayez."); i.src = data.imageUrl;
    } catch (e) { setGenError(e instanceof Error ? e.message : "La création de l'image a échoué."); }
    finally { setGenLoading(false); }
  };
  const toCover = (e: RPointerEvent<HTMLCanvasElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
  const addExtra = () => setExtras((e) => [...e, { id: Date.now(), text: 'Nouveau texte', x: 30, y: 55, size: 64, color: '#FFFFFF', box: 'aucun' }]);
  const upd = (id: number, p: Partial<Extra>) => setExtras((e) => e.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumb, setThumb] = useState('');
  const genre = COVER_GENRES.find((g) => g.id === genreId)!;

  useEffect(() => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d')!; ctx.setTransform(S, 0, 0, S, 0, 0); ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = genre.bg; ctx.fillRect(0, 0, W, H);
    if (img) { const cs = Math.max(W / img.width, H / img.height); const cw = img.width * cs, ch = img.height * cs; ctx.save(); ctx.filter = 'blur(40px) brightness(0.85)'; ctx.drawImage(img, (W - cw) / 2, (H - ch) / 2, cw, ch); ctx.restore(); const fit = fitArtwork(img.width, img.height, W, H); ctx.drawImage(img, fit.x, fit.y, fit.width, fit.height); }
    ctx.fillStyle = genre.overlay; ctx.fillRect(0, 0, W, H);
    if (shade > 0) { const g = genre.titlePos === 'top' ? ctx.createLinearGradient(0, 0, 0, H * 0.6) : ctx.createLinearGradient(0, H, 0, H * 0.4); g.addColorStop(0, `rgba(0,0,0,${shade / 100})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    const t = !showTitle ? '' : genre.titleUpper ? title.toUpperCase() : title;
    let size = Math.round(210 * tScale / 100); const maxW = W - 200; let lines: string[] = [];
    do { ctx.font = genre.titleFont.replace('{s}', String(size)); lines = t ? wrap(ctx, t, maxW) : []; size -= 10; } while ((lines.length > 3 || lines.some((l) => ctx.measureText(l).width > maxW)) && size > 50);
    const lh = (size + 10) * 1.1; const blockH = lines.length * lh;
    const pos = tPos === 'auto' ? (genre.titlePos === 'top' ? 'haut' : 'bas') : tPos;
    let y = pos === 'haut' ? 280 : pos === 'milieu' ? (H - blockH) / 2 - 80 : H - 420 - blockH;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (img) { ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; }
    const tc = TITLE_COLORS[genreId] ?? [genre.titleColor]; lines.forEach((l, i) => { ctx.fillStyle = tColor || tc[i % tc.length]; ctx.fillText(l, W / 2, y); y += lh; });
    ctx.font = '600 72px Montserrat, Arial, sans-serif'; ctx.fillStyle = genre.subColor;
    wrap(ctx, showSub ? subtitle : '', maxW).slice(0, 2).forEach((l) => { ctx.fillText(l, W / 2, y + 30); y += 90; });
    ctx.font = '700 90px Montserrat, Arial, sans-serif'; ctx.fillStyle = aColor || genre.titleColor;
    if (!showAuthor || !author.trim()) { /* auteur masqué */ } else { const ay = authorY ?? H - 200; ctx.textBaseline = 'middle'; ctx.fillText(author.toUpperCase(), W / 2, ay); ctx.textBaseline = 'top'; } ctx.shadowBlur = 0;
    if (badgeOn && badgeText.trim()) {
      const st = BADGE_STYLES.find((b) => b.id === badgeStyle)!; const r = badgeSize;
      const dcx = W - r - 90, dcy = badgePos === 'haut' ? (genre.titlePos === 'top' ? y + r + 80 : r + 120) : H - r - 380;
      const cx = badgeXY?.x ?? dcx, cy = badgeXY?.y ?? dcy; lastBadge.current = { x: cx, y: cy, r };
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = st.fill; ctx.fill();
      ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.stroke();
      ctx.fillStyle = st.text; ctx.textBaseline = 'middle';
      let fs = Math.round(r * 0.28), bl: string[] = [];
      for (; fs > 14; fs -= 2) {
        ctx.font = `800 ${fs}px Montserrat, Arial, sans-serif`;
        bl = wrap(ctx, badgeText.toUpperCase(), r * 1.5);
        if (bl.length <= 3 && bl.length * fs * 1.12 <= r * 1.4 && bl.every((l) => ctx.measureText(l).width <= r * 1.55)) break;
      }
      bl = bl.slice(0, 3);
      bl.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (bl.length - 1) / 2) * fs * 1.12));
    }
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    for (const ex of extras) {
      if (!ex.text.trim()) continue;
      ctx.font = `700 ${ex.size}px Montserrat, Arial, sans-serif`;
      const ls = ex.text.split('\n').flatMap((p) => wrap(ctx, p, W * 0.45)); const lh = ex.size * 1.2;
      const bw = Math.max(...ls.map((l) => ctx.measureText(l).width)); const cx = (ex.x / 100) * W, cy = (ex.y / 100) * H; const bh = ls.length * lh;
      if (ex.box === 'panneau') { ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fillRect(cx - bw / 2 - 40, cy - 30, bw + 80, bh + 60); }
      if (ex.box === 'bulle') { ctx.beginPath(); ctx.ellipse(cx, cy + bh / 2, bw / 2 + 80, bh / 2 + 70, 0, 0, Math.PI * 2); ctx.fillStyle = '#F5C542'; ctx.fill(); }
      ctx.fillStyle = ex.color; if (ex.box === 'aucun' && img) { ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2; }
      ls.forEach((l, i) => ctx.fillText(l, cx, cy + i * lh)); ctx.shadowBlur = 0;
    }
    ctx.shadowOffsetY = 0; setThumb(c.toDataURL('image/jpeg', 0.6));
  }, [W, H, authorY, genre, title, subtitle, author, img, shade, tPos, tScale, tColor, showTitle, showSub, showAuthor, badgeOn, badgeText, badgeStyle, badgePos, extras, badgeXY, badgeSize, aColor]);

  const searchStock = async () => {
    setStockMsg('Recherche…'); setStock([]);
    const { data, error } = await supabase.functions.invoke('stock-photos', { body: { query: stockQ } });
    if (error || data?.error) { setStockMsg(data?.error || 'Recherche impossible, réessayez.'); return; }
    setStock(data?.photos ?? []); setStockMsg(data?.photos?.length ? '' : 'Aucune photo trouvée, essayez d’autres mots (en anglais souvent mieux).');
  };
  const pickStock = (p: { full: string; source: string; download?: string }) => {
    const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => setImg(i); i.onerror = () => setStockMsg('Photo illisible, choisissez-en une autre.'); i.src = p.full;
    if (p.source === 'unsplash' && p.download) void supabase.functions.invoke('stock-photos', { body: { track: p.download } });
  };
  const downloadArt = () => { if (!img) return; const k = document.createElement('canvas'); k.width = W; k.height = H; const kc = k.getContext('2d'); if (!kc) return; kc.fillStyle = genre.bg; kc.fillRect(0, 0, W, H); const fit = fitArtwork(img.width, img.height, W, H); kc.drawImage(img, fit.x, fit.y, fit.width, fit.height); const a = document.createElement('a'); a.href = k.toDataURL('image/jpeg', 0.95); a.download = (title || 'illustration').replace(/\W+/g, '-') + '-image-seule.jpg'; a.click(); };
  const fromStory = () => { const b = books.find((x) => x.id === bookId); if (!b) { setGenError('Choisissez d’abord votre livre en haut à droite (📚 Mon livre).'); return; } const story = b.backCover || b.synopsis; if (!story) { setGenError('Ce livre n’a pas encore de résumé enregistré : ajoutez-le dans la case.'); return; } setBackText(story); setSceneText(b.synopsis || story); setGenError(''); };
  const onFile = (f?: File) => { if (!f) return; const i = new Image(); i.onload = () => setImg(i); i.src = URL.createObjectURL(f); };
  const download = () => { const a = document.createElement('a'); const k = document.createElement('canvas'); k.width = W; k.height = H; const kc = k.getContext('2d')!; kc.imageSmoothingQuality = 'high'; kc.drawImage(canvasRef.current!, 0, 0, W, H); a.href = k.toDataURL('image/jpeg', 0.97); a.download = (title || 'couverture').replace(/\W+/g, '-') + '-kindle.jpg'; a.click(); };
  const tabs = [['modele', '1. Modèle'], ['visuel', '2. Visuel'], ['texte', '3. Textes'], ['macaron', '4. Macaron']] as const;
  const input = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground';

const STEPS = [
    { id: 'modele', icon: '🖼️', t: '1. Modèles', d: 'Choisissez un style de couverture' },
    { id: 'texte', icon: '✏️', t: '2. Mon livre & titres', d: 'Titre, sous-titre, auteur, textes' },
    { id: 'visuel', icon: '🎨', t: '3. Illustration', d: 'Images, personnages, ambiance' },
    { id: 'macaron', icon: '🏅', t: '4. Macaron', d: 'Bulle d\'accroche, couleur, position' },
  ] as const;
  return (
    <div className="min-h-screen text-foreground">
      {!proLoading && !pro.hasAccess && (
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-border bg-accent/15 px-6 py-2 text-sm">
          <span>👑 Envie d’aller plus loin ? Le Studio Pro est inclus dans Édition VIP (59 €/mois) ou disponible à 67 € à vie.</span>
          <Link to="/v3/cover-pro" className="rounded-full bg-accent px-3 py-1 font-bold text-accent-foreground">Voir l’offre Studio Pro</Link>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 border-b border-border px-6 py-4">
        <Link to="/v3" className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">← Retour à l’accueil</Link><Link to="/v3/mes-couvertures" className="text-sm font-semibold text-muted-foreground underline">Mes couvertures</Link><span className="text-3xl">📖</span><h1 className="text-2xl font-bold">Studio de couverture</h1>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">👑 Inclus Édition VIP</span>
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold">📚 Mon livre
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-foreground" value={bookId} onChange={(e) => pickBook(e.target.value)}>
            <option value="">{books.length ? '— Choisir mon livre —' : 'Aucun livre enregistré'}</option>
            {books.map((b) => <option key={b.id} value={b.id}>{b.title || 'Sans titre'}</option>)}</select></label>
      </div>
      <div className="grid gap-0 lg:grid-cols-[420px_1fr]">
        <aside className="space-y-3 border-r border-border p-4">
          <label className="block text-sm font-semibold">Format de couverture<select aria-label="Format de couverture" className={input} value={coverFormat} disabled={genLoading} onChange={(e) => changeFormat(e.target.value as StudioCoverFormat)}><option value="kindle">Portrait Kindle</option><option value="album">Album jeunesse carré · 21,59 × 21,59 cm</option></select></label>
          {STEPS.map((st) => <button key={st.id} onClick={() => setTab(st.id)} className={`v3-chip-toggle flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left ${tab === st.id ? 'border-primary bg-primary/20' : 'border-transparent bg-card'}`}>
            <span className="text-3xl">{st.icon}</span><span className="flex-1 border-l border-border pl-4"><span className="block text-lg font-bold text-foreground">{st.t}</span><span className="text-sm text-muted-foreground">{st.d}</span></span><span className="text-muted-foreground">›</span></button>)}
          <div className="rounded-xl bg-card p-4">
          {tab === 'modele' && <div><p className="mb-3 font-semibold">Modèles de couverture</p><div className="grid grid-cols-3 gap-3">{COVER_GENRES.map((g) => (
            <button key={g.id} onClick={() => { if (g.id !== genreId) { setImg(null); setSceneText(''); } setGenreId(g.id); if (g.id === 'jeunesse') { changeFormat('album'); setBadgeOn(false); } setBadgeText(g.badges[0]); const fic = g.id === 'thriller' || g.id === 'romance'; if (g.id !== 'jeunesse') setBadgeOn(!fic); if (fic) setShowSub(false); setShade(fic ? 45 : 0); }} className="v3-chip-toggle text-center">
              <span className={`flex aspect-[5/8] flex-col items-center ${g.titlePos === 'top' ? 'justify-start pt-3' : 'justify-end pb-3'} rounded-lg px-1 shadow-lg ring-2 ${g.id === genreId ? 'ring-primary' : 'ring-transparent'}`} style={{ background: g.bg }}>
                {(TITLE_COLORS[g.id] ?? [g.titleColor]).slice(0, 2).map((c, i) => <span key={i} className="text-[11px] font-black leading-tight" style={{ color: c, font: g.titleFont.replace('{s}', '12') }}>{i ? 'TITRE' : 'MON'}</span>)}
              </span><span className="mt-1 block text-xs text-foreground">{g.label.split(' /')[0]}</span>
            </button>))}</div></div>}
          {tab === 'visuel' && <div className="space-y-3"><label className="block text-sm font-semibold">Que doit montrer l'image ? <span className="text-primary">(obligatoire)</span><textarea className={`${input} ${sceneText.trim().length < 20 ? 'border-primary' : ''}`} rows={4} value={sceneText} onChange={(e) => setSceneText(e.target.value)} placeholder="Ex. : une maman et son garçon de 7 ans font les devoirs en souriant, une ampoule s'allume au-dessus du cahier, salon lumineux avec des plantes" /></label>
            <div><p className="mb-1 text-xs font-semibold">💡 Idées de scènes en 1 clic</p><div className="flex flex-wrap gap-1">{(SCENE_IDEAS[genreId] ?? DEFAULT_IDEAS).map((t, i) => <button key={i} type="button" onClick={() => setSceneText(t)} className="v3-chip-toggle rounded-full bg-muted px-3 py-1 text-left text-xs text-foreground">Idée {i + 1} : {t.slice(0, 40)}…</button>)}</div></div>
            <p className="text-xs font-semibold text-primary">{getOpenRouterImageKey().startsWith('sk-or-') ? '✅ Votre clé OpenRouter est utilisée pour créer les images.' : 'ℹ️ Ajoutez votre clé OpenRouter (sk-or-) dans vos réglages pour ne jamais être bloqué.'}</p>
            <p className="text-xs text-muted-foreground">Plus votre description est précise (personnages, âge, lieu, objets, ambiance), plus l'image sera réussie. Le résumé de votre livre s'y place tout seul s'il existe.</p>
            <button onClick={createImage} disabled={genLoading || !title.trim()} className="w-full rounded-lg bg-primary px-3 py-3 font-bold text-primary-foreground disabled:opacity-60">{genLoading ? '⏳ Création en cours (environ 30 s)…' : "🎨 Créer l'image"}</button>
            <p className="text-xs text-muted-foreground">L'image est créée à partir du résumé de votre livre, dans le style du modèle « {genre.label} ».</p>
            {genError && <p className="text-sm text-destructive">{genError}</p>}
            <p className="text-sm text-muted-foreground">Ou ajoutez l'illustration créée dans le studio d'images ou votre propre image.</p>
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />
            <div className="border-t border-border pt-3"><p className="mb-2 text-sm font-semibold">📸 Photos réelles libres de droits</p>
              <div className="flex gap-2"><input className={input} value={stockQ} onChange={(e) => setStockQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && stockQ.trim() && searchStock()} placeholder="Ex. : rue sombre pluie nuit" /><button onClick={searchStock} disabled={!stockQ.trim()} className="rounded-lg bg-primary px-3 font-bold text-primary-foreground disabled:opacity-60">Chercher</button></div>
              {stockMsg && <p className="mt-2 text-xs text-muted-foreground">{stockMsg}</p>}
              <div className="mt-2 grid grid-cols-3 gap-2">{stock.map((p) => <button key={p.id} onClick={() => pickStock(p)} className="v3-chip-toggle text-left"><img src={p.thumb} alt={`Photo de ${p.author}`} className="aspect-[2/3] w-full rounded object-cover" /><span className="block truncate text-[10px] text-muted-foreground">{p.author} · {p.source}</span></button>)}</div></div>
            <label className="block text-xs">Assombrir derrière le titre (lisibilité) : {shade} %<input type="range" min={0} max={85} value={shade} onChange={(e) => setShade(+e.target.value)} className="w-full" /></label>
            {img && <button onClick={() => setImg(null)} className="v3-chip-toggle rounded-lg bg-muted px-3 py-2 text-sm text-foreground">Retirer l'image</button>}</div>}
          {tab === 'texte' && <div className="space-y-3">

            <div className="flex flex-wrap gap-3 text-sm">{([['Titre', showTitle, setShowTitle], ['Sous-titre', showSub, setShowSub], ['Auteur', showAuthor, setShowAuthor]] as const).map(([l, v, f]) => <label key={l} className="flex items-center gap-1"><input type="checkbox" checked={v} onChange={(e) => f(e.target.checked)} /> Afficher {l.toLowerCase()}</label>)}</div>
            <div className="space-y-2 rounded-lg border border-border p-2 text-sm"><p className="font-semibold">Position du titre</p>
              <div className="grid grid-cols-4 gap-1">{([['auto', 'Modèle'], ['haut', 'Haut'], ['milieu', 'Milieu'], ['bas', 'Bas']] as const).map(([k, l]) => <button key={k} onClick={() => setTPos(k)} className={`v3-chip-toggle rounded px-2 py-1 text-xs ${tPos === k ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{l}</button>)}</div>
              <label className="block text-xs">Taille du titre : {tScale} %<input type="range" min={40} max={120} value={tScale} onChange={(e) => setTScale(+e.target.value)} className="w-full" /></label>
              <div className="flex items-center gap-1"><span className="text-xs">Couleur :</span><button onClick={() => setTColor('')} className={`v3-chip-toggle rounded px-2 text-xs ${!tColor ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>Modèle</button>{COLORS.map((c) => <button key={c} aria-label={`Couleur ${c}`} onClick={() => setTColor(c)} className={`v3-chip-toggle h-6 w-6 rounded-full border-2 ${tColor === c ? 'border-primary' : 'border-border'}`} style={{ background: c }} />)}<input type="color" aria-label="Autre couleur" value={tColor || '#ffffff'} onChange={(e) => setTColor(e.target.value)} className="h-6 w-8" /></div></div>
            <label className="block text-sm">Titre<input className={input} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label className="block text-sm">Sous-titre<input className={input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></label>
            <label className="block text-sm">Auteur<input className={input} value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
            <div className="flex flex-wrap items-center gap-1"><span className="text-xs">Couleur du nom :</span><button onClick={() => setAColor('')} className={`v3-chip-toggle rounded px-2 text-xs ${!aColor ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>Modèle</button>{COLORS.map((c) => <button key={c} aria-label={`Couleur auteur ${c}`} onClick={() => setAColor(c)} className={`v3-chip-toggle h-6 w-6 rounded-full border-2 ${aColor === c ? 'border-primary' : 'border-border'}`} style={{ background: c }} />)}<input type="color" aria-label="Autre couleur auteur" value={aColor || '#ffffff'} onChange={(e) => setAColor(e.target.value)} className="h-6 w-8" /></div>
            <div className="flex flex-wrap items-center gap-1"><span className="text-xs">Place du nom :</span>{([['Haut', 140], ['Milieu', H / 2], ['Bas', H - 200]] as const).map(([l, v]) => <button key={l} onClick={() => setAuthorY(v)} className={`v3-chip-toggle rounded px-2 text-xs ${(authorY ?? H - 200) === v ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{l}</button>)}<span className="text-xs text-muted-foreground">ou glissez-le avec la souris</span></div>
            <div className="border-t border-border pt-3"><p className="mb-2 text-sm font-semibold">Textes en plus sur l'image</p>
              {extras.map((ex) => <div key={ex.id} className="mb-3 space-y-2 rounded-lg border border-border p-2">
                <textarea className={input} rows={2} value={ex.text} onChange={(e) => upd(ex.id, { text: e.target.value })} />
                <label className="block text-xs">Gauche ↔ droite<input type="range" min={10} max={90} value={ex.x} onChange={(e) => upd(ex.id, { x: +e.target.value })} className="w-full" /></label>
                <label className="block text-xs">Haut ↕ bas<input type="range" min={3} max={92} value={ex.y} onChange={(e) => upd(ex.id, { y: +e.target.value })} className="w-full" /></label>
                <label className="block text-xs">Taille<input type="range" min={36} max={140} value={ex.size} onChange={(e) => upd(ex.id, { size: +e.target.value })} className="w-full" /></label>
                <div className="flex gap-1">{COLORS.map((c) => <button key={c} aria-label={`Couleur ${c}`} onClick={() => upd(ex.id, { color: c })} className={`v3-chip-toggle h-6 w-6 rounded-full border-2 ${ex.color === c ? 'border-primary' : 'border-border'}`} style={{ background: c }} />)}</div>
                <div className="flex gap-1">{(['aucun', 'panneau', 'bulle'] as const).map((b) => <button key={b} onClick={() => upd(ex.id, { box: b })} className={`v3-chip-toggle flex-1 rounded px-2 py-1 text-xs ${ex.box === b ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{b === 'aucun' ? 'Sans fond' : b === 'panneau' ? 'Panneau' : 'Bulle'}</button>)}</div>
                <button onClick={() => setExtras((e) => e.filter((x) => x.id !== ex.id))} className="v3-chip-toggle text-xs text-destructive">Supprimer ce texte</button></div>)}
              <button onClick={addExtra} className="v3-chip-toggle w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground">+ Ajouter un texte</button></div></div>}
          {tab === 'macaron' && <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={badgeOn} onChange={(e) => setBadgeOn(e.target.checked)} /> Afficher le macaron (décochez pour l'enlever)</label>
            <div className="flex flex-wrap gap-2">{genre.badges.map((b) => <button key={b} onClick={() => setBadgeText(b)} className="v3-chip-toggle rounded-full bg-muted px-3 py-1 text-xs text-foreground">{b}</button>)}</div>
            <input className={input} value={badgeText} onChange={(e) => setBadgeText(e.target.value)} maxLength={40} />
            <div className="grid grid-cols-2 gap-2">{BADGE_STYLES.map((s) => <button key={s.id} onClick={() => setBadgeStyle(s.id)} className={`v3-chip-toggle rounded-lg border p-2 text-xs ${badgeStyle === s.id ? 'border-primary' : 'border-border'}`} style={{ background: s.fill, color: s.text }}>{s.label}</button>)}</div>
            <div className="grid grid-cols-3 gap-2">{([['Gauche', 290], ['Centre', 800], ['Droite', 1310]] as const).map(([l, x]) => <button key={l} onClick={() => setBadgeXY({ x, y: lastBadge.current.y })} className="v3-chip-toggle rounded-lg bg-muted px-2 py-2 text-sm text-foreground">{l}</button>)}</div>
            <label className="block text-xs">Taille du macaron<input type="range" min={120} max={340} value={badgeSize} onChange={(e) => setBadgeSize(+e.target.value)} className="w-full" /></label>
            <p className="text-xs text-muted-foreground">Astuce : faites glisser le macaron (ou vos textes) directement sur la couverture avec la souris ou le doigt.</p>
            <div className="flex gap-2">{(['haut', 'bas'] as const).map((p) => <button key={p} onClick={() => { setBadgePos(p); setBadgeXY(null); }} className={`v3-chip-toggle flex-1 rounded-lg px-3 py-2 text-sm ${badgePos === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>En {p}</button>)}</div></div>}
          </div>
        </aside>
        <main className="flex flex-col items-center gap-6 p-6">
          <div className="flex w-full max-w-[440px] flex-col gap-2">
            <button onClick={createImage} disabled={genLoading || !title.trim()} className="w-full rounded-xl bg-primary px-4 py-3 text-lg font-bold text-primary-foreground disabled:opacity-60">{genLoading ? '⏳ Création de l\'image en cours (environ 30 s)…' : "🎨 Créer l'image de couverture"}</button>
            {genError && <p className="text-center text-sm text-destructive">{genError}</p>}
          </div>
          {img && <button type="button" onClick={() => setImg(null)} className="v3-chip-toggle mb-2 rounded-lg bg-destructive px-3 py-2 text-sm font-bold text-destructive-foreground">🗑️ Effacer l'image</button>}
          <canvas ref={canvasRef} width={W * S} height={H * S} className="w-full max-w-[440px] touch-none cursor-move rounded shadow-2xl"
            onPointerDown={(e) => { const p = toCover(e); const b = lastBadge.current;
              if (badgeOn && Math.hypot(p.x - b.x, p.y - b.y) <= b.r) drag.current = { kind: 'badge' };
              else if (showAuthor && author.trim() && Math.abs(p.y - (authorY ?? H - 200)) < 70) drag.current = { kind: 'author' };
              else { const hit = [...extras].reverse().find((x) => Math.abs(p.x - (x.x / 100) * W) < 400 && p.y - (x.y / 100) * H > -60 && p.y - (x.y / 100) * H < x.size * 3); if (hit) drag.current = { kind: 'extra', id: hit.id }; }
              if (drag.current) (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); }}
            onPointerMove={(e) => { const d = drag.current; if (!d) return; const p = toCover(e);
              if (d.kind === 'author') setAuthorY(Math.min(H - 60, Math.max(60, p.y)));
              else if (d.kind === 'badge') setBadgeXY({ x: Math.min(W, Math.max(0, p.x)), y: Math.min(H, Math.max(0, p.y)) });
              else upd(d.id, { x: Math.min(95, Math.max(5, (p.x / W) * 100)), y: Math.min(95, Math.max(2, (p.y / H) * 100)) }); }}
            onPointerUp={() => { drag.current = null; }} />
          <div className="flex w-full max-w-3xl flex-col gap-2">
          <Button onClick={download} className="flex h-auto w-full items-center gap-3 px-4 py-3 text-base font-bold">📥 {coverFormat === 'album' ? 'Télécharger la couverture carrée' : 'Télécharger pour Kindle'} <span className="ml-auto">›</span></Button>
          {img && <button onClick={downloadArt} className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-base font-bold text-foreground">🖼️ Télécharger l'image seule (sans texte ni macaron) <span className="ml-auto">›</span></button>}
          <button onClick={openWrap} className="flex w-full items-center gap-3 rounded-xl border-2 border-primary bg-card px-4 py-3 text-base font-bold text-foreground">📘 Télécharger le broché KDP <span className="ml-auto">{showWrap ? '▾' : '›'}</span></button>
          {showWrap && <div className="space-y-3 rounded-xl bg-card p-4 text-sm">
            <label className="block">Format du livre<select className={input} value={trim} onChange={(e) => setTrim(e.target.value as Trim)}>{Object.keys(TRIMS).map((t) => <option key={t} value={t}>{t.replace('x', ' × ')} pouces</option>)}</select></label>
            <label className="block">Nombre de pages intérieures<input type="number" min={24} max={828} className={input} value={pages} onChange={(e) => setPages(Math.max(24, +e.target.value || 24))} /></label>
            <label className="block">Papier<select className={input} value={paper} onChange={(e) => setPaper(e.target.value as Paper)}><option value="blanc">Blanc (noir et blanc)</option><option value="creme">Crème (noir et blanc)</option><option value="couleur">Blanc (couleur)</option></select></label>
            <button onClick={fromStory} className="w-full rounded-lg bg-accent px-3 py-2 font-bold text-accent-foreground">✨ Reprendre le résumé de mon livre</button>
            <label className="block">Texte de quatrième de couverture<textarea rows={5} className={input} value={backText} onChange={(e) => setBackText(e.target.value)} placeholder="Présentez votre livre en quelques phrases…" /></label>
            <label className="flex items-start gap-2"><input type="checkbox" checked={marks} onChange={(e) => setMarks(e.target.checked)} className="mt-1" /><span>Ajouter les repères d'impression (coupe et pli). <b>À décocher pour Amazon KDP</b>, qui refuse les repères ; utile pour un imprimeur ou pour vérifier.</span></label>
            <p className="text-xs text-muted-foreground">Dos : {(geo.spine * 2.54).toFixed(2)} cm · Couverture complète : {(geo.width * 2.54).toFixed(1)} × {(geo.height * 2.54).toFixed(1)} cm, fond perdu inclus, 300 DPI. {geo.spineText ? 'Titre et auteur écrits sur le dos.' : 'Moins de 79 pages : KDP n\'autorise pas de texte sur le dos.'} Un cadre blanc est réservé en bas de la quatrième pour le code-barres Amazon.</p>
            {wrapPreview && <div><p className="mb-1 text-xs text-muted-foreground">Aperçu : quatrième (gauche) · tranche (centre) · première (droite)</p><img src={wrapPreview} alt="Aperçu couverture brochée complète" className="w-full rounded shadow" /></div>}
            <button onClick={downloadWrap} className="w-full rounded-lg bg-primary px-3 py-3 font-bold text-primary-foreground">📥 Télécharger le PDF broché</button>
          </div>}
          </div>
          <div className="flex w-full max-w-3xl flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              {thumb && <img src={thumb} alt="Miniature Amazon" className="w-[64px] rounded shadow" />}
              <div><p className="font-semibold">Test miniature Amazon</p><p className="max-w-[260px] text-sm font-bold uppercase">{title}</p><p className="text-xs uppercase text-muted-foreground">{author}</p></div>
            </div>
            <p className="ml-auto max-w-[260px] text-sm text-muted-foreground">Le titre doit rester lisible à cette petite taille, comme dans les résultats Amazon.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
