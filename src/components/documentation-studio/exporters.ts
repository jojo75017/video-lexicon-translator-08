// Documentation Studio AI — exports client (Word, PDF, HTML, Markdown, PowerPoint)
import { saveAs } from 'file-saver';
import type { DocProject } from './types';

export interface GeneratedDoc {
  id: string;
  label: string;
  content: string; // markdown
}

const safeName = (s: string) =>
  (s || 'documentation').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'documentation';

// ---------- Markdown ----------
export function buildMarkdown(project: DocProject, docs: GeneratedDoc[]): string {
  const p = project.project;
  const head = `# ${p.name || 'Documentation'}${p.slogan ? `\n\n> ${p.slogan}` : ''}\n\n_${p.company || ''} — v${p.version || '1.0'} — ${new Date().toLocaleDateString('fr-FR')}_\n`;
  const toc = docs.length > 1 ? `\n## Sommaire\n${docs.map((d, i) => `${i + 1}. ${d.label}`).join('\n')}\n` : '';
  const body = docs.map((d) => `\n\n---\n\n# ${d.label}\n\n${d.content}`).join('');
  return head + toc + body;
}

export function exportMarkdown(project: DocProject, docs: GeneratedDoc[]) {
  const md = buildMarkdown(project, docs);
  saveAs(new Blob([md], { type: 'text/markdown;charset=utf-8' }), `${safeName(project.project.name)}.md`);
}

// ---------- HTML ----------
function mdToHtml(md: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
  for (let raw of lines) {
    let line = esc(raw);
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>');
    if (/^######\s+/.test(raw)) { closeList(); out.push(`<h6>${line.replace(/^######\s+/, '')}</h6>`); }
    else if (/^#####\s+/.test(raw)) { closeList(); out.push(`<h5>${line.replace(/^#####\s+/, '')}</h5>`); }
    else if (/^####\s+/.test(raw)) { closeList(); out.push(`<h4>${line.replace(/^####\s+/, '')}</h4>`); }
    else if (/^###\s+/.test(raw)) { closeList(); out.push(`<h3>${line.replace(/^###\s+/, '')}</h3>`); }
    else if (/^##\s+/.test(raw)) { closeList(); out.push(`<h2>${line.replace(/^##\s+/, '')}</h2>`); }
    else if (/^#\s+/.test(raw)) { closeList(); out.push(`<h1>${line.replace(/^#\s+/, '')}</h1>`); }
    else if (/^>\s+/.test(raw)) { closeList(); out.push(`<blockquote>${line.replace(/^&gt;\s+/, '')}</blockquote>`); }
    else if (/^[-*]\s+/.test(raw)) { if (!inList) { out.push('<ul>'); inList = true; } out.push(`<li>${line.replace(/^[-*]\s+/, '')}</li>`); }
    else if (/^---+$/.test(raw.trim())) { closeList(); out.push('<hr/>'); }
    else if (raw.trim() === '') { closeList(); }
    else { closeList(); out.push(`<p>${line}</p>`); }
  }
  closeList();
  return out.join('\n');
}

export function buildHtml(project: DocProject, docs: GeneratedDoc[]): string {
  const p = project.project;
  const sections = docs.map((d) => `<section><h1 class="doc-title">${d.label}</h1>${mdToHtml(d.content)}</section>`).join('\n<hr class="sep"/>\n');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${p.name || 'Documentation'}</title>
<style>
:root{--amber:#E8951E;--ink:#2A2118;--muted:#7c6b54;--cream:#FBF6EC;--border:#eadfc9}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;color:var(--ink);background:#fff;line-height:1.6}
.wrap{max-width:820px;margin:0 auto;padding:48px 24px}
.cover{text-align:center;padding:64px 0 40px;border-bottom:3px solid var(--amber);margin-bottom:40px}
.cover h1{font-size:40px;margin:0 0 8px}.cover p{color:var(--muted);font-size:18px;margin:4px 0}
h1,h2,h3,h4{color:var(--ink);line-height:1.25}.doc-title{border-left:5px solid var(--amber);padding-left:14px;margin-top:8px}
h2{margin-top:28px}blockquote{border-left:4px solid var(--amber);background:var(--cream);margin:16px 0;padding:12px 18px;color:var(--muted)}
code{background:var(--cream);padding:2px 6px;border-radius:4px;font-size:.9em}ul{padding-left:22px}li{margin:4px 0}
.sep{border:none;border-top:1px solid var(--border);margin:48px 0}hr{border:none;border-top:1px solid var(--border);margin:20px 0}
</style></head><body><div class="wrap">
<div class="cover"><h1>${p.name || 'Documentation'}</h1>${p.slogan ? `<p><em>${p.slogan}</em></p>` : ''}<p>${p.company || ''} — v${p.version || '1.0'}</p><p>${new Date().toLocaleDateString('fr-FR')}</p></div>
${sections}
</div></body></html>`;
}

export function exportHtml(project: DocProject, docs: GeneratedDoc[]) {
  const html = buildHtml(project, docs);
  saveAs(new Blob([html], { type: 'text/html;charset=utf-8' }), `${safeName(project.project.name)}.html`);
}

// ---------- Word (.docx) ----------
export async function exportDocx(project: DocProject, docs: GeneratedDoc[]) {
  const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import('docx');
  const p = project.project;
  const AMBER = 'C97A14';
  const children: any[] = [];

  const inline = (text: string) => {
    // gras **..**
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((seg) => seg.startsWith('**') && seg.endsWith('**')
      ? new TextRun({ text: seg.slice(2, -2), bold: true })
      : new TextRun({ text: seg }));
  };

  children.push(new Paragraph({ text: p.name || 'Documentation', heading: HeadingLevel.TITLE }));
  if (p.slogan) children.push(new Paragraph({ children: [new TextRun({ text: p.slogan, italics: true, color: AMBER })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: `${p.company || ''} — v${p.version || '1.0'} — ${new Date().toLocaleDateString('fr-FR')}`, color: '7c6b54' })] }));

  for (const d of docs) {
    children.push(new Paragraph({ text: '', spacing: { before: 300 } }));
    children.push(new Paragraph({ text: d.label, heading: HeadingLevel.HEADING_1, pageBreakBefore: true }));
    for (const raw of d.content.split('\n')) {
      const line = raw.trimEnd();
      if (!line.trim()) { continue; }
      if (/^###\s+/.test(line)) children.push(new Paragraph({ text: line.replace(/^###\s+/, ''), heading: HeadingLevel.HEADING_3 }));
      else if (/^##\s+/.test(line)) children.push(new Paragraph({ text: line.replace(/^##\s+/, ''), heading: HeadingLevel.HEADING_2 }));
      else if (/^#\s+/.test(line)) children.push(new Paragraph({ text: line.replace(/^#\s+/, ''), heading: HeadingLevel.HEADING_2 }));
      else if (/^>\s+/.test(line)) children.push(new Paragraph({ children: [new TextRun({ text: line.replace(/^>\s+/, ''), italics: true, color: '7c6b54' })] }));
      else if (/^[-*]\s+/.test(line)) children.push(new Paragraph({ children: inline(line.replace(/^[-*]\s+/, '')), bullet: { level: 0 } }));
      else if (/^---+$/.test(line.trim())) continue;
      else children.push(new Paragraph({ children: inline(line) }));
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeName(p.name)}.docx`);
}

// ---------- PDF ----------
export async function exportPdf(project: DocProject, docs: GeneratedDoc[]) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const p = project.project;
  const M = 56;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const maxW = W - M * 2;
  let y = 0;

  const nl = (h: number) => { y += h; if (y > H - M) { doc.addPage(); y = M; } };
  const write = (text: string, size: number, style: 'normal' | 'bold' | 'italic', color: [number, number, number], indent = 0) => {
    doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxW - indent);
    for (const ln of lines) { if (y > H - M) { doc.addPage(); y = M; } doc.text(ln, M + indent, y); y += size * 1.35; }
  };

  // Couverture
  y = H / 2 - 40;
  doc.setDrawColor(232, 149, 30); doc.setLineWidth(3); doc.line(M, y - 30, M + 80, y - 30);
  write(p.name || 'Documentation', 30, 'bold', [42, 33, 24]);
  if (p.slogan) { nl(6); write(p.slogan, 14, 'italic', [124, 107, 84]); }
  nl(10); write(`${p.company || ''} — v${p.version || '1.0'}`, 11, 'normal', [124, 107, 84]);
  write(new Date().toLocaleDateString('fr-FR'), 11, 'normal', [124, 107, 84]);

  for (const d of docs) {
    doc.addPage(); y = M;
    doc.setFillColor(232, 149, 30); doc.rect(M, y - 14, 5, 22, 'F');
    write(d.label, 22, 'bold', [42, 33, 24], 14);
    nl(10);
    for (const raw of d.content.split('\n')) {
      const line = raw.trimEnd();
      if (!line.trim()) { nl(4); continue; }
      if (/^###\s+/.test(line)) { nl(6); write(line.replace(/^###\s+/, ''), 13, 'bold', [201, 122, 20]); }
      else if (/^##\s+/.test(line)) { nl(8); write(line.replace(/^##\s+/, ''), 15, 'bold', [42, 33, 24]); }
      else if (/^#\s+/.test(line)) { nl(8); write(line.replace(/^#\s+/, ''), 16, 'bold', [42, 33, 24]); }
      else if (/^>\s+/.test(line)) write(line.replace(/^>\s+/, ''), 11, 'italic', [124, 107, 84], 14);
      else if (/^[-*]\s+/.test(line)) write(`•  ${line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '')}`, 11, 'normal', [42, 33, 24], 12);
      else if (/^---+$/.test(line.trim())) continue;
      else write(line.replace(/\*\*/g, ''), 11, 'normal', [42, 33, 24]);
    }
  }
  doc.save(`${safeName(p.name)}.pdf`);
}

// ---------- PowerPoint ----------
export async function exportPptx(project: DocProject, docs: GeneratedDoc[]) {
  const PptxGenJS = (await import('pptxgenjs')).default;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  const p = project.project;
  const AMBER = 'E8951E'; const INK = '2A2118'; const MUTED = '7C6B54'; const CREAM = 'FBF6EC';

  // Couverture
  const cover = pptx.addSlide();
  cover.background = { color: CREAM };
  cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.25, h: 7.5, fill: { color: AMBER } });
  cover.addText(p.name || 'Documentation', { x: 0.8, y: 2.6, w: 11.5, h: 1.2, fontSize: 44, bold: true, color: INK });
  if (p.slogan) cover.addText(p.slogan, { x: 0.8, y: 3.8, w: 11.5, h: 0.6, fontSize: 20, italic: true, color: MUTED });
  cover.addText(`${p.company || ''} — v${p.version || '1.0'} — ${new Date().toLocaleDateString('fr-FR')}`, { x: 0.8, y: 4.5, w: 11.5, h: 0.5, fontSize: 14, color: MUTED });

  for (const d of docs) {
    // Slide titre de section
    const title = pptx.addSlide();
    title.background = { color: 'FFFFFF' };
    title.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.1, w: 0.15, h: 1.2, fill: { color: AMBER } });
    title.addText(d.label, { x: 0.95, y: 3.2, w: 11.5, h: 1.0, fontSize: 34, bold: true, color: INK });

    // Découper le contenu en blocs par ## pour créer des slides
    const blocks: { heading: string; bullets: string[] }[] = [];
    let cur: { heading: string; bullets: string[] } | null = null;
    for (const raw of d.content.split('\n')) {
      const line = raw.trim();
      if (!line || /^---+$/.test(line)) continue;
      if (/^#{1,3}\s+/.test(line)) {
        cur = { heading: line.replace(/^#{1,3}\s+/, '').replace(/\*\*/g, ''), bullets: [] };
        blocks.push(cur);
      } else {
        if (!cur) { cur = { heading: d.label, bullets: [] }; blocks.push(cur); }
        cur.bullets.push(line.replace(/^[-*>]\s+/, '').replace(/\*\*/g, ''));
      }
    }
    for (const b of blocks.slice(0, 12)) {
      const s = pptx.addSlide();
      s.background = { color: 'FFFFFF' };
      s.addText(b.heading, { x: 0.6, y: 0.4, w: 12, h: 0.8, fontSize: 24, bold: true, color: AMBER });
      const text = b.bullets.slice(0, 8).map((t) => ({ text: t, options: { bullet: true, color: INK, fontSize: 16, breakLine: true } }));
      if (text.length) s.addText(text as any, { x: 0.8, y: 1.4, w: 11.8, h: 5.5, valign: 'top' });
    }
  }

  const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
  saveAs(blob, `${safeName(p.name)}.pptx`);
}

export async function runExport(format: string, project: DocProject, docs: GeneratedDoc[]) {
  switch (format) {
    case 'markdown': return exportMarkdown(project, docs);
    case 'html': return exportHtml(project, docs);
    case 'docx': return exportDocx(project, docs);
    case 'pdf': return exportPdf(project, docs);
    case 'pptx': return exportPptx(project, docs);
    default: throw new Error('Format inconnu');
  }
}
