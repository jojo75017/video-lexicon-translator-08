/**
 * Guides illustrés (type « L'aquarium de A à Z ») : sommaire puis rédaction
 * chapitre par chapitre avec la clé du client (BYOK), une illustration par
 * chapitre, export Word/PDF au format KDP. Aucun contenu de secours.
 */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, BorderStyle, ShadingType } from 'docx';
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey, getOpenRouterModel } from '@/services/aiWritingService';
import { VC_FORMATS, VC_MARGINS } from './vcBooksExport';
import { getIsCurrentSessionAdmin } from './adminAccess';

export interface GuideChapter { title: string; summary: string; text: string; imagePrompt: string; imageUrl?: string; caption?: string }
export interface GuideBrief { title: string; subtitle: string; subject: string; audience: string; image_style: string; chapter_count: number }
export interface GuideBook extends GuideBrief { author_name: string; format: string; chapters: GuideChapter[]; description?: string; categories?: string; cover_url?: string | null }
export interface GuideSheet { subtitle: string; author_name: string; subject: string; audience: string; description: string; categories: string }

export const GUIDE_CHAPTERS_MIN = 3;
export const GUIDE_CHAPTERS_MAX = 30;
export const GUIDE_IMAGE_STYLES: Record<string, string> = {
  photo: 'Photo réaliste',
  schema: 'Schéma pédagogique',
  aquarelle: 'Illustration aquarelle',
};

function extractJson(raw: string): Record<string, unknown> {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : (raw.match(/\{[\s\S]*\}/)?.[0] ?? raw);
  return JSON.parse(body);
}

/** Nettoie le texte : plus jamais de tiret cadratin (—) ni demi-cadratin (–) dans les livres. */
export function stripCadratins(t: unknown): string {
  const s = String(t ?? '');
  return s
    .replace(/(\d)\s*[—–]\s*(\d)/g, '$1 à $2')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,\s*(?=[).!?])/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/ +,/g, ',')
    .replace(/,\s*$/, '.')
    .trim();
}

export function parseOutline(raw: string): GuideChapter[] {
  const list = (extractJson(raw).chapters as unknown[]) ?? [];
  return (Array.isArray(list) ? list : [])
    .map((c) => { const o = c as Record<string, unknown>; return { title: stripCadratins(String(o.title ?? '')), summary: stripCadratins(String(o.summary ?? '')), text: '', imagePrompt: String(o.imagePrompt ?? '').trim() }; })
    .filter((c) => c.title);
}

export function parseChapter(raw: string): { text: string; caption: string } {
  let o: Record<string, unknown> = {};
  try { o = extractJson(raw); } catch { /* JSON abîmé ou coupé : récupération ci-dessous */ }
  let text = String(o.text ?? '');
  let caption = String(o.caption ?? '');
  if (!text) {
    // Réponse longue coupée ou mal échappée : on récupère quand même le texte du chapitre.
    const m = raw.match(/"text"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"caption"\s*:\s*"([\s\S]*?)"\s*}|$)/);
    if (m) {
      text = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/"\s*}?\s*`*\s*$/, '');
      caption = m[2] ?? caption;
    } else {
      const plain = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      if (plain.split(/\s+/).length > 300 && !plain.startsWith('{')) text = plain;
    }
  }
  text = stripCadratins(text);
  if (!text) throw new Error('chapitre vide');
  return { text, caption: stripCadratins(caption) };
}

/** Mots-clés photo courts : le titre du chapitre sans « Chapitre N : ». */
export function photoQuery(chapterTitle: string, guideSubject = ''): string {
  const t = chapterTitle.replace(/^\s*chapitre\s*\d+\s*[:.\-]?\s*/i, '').replace(/[«»"'()]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = t.split(' ').filter((w) => w.length > 2 && !/^(les|des|une|pour|avec|dans|sur|son|ses|aux|du|de|la|le)$/i.test(w));
  const base = words.slice(0, 4).join(' ');
  return (base + (guideSubject ? ' ' + guideSubject : '')).trim().slice(0, 80);
}

const LANG = 'LANGUE : français courant uniquement, orthographe impeccable. Interdit : latin, pseudo-langues, mots inventés, anglicismes décoratifs. GUIDE PRATIQUE : aucun personnage, aucune intrigue, aucune fiction. PONCTUATION : jamais de tiret cadratin (—) ni de demi-cadratin (–) ; remplace-les par une virgule, un point ou des deux-points.';

export function buildOutlinePrompt(b: GuideBrief): string {
  return `${LANG}
GUIDE ILLUSTRÉ : "${b.title}"${b.subtitle ? ` — ${b.subtitle}` : ''}
Sujet : ${b.subject || b.title}
${b.audience ? `Public : ${b.audience}` : ''}
Écris le sommaire en exactement ${b.chapter_count} chapitres logiques, du plus simple au plus avancé (si le titre dit « de A à Z », couvre tout le parcours).
Pour chaque chapitre : "title" (court), "summary" (2 phrases), "imagePrompt" (description visuelle précise et concrète de l'illustration du chapitre, sans texte dans l'image).
Réponds uniquement en JSON : {"chapters":[{"title":"...","summary":"...","imagePrompt":"..."}]}`;
}

/** Encart à fond gris (astuce, conseil, citation, à retenir). */
export function boxKind(p: string): 'tip' | 'quote' | null {
  if (/^Citation\s*:/i.test(p)) return 'quote';
  if (/^(Astuce|Conseil|À retenir)\s*:/i.test(p)) return 'tip';
  return null;
}

export function buildChapterPrompt(b: GuideBrief, chapters: GuideChapter[], index: number): string {
  const c = chapters[index];
  return `${LANG}
GUIDE ILLUSTRÉ : "${b.title}" — sujet : ${b.subject || b.title}${b.audience ? ` — public : ${b.audience}` : ''}
SOMMAIRE : ${chapters.map((x, i) => `${i + 1}. ${x.title}`).join(' ; ')}
Rédige le chapitre ${index + 1} « ${c.title} » : ${c.summary}
- "text" : AU MINIMUM 2800 mots (vise 2900 à 3200), au moins 6 intertitres sur une ligne commençant par "## ", paragraphes séparés par une ligne vide, conseils concrets, chiffres exacts.
- Encarts (chacun seul dans son paragraphe) : au moins 3 paragraphes commençant par "Astuce : " et au moins 2 commençant par "Conseil : ", répartis dans le chapitre.
- Citations : au moins 2 paragraphes commençant par "Citation : ", phrase réelle et vérifiable d'une personne connue liée au sujet, suivie de l'auteur entre parenthèses. Aucun guillemet. N'invente jamais une citation ni son auteur.
- Termine par un encadré commençant par "À retenir :".
- Ne répète pas les autres chapitres.
- "caption" : légende de l'illustration (1 phrase).
Réponds uniquement en JSON : {"text":"...","caption":"..."}`;
}

/** Surcharge temporaire du fournisseur (429/503, « high demand », « overloaded ») : seule erreur relancée. */
export function isTransientOverload(msg: string): boolean {
  return /high demand|overloaded|try again later|rate.?limit|\b(429|500|502|503|504)\b|unavailable|surcharg|provider returned error/i.test(msg);
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRY_DELAYS = [4000, 10000, 20000];

async function callWriter(prompt: string, where: string): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    try { return await callWriterOnce(prompt, where); }
    catch (e) {
      const msg = (e as Error).message;
      if (attempt >= RETRY_DELAYS.length || !isTransientOverload(msg)) {
        throw new Error(isTransientOverload(msg) ? `${where} : le moteur IA de votre clé est saturé en ce moment. Patientez quelques minutes puis relancez.` : msg);
      }
      await wait(RETRY_DELAYS[attempt] + Math.random() * 1000);
    }
  }
}

async function callWriterOnce(prompt: string, where: string): Promise<string> {
  // Administrateur : OpenRouter en priorité. Abonnés : le moteur qu'ils ont choisi (Gemini par défaut).
  const admin = await getIsCurrentSessionAdmin().catch(() => false);
  const provider = admin ? 'openrouter' : getProvider();
  const userKey = getProviderKey(provider) || '';
  if (!userKey && !admin) throw new Error('Enregistrez votre clé de rédaction dans « Choisir mon IA · Clés API » avant de lancer le robot.');
  const model = provider === 'openrouter' ? getOpenRouterModel() : undefined;
  const { data, error } = await supabase.functions.invoke('generate-content', { body: { type: 'illustrated-guide', prompt, provider, model, userApiKey: userKey } });
  if (error) {
    let msg = error.message || 'appel IA échoué';
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.clone === 'function') { const d = await ctx.clone().json().catch(() => null); if (typeof d?.error === 'string') msg = d.error; }
    throw new Error(`${where} : ${msg}`);
  }
  if (data?.error) throw new Error(`${where} : ${data.error}`);
  return String(data?.content ?? '');
}

export function buildSheetPrompt(title: string): string {
  return `${LANG}
À partir du seul titre de guide pratique illustré « ${title} », prépare la fiche éditoriale KDP en français :
- "subtitle" : sous-titre vendeur et précis (max 15 mots).
- "author_name" : un nom de plume français crédible et neutre (prénom + nom), modifiable par l'auteur.
- "subject" : sujet et contenu attendu (2 phrases).
- "audience" : public visé (quelques mots).
- "description" : description Amazon d'environ 150 mots (140 à 170), sans promesse mensongère, sans prix.
- "categories" : 3 catégories KDP françaises pertinentes, séparées par " ; " (ex. « Animaux > Poissons et aquariums »).
Réponds uniquement en JSON : {"subtitle":"...","author_name":"...","subject":"...","audience":"...","description":"...","categories":"..."}`;
}

export function parseSheet(raw: string): GuideSheet {
  const o = extractJson(raw);
  const g = (k: string) => stripCadratins(String(o[k] ?? ''));
  const sheet = { subtitle: g('subtitle'), author_name: g('author_name'), subject: g('subject'), audience: g('audience'), description: g('description'), categories: g('categories') };
  if (!sheet.description || !sheet.subtitle) throw new Error('fiche incomplète');
  return sheet;
}

export async function writeSheet(title: string): Promise<GuideSheet> {
  if (!title.trim()) throw new Error('Indiquez d’abord le titre du guide.');
  const raw = await callWriter(buildSheetPrompt(title.trim()), 'Fiche interrompue');
  try { return parseSheet(raw); } catch { throw new Error('Fiche illisible. Relancez.'); }
}

export function buildGuideCoverPrompt(b: { title: string; subtitle: string; author_name: string; subject: string; image_style: string }): string {
  const art = b.image_style === 'schema' || b.image_style === 'aquarelle'
    ? 'Couverture de guide documentaire, illustration réaliste aquarellée haut de gamme.'
    : 'Couverture de guide pratique haut de gamme, photographie réaliste professionnelle, lumière soignée.';
  return `${art} Sujet visuel : ${b.subject || b.title}. Format vertical 6×9, composition éditoriale claire avec zones calmes pour le texte.
Typographie française parfaitement lisible. Reproduire uniquement ces textes à l’identique : titre « ${b.title} » en haut, grand ; ${b.subtitle ? `sous-titre « ${b.subtitle} » sous le titre ; ` : ''}${b.author_name ? `auteur « ${b.author_name} » en bas. ` : ''}Aucun autre mot, aucun faux texte, sans prix, sans logo, sans filigrane, sans livre en perspective.`;
}

export async function generateGuideCover(b: { title: string; subtitle: string; author_name: string; subject: string; image_style: string }): Promise<string> {
  const prompt = buildGuideCoverPrompt(b);
  const { data, error } = await supabase.functions.invoke('generate-ai-cover', {
    body: { title: b.title, subtitle: b.subtitle, author: b.author_name, format: 'kindle', userPrompt: prompt, customPrompt: prompt, genre: 'Guide pratique illustré' },
  });
  if (error) {
    let msg = error.message;
    if (error.context instanceof Response) { const d = await error.context.clone().json().catch(() => null); if (typeof d?.error === 'string') msg = d.error; }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  if (typeof data?.imageUrl !== 'string' || !data.imageUrl) throw new Error('Aucune couverture reçue.');
  return data.imageUrl;
}

/** Mockup 3D (livre broché en perspective + ombre) dessiné à partir de la vraie couverture, PNG transparent pour les tunnels de vente. */
export async function buildBookMockup(coverUrl: string): Promise<Blob> {
  const blob = await (await fetch(coverUrl)).blob();
  const src = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('couverture illisible')); i.src = src; });
    const W = 1600, H = 1600, c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d'); if (!ctx) throw new Error('canvas indisponible');
    const bh = 1180, bw = Math.round(bh * 2 / 3), x = (W - bw) / 2 + 40, y = (H - bh) / 2, spine = 46;
    ctx.save(); ctx.filter = 'blur(28px)'; ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(x + bw / 2, y + bh + 20, bw * 0.62, 46, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#e9e5dc'; ctx.beginPath(); ctx.moveTo(x + bw, y + 8); ctx.lineTo(x + bw + 18, y + 22); ctx.lineTo(x + bw + 18, y + bh + 6); ctx.lineTo(x + bw, y + bh - 4); ctx.fill();
    ctx.drawImage(img, x, y, bw, bh);
    const g = ctx.createLinearGradient(x, 0, x + spine, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(0.5, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x, y, spine, bh);
    const sh = ctx.createLinearGradient(x, y, x + bw, y + bh);
    sh.addColorStop(0, 'rgba(255,255,255,0.12)'); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = sh; ctx.fillRect(x, y, bw, bh);
    return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('mockup impossible'))), 'image/png'));
  } finally { URL.revokeObjectURL(src); }
}

export async function writeOutline(b: GuideBrief): Promise<GuideChapter[]> {
  const raw = await callWriter(buildOutlinePrompt(b), 'Sommaire interrompu');
  let list: GuideChapter[];
  try { list = parseOutline(raw); } catch { throw new Error('Sommaire illisible. Relancez.'); }
  if (!list.length) throw new Error('Le moteur n’a renvoyé aucun chapitre. Relancez.');
  return list.slice(0, b.chapter_count);
}

export async function writeChapter(b: GuideBrief, chapters: GuideChapter[], index: number): Promise<GuideChapter> {
  const raw = await callWriter(buildChapterPrompt(b, chapters, index), `Chapitre ${index + 1} interrompu`);
  try { const r = parseChapter(raw); return { ...chapters[index], text: r.text, caption: r.caption || chapters[index].caption }; }
  catch { throw new Error(`Chapitre ${index + 1} illisible. Relancez pour continuer.`); }
}

export function buildGuideImagePrompt(style: string, scene: string): string {
  if (!scene.trim()) throw new Error('Décrivez l’illustration du chapitre.');
  const art = style === 'schema'
    ? 'Schéma pédagogique propre, style planche documentaire, fond clair, éléments clairement séparés et identifiables, couleurs sobres.'
    : style === 'aquarelle'
      ? 'Illustration documentaire à l’aquarelle, détaillée et réaliste dans les proportions, fond papier clair.'
      : 'Photographie réaliste haute définition, lumière naturelle, mise au point nette, rendu documentaire professionnel.';
  return `${art}\nSujet : ${scene.trim()}\nAUCUN TEXTE : aucune lettre, aucun chiffre, aucune légende, aucune étiquette, aucun logo, aucun filigrane. Format vertical, sujet complet et cadré.`;
}

export async function generateChapterImage(title: string, style: string, scene: string): Promise<string> {
  const prompt = buildGuideImagePrompt(style, scene);
  const { data, error } = await supabase.functions.invoke('generate-ai-cover', {
    body: { title: title || 'Guide illustré', format: 'kindle', userPrompt: prompt, customPrompt: prompt, genre: 'Guide pratique illustré' },
  });
  if (error) {
    let msg = error.message;
    if (error.context instanceof Response) { const d = await error.context.clone().json().catch(() => null); if (typeof d?.error === 'string') msg = d.error; }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  if (typeof data?.imageUrl !== 'string' || !data.imageUrl) throw new Error('Aucune illustration reçue.');
  return data.imageUrl;
}

// ---------- Exports ----------
const mmToTwip = (mm: number) => Math.round((mm / 25.4) * 1440);
const paras = (s: string) => stripCadratins(s).split(/\n\s*\n|\n/).map((x) => x.trim()).filter(Boolean);
export const guideFileName = (t: string, ext: string) => `${(t || 'guide').replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'guide'}.${ext}`;

async function loadImage(url: string): Promise<{ data: Uint8Array; dataUrl: string; w: number; h: number; type: 'png' | 'jpg' } | null> {
  try {
    const blob = await (await fetch(url)).blob();
    const dataUrl = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(blob); });
    const dims = await new Promise<{ w: number; h: number }>((res, rej) => { const i = new Image(); i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight }); i.onerror = rej; i.src = dataUrl; });
    return { data: new Uint8Array(await blob.arrayBuffer()), dataUrl, ...dims, type: blob.type.includes('png') ? 'png' : 'jpg' };
  } catch { return null; }
}

export async function buildGuideDocx(book: GuideBook): Promise<Blob> {
  const f = VC_FORMATS[book.format] ?? VC_FORMATS['6x9'];
  const textW = f.w - VC_MARGINS.inside - VC_MARGINS.outside;
  const ch: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2400 }, children: [new TextRun({ text: book.title, size: 44, bold: true })] }),
    ...(book.subtitle ? [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240 }, children: [new TextRun({ text: book.subtitle, size: 26, italics: true })] })] : []),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 }, children: [new TextRun({ text: book.author_name || '', size: 26 })] }),
    new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun('Sommaire')] }),
    ...book.chapters.map((c, i) => new Paragraph({ children: [new TextRun(`${i + 1}. ${c.title}`)] })),
  ];
  for (const [i, c] of book.chapters.entries()) {
    ch.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(`Chapitre ${i + 1} : ${c.title}`)] }));
    const img = c.imageUrl ? await loadImage(c.imageUrl) : null;
    if (img) {
      const wPx = Math.round((textW / 25.4) * 96);
      ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: img.type, data: img.data, transformation: { width: wPx, height: Math.round(wPx * img.h / img.w * 0.75) } })] }));
      if (c.caption) ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: stripCadratins(c.caption), italics: true, size: 18 })] }));
    }
    for (const p of paras(c.text)) {
      if (p.startsWith('## ')) ch.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 }, children: [new TextRun(p.slice(3))] }));
      else if (boxKind(p)) {
        const q = boxKind(p) === 'quote'; const label = p.match(/^[^:]+:/)?.[0] ?? ''; const body = p.slice(label.length).trim();
        const bd = { style: BorderStyle.SINGLE, size: 6, color: 'D9D9D9', space: 6 };
        ch.push(new Paragraph({ alignment: AlignmentType.LEFT, shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'EDEDED' }, border: { top: bd, bottom: bd, left: bd, right: bd }, indent: { left: 120, right: 120 }, spacing: { before: 200, after: 240 }, children: q ? [new TextRun({ text: body, italics: true })] : [new TextRun({ text: label + ' ', bold: true }), new TextRun(body)] }));
      }
      else ch.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 140 }, children: [new TextRun({ text: p })] }));
    }
  }
  const doc = new Document({
    styles: { default: { document: { run: { font: 'Georgia', size: 22 } } } },
    sections: [{ properties: { page: { size: { width: mmToTwip(f.w), height: mmToTwip(f.h) }, margin: { top: mmToTwip(VC_MARGINS.top), bottom: mmToTwip(VC_MARGINS.bottom), left: mmToTwip(VC_MARGINS.inside), right: mmToTwip(VC_MARGINS.outside) } } }, children: ch }],
  });
  return Packer.toBlob(doc);
}

export async function buildGuidePdf(book: GuideBook): Promise<Blob> {
  const f = VC_FORMATS[book.format] ?? VC_FORMATS['6x9'];
  const pdf = new jsPDF({ unit: 'mm', format: [f.w, f.h] });
  const x = VC_MARGINS.inside, w = f.w - VC_MARGINS.inside - VC_MARGINS.outside, maxY = f.h - VC_MARGINS.bottom;
  let y = VC_MARGINS.top;
  const newPage = () => { pdf.addPage([f.w, f.h]); y = VC_MARGINS.top; };
  const write = (t: string, size: number, style: 'normal' | 'bold' | 'italic' = 'normal', align: 'left' | 'center' | 'justify' = 'left', after = 2) => {
    pdf.setFont('times', style); pdf.setFontSize(size);
    const lh = size * 0.42;
    for (const line of pdf.splitTextToSize(t, w) as string[]) {
      if (y + lh > maxY) newPage();
      pdf.text(line, align === 'center' ? f.w / 2 : x, y + lh, { align: align === 'center' ? 'center' : 'left' });
      y += lh;
    }
    y += after;
  };
  const writeBox = (p: string) => {
    const q = boxKind(p) === 'quote'; const label = p.match(/^[^:]+:/)?.[0] ?? '';
    const t = q ? p.slice(label.length).trim() : p; const pad = 3, size = 10.5, lh = size * 0.42;
    pdf.setFont('times', q ? 'italic' : 'normal'); pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(t, w - pad * 2) as string[];
    y += 2;
    let i = 0;
    while (i < lines.length) {
      if (y + pad * 2 + lh > maxY) newPage();
      const fit = Math.max(1, Math.min(lines.length - i, Math.floor((maxY - y - pad * 2) / lh)));
      pdf.setFillColor(237, 237, 237); pdf.setDrawColor(217, 217, 217);
      pdf.rect(x, y, w, fit * lh + pad * 2, 'FD');
      pdf.setTextColor(35, 47, 62);
      for (let k = 0; k < fit; k++) {
        const line = lines[i + k];
        if (!q && i + k === 0 && line.startsWith(label)) {
          pdf.setFont('times', 'bold'); pdf.text(label, x + pad, y + pad + lh * (k + 1) - 0.8);
          const lw = pdf.getTextWidth(label + ' '); pdf.setFont('times', 'normal'); pdf.text(line.slice(label.length).trimStart(), x + pad + lw, y + pad + lh * (k + 1) - 0.8);
        } else pdf.text(line, x + pad, y + pad + lh * (k + 1) - 0.8);
      }
      y += fit * lh + pad * 2; i += fit;
    }
    pdf.setTextColor(0, 0, 0); y += 4;
  };
  y = f.h * 0.3; write(book.title, 22, 'bold', 'center', 6);
  if (book.subtitle) write(book.subtitle, 13, 'italic', 'center', 12);
  write(book.author_name || '', 13, 'normal', 'center');
  newPage(); write('Sommaire', 18, 'bold', 'left', 6);
  book.chapters.forEach((c, i) => write(`${i + 1}. ${c.title}`, 11));
  for (const [i, c] of book.chapters.entries()) {
    newPage(); write(`Chapitre ${i + 1} : ${c.title}`, 16, 'bold', 'left', 5);
    const img = c.imageUrl ? await loadImage(c.imageUrl) : null;
    if (img) {
      let ih = w * img.h / img.w; let iw = w;
      const maxH = (maxY - y) * 0.6; if (ih > maxH) { iw = iw * maxH / ih; ih = maxH; }
      pdf.addImage(img.dataUrl, img.type === 'png' ? 'PNG' : 'JPEG', x + (w - iw) / 2, y, iw, ih); y += ih + 3;
      if (c.caption) write(stripCadratins(c.caption), 9, 'italic', 'center', 5);
    }
    for (const p of paras(c.text)) {
      if (p.startsWith('## ')) write(p.slice(3), 13, 'bold', 'left', 2);
      else if (boxKind(p)) writeBox(p);
      else write(p, 11, 'normal', 'left', 3);
    }
  }
  return pdf.output('blob');
}

// ---------- Photos libres (Unsplash / Pixabay) ----------
export interface StockPhoto { id: string; source: 'unsplash' | 'pixabay'; thumb: string; full: string; width: number; height: number; author: string; link: string; download?: string }

export const photoCredit = (p: Pick<StockPhoto, 'author' | 'source'>) => `Photo : ${p.author} / ${p.source === 'unsplash' ? 'Unsplash' : 'Pixabay'}`;

export async function searchStockPhotos(query: string): Promise<StockPhoto[]> {
  if (!query.trim()) throw new Error('Indiquez des mots-clés.');
  const { data, error } = await supabase.functions.invoke('stock-photos', { body: { query } });
  if (error) {
    let msg = error.message;
    if (error.context instanceof Response) { const d = await error.context.clone().json().catch(() => null); if (typeof d?.error === 'string') msg = d.error; }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return Array.isArray(data?.photos) ? data.photos : [];
}

export function trackStockPhoto(p: StockPhoto) {
  if (p.source === 'unsplash' && p.download) void supabase.functions.invoke('stock-photos', { body: { track: p.download } });
}

/** Couverture 6×9 composée à partir d'une vraie photo : photo plein cadre, bandeau titre, auteur. */
export async function composePhotoCover(photoUrl: string, b: { title: string; subtitle: string; author_name: string }): Promise<Blob> {
  const blob = await (await fetch(photoUrl)).blob();
  const src = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('photo illisible')); i.src = src; });
    const W = 1800, H = 2700, c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d'); if (!ctx) throw new Error('canvas indisponible');
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    ctx.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.45); top.addColorStop(0, 'rgba(10,20,30,0.85)'); top.addColorStop(1, 'rgba(10,20,30,0)');
    ctx.fillStyle = top; ctx.fillRect(0, 0, W, H * 0.45);
    const bot = ctx.createLinearGradient(0, H * 0.78, 0, H); bot.addColorStop(0, 'rgba(10,20,30,0)'); bot.addColorStop(1, 'rgba(10,20,30,0.85)');
    ctx.fillStyle = bot; ctx.fillRect(0, H * 0.78, W, H * 0.22);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const wrap = (text: string, font: string, maxW: number) => { ctx.font = font; const out: string[] = []; let line = ''; for (const w of text.split(/\s+/)) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; };
    let y = 190;
    for (const l of wrap(b.title.toUpperCase(), 'bold 150px Georgia, serif', W - 240)) { ctx.font = 'bold 150px Georgia, serif'; ctx.fillText(l, W / 2, y); y += 170; }
    if (b.subtitle) { y += 30; for (const l of wrap(b.subtitle, 'italic 64px Georgia, serif', W - 300)) { ctx.font = 'italic 64px Georgia, serif'; ctx.fillText(l, W / 2, y); y += 80; } }
    if (b.author_name) { ctx.font = '600 78px Georgia, serif'; ctx.textBaseline = 'bottom'; ctx.fillText(b.author_name, W / 2, H - 150); }
    return await new Promise<Blob>((res, rej) => c.toBlob((x) => (x ? res(x) : rej(new Error('couverture impossible'))), 'image/jpeg', 0.92));
  } finally { URL.revokeObjectURL(src); }
}
