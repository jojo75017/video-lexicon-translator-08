import React, { useRef, useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
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
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  const translateAudio = async () => {
    if (!videoUrl) return;
    
    setIsTranslating(true);
    toast.info("Traduction audio en cours...");

    try {
      // Ici, nous devrions appeler l'API Eleven Labs pour traduire l'audio
      // Pour l'instant, c'est une simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Traduction audio terminée !");
      setIsTranslating(false);
    } catch (error) {
      console.error('Erreur lors de la traduction audio:', error);
      toast.error("Erreur lors de la traduction audio");
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

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full h-full object-contain"
      >
        Votre navigateur ne prend pas en charge la lecture vidéo.
      </video>
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