
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Image, Download, Copy, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import PromptGenerator from './PromptGenerator';

const PromptGeneratorPage: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleGenerateImage = (prompt: string) => {
    setLoading(true);
    
    // Simuler la génération d'une image (dans une application réelle, cela appellerait une API comme DALL-E)
    setTimeout(() => {
      setGeneratedImage(`https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`);
      setLoading(false);
      toast.success("Image générée avec succès!");
    }, 2000);
  };
  
  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    // Créer un lien temporaire pour télécharger l'image
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Image téléchargée");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
            <h1 className="text-xl font-bold hidden sm:block">Générateur de Prompts d'Images</h1>
          </div>
          <div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              <Sparkles className="mr-2 h-4 w-4" />
              Nouvelle Image
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold mb-2">Générateur de Prompts d'Images IA</h1>
          <p className="text-gray-600 mb-6">
            Créez des prompts optimisés pour générer des images avec l'intelligence artificielle
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 space-y-6">
              <Tabs defaultValue="simple" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="simple">Prompt Simple</TabsTrigger>
                  <TabsTrigger value="advanced">Prompt Avancé</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="space-y-4">
                  <PromptGenerator onPromptGenerated={handleGenerateImage} />
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-primary" />
                        Prompt Avancé
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="advanced-prompt" className="text-sm font-medium">Prompt détaillé</label>
                        <Textarea
                          id="advanced-prompt"
                          placeholder="Décrivez en détail l'image que vous souhaitez générer..."
                          className="min-h-[150px]"
                        />
                      </div>
                      
                      <Button 
                        onClick={() => handleGenerateImage("Prompt avancé personnalisé")}
                        className="w-full"
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Générer l'image
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="w-full lg:w-1/2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Aperçu de l'image générée
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  {loading ? (
                    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center rounded-md">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        <p className="text-sm text-gray-500">Génération en cours...</p>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full">
                      <img 
                        src={generatedImage} 
                        alt="Image générée" 
                        className="w-full rounded-md shadow-md object-cover aspect-video"
                      />
                      <div className="mt-4 flex gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedImage)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copier URL
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleDownloadImage}>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center rounded-md">
                      <div className="flex flex-col items-center gap-2">
                        <Image className="h-12 w-12 text-gray-300" />
                        <p className="text-sm text-gray-500">Générez un prompt pour voir l'image</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGeneratorPage;
