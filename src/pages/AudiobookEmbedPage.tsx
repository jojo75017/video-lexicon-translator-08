import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Headphones, SkipBack, SkipForward } from 'lucide-react';
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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!audiobook) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-r from-slate-900 to-purple-950 text-white p-4">
        <Headphones className="w-6 h-6 text-purple-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 text-white p-4 flex flex-col justify-center">
      {audiobook.audio_url && <audio ref={audioRef} src={audiobook.audio_url} preload="metadata" />}
      
      <div className="flex items-center gap-4">
        {/* Cover */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shrink-0 overflow-hidden">
          {audiobook.cover_url ? (
            <img src={audiobook.cover_url} alt={audiobook.title} className="w-full h-full object-cover" />
          ) : (
            <Headphones className="w-8 h-8 text-white/80" />
          )}
        </div>

        {/* Info + Controls */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{audiobook.title}</p>
          {audiobook.author_name && <p className="text-xs text-purple-300 truncate">{audiobook.author_name}</p>}
          
          <div className="flex items-center gap-2 mt-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/10" onClick={() => audioRef.current && (audioRef.current.currentTime -= 15)}>
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            <Button onClick={togglePlay} size="icon" className="h-9 w-9 rounded-full bg-purple-500 hover:bg-purple-600">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/10" onClick={() => audioRef.current && (audioRef.current.currentTime += 30)}>
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
            
            <div className="flex-1 mx-2">
              <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={(v) => { if (audioRef.current) audioRef.current.currentTime = v[0]; }} />
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudiobookEmbedPage;
