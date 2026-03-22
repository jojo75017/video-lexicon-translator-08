import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Film, Download, Play, Pause, Image, Music, Settings2, Loader2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChapterSlide {
  title: string;
  imageUrl: string;
  duration: number;
}

interface RawChapterImageData {
  url?: string;
  title?: string;
  chapterId?: string;
  chapterIndex?: number;
  imageUrl?: string;
  chapterTitle?: string;
}

interface ChapterImageData {
  url: string;
  title: string;
  chapterId?: string;
  chapterIndex?: number;
}

interface EbookVideoCreatorProps {
  ebookTitle: string;
  authorName?: string;
  chapters: Array<{ id: string; title: string; content?: string }>;
  ebookImages: Array<RawChapterImageData>;
  coverImage?: string;
  onImagesUpdate?: (images: Array<ChapterImageData>) => void;
}

const EbookVideoCreator: React.FC<EbookVideoCreatorProps> = ({
  ebookTitle,
  authorName,
  chapters,
  ebookImages,
  coverImage,
  onImagesUpdate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(8);
  const [showTitle, setShowTitle] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showOutro, setShowOutro] = useState(true);
  const [resolution, setResolution] = useState<'1280x720' | '1920x1080'>('1280x720');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageGenProgress, setImageGenProgress] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);

  const normalizedImages = ebookImages
    .map<ChapterImageData | null>((image, index) => {
      const url = image.url || image.imageUrl || '';

      if (!url) return null;

      return {
        url,
        title: image.title || image.chapterTitle || chapters[index]?.title || `Chapitre ${index + 1}`,
        chapterId: image.chapterId,
        chapterIndex: image.chapterIndex ?? index,
      };
    })
    .filter((image): image is ChapterImageData => Boolean(image));

  // Helper: find image for a chapter
  const getImageForChapter = (ch: { id: string; title: string }, index: number): ChapterImageData | undefined => {
    // Try matching by chapterId first
    const byId = normalizedImages.find(img => img.chapterId === ch.id);
    if (byId && !brokenImages.has(byId.url)) return byId;
    // Fallback: match by title
    const byTitle = normalizedImages.find(img => img.title === ch.title);
    if (byTitle && !brokenImages.has(byTitle.url)) return byTitle;
    // Fallback: by explicit index, then array order
    const byChapterIndex = normalizedImages.find(img => img.chapterIndex === index);
    if (byChapterIndex && !brokenImages.has(byChapterIndex.url)) return byChapterIndex;
    const byIndex = normalizedImages[index];
    if (byIndex && !brokenImages.has(byIndex.url)) return byIndex;
    return undefined;
  };

  const handleImageError = (url: string) => {
    setBrokenImages(prev => new Set(prev).add(url));
  };

  // Build slide list
  const slides: ChapterSlide[] = chapters.map((ch, i) => {
    const img = getImageForChapter(ch, i);
    return {
      title: ch.title,
      imageUrl: img?.url || '',
      duration: defaultDuration,
    };
  }).filter(s => s.imageUrl);

  const chaptersWithoutImages = chapters.filter((ch, i) => !getImageForChapter(ch, i));

  const totalDuration = (showIntro ? 5 : 0) + slides.reduce((a, s) => a + s.duration, 0) + (showOutro ? 5 : 0);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      toast.success('Audio chargé !');
    }
  };

  // Generate missing chapter images via edge function
  const generateMissingImages = async () => {
    if (chaptersWithoutImages.length === 0) {
      toast.info('Tous les chapitres ont déjà une image !');
      return;
    }

    setIsGeneratingImages(true);
    setImageGenProgress(0);
    const newImages: ChapterImageData[] = [...normalizedImages];
    let generated = 0;

    for (const chapter of chaptersWithoutImages) {
      try {
        toast.loading(`Génération image: ${chapter.title}...`, { id: `img-${chapter.id}` });

        const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
          body: {
            chapterTitle: chapter.title,
            chapterContent: chapter.content?.substring(0, 500) || chapter.title,
            ebookTitle,
            style: 'professional illustration',
            characters: [],
            ratio: 'landscape',
            quality: 'standard',
          },
        });

        if (error) throw error;

        const imageUrl = data?.imageUrl;
        if (imageUrl && !imageUrl.includes('placeholder')) {
          newImages.push({
            url: imageUrl,
            title: chapter.title,
            chapterId: chapter.id,
          });
          generated++;
          toast.success(`Image générée: ${chapter.title}`, { id: `img-${chapter.id}` });
        } else {
          toast.error(`Pas d'image pour: ${chapter.title}`, { id: `img-${chapter.id}` });
        }
      } catch (err: any) {
        console.error('Image generation error:', err);
        toast.error(`Erreur: ${chapter.title}`, { id: `img-${chapter.id}` });
      }

      setImageGenProgress(((generated + (chaptersWithoutImages.length - chaptersWithoutImages.indexOf(chapter) > 0 ? 0 : 1)) / chaptersWithoutImages.length) * 100);
    }

    if (generated > 0) {
      onImagesUpdate?.(newImages);
      toast.success(`${generated} image(s) générée(s) avec succès !`);
    }

    setIsGeneratingImages(false);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawSlide = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number,
    title: string,
    showTitleOverlay: boolean,
    transitionProgress: number
  ) => {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, w, h);

    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = h;
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = w / imgRatio;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.globalAlpha = Math.min(1, transitionProgress * 2);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;

    if (showTitleOverlay && title) {
      const grad = ctx.createLinearGradient(0, h - 140, 0, h);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h - 140, w, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${w >= 1920 ? 36 : 28}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(title, w / 2, h - 30, w - 80);
    }
  };

  const drawTextSlide = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    lines: string[],
    subLines: string[],
    progress: number
  ) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const alpha = Math.min(1, progress * 3);
    ctx.globalAlpha = alpha;

    const fontSize = w >= 1920 ? 52 : 38;
    const subFontSize = w >= 1920 ? 28 : 22;

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const totalHeight = lines.length * (fontSize + 10) + subLines.length * (subFontSize + 8);
    let y = (h - totalHeight) / 2;

    for (const line of lines) {
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillText(line, w / 2, y + fontSize / 2, w - 100);
      y += fontSize + 16;
    }

    ctx.fillStyle = '#a0a0c0';
    for (const line of subLines) {
      ctx.font = `${subFontSize}px sans-serif`;
      ctx.fillText(line, w / 2, y + subFontSize / 2, w - 100);
      y += subFontSize + 12;
    }

    ctx.globalAlpha = 1;
  };

  const generateVideo = useCallback(async () => {
    if (slides.length === 0) {
      toast.error('Aucune image de chapitre disponible. Générez des images d\'abord.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressLabel('Préparation...');

    try {
      const [w, h] = resolution === '1920x1080' ? [1920, 1080] : [1280, 720];
      const fps = 30;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      setProgressLabel('Chargement des images...');
      const images: HTMLImageElement[] = [];
      for (let i = 0; i < slides.length; i++) {
        try {
          const img = await loadImage(slides[i].imageUrl);
          images.push(img);
        } catch {
          toast.error(`Impossible de charger l'image du chapitre "${slides[i].title}"`);
          setIsGenerating(false);
          return;
        }
        setProgress(((i + 1) / slides.length) * 20);
      }

      const stream = canvas.captureStream(fps);

      let audioElement: HTMLAudioElement | null = null;
      if (audioFile) {
        audioElement = new Audio(URL.createObjectURL(audioFile));
        audioElement.muted = true;
        try {
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaElementSource(audioElement);
          const dest = audioCtx.createMediaStreamDestination();
          source.connect(dest);
          source.connect(audioCtx.destination);
          dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
        } catch (e) {
          console.warn('Audio track could not be added:', e);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: resolution === '1920x1080' ? 8_000_000 : 5_000_000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const videoReady = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: 'video/webm' }));
        };
      });

      recorder.start(100);

      if (audioElement) {
        audioElement.muted = false;
        audioElement.play().catch(() => {});
      }

      const timeline: Array<{ type: 'intro' | 'slide' | 'outro'; index?: number; duration: number }> = [];

      if (showIntro) {
        timeline.push({ type: 'intro', duration: 5 });
      }
      slides.forEach((s, i) => {
        timeline.push({ type: 'slide', index: i, duration: s.duration });
      });
      if (showOutro) {
        timeline.push({ type: 'outro', duration: 5 });
      }

      const totalFrames = timeline.reduce((a, t) => a + t.duration * fps, 0);
      let currentFrame = 0;

      setProgressLabel('Génération de la vidéo...');

      for (const segment of timeline) {
        const segFrames = segment.duration * fps;

        for (let f = 0; f < segFrames; f++) {
          const segProgress = f / segFrames;

          if (segment.type === 'intro') {
            drawTextSlide(ctx, w, h,
              [ebookTitle],
              authorName ? [`par ${authorName}`] : [],
              segProgress
            );
          } else if (segment.type === 'outro') {
            drawTextSlide(ctx, w, h,
              ['Merci d\'avoir regardé'],
              [ebookTitle, authorName ? `par ${authorName}` : ''].filter(Boolean),
              segProgress
            );
          } else if (segment.type === 'slide' && segment.index !== undefined) {
            const slide = slides[segment.index];
            const img = images[segment.index];
            const scale = 1 + segProgress * 0.05;
            ctx.save();
            ctx.translate(w / 2, h / 2);
            ctx.scale(scale, scale);
            ctx.translate(-w / 2, -h / 2);
            drawSlide(ctx, img, w, h, showTitle ? slide.title : '', showTitle, Math.min(1, f / (fps * 0.8)));
            ctx.restore();
          }

          currentFrame++;
          await new Promise(r => setTimeout(r, 1000 / fps / 4));

          if (currentFrame % (fps * 2) === 0) {
            setProgress(20 + (currentFrame / totalFrames) * 75);
          }
        }
      }

      setProgressLabel('Finalisation...');
      recorder.stop();
      if (audioElement) {
        audioElement.pause();
      }

      const videoBlob = await videoReady;
      setProgress(100);
      setProgressLabel('Terminé !');

      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      toast.success(`Vidéo générée ! (${slides.length} chapitres, ~${totalDuration}s)`);
    } catch (err: any) {
      console.error('Video generation error:', err);
      toast.error(`Erreur: ${err.message || 'Échec de la génération'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [slides, resolution, showTitle, showIntro, showOutro, ebookTitle, authorName, audioFile, defaultDuration, totalDuration]);

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${ebookTitle.replace(/[^a-zA-Z0-9]/g, '_')}_video.webm`;
    a.click();
    toast.success('Téléchargement lancé !');
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Créateur Vidéo YouTube</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Combinez vos images de chapitres + audio pour créer une vidéo style YouTube
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Missing images alert + generator */}
      {chaptersWithoutImages.length > 0 && (
        <Card className="border-amber-300/50 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    {chaptersWithoutImages.length} chapitre(s) sans image
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Chapitres manquants : {chaptersWithoutImages.map(c => c.title).join(', ')}
                  </p>
                </div>
                <Button
                  onClick={generateMissingImages}
                  disabled={isGeneratingImages}
                  variant="default"
                  className="gap-2"
                >
                  {isGeneratingImages ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Générer les {chaptersWithoutImages.length} image(s) manquante(s)
                    </>
                  )}
                </Button>
                {isGeneratingImages && (
                  <Progress value={imageGenProgress} className="h-2" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Resolution */}
            <div className="space-y-2">
              <Label>Résolution</Label>
              <div className="flex gap-2">
                {(['1280x720', '1920x1080'] as const).map((res) => (
                  <Button
                    key={res}
                    size="sm"
                    variant={resolution === res ? 'default' : 'outline'}
                    onClick={() => setResolution(res)}
                    className="flex-1"
                  >
                    {res === '1280x720' ? '720p' : '1080p'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration per chapter */}
            <div className="space-y-2">
              <Label>Durée par chapitre : {defaultDuration}s</Label>
              <Slider
                value={[defaultDuration]}
                onValueChange={([v]) => setDefaultDuration(v)}
                min={3}
                max={30}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Durée totale estimée : ~{totalDuration}s
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="intro" checked={showIntro} onCheckedChange={(v) => setShowIntro(!!v)} />
                <Label htmlFor="intro">Intro (titre du livre)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="titles" checked={showTitle} onCheckedChange={(v) => setShowTitle(!!v)} />
                <Label htmlFor="titles">Titre sur les images</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="outro" checked={showOutro} onCheckedChange={(v) => setShowOutro(!!v)} />
                <Label htmlFor="outro">Outro (fin)</Label>
              </div>
            </div>

            {/* Audio upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Music className="h-4 w-4" /> Audio (optionnel)
              </Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="text-sm"
              />
              {audioFile && (
                <Badge variant="secondary" className="text-xs">
                  <Music className="h-3 w-3 mr-1" /> {audioFile.name}
                </Badge>
              )}
            </div>

            {/* Generate button */}
            <Button
              onClick={generateVideo}
              disabled={isGenerating || slides.length === 0}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Film className="h-4 w-4 mr-2" />
                  Générer la vidéo ({slides.length} chapitres)
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">{progressLabel}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview + Chapters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video preview */}
          {videoUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Aperçu
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" /> Télécharger
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg bg-black"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              </CardContent>
            </Card>
          )}

          {/* Chapter slides preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Image className="h-4 w-4" /> Chapitres avec images ({slides.length}/{chapters.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Aucun chapitre dans votre ebook</p>
                  <p className="text-sm mt-1">Créez d'abord des chapitres dans l'onglet Plan</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {chapters.map((ch, i) => {
                    const img = getImageForChapter(ch, i);
                    return (
                      <div key={ch.id} className={`relative group rounded-lg overflow-hidden border ${!img ? 'border-dashed border-amber-300 bg-amber-50/30 dark:bg-amber-950/20' : ''}`}>
                        {img ? (
                          <img
                            src={img.url}
                            alt={ch.title}
                            className="w-full aspect-video object-cover"
                            onError={() => handleImageError(img.url)}
                          />
                        ) : (
                          <div className="w-full aspect-video flex flex-col items-center justify-center text-amber-500 bg-muted/50">
                            <AlertCircle className="h-8 w-8 opacity-40" />
                            <span className="text-[10px] mt-1">Image manquante</span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-white text-xs font-medium truncate">{ch.title}</p>
                          {img && (
                            <Badge variant="secondary" className="text-[10px] mt-1">
                              {defaultDuration}s
                            </Badge>
                          )}
                        </div>
                        <Badge
                          className="absolute top-1 left-1 text-[10px]"
                          variant={img ? 'secondary' : 'destructive'}
                        >
                          Ch.{i + 1}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-amber-200/50 bg-amber-50/30 dark:bg-amber-950/10">
            <CardContent className="pt-4">
              <h4 className="font-medium text-sm mb-2">💡 Conseils</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Cliquez sur "Générer les images manquantes" pour créer automatiquement les images</li>
                <li>• Vous pouvez aussi générer des images dans l'onglet "Images IA" pour plus d'options</li>
                <li>• Ajoutez votre audiobook en MP3 pour une vidéo complète avec narration</li>
                <li>• La vidéo est au format WebM, convertible en MP4 avec un outil en ligne</li>
                <li>• Chaque image affichera un effet Ken Burns (léger zoom progressif)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EbookVideoCreator;
