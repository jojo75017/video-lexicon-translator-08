import React, { useRef, useState, useEffect } from 'react';
import SubtitleOverlay from './SubtitleOverlay';

interface VideoPlayerProps {
  videoUrl: string;
  subtitles?: {
    startTime: number;
    endTime: number;
    text: string;
    translation: string;
  }[];
  language: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, subtitles = [], language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

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
      <SubtitleOverlay
        subtitles={subtitles}
        currentTime={currentTime}
        language={language}
      />
    </div>
  );
};

export default VideoPlayer;