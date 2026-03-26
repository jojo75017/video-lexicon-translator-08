import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileText, BookOpen, Loader2, CheckCircle2, Settings, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useSubscriptionGeneration';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { exportProfessionalDocx } from '@/utils/docxExportEngine';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

interface EbookAdvancedExportProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
  characters?: any[];
  coverImage?: string;
}

type ExportFormat = 'docx-kdp' | 'epub' | 'pdf-print' | 'pdf-digital' | 'txt' | 'html';

const formats: { id: ExportFormat; label: string; desc: string; icon: string }[] = [
  { id: 'docx-kdp', label: 'DOCX KDP Pro', desc: 'Format Word optimisé Amazon KDP 6×9', icon: '📝' },
  { id: 'epub', label: 'EPUB 3', desc: 'eBook universel avec table des matières', icon: '📱' },
  { id: 'pdf-print', label: 'PDF Impression', desc: 'PDF haute qualité format KDP 6×9', icon: '🖨️' },
  { id: 'pdf-digital', label: 'PDF Digital', desc: 'PDF optimisé écran avec liens cliquables', icon: '💻' },
  { id: 'txt', label: 'Texte Brut', desc: 'Export texte simple sans formatage', icon: '📄' },
  { id: 'html', label: 'HTML', desc: 'Page web autonome avec styles intégrés', icon: '🌐' },
];

export const EbookAdvancedExport: React.FC<EbookAdvancedExportProps> = ({
  ebookTitle, authorName, chapters, preface, conclusion, characters, coverImage,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('docx-kdp');
  const [isExporting, setIsExporting] = useState(false);
  const [includeToc, setIncludeToc] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeCopyright, setIncludeCopyright] = useState(true);
  const [includePreface, setIncludePreface] = useState(true);
  const [includeConclusion, setIncludeConclusion] = useState(true);

  const stats = useMemo(() => {
    let totalWords = 0;
    chapters.forEach(ch => {
      totalWords += (ch.content || '').split(/\s+/).filter(Boolean).length;
      ch.subChapters?.forEach(sc => {
        totalWords += (sc.content || '').split(/\s+/).filter(Boolean).length;
      });
    });
    return { totalWords, pages: Math.ceil(totalWords / 250), chapters: chapters.length };
  }, [chapters]);

  const buildFullContent = () => {
    const parts: string[] = [];
    if (includePreface && preface) parts.push(`PRÉFACE\n\n${cleanGeneratedText(preface)}`);
    chapters.forEach((ch, i) => {
      parts.push(`CHAPITRE ${i + 1} : ${ch.title}\n\n${cleanGeneratedText(ch.content || '')}`);
      ch.subChapters?.forEach((sc, j) => {
        if (sc.content) parts.push(`${ch.title} — ${sc.title}\n\n${cleanGeneratedText(sc.content)}`);
      });
    });
    if (includeConclusion && conclusion) parts.push(`CONCLUSION\n\n${cleanGeneratedText(conclusion)}`);
    return parts.join('\n\n---\n\n');
  };

  const epubStyles = `
    @page { margin: 1em; }
    body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.8; color: #1a1a1a; margin: 0; padding: 1.5em; text-align: justify; hyphens: auto; -webkit-hyphens: auto; }
    h1 { font-size: 1.6em; font-weight: 700; text-align: center; margin: 2em 0 1.5em; letter-spacing: 0.02em; line-height: 1.3; page-break-before: always; }
    h2 { font-size: 1.25em; font-weight: 600; margin: 1.8em 0 0.8em; color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3em; }
    p { margin: 0 0 0.8em; text-indent: 1.5em; orphans: 2; widows: 2; }
    p:first-of-type, h1 + p, h2 + p { text-indent: 0; }
    p:first-of-type::first-letter { font-size: 2.5em; float: left; line-height: 1; margin-right: 0.1em; font-weight: 700; }
    blockquote { margin: 1em 1.5em; padding-left: 1em; border-left: 3px solid #ccc; font-style: italic; color: #555; }
    .separator { text-align: center; margin: 2em 0; font-size: 1.2em; color: #999; letter-spacing: 0.5em; }
    .copyright { text-align: center; font-size: 0.85em; color: #666; margin-top: 40%; line-height: 2; }
    .title-page { text-align: center; padding-top: 30%; }
    .title-page h1 { font-size: 2.2em; margin-bottom: 0.3em; page-break-before: auto; }
    .title-page .author { font-size: 1.1em; color: #666; font-style: italic; margin-top: 1em; letter-spacing: 0.05em; }
    nav ol { list-style: none; padding: 0; }
    nav li { margin: 0.6em 0; }
    nav a { text-decoration: none; color: #1a1a1a; border-bottom: 1px dotted #ccc; padding-bottom: 2px; }
  `;

  const exportEpub = async () => {
    const zip = new JSZip();
    const uid = `urn:uuid:${crypto.randomUUID()}`;
    
    zip.file('mimetype', 'application/epub+zip');
    
    zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);

    // Shared stylesheet
    zip.file('OEBPS/styles.css', epubStyles);

    const chapterFiles: { id: string; title: string; filename: string }[] = [];
    const wrapPage = (title: string, body: string) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head><meta charset="UTF-8"/><title>${escapeXml(title)}</title><link rel="stylesheet" href="styles.css" type="text/css"/></head>
<body>${body}</body></html>`;

    // Title page
    zip.file('OEBPS/title.xhtml', wrapPage(ebookTitle,
      `<div class="title-page"><h1>${escapeXml(ebookTitle)}</h1><p class="author">${escapeXml(authorName)}</p></div>`));
    chapterFiles.push({ id: 'title', title: 'Page de titre', filename: 'title.xhtml' });

    // Copyright page
    if (includeCopyright) {
      const year = new Date().getFullYear();
      zip.file('OEBPS/copyright.xhtml', wrapPage('Copyright',
        `<div class="copyright"><p>© ${year} ${escapeXml(authorName)}</p><p>Tous droits réservés.</p><p>Aucune partie de cet ouvrage ne peut être reproduite sans autorisation écrite de l'auteur.</p><p>ISBN : [à compléter]</p></div>`));
      chapterFiles.push({ id: 'copyright', title: 'Copyright', filename: 'copyright.xhtml' });
    }

    // Preface
    if (includePreface && preface) {
      zip.file('OEBPS/preface.xhtml', wrapPage('Préface',
        `<h1>Préface</h1>${textToHtml(cleanGeneratedText(preface))}`));
      chapterFiles.push({ id: 'preface', title: 'Préface', filename: 'preface.xhtml' });
    }

    // Chapters
    chapters.forEach((ch, i) => {
      const fn = `chapter${i + 1}.xhtml`;
      let body = `<h1>Chapitre ${i + 1}<br/><span style="font-size:0.75em;font-weight:normal;font-style:italic">${escapeXml(ch.title)}</span></h1>`;
      body += textToHtml(cleanGeneratedText(ch.content || ''));
      ch.subChapters?.forEach(sc => {
        if (sc.content) {
          body += `<div class="separator">• • •</div>`;
          body += `<h2>${escapeXml(sc.title)}</h2>${textToHtml(cleanGeneratedText(sc.content))}`;
        }
      });
      zip.file(`OEBPS/${fn}`, wrapPage(ch.title, body));
      chapterFiles.push({ id: `ch${i + 1}`, title: `Chapitre ${i + 1} : ${ch.title}`, filename: fn });
    });

    // Conclusion
    if (includeConclusion && conclusion) {
      zip.file('OEBPS/conclusion.xhtml', wrapPage('Conclusion',
        `<h1>Conclusion</h1>${textToHtml(cleanGeneratedText(conclusion))}`));
      chapterFiles.push({ id: 'conclusion', title: 'Conclusion', filename: 'conclusion.xhtml' });
    }

    // TOC
    if (includeToc) {
      zip.file('OEBPS/toc.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="fr" lang="fr">
<head><meta charset="UTF-8"/><title>Table des matières</title><link rel="stylesheet" href="styles.css" type="text/css"/></head>
<body><nav epub:type="toc"><h1>Table des matières</h1><ol>
${chapterFiles.map(cf => `<li><a href="${cf.filename}">${escapeXml(cf.title)}</a></li>`).join('\n')}
</ol></nav></body></html>`);
    }

    // NCX
    zip.file('OEBPS/toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="${uid}"/></head>
<docTitle><text>${escapeXml(ebookTitle)}</text></docTitle>
<navMap>${chapterFiles.map((cf, i) => `<navPoint id="${cf.id}" playOrder="${i + 1}"><navLabel><text>${escapeXml(cf.title)}</text></navLabel><content src="${cf.filename}"/></navPoint>`).join('\n')}</navMap></ncx>`);

    // content.opf
    zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="uid">${uid}</dc:identifier>
  <dc:title>${escapeXml(ebookTitle)}</dc:title>
  <dc:creator>${escapeXml(authorName)}</dc:creator>
  <dc:language>fr</dc:language>
  <dc:rights>© ${new Date().getFullYear()} ${escapeXml(authorName)}</dc:rights>
  <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
</metadata>
<manifest>
  <item id="css" href="styles.css" media-type="text/css"/>
  ${chapterFiles.map(cf => `<item id="${cf.id}" href="${cf.filename}" media-type="application/xhtml+xml"/>`).join('\n  ')}
  ${includeToc ? '<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>' : ''}
  <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
</manifest>
<spine toc="ncx">
  ${chapterFiles.map(cf => `<itemref idref="${cf.id}"/>`).join('\n  ')}
</spine>
</package>`);

    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
    downloadBlob(blob, `${ebookTitle}.epub`);
  };

  const exportPdfPrint = () => {
    const isDigital = selectedFormat === 'pdf-digital';
    const pageW = isDigital ? 8.27 : 6;
    const pageH = isDigital ? 11.69 : 9;
    const doc = new jsPDF({ unit: 'in', format: [pageW, pageH] });
    const marginOuter = isDigital ? 1 : 0.75;
    const marginInner = isDigital ? 1 : 0.875; // inner margin larger for binding
    const contentWidth = pageW - marginOuter - marginInner;
    const maxY = pageH - 0.75;
    let y = marginOuter;
    let pageNum = 0;

    const newPage = () => {
      doc.addPage();
      pageNum++;
      y = marginOuter;
      if (includePageNumbers && pageNum > 2) {
        doc.setFontSize(9);
        doc.setFont('times', 'normal');
        doc.setTextColor(150);
        doc.text(String(pageNum), pageW / 2, pageH - 0.4, { align: 'center' });
        doc.setTextColor(30);
      }
    };

    const getMarginLeft = () => pageNum % 2 === 0 ? marginInner : marginOuter;

    const addText = (text: string, fontSize: number, isBold = false, isItalic = false, align: 'left' | 'center' | 'justify' = 'left') => {
      doc.setFontSize(fontSize);
      const style = isBold && isItalic ? 'bolditalic' : isBold ? 'bold' : isItalic ? 'italic' : 'normal';
      doc.setFont('times', style);
      const ml = getMarginLeft();
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize / 72 * 1.6;
      for (const line of lines) {
        if (y > maxY) newPage();
        if (align === 'center') doc.text(line, pageW / 2, y, { align: 'center' });
        else doc.text(line, ml, y);
        y += lineHeight;
      }
    };

    // ─── Title page ───
    doc.setTextColor(30);
    doc.setFontSize(32);
    doc.setFont('times', 'bold');
    const titleLines = doc.splitTextToSize(ebookTitle, contentWidth * 0.8);
    let titleY = pageH * 0.35;
    titleLines.forEach((line: string) => {
      doc.text(line, pageW / 2, titleY, { align: 'center' });
      titleY += 0.5;
    });
    doc.setFontSize(16);
    doc.setFont('times', 'italic');
    doc.setTextColor(100);
    doc.text(authorName, pageW / 2, titleY + 0.8, { align: 'center' });
    // Decorative line
    doc.setDrawColor(180);
    doc.setLineWidth(0.01);
    doc.line(pageW * 0.3, titleY + 0.3, pageW * 0.7, titleY + 0.3);
    doc.setTextColor(30);

    // ─── Copyright page ───
    if (includeCopyright) {
      newPage();
      y = pageH * 0.6;
      doc.setFontSize(9);
      doc.setFont('times', 'normal');
      doc.setTextColor(100);
      const copyrightLines = [
        `© ${new Date().getFullYear()} ${authorName}`,
        'Tous droits réservés.',
        '',
        'Aucune partie de cet ouvrage ne peut être reproduite,',
        'stockée ou transmise sous quelque forme que ce soit',
        'sans l\'autorisation écrite de l\'auteur.',
        '',
        'ISBN : [à compléter]',
      ];
      copyrightLines.forEach(line => {
        doc.text(line, pageW / 2, y, { align: 'center' });
        y += 0.18;
      });
      doc.setTextColor(30);
    }

    // ─── Preface ───
    if (includePreface && preface) {
      newPage();
      y = marginOuter + 1;
      addText('PRÉFACE', 16, true, false, 'center');
      y += 0.4;
      addText(cleanGeneratedText(preface), 11);
    }

    // ─── Chapters ───
    chapters.forEach((ch, i) => {
      newPage();
      y = marginOuter + 1.2;
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.setTextColor(120);
      doc.text(`CHAPITRE ${i + 1}`, pageW / 2, y, { align: 'center' });
      doc.setTextColor(30);
      y += 0.5;
      addText(ch.title, 22, true, false, 'center');
      // Decorative separator
      doc.setDrawColor(200);
      doc.line(pageW * 0.35, y + 0.1, pageW * 0.65, y + 0.1);
      y += 0.5;
      addText(cleanGeneratedText(ch.content || ''), 11);
      ch.subChapters?.forEach(sc => {
        if (sc.content) {
          y += 0.3;
          addText(sc.title, 13, true, true);
          y += 0.15;
          addText(cleanGeneratedText(sc.content), 11);
        }
      });
    });

    // ─── Conclusion ───
    if (includeConclusion && conclusion) {
      newPage();
      y = marginOuter + 1;
      addText('CONCLUSION', 16, true, false, 'center');
      y += 0.4;
      addText(cleanGeneratedText(conclusion), 11);
    }

    doc.save(`${ebookTitle} - ${isDigital ? 'Digital' : 'KDP Print'}.pdf`);
  };

  const exportTxt = () => {
    const content = buildFullContent();
    downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), `${ebookTitle}.txt`);
  };

  const exportHtml = () => {
    let html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${ebookTitle}</title>
<style>body{max-width:800px;margin:2em auto;font-family:Georgia,serif;line-height:1.8;color:#333;padding:0 1em}
h1{text-align:center;font-size:2.5em;margin:2em 0 0.5em}
.author{text-align:center;font-size:1.2em;color:#666;margin-bottom:3em}
h2{font-size:1.5em;margin-top:2em;border-bottom:1px solid #ddd;padding-bottom:0.3em}
h3{font-size:1.2em;margin-top:1.5em}
.toc{margin:2em 0;padding:1em;background:#f9f9f9;border-radius:8px}
.toc a{text-decoration:none;color:#333;display:block;padding:0.3em 0}
</style></head><body>
<h1>${ebookTitle}</h1><p class="author">${authorName}</p>`;

    if (includeToc) {
      html += '<div class="toc"><h2>Table des matières</h2>';
      chapters.forEach((ch, i) => { html += `<a href="#ch${i + 1}">Chapitre ${i + 1} : ${ch.title}</a>`; });
      html += '</div>';
    }

    chapters.forEach((ch, i) => {
      html += `<h2 id="ch${i + 1}">Chapitre ${i + 1} : ${ch.title}</h2>${textToHtml(cleanGeneratedText(ch.content || ''))}`;
      ch.subChapters?.forEach(sc => {
        if (sc.content) html += `<h3>${sc.title}</h3>${textToHtml(cleanGeneratedText(sc.content))}`;
      });
    });

    html += '</body></html>';
    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), `${ebookTitle}.html`);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      switch (selectedFormat) {
        case 'docx-kdp':
          await exportProfessionalDocx({ title: ebookTitle, authorName, chapters, preface: includePreface ? preface : undefined, conclusion: includeConclusion ? conclusion : undefined });
          break;
        case 'epub':
          await exportEpub();
          break;
        case 'pdf-print':
          exportPdfPrint();
          break;
        case 'pdf-digital':
          exportPdfPrint(); // Same for now, could be enhanced
          break;
        case 'txt':
          exportTxt();
          break;
        case 'html':
          exportHtml();
          break;
      }
      toast.success(`Export ${selectedFormat.toUpperCase()} réussi !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            Export Multi-Format Avancé
            <Badge className="bg-primary/10 text-primary border-primary/30">PRO</Badge>
          </CardTitle>
          <CardDescription>
            DOCX KDP, EPUB 3, PDF impression/digital, TXT et HTML — avec table des matières et mise en page professionnelle
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{stats.chapters}</div><div className="text-xs text-muted-foreground">Chapitres</div></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div><div className="text-xs text-muted-foreground">Mots</div></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold">~{stats.pages}</div><div className="text-xs text-muted-foreground">Pages</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Format selection */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Format d'export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formats.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${selectedFormat === f.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-medium text-sm">{f.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
                  {selectedFormat === f.id && <CheckCircle2 className="h-4 w-4 text-primary mt-2" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5" /> Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'toc', label: 'Table des matières', checked: includeToc, onChange: setIncludeToc },
              { id: 'pages', label: 'Numéros de pages', checked: includePageNumbers, onChange: setIncludePageNumbers },
              { id: 'copyright', label: 'Page de copyright', checked: includeCopyright, onChange: setIncludeCopyright },
              { id: 'preface', label: 'Préface', checked: includePreface, onChange: setIncludePreface },
              { id: 'conclusion', label: 'Conclusion', checked: includeConclusion, onChange: setIncludeConclusion },
            ].map(opt => (
              <div key={opt.id} className="flex items-center space-x-2">
                <Checkbox id={opt.id} checked={opt.checked} onCheckedChange={opt.onChange as any} />
                <Label htmlFor={opt.id} className="text-sm">{opt.label}</Label>
              </div>
            ))}

            <Button className="w-full mt-4" onClick={handleExport} disabled={isExporting || chapters.length === 0}>
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Exporter en {formats.find(f => f.id === selectedFormat)?.label}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function textToHtml(text: string): string {
  return text.split('\n\n')
    .filter(p => p.trim().length > 0)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default EbookAdvancedExport;
