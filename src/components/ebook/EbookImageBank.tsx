import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Image, 
  Sparkles, 
  Search, 
  Download, 
  Plus,
  Wand2,
  Palette,
  Camera,
  BookOpen
} from 'lucide-react';

interface EbookImageBankProps {
  onImageSelect: (imageUrl: string, title: string) => void;
  ebookTitle: string;
  chapters: Array<{ title: string; content?: string }>;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  isGenerating?: boolean;
}

const EbookImageBank: React.FC<EbookImageBankProps> = ({ 
  onImageSelect, 
  ebookTitle, 
  chapters 
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [stockImages, setStockImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [runwareApiKey, setRunwareApiKey] = useState('');

  // Suggestions d'images basées sur le contenu de l'ebook
  const getImageSuggestions = () => {
    const suggestions = [
      `Couverture pour "${ebookTitle}"`,
      `Illustration pour livre "${ebookTitle}"`,
      'Graphiques et diagrammes professionnels',
      'Icônes et illustrations minimalistes',
      'Arrière-plans élégants pour présentation'
    ];

    if (chapters.length > 0) {
      chapters.slice(0, 3).forEach(chapter => {
        suggestions.push(`Illustration pour "${chapter.title}"`);
      });
    }

    return suggestions;
  };

  // Génération d'images avec l'IA
  const generateImageWithAI = async (prompt: string) => {
    if (!runwareApiKey.trim()) {
      toast.error('Veuillez entrer votre clé API Runware');
      return;
    }

    const tempId = Date.now().toString();
    const tempImage: GeneratedImage = {
      id: tempId,
      url: '',
      prompt,
      isGenerating: true
    };

    setGeneratedImages(prev => [tempImage, ...prev]);
    setIsGenerating(true);

    try {
      // Connexion WebSocket et génération d'image
      const ws = new WebSocket('wss://ws-api.runware.ai/v1');
      
      ws.onopen = () => {
        // Authentification
        const authMessage = [{
          taskType: "authentication",
          apiKey: runwareApiKey
        }];
        ws.send(JSON.stringify(authMessage));
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          console.log('WebSocket response:', response);
          
          if (response.error || response.errors) {
            console.error('API Error:', response);
            toast.error(response.errorMessage || 'Erreur API');
            setGeneratedImages(prev => prev.filter(img => img.id !== tempId));
            setIsGenerating(false);
            ws.close();
            return;
          }
          
          if (response.data) {
            response.data.forEach((item: any) => {
              if (item.taskType === "authentication") {
                console.log('Authentication successful');
                // Authentification réussie, envoyer la demande de génération
                const generateMessage = [{
                  taskType: "imageInference",
                  taskUUID: tempId,
                  positivePrompt: prompt,
                  model: "runware:100@1",
                  width: 1024,
                  height: 1024,
                  numberResults: 1,
                  outputFormat: "WEBP",
                  CFGScale: 1,
                  scheduler: "FlowMatchEulerDiscreteScheduler",
                  steps: 4
                }];
                console.log('Sending generation request:', generateMessage);
                ws.send(JSON.stringify(generateMessage));
              } else if (item.taskType === "imageInference" && item.taskUUID === tempId) {
                console.log('Image generated:', item);
                // Image générée avec succès
                if (item.imageURL) {
                  setGeneratedImages(prev => 
                    prev.map(img => 
                      img.id === tempId 
                        ? { ...img, url: item.imageURL, isGenerating: false }
                        : img
                    )
                  );
                  toast.success('Image générée avec succès !');
                } else {
                  toast.error('Erreur: URL d\'image manquante');
                  setGeneratedImages(prev => prev.filter(img => img.id !== tempId));
                }
                setIsGenerating(false);
                ws.close();
              }
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          toast.error('Erreur de communication');
          setGeneratedImages(prev => prev.filter(img => img.id !== tempId));
          setIsGenerating(false);
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Erreur de connexion WebSocket');
        setGeneratedImages(prev => prev.filter(img => img.id !== tempId));
        setIsGenerating(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        if (!event.wasClean) {
          toast.error('Connexion fermée de manière inattendue');
          setGeneratedImages(prev => prev.filter(img => img.id !== tempId));
          setIsGenerating(false);
        }
      };

    } catch (error) {
      toast.error('Erreur lors de la génération de l\'image');
      setGeneratedImages(prev => prev.filter(img => img.id !== tempId));
    } finally {
      setIsGenerating(false);
    }
  };

  // Recherche d'images dans Unsplash
  const searchStockImages = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Simulation d'une recherche d'images stock
      // Dans un vrai projet, vous utiliseriez l'API Unsplash
      const mockImages = [
        {
          id: '1',
          urls: { regular: `https://picsum.photos/400/300?random=1&query=${encodeURIComponent(query)}` },
          alt_description: `Image de ${query}`,
          user: { name: 'Unsplash' }
        },
        {
          id: '2',
          urls: { regular: `https://picsum.photos/400/300?random=2&query=${encodeURIComponent(query)}` },
          alt_description: `Photo de ${query}`,
          user: { name: 'Unsplash' }
        },
        {
          id: '3',
          urls: { regular: `https://picsum.photos/400/300?random=3&query=${encodeURIComponent(query)}` },
          alt_description: `Illustration de ${query}`,
          user: { name: 'Unsplash' }
        }
      ];

      setStockImages(mockImages);
      toast.success(`${mockImages.length} images trouvées !`);
    } catch (error) {
      toast.error('Erreur lors de la recherche d\'images');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card glow-effect border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="gradient-primary bg-clip-text text-transparent">
              🎨 Banque d'Images IA
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai-generation" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-generation" className="text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Génération IA
              </TabsTrigger>
              <TabsTrigger value="stock-search" className="text-sm">
                <Search className="w-4 h-4 mr-2" />
                Images Stock
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="text-sm">
                <Wand2 className="w-4 h-4 mr-2" />
                Suggestions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-generation" className="space-y-4">
              {!runwareApiKey && (
                <div className="p-4 bg-gradient-accent rounded-xl text-white">
                  <div className="space-y-2">
                    <Label htmlFor="runware-key" className="text-white font-medium">
                      Clé API Runware (gratuite)
                    </Label>
                    <Input
                      id="runware-key"
                      type="password"
                      placeholder="Entrez votre clé API Runware"
                      value={runwareApiKey}
                      onChange={(e) => setRunwareApiKey(e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                    <p className="text-sm text-white/80">
                      Obtenez votre clé gratuite sur{' '}
                      <a 
                        href="https://runware.ai" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-white"
                      >
                        runware.ai
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="ai-prompt">Décrivez l'image que vous souhaitez générer</Label>
                <div className="flex gap-2">
                  <Input
                    id="ai-prompt"
                    placeholder="Ex: Une illustration moderne pour un livre sur le développement personnel"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Button 
                    onClick={() => generateImageWithAI(aiPrompt)}
                    disabled={isGenerating || !aiPrompt.trim() || !runwareApiKey}
                    className="btn-gradient shrink-0"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                </div>
              </div>

              {generatedImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {image.isGenerating ? (
                          <div className="flex flex-col items-center gap-2">
                            <Palette className="w-8 h-8 text-purple-500 animate-spin" />
                            <p className="text-sm text-gray-600">Génération en cours...</p>
                          </div>
                        ) : image.url ? (
                          <img 
                            src={image.url} 
                            alt={image.prompt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.prompt}</p>
                        {image.url && (
                          <Button 
                            size="sm" 
                            onClick={() => onImageSelect(image.url, image.prompt)}
                            className="w-full gradient-primary text-white"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Ajouter à l'ebook
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stock-search" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="search-query">Rechercher des images</Label>
                <div className="flex gap-2">
                  <Input
                    id="search-query"
                    placeholder="Ex: business, nature, technology..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    onClick={() => searchStockImages(searchQuery)}
                    disabled={isSearching || !searchQuery.trim()}
                    className="gradient-secondary text-white shrink-0"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>

              {stockImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stockImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video">
                        <img 
                          src={image.urls.regular} 
                          alt={image.alt_description}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-600 mb-2">{image.alt_description}</p>
                        <Button 
                          size="sm" 
                          onClick={() => onImageSelect(image.urls.regular, image.alt_description)}
                          className="w-full gradient-secondary text-white"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Ajouter à l'ebook
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Suggestions basées sur votre ebook :</h3>
                <div className="flex flex-wrap gap-2">
                  {getImageSuggestions().map((suggestion, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="cursor-pointer hover:bg-purple-50 border-purple-200"
                      onClick={() => setAiPrompt(suggestion)}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Cliquez sur une suggestion pour l'utiliser comme prompt de génération
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookImageBank;