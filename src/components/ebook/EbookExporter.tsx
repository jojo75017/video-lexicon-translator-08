
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Image, BookOpen, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useEbookGeneration';
import jsPDF from 'jspdf';

interface EbookExporterProps {
  ebookTitle: string;
  authorName: string;
  preface: string;
  conclusion: string;
  chapters: Chapter[];
}

export const EbookExporter: React.FC<EbookExporterProps> = ({
  ebookTitle,
  authorName,
  preface,
  conclusion,
  chapters
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt' | 'html' | 'epub'>('pdf');
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [generateKdpMetadata, setGenerateKdpMetadata] = useState(false);

  const generateEbookContent = () => {
    let content = '';
    
    // Page de couverture
    if (includeCoverPage) {
      content += `${ebookTitle}\n`;
      content += `${'='.repeat(ebookTitle.length)}\n\n`;
      if (authorName) {
        content += `Par ${authorName}\n\n`;
      }
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // Table des matières
    if (includeTableOfContents) {
      content += `📚 TABLE DES MATIÈRES\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      if (preface) {
        content += `Préface ................................................ 3\n\n`;
      }
      
      let currentPage = preface ? 5 : 3;
      
      chapters.forEach((chapter, index) => {
        const chapterNumber = index + 1;
        content += `${chapterNumber}. ${chapter.title}`;
        const dots = Math.max(2, 45 - chapter.title.length - chapterNumber.toString().length);
        content += `${'.'.repeat(dots)} ${currentPage}\n`;
        
        chapter.subChapters.forEach((subChapter, subIndex) => {
          const subNumber = `${chapterNumber}.${subIndex + 1}`;
          content += `   ${subNumber} ${subChapter.title}`;
          const subDots = Math.max(2, 42 - subChapter.title.length - subNumber.length);
          content += `${'.'.repeat(subDots)} ${currentPage + subIndex + 1}\n`;
        });
        
        content += '\n';
        currentPage += Math.max(5, chapter.subChapters.length + 3);
      });
      
      if (conclusion) {
        content += `Conclusion/Mot de la fin ................................ ${currentPage + 2}\n`;
      }
      
      content += `\n${'='.repeat(50)}\n\n\n`;
    }

    // Préface
    if (preface) {
      content += `📝 PRÉFACE\n`;
      content += `${'='.repeat(50)}\n\n`;
      content += `${preface}\n\n`;
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // Chapitres
    chapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;
      
      content += `📖 CHAPITRE ${chapterNumber}: ${chapter.title.toUpperCase()}\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      if (chapter.content) {
        content += `${chapter.content}\n\n`;
      }
      
      // Sous-chapitres
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        content += `${subNumber}. ${subChapter.title}\n`;
        content += `${'-'.repeat(30)}\n\n`;
        
        if (subChapter.content) {
          content += `${subChapter.content}\n\n`;
        }
      });
      
      content += `${'='.repeat(50)}\n\n\n`;
    });

    // Conclusion
    if (conclusion) {
      content += `🎯 MOT DE LA FIN\n`;
      content += `${'='.repeat(50)}\n\n`;
      content += `${conclusion}\n\n`;
      content += `${'='.repeat(50)}\n\n`;
    }

    // Pied de page
    content += `\n\n${'='.repeat(50)}\n`;
    content += `Généré avec le Planificateur d'Ebook\n`;
    content += `${new Date().toLocaleDateString()}\n`;
    content += `${'='.repeat(50)}`;

    return content;
  };

  const exportAsText = () => {
    const content = generateEbookContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookTitle || 'Mon-Ebook'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Ebook exporté en format TXT !');
  };

  const exportAsPDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const marginLeft = 20;
    const marginRight = 20;
    const pageWidth = pdf.internal.pageSize.width - marginLeft - marginRight;

    // Function to add new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Function to split text into lines
    const splitTextToSize = (text: string, maxWidth: number, fontSize: number) => {
      pdf.setFontSize(fontSize);
      return pdf.splitTextToSize(text, maxWidth);
    };

    // Page de couverture
    if (includeCoverPage) {
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      const titleLines = splitTextToSize(ebookTitle, pageWidth, 24);
      titleLines.forEach((line: string) => {
        pdf.text(line, marginLeft, yPosition, { align: 'left' });
        yPosition += 12;
      });

      yPosition += 20;
      
      if (authorName) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Par ${authorName}`, marginLeft, yPosition);
        yPosition += 20;
      }

      pdf.addPage();
      yPosition = 20;
    }

    // Table des matières
    if (includeTableOfContents) {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TABLE DES MATIÈRES', marginLeft, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');

      if (preface) {
        pdf.text('Préface', marginLeft, yPosition);
        yPosition += 8;
      }

      chapters.forEach((chapter, index) => {
        checkPageBreak(8);
        const chapterNumber = index + 1;
        pdf.text(`${chapterNumber}. ${chapter.title}`, marginLeft, yPosition);
        yPosition += 8;

        chapter.subChapters.forEach((subChapter, subIndex) => {
          checkPageBreak(6);
          const subNumber = `${chapterNumber}.${subIndex + 1}`;
          pdf.text(`   ${subNumber} ${subChapter.title}`, marginLeft + 10, yPosition);
          yPosition += 6;
        });
      });

      if (conclusion) {
        checkPageBreak(8);
        pdf.text('Conclusion', marginLeft, yPosition);
        yPosition += 8;
      }

      pdf.addPage();
      yPosition = 20;
    }

    // Préface
    if (preface) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRÉFACE', marginLeft, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const prefaceLines = splitTextToSize(preface, pageWidth, 11);
      prefaceLines.forEach((line: string) => {
        checkPageBreak(6);
        pdf.text(line, marginLeft, yPosition);
        yPosition += 6;
      });

      pdf.addPage();
      yPosition = 20;
    }

    // Chapitres
    chapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;

      // Titre du chapitre
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const chapterTitle = `CHAPITRE ${chapterNumber}: ${chapter.title.toUpperCase()}`;
      const titleLines = splitTextToSize(chapterTitle, pageWidth, 16);
      
      checkPageBreak(titleLines.length * 8 + 10);
      titleLines.forEach((line: string) => {
        pdf.text(line, marginLeft, yPosition);
        yPosition += 8;
      });
      yPosition += 10;

      // Contenu du chapitre
      if (chapter.content) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const contentLines = splitTextToSize(chapter.content, pageWidth, 11);
        contentLines.forEach((line: string) => {
          checkPageBreak(6);
          pdf.text(line, marginLeft, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Sous-chapitres
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const subTitle = `${subNumber}. ${subChapter.title}`;
        const subTitleLines = splitTextToSize(subTitle, pageWidth, 14);
        
        checkPageBreak(subTitleLines.length * 7 + 10);
        subTitleLines.forEach((line: string) => {
          pdf.text(line, marginLeft, yPosition);
          yPosition += 7;
        });
        yPosition += 8;

        if (subChapter.content) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const subContentLines = splitTextToSize(subChapter.content, pageWidth, 11);
          subContentLines.forEach((line: string) => {
            checkPageBreak(6);
            pdf.text(line, marginLeft, yPosition);
            yPosition += 6;
          });
          yPosition += 10;
        }
      });

      // Nouvelle page pour le chapitre suivant
      if (index < chapters.length - 1) {
        pdf.addPage();
        yPosition = 20;
      }
    });

    // Conclusion
    if (conclusion) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MOT DE LA FIN', marginLeft, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const conclusionLines = splitTextToSize(conclusion, pageWidth, 11);
      conclusionLines.forEach((line: string) => {
        checkPageBreak(6);
        pdf.text(line, marginLeft, yPosition);
        yPosition += 6;
      });
    }

    // Numérotation des pages
    if (includePageNumbers) {
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${i}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
      }
    }

    pdf.save(`${ebookTitle || 'Mon-Ebook'}.pdf`);
    toast.success('Ebook exporté en format PDF !');
  };

  const exportAsHTML = () => {
    const textContent = generateEbookContent();
    
    // Conversion basique du texte en HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ebookTitle}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        .cover {
            text-align: center;
            padding: 50px 0;
            border-bottom: 3px solid #333;
            margin-bottom: 30px;
        }
        .title {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .author {
            font-size: 1.2em;
            color: #7f8c8d;
            font-style: italic;
        }
        .chapter {
            margin: 40px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chapter-title {
            font-size: 1.8em;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .subchapter {
            margin: 20px 0;
            padding-left: 20px;
        }
        .subchapter-title {
            font-size: 1.3em;
            color: #34495e;
            margin-bottom: 10px;
        }
        .content {
            text-align: justify;
            margin-bottom: 15px;
        }
        .toc {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        @media print {
            body { background: white; }
            .chapter { box-shadow: none; }
        }
    </style>
</head>
<body>
    ${textContent.split('\n').map(line => {
      if (line.includes('📚 TABLE DES MATIÈRES') || line.includes('='.repeat(50))) {
        return `<div class="toc">${line}</div>`;
      } else if (line.includes('📖 CHAPITRE')) {
        return `<h1 class="chapter-title">${line}</h1>`;
      } else if (line.match(/^\d+\.\d+\. /)) {
        return `<h2 class="subchapter-title">${line}</h2>`;
      } else if (line.trim()) {
        return `<p class="content">${line}</p>`;
      }
      return '<br>';
    }).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookTitle || 'Mon-Ebook'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Ebook exporté en format HTML !');
  };

  const exportKdpMetadata = () => {
    const metadata = `
═══════════════════════════════════════════════════════════
          MÉTADONNÉES AMAZON KDP - ${ebookTitle}
═══════════════════════════════════════════════════════════

📖 INFORMATIONS DU LIVRE
─────────────────────────────────────────────────────────
Titre: ${ebookTitle}
Auteur: ${authorName || 'À compléter'}
Nombre de mots: ${getStats().totalWords}
Pages estimées: ${getStats().estimatedPages}

📝 DESCRIPTION COURTE (pour Amazon)
─────────────────────────────────────────────────────────
${preface.substring(0, 200)}...

🎯 MOTS-CLÉS SUGGÉRÉS (max 7 pour KDP)
─────────────────────────────────────────────────────────
1. ${ebookTitle.split(' ')[0].toLowerCase()}
2. guide pratique
3. développement personnel
4. success
5. transformation
6. méthode
7. stratégie

📚 CATÉGORIES SUGGÉRÉES
─────────────────────────────────────────────────────────
- Non-fiction > Auto-assistance
- Business & Money > Skills
- Self-Help > Personal Transformation

💰 PRIX SUGGÉRÉS
─────────────────────────────────────────────────────────
Kindle: 2.99€ - 9.99€ (70% royalties entre 2.99€ et 9.99€)
Paperback: 9.99€ - 19.99€

🌐 MARCHÉS RECOMMANDÉS
─────────────────────────────────────────────────────────
✓ Amazon.fr (France)
✓ Amazon.com (USA)
✓ Amazon.co.uk (UK)
✓ Amazon.de (Allemagne)
✓ Amazon.es (Espagne)
✓ Amazon.it (Italie)

📋 CHECKLIST PRE-PUBLICATION
─────────────────────────────────────────────────────────
□ Relecture complète
□ Correction orthographique
□ Vérification des liens (si applicable)
□ Couverture au format 2560x1600 minimum
□ ISBN (optionnel pour Kindle, requis pour paperback)
□ Compte KDP créé
□ Informations fiscales complétées

═══════════════════════════════════════════════════════════
          Généré le ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════
`;

    const blob = new Blob([metadata], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookTitle.replace(/[^a-z0-9]/gi, '_')}_METADATA_KDP.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez ajouter un titre à votre ebook');
      return;
    }

    if (chapters.length === 0) {
      toast.error('Veuillez ajouter au moins un chapitre');
      return;
    }

    setIsExporting(true);

    try {
      // Exporter les métadonnées KDP si demandé
      if (generateKdpMetadata) {
        exportKdpMetadata();
      }

      switch (exportFormat) {
        case 'txt':
          exportAsText();
          break;
        case 'html':
          exportAsHTML();
          break;
        case 'pdf':
          exportAsPDF();
          break;
        case 'docx':
          // Export simple TXT formaté pour conversion
          const docContent = generateEbookContent();
          const docBlob = new Blob([docContent], { type: 'application/msword' });
          const docUrl = URL.createObjectURL(docBlob);
          const docLink = document.createElement('a');
          docLink.href = docUrl;
          docLink.download = `${ebookTitle || 'Mon-Ebook'}.doc`;
          document.body.appendChild(docLink);
          docLink.click();
          document.body.removeChild(docLink);
          URL.revokeObjectURL(docUrl);
          toast.success('Fichier .doc créé (ouvrez-le dans Word pour le convertir en DOCX)');
          break;
        case 'epub':
          toast.info('Export EPUB: Utilisez Calibre ou un service en ligne pour convertir votre PDF/HTML en EPUB');
          exportAsHTML();
          break;
        default:
          exportAsText();
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export de l\'ebook');
    } finally {
      setIsExporting(false);
    }
  };

  const getStats = () => {
    const totalWords = chapters.reduce((total, chapter) => {
      const chapterWords = chapter.content ? chapter.content.split(' ').length : 0;
      const subChapterWords = chapter.subChapters.reduce((subTotal, sub) => {
        return subTotal + (sub.content ? sub.content.split(' ').length : 0);
      }, 0);
      return total + chapterWords + subChapterWords;
    }, 0);

    const prefaceWords = preface ? preface.split(' ').length : 0;
    const conclusionWords = conclusion ? conclusion.split(' ').length : 0;

    return {
      totalWords: totalWords + prefaceWords + conclusionWords,
      estimatedPages: Math.ceil((totalWords + prefaceWords + conclusionWords) / 250),
      readingTime: Math.ceil((totalWords + prefaceWords + conclusionWords) / 200)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter l'Ebook
          </CardTitle>
          <CardDescription>
            Téléchargez votre ebook complet dans différents formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="format">Format d'export</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">📄 PDF (Recommandé pour KDP)</SelectItem>
                <SelectItem value="html">📄 HTML (Web)</SelectItem>
                <SelectItem value="txt">📝 Texte (.txt)</SelectItem>
                <SelectItem value="docx">📄 Word (.doc)</SelectItem>
                <SelectItem value="epub">📘 EPUB (Info uniquement)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Options d'export</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cover"
                checked={includeCoverPage}
                onCheckedChange={(checked) => setIncludeCoverPage(checked === true)}
              />
              <Label htmlFor="cover">Inclure la page de couverture</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="toc"
                checked={includeTableOfContents}
                onCheckedChange={(checked) => setIncludeTableOfContents(checked === true)}
              />
              <Label htmlFor="toc">Inclure la table des matières</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pages"
                checked={includePageNumbers}
                onCheckedChange={(checked) => setIncludePageNumbers(checked === true)}
              />
              <Label htmlFor="pages">Inclure la numérotation des pages</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="kdp-metadata"
                checked={generateKdpMetadata}
                onCheckedChange={(checked) => setGenerateKdpMetadata(checked === true)}
              />
              <Label htmlFor="kdp-metadata">Générer fichier métadonnées KDP</Label>
            </div>
          </div>

          {generateKdpMetadata && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                📋 Un fichier texte avec vos métadonnées KDP (titre, auteur, mots-clés suggérés) sera créé lors de l'export.
              </p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Statistiques de l'ebook</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalWords}</div>
                <div className="text-muted-foreground">Mots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.estimatedPages}</div>
                <div className="text-muted-foreground">Pages estimées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.readingTime}</div>
                <div className="text-muted-foreground">Min de lecture</div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting || !ebookTitle || chapters.length === 0}
            className="w-full"
            size="lg"
          >
            {isExporting ? (
              <>
                <Printer className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                📚 Exporter l'Ebook Complet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
