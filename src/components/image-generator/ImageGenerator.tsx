
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader, RefreshCw, Search, ImageOff, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { generateImage, generateImageMock, getCuratedPexelsImages, searchPexelsAPI } from '@/services/imageGeneratorService';
import { PexelsResponse, PexelsPhoto } from '@/types/imageGenerator';
import PromptGenerator from './PromptGenerator';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'256x256' | '512x512' | '1024x1024'>('512x512');
  const [apiKey, setApiKey] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [pexelsResults, setPexelsResults] = useState<PexelsPhoto[]>([]);
  const [pexelsQuery, setPexelsQuery] = useState('');
  const [pexelsLoading, setPexelsLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) {
      toast.error('Veuillez entrer un prompt pour générer une image');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      let imageUrl: string;

      if (apiKey) {
        imageUrl = await generateImage(prompt, size, apiKey);
      } else {
        // Utilisation du mode mock si pas de clé API
        imageUrl = await generateImageMock(prompt, size);
      }

      setGeneratedImageUrl(imageUrl);
      toast.success('Image générée avec succès');
    } catch (err) {
      console.error('Erreur de génération:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération de l\'image');
      toast.error('Erreur: ' + (err instanceof Error ? err.message : 'Échec de la génération d\'image'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImageUrl) {
      const a = document.createElement('a');
      a.href = generatedImageUrl;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Téléchargement démarré');
    }
  };

  const handleSearchPexels = async () => {
    if (!pexelsQuery && activeTab === 'search') {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }

    setPexelsLoading(true);
    try {
      let response: PexelsResponse;
      
      if (pexelsQuery) {
        response = await searchPexelsAPI(pexelsQuery);
      } else {
        response = await getCuratedPexelsImages();
      }
      
      setPexelsResults(response.photos);
      
      if (response.photos.length === 0) {
        toast.info('Aucun résultat trouvé');
      } else {
        toast.success(`${response.photos.length} images trouvées`);
      }
    } catch (err) {
      console.error('Erreur de recherche Pexels:', err);
      toast.error('Erreur lors de la recherche d\'images');
    } finally {
      setPexelsLoading(false);
    }
  };

  const handleSelectPexelsImage = (photo: PexelsPhoto) => {
    setGeneratedImageUrl(photo.src.large);
    toast.success('Image sélectionnée');
  };

  const handlePromptGenerated = (generatedPrompt: string) => {
    setPrompt(generatedPrompt);
    setActiveTab('generate');
  };

  React.useEffect(() => {
    // Charger des images à la une au chargement initial
    const loadCuratedImages = async () => {
      setPexelsLoading(true);
      try {
        const response = await getCuratedPexelsImages();
        setPexelsResults(response.photos);
      } catch (err) {
        console.error('Erreur de chargement des images:', err);
      } finally {
        setPexelsLoading(false);
      }
    };

    loadCuratedImages();
  }, []);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="generate" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Génération IA</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>Recherche</span>
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            <span>Prompts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Générer une image avec IA</CardTitle>
              <CardDescription>
                Générez des images uniques à partir de descriptions textuelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium">Description de l'image</label>
                <Input
                  id="prompt"
                  placeholder="ex: Une forêt enchantée avec des lucioles et un ruisseau qui serpente, style aquarelle"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="size" className="text-sm font-medium">Taille de l'image</label>
                <Select value={size} onValueChange={(value) => setSize(value as '256x256' | '512x512' | '1024x1024')}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Sélectionnez une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256x256">Petite (256x256)</SelectItem>
                    <SelectItem value="512x512">Moyenne (512x512)</SelectItem>
                    <SelectItem value="1024x1024">Grande (1024x1024)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">Clé API OpenAI (optionnel)</label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Sans clé API, une image de démonstration sera utilisée.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerateImage}
                disabled={loading || !prompt}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer l'image
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 p-3 rounded border border-red-200 text-red-700 text-sm">
                  <p className="font-medium">Erreur:</p>
                  <p>{error}</p>
                </div>
              )}

              {generatedImageUrl && (
                <div className="relative rounded-md overflow-hidden border">
                  <img
                    src={generatedImageUrl}
                    alt="Image générée par IA"
                    className="w-full h-auto object-contain"
                    onError={() => {
                      setError('Erreur lors du chargement de l\'image');
                      setGeneratedImageUrl(null);
                    }}
                  />
                  <div className="absolute bottom-0 right-0 p-2">
                    <Button size="sm" variant="secondary" onClick={handleDownloadImage}>
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setPrompt('')}>
                Effacer
              </Button>
              <Button variant="outline" onClick={handleGenerateImage} disabled={loading || !prompt}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Régénérer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Recherche d'images</CardTitle>
              <CardDescription>
                Recherchez des images gratuites sur Pexels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Recherchez une image..."
                  value={pexelsQuery}
                  onChange={(e) => setPexelsQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchPexels()}
                />
                <Button onClick={handleSearchPexels} disabled={pexelsLoading}>
                  {pexelsLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pexelsResults.length > 0 ? (
                  pexelsResults.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative rounded-md overflow-hidden cursor-pointer border hover:opacity-90 transition-opacity"
                      onClick={() => handleSelectPexelsImage(photo)}
                    >
                      <img
                        src={photo.src.medium}
                        alt={photo.alt}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-end p-2">
                        <p className="text-white text-xs opacity-0 hover:opacity-100 truncate">
                          {photo.alt || 'Image Pexels'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : pexelsLoading ? (
                  <div className="col-span-full flex justify-center items-center h-48">
                    <Loader className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="col-span-full flex flex-col justify-center items-center h-48 text-gray-500">
                    <ImageOff className="h-12 w-12 mb-2" />
                    <p>Aucune image trouvée</p>
                    <p className="text-sm">Essayez une autre recherche</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <a href="https://www.pexels.com/fr-fr/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visiter Pexels
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="prompt">
          <PromptGenerator onPromptGenerated={handlePromptGenerated} />
        </TabsContent>
      </Tabs>

      {generatedImageUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Image générée</h3>
          <div className="relative rounded-lg overflow-hidden border">
            <img
              src={generatedImageUrl}
              alt="Image générée"
              className="w-full h-auto"
            />
            <div className="absolute bottom-4 right-4">
              <Button onClick={handleDownloadImage}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
