import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Image, Sparkles, Download, Copy, Check, Settings, Trash2, FileArchive, FolderOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { type Character } from './EbookCharacters';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import JSZip from 'jszip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { detectPlaceholderImage } from '@/lib/ebookImageValidation';
import { persistEbookImageToLibrary } from '@/lib/ebookImageStorage';

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
  seed?: number;
}


interface EbookChapterImageGeneratorProps {
  ebookTitle: string;
  chapters: Chapter[];
  characters?: Character[];
  ebookImages?: ChapterImage[];
  onImagesUpdate?: (images: ChapterImage[]) => void;
  onInsertImageToChapter?: (chapterId: string, imageUrl: string) => void;
  subscriberEmail?: string;
}

export const EbookChapterImageGenerator: React.FC<EbookChapterImageGeneratorProps> = ({
  ebookTitle,
  chapters,
  characters = [],
  ebookImages = [],
  onImagesUpdate,
  onInsertImageToChapter,
  subscriberEmail
}) => {
  const { hasValidApiKey, getConfig } = useOpenAIConfig();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useState<string>('professional illustration');
  const [generatedImages, setGeneratedImages] = useState<ChapterImage[]>(ebookImages);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [forceLovable, setForceLovable] = useState(false);

  const [imageRatio, setImageRatio] = useState<string>('square');
  const [imageQuality, setImageQuality] = useState<string>('high');
  const [colorScheme, setColorScheme] = useState<string>('auto');
  
  // Cohérence visuelle avancée
  const [visualCoherence, setVisualCoherence] = useState(false);
  const [coherenceStyle, setCoherenceStyle] = useState<string>('');
  const [coherenceColorScheme, setCoherenceColorScheme] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [coherenceIntensity, setCoherenceIntensity] = useState<'light' | 'medium' | 'strict'>('medium');
  const [autoCoherenceFromFirst, setAutoCoherenceFromFirst] = useState(true);
  
  // Seed pour régénération similaire
  const [lastSeed, setLastSeed] = useState<number | null>(null);
  const [useSameSeed, setUseSameSeed] = useState(false);
  
  // Palette de couleurs personnalisée pour cohérence
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('');
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>('');

  const styleCategories = [
    {
      category: '🎨 Illustration',
      styles: [
        { value: 'professional illustration', label: 'Illustration professionnelle', preview: '🎨' },
        { value: 'childrens book illustration', label: 'Livre pour enfants', preview: '🧸' },
        { value: 'manga anime style', label: 'Manga / Anime', preview: '🎌' },
        { value: 'comic book style', label: 'Bande dessinée', preview: '💥' },
        { value: 'vintage retro illustration', label: 'Vintage rétro', preview: '📺' },
        { value: 'line art sketch', label: 'Dessin au trait', preview: '✏️' },
      ]
    },
    {
      category: '🖌️ Peinture',
      styles: [
        { value: 'watercolor artistic', label: 'Aquarelle', preview: '💧' },
        { value: 'oil painting classical', label: 'Peinture à l\'huile', preview: '🖼️' },
        { value: 'impressionist style', label: 'Impressionniste', preview: '🌸' },
        { value: 'acrylic pop art', label: 'Pop Art acrylique', preview: '🎪' },
        { value: 'gouache illustration', label: 'Gouache', preview: '🎨' },
        { value: 'pastel soft colors', label: 'Pastels doux', preview: '🌈' },
      ]
    },
    {
      category: '🎯 Digital Art',
      styles: [
        { value: 'digital art concept', label: 'Concept Art', preview: '🎯' },
        { value: 'modern minimalist', label: 'Minimaliste moderne', preview: '✨' },
        { value: '3d rendered scene', label: 'Rendu 3D', preview: '🎮' },
        { value: 'pixel art retro', label: 'Pixel Art', preview: '👾' },
        { value: 'vector flat design', label: 'Design vectoriel', preview: '📐' },
        { value: 'isometric illustration', label: 'Isométrique', preview: '🏗️' },
      ]
    },
    {
      category: '📸 Réalisme',
      styles: [
        { value: 'photorealistic', label: 'Photoréaliste', preview: '📸' },
        { value: 'hyperrealistic portrait', label: '👤 Portrait ultra-réaliste', preview: '🧑' },
        { value: 'realistic human cinematic', label: '🎬 Humains cinématiques', preview: '🎥' },
        { value: 'cinematic movie scene', label: 'Scène cinématique', preview: '🎬' },
        { value: 'documentary style', label: 'Documentaire', preview: '📽️' },
        { value: 'portrait photography', label: 'Portrait photo', preview: '🖼️' },
        { value: 'fashion editorial', label: 'Editorial mode', preview: '👗' },
        { value: 'landscape photography', label: 'Paysage photo', preview: '🏔️' },
        { value: 'noir black white', label: 'Noir et blanc', preview: '🎭' },
      ]
    },
    {
      category: '✨ Fantaisie',
      styles: [
        { value: 'fantasy epic', label: 'Fantasy épique', preview: '🐉' },
        { value: 'sci-fi futuristic', label: 'Science-fiction', preview: '🚀' },
        { value: 'steampunk victorian', label: 'Steampunk', preview: '⚙️' },
        { value: 'gothic dark', label: 'Gothique sombre', preview: '🦇' },
        { value: 'magical fairytale', label: 'Conte de fées', preview: '🧚' },
        { value: 'surrealist dreamscape', label: 'Surréaliste', preview: '🌙' },
      ]
    },
    {
      category: '🌈 Abstrait',
      styles: [
        { value: 'abstract modern', label: 'Abstrait moderne', preview: '🌈' },
        { value: 'geometric patterns', label: 'Géométrique', preview: '🔷' },
        { value: 'fluid organic shapes', label: 'Formes fluides', preview: '🌊' },
        { value: 'psychedelic colorful', label: 'Psychédélique', preview: '🍄' },
        { value: 'glitch digital art', label: 'Glitch Art', preview: '📺' },
        { value: 'neon cyberpunk', label: 'Néon cyberpunk', preview: '💜' },
      ]
    }
  ];

  const ratioOptions = [
    { value: 'square', label: 'Carré (1:1)', dimensions: '1024x1024' },
    { value: 'landscape', label: 'Paysage (16:9)', dimensions: '1792x1024' },
    { value: 'portrait', label: 'Portrait (9:16)', dimensions: '1024x1792' },
    { value: 'wide', label: 'Panoramique (2:1)', dimensions: '1536x768' },
  ];

  const qualityOptions = [
    { value: 'standard', label: 'Standard', description: 'Rapide, bonne qualité' },
    { value: 'high', label: 'Haute qualité', description: 'Détaillé, plus lent' },
    { value: 'ultra', label: 'Ultra HD', description: 'Maximum de détails' },
  ];

  const colorSchemeOptions = [
    { value: 'auto', label: 'Automatique', description: 'Adapté au contenu' },
    { value: 'vibrant', label: 'Vibrant', description: 'Couleurs vives et saturées' },
    { value: 'muted', label: 'Sobre', description: 'Tons doux et subtils' },
    { value: 'monochrome', label: 'Monochrome', description: 'Nuances d\'une couleur' },
    { value: 'warm', label: 'Chaud', description: 'Tons orangés et dorés' },
    { value: 'cool', label: 'Froid', description: 'Tons bleus et verts' },
    { value: 'sepia', label: 'Sépia', description: 'Style vintage brun' },
  ];

  // Flatten styles for select
  const allStyles = styleCategories.flatMap(cat => cat.styles);

  // Synchroniser avec les images passées en props
  useEffect(() => {
    if (ebookImages.length > 0 && generatedImages.length === 0) {
      setGeneratedImages(ebookImages);
      console.log(`📂 ${ebookImages.length} image(s) chargée(s) depuis la base de données`);
    }
  }, [ebookImages]);

  // Notifier le parent quand les images changent (pour sauvegarde en BDD)
  useEffect(() => {
    if (onImagesUpdate && generatedImages.length > 0) {
      onImagesUpdate(generatedImages);
      console.log(`💾 ${generatedImages.length} image(s) synchronisée(s) avec la base de données`);
    }
  }, [generatedImages, onImagesUpdate]);

  // Auto-save image to library storage
  const saveImageToLibrary = async (imageUrl: string, chapterTitle: string) => {
    try {
      if (await detectPlaceholderImage(imageUrl)) {
        console.log('⚠️ Placeholder ignoré, non sauvegardé dans la bibliothèque');
        return imageUrl;
      }

      const storedUrl = await persistEbookImageToLibrary({
        imageUrl,
        ebookTitle,
        chapterTitle,
        subscriberEmail,
      });

      if (storedUrl !== imageUrl) {
        console.log(`✅ Image sauvegardée dans la bibliothèque: ${chapterTitle}`);
      }

      return storedUrl;
    } catch (error) {
      console.error('❌ Erreur sauvegarde bibliothèque:', error);
      return imageUrl;
    }
  };

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

          // Utiliser les paramètres de cohérence si activé
          const effectiveStyle = visualCoherence && coherenceStyle ? coherenceStyle : imageStyle;
          const effectiveColorScheme = visualCoherence && coherenceColorScheme ? coherenceColorScheme : colorScheme;
          
          const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
            body: {
              chapterTitle: chapter.title,
              chapterContent: chapter.content || '',
              ebookTitle,
              style: effectiveStyle,
              ratio: imageRatio,
              quality: imageQuality,
              colorScheme: effectiveColorScheme,
              visualCoherence,
              coherenceIntensity,
              referenceImageUrl: referenceImageUrl || undefined,
              seed: useSameSeed && lastSeed ? lastSeed : undefined,
              characters: characters.map(c => ({
                name: c.name,
                description: c.description,
                referenceImageUrl: c.referenceImageUrl
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
            const isPlaceholder = await detectPlaceholderImage(data.imageUrl);
            if (isPlaceholder) {
              throw new Error('L’IA a renvoyé un placeholder au lieu d’une image exploitable');
            }

            // Sauvegarder le seed si retourné
            if (data.seed) {
              setLastSeed(data.seed);
            }
            
            const finalImageUrl = await saveImageToLibrary(data.imageUrl, chapter.title);

            newImages.push({
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              imageUrl: finalImageUrl,
              style: visualCoherence && coherenceStyle ? coherenceStyle : imageStyle,
              seed: data.seed
            });
            success = true;
            
            // Activer automatiquement la cohérence après la première image
            if (i === 0 && autoCoherenceFromFirst) {
              setCoherenceStyle(imageStyle);
              setCoherenceColorScheme(colorScheme);
              if (!referenceImageUrl) {
                setReferenceImageUrl(finalImageUrl);
              }
              if (!visualCoherence) {
                setVisualCoherence(true);
              }
            }
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
              toast.error("💳 Crédits Lovable AI épuisés", {
                description: "Options : 1️⃣ Ajoutez des crédits à votre workspace Lovable, ou 2️⃣ Configurez votre clé OpenAI ci-dessous pour continuer",
                duration: 8000,
                action: {
                  label: 'En savoir plus',
                  onClick: () => window.open('https://docs.lovable.dev/features/ai', '_blank')
                }
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
    
    // Toast uniquement en cas d'échec total
    if (newImages.length === 0) {
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

      // Utiliser les paramètres de cohérence si activé
      const effectiveStyle = visualCoherence && coherenceStyle ? coherenceStyle : imageStyle;
      const effectiveColorScheme = visualCoherence && coherenceColorScheme ? coherenceColorScheme : colorScheme;
      
      const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
        body: {
          chapterTitle: chapter.title,
          chapterContent: chapter.content || '',
          ebookTitle,
          style: effectiveStyle,
          ratio: imageRatio,
          quality: imageQuality,
          colorScheme: effectiveColorScheme,
          visualCoherence,
          coherenceIntensity,
          referenceImageUrl: referenceImageUrl || undefined,
          seed: useSameSeed && lastSeed ? lastSeed : undefined,
          characters: characters.map(c => ({
            name: c.name,
            description: c.description,
            referenceImageUrl: c.referenceImageUrl
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
        const isPlaceholder = await detectPlaceholderImage(data.imageUrl);
        if (isPlaceholder) {
          throw new Error('L’IA a renvoyé un placeholder au lieu d’une image exploitable');
        }

        // Sauvegarder le seed si retourné
        if (data.seed) {
          setLastSeed(data.seed);
        }
        
        const finalImageUrl = await saveImageToLibrary(data.imageUrl, chapter.title);

        const newImage: ChapterImage = {
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          imageUrl: finalImageUrl,
          style: visualCoherence && coherenceStyle ? coherenceStyle : imageStyle,
          seed: data.seed
        };

        setGeneratedImages(prev => {
          const filtered = prev.filter(img => img.chapterId !== chapter.id);
          return [...filtered, newImage];
        });

        if (!referenceImageUrl && autoCoherenceFromFirst) {
          setReferenceImageUrl(finalImageUrl);
        }
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

  const clearAllImages = () => {
    setGeneratedImages([]);
    if (onImagesUpdate) {
      onImagesUpdate([]);
    }
    // Nettoyer aussi le localStorage pour rétrocompatibilité
    if (ebookTitle) {
      localStorage.removeItem(`ebook_chapter_images_${ebookTitle}`);
    }
    toast.success('🗑️ Toutes les images ont été effacées', {
      description: 'Base de données et cache nettoyés'
    });
  };

  const clearAllImageCache = () => {
    let count = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ebook_chapter_images_')) {
        localStorage.removeItem(key);
        count++;
      }
    });
    setGeneratedImages([]);
    if (onImagesUpdate) {
      onImagesUpdate([]);
    }
    toast.success(`🧹 Cache vidé: ${count} projet(s) nettoyé(s)`, {
      description: 'Tout le cache local a été supprimé'
    });
  };

  // Sync existing images to library
  const syncImagesToLibrary = async () => {
    if (generatedImages.length === 0) {
      toast.error('Aucune image à synchroniser');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Connectez-vous pour utiliser la bibliothèque');
      return;
    }

    const validImages: ChapterImage[] = [];
    for (const img of generatedImages) {
      if (!(await detectPlaceholderImage(img.imageUrl))) {
        validImages.push(img);
      }
    }

    if (validImages.length === 0) {
      toast.error('Aucune vraie image à synchroniser');
      return;
    }

    toast.info(`📤 Synchronisation de ${validImages.length} image(s)...`);
    let successCount = 0;

    for (const img of validImages) {
      try {
        await saveImageToLibrary(img.imageUrl, img.chapterTitle);
        successCount++;
      } catch (e) {
        console.error('Erreur sync image:', e);
      }
    }

    toast.success(`✅ ${successCount}/${validImages.length} image(s) synchronisée(s)`, {
      description: `Dossier: ${ebookTitle}`
    });
  };

  const exportAllImagesToZip = async () => {
    if (generatedImages.length === 0) {
      toast.error('Aucune image à exporter');
      return;
    }

    try {
      const zip = new JSZip();
      const folder = zip.folder('ebook-images');

      if (!folder) {
        throw new Error('Impossible de créer le dossier ZIP');
      }

      toast.info('📦 Création du fichier ZIP...', {
        description: `Exportation de ${generatedImages.length} image(s)`
      });

      // Ajouter chaque image au ZIP
      for (const img of generatedImages) {
        // Convertir data URL en blob
        const response = await fetch(img.imageUrl);
        const blob = await response.blob();
        
        // Nom de fichier sécurisé
        const fileName = `chapitre-${img.chapterId}-${img.chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        folder.file(fileName, blob);
      }

      // Générer le ZIP et déclencher le téléchargement
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebookTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'ebook'}-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('✅ ZIP créé avec succès!', {
        description: `${generatedImages.length} image(s) exportée(s)`
      });
    } catch (error) {
      console.error('Erreur lors de l\'export ZIP:', error);
      toast.error('❌ Erreur lors de l\'export', {
        description: 'Impossible de créer le fichier ZIP'
      });
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
          
          {/* Cohérence visuelle avancée */}
          <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-300 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="visual-coherence" 
                  checked={visualCoherence} 
                  onCheckedChange={(v) => {
                    setVisualCoherence(!!v);
                    if (v && !coherenceStyle) {
                      setCoherenceStyle(imageStyle);
                      setCoherenceColorScheme(colorScheme);
                    }
                  }} 
                />
                <Label htmlFor="visual-coherence" className="text-sm font-bold text-blue-900">
                  🎨 Mode Cohérence Visuelle
                </Label>
              </div>
              {visualCoherence && (
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full animate-pulse">
                  ACTIVÉ
                </span>
              )}
            </div>
            
            {visualCoherence && (
              <div className="space-y-4">
                <p className="text-xs text-blue-700 bg-blue-100 p-2 rounded-lg">
                  ⚡ <strong>Mode activé:</strong> Toutes les images utiliseront le même style, la même palette et la même ambiance pour un rendu uniforme dans tout l'ebook.
                </p>
                
                {/* Image de référence */}
                {referenceImageUrl && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-300">
                    <img 
                      src={referenceImageUrl} 
                      alt="Référence" 
                      className="w-16 h-16 object-cover rounded-lg border-2 border-green-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">✓ Image de référence définie</p>
                      <p className="text-xs text-green-600">Les nouvelles images s'inspireront de ce style</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setReferenceImageUrl(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </Button>
                  </div>
                )}
                
                {!referenceImageUrl && generatedImages.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800 mb-2">
                      💡 <strong>Conseil:</strong> Définissez la première image réussie comme référence pour une cohérence parfaite
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {generatedImages.slice(0, 4).map((img) => (
                        <button
                          key={img.chapterId}
                          onClick={() => {
                            setReferenceImageUrl(img.imageUrl);
                            toast.success('Image de référence définie', {
                              description: 'Les nouvelles images s\'inspireront de ce style'
                            });
                          }}
                          className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all hover:scale-105"
                        >
                          <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Intensité de cohérence */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Intensité de cohérence</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'light', label: '🌱 Légère', desc: 'Style similaire, variations permises' },
                      { value: 'medium', label: '⚖️ Moyenne', desc: 'Style cohérent, petites variations' },
                      { value: 'strict', label: '🔒 Stricte', desc: 'Style identique, aucune variation' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCoherenceIntensity(opt.value as 'light' | 'medium' | 'strict')}
                        className={`flex-1 p-2 rounded-lg border-2 transition-all text-xs ${
                          coherenceIntensity === opt.value 
                            ? 'border-blue-500 bg-blue-50 text-blue-800' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-[10px] opacity-70">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium">Style verrouillé</Label>
                    <Select value={coherenceStyle} onValueChange={setCoherenceStyle}>
                      <SelectTrigger className="h-9 text-xs mt-1">
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {styleCategories.flatMap(cat => cat.styles).map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.preview} {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Palette verrouillée</Label>
                    <Select value={coherenceColorScheme} onValueChange={setCoherenceColorScheme}>
                      <SelectTrigger className="h-9 text-xs mt-1">
                        <SelectValue placeholder="Palette" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorSchemeOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Auto-cohérence depuis première image */}
                <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                  <Checkbox 
                    id="auto-coherence" 
                    checked={autoCoherenceFromFirst} 
                    onCheckedChange={(v) => setAutoCoherenceFromFirst(!!v)} 
                  />
                  <Label htmlFor="auto-coherence" className="text-xs text-blue-700">
                    🔄 Appliquer automatiquement le style de la 1ère image aux suivantes
                  </Label>
                </div>
              </div>
            )}
          </div>
          
          {/* Régénération avec même seed */}
          {lastSeed && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="use-same-seed" 
                  checked={useSameSeed} 
                  onCheckedChange={(v) => setUseSameSeed(!!v)} 
                />
                <Label htmlFor="use-same-seed" className="text-sm font-medium text-amber-800">
                  🔄 Régénérer avec variations similaires
                </Label>
              </div>
              <p className="text-xs text-amber-700 mt-1 pl-6">
                Seed actuel: {lastSeed} — Les nouvelles images auront un style proche
              </p>
            </div>
          )}
          {/* Style Selection avec catégories */}
          <div className="space-y-3">
            <Label>Style d'illustration</Label>
            <Select value={imageStyle} onValueChange={setImageStyle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un style" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {styleCategories.map(category => (
                  <div key={category.category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                      {category.category}
                    </div>
                    {category.styles.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        <span className="flex items-center gap-2">
                          <span>{style.preview}</span>
                          <span>{style.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            
            {/* Aperçu du style sélectionné */}
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30 text-sm">
              <span className="text-lg">{allStyles.find(s => s.value === imageStyle)?.preview || '🎨'}</span>
              <span className="text-muted-foreground">Style actuel:</span>
              <span className="font-medium">{allStyles.find(s => s.value === imageStyle)?.label || imageStyle}</span>
            </div>
          </div>

          {/* Options avancées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Format d'image */}
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={imageRatio} onValueChange={setImageRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ratioOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.dimensions}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Qualité */}
            <div className="space-y-2">
              <Label>Qualité</Label>
              <Select value={imageQuality} onValueChange={setImageQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Palette de couleurs */}
            <div className="space-y-2">
              <Label>Palette</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorSchemeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateAllChapterImages}
              disabled={isGenerating || chapters.length === 0 || !ebookTitle}
              className="flex-1"
              style={{ background: 'linear-gradient(135deg, hsl(var(--coral-pink)) 0%, hsl(var(--royal-purple)) 100%)' }}
            >
              <Image className="h-4 w-4 mr-2" />
              {isGenerating ? 'Génération en cours...' : `Générer toutes les images (${chapters.length})`}
            </Button>
            <Button
              onClick={clearAllImageCache}
              variant="outline"
              size="icon"
              title="Vider tout le cache d'images"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--royal-purple))' }}>
              Images générées ({generatedImages.length})
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={syncImagesToLibrary}
                variant="outline"
                size="sm"
                className="text-emerald-600 hover:bg-emerald-50"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Sync bibliothèque
              </Button>
              <Button
                onClick={exportAllImagesToZip}
                variant="outline"
                size="sm"
                className="text-primary hover:bg-primary/10"
              >
                <FileArchive className="h-4 w-4 mr-2" />
                Exporter en ZIP
              </Button>
              <Button
                onClick={clearAllImages}
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tout effacer
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((img) => (
              <Card 
                key={img.chapterId}
                className="border-2 overflow-hidden"
                style={{ borderColor: 'hsl(var(--cobalt-blue) / 0.3)' }}
              >
                <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img 
                    src={img.imageUrl} 
                    alt={img.chapterTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error for:', img.chapterTitle);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-muted-foreground"><span class="text-4xl mb-2">🖼️</span><span class="text-sm">Image non disponible</span></div>';
                    }}
                    onLoad={() => console.log('Image loaded:', img.chapterTitle)}
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2 line-clamp-1">{img.chapterTitle}</h4>
                  <p className="text-xs text-muted-foreground mb-3">Style: {img.style}</p>
                  <div className="flex gap-2 flex-wrap">
                    {onInsertImageToChapter && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onInsertImageToChapter(img.chapterId, img.imageUrl)}
                        className="flex-1"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Insérer
                      </Button>
                    )}
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