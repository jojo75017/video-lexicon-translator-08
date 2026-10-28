/**
 * Guides illustrés (type « L'aquarium de A à Z ») : sommaire puis rédaction
 * chapitre par chapitre avec la clé du client (BYOK), une illustration par
 * chapitre, export Word/PDF au format KDP. Aucun contenu de secours.
 */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx';
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey, getOpenRouterModel } from '@/services/aiWritingService';
import { VC_FORMATS, VC_MARGINS } from './vcBooksExport';

export interface GuideChapter { title: string; summary: string; text: string; imagePrompt: string; imageUrl?: string; caption?: string }
export interface GuideBrief { title: string; subtitle: string; subject: string; audience: string; image_style: string; chapter_count: number }
export interface GuideBook extends GuideBrief { author_name: string; format: string; chapters: GuideChapter[] }

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

export function parseOutline(raw: string): GuideChapter[] {
  const list = (extractJson(raw).chapters as unknown[]) ?? [];
  return (Array.isArray(list) ? list : [])
    .map((c) => { const o = c as Record<string, unknown>; return { title: String(o.title ?? '').trim(), summary: String(o.summary ?? '').trim(), text: '', imagePrompt: String(o.imagePrompt ?? '').trim() }; })
    .filter((c) => c.title);
}

export function parseChapter(raw: string): { text: string; caption: string } {
  const o = extractJson(raw);
  const text = String(o.text ?? '').trim();
  if (!text) throw new Error('chapitre vide');
  return { text, caption: String(o.caption ?? '').trim() };
}

const LANG = 'LANGUE : français courant uniquement, orthographe impeccable. Interdit : latin, pseudo-langues, mots inventés, anglicismes décoratifs. GUIDE PRATIQUE : aucun personnage, aucune intrigue, aucune fiction.';

export function buildOutlinePrompt(b: GuideBrief): string {
  return `${LANG}
GUIDE ILLUSTRÉ : "${b.title}"${b.subtitle ? ` — ${b.subtitle}` : ''}
Sujet : ${b.subject || b.title}
${b.audience ? `Public : ${b.audience}` : ''}
Écris le sommaire en exactement ${b.chapter_count} chapitres logiques, du plus simple au plus avancé (si le titre dit « de A à Z », couvre tout le parcours).
Pour chaque chapitre : "title" (court), "summary" (2 phrases), "imagePrompt" (description visuelle précise et concrète de l'illustration du chapitre, sans texte dans l'image).
Réponds uniquement en JSON : {"chapters":[{"title":"...","summary":"...","imagePrompt":"..."}]}`;
}

export function buildChapterPrompt(b: GuideBrief, chapters: GuideChapter[], index: number): string {
  const c = chapters[index];
  return `${LANG}
GUIDE ILLUSTRÉ : "${b.title}" — sujet : ${b.subject || b.title}${b.audience ? ` — public : ${b.audience}` : ''}
SOMMAIRE : ${chapters.map((x, i) => `${i + 1}. ${x.title}`).join(' ; ')}
Rédige le chapitre ${index + 1} « ${c.title} » : ${c.summary}
- "text" : 900 à 1300 mots, intertitres sur une ligne commençant par "## ", paragraphes séparés par une ligne vide, conseils concrets, chiffres exacts, encadré final commençant par "À retenir :".
- Ne répète pas les autres chapitres.
- "caption" : légende de l'illustration (1 phrase).
Réponds uniquement en JSON : {"text":"...","caption":"..."}`;
}

async function callWriter(prompt: string, where: string): Promise<string> {
  const provider = getProvider();
  const userKey = getProviderKey(provider);
  if (!userKey) throw new Error('Enregistrez votre clé de rédaction dans « Choisir mon IA · Clés API » avant de lancer le robot.');
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
const paras = (s: string) => s.split(/\n\s*\n|\n/).map((x) => x.trim()).filter(Boolean);
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
    ch.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(`Chapitre ${i + 1} — ${c.title}`)] }));
    const img = c.imageUrl ? await loadImage(c.imageUrl) : null;
    if (img) {
      const wPx = Math.round((textW / 25.4) * 96);
      ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: img.type, data: img.data, transformation: { width: wPx, height: Math.round(wPx * img.h / img.w * 0.75) } })] }));
      if (c.caption) ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: c.caption, italics: true, size: 18 })] }));
    }
    for (const p of paras(c.text)) {
      if (p.startsWith('## ')) ch.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 }, children: [new TextRun(p.slice(3))] }));
      else ch.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 140 }, children: [new TextRun({ text: p, bold: p.startsWith('À retenir') })] }));
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
  y = f.h * 0.3; write(book.title, 22, 'bold', 'center', 6);
  if (book.subtitle) write(book.subtitle, 13, 'italic', 'center', 12);
  write(book.author_name || '', 13, 'normal', 'center');
  newPage(); write('Sommaire', 18, 'bold', 'left', 6);
  book.chapters.forEach((c, i) => write(`${i + 1}. ${c.title}`, 11));
  for (const [i, c] of book.chapters.entries()) {
    newPage(); write(`Chapitre ${i + 1} — ${c.title}`, 16, 'bold', 'left', 5);
    const img = c.imageUrl ? await loadImage(c.imageUrl) : null;
    if (img) {
      let ih = w * img.h / img.w; let iw = w;
      const maxH = (maxY - y) * 0.6; if (ih > maxH) { iw = iw * maxH / ih; ih = maxH; }
      pdf.addImage(img.dataUrl, img.type === 'png' ? 'PNG' : 'JPEG', x + (w - iw) / 2, y, iw, ih); y += ih + 3;
      if (c.caption) write(c.caption, 9, 'italic', 'center', 5);
    }
    for (const p of paras(c.text)) {
      if (p.startsWith('## ')) write(p.slice(3), 13, 'bold', 'left', 2);
      else write(p, 11, p.startsWith('À retenir') ? 'bold' : 'normal', 'left', 3);
    }
  }
  return pdf.output('blob');
}
