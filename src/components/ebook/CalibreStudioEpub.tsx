import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Upload, Loader2, Download, BookOpen, FileText, Check, ChevronRight,
  Settings2, Eye, Sparkles, X, Image as ImageIcon, Type
} from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ChapterData {
  title: string;
  content: string; // HTML
}

interface EpubMetadata {
  title: string;
  author: string;
  language: string;
  description: string;
  publisher: string;
  coverImage: string | null;
}

const STEPS = [
  { id: 1, label: 'Téléverse ton document', description: 'Sélectionne le fichier Word à convertir en EPUB' },
  { id: 2, label: 'Renseigne les métadonnées', description: 'Titre, auteur et langue de ton livre' },
  { id: 3, label: 'Personnalise le style', description: 'Police, taille et mise en page EPUB' },
  { id: 4, label: 'Aperçu & Export', description: 'Vérifie et télécharge ton EPUB' },
];

export const CalibreStudioEpub: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metadata, setMetadata] = useState<EpubMetadata>({
    title: '', author: '', language: 'fr', description: '', publisher: '', coverImage: null,
  });

  const [style, setStyle] = useState({
    fontFamily: 'Georgia', fontSize: '16px', lineHeight: '1.6',
    textAlign: 'justify' as string, includeTableOfContents: true,
  });

  // ---- Step 1: Upload & Parse DOCX ----
  const handleFile = useCallback(async (file: File) => {
    const isDocx = file.name.endsWith('.docx');
    const isTxt = file.name.endsWith('.txt');
    if (!isDocx && !isTxt) {
      toast.error('Format non supporté. Utilisez .docx ou .txt');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 20 Mo)');
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);

    try {
      if (isDocx) {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const parsed = parseHtmlToChapters(result.value);
        setChapters(parsed);
        toast.success(`${parsed.length} chapitre(s) détecté(s) !`);
      } else {
        const text = await file.text();
        const parsed = parseTextToChapters(text);
        setChapters(parsed);
        toast.success(`${parsed.length} chapitre(s) détecté(s) !`);
      }

      // Auto-fill title from filename
      const nameWithoutExt = file.name.replace(/\.(docx|txt)$/i, '');
      setMetadata(prev => ({ ...prev, title: prev.title || nameWithoutExt }));
      setCurrentStep(2);
    } catch (err: any) {
      console.error('Parse error:', err);
      toast.error('Erreur lors de la lecture du fichier');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const parseHtmlToChapters = (html: string): ChapterData[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const headings = doc.querySelectorAll('h1, h2');

    if (headings.length === 0) {
      return [{ title: 'Chapitre 1', content: html }];
    }

    const chaps: ChapterData[] = [];
    headings.forEach((heading, i) => {
      const title = heading.textContent?.trim() || `Chapitre ${i + 1}`;
      let content = '';
      let sibling = heading.nextElementSibling;
      while (sibling && !['H1', 'H2'].includes(sibling.tagName)) {
        content += sibling.outerHTML;
        sibling = sibling.nextElementSibling;
      }
      chaps.push({ title, content });
    });
    return chaps;
  };

  const parseTextToChapters = (text: string): ChapterData[] => {
    const lines = text.split('\n');
    const chaps: ChapterData[] = [];
    let currentTitle = '';
    let currentContent = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^(chapitre|chapter)\s+\d+/i.test(trimmed) || /^#+\s/.test(trimmed)) {
        if (currentTitle || currentContent) {
          chaps.push({ title: currentTitle || `Chapitre ${chaps.length + 1}`, content: `<p>${currentContent}</p>` });
        }
        currentTitle = trimmed.replace(/^#+\s*/, '');
        currentContent = '';
      } else if (trimmed) {
        currentContent += (currentContent ? '<br/>' : '') + trimmed;
      }
    }
    if (currentTitle || currentContent) {
      chaps.push({ title: currentTitle || `Chapitre ${chaps.length + 1}`, content: `<p>${currentContent}</p>` });
    }
    return chaps.length > 0 ? chaps : [{ title: 'Chapitre 1', content: `<p>${text}</p>` }];
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ---- Cover Image Upload ----
  const coverInputRef = useRef<HTMLInputElement>(null);
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMetadata(prev => ({ ...prev, coverImage: ev.target?.result as string }));
      toast.success('Couverture ajoutée !');
    };
    reader.readAsDataURL(file);
  };

  // ---- Step 4: Generate EPUB ----
  const generateEpub = async () => {
    if (!metadata.title || !metadata.author) {
      toast.error('Titre et auteur requis');
      return;
    }
    setIsProcessing(true);
    toast.info('📦 Génération de l\'EPUB en cours...');

    try {
      const zip = new JSZip();
      const uuid = crypto.randomUUID();

      // mimetype MUST be first and uncompressed
      zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

      // META-INF/container.xml
      zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

      // CSS
      const css = `
body { font-family: ${style.fontFamily}, serif; font-size: ${style.fontSize}; line-height: ${style.lineHeight}; text-align: ${style.textAlign}; margin: 1em; color: #222; }
h1, h2, h3 { font-family: ${style.fontFamily}, serif; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
h1 { font-size: 1.8em; text-align: center; page-break-before: always; }
h2 { font-size: 1.4em; }
p { margin: 0.5em 0; text-indent: 1.5em; }
p:first-of-type { text-indent: 0; }
img { max-width: 100%; height: auto; }
.cover-page { text-align: center; page-break-after: always; }
.cover-page img { max-height: 95vh; }
`;
      zip.file('OEBPS/style.css', css);

      // Cover image
      let coverManifest = '';
      let coverSpine = '';
      if (metadata.coverImage) {
        const base64Data = metadata.coverImage.split(',')[1];
        const mimeMatch = metadata.coverImage.match(/data:(image\/\w+);/);
        const mimeType = mimeMatch?.[1] || 'image/jpeg';
        const ext = mimeType.split('/')[1];
        zip.file(`OEBPS/images/cover.${ext}`, base64Data, { base64: true });
        coverManifest = `<item id="cover-image" href="images/cover.${ext}" media-type="${mimeType}" properties="cover-image"/>
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>`;
        coverSpine = `<itemref idref="cover"/>`;

        zip.file('OEBPS/cover.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Couverture</title><link rel="stylesheet" href="style.css"/></head>
<body>
  <div class="cover-page">
    <img src="images/cover.${ext}" alt="Couverture"/>
  </div>
</body>
</html>`);
      }

      // Chapters
      const chapterManifest: string[] = [];
      const chapterSpine: string[] = [];
      const tocItems: string[] = [];

      chapters.forEach((ch, i) => {
        const id = `chapter${i}`;
        const filename = `${id}.xhtml`;

        zip.file(`OEBPS/${filename}`, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${metadata.language}" lang="${metadata.language}">
<head><title>${escapeXml(ch.title)}</title><link rel="stylesheet" href="style.css"/></head>
<body>
  <h1>${escapeXml(ch.title)}</h1>
  ${ch.content}
</body>
</html>`);

        chapterManifest.push(`<item id="${id}" href="${filename}" media-type="application/xhtml+xml"/>`);
        chapterSpine.push(`<itemref idref="${id}"/>`);
        tocItems.push(`<li><a href="${filename}">${escapeXml(ch.title)}</a></li>`);
      });

      // TOC
      if (style.includeTableOfContents) {
        zip.file('OEBPS/toc.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${metadata.language}" lang="${metadata.language}">
<head><title>Table des matières</title><link rel="stylesheet" href="style.css"/></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table des matières</h1>
    <ol>
      ${tocItems.join('\n      ')}
    </ol>
  </nav>
</body>
</html>`);
      }

      // content.opf
      const now = new Date().toISOString();
      zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
    <dc:title>${escapeXml(metadata.title)}</dc:title>
    <dc:creator>${escapeXml(metadata.author)}</dc:creator>
    <dc:language>${metadata.language}</dc:language>
    <dc:description>${escapeXml(metadata.description)}</dc:description>
    <dc:publisher>${escapeXml(metadata.publisher)}</dc:publisher>
    <meta property="dcterms:modified">${now.replace(/\.\d{3}Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    <item id="style" href="style.css" media-type="text/css"/>
    ${style.includeTableOfContents ? '<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>' : ''}
    ${coverManifest}
    ${chapterManifest.join('\n    ')}
  </manifest>
  <spine>
    ${coverSpine}
    ${style.includeTableOfContents ? '<itemref idref="toc"/>' : ''}
    ${chapterSpine.join('\n    ')}
  </spine>
</package>`);

      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
      const safeTitle = metadata.title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç\s-]/gi, '').trim().replace(/\s+/g, '_');
      saveAs(blob, `${safeTitle}.epub`);
      toast.success('✅ EPUB généré et téléchargé !');
    } catch (err: any) {
      console.error('EPUB generation error:', err);
      toast.error('Erreur lors de la génération EPUB');
    } finally {
      setIsProcessing(false);
    }
  };

  const escapeXml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  const goToStep = (step: number) => {
    if (step < currentStep || (step === 2 && chapters.length > 0) || (step <= currentStep)) {
      setCurrentStep(step);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setChapters([]);
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-500 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDgiLz48L2c+PC9zdmc+')] opacity-60" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Calibre Studio EPUB</h2>
            <p className="text-indigo-100 text-sm">De ton fichier Word à un ebook parfait, prêt à publier</p>
          </div>
          <Badge className="ml-auto bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Convertisseur Pro
          </Badge>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 px-4">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => goToStep(step.id)}
              className={`flex items-center gap-2.5 transition-all ${
                currentStep === step.id ? 'opacity-100' : currentStep > step.id ? 'opacity-70 cursor-pointer' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                currentStep > step.id
                  ? 'bg-emerald-500 text-white'
                  : currentStep === step.id
                    ? 'bg-indigo-500 text-white ring-4 ring-indigo-200'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-xs font-semibold ${currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Étape {step.id}
                </p>
                <p className={`text-[11px] ${currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                currentStep > step.id ? 'bg-emerald-400' : 'bg-muted'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                Téléverse ton document
              </CardTitle>
              <CardDescription>Sélectionne le fichier Word (.docx) ou texte (.txt) à convertir en EPUB</CardDescription>
            </CardHeader>
            <CardContent>
              <input type="file" ref={fileInputRef} accept=".docx,.txt" onChange={handleFileInput} className="hidden" />
              {uploadedFile ? (
                <div className="relative group p-6 rounded-xl border-2 border-indigo-200 bg-indigo-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} Ko • {chapters.length} chapitre(s)</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFile} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {isProcessing && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyse du document...
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center transition-all min-h-[220px] ${
                    isDragOver
                      ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                      : 'border-indigo-300 bg-indigo-50/20 hover:border-indigo-400 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="font-semibold text-foreground">Document Word (.docx)</p>
                  <p className="text-sm text-muted-foreground mt-1">Cliquez pour sélectionner ou glissez-déposez</p>
                  <p className="text-xs text-muted-foreground mt-3">.docx ou .txt • Max 20 Mo</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Metadata */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Renseigne les métadonnées
              </CardTitle>
              <CardDescription>Titre, auteur et langue de ton livre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold">Titre du livre *</Label>
                <Input value={metadata.title} onChange={e => setMetadata(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Le guide complet du marketing digital" className="mt-1" />
              </div>
              <div>
                <Label className="font-semibold">Nom de l'auteur *</Label>
                <Input value={metadata.author} onChange={e => setMetadata(p => ({ ...p, author: e.target.value }))}
                  placeholder="Ex: Jean Dupont" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Langue</Label>
                  <Select value={metadata.language} onValueChange={v => setMetadata(p => ({ ...p, language: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="pt">🇵🇹 Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold">Éditeur</Label>
                  <Input value={metadata.publisher} onChange={e => setMetadata(p => ({ ...p, publisher: e.target.value }))}
                    placeholder="Ex: Mon Édition" className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="font-semibold">Description</Label>
                <Textarea value={metadata.description} onChange={e => setMetadata(p => ({ ...p, description: e.target.value }))}
                  placeholder="Résumé du livre..." rows={3} className="mt-1" />
              </div>

              {/* Cover Upload */}
              <div>
                <Label className="font-semibold">Couverture (optionnel)</Label>
                <input type="file" ref={coverInputRef} accept="image/*" onChange={handleCoverUpload} className="hidden" />
                {metadata.coverImage ? (
                  <div className="mt-2 relative group w-32">
                    <img src={metadata.coverImage} alt="Couverture" className="rounded-lg border shadow-md w-32 h-auto" />
                    <Button variant="ghost" size="sm"
                      onClick={() => setMetadata(p => ({ ...p, coverImage: null }))}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => coverInputRef.current?.click()} className="mt-2">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Ajouter une couverture
                  </Button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>Retour</Button>
                <Button onClick={() => setCurrentStep(3)} disabled={!metadata.title || !metadata.author}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  Continuer <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Style */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-500" />
                Personnalise le style
              </CardTitle>
              <CardDescription>Police, taille et mise en page de ton EPUB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Police</Label>
                  <Select value={style.fontFamily} onValueChange={v => setStyle(p => ({ ...p, fontFamily: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Georgia">Georgia (classique)</SelectItem>
                      <SelectItem value="'Times New Roman'">Times New Roman</SelectItem>
                      <SelectItem value="'Palatino Linotype'">Palatino</SelectItem>
                      <SelectItem value="'Bookman Old Style'">Bookman</SelectItem>
                      <SelectItem value="'Segoe UI'">Segoe UI (moderne)</SelectItem>
                      <SelectItem value="Arial">Arial (sans-serif)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold">Taille du texte</Label>
                  <Select value={style.fontSize} onValueChange={v => setStyle(p => ({ ...p, fontSize: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14px">Petit (14px)</SelectItem>
                      <SelectItem value="16px">Normal (16px)</SelectItem>
                      <SelectItem value="18px">Grand (18px)</SelectItem>
                      <SelectItem value="20px">Très grand (20px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Interligne</Label>
                  <Select value={style.lineHeight} onValueChange={v => setStyle(p => ({ ...p, lineHeight: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.4">Compact (1.4)</SelectItem>
                      <SelectItem value="1.6">Normal (1.6)</SelectItem>
                      <SelectItem value="1.8">Aéré (1.8)</SelectItem>
                      <SelectItem value="2.0">Très aéré (2.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold">Alignement</Label>
                  <Select value={style.textAlign} onValueChange={v => setStyle(p => ({ ...p, textAlign: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="justify">Justifié</SelectItem>
                      <SelectItem value="left">Gauche</SelectItem>
                      <SelectItem value="center">Centré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label className="font-semibold">Table des matières</Label>
                  <p className="text-xs text-muted-foreground">Inclure une table des matières navigable</p>
                </div>
                <Checkbox checked={style.includeTableOfContents}
                  onCheckedChange={v => setStyle(p => ({ ...p, includeTableOfContents: !!v }))} />
              </div>

              {/* Mini preview */}
              <div className="border rounded-xl p-5 bg-white shadow-inner">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Aperçu du style
                </p>
                <div style={{ fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, textAlign: style.textAlign as any }}>
                  <h2 className="text-lg font-bold mb-2" style={{ fontFamily: style.fontFamily }}>Chapitre 1 - Introduction</h2>
                  <p style={{ textIndent: '1.5em' }}>
                    Ceci est un aperçu de votre texte avec les paramètres de style sélectionnés.
                    La police, la taille et l'espacement seront appliqués à tout le contenu de votre EPUB.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>Retour</Button>
                <Button onClick={() => setCurrentStep(4)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  Aperçu final <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Export */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-500" />
                Aperçu & Export
              </CardTitle>
              <CardDescription>Vérifie les informations et télécharge ton EPUB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="rounded-xl border bg-muted/30 p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  {metadata.coverImage && (
                    <img src={metadata.coverImage} alt="Cover" className="w-16 h-auto rounded-md shadow-md" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{metadata.title}</h3>
                    <p className="text-sm text-muted-foreground">par {metadata.author}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center p-2 rounded-lg bg-background shadow-sm">
                    <p className="text-xl font-bold text-indigo-600">{chapters.length}</p>
                    <p className="text-[11px] text-muted-foreground">Chapitres</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background shadow-sm">
                    <p className="text-xl font-bold text-indigo-600">{metadata.language.toUpperCase()}</p>
                    <p className="text-[11px] text-muted-foreground">Langue</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background shadow-sm">
                    <p className="text-xl font-bold text-indigo-600">{style.fontFamily.replace(/'/g, '')}</p>
                    <p className="text-[11px] text-muted-foreground">Police</p>
                  </div>
                </div>
              </div>

              {/* Chapter list */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Table des matières</p>
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                  {chapters.map((ch, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="text-sm text-foreground">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>Retour</Button>
                <Button onClick={generateEpub} disabled={isProcessing}
                  className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25"
                  size="lg">
                  {isProcessing ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Génération...</>
                  ) : (
                    <><Download className="h-5 w-5 mr-2" />Télécharger l'EPUB</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
