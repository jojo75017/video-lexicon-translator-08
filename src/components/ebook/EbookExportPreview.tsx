import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Eye, Download, X, FileText, CheckCircle } from 'lucide-react';
import { Chapter } from '@/hooks/useEbookGeneration';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { Character } from './EbookCharacters';

interface EbookExportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExport: () => void;
  ebookTitle: string;
  authorName: string;
  preface: string;
  conclusion: string;
  epilogue?: string;
  chapters: Chapter[];
  characters?: Character[];
  isExporting?: boolean;
}

export const EbookExportPreview: React.FC<EbookExportPreviewProps> = ({
  isOpen,
  onClose,
  onConfirmExport,
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
  characters = [],
  isExporting = false
}) => {
  // Générer le contenu nettoyé pour la prévisualisation
  const cleanedContent = useMemo(() => {
    const cleanedPreface = cleanGeneratedText(preface);
    const cleanedConclusion = cleanGeneratedText(conclusion);
    const cleanedEpilogue = epilogue ? cleanGeneratedText(epilogue) : '';
    
    const cleanedChapters = chapters.map(chapter => ({
      ...chapter,
      title: cleanGeneratedText(chapter.title),
      content: chapter.content ? cleanGeneratedText(chapter.content) : '',
      subChapters: chapter.subChapters.map(sub => ({
        ...sub,
        title: cleanGeneratedText(sub.title),
        content: sub.content ? cleanGeneratedText(sub.content) : ''
      }))
    }));

    return {
      preface: cleanedPreface,
      conclusion: cleanedConclusion,
      epilogue: cleanedEpilogue,
      chapters: cleanedChapters
    };
  }, [preface, conclusion, epilogue, chapters]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    let totalWords = 0;
    
    if (cleanedContent.preface) {
      totalWords += cleanedContent.preface.split(/\s+/).filter(w => w).length;
    }
    
    cleanedContent.chapters.forEach(chapter => {
      if (chapter.content) {
        totalWords += chapter.content.split(/\s+/).filter(w => w).length;
      }
      chapter.subChapters.forEach(sub => {
        if (sub.content) {
          totalWords += sub.content.split(/\s+/).filter(w => w).length;
        }
      });
    });
    
    if (cleanedContent.conclusion) {
      totalWords += cleanedContent.conclusion.split(/\s+/).filter(w => w).length;
    }

    return {
      totalWords,
      estimatedPages: Math.ceil(totalWords / 250),
      chaptersCount: cleanedContent.chapters.length,
      subChaptersCount: cleanedContent.chapters.reduce((acc, ch) => acc + ch.subChapters.length, 0)
    };
  }, [cleanedContent]);

  const truncateText = (text: string, maxLength: number = 300) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Prévisualisation avant export
          </DialogTitle>
          <DialogDescription>
            Vérifiez le contenu nettoyé avant d'exporter vers Google Docs
          </DialogDescription>
        </DialogHeader>

        {/* Stats bar */}
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium">{stats.totalWords}</span>
            <span className="text-muted-foreground">mots</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{stats.estimatedPages}</span>
            <span className="text-muted-foreground">pages</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{stats.chaptersCount}</span>
            <span className="text-muted-foreground">chapitres</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400">Contenu nettoyé</span>
          </div>
        </div>

        {/* Content preview */}
        <div className="flex-1 overflow-auto border rounded-lg bg-card">
          <div className="p-6 space-y-6 font-serif">
            {/* Titre et auteur */}
            <div className="text-center border-b pb-6">
              <h1 className="text-2xl font-bold mb-2">{ebookTitle}</h1>
              {authorName && (
                <p className="text-muted-foreground italic">par {authorName}</p>
              )}
            </div>

            {/* Préface */}
            {cleanedContent.preface && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3">
                  Préface
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {truncateText(cleanedContent.preface)}
                </p>
              </div>
            )}

            {/* Chapitres */}
            {cleanedContent.chapters.map((chapter, index) => (
              <div key={index} className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Chapitre {index + 1}
                  </span>
                  {chapter.title}
                </h2>
                
                {chapter.content && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-4 border-l-2 border-muted">
                    {truncateText(chapter.content)}
                  </p>
                )}

                {/* Sous-chapitres */}
                {chapter.subChapters.length > 0 && (
                  <div className="pl-4 space-y-2">
                    {chapter.subChapters.slice(0, 2).map((sub, subIndex) => (
                      <div key={subIndex} className="text-sm">
                        <h3 className="font-medium text-foreground/80">
                          {index + 1}.{subIndex + 1} {sub.title}
                        </h3>
                        {sub.content && (
                          <p className="text-muted-foreground text-xs mt-1 leading-relaxed whitespace-pre-line">
                            {truncateText(sub.content, 150)}
                          </p>
                        )}
                      </div>
                    ))}
                    {chapter.subChapters.length > 2 && (
                      <p className="text-xs text-muted-foreground italic">
                        + {chapter.subChapters.length - 2} autres sous-chapitres...
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Conclusion */}
            {cleanedContent.conclusion && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3">
                  Conclusion
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {truncateText(cleanedContent.conclusion)}
                </p>
              </div>
            )}

            {/* Personnages */}
            {characters.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h2 className="text-lg font-semibold text-primary">
                  Personnages ({characters.length})
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {characters.slice(0, 4).map((char, index) => (
                    <div key={index} className="text-muted-foreground">
                      • {char.name}
                    </div>
                  ))}
                  {characters.length > 4 && (
                    <div className="text-xs text-muted-foreground italic col-span-2">
                      + {characters.length - 4} autres...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={onConfirmExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exporter vers Google Docs
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
