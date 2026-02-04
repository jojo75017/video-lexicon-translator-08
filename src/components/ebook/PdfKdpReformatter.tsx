import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileUp, Download, Loader2, CheckCircle, AlertTriangle, 
  FileText, Ruler, BookOpen, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface PageImage {
  dataUrl: string;
  width: number;
  height: number;
}

const KDP_FORMATS = [
  { value: '8.5x11', label: '8.5 x 11" (Letter)', width: 215.9, height: 279.4, description: 'Format standard US - Recommandé pour coloriage' },
  { value: '8x10', label: '8 x 10"', width: 203.2, height: 254, description: 'Portrait populaire' },
  { value: '8.5x8.5', label: '8.5 x 8.5" (Carré)', width: 215.9, height: 215.9, description: 'Format carré KDP' },
  { value: '6x9', label: '6 x 9"', width: 152.4, height: 228.6, description: 'Format livre standard' },
  { value: 'a4', label: 'A4 (210 x 297 mm)', width: 210, height: 297, description: 'Format européen' },
];

const PdfKdpReformatter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<PageImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetFormat, setTargetFormat] = useState('8.5x11');
  const [bookTitle, setBookTitle] = useState('Mon Livre de Coloriage');
  const [authorName, setAuthorName] = useState('');
  const [ageGroup, setAgeGroup] = useState('4-6 ans');

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setProgress(0);
    setImages([]);

    try {
      // Dynamically import pdf.js for PDF parsing
      const pdfjsLib = await import('pdfjs-dist');
      
      // Disable worker for browser compatibility - runs on main thread
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const extractedImages: PageImage[] = [];
      const totalPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress(Math.round((pageNum / totalPages) * 100));
        
        const page = await pdf.getPage(pageNum);
        const scale = 2; // Higher quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          // @ts-ignore - pdfjs-dist types issue with canvas parameter
          canvas: canvas,
        }).promise;

        extractedImages.push({
          dataUrl: canvas.toDataURL('image/png', 0.95),
          width: viewport.width,
          height: viewport.height,
        });
      }

      setImages(extractedImages);
      toast.success(`${extractedImages.length} pages extraites avec succès !`);
    } catch (error) {
      console.error('Erreur extraction PDF:', error);
      toast.error('Erreur lors de l\'extraction du PDF. Vérifiez que le fichier n\'est pas protégé.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportCorrectedPdf = useCallback(async () => {
    if (images.length === 0) {
      toast.error('Aucune page à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Création du PDF aux normes KDP...');

    try {
      const format = KDP_FORMATS.find(f => f.value === targetFormat) || KDP_FORMATS[0];
      const pageWidth = format.width;
      const pageHeight = format.height;

      // Marges KDP conformes
      const marginTop = 12.7;    // 0.5" - marge haute KDP
      const marginBottom = 12.7; // 0.5" - marge basse KDP
      const marginOuter = 12.7;  // 0.5" - marge extérieure KDP
      const marginInner = 9.5;   // 0.375" - gouttière/reliure KDP

      const safeAreaTop = marginTop;
      const safeAreaBottom = pageHeight - marginBottom;
      const safeAreaLeft = marginInner;
      const safeAreaRight = pageWidth - marginOuter;
      const centerX = pageWidth / 2;

      const pdf = new jsPDF({
        orientation: pageWidth > pageHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pageWidth, pageHeight],
        compress: true,
      });

      const currentYear = new Date().getFullYear();

      // ============================================
      // PAGE 1: PAGE DE TITRE
      // ============================================
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(bookTitle, centerX, safeAreaTop + 60, { align: 'center' });

      if (authorName) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`par ${authorName}`, centerX, safeAreaTop + 80, { align: 'center' });
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${images.length - 4} dessins a colorier`, centerX, safeAreaTop + 110, { align: 'center' });
      pdf.text(`Pour les ${ageGroup}`, centerX, safeAreaTop + 125, { align: 'center' });

      // Ligne décorative
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.5);
      pdf.line(safeAreaLeft + 30, safeAreaTop + 90, safeAreaRight - 30, safeAreaTop + 90);

      // ============================================
      // PAGE 2: COPYRIGHT
      // ============================================
      pdf.addPage();
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const copyrightText = [
        `© ${currentYear} - Tous droits reserves`,
        '',
        bookTitle,
        authorName ? `par ${authorName}` : '',
        '',
        'Aucune partie de ce livre ne peut etre reproduite,',
        'stockee ou transmise sous quelque forme que ce soit',
        'sans l\'autorisation ecrite prealable de l\'editeur.',
        '',
        '---',
        '',
        `Format: ${format.label}`,
        `Nombre de pages: ${images.length}`,
        '',
        '---',
        '',
        'Reformate aux normes KDP avec EbookStudio Pro',
      ];

      let copyrightY = safeAreaTop + 50;
      copyrightText.forEach(line => {
        pdf.text(line, centerX, copyrightY, { align: 'center' });
        copyrightY += 7;
      });

      // ============================================
      // PAGES DE CONTENU (images extraites)
      // Skip les 4 premières pages (titre, copyright, test couleurs, sommaire)
      // et la dernière (à propos)
      // ============================================
      const contentStartIndex = 4; // Commencer après les pages légales originales
      const contentEndIndex = images.length - 2; // Exclure les dernières pages annexes

      for (let i = contentStartIndex; i < contentEndIndex && i < images.length; i++) {
        pdf.addPage();
        const img = images[i];

        // Calculer les dimensions pour que l'image reste dans la zone de sécurité
        const availableWidth = safeAreaRight - safeAreaLeft;
        const availableHeight = safeAreaBottom - safeAreaTop - 15; // Espace pour numéro de page

        // Ratio de l'image originale
        const imgRatio = img.width / img.height;
        const areaRatio = availableWidth / availableHeight;

        let imgWidth: number;
        let imgHeight: number;

        if (imgRatio > areaRatio) {
          // Image plus large que l'espace disponible
          imgWidth = availableWidth;
          imgHeight = availableWidth / imgRatio;
        } else {
          // Image plus haute que l'espace disponible
          imgHeight = availableHeight;
          imgWidth = availableHeight * imgRatio;
        }

        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = safeAreaTop + (availableHeight - imgHeight) / 2;

        pdf.addImage(img.dataUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);

        // Numéro de page
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${i - contentStartIndex + 1}`, centerX, safeAreaBottom - 3, { align: 'center' });
      }

      // ============================================
      // PAGE FINALE: À PROPOS
      // ============================================
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('A Propos de ce Livre', centerX, safeAreaTop + 20, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      const aboutText = [
        `Ce livre "${bookTitle}" a ete reformate`,
        'aux normes KDP pour une impression optimale.',
        '',
        `Format: ${format.label}`,
        `Marges: 12.7mm (haut/bas/exterieur), 9.5mm (gouttiere)`,
        '',
        '---',
        '',
        'Conseils pour les parents:',
        '',
        '* Utilisez des crayons de couleur ou feutres lavables',
        '* Laissez votre enfant choisir ses propres couleurs',
        '* Le coloriage developpe la motricite fine',
        '',
        '---',
        '',
        'Reformate avec EbookStudio Pro',
      ];

      let aboutY = safeAreaTop + 40;
      aboutText.forEach(line => {
        pdf.text(line, centerX, aboutY, { align: 'center' });
        aboutY += 8;
      });

      // Sauvegarder
      const fileName = `${bookTitle.replace(/[^a-zA-Z0-9]/g, '-')}-KDP-${targetFormat}-${Date.now()}.pdf`;
      pdf.save(fileName);
      
      toast.success(`PDF KDP exporté : ${fileName}`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de la création du PDF');
    } finally {
      setIsExporting(false);
    }
  }, [images, targetFormat, bookTitle, authorName, ageGroup]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Reformateur PDF KDP
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  NOUVEAU
                </Badge>
              </CardTitle>
              <CardDescription>
                Convertissez votre PDF au format 8.5x11" avec marges KDP conformes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-blue-500" />
            1. Uploadez votre PDF actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
              disabled={isProcessing}
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">
                {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un PDF'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Formats acceptés : PDF (livres de coloriage, BD, etc.)
              </p>
            </label>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extraction des pages en cours...</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {images.length > 0 && !isProcessing && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{images.length} pages extraites avec succès</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              2. Configurez le nouveau PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre du livre</Label>
                <Input
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Mon Livre de Coloriage"
                />
              </div>

              <div className="space-y-2">
                <Label>Nom de l'auteur (optionnel)</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>

              <div className="space-y-2">
                <Label>Format KDP cible</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KDP_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{format.label}</span>
                          <span className="text-xs text-muted-foreground">{format.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tranche d'âge</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-4 ans">2-4 ans</SelectItem>
                    <SelectItem value="4-6 ans">4-6 ans</SelectItem>
                    <SelectItem value="6-8 ans">6-8 ans</SelectItem>
                    <SelectItem value="8-12 ans">8-12 ans</SelectItem>
                    <SelectItem value="Tous âges">Tous âges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Marges KDP Info */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">
                    Marges KDP appliquées automatiquement
                  </h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• <strong>Haut/Bas/Extérieur:</strong> 12.7mm (0.5")</li>
                    <li>• <strong>Gouttière (reliure):</strong> 9.5mm (0.375")</li>
                    <li>• <strong>Police:</strong> Helvetica (intégrée, acceptée KDP)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      {images.length > 0 && (
        <Card className="border-2 border-dashed border-green-500/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  3. Exporter le PDF corrigé
                </h3>
                <p className="text-sm text-muted-foreground">
                  Format {KDP_FORMATS.find(f => f.value === targetFormat)?.label} avec marges KDP
                </p>
              </div>

              <Button
                onClick={exportCorrectedPdf}
                disabled={isExporting}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white min-w-[200px]"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger PDF KDP
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PdfKdpReformatter;
