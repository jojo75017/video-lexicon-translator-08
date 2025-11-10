import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Image, Sparkles, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { type Character } from './EbookCharacters';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters?: Array<{ id: string; title: string; content?: string }>;
}

interface ChapterImage {
  chapterId: string;
  chapterTitle: string;
  imageUrl: string;
  style: string;
}


interface EbookChapterImageGeneratorProps {
  ebookTitle: string;
  chapters: Chapter[];
  characters?: Character[];
}

export const EbookChapterImageGenerator: React.FC<EbookChapterImageGeneratorProps> = ({
  ebookTitle,
  chapters,
  characters = []
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<string>('professional illustration');
  const [generatedImages, setGeneratedImages] = useState<ChapterImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const styleOptions = [
    { value: 'professional illustration', label: '🎨 Illustration professionnelle' },
    { value: 'modern minimalist', label: '✨ Minimaliste moderne' },
    { value: 'watercolor artistic', label: '🖌️ Aquarelle artistique' },
    { value: 'digital art concept', label: '🎯 Art digital conceptuel' },
    { value: 'photorealistic', label: '📸 Photoréaliste' },
    { value: 'abstract modern', label: '🌈 Abstrait moderne' }
  ];

  const generateAllChapterImages = async () => {
    if (!ebookTitle || chapters.length === 0) {
      toast.error('Titre et chapitres requis');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const newImages: ChapterImage[] = [];

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      try {
        const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
          body: {
            chapterTitle: chapter.title,
            chapterContent: chapter.content || '',
            ebookTitle,
            style: imageStyle,
            characters: characters.map(c => ({
              name: c.name,
              description: c.description
            }))
          }
        });

        if (error) throw error;

        if (data?.imageUrl) {
          newImages.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            imageUrl: data.imageUrl,
            style: imageStyle
          });
          toast.success(`Image générée pour "${chapter.title}"`);
        }

        setProgress(((i + 1) / chapters.length) * 100);
      } catch (error: any) {
        console.error(`Error generating image for chapter ${chapter.title}:`, error);
        
        // Gestion spécifique des erreurs de crédits et rate limiting
        if (error.message?.includes('402') || error.context?.body?.error?.includes('Crédits épuisés')) {
          toast.error('⚠️ Crédits épuisés. Veuillez ajouter des crédits à votre espace de travail Lovable (Settings > Workspace > Usage).');
        } else if (error.message?.includes('429') || error.context?.body?.error?.includes('Limite de requêtes')) {
          toast.error('⏱️ Trop de requêtes. Veuillez patienter quelques instants avant de réessayer.');
        } else {
          toast.error(`Erreur pour "${chapter.title}": ${error.message || 'Erreur inconnue'}`);
        }
      }
    }

    setGeneratedImages(newImages);
    setIsGenerating(false);
    
    if (newImages.length > 0) {
      toast.success(`${newImages.length} image(s) générée(s) avec succès !`);
    }
  };

  const generateSingleChapterImage = async (chapter: Chapter) => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
        body: {
          chapterTitle: chapter.title,
          chapterContent: chapter.content || '',
          ebookTitle,
          style: imageStyle,
          characters: characters.map(c => ({
            name: c.name,
            description: c.description
          }))
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        const newImage: ChapterImage = {
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          imageUrl: data.imageUrl,
          style: imageStyle
        };

        setGeneratedImages(prev => {
          const filtered = prev.filter(img => img.chapterId !== chapter.id);
          return [...filtered, newImage];
        });

        toast.success(`Image générée pour "${chapter.title}"`);
      }
    } catch (error: any) {
      console.error('Error generating chapter image:', error);
      
      // Gestion spécifique des erreurs de crédits et rate limiting
      if (error.message?.includes('402') || error.context?.body?.error?.includes('Crédits épuisés')) {
        toast.error('⚠️ Crédits épuisés. Veuillez ajouter des crédits à votre espace de travail Lovable (Settings > Workspace > Usage).');
      } else if (error.message?.includes('429') || error.context?.body?.error?.includes('Limite de requêtes')) {
        toast.error('⏱️ Trop de requêtes. Veuillez patienter quelques instants avant de réessayer.');
      } else {
        toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyImageUrl = (imageUrl: string, chapterId: string) => {
    navigator.clipboard.writeText(imageUrl);
    setCopiedId(chapterId);
    toast.success('URL copiée dans le presse-papier');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadImage = async (imageUrl: string, chapterTitle: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Image téléchargée');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        className="border-2" 
        style={{ 
          borderColor: 'hsl(var(--coral-pink))',
          background: 'linear-gradient(135deg, hsl(var(--cream)) 0%, hsl(var(--coral-pink) / 0.05) 100%)'
        }}
      >
        <CardHeader style={{ background: 'linear-gradient(135deg, hsl(var(--coral-pink) / 0.15) 0%, hsl(var(--royal-purple) / 0.15) 100%)' }}>
          <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--royal-purple))' }}>
            <Sparkles className="h-5 w-5" />
            🎨 Générateur d'Images AI pour Chapitres
          </CardTitle>
          <CardDescription style={{ color: 'hsl(var(--royal-purple) / 0.8)' }}>
            Créez des illustrations cohérentes et professionnelles pour chaque chapitre avec Lovable AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="style">Style d'illustration</Label>
            <Select value={imageStyle} onValueChange={setImageStyle}>
              <SelectTrigger id="style" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateAllChapterImages}
            disabled={isGenerating || chapters.length === 0 || !ebookTitle}
            className="w-full"
            style={{ background: 'linear-gradient(135deg, hsl(var(--coral-pink)) 0%, hsl(var(--royal-purple)) 100%)' }}
          >
            <Image className="h-4 w-4 mr-2" />
            {isGenerating ? 'Génération en cours...' : `Générer toutes les images (${chapters.length})`}
          </Button>

          {isGenerating && progress > 0 && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(progress)}% complété
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des images générées */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--royal-purple))' }}>
            Images générées ({generatedImages.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((img) => (
              <Card 
                key={img.chapterId}
                className="border-2 overflow-hidden"
                style={{ borderColor: 'hsl(var(--cobalt-blue) / 0.3)' }}
              >
                <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={img.imageUrl} 
                    alt={img.chapterTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2 line-clamp-1">{img.chapterTitle}</h4>
                  <p className="text-xs text-muted-foreground mb-3">Style: {img.style}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyImageUrl(img.imageUrl, img.chapterId)}
                      className="flex-1"
                    >
                      {copiedId === img.chapterId ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      Copier URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(img.imageUrl, img.chapterTitle)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Liste des chapitres sans image */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Générer individuellement
            </CardTitle>
            <CardDescription>
              Cliquez sur un chapitre pour générer son image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chapters.map((chapter) => {
                const hasImage = generatedImages.some(img => img.chapterId === chapter.id);
                return (
                  <div 
                    key={chapter.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {hasImage && <Check className="h-4 w-4 text-green-600" />}
                      <span className={hasImage ? 'text-muted-foreground' : ''}>
                        {chapter.title}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={hasImage ? 'outline' : 'default'}
                      onClick={() => generateSingleChapterImage(chapter)}
                      disabled={isGenerating}
                    >
                      {hasImage ? 'Régénérer' : 'Générer'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};