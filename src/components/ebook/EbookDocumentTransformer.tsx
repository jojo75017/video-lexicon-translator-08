import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { 
  Upload, FileText, Download, Loader2, Sparkles, 
  CheckCircle2, BookOpen, Wand2, RefreshCw, 
  FileType, ArrowRight, Eye, Copy, Trash2
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface Chapter {
  title: string;
  content: string;
}

interface TransformResult {
  title: string;
  author: string;
  chapters: Chapter[];
  preface: string;
  conclusion: string;
  wordCount: number;
  chapterCount: number;
}

export const EbookDocumentTransformer: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformProgress, setTransformProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extraction DOCX via JSZip
  const extractDocxText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file('word/document.xml')?.async('string');
    
    if (!documentXml) return '';
    
    // Extraction améliorée avec préservation des paragraphes
    const paragraphs: string[] = [];
    const paragraphMatches = documentXml.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [];
    
    for (const para of paragraphMatches) {
      const textMatches = para.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
      const paraText = textMatches
        .map(match => match.replace(/<[^>]+>/g, ''))
        .join('');
      
      if (paraText.trim()) {
        paragraphs.push(paraText.trim());
      }
    }
    
    return paragraphs.join('\n\n');
  };

  // Extraction TXT
  const extractTxtText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(arrayBuffer);
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const isDocx = file.name.endsWith('.docx');
    const isTxt = file.name.endsWith('.txt');

    if (!allowedTypes.includes(file.type) && !isDocx && !isTxt) {
      toast.error('Format non supporté', {
        description: 'Veuillez uploader un fichier .docx ou .txt'
      });
      return;
    }

    setUploadedFileName(file.name);
    setIsExtracting(true);
    setRawText('');
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = '';
      
      if (isDocx || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractDocxText(arrayBuffer);
      } else {
        text = await extractTxtText(arrayBuffer);
      }

      if (text.trim()) {
        setRawText(text);
        // Auto-extract title from first line
        const firstLine = text.split('\n')[0]?.trim();
        if (firstLine && firstLine.length < 100) {
          setBookTitle(firstLine);
        }
        toast.success('Document chargé !', {
          description: `${text.length.toLocaleString()} caractères extraits`
        });
      } else {
        toast.error('Document vide', {
          description: 'Aucun texte extractible trouvé'
        });
      }
    } catch (error) {
      console.error('Extraction error:', error);
      toast.error('Erreur de lecture');
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const transformDocument = async () => {
    if (!rawText.trim()) {
      toast.error('Aucun contenu à transformer');
      return;
    }

    if (!bookTitle.trim()) {
      toast.error('Titre requis', {
        description: 'Veuillez entrer un titre pour votre ebook'
      });
      return;
    }

    setIsTransforming(true);
    setTransformProgress(10);
    setResult(null);

    try {
      // Étape 1: Analyse et structuration via IA
      setTransformProgress(20);
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'document-transform',
          prompt: `Tu es un éditeur professionnel. Transforme ce texte brut en ebook structuré.

TITRE DU LIVRE: ${bookTitle}
AUTEUR: ${authorName || 'Anonyme'}

TEXTE À TRANSFORMER:
${rawText.slice(0, 25000)}

INSTRUCTIONS:
1. Découpe intelligemment le texte en chapitres logiques (minimum 3 chapitres)
2. Crée des titres de chapitres accrocheurs
3. Rédige une préface engageante (200 mots)
4. Rédige une conclusion inspirante (200 mots)
5. Nettoie et reformule les passages confus
6. Garde le style et le message de l'auteur original

Réponds UNIQUEMENT en JSON valide:
{
  "preface": "Texte de la préface...",
  "chapters": [
    {"title": "Titre du chapitre", "content": "Contenu du chapitre..."},
    ...
  ],
  "conclusion": "Texte de conclusion..."
}`,
          language: 'fr'
        }
      });

      if (error) throw error;

      setTransformProgress(70);

      // Parse la réponse
      let parsed;
      const content = data?.content || data?.text || data;
      if (typeof content === 'string') {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } else {
        parsed = content;
      }

      if (!parsed?.chapters) {
        throw new Error('Structure invalide');
      }

      setTransformProgress(90);

      // Nettoyer les textes
      const cleanedChapters = parsed.chapters.map((ch: Chapter) => ({
        title: cleanGeneratedText(ch.title),
        content: cleanGeneratedText(ch.content)
      }));

      const totalWords = cleanedChapters.reduce((acc: number, ch: Chapter) => 
        acc + ch.content.split(/\s+/).length, 0);

      setResult({
        title: bookTitle,
        author: authorName || 'Anonyme',
        chapters: cleanedChapters,
        preface: cleanGeneratedText(parsed.preface || ''),
        conclusion: cleanGeneratedText(parsed.conclusion || ''),
        wordCount: totalWords,
        chapterCount: cleanedChapters.length
      });

      setTransformProgress(100);
      toast.success('Transformation terminée !', {
        description: `${cleanedChapters.length} chapitres créés`
      });

    } catch (error) {
      console.error('Transform error:', error);
      toast.error('Erreur de transformation', {
        description: 'Réessayez ou réduisez la taille du document'
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const exportToDocx = async () => {
    if (!result) return;

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Page de titre
            new Paragraph({
              children: [new TextRun({ text: result.title, bold: true, size: 56 })],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `par ${result.author}`, italics: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 }
            }),
            // Préface
            new Paragraph({
              children: [new TextRun({ text: 'Préface', bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: result.preface, size: 24 })],
              spacing: { after: 400 }
            }),
            // Chapitres
            ...result.chapters.flatMap((chapter, index) => [
              new Paragraph({
                children: [new TextRun({ text: `Chapitre ${index + 1}: ${chapter.title}`, bold: true, size: 32 })],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
              }),
              ...chapter.content.split('\n\n').map(para => 
                new Paragraph({
                  children: [new TextRun({ text: para, size: 24 })],
                  spacing: { after: 200 }
                })
              )
            ]),
            // Conclusion
            new Paragraph({
              children: [new TextRun({ text: 'Conclusion', bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: result.conclusion, size: 24 })],
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}_ebook.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Export DOCX réussi !');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur d\'export');
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    const fullText = [
      `# ${result.title}`,
      `*par ${result.author}*`,
      '',
      '## Préface',
      result.preface,
      '',
      ...result.chapters.flatMap((ch, i) => [
        `## Chapitre ${i + 1}: ${ch.title}`,
        ch.content,
        ''
      ]),
      '## Conclusion',
      result.conclusion
    ].join('\n\n');

    await navigator.clipboard.writeText(fullText);
    toast.success('Copié dans le presse-papier !');
  };

  const reset = () => {
    setRawText('');
    setResult(null);
    setUploadedFileName(null);
    setBookTitle('');
    setAuthorName('');
    setTransformProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Transformateur Document → Ebook
                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                  IA
                </Badge>
              </CardTitle>
              <CardDescription>
                Importez un fichier Word (.docx) ou texte (.txt) et transformez-le en ebook professionnel structuré
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!result ? (
        <>
          {/* Upload Zone */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="border-2 border-dashed border-violet-500/30 rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
                    <p className="text-muted-foreground">Extraction en cours...</p>
                  </div>
                ) : uploadedFileName ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{uploadedFileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {rawText.length.toLocaleString()} caractères extraits
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); reset(); }}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Changer de fichier
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-violet-500/20">
                      <Upload className="w-10 h-10 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Glissez votre document ici</p>
                      <p className="text-sm text-muted-foreground">
                        ou cliquez pour sélectionner (.docx, .txt)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        <FileType className="w-3 h-3 mr-1" /> DOCX
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" /> TXT
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          {rawText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  Configuration de l'ebook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du livre *</Label>
                    <Input
                      id="title"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Ex: Guide Complet du Marketing Digital"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Nom de l'auteur</Label>
                    <Input
                      id="author"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Aperçu du contenu brut</Label>
                  <Textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="h-48 font-mono text-sm"
                    placeholder="Le contenu extrait apparaîtra ici..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Vous pouvez modifier le texte avant transformation
                  </p>
                </div>

                {isTransforming && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transformation en cours...</span>
                      <span>{transformProgress}%</span>
                    </div>
                    <Progress value={transformProgress} className="h-2" />
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                  size="lg"
                  onClick={transformDocument}
                  disabled={isTransforming || !rawText.trim() || !bookTitle.trim()}
                >
                  {isTransforming ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Transformation IA en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Transformer en Ebook Professionnel
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Result Display */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  Ebook Transformé
                </CardTitle>
                <CardDescription>
                  {result.chapterCount} chapitres • {result.wordCount.toLocaleString()} mots
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={reset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nouveau
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
                <Button size="sm" onClick={exportToDocx} className="bg-emerald-600 hover:bg-emerald-500">
                  <Download className="w-4 h-4 mr-2" />
                  Export DOCX
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </TabsTrigger>
                <TabsTrigger value="chapters">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Chapitres
                </TabsTrigger>
                <TabsTrigger value="structure">
                  <FileText className="w-4 h-4 mr-2" />
                  Structure
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none p-6 bg-muted/30 rounded-lg max-h-[500px] overflow-y-auto">
                  <h1 className="text-center">{result.title}</h1>
                  <p className="text-center italic">par {result.author}</p>
                  
                  <h2>Préface</h2>
                  <p>{result.preface}</p>
                  
                  {result.chapters.map((chapter, index) => (
                    <div key={index}>
                      <h2>Chapitre {index + 1}: {chapter.title}</h2>
                      {chapter.content.split('\n\n').map((para, pIndex) => (
                        <p key={pIndex}>{para}</p>
                      ))}
                    </div>
                  ))}
                  
                  <h2>Conclusion</h2>
                  <p>{result.conclusion}</p>
                </div>
              </TabsContent>

              <TabsContent value="chapters" className="mt-4 space-y-4">
                {result.chapters.map((chapter, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Ch. {index + 1}
                        </Badge>
                        {chapter.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {chapter.content.slice(0, 300)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {chapter.content.split(/\s+/).length} mots
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="structure" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-violet-500/10 rounded-lg">
                    <Badge className="bg-violet-500">Titre</Badge>
                    <span className="font-medium">{result.title}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline">Préface</Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.preface.split(/\s+/).length} mots
                    </span>
                  </div>
                  {result.chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Badge variant="outline">Ch. {index + 1}</Badge>
                      <span className="flex-1 truncate">{chapter.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {chapter.content.split(/\s+/).length} mots
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline">Conclusion</Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.conclusion.split(/\s+/).length} mots
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookDocumentTransformer;
