import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, Headphones, Share2, Code, Copy, Check, 
  SkipBack, SkipForward, BookOpen, Clock, Star, Users, Download, 
  ChevronDown, ChevronUp, Mic2, Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// --- Sub-components ---

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
    <div className="animate-pulse text-purple-400 flex flex-col items-center gap-3">
      <div className="relative">
        <Headphones className="w-14 h-14 animate-bounce" />
        <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <p className="text-white/80 font-medium">Chargement du livre audio...</p>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-white">
    <div className="text-center">
      <Headphones className="w-20 h-20 mx-auto mb-4 text-purple-400 opacity-30" />
      <h1 className="text-3xl font-bold mb-2">Livre audio introuvable</h1>
      <p className="text-white/50">Ce livre audio n'existe pas ou n'est pas encore public.</p>
    </div>
  </div>
);

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onSeek: (v: number[]) => void;
  onSkip: (s: number) => void;
  onVolumeChange: (v: number[]) => void;
  onToggleMute: () => void;
  formatTime: (s: number) => string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying, currentTime, duration, volume, isMuted,
  onTogglePlay, onSeek, onSkip, onVolumeChange, onToggleMute, formatTime
}) => (
  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
    {/* Waveform-style progress */}
    <div className="mb-6">
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={onSeek}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
      </div>
    </div>

    {/* Main controls */}
    <div className="flex items-center justify-center gap-6">
      <Button 
        variant="ghost" size="icon" 
        onClick={() => onSkip(-15)} 
        className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full transition-all"
      >
        <div className="relative">
          <SkipBack className="h-5 w-5" />
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">15s</span>
        </div>
      </Button>
      
      <Button
        onClick={onTogglePlay}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
      >
        {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-0.5 text-white" />}
      </Button>
      
      <Button 
        variant="ghost" size="icon" 
        onClick={() => onSkip(30)} 
        className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full transition-all"
      >
        <div className="relative">
          <SkipForward className="h-5 w-5" />
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">30s</span>
        </div>
      </Button>
    </div>

    {/* Volume */}
    <div className="flex items-center gap-3 mt-6 max-w-[200px] mx-auto">
      <Button 
        variant="ghost" size="icon" 
        onClick={onToggleMute} 
        className="text-white/40 hover:text-white hover:bg-white/10 shrink-0 h-8 w-8"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={onVolumeChange} />
    </div>
  </div>
);

// --- Main Component ---

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
  const [showFullDesc, setShowFullDesc] = useState(false);
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
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
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

  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m} min`;
  };

  const embedCode = audiobook ? `<iframe src="${window.location.origin}/audiobook-embed/${audiobook.slug}" width="100%" height="200" frameborder="0" allow="autoplay" style="border-radius: 16px;"></iframe>` : '';

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

  if (loading) return <LoadingState />;
  if (!audiobook) return <NotFoundState />;

  const descriptionShort = audiobook.description?.slice(0, 180);
  const hasLongDesc = audiobook.description && audiobook.description.length > 180;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0c0a1d] to-slate-950 text-white">
      {audiobook.audio_url && <audio ref={audioRef} src={audiobook.audio_url} preload="metadata" />}

      {/* Hero Section - Audible Style */}
      <div className="relative overflow-hidden">
        {/* Background blur from cover */}
        {audiobook.cover_url && (
          <div className="absolute inset-0 z-0">
            <img src={audiobook.cover_url} alt="" className="w-full h-full object-cover scale-110 blur-3xl opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-[#0c0a1d]/80 to-[#0c0a1d]" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            
            {/* Cover Art */}
            <div className="shrink-0 group">
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-transform group-hover:scale-[1.02]">
                {audiobook.cover_url ? (
                  <img 
                    src={audiobook.cover_url} 
                    alt={audiobook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-600 via-orange-700 to-amber-800 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-white/60" />
                  </div>
                )}
                {/* Play overlay */}
                <button 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all group/play"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-all scale-75 group-hover/play:scale-100 shadow-xl">
                    {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-1 text-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left min-w-0">
              {/* Category badge */}
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 mb-3 text-xs font-medium">
                <Headphones className="w-3 h-3 mr-1.5" />
                Livre Audio
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {audiobook.title}
              </h1>

              {audiobook.author_name && (
                <p className="text-lg text-white/60 mb-4">
                  Par <span className="text-amber-400 font-medium">{audiobook.author_name}</span>
                </p>
              )}

              {/* Meta info pills */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-5">
                {audiobook.voice_name && (
                  <div className="flex items-center gap-1.5 text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
                    <Mic2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Voix : {audiobook.voice_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{formatDuration(audiobook.duration_seconds)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
                  <Users className="w-3.5 h-3.5 text-green-400" />
                  <span>{audiobook.play_count || 0} écoutes</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Description */}
              {audiobook.description && (
                <div className="mb-5">
                  <p className="text-white/60 leading-relaxed text-sm md:text-base">
                    {showFullDesc ? audiobook.description : descriptionShort}
                    {hasLongDesc && !showFullDesc && '...'}
                  </p>
                  {hasLongDesc && (
                    <button 
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="text-amber-400 text-sm mt-1 flex items-center gap-1 hover:text-amber-300 transition-colors mx-auto md:mx-0"
                    >
                      {showFullDesc ? <><ChevronUp className="w-3.5 h-3.5" /> Moins</> : <><ChevronDown className="w-3.5 h-3.5" /> Lire plus</>}
                    </button>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button 
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold gap-2 px-6 h-11 rounded-full shadow-lg shadow-amber-500/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Écouter maintenant'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={shareUrl} 
                  className="gap-2 border-white/15 text-white/80 hover:bg-white/10 hover:text-white rounded-full h-11"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                {audiobook.audio_url && (
                  <Button 
                    variant="outline" 
                    asChild
                    className="gap-2 border-white/15 text-white/80 hover:bg-white/10 hover:text-white rounded-full h-11"
                  >
                    <a href={audiobook.audio_url} download>
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Section */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {audiobook.audio_url ? (
          <PlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onSkip={skip}
            onVolumeChange={changeVolume}
            onToggleMute={() => { setIsMuted(!isMuted); if (audioRef.current) audioRef.current.muted = !isMuted; }}
            formatTime={formatTime}
          />
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
            <Headphones className="w-14 h-14 mx-auto mb-3 text-white/20" />
            <p className="text-white/40">L'audio n'est pas encore disponible pour ce livre.</p>
          </div>
        )}
      </div>

      {/* Product Details - Audible style */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white/90 mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Détails du livre audio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <DetailItem label="Format" value="Audio MP3" />
            <DetailItem label="Durée" value={formatDuration(audiobook.duration_seconds)} />
            <DetailItem label="Narrateur" value={audiobook.voice_name || 'IA Premium'} />
            <DetailItem label="Écoutes" value={`${audiobook.play_count || 0}`} />
            {audiobook.author_name && <DetailItem label="Auteur" value={audiobook.author_name} />}
            <DetailItem label="Qualité" value="HD 192kbps" />
            <DetailItem label="Langue" value="Français" />
            <DetailItem label="Plateforme" value="EbookStudio" />
          </div>
        </div>
      </div>

      {/* Embed section */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <Button 
          variant="ghost" 
          onClick={() => setShowEmbed(!showEmbed)} 
          className="gap-2 text-white/40 hover:text-white/70 hover:bg-white/5 text-sm mx-auto flex"
        >
          <Code className="h-4 w-4" />
          {showEmbed ? 'Masquer le code embed' : 'Intégrer sur votre site'}
        </Button>

        {showEmbed && (
          <div className="mt-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <p className="text-sm text-white/50 mb-3 font-medium">Code d'intégration :</p>
            <div className="relative">
              <pre className="bg-black/40 rounded-xl p-4 text-xs text-white/40 overflow-x-auto font-mono">
                {embedCode}
              </pre>
              <Button 
                size="sm" 
                onClick={copyEmbed}
                className="absolute top-2 right-2 gap-1.5 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copié' : 'Copier'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-10 pt-4">
        <p className="text-xs text-white/20">
          Propulsé par EbookStudio Pro • Audio IA Premium
        </p>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">{label}</p>
    <p className="text-sm text-white/80 font-medium">{value}</p>
  </div>
);

export default PublicAudiobookPage;
