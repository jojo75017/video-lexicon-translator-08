import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Headphones, Share2, Code, Copy, Check, SkipBack, SkipForward, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PublicAudiobookPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [audiobook, setAudiobook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (slug) fetchAudiobook();
  }, [slug]);

  const fetchAudiobook = async () => {
    try {
      const { data, error } = await supabase
        .from('audiobooks')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      setAudiobook(data);

      // Increment play count
      await supabase.from('audiobooks').update({ play_count: (data.play_count || 0) + 1 }).eq('id', data.id);
    } catch {
      setAudiobook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audiobook]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); }
    else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const seek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const changeVolume = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value[0];
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const embedCode = audiobook ? `<iframe src="${window.location.origin}/audiobook-embed/${audiobook.slug}" width="100%" height="180" frameborder="0" allow="autoplay" style="border-radius: 12px;"></iframe>` : '';

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Code embed copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié !');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
        <div className="animate-pulse text-purple-400 flex flex-col items-center gap-3">
          <Headphones className="w-12 h-12 animate-bounce" />
          <p>Chargement du livre audio...</p>
        </div>
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-white">
        <div className="text-center">
          <Headphones className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
          <h1 className="text-2xl font-bold mb-2">Livre audio introuvable</h1>
          <p className="text-slate-400">Ce livre audio n'existe pas ou n'est pas encore public.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {audiobook.audio_url && <audio ref={audioRef} src={audiobook.audio_url} preload="metadata" />}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          {audiobook.cover_url ? (
            <img 
              src={audiobook.cover_url} 
              alt={audiobook.title}
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl mx-auto mb-6 shadow-2xl shadow-purple-500/20 border border-purple-500/20"
            />
          ) : (
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-purple-500/20">
              <BookOpen className="w-20 h-20 text-white/80" />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {audiobook.title}
          </h1>
          {audiobook.author_name && (
            <p className="text-lg text-purple-300">par {audiobook.author_name}</p>
          )}
          {audiobook.description && (
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">{audiobook.description}</p>
          )}

          <div className="flex items-center justify-center gap-3 mt-4">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Headphones className="w-3 h-3 mr-1" />
              Livre Audio
            </Badge>
            {audiobook.voice_name && (
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                Voix : {audiobook.voice_name}
              </Badge>
            )}
            <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">
              {audiobook.play_count || 0} écoutes
            </Badge>
          </div>
        </div>

        {/* Player */}
        {audiobook.audio_url ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-8">
            <CardContent className="p-6">
              {/* Progress */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={seek}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => skip(-15)} className="text-white hover:text-purple-300 hover:bg-white/10">
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-lg shadow-purple-500/30"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </Button>
                
                <Button variant="ghost" size="icon" onClick={() => skip(30)} className="text-white hover:text-purple-300 hover:bg-white/10">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 mt-4 max-w-xs mx-auto">
                <Button variant="ghost" size="icon" onClick={() => { setIsMuted(!isMuted); if (audioRef.current) audioRef.current.muted = !isMuted; }} className="text-white/60 hover:text-white hover:bg-white/10 shrink-0">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={changeVolume} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-8">
            <CardContent className="p-8 text-center">
              <Headphones className="w-12 h-12 mx-auto mb-3 text-purple-400 opacity-50" />
              <p className="text-slate-400">L'audio n'est pas encore disponible pour ce livre.</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button variant="outline" onClick={shareUrl} className="gap-2 border-white/20 text-white hover:bg-white/10">
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
          <Button variant="outline" onClick={() => setShowEmbed(!showEmbed)} className="gap-2 border-white/20 text-white hover:bg-white/10">
            <Code className="h-4 w-4" />
            Intégrer
          </Button>
        </div>

        {/* Embed code */}
        {showEmbed && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-8">
            <CardContent className="p-4">
              <p className="text-sm text-slate-300 mb-2 font-medium">Code d'intégration :</p>
              <div className="relative">
                <pre className="bg-black/40 rounded-lg p-3 text-xs text-slate-400 overflow-x-auto">
                  {embedCode}
                </pre>
                <Button 
                  size="sm" 
                  onClick={copyEmbed}
                  className="absolute top-2 right-2 gap-1 bg-purple-500/80 hover:bg-purple-600"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copié' : 'Copier'}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Collez ce code dans votre site web pour intégrer le lecteur audio.</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-12">
          Créé avec EbookStudio Pro • Technologie ElevenLabs
        </p>
      </div>
    </div>
  );
};

export default PublicAudiobookPage;
