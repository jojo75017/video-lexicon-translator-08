
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Video, Upload, Mic, Volume2, Languages, FileVideo } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TranslationPage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('url');
  
  // Debug component mount
  useEffect(() => {
    console.log("TranslationPage component mounted");
    document.title = "Traduction Vidéo | SEO-GPT";
    
    // Vérifier si la page se charge correctement
    toast.info("Page de traduction vidéo chargée", {
      duration: 2000
    });
  }, []);

  const handleTranslate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl) {
      toast.error("Veuillez entrer une URL de vidéo");
      return;
    }
    
    setIsLoading(true);
    toast.info("Génération de la traduction en cours...", {
      duration: 3000
    });
    
    console.log("Starting translation for video:", videoUrl);
    
    // Simulated subtitle generation (in a real app, you would fetch these from an API)
    setTimeout(() => {
      const mockSubtitles = [
        { startTime: 0, endTime: 3, text: "Hello and welcome to this tutorial.", translation: "Bonjour et bienvenue dans ce tutoriel." },
        { startTime: 3, endTime: 6, text: "Today we'll learn about language translation.", translation: "Aujourd'hui, nous allons apprendre la traduction linguistique." },
        { startTime: 6, endTime: 10, text: "This is a powerful tool for global communication.", translation: "C'est un outil puissant pour la communication mondiale." },
        { startTime: 10, endTime: 15, text: "Let's see how it works with this example.", translation: "Voyons comment cela fonctionne avec cet exemple." }
      ];
      
      setSubtitles(mockSubtitles);
      setIsLoading(false);
      console.log("Translation generated, subtitles:", mockSubtitles.length);
      toast.success("Traduction générée avec succès !");
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File uploaded:", file?.name);
    
    if (file) {
      // Create an object URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      console.log("Created object URL:", objectUrl);
      setVideoUrl(objectUrl);
      toast.success(`Fichier "${file.name}" chargé avec succès`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold tracking-tight">Traducteur Vidéo & Audio</h1>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Traduction Audio/Vidéo</h2>
            <p className="text-gray-600">
              Convertissez vos contenus vidéo et audio de l'anglais vers le français avec notre outil de traduction IA.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Source du média</CardTitle>
              <CardDescription>
                Choisissez une URL ou téléchargez un fichier vidéo/audio à traduire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    URL de la vidéo
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Télécharger un fichier
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="url">
                  <form onSubmit={handleTranslate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-url">URL de la vidéo</Label>
                      <Input 
                        id="video-url" 
                        type="url" 
                        placeholder="https://example.com/video.mp4" 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Entrez l'URL d'une vidéo MP4, WebM ou autre format compatible
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isLoading || !videoUrl}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isLoading ? "Génération de la traduction..." : "Traduire la vidéo"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="upload">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Fichier vidéo ou audio</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <FileVideo className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                          >
                            <span>Télécharger un fichier</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="video/*,audio/*"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="mt-1 text-xs text-gray-500">
                            MP4, WebM, MP3, WAV jusqu'à 100MB
                          </p>
                        </div>
                      </div>
                    </div>
                    {videoUrl && videoUrl.startsWith('blob:') && (
                      <Button 
                        onClick={handleTranslate} 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isLoading ? "Génération de la traduction..." : "Traduire le fichier"}
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {!process.env.ELEVEN_LABS_API_KEY && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    La clé API ElevenLabs n'est pas configurée. La traduction vocale ne sera pas disponible.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {videoUrl && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu et traduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <VideoPlayer 
                      videoUrl={videoUrl} 
                      subtitles={subtitles}
                      language="fr" 
                      showSubtitles={true}
                    />
                    
                    {subtitles.length > 0 && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Volume2 className="mr-2 h-4 w-4" />
                          Traduction audio générée
                        </h3>
                        <div className="space-y-2">
                          {subtitles.map((subtitle, index) => (
                            <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                              <p className="text-sm text-gray-500">{subtitle.text}</p>
                              <p className="text-sm font-medium">{subtitle.translation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instructions Section */}
          <Card className="bg-blue-50 border-blue-200 mt-6">
            <CardHeader>
              <CardTitle className="text-blue-800">Comment ça marche</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                <li>Entrez l'URL d'une vidéo ou téléchargez un fichier vidéo/audio</li>
                <li>Notre IA analyse automatiquement le contenu et extrait les dialogues</li>
                <li>Le texte est traduit de l'anglais au français avec haute précision</li>
                <li>Une voix française naturelle est générée pour doubler la vidéo originale</li>
                <li>Téléchargez ou partagez votre vidéo traduite</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SEO-GPT. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Tableau de bord</Link>
              <Link to="/quora" className="text-sm text-gray-500 hover:text-gray-900">Assistant Quora</Link>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Confidentialité</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TranslationPage;
