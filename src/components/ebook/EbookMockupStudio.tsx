import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, Download, Sparkles, Monitor, BookOpen, RefreshCw, X, Image as ImageIcon, Box, Layers, Diamond } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type PoseType = 
  | 'ipad-straight' | 'ipad-tilted-left' | 'ipad-tilted-right'
  | 'ebook-floating' | 'ebook-tilted-left' | 'ebook-tilted-right'
  | 'book-3d-standing' | 'book-3d-floating' | 'book-open-flat'
  | 'kindle-straight' | 'macbook-screen' | 'iphone-stand'
  | 'multi-device' | 'book-stack';

type ViewMode = '3d' | 'transparent' | 'hd';

interface PoseOption {
  value: PoseType;
  label: string;
  icon: string;
  description: string;
  category: 'device' | 'book' | 'creative';
}

const poseOptions: PoseOption[] = [
  // Device poses
  { value: 'ipad-straight', label: 'iPad Droit', icon: '📱', description: 'iPad Pro face, vue frontale', category: 'device' },
  { value: 'ipad-tilted-left', label: 'iPad Incliné Gauche', icon: '📱↰', description: 'iPad incliné vers la gauche, angle 3/4', category: 'device' },
  { value: 'ipad-tilted-right', label: 'iPad Incliné Droit', icon: '↱📱', description: 'iPad incliné vers la droite, angle 3/4', category: 'device' },
  { value: 'kindle-straight', label: 'Kindle', icon: '📖', description: 'Kindle Paperwhite posé à plat', category: 'device' },
  { value: 'macbook-screen', label: 'MacBook Pro', icon: '💻', description: 'Écran MacBook Pro ouvert', category: 'device' },
  { value: 'iphone-stand', label: 'iPhone', icon: '📲', description: 'iPhone 15 Pro sur support', category: 'device' },
  // Book poses
  { value: 'ebook-floating', label: 'eBook Flottant', icon: '📕', description: 'Livre 3D flottant, vue de face', category: 'book' },
  { value: 'ebook-tilted-left', label: 'eBook Incliné Gauche', icon: '📗↰', description: 'Livre 3D incliné vers la gauche', category: 'book' },
  { value: 'ebook-tilted-right', label: 'eBook Incliné Droit', icon: '↱📘', description: 'Livre 3D incliné vers la droite', category: 'book' },
  { value: 'book-3d-standing', label: 'Livre Debout', icon: '📚', description: 'Livre debout avec tranche visible', category: 'book' },
  { value: 'book-3d-floating', label: 'Livre 3D Flottant', icon: '✨📕', description: 'Livre flottant avec ombre portée dramatique', category: 'book' },
  { value: 'book-open-flat', label: 'Livre Ouvert', icon: '📖', description: 'Livre ouvert à plat, vue du dessus', category: 'book' },
  // Creative
  { value: 'multi-device', label: 'Multi-Appareils', icon: '🖥️📱', description: 'Plusieurs appareils ensemble', category: 'creative' },
  { value: 'book-stack', label: 'Pile de Livres', icon: '📚📚', description: 'Couverture sur une pile de livres', category: 'creative' },
];

const viewModeConfig: Record<ViewMode, { label: string; icon: React.ReactNode; bg: string }> = {
  '3d': { label: 'Vue 3D', icon: <Box className="w-4 h-4" />, bg: 'studio' },
  'transparent': { label: 'Fond Transparent', icon: <Layers className="w-4 h-4" />, bg: 'transparent' },
  'hd': { label: 'Haute Qualité', icon: <Diamond className="w-4 h-4" />, bg: 'studio' },
};

export const EbookMockupStudio: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [mockupResult, setMockupResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPose, setSelectedPose] = useState<PoseType>('ipad-straight');
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [isDragOver, setIsDragOver] = useState(false);
  const [history, setHistory] = useState<{ url: string; pose: string; mode: string }[]>([]);
  const [poseFilter, setPoseFilter] = useState<'all' | 'device' | 'book' | 'creative'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPoses = poseFilter === 'all' ? poseOptions : poseOptions.filter(p => p.category === poseFilter);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 10 Mo)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setMockupResult(null);
      toast.success('Image chargée !');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const generateMockup = async () => {
    if (!uploadedImage) {
      toast.error("Veuillez d'abord charger une image");
      return;
    }
    setIsGenerating(true);
    toast.info('🎨 Génération du mockup en cours...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-mockup', {
        body: { imageBase64: uploadedImage, pose: selectedPose, viewMode }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.mockupUrl) {
        setMockupResult(data.mockupUrl);
        setHistory(prev => [{ url: data.mockupUrl, pose: selectedPose, mode: viewMode }, ...prev].slice(0, 10));
        toast.success('✨ Mockup généré avec succès !');
      }
    } catch (error: any) {
      console.error('Mockup error:', error);
      if (error.message?.includes('429')) toast.error('Limite atteinte. Réessayez dans quelques instants.');
      else if (error.message?.includes('402')) toast.error('Crédits épuisés.');
      else toast.error(error.message || 'Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMockup = () => {
    if (!mockupResult) return;
    const link = document.createElement('a');
    link.href = mockupResult;
    link.download = `mockup_${selectedPose}_${viewMode}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Mockup téléchargé !');
  };

  const clearImage = () => {
    setUploadedImage(null);
    setMockupResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentPose = poseOptions.find(p => p.value === selectedPose);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDgiLz48L2c+PC9zdmc+')] opacity-60" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <Monitor className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Mockup eBook Studio</h2>
            <p className="text-orange-100 text-sm">Mockups professionnels multi-poses : 3D, fond transparent, haute qualité</p>
          </div>
          <Badge className="ml-auto bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            IA Pro
          </Badge>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full">
        <TabsList className="grid grid-cols-3 h-14 bg-muted/50 p-1.5 rounded-xl">
          {Object.entries(viewModeConfig).map(([key, config]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg transition-all"
            >
              {config.icon}
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All tab contents share the same layout */}
        {Object.keys(viewModeConfig).map((mode) => (
          <TabsContent key={mode} value={mode} className="mt-5">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left: Upload & Pose Selection */}
              <div className="space-y-5">
                {/* Upload Card */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-1" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="w-5 h-5 text-orange-500" />
                      Votre couverture
                    </CardTitle>
                    <CardDescription>Glissez-déposez votre image ou cliquez pour sélectionner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileInput} className="hidden" />
                    {uploadedImage ? (
                      <div className="relative group">
                        <div className="rounded-xl overflow-hidden border-2 border-orange-200 shadow-lg">
                          <img src={uploadedImage} alt="Image uploadée" className="w-full h-auto max-h-[250px] object-contain bg-muted/30" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearImage}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Changer
                        </Button>
                      </div>
                    ) : (
                      <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all min-h-[200px] ${
                          isDragOver ? 'border-orange-500 bg-orange-50 scale-[1.02]' : 'border-orange-300 bg-orange-50/30 hover:border-orange-400 hover:bg-orange-50/60'
                        }`}>
                        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                          <Upload className="w-7 h-7 text-orange-400" />
                        </div>
                        <p className="font-semibold text-foreground">Déposer votre image ici</p>
                        <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP • Max 10 Mo</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pose Selection Card */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-1" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Box className="w-5 h-5 text-violet-500" />
                      Pose & Angle
                    </CardTitle>
                    <CardDescription>
                      {mode === '3d' && 'Rendu 3D réaliste avec ombres et profondeur'}
                      {mode === 'transparent' && 'Fond transparent, idéal pour vos visuels marketing'}
                      {mode === 'hd' && 'Qualité maximale, résolution ultra-haute'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Category Filter */}
                    <div className="flex gap-1.5">
                      {(['all', 'device', 'book', 'creative'] as const).map(cat => (
                        <button key={cat} onClick={() => setPoseFilter(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            poseFilter === cat
                              ? 'bg-violet-500 text-white shadow-md'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}>
                          {cat === 'all' ? 'Tout' : cat === 'device' ? '📱 Appareils' : cat === 'book' ? '📕 Livres' : '✨ Créatif'}
                        </button>
                      ))}
                    </div>

                    {/* Pose Grid */}
                    <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {filteredPoses.map(pose => (
                        <button key={pose.value} onClick={() => setSelectedPose(pose.value)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            selectedPose === pose.value
                              ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-300 shadow-sm'
                              : 'border-border bg-background hover:border-violet-300 hover:bg-violet-50/30'
                          }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{pose.icon}</span>
                            <span className="font-medium text-sm text-foreground">{pose.label}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{pose.description}</p>
                        </button>
                      ))}
                    </div>

                    {/* Generate Button */}
                    <Button onClick={generateMockup} disabled={isGenerating || !uploadedImage}
                      className="w-full h-14 text-base font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white shadow-xl shadow-orange-500/25 transition-all"
                      size="lg">
                      {isGenerating ? (
                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Génération en cours...</>
                      ) : (
                        <><Sparkles className="h-5 w-5 mr-2" />Générer {currentPose?.label} — {viewModeConfig[viewMode].label}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Result */}
              <div className="space-y-5">
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-emerald-500" />
                      Résultat — {viewModeConfig[viewMode].label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockupResult ? (
                      <div className="space-y-4">
                        <div className={`rounded-xl overflow-hidden border shadow-lg ${
                          viewMode === 'transparent'
                            ? 'bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]'
                            : 'bg-muted/20'
                        }`}>
                          <img src={mockupResult} alt="Mockup généré" className="w-full h-auto" />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={downloadMockup} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PNG
                          </Button>
                          <Button onClick={generateMockup} variant="outline" disabled={isGenerating} className="border-2">
                            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                            Regénérer
                          </Button>
                        </div>
                        {viewMode === 'transparent' && (
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <strong>Fond transparent</strong> — Idéal pour pages de vente et réseaux sociaux
                            </p>
                          </div>
                        )}
                        {viewMode === 'hd' && (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-700 flex items-center gap-1.5">
                              <Diamond className="w-3.5 h-3.5" />
                              <strong>Haute Qualité</strong> — Résolution maximale pour impression et grand format
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-2xl h-[380px] flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 to-emerald-50/20">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                          {viewMode === '3d' ? <Box className="w-10 h-10 text-emerald-300" /> :
                           viewMode === 'transparent' ? <Layers className="w-10 h-10 text-emerald-300" /> :
                           <Diamond className="w-10 h-10 text-emerald-300" />}
                        </div>
                        <p className="text-muted-foreground font-medium">{viewModeConfig[viewMode].label}</p>
                        <p className="text-xs text-muted-foreground mt-2 text-center px-6">
                          Uploadez une image, choisissez une pose et cliquez "Générer"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* History */}
                {history.length > 1 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        Historique ({history.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {history.map((item, idx) => (
                          <button key={idx} onClick={() => setMockupResult(item.url)}
                            className="flex-shrink-0 rounded-lg overflow-hidden border-2 border-border hover:border-orange-400 transition-all hover:scale-105 shadow-sm"
                            style={{ width: '70px', height: '70px' }}>
                            <img src={item.url} alt={`Mockup ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
