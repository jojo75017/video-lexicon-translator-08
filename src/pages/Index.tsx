import React, { useState } from 'react';
import VideoInput from '@/components/VideoInput';
import VideoPlayer from '@/components/VideoPlayer';
import LanguageSelector from '@/components/LanguageSelector';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('fr');
  const [transcription, setTranscription] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const demoSubtitles = [
    {
      startTime: 0,
      endTime: 3,
      text: "Hello everyone!",
      translation: "Bonjour à tous !"
    },
    {
      startTime: 3,
      endTime: 6,
      text: "Today we're going to learn something amazing.",
      translation: "Aujourd'hui, nous allons apprendre quelque chose d'incroyable."
    },
    {
      startTime: 6,
      endTime: 9,
      text: "Are you ready to start?",
      translation: "Êtes-vous prêts à commencer ?"
    }
  ];

  const handleVideoSubmit = async (url: string) => {
    setVideoUrl(url);
    setProgress(0);
    setTranscription('');
    
    try {
      // Simulation de la transcription
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        
        // Ajout progressif de la transcription
        if (currentProgress === 30) {
          setTranscription('Début de la transcription...\n');
        } else if (currentProgress === 60) {
          setTranscription(prev => prev + 'Traitement en cours...\n');
        } else if (currentProgress === 90) {
          setTranscription(prev => prev + 'Finalisation de la transcription...\n');
        } else if (currentProgress >= 100) {
          clearInterval(interval);
          setTranscription(prev => prev + 'Transcription terminée !\n\n' + demoSubtitles.map(sub => sub.text + '\n' + sub.translation + '\n').join('\n'));
          toast.success('Transcription terminée !');
        }
      }, 500);
    } catch (error) {
      toast.error('Erreur lors de la transcription');
      setProgress(0);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    toast.info(`Langue changée pour : ${language}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Traducteur Vidéo</h1>
          <p className="text-lg text-gray-600 mb-8">Traduisez vos vidéos en plusieurs langues avec des sous-titres colorés</p>
        </div>

        <div className="w-full max-w-xl mx-auto mb-8">
          <VideoInput onVideoSubmit={handleVideoSubmit} />
        </div>

        {videoUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <VideoPlayer 
                videoUrl={videoUrl} 
                subtitles={demoSubtitles}
                language={selectedLanguage}
              />
              <div className="flex justify-between items-center">
                <LanguageSelector onLanguageChange={handleLanguageChange} />
                <Badge variant="outline">
                  {selectedLanguage === 'fr' ? 'Français' : 'English'}
                </Badge>
              </div>
            </div>

            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Progression du traitement</h2>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Transcription</span>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Transcription & Traduction</h2>
                <div className="h-[400px] overflow-y-auto bg-white p-4 rounded-lg border whitespace-pre-line">
                  {transcription || "La transcription apparaîtra ici..."}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;