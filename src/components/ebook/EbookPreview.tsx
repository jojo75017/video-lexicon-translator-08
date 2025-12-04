import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Eye, Maximize2, Moon, Sun, Palette, BookOpen, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Chapter } from '@/hooks/useEbookGeneration';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EbookPreviewProps {
  ebookTitle: string;
  authorName: string;
  preface: string;
  conclusion: string;
  epilogue?: string;
  chapters: Chapter[];
}

type Theme = 'light' | 'dark' | 'sepia';

const themes = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    secondary: 'text-gray-600',
    border: 'border-gray-200',
    shadow: 'shadow-lg',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    secondary: 'text-gray-400',
    border: 'border-gray-700',
    shadow: 'shadow-2xl',
  },
  sepia: {
    bg: 'bg-[#f4ecd8]',
    text: 'text-[#5b4636]',
    secondary: 'text-[#8b7355]',
    border: 'border-[#d4c4a8]',
    shadow: 'shadow-xl',
  },
};

export const EbookPreview: React.FC<EbookPreviewProps> = React.memo(({
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
}) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isImmersive, setIsImmersive] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const currentTheme = themes[theme];

  // Calcul du total de mots (optimisé avec useMemo)
  const totalWords = useMemo(() => {
    let count = 0;
    if (preface) count += preface.split(/\s+/).filter(w => w.length > 0).length;
    if (conclusion) count += conclusion.split(/\s+/).filter(w => w.length > 0).length;
    chapters.forEach(chapter => {
      if (chapter.content) count += chapter.content.split(/\s+/).filter(w => w.length > 0).length;
      chapter.subChapters.forEach(sub => {
        if (sub.content) count += sub.content.split(/\s+/).filter(w => w.length > 0).length;
      });
    });
    return count;
  }, [preface, conclusion, chapters]);

  // Temps de lecture estimé (250 mots/minute)
  const readingTime = useMemo(() => Math.ceil(totalWords / 250), [totalWords]);

  // Pagination pour mode immersif
  const pages = useMemo(() => {
    const pageList: Array<{ type: string; content: any; title: string }> = [];
    
    if (ebookTitle) {
      pageList.push({ type: 'cover', content: { title: ebookTitle, author: authorName }, title: 'Couverture' });
    }
    
    if (preface) {
      pageList.push({ type: 'preface', content: preface, title: 'Préface' });
    }
    
    chapters.forEach((chapter, idx) => {
      pageList.push({ 
        type: 'chapter', 
        content: chapter, 
        title: `Chapitre ${idx + 1}` 
      });
    });
    
    if (conclusion) {
      pageList.push({ type: 'conclusion', content: conclusion, title: 'Conclusion' });
    }
    
    return pageList;
  }, [ebookTitle, authorName, preface, chapters, conclusion]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const renderPage = (page: typeof pages[0]) => {
    switch (page.type) {
      case 'cover':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold text-center ${currentTheme.text} max-w-2xl`}>
              {page.content.title}
            </h1>
            {page.content.author && (
              <p className={`text-xl ${currentTheme.secondary}`}>
                par {page.content.author}
              </p>
            )}
          </div>
        );
      
      case 'preface':
        return (
          <div className="space-y-6">
            <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Préface</h2>
            <div className={`${currentTheme.text} leading-relaxed whitespace-pre-wrap font-serif text-lg`}>
              {page.content}
            </div>
          </div>
        );
      
      case 'chapter':
        const chapter = page.content as Chapter;
        return (
          <div className="space-y-8">
            <div>
              <h2 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
                {chapter.title}
              </h2>
              <div className={`h-1 w-20 bg-primary rounded-full`}></div>
            </div>
            
            {chapter.content && (
              <div className={`${currentTheme.text} leading-relaxed whitespace-pre-wrap font-serif text-lg`}>
                {chapter.content}
              </div>
            )}
            
            {chapter.subChapters.map((sub, idx) => (
              <div key={sub.id} className="space-y-4 mt-8">
                <h3 className={`text-2xl font-semibold ${currentTheme.text}`}>
                  {sub.title}
                </h3>
                {sub.content && (
                  <div className={`${currentTheme.text} leading-relaxed whitespace-pre-wrap font-serif text-lg`}>
                    {sub.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'conclusion':
        return (
          <div className="space-y-6">
            <h2 className={`text-3xl font-bold ${currentTheme.text}`}>Conclusion</h2>
            <div className={`${currentTheme.text} leading-relaxed whitespace-pre-wrap font-serif text-lg`}>
              {page.content}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isImmersive) {
    return (
      <div className={`fixed inset-0 z-50 ${currentTheme.bg} overflow-hidden`}>
        {/* Header immersif */}
        <div className={`${currentTheme.bg} ${currentTheme.border} border-b p-4 flex items-center justify-between ${currentTheme.shadow}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsImmersive(false)}
            className={currentTheme.text}
          >
            <Eye className="h-4 w-4 mr-2" />
            Quitter le mode immersif
          </Button>
          
          <div className="flex items-center gap-3">
            <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
              <SelectTrigger className={`w-32 ${currentTheme.bg} ${currentTheme.text}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Clair
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </div>
                </SelectItem>
                <SelectItem value="sepia">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Sépia
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <span className={`text-sm ${currentTheme.secondary}`}>
              {currentPage + 1} / {pages.length}
            </span>
          </div>
        </div>
        
        {/* Contenu de la page */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 md:p-16">
            {pages[currentPage] && renderPage(pages[currentPage])}
          </div>
        </div>
        
        {/* Navigation bas de page */}
        <div className={`${currentTheme.bg} ${currentTheme.border} border-t p-4 flex items-center justify-between`}>
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={currentPage === 0}
            className={currentTheme.text}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          
          <div className={`text-sm ${currentTheme.secondary}`}>
            {pages[currentPage]?.title}
          </div>
          
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className={currentTheme.text}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            Aperçu du livre
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-3 w-3" />
                    Clair
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-3 w-3" />
                    Sombre
                  </div>
                </SelectItem>
                <SelectItem value="sepia">
                  <div className="flex items-center gap-2">
                    <Palette className="h-3 w-3" />
                    Sépia
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImmersive(true)}
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              <span className="text-xs">Immersif</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{chapters.length}</div>
            <div className="text-xs text-muted-foreground">Chapitres</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalWords}</div>
            <div className="text-xs text-muted-foreground">Mots</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{readingTime}min</div>
            <div className="text-xs text-muted-foreground">Lecture</div>
          </div>
        </div>

        {/* Prévisualisation */}
        <div className={`${currentTheme.bg} ${currentTheme.border} border rounded-xl p-6 max-h-96 overflow-y-auto ${currentTheme.shadow}`}>
          {ebookTitle || authorName || chapters.length > 0 ? (
            <div className="space-y-6">
              {ebookTitle && (
                <div className="text-center pb-4 border-b border-primary/20">
                  <div className={`font-bold text-xl mb-1 ${currentTheme.text}`}>
                    {ebookTitle}
                  </div>
                  {authorName && (
                    <div className={currentTheme.secondary}>
                      par {authorName}
                    </div>
                  )}
                </div>
              )}

              {preface && (
                <div className="space-y-2">
                  <div className={`font-semibold ${currentTheme.text} flex items-center gap-2`}>
                    <span>📝</span> PRÉFACE
                  </div>
                  <div className={`text-sm ${currentTheme.secondary} leading-relaxed`}>
                    {preface.substring(0, 200)}...
                  </div>
                </div>
              )}

              {chapters.length > 0 && (
                <div className="space-y-3">
                  <div className={`font-semibold ${currentTheme.text} flex items-center gap-2`}>
                    <span>📖</span> CHAPITRES ({chapters.length})
                  </div>
                  <div className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <div key={chapter.id} className={`rounded-lg p-3 border ${currentTheme.border} ${currentTheme.bg === 'bg-white' ? 'bg-gray-50' : currentTheme.bg === 'bg-gray-900' ? 'bg-gray-800' : 'bg-[#e8dcc4]'}`}>
                        <div className={`font-medium text-sm ${currentTheme.text} mb-1`}>
                          {index + 1}. {chapter.title || 'Titre du chapitre'}
                        </div>
                        {chapter.subChapters.length > 0 && (
                          <div className={`text-xs ${currentTheme.secondary} ml-4 space-y-1`}>
                            {chapter.subChapters.map((sub, subIdx) => (
                              <div key={sub.id}>
                                {index + 1}.{subIdx + 1} {sub.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {conclusion && (
                <div className="space-y-2">
                  <div className={`font-semibold ${currentTheme.text} flex items-center gap-2`}>
                    <span>✍️</span> CONCLUSION
                  </div>
                  <div className={`text-sm ${currentTheme.secondary} leading-relaxed`}>
                    {conclusion.substring(0, 150)}...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className={`h-12 w-12 mx-auto mb-4 ${currentTheme.secondary}`} />
              <p className={currentTheme.secondary}>
                Commencez à remplir les informations pour voir l'aperçu
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

EbookPreview.displayName = 'EbookPreview';
