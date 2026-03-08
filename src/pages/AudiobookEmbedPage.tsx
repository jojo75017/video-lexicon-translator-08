import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Headphones, SkipBack, SkipForward, Mic2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AudiobookEmbedPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [audiobook, setAudiobook] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (slug) {
      supabase.from('audiobooks').select('*').eq('slug', slug).eq('is_public', true).single()
        .then(({ data }) => setAudiobook(data));
    }
  }, [slug]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onLoaded); audio.removeEventListener('ended', onEnded); };
  }, [audiobook]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audiobook) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#0c0a1d] to-[#1a1035] text-white p-4">
        <Headphones className="w-6 h-6 text-amber-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#0c0a1d] via-[#12102a] to-[#1a1035] text-white p-4 flex flex-col justify-center overflow-hidden relative">
      {audiobook.audio_url && <audio ref={audioRef} src={audiobook.audio_url} preload="metadata" />}
      
      {/* Subtle background glow */}
      {audiobook.cover_url && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={audiobook.cover_url} alt="" className="w-full h-full object-cover blur-3xl opacity-10 scale-150" />
        </div>
      )}

      <div className="flex items-center gap-4 relative z-10">
        {/* Cover */}
        <button onClick={togglePlay} className="w-20 h-20 rounded-xl shrink-0 overflow-hidden shadow-xl shadow-black/30 ring-1 ring-white/10 relative group transition-transform hover:scale-[1.03] active:scale-95">
          {audiobook.cover_url ? (
            <img src={audiobook.cover_url} alt={audiobook.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
              <Headphones className="w-9 h-9 text-white/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 ml-0.5 text-white" />}
            </div>
          </div>
        </button>

        {/* Info + Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-white/90">{audiobook.title}</p>
              {audiobook.author_name && (
                <p className="text-xs text-amber-400/70 truncate">{audiobook.author_name}</p>
              )}
            </div>
            {audiobook.voice_name && (
              <div className="flex items-center gap-1 text-[10px] text-white/30 shrink-0 bg-white/5 px-2 py-0.5 rounded-full">
                <Mic2 className="w-2.5 h-2.5" />
                {audiobook.voice_name}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2.5">
            <Button 
              variant="ghost" size="icon" 
              className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10 rounded-full" 
              onClick={() => audioRef.current && (audioRef.current.currentTime -= 15)}
            >
              <SkipBack className="h-3 w-3" />
            </Button>
            <Button 
              onClick={togglePlay} size="icon" 
              className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <Button 
              variant="ghost" size="icon" 
              className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10 rounded-full" 
              onClick={() => audioRef.current && (audioRef.current.currentTime += 30)}
            >
              <SkipForward className="h-3 w-3" />
            </Button>
            
            <div className="flex-1 mx-1.5">
              <Slider 
                value={[currentTime]} 
                max={duration || 100} 
                step={1} 
                onValueChange={(v) => { if (audioRef.current) audioRef.current.currentTime = v[0]; }} 
              />
            </div>
            
            <span className="text-[10px] text-white/30 shrink-0 font-mono tabular-nums">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>

            <Button 
              variant="ghost" size="icon" 
              className="h-6 w-6 text-white/30 hover:text-white hover:bg-white/10 rounded-full shrink-0" 
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default AudiobookEmbedPage;
