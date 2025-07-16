import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Loader, RefreshCw, Search, ImageOff, Sparkles, ExternalLink, AlertCircle, Camera, Wand2, Sliders } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { generateImage, generateImageMock, getCuratedPexelsImages, searchPexelsAPI } from '@/services/imageGeneratorService';
import { PexelsResponse, PexelsPhoto } from '@/types/imageGenerator';
import PromptGenerator from './PromptGenerator';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'>('512x512');
  const [apiKey, setApiKey] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [pexelsResults, setPexelsResults] = useState<PexelsPhoto[]>([]);
  const [pexelsQuery, setPexelsQuery] = useState('');
  const [pexelsLoading, setPexelsLoading] = useState(false);
  
  // Nouveaux paramètres
  const [model, setModel] = useState<'dall-e-2' | 'dall-e-3'>('dall-e-3');
  const [quality, setQuality] = useState<'standard' | 'hd'>('hd');
  const [style, setStyle] = useState<'vivid' | 'natural'>('vivid');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  // Ajout de useEffect pour charger la clé API depuis le localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      toast.success('Clé API OpenAI chargée');
    }
  }, []);

  // Mise à jour du gestionnaire pour sauvegarder la clé API
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    if (newApiKey.startsWith('sk-')) {
      localStorage.setItem('openai_api_key', newApiKey);
      toast.success('Clé API OpenAI sauvegardée');
    }
  };

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

      if (apiKey?.startsWith('sk-')) {
        imageUrl = await generateImage(prompt, size, apiKey, model, quality, style);
        toast.success('Image générée avec DALL-E en haute qualité');
      } else {
        toast.warning('Pas de clé API valide - utilisation du mode démo');
        imageUrl = await generateImageMock(prompt, size);
      }

      setGeneratedImageUrl(imageUrl);
      
      // Sauvegarder le prompt dans l'historique
      setGeneratedPrompts(prev => 
        [prompt, ...prev.filter(p => p !== prompt)].slice(0, 10)
      );
    } catch (err) {
      console.error('Erreur de génération:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération de l\'image';
      setError(errorMessage);
      toast.error(errorMessage);
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

  // Nouveaux gestionnaires
  const handleSelectPromptFromHistory = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    toast.success('Prompt sélectionné dans l\'historique');
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
                <div className="flex gap-2">
                  <Input
                    id="prompt"
                    placeholder="ex: Une forêt enchantée avec des lucioles et un ruisseau qui serpente, style aquarelle"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("prompt")}
                    title="Générer un prompt avec l'assistant"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="size" className="text-sm font-medium">Taille de l'image</label>
                <Select value={size} onValueChange={(value) => setSize(value as any)}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Sélectionnez une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256x256">Petite (256x256)</SelectItem>
                    <SelectItem value="512x512">Moyenne (512x512)</SelectItem>
                    <SelectItem value="1024x1024">Grande (1024x1024)</SelectItem>
                    <SelectItem value="1792x1024">Paysage (1792x1024)</SelectItem>
                    <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full"
              >
                <Sliders className="h-4 w-4 mr-2" />
                {showAdvancedOptions ? 'Masquer les options avancées' : 'Afficher les options avancées'}
              </Button>

              {showAdvancedOptions && (
                <div className="p-4 border rounded-md space-y-4 bg-gray-50">
                  <div className="space-y-2">
                    <label htmlFor="model" className="text-sm font-medium">Modèle IA</label>
                    <Select value={model} onValueChange={(value) => setModel(value as 'dall-e-2' | 'dall-e-3')}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Sélectionnez un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dall-e-2">DALL-E 2 (Standard)</SelectItem>
                        <SelectItem value="dall-e-3">DALL-E 3 (Avancé)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      DALL-E 3 offre des images plus détaillées et créatives que DALL-E 2.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="quality" className="text-sm font-medium">Qualité d'image</label>
                    <Select value={quality} onValueChange={(value) => setQuality(value as 'standard' | 'hd')}>
                      <SelectTrigger id="quality">
                        <SelectValue placeholder="Sélectionnez la qualité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="hd">Haute définition (HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="style" className="text-sm font-medium">Style d'image</label>
                    <Select value={style} onValueChange={(value) => setStyle(value as 'vivid' | 'natural')}>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Sélectionnez un style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vivid">Vivid (Couleurs éclatantes)</SelectItem>
                        <SelectItem value="natural">Natural (Couleurs naturelles)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium flex items-center justify-between">
                  Clé API OpenAI
                  <span className="text-xs text-blue-600 hover:underline cursor-help">
                    Commence par "sk-"
                  </span>
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  Votre clé API est stockée localement et n'est jamais partagée.
                  {!apiKey?.startsWith('sk-') && " Sans clé API valide, des images de démonstration seront utilisées."}
                </p>
              </div>

              {generatedPrompts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Historique des prompts</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
                    {generatedPrompts.slice(0, 5).map((historyPrompt, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectPromptFromHistory(historyPrompt)}
                        className="truncate max-w-[200px]"
                      >
                        {historyPrompt.length > 20 ? historyPrompt.substring(0, 20) + '...' : historyPrompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!apiKey && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Mode démo</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Sans clé API OpenAI, l'application affichera des images de démonstration. Pour de vrais résultats de génération IA, ajoutez votre clé API.
                  </AlertDescription>
                </Alert>
              )}

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
                    <Camera className="mr-2 h-4 w-4" />
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
