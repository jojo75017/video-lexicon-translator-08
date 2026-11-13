import { useEffect, useRef, useState } from 'react';
import { COVER_GENRES, BADGE_STYLES } from '@/data/canvaCoverGenres';

const W = 1600, H = 2560;

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(/\s+/).filter(Boolean); const lines: string[] = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}

export default function V3CanvaCoverStudioPage() {
  const [tab, setTab] = useState<'modele' | 'visuel' | 'texte' | 'macaron'>('modele');
  const [genreId, setGenreId] = useState('guide');
  const [title, setTitle] = useState('Mon titre de livre');
  const [subtitle, setSubtitle] = useState('Un sous-titre court et clair');
  const [author, setAuthor] = useState('Prénom Nom');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [badgeOn, setBadgeOn] = useState(true);
  const [badgeText, setBadgeText] = useState('Méthode prouvée');
  const [badgeStyle, setBadgeStyle] = useState('or');
  const [badgePos, setBadgePos] = useState<'haut' | 'bas'>('haut');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumb, setThumb] = useState('');
  const genre = COVER_GENRES.find((g) => g.id === genreId)!;

  useEffect(() => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d')!;
    ctx.fillStyle = genre.bg; ctx.fillRect(0, 0, W, H);
    if (img) { const s = Math.max(W / img.width, H / img.height); ctx.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s); }
    ctx.fillStyle = genre.overlay; ctx.fillRect(0, 0, W, H);
    const t = genre.titleUpper ? title.toUpperCase() : title;
    let size = 210; const maxW = W - 200; let lines: string[] = [];
    do { ctx.font = genre.titleFont.replace('{s}', String(size)); lines = wrap(ctx, t, maxW); size -= 10; } while ((lines.length > 3 || lines.some((l) => ctx.measureText(l).width > maxW)) && size > 80);
    const lh = (size + 10) * 1.1; const blockH = lines.length * lh;
    let y = genre.titlePos === 'top' ? 260 : H - 420 - blockH;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (img) { ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 24; }
    ctx.fillStyle = genre.titleColor; lines.forEach((l) => { ctx.fillText(l, W / 2, y); y += lh; });
    ctx.font = '600 72px Montserrat, Arial, sans-serif'; ctx.fillStyle = genre.subColor;
    wrap(ctx, subtitle, maxW).slice(0, 2).forEach((l) => { ctx.fillText(l, W / 2, y + 30); y += 90; });
    ctx.font = '700 90px Montserrat, Arial, sans-serif'; ctx.fillStyle = genre.titleColor;
    ctx.fillText(author.toUpperCase(), W / 2, H - 200); ctx.shadowBlur = 0;
    if (badgeOn && badgeText.trim()) {
      const st = BADGE_STYLES.find((b) => b.id === badgeStyle)!; const r = 230;
      const cx = W - r - 90, cy = badgePos === 'haut' ? (genre.titlePos === 'top' ? y + r + 80 : r + 120) : H - r - 380;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = st.fill; ctx.fill();
      ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.stroke();
      ctx.fillStyle = st.text; ctx.font = '800 64px Montserrat, Arial, sans-serif'; ctx.textBaseline = 'middle';
      const bl = wrap(ctx, badgeText.toUpperCase(), r * 1.6).slice(0, 3);
      bl.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (bl.length - 1) / 2) * 72));
    }
    setThumb(c.toDataURL('image/jpeg', 0.6));
  }, [genre, title, subtitle, author, img, badgeOn, badgeText, badgeStyle, badgePos]);

  const onFile = (f?: File) => { if (!f) return; const i = new Image(); i.onload = () => setImg(i); i.src = URL.createObjectURL(f); };
  const download = () => { const a = document.createElement('a'); a.href = canvasRef.current!.toDataURL('image/jpeg', 0.95); a.download = (title || 'couverture').replace(/\W+/g, '-') + '-kindle.jpg'; a.click(); };
  const tabs = [['modele', '1. Modèle'], ['visuel', '2. Visuel'], ['texte', '3. Textes'], ['macaron', '4. Macaron']] as const;
  const input = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-foreground">
      <h1 className="text-3xl font-bold">Studio de couverture</h1>
      <p className="mb-6 text-muted-foreground">Choisissez un modèle, ajoutez votre image et vos textes : la couverture se met à jour en direct.</p>
      <div className="grid gap-6 md:grid-cols-[340px_1fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 grid grid-cols-2 gap-2">
            {tabs.map(([id, l]) => <button key={id} onClick={() => setTab(id)} className={`v3-chip-toggle rounded-lg px-3 py-2 text-sm font-semibold ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{l}</button>)}
          </div>
          {tab === 'modele' && <div className="space-y-2">{COVER_GENRES.map((g) => (
            <button key={g.id} onClick={() => { setGenreId(g.id); setBadgeText(g.badges[0]); }} className={`v3-chip-toggle flex w-full items-center gap-3 rounded-lg border p-2 text-left ${g.id === genreId ? 'border-primary' : 'border-border'}`}>
              <span className="h-10 w-7 rounded" style={{ background: g.bg, border: `3px solid ${g.titleColor}` }} /><span className="font-medium text-foreground">{g.label}</span>
            </button>))}</div>}
          {tab === 'visuel' && <div className="space-y-3"><p className="text-sm text-muted-foreground">Ajoutez l'illustration créée dans le studio d'images ou votre propre image.</p>
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />
            {img && <button onClick={() => setImg(null)} className="v3-chip-toggle rounded-lg bg-muted px-3 py-2 text-sm text-foreground">Retirer l'image</button>}</div>}
          {tab === 'texte' && <div className="space-y-3">
            <label className="block text-sm">Titre<input className={input} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label className="block text-sm">Sous-titre<input className={input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></label>
            <label className="block text-sm">Auteur<input className={input} value={author} onChange={(e) => setAuthor(e.target.value)} /></label></div>}
          {tab === 'macaron' && <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={badgeOn} onChange={(e) => setBadgeOn(e.target.checked)} /> Afficher le macaron</label>
            <div className="flex flex-wrap gap-2">{genre.badges.map((b) => <button key={b} onClick={() => setBadgeText(b)} className="v3-chip-toggle rounded-full bg-muted px-3 py-1 text-xs text-foreground">{b}</button>)}</div>
            <input className={input} value={badgeText} onChange={(e) => setBadgeText(e.target.value)} maxLength={40} />
            <div className="grid grid-cols-2 gap-2">{BADGE_STYLES.map((s) => <button key={s.id} onClick={() => setBadgeStyle(s.id)} className={`v3-chip-toggle rounded-lg border p-2 text-xs ${badgeStyle === s.id ? 'border-primary' : 'border-border'}`} style={{ background: s.fill, color: s.text }}>{s.label}</button>)}</div>
            <div className="flex gap-2">{(['haut', 'bas'] as const).map((p) => <button key={p} onClick={() => setBadgePos(p)} className={`v3-chip-toggle flex-1 rounded-lg px-3 py-2 text-sm ${badgePos === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>En {p}</button>)}</div></div>}
        </div>
        <div className="flex flex-col items-center gap-4">
          <canvas ref={canvasRef} width={W} height={H} className="w-full max-w-[360px] rounded shadow-2xl" />
          <div className="flex items-end gap-3 text-sm text-muted-foreground">
            {thumb && <img src={thumb} alt="Miniature Amazon" className="w-[60px] rounded shadow" />}<span>Test miniature Amazon : le titre doit rester lisible à cette taille.</span>
          </div>
          <button onClick={download} className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">Télécharger pour Kindle (1600 × 2560)</button>
        </div>
      </div>
    </div>
  );
}
