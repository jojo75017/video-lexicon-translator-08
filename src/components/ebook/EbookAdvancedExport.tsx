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

  const exportEpub = async () => {
    const zip = new JSZip();
    
    // mimetype (must be first, uncompressed)
    zip.file('mimetype', 'application/epub+zip');
    
    // META-INF
    zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);

    // Build chapters HTML
    const chapterFiles: { id: string; title: string; filename: string }[] = [];
    
    // Title page
    zip.file('OEBPS/title.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${ebookTitle}</title>
<style>body{text-align:center;padding:2em;font-family:Georgia,serif}h1{font-size:2em;margin-top:3em}p.author{font-size:1.2em;margin-top:2em;color:#666}</style>
</head><body><h1>${ebookTitle}</h1><p class="author">${authorName}</p></body></html>`);
    chapterFiles.push({ id: 'title', title: 'Page de titre', filename: 'title.xhtml' });

    if (includePreface && preface) {
      zip.file('OEBPS/preface.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Préface</title>
<style>body{padding:1em;font-family:Georgia,serif;line-height:1.8}h1{font-size:1.5em}</style>
</head><body><h1>Préface</h1>${textToHtml(cleanGeneratedText(preface))}</body></html>`);
      chapterFiles.push({ id: 'preface', title: 'Préface', filename: 'preface.xhtml' });
    }

    chapters.forEach((ch, i) => {
      const fn = `chapter${i + 1}.xhtml`;
      let content = `<h1>Chapitre ${i + 1} : ${ch.title}</h1>${textToHtml(cleanGeneratedText(ch.content || ''))}`;
      ch.subChapters?.forEach(sc => {
        if (sc.content) content += `<h2>${sc.title}</h2>${textToHtml(cleanGeneratedText(sc.content))}`;
      });
      zip.file(`OEBPS/${fn}`, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${ch.title}</title>
<style>body{padding:1em;font-family:Georgia,serif;line-height:1.8}h1{font-size:1.5em;margin-bottom:1em}h2{font-size:1.2em;margin-top:1.5em}</style>
</head><body>${content}</body></html>`);
      chapterFiles.push({ id: `ch${i + 1}`, title: `Chapitre ${i + 1} : ${ch.title}`, filename: fn });
    });

    if (includeConclusion && conclusion) {
      zip.file('OEBPS/conclusion.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Conclusion</title>
<style>body{padding:1em;font-family:Georgia,serif;line-height:1.8}h1{font-size:1.5em}</style>
</head><body><h1>Conclusion</h1>${textToHtml(cleanGeneratedText(conclusion))}</body></html>`);
      chapterFiles.push({ id: 'conclusion', title: 'Conclusion', filename: 'conclusion.xhtml' });
    }

    // TOC
    if (includeToc) {
      zip.file('OEBPS/toc.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Table des matières</title>
<style>body{padding:1em;font-family:Georgia,serif}nav ol{list-style:none;padding-left:0}li{margin:0.5em 0}a{text-decoration:none;color:#333}</style>
</head><body><nav epub:type="toc"><h1>Table des matières</h1><ol>
${chapterFiles.map(cf => `<li><a href="${cf.filename}">${cf.title}</a></li>`).join('\n')}
</ol></nav></body></html>`);
    }

    // NCX
    zip.file('OEBPS/toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="ebook-${Date.now()}"/></head>
<docTitle><text>${ebookTitle}</text></docTitle>
<navMap>${chapterFiles.map((cf, i) => `<navPoint id="${cf.id}" playOrder="${i + 1}"><navLabel><text>${cf.title}</text></navLabel><content src="${cf.filename}"/></navPoint>`).join('\n')}</navMap></ncx>`);

    // content.opf
    zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="uid">ebook-${Date.now()}</dc:identifier>
  <dc:title>${ebookTitle}</dc:title>
  <dc:creator>${authorName}</dc:creator>
  <dc:language>fr</dc:language>
  <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
</metadata>
<manifest>
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
    const doc = new jsPDF({ unit: 'in', format: [6, 9] });
    const margin = 0.75;
    const pageWidth = 6 - margin * 2;
    let y = margin;

    const addText = (text: string, fontSize: number, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(text, pageWidth);
      for (const line of lines) {
        if (y > 8.25) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += fontSize / 72 * 1.5;
      }
    };

    // Title page
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(ebookTitle, 3, 3.5, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(authorName, 3, 4.5, { align: 'center' });

    if (includeCopyright) {
      doc.addPage();
      y = margin;
      addText(`© ${new Date().getFullYear()} ${authorName}`, 10);
      addText('Tous droits réservés.', 10);
      addText('ISBN: [à compléter]', 10);
    }

    chapters.forEach((ch, i) => {
      doc.addPage();
      y = margin + 0.5;
      addText(`Chapitre ${i + 1}`, 12);
      addText(ch.title, 20, true);
      y += 0.3;
      addText(cleanGeneratedText(ch.content || ''), 11);
      ch.subChapters?.forEach(sc => {
        if (sc.content) {
          y += 0.2;
          addText(sc.title, 14, true);
          y += 0.1;
          addText(cleanGeneratedText(sc.content), 11);
        }
      });
    });

    doc.save(`${ebookTitle} - KDP Print.pdf`);
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
  return text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
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
