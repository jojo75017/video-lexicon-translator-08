import React, { useRef, useState, useEffect } from 'react';
import SubtitleOverlay from './SubtitleOverlay';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface VideoPlayerProps {
  videoUrl: string;
  subtitles?: {
    startTime: number;
    endTime: number;
    text: string;
    translation: string;
  }[];
  language: string;
  showSubtitles?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  subtitles = [], 
  language,
  showSubtitles = true 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const testApiKey = async () => {
    setIsTestingApi(true);
    setVideoError(null);
    
    try {
      const apiKey = process.env.ELEVEN_LABS_API_KEY;
      
      if (!apiKey) {
        throw new Error('Clé API manquante. Veuillez configurer votre clé API Eleven Labs.');
      }

      // Test simple de l'API avec un court texte
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: "Test de l'API",
          model_id: "eleven_multilingual_v2",
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Clé API invalide. Veuillez vérifier votre clé.');
        } else {
          throw new Error(`Erreur lors du test de l'API (${response.status})`);
        }
      }

      toast.success('Connexion à l\'API réussie !');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur de connexion à l'API";
      toast.error(message);
      setVideoError(message);
      return false;
    } finally {
      setIsTestingApi(false);
    }
  };

  const translateAudio = async () => {
    if (!videoUrl) {
      toast.error("URL de la vidéo manquante");
      return;
    }
    
    // Test de l'API avant de commencer la traduction
    const isApiWorking = await testApiKey();
    if (!isApiWorking) return;

    setIsTranslating(true);
    setVideoError(null);

    try {
      const apiKey = process.env.ELEVEN_LABS_API_KEY;
      console.log("Début de la traduction...");
      console.log("Vérification de la clé API:", apiKey ? "Présente" : "Absente");

      if (!apiKey) {
        throw new Error('Clé API Eleven Labs manquante. Veuillez configurer votre clé API.');
      }

      // Vérification du format de la clé
      if (!/^[a-zA-Z0-9]{32,}$/.test(apiKey)) {
        throw new Error('Format de clé API invalide. La clé doit contenir au moins 32 caractères alphanumériques.');
      }

      toast.info("Préparation de la traduction audio...");
      
      const textToTranslate = subtitles.map(sub => sub.translation).join(' ');
      console.log("Texte à traduire (début):", textToTranslate.substring(0, 50));
      
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: textToTranslate,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      });

      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Détails de l\'erreur:', errorData);
        
        if (response.status === 401) {
          throw new Error('Clé API non valide ou expirée. Veuillez vérifier votre clé API Eleven Labs.');
        } else if (response.status === 429) {
          throw new Error('Limite d\'utilisation de l\'API atteinte. Veuillez réessayer plus tard.');
        } else {
          throw new Error(`Erreur lors de la traduction audio (${response.status}): ${errorData.detail || 'Erreur inconnue'}`);
        }
      }

      const translatedAudioBlob = await response.blob();
      setAudioBlob(translatedAudioBlob);
      
      toast.success("Traduction audio terminée avec succès !");
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue lors de la traduction";
      setVideoError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  useEffect(() => {
    if (videoUrl && language === 'fr') {
      testApiKey(); // Test de l'API au chargement
    }
  }, [videoUrl, language]);

  // Gestion de l'audio traduit
  useEffect(() => {
    if (audioBlob && videoRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      videoRef.current.addEventListener('play', () => audioElement.play());
      videoRef.current.addEventListener('pause', () => audioElement.pause());
      videoRef.current.addEventListener('seeked', () => {
        audioElement.currentTime = videoRef.current!.currentTime;
      });

      return () => {
        URL.revokeObjectURL(audioUrl);
        audioElement.pause();
      };
    }
  }, [audioBlob]);

  const handleRetry = () => {
    setVideoError(null);
    testApiKey();
  };

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {!videoUrl && (
        <div className="flex items-center justify-center h-full text-white">
          Veuillez entrer une URL de vidéo
        </div>
      )}
      
      {videoUrl && (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
            onError={() => {
              const errorMsg = "Erreur lors de la lecture de la vidéo";
              setVideoError(errorMsg);
              toast.error(errorMsg);
            }}
          >
            Votre navigateur ne prend pas en charge la lecture vidéo.
          </video>

          {videoError && (
            <Alert variant="destructive" className="absolute top-4 right-4 left-4 bg-white/90">
              <AlertDescription>
                {videoError}
                <Button 
                  onClick={handleRetry}
                  className="ml-4 bg-red-500 text-white hover:bg-red-600"
                  size="sm"
                  disabled={isTestingApi}
                >
                  {isTestingApi ? 'Test en cours...' : 'Tester la connexion'}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {showSubtitles && (
        <SubtitleOverlay
          subtitles={subtitles}
          currentTime={currentTime}
          language={language}
        />
      )}

      {isTranslating && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-lg">Traduction en cours...</div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;