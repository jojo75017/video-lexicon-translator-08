import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Chapter } from '@/hooks/useEbookGeneration';
import { toast } from 'sonner';
import EbookImageBank from './EbookImageBank';
import { EbookFormattingToolbar } from './EbookFormattingToolbar';

interface ChapterImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

interface EbookWritingProps {
  chapters: Chapter[];
  onUpdateChapterContent: (chapterId: string, content: string) => void;
  onUpdateSubChapterContent: (chapterId: string, subChapterId: string, content: string) => void;
  ebookTitle?: string;
}

export const EbookWriting: React.FC<EbookWritingProps> = ({
  chapters,
  onUpdateChapterContent,
  onUpdateSubChapterContent,
  ebookTitle = 'Mon Ebook'
}) => {
  const [chapterImages, setChapterImages] = useState<Record<string, ChapterImage[]>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const addImageToChapter = (chapterId: string, url?: string, alt?: string) => {
    const finalUrl = url || imageUrl;
    const finalAlt = alt || imageAlt;

    if (!finalUrl.trim()) {
      toast.error('Veuillez entrer une URL d\'image');
      return;
    }

    const newImage: ChapterImage = {
      id: Date.now().toString(),
      url: finalUrl,
      alt: finalAlt || 'Image du chapitre',
      position: chapterImages[chapterId]?.length || 0
    };

    setChapterImages(prev => ({
      ...prev,
      [chapterId]: [...(prev[chapterId] || []), newImage]
    }));

    // Insérer le marqueur d'image dans le contenu
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      const imageMarker = `\n\n[IMAGE:${newImage.id}:${finalUrl}]\n\n`;
      onUpdateChapterContent(chapterId, (chapter.content || '') + imageMarker);
    }

    toast.success('Image ajoutée au chapitre');
    setImageUrl('');
    setImageAlt('');
    setIsImageDialogOpen(false);
  };

  const handleImageSelect = (imageUrl: string, title: string) => {
    if (currentChapterId) {
      addImageToChapter(currentChapterId, imageUrl, title || 'Image générée par IA');
    }
  };

  const removeImageFromChapter = (chapterId: string, imageId: string) => {
    setChapterImages(prev => ({
      ...prev,
      [chapterId]: prev[chapterId]?.filter(img => img.id !== imageId) || []
    }));

    // Supprimer le marqueur d'image du contenu
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter && chapter.content) {
      const regex = new RegExp(`\\[IMAGE:${imageId}:.*?\\]`, 'g');
      onUpdateChapterContent(chapterId, chapter.content.replace(regex, ''));
    }

    toast.success('Image supprimée');
  };

  const renderContentWithImages = (content: string, chapterId: string) => {
    const images = chapterImages[chapterId] || [];
    if (images.length === 0) return null;

    return (
      <div className="mt-4 space-y-4 border-t pt-4">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Images insérées dans ce chapitre:
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                  }}
                />
              </div>
              <div className="p-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">{image.alt}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeImageFromChapter(chapterId, image.id)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Les marqueurs [IMAGE:...] dans votre texte seront remplacés par les images lors de l'export
        </p>
      </div>
    );
  };

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
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`chapter-${chapter.id}`} className="text-sm font-medium">
                      Contenu du chapitre
                    </Label>
                    <Dialog open={isImageDialogOpen && currentChapterId === chapter.id} onOpenChange={setIsImageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCurrentChapterId(chapter.id);
                            setIsImageDialogOpen(true);
                          }}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Ajouter une image
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Ajouter une image au chapitre</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="ai" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ai">Générer avec IA</TabsTrigger>
                            <TabsTrigger value="url">URL manuelle</TabsTrigger>
                          </TabsList>
                          <TabsContent value="ai" className="mt-4">
                            <EbookImageBank
                              onImageSelect={handleImageSelect}
                              ebookTitle={ebookTitle}
                              chapters={chapters}
                            />
                          </TabsContent>
                          <TabsContent value="url" className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="image-url">URL de l'image</Label>
                                <Input
                                  id="image-url"
                                  placeholder="https://example.com/image.jpg"
                                  value={imageUrl}
                                  onChange={(e) => setImageUrl(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="image-alt">Description de l'image (optionnel)</Label>
                                <Input
                                  id="image-alt"
                                  placeholder="Description de l'image"
                                  value={imageAlt}
                                  onChange={(e) => setImageAlt(e.target.value)}
                                />
                              </div>
                              <Button
                                onClick={() => addImageToChapter(chapter.id)}
                                className="w-full"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Insérer l'image
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <EbookFormattingToolbar
                      textareaRef={{ current: textareaRefs.current[chapter.id] }}
                      value={chapter.content || ''}
                      onChange={(value) => onUpdateChapterContent(chapter.id, value)}
                    />
                    <Textarea
                      ref={(el) => { textareaRefs.current[chapter.id] = el; }}
                      id={`chapter-${chapter.id}`}
                      placeholder="Commencez à rédiger votre chapitre ici..."
                      value={chapter.content || ''}
                      onChange={(e) => onUpdateChapterContent(chapter.id, e.target.value)}
                      className="min-h-[300px] font-serif text-base leading-relaxed rounded-t-none border-t-0 bg-background text-foreground"
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
                    {chapterImages[chapter.id]?.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {chapterImages[chapter.id].length} image{chapterImages[chapter.id].length > 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </div>

                  {renderContentWithImages(chapter.content || '', chapter.id)}

                  {chapter.subChapters.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium text-sm text-muted-foreground">Sous-chapitres:</h4>
                      {chapter.subChapters.map((subChapter, subIndex) => (
                        <div key={subChapter.id} className="space-y-2">
                          <Label className="text-sm font-medium">
                            {index + 1}.{subIndex + 1} {subChapter.title || 'Sans titre'}
                          </Label>
                          <EbookFormattingToolbar
                            textareaRef={{ current: textareaRefs.current[`${chapter.id}-${subChapter.id}`] }}
                            value={subChapter.content || ''}
                            onChange={(value) => onUpdateSubChapterContent(chapter.id, subChapter.id, value)}
                          />
                          <Textarea
                            ref={(el) => { textareaRefs.current[`${chapter.id}-${subChapter.id}`] = el; }}
                            placeholder="Contenu du sous-chapitre..."
                            value={subChapter.content || ''}
                            onChange={(e) => onUpdateSubChapterContent(chapter.id, subChapter.id, e.target.value)}
                            className="min-h-[200px] font-serif text-base leading-relaxed rounded-t-none border-t-0 bg-background text-foreground"
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