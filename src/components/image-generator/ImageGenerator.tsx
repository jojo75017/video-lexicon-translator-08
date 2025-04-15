
import React, { useState } from 'react';
import { Wand2, Download, Loader2, ImagePlus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { generateImage } from '@/services/imageGeneratorService';

interface GeneratedImage {
  url: string;
  prompt: string;
  date: Date;
}

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'256x256' | '512x512' | '1024x1024'>('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [apiKey, setApiKey] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description pour l'image");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Veuillez entrer votre clé API OpenAI");
      return;
    }

    setIsGenerating(true);

    try {
      const imageUrl = await generateImage(prompt, size, apiKey);
      
      const newImage = {
        url: imageUrl,
        prompt,
        date: new Date()
      };
      
      setGeneratedImage(newImage);
      setGeneratedImages(prev => [newImage, ...prev].slice(0, 8));
      toast.success("Image générée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la génération de l'image:", error);
      toast.error("Erreur lors de la génération de l'image. Vérifiez votre clé API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `dalle-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Image téléchargée");
  };

  const handleClearPrompt = () => {
    setPrompt('');
  };

  const selectPreviousImage = (image: GeneratedImage) => {
    setGeneratedImage(image);
    setPrompt(image.prompt);
    toast.info("Image précédente sélectionnée");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <Label htmlFor="apiKey">Clé API OpenAI</Label>
              <Input 
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Votre clé API reste dans votre navigateur et n'est pas stockée sur nos serveurs.
              </p>
            </div>

            <div>
              <Label htmlFor="prompt">Description de l'image</Label>
              <Textarea 
                id="prompt" 
                placeholder="Décrivez l'image que vous souhaitez générer en détail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  {prompt.length} caractères
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearPrompt}
                  disabled={!prompt}
                >
                  Effacer
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="size">Taille de l'image</Label>
              <Select value={size} onValueChange={(value: '256x256' | '512x512' | '1024x1024') => setSize(value)}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Choisir une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="256x256">Petite (256x256)</SelectItem>
                  <SelectItem value="512x512">Moyenne (512x512)</SelectItem>
                  <SelectItem value="1024x1024">Grande (1024x1024)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Générer l'image
                </>
              )}
            </Button>
          </Card>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Images précédentes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {generatedImages.map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square overflow-hidden rounded-md border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => selectPreviousImage(img)}
                >
                  <img 
                    src={img.url} 
                    alt={`Generated ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {generatedImages.length === 0 && (
                <div className="col-span-4 h-24 flex items-center justify-center text-gray-500 border rounded-md">
                  Aucune image générée
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-medium">Aperçu de l'image</h3>
            {generatedImage ? (
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={generatedImage.url} 
                    alt="Generated image"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-700 italic">{generatedImage.prompt}</p>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleGenerate()}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regénérer
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center">
                <ImagePlus className="h-16 w-16 text-gray-400" />
                <p className="mt-4 text-gray-500 text-center p-4">
                  Entrez une description et cliquez sur "Générer l'image" pour créer une nouvelle image
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
