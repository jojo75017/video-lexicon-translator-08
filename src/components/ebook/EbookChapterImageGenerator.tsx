import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Image, Sparkles, Download, Copy, Check, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { type Character } from './EbookCharacters';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const { hasValidApiKey, getConfig } = useOpenAIConfig();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<string>('professional illustration');
  const [generatedImages, setGeneratedImages] = useState<ChapterImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [forceLovable, setForceLovable] = useState(false);

  const styleOptions = [
    { value: 'professional illustration', label: '🎨 Illustration professionnelle' },
    { value: 'modern minimalist', label: '✨ Minimaliste moderne' },
    { value: 'watercolor artistic', label: '🖌️ Aquarelle artistique' },
    { value: 'digital art concept', label: '🎯 Art digital conceptuel' },
    { value: 'photorealistic', label: '📸 Photoréaliste' },
    { value: 'abstract modern', label: '🌈 Abstrait moderne' }
  ];

  // Charger les images depuis localStorage au montage
  useEffect(() => {
    if (ebookTitle) {
      const storageKey = `ebook_chapter_images_${ebookTitle}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setGeneratedImages(parsed);
          console.log(`📂 ${parsed.length} image(s) chargée(s) depuis localStorage`);
        } catch (error) {
          console.error('Erreur chargement images localStorage:', error);
        }
      }
    }
  }, [ebookTitle]);

  // Sauvegarder les images dans localStorage à chaque changement
  useEffect(() => {
    if (ebookTitle && generatedImages.length > 0) {
      const storageKey = `ebook_chapter_images_${ebookTitle}`;
      localStorage.setItem(storageKey, JSON.stringify(generatedImages));
      console.log(`💾 ${generatedImages.length} image(s) sauvegardée(s) dans localStorage`);
    }
  }, [generatedImages, ebookTitle]);

  const generateAllChapterImages = async () => {
    if (!ebookTitle || chapters.length === 0) {
      toast.error('Titre et chapitres requis');
      return;
    }

    const config = getConfig();
    const useOpenAI = hasValidApiKey();

    setIsGenerating(true);
    setProgress(0);
    const newImages: ChapterImage[] = [];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      let attempt = 0;
      const maxAttempts = 3;
      let success = false;

      while (attempt < maxAttempts && !success) {
        try {
          if (attempt > 0) {
            const backoff = 1500 * Math.pow(2, attempt - 1);
            toast.info(`Nouvelle tentative (${attempt + 1}/${maxAttempts}) pour "${chapter.title}" dans ${backoff/1000}s...`);
            await delay(backoff);
          }

          console.log(`[BATCH ${i+1}/${chapters.length}] Génération pour "${chapter.title}"`, {
            useOpenAI,
            forceLovable,
            hasApiKey: !!config.apiKey
          });

          const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
            body: {
              chapterTitle: chapter.title,
              chapterContent: chapter.content || '',
              ebookTitle,
              style: imageStyle,
              characters: characters.map(c => ({
                name: c.name,
                description: c.description
              })),
              useOpenAI,
              openaiApiKey: useOpenAI ? config.apiKey : undefined,
              disableOpenAIFallback: forceLovable,
              forceLovable
            }
          });

          console.log(`[BATCH ${i+1}/${chapters.length}] Réponse reçue:`, { data, error });

          if (error) throw error;

          if (data?.imageUrl) {
            newImages.push({
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              imageUrl: data.imageUrl,
              style: imageStyle
            });
            toast.success(`✅ Image générée pour "${chapter.title}"`);
            success = true;
          } else {
            throw new Error('Pas d\'URL d\'image dans la réponse');
          }
        } catch (error: any) {
          attempt++;
          console.error(`[BATCH ${i+1}/${chapters.length}] Tentative ${attempt}/${maxAttempts} échouée:`, error);

          // Détection erreur 402 (crédits Lovable épuisés)
          const is402 = error.message?.includes('402') || 
                        error.context?.body?.error?.includes('crédits') || 
                        error.context?.body?.code === 'PAYMENT_REQUIRED';

          if (is402) {
            console.log('🔴 Erreur 402 détectée - Crédits Lovable épuisés');
            
            // Ouvrir automatiquement le panneau de configuration
            setShowConfig(true);
            setIsGenerating(false);
            
            // Vérifier si une clé OpenAI est configurée
            if (hasValidApiKey()) {
              toast.info("Repli automatique vers OpenAI", {
                description: "Lovable AI épuisé, relance avec votre clé OpenAI...",
                duration: 3000
              });
              
              // Relancer automatiquement avec OpenAI
              await delay(1500);
              await generateAllChapterImages();
              return;
            } else {
              toast.error("Crédits Lovable AI épuisés", {
                description: "Configurez votre clé OpenAI ci-dessous pour continuer",
                duration: 6000
              });
              return;
            }
          }

          if (attempt >= maxAttempts) {
            // Dernière tentative échouée
            if (error.message?.includes('429') || error.context?.body?.error?.includes('rate limit') || error.context?.body?.code === 'RATE_LIMITED') {
              toast.error('⏱️ Limite de requêtes atteinte', {
                description: 'Veuillez patienter 1-2 minutes avant de continuer.',
                duration: 5000
              });
            } else if (error.context?.body?.error) {
              toast.error(`❌ Échec pour "${chapter.title}"`, {
                description: error.context.body.error,
                duration: 4000
              });
            } else {
              toast.error(`❌ Échec pour "${chapter.title}"`, {
                description: error.message || 'Vérifiez votre connexion et vos crédits.',
                duration: 4000
              });
            }
          }
        }

        // Petit délai entre chapitres (même en succès) pour éviter le rate limit
        if (success && i < chapters.length - 1) {
          await delay(1500);
        }
      }

      setProgress(((i + 1) / chapters.length) * 100);
    }

    setGeneratedImages(newImages);
    setIsGenerating(false);
    
    if (newImages.length > 0) {
      toast.success(`🎉 ${newImages.length} image(s) générée(s) avec succès !`);
    } else {
      toast.error('Aucune image générée. Vérifiez vos crédits ou votre clé OpenAI.');
    }
  };

  const generateSingleChapterImage = async (chapter: Chapter) => {
    if (!ebookTitle) {
      toast.error('Titre requis');
      return;
    }

    const config = getConfig();
    const useOpenAI = hasValidApiKey();

    setIsGenerating(true);

    try {
      console.log(`[SINGLE] Génération pour "${chapter.title}"`, {
        useOpenAI,
        forceLovable,
        hasApiKey: !!config.apiKey
      });

      const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
        body: {
          chapterTitle: chapter.title,
          chapterContent: chapter.content || '',
          ebookTitle,
          style: imageStyle,
          characters: characters.map(c => ({
            name: c.name,
            description: c.description
          })),
          useOpenAI,
          openaiApiKey: useOpenAI ? config.apiKey : undefined,
          disableOpenAIFallback: forceLovable,
          forceLovable
        }
      });

      console.log(`[SINGLE] Réponse reçue:`, { data, error });

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

        toast.success(`✅ Image générée pour "${chapter.title}"`);
      } else {
        throw new Error('Pas d\'URL d\'image dans la réponse');
      }
    } catch (error: any) {
      console.error('[SINGLE] Error generating chapter image:', error);
      
      // Détection erreur 402 (crédits Lovable épuisés)
      const is402 = error.message?.includes('402') || 
                    error.context?.body?.error?.includes('crédits') || 
                    error.context?.body?.code === 'PAYMENT_REQUIRED';

      if (is402) {
        console.log('🔴 Erreur 402 détectée - Crédits Lovable épuisés');
        
        // Ouvrir automatiquement le panneau de configuration
        setShowConfig(true);
        setIsGenerating(false);
        
        // Vérifier si une clé OpenAI est configurée
        if (hasValidApiKey()) {
          toast.info("Repli automatique vers OpenAI", {
            description: "Lovable AI épuisé, relance avec votre clé OpenAI...",
            duration: 3000
          });
          
          // Relancer automatiquement avec OpenAI
          await new Promise(resolve => setTimeout(resolve, 1500));
          await generateSingleChapterImage(chapter);
          return;
        } else {
          toast.error("Crédits Lovable AI épuisés", {
            description: "Configurez votre clé OpenAI ci-dessous pour continuer",
            duration: 6000
          });
          return;
        }
      }
      
      if (error.message?.includes('429') || error.context?.body?.error?.includes('rate limit') || error.context?.body?.code === 'RATE_LIMITED') {
        toast.error('⏱️ Limite de requêtes atteinte', {
          description: 'Veuillez patienter 1-2 minutes avant de réessayer.',
          duration: 5000
        });
      } else if (error.context?.body?.error) {
        toast.error('❌ Erreur de génération', {
          description: error.context.body.error,
          duration: 4000
        });
      } else {
        toast.error('❌ Erreur de génération', {
          description: error.message || 'Vérifiez votre connexion et vos crédits.',
          duration: 4000
        });
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
            {hasValidApiKey() 
              ? "Utilise votre clé OpenAI personnelle pour générer des images" 
              : "Créez des illustrations avec Lovable AI (crédits requis)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Collapsible open={showConfig} onOpenChange={setShowConfig}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {hasValidApiKey() ? '✓ Clé OpenAI configurée' : 'Configurer clé OpenAI (optionnel)'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <OpenAIConfigPanel 
                title="Configuration OpenAI pour Images"
                description="Utilisez votre propre clé API OpenAI pour générer des images sans limite de crédits Lovable"
                showModelSelection={false}
                compact
              />
            </CollapsibleContent>
          </Collapsible>
          <div className="flex items-center gap-2 mb-3">
            <Checkbox id="force-lovable" checked={forceLovable} onCheckedChange={(v) => setForceLovable(!!v)} />
            <Label htmlFor="force-lovable" className="text-sm">Forcer Lovable AI (désactiver fallback OpenAI)</Label>
          </div>
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