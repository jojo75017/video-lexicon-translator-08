import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { Chapter } from '@/hooks/useEbookGeneration';

interface EbookWritingProps {
  chapters: Chapter[];
  onUpdateChapterContent: (chapterId: string, content: string) => void;
  onUpdateSubChapterContent: (chapterId: string, subChapterId: string, content: string) => void;
}

export const EbookWriting: React.FC<EbookWritingProps> = ({
  chapters,
  onUpdateChapterContent,
  onUpdateSubChapterContent
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Espace de Rédaction
        </CardTitle>
        <CardDescription>
          Rédigez vos chapitres avec des modèles de mise en forme professionnels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {chapters.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Ajoutez d'abord des chapitres dans l'onglet Planificateur pour commencer à rédiger
            </p>
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <Card key={chapter.id} className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg">
                  Chapitre {index + 1}: {chapter.title || 'Sans titre'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`chapter-${chapter.id}`} className="text-sm font-medium">
                      Contenu du chapitre
                    </Label>
                    <Textarea
                      id={`chapter-${chapter.id}`}
                      placeholder="Commencez à rédiger votre chapitre ici..."
                      value={chapter.content || ''}
                      onChange={(e) => onUpdateChapterContent(chapter.id, e.target.value)}
                      className="min-h-[300px] mt-2 font-serif text-base leading-relaxed"
                      style={{
                        fontFamily: 'Georgia, serif',
                        lineHeight: '1.8',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Mots: {chapter.content ? chapter.content.split(/\s+/).filter(word => word.length > 0).length : 0}
                    </span>
                    <span>•</span>
                    <span>
                      Caractères: {chapter.content ? chapter.content.length : 0}
                    </span>
                  </div>

                  {chapter.subChapters.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Sous-chapitres:</h4>
                      {chapter.subChapters.map((subChapter, subIndex) => (
                        <div key={subChapter.id} className="space-y-2">
                          <Label className="text-sm font-medium">
                            {index + 1}.{subIndex + 1} {subChapter.title || 'Sans titre'}
                          </Label>
                          <Textarea
                            placeholder="Contenu du sous-chapitre..."
                            value={subChapter.content || ''}
                            onChange={(e) => onUpdateSubChapterContent(chapter.id, subChapter.id, e.target.value)}
                            className="min-h-[200px] font-serif text-base leading-relaxed"
                            style={{
                              fontFamily: 'Georgia, serif',
                              lineHeight: '1.8',
                              fontSize: '16px'
                            }}
                          />
                          <div className="text-xs text-muted-foreground">
                            Mots: {subChapter.content ? subChapter.content.split(/\s+/).filter(word => word.length > 0).length : 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};