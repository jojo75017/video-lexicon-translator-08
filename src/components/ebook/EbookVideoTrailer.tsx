import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Video, Download, Play, Pause, RefreshCw, Sparkles, Film, Smartphone, Monitor, Square } from 'lucide-react';

interface EbookVideoTrailerProps {
  ebookTitle: string;
  bookSummary?: string;
  coverImage?: string;
}

const EbookVideoTrailer: React.FC<EbookVideoTrailerProps> = ({
  ebookTitle,
  bookSummary,
  coverImage
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<5 | 10>(5);
  const [clipType, setClipType] = useState<'teaser' | 'highlights' | 'cta' | 'mystery'>('teaser');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedClips, setGeneratedClips] = useState<Array<{id: string; url: string; type: string; format: string}>>([]);

  const clipTypes = [
    { id: 'teaser', label: '🎬 Teaser Mystère', description: 'Ambiance mystérieuse pour susciter la curiosité' },
    { id: 'highlights', label: '✨ Points Clés', description: 'Les moments forts de votre livre' },
    { id: 'cta', label: '🎯 Call-to-Action', description: 'Incitation à l\'achat avec urgence' },
    { id: 'mystery', label: '🔮 Atmosphérique', description: 'Ambiance immersive et cinématique' },
  ];

  const formatOptions = [
    { id: '16:9', label: 'YouTube / Web', icon: Monitor, description: '1920x1080' },
    { id: '9:16', label: 'TikTok / Reels', icon: Smartphone, description: '1080x1920' },
    { id: '1:1', label: 'Instagram / FB', icon: Square, description: '1080x1080' },
  ];

  const generatePrompt = () => {
    const basePrompts = {
      teaser: `Cinematic book trailer: Dark, mysterious atmosphere with floating text "${ebookTitle}" emerging from shadows. Dramatic lighting, slow camera movement, suspenseful mood. Professional book promotion style.`,
      highlights: `Dynamic book trailer: Bright, energetic visuals showcasing key themes. Text "${ebookTitle}" with bold typography. Fast cuts, inspiring mood, motivational feel.`,
      cta: `Compelling book advertisement: Eye-catching visuals with "${ebookTitle}" prominently displayed. Urgent, exciting atmosphere with call-to-action energy. Professional marketing style.`,
      mystery: `Atmospheric book teaser: Ethereal, dreamlike visuals with soft particles and light rays. "${ebookTitle}" appears elegantly. Immersive, artistic cinematography.`
    };

    return customPrompt || basePrompts[clipType];
  };

  const handleGenerateVideo = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez d\'abord définir un titre pour votre ebook');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress during generation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 85));
      }, 1000);

      toast.info('🎬 Génération du trailer en cours... (30-60 secondes)');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video-trailer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          prompt: generatePrompt(),
          aspectRatio: selectedFormat,
          duration: duration,
          ebookTitle,
          bookSummary,
          coverImage,
          clipType
        }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }
      
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setGeneratedClips(prev => [...prev, {
          id: Date.now().toString(),
          url: data.videoUrl,
          type: clipType,
          format: selectedFormat
        }]);
        setProgress(100);
        toast.success('🎬 Trailer vidéo généré avec succès !');
      } else if (data.status === 'pending') {
        toast.info('Vidéo en cours de génération. Veuillez patienter...');
        setProgress(50);
      } else {
        throw new Error('Aucune URL vidéo retournée');
      }
    } catch (error) {
      console.error('Erreur génération vidéo:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération de la vidéo');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ebookTitle.replace(/\s+/g, '-')}-trailer-${selectedFormat}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Vidéo téléchargée !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleGenerateMultiClips = async () => {
    toast.info('Génération de 4 clips en cours...');
    
    for (const clip of clipTypes) {
      setClipType(clip.id as any);
      await handleGenerateVideo();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    toast.success('🎬 Pack de 4 clips généré !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>🎬 Générateur de Trailer Vidéo</span>
              <Badge className="ml-3 bg-gradient-to-r from-amber-500 to-orange-500">2026</Badge>
            </div>
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Créez des vidéos promotionnelles de 5-10 secondes optimisées pour TikTok, Instagram Reels et YouTube Shorts
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Configuration du Trailer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">📐 Format Vidéo</label>
              <div className="grid grid-cols-3 gap-3">
                {formatOptions.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                        : 'border-border hover:border-purple-300'
                    }`}
                  >
                    <format.icon className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">{format.label}</p>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className="text-sm font-medium">⏱️ Durée</label>
              <div className="flex gap-3">
                <Button
                  variant={duration === 5 ? 'default' : 'outline'}
                  onClick={() => setDuration(5)}
                  className="flex-1"
                >
                  5 secondes
                </Button>
                <Button
                  variant={duration === 10 ? 'default' : 'outline'}
                  onClick={() => setDuration(10)}
                  className="flex-1"
                >
                  10 secondes
                </Button>
              </div>
            </div>

            {/* Clip Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium">🎭 Type de Clip</label>
              <Select value={clipType} onValueChange={(v) => setClipType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clipTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex flex-col">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-3">
              <label className="text-sm font-medium">✏️ Prompt Personnalisé (optionnel)</label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Décrivez votre vision pour la vidéo..."
                rows={3}
              />
            </div>

            {/* Progress */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Génération en cours...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !ebookTitle}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Générer le Trailer
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateMultiClips}
                disabled={isGenerating}
              >
                <Film className="h-4 w-4 mr-2" />
                Pack 4 Clips
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              Aperçu Vidéo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className={`relative bg-black rounded-xl overflow-hidden flex items-center justify-center ${
                selectedFormat === '16:9' ? 'aspect-video' :
                selectedFormat === '9:16' ? 'aspect-[9/16] max-h-[500px]' :
                'aspect-square'
              }`}
            >
              {videoUrl ? (
                <>
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    autoPlay={isPlaying}
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Votre trailer apparaîtra ici</p>
                  <p className="text-sm mt-2">Format: {selectedFormat} • {duration}s</p>
                </div>
              )}
            </div>

            {/* Generated Clips History */}
            {generatedClips.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Clips Générés ({generatedClips.length})</h4>
                <div className="grid grid-cols-2 gap-3">
                  {generatedClips.slice(-4).map((clip) => (
                    <div key={clip.id} className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{clip.type}</Badge>
                        <span className="text-xs text-muted-foreground">{clip.format}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setVideoUrl(clip.url)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">💡 Conseils pour des trailers efficaces</h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• <strong>TikTok/Reels :</strong> Utilisez le format 9:16 pour un affichage plein écran</li>
            <li>• <strong>Multi-clips :</strong> Créez 4 versions différentes pour tester ce qui fonctionne le mieux</li>
            <li>• <strong>Hook :</strong> Les 3 premières secondes sont cruciales pour capter l'attention</li>
            <li>• <strong>CTA :</strong> Terminez toujours par un appel à l'action clair</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookVideoTrailer;
