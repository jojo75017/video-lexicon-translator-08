import React, { useRef, useState, useEffect } from 'react';
import SubtitleOverlay from './SubtitleOverlay';
import { toast } from 'sonner';

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

  const translateAudio = async () => {
    if (!videoUrl) return;
    
    setIsTranslating(true);
    toast.info("Extraction de l'audio en cours...");

    try {
      // Vérifier d'abord si la clé API est disponible
      if (!process.env.ELEVEN_LABS_API_KEY) {
        throw new Error('Clé API Eleven Labs manquante');
      }

      // Extraire l'audio de la vidéo
      const audioResponse = await fetch(videoUrl);
      if (!audioResponse.ok) {
        throw new Error('Erreur lors de l\'extraction audio');
      }
      const audioData = await audioResponse.blob();
      
      toast.info("Traduction audio en cours...");
      
      // Appel à l'API Eleven Labs pour la traduction
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: "Texte à traduire", // À remplacer par le texte extrait de la vidéo
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la traduction audio');
      }

      const translatedAudioBlob = await response.blob();
      setAudioBlob(translatedAudioBlob);
      
      toast.success("Traduction audio terminée !");
    } catch (error) {
      console.error('Erreur lors de la traduction audio:', error);
      toast.error("Erreur lors de la traduction audio. La vidéo sera lue sans traduction.");
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
      translateAudio();
    }
  }, [videoUrl, language]);

  // Gestion de l'audio traduit
  useEffect(() => {
    if (audioBlob && videoRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      // Synchroniser l'audio traduit avec la vidéo
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

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error('Erreur de lecture vidéo:', e);
            toast.error("Erreur lors de la lecture de la vidéo");
          }}
        >
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          Veuillez entrer une URL de vidéo
        </div>
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