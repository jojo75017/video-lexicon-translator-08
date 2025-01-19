import React, { useState } from 'react';
import VideoInput from '@/components/VideoInput';
import VideoPlayer from '@/components/VideoPlayer';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
}

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('fr');
  const [transcription, setTranscription] = useState<string>('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  const handleVideoSubmit = async (url: string) => {
    setVideoUrl(url);
    // Exemple de sous-titres pour démonstration
    const demoSubtitles: Subtitle[] = [
      {
        startTime: 0,
        endTime: 3,
        text: "Hello, welcome to this video!",
        translation: "Bonjour, bienvenue dans cette vidéo !"
      },
      {
        startTime: 3,
        endTime: 6,
        text: "Today we'll learn something amazing.",
        translation: "Aujourd'hui, nous allons apprendre quelque chose d'incroyable."
      }
    ];
    setSubtitles(demoSubtitles);
    toast.success("Vidéo chargée avec succès !");
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    toast.info("Changement de langue en cours...");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Traducteur Vidéo</h1>
          <p className="text-lg text-gray-600">Traduisez vos vidéos dans plusieurs langues avec des sous-titres colorés</p>
        </div>

        <VideoInput onVideoSubmit={handleVideoSubmit} />

        {videoUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <VideoPlayer 
                videoUrl={videoUrl} 
                subtitles={subtitles}
                language={selectedLanguage}
              />
              <div className="flex justify-end">
                <LanguageSelector onLanguageChange={handleLanguageChange} />
              </div>
            </div>

            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Transcription & Traduction</h2>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(transcription);
                    toast.success("Texte copié !");
                  }}
                >
                  Copier le texte
                </Button>
              </div>
              <div className="h-[400px] overflow-y-auto bg-white p-4 rounded-lg border">
                {transcription || "La transcription apparaîtra ici..."}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;