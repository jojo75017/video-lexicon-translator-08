
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Image, BookOpen, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useEbookGeneration';

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
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt' | 'html'>('pdf');
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

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
      switch (exportFormat) {
        case 'txt':
          exportAsText();
          break;
        case 'html':
          exportAsHTML();
          break;
        case 'pdf':
        case 'docx':
          toast.info(`Export ${exportFormat.toUpperCase()} sera disponible prochainement. Utilisez HTML pour l'instant.`);
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
                <SelectItem value="html">📄 HTML (Recommandé)</SelectItem>
                <SelectItem value="txt">📝 Texte (.txt)</SelectItem>
                <SelectItem value="pdf">📄 PDF (Bientôt disponible)</SelectItem>
                <SelectItem value="docx">📄 Word (.docx) (Bientôt disponible)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Options d'export</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cover"
                checked={includeCoverPage}
                onCheckedChange={setIncludeCoverPage}
              />
              <Label htmlFor="cover">Inclure la page de couverture</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="toc"
                checked={includeTableOfContents}
                onCheckedChange={setIncludeTableOfContents}
              />
              <Label htmlFor="toc">Inclure la table des matières</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pages"
                checked={includePageNumbers}
                onCheckedChange={setIncludePageNumbers}
              />
              <Label htmlFor="pages">Inclure la numérotation des pages</Label>
            </div>
          </div>

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
