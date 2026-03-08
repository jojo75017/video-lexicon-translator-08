import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, Headphones, Share2, Code, Copy, Check, 
  SkipBack, SkipForward, BookOpen, Clock, Star, Users, Download, 
  ChevronDown, ChevronUp, Mic2, Sparkles, Link2, Calendar, Globe, 
  FileAudio, Building2, Tag, ShoppingCart, CreditCard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// --- Loading & Error States ---

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d3748] via-[#1a202c] to-[#0f1319]">
    <div className="animate-pulse text-amber-400 flex flex-col items-center gap-3">
      <div className="relative">
        <Headphones className="w-14 h-14 animate-bounce" />
        <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <p className="text-white/80 font-medium">Chargement du livre audio...</p>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d3748] via-[#1a202c] to-[#0f1319] text-white">
    <div className="text-center">
      <Headphones className="w-20 h-20 mx-auto mb-4 text-white/20" />
      <h1 className="text-3xl font-bold mb-2">Livre audio introuvable</h1>
      <p className="text-white/50">Ce livre audio n'existe pas ou n'est pas encore public.</p>
    </div>
  </div>
);

// --- Excerpt Player (mini preview) ---

interface ExcerptPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (v: number[]) => void;
  formatTime: (s: number) => string;
}

const ExcerptPlayer: React.FC<ExcerptPlayerProps> = ({
  isPlaying, currentTime, duration, onTogglePlay, onSeek, formatTime
}) => (
  <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 md:p-6">
    <div className="flex items-center gap-2 mb-4">
      <Headphones className="w-5 h-5 text-amber-400" />
      <h3 className="text-white font-semibold text-base">Aperçu</h3>
    </div>
    <div className="flex items-center gap-4">
      <Button
        onClick={onTogglePlay}
        className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
      >
        {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 ml-0.5 text-white" />}
      </Button>
      <div className="flex-1 min-w-0">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={onSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-white/40 mt-1.5 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Full Player Controls ---

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
  <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
    <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
      <FileAudio className="w-5 h-5 text-amber-400" />
      Lecteur complet
    </h3>
    {/* Progress */}
    <div className="mb-6">
      <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={onSeek} className="cursor-pointer" />
      <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
      </div>
    </div>
    {/* Controls */}
    <div className="flex items-center justify-center gap-6">
      <Button variant="ghost" size="icon" onClick={() => onSkip(-15)} className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full">
        <div className="relative"><SkipBack className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">15s</span></div>
      </Button>
      <Button onClick={onTogglePlay} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
        {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-0.5 text-white" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onSkip(30)} className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full">
        <div className="relative"><SkipForward className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">30s</span></div>
      </Button>
    </div>
    {/* Volume */}
    <div className="flex items-center gap-3 mt-6 max-w-[200px] mx-auto">
      <Button variant="ghost" size="icon" onClick={onToggleMute} className="text-white/40 hover:text-white hover:bg-white/10 shrink-0 h-8 w-8">
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
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  // Excerpt state
  const [excerptPlaying, setExcerptPlaying] = useState(false);
  const [excerptTime, setExcerptTime] = useState(0);
  const [excerptDuration, setExcerptDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const excerptRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (slug) fetchAudiobook(); }, [slug]);

  const fetchAudiobook = async () => {
    try {
      const { data, error } = await supabase.from('audiobooks').select('*').eq('slug', slug).eq('is_public', true).single();
      if (error) throw error;
      setAudiobook(data);
      await supabase.from('audiobooks').update({ play_count: (data.play_count || 0) + 1 }).eq('id', data.id);
    } catch { setAudiobook(null); } finally { setLoading(false); }
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
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onLoaded); audio.removeEventListener('ended', onEnded); };
  }, [audiobook]);

  useEffect(() => {
    const audio = excerptRef.current;
    if (!audio) return;
    const onTime = () => setExcerptTime(audio.currentTime);
    const onLoaded = () => setExcerptDuration(audio.duration);
    const onEnded = () => setExcerptPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onLoaded); audio.removeEventListener('ended', onEnded); };
  }, [audiobook]);

  const toggleExcerpt = () => {
    if (!excerptRef.current) return;
    // Pause full player if playing
    if (isPlaying && audioRef.current) { audioRef.current.pause(); setIsPlaying(false); }
    excerptPlaying ? excerptRef.current.pause() : excerptRef.current.play();
    setExcerptPlaying(!excerptPlaying);
  };
  const seekExcerpt = (v: number[]) => { if (!excerptRef.current) return; excerptRef.current.currentTime = v[0]; setExcerptTime(v[0]); };

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };
  const seek = (value: number[]) => { if (!audioRef.current) return; audioRef.current.currentTime = value[0]; setCurrentTime(value[0]); };
  const changeVolume = (value: number[]) => { if (!audioRef.current) return; audioRef.current.volume = value[0]; setVolume(value[0]); setIsMuted(value[0] === 0); };
  const skip = (seconds: number) => { if (!audioRef.current) return; audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds)); };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = Math.floor(s % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`;
  };
  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h} h et ${m} min` : `${m} min`;
  };

  const embedCode = audiobook ? `<iframe src="${window.location.origin}/audiobook-embed/${audiobook.slug}" width="100%" height="200" frameborder="0" allow="autoplay" style="border-radius: 16px;"></iframe>` : '';
  const copyEmbed = () => { navigator.clipboard.writeText(embedCode); setCopied(true); toast.success('Code embed copié !'); setTimeout(() => setCopied(false), 2000); };
  const shareUrl = () => { navigator.clipboard.writeText(window.location.href); toast.success('Lien copié !'); };

  const generateStandaloneHtml = () => {
    if (!audiobook) return;
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${audiobook.title} - Livre Audio</title>
<meta name="description" content="${(audiobook.description || '').slice(0, 160).replace(/"/g, '&quot;')}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(to bottom,#3a4a5c,#1e2a38,#0f1319);color:#fff;min-height:100vh}
.container{max-width:1100px;margin:0 auto;padding:20px}
.hero{position:relative;overflow:hidden;padding:40px 20px}
.hero-bg{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(74,85,104,.6),rgba(45,55,72,.8),#1a202c);z-index:0}
.hero-blur{position:absolute;inset:0;z-index:0}
.hero-blur img{width:100%;height:100%;object-fit:cover;transform:scale(1.25);filter:blur(80px);opacity:.15}
.hero-content{position:relative;z-index:10;max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start}
.hero-left{flex:1;min-width:300px}
.hero-right{flex-shrink:0}
.cover-wrap{width:280px;height:280px;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)}
.cover-wrap img{width:100%;height:100%;object-fit:cover}
.cover-placeholder{width:100%;height:100%;background:linear-gradient(135deg,#d97706,#c2410c,#b45309);display:flex;align-items:center;justify-content:center;font-size:48px;color:rgba(255,255,255,.4)}
h1{font-size:2.5rem;font-weight:800;margin-bottom:8px;line-height:1.1}
.meta-line{color:rgba(255,255,255,.7);margin-bottom:4px;font-size:15px}
.meta-line .label{color:rgba(255,255,255,.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-right:8px}
.meta-line .value{color:#f59e0b;font-weight:500}
.rating{display:flex;align-items:center;gap:8px;margin:16px 0}
.stars{color:#f59e0b;font-size:18px}
.rating-count{color:rgba(245,158,11,.8);font-size:14px}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}
.btn-primary{background:linear-gradient(to right,#f59e0b,#f97316);color:#fff;font-weight:700;padding:12px 32px;border:none;border-radius:9999px;font-size:16px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.btn-primary:hover{opacity:.9}
.btn-outline{background:rgba(255,255,255,.05);color:#fff;font-weight:600;padding:12px 24px;border:1px solid rgba(255,255,255,.2);border-radius:9999px;font-size:14px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.btn-outline:hover{background:rgba(255,255,255,.1)}
.audio-player{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px;margin:24px 0}
.audio-player h3{font-size:18px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.audio-player audio{width:100%;border-radius:8px;margin-top:8px}
.content-grid{display:flex;gap:40px;flex-wrap:wrap;padding:40px 0}
.content-main{flex:1;min-width:300px}
.content-sidebar{width:300px;flex-shrink:0}
.about h2{font-size:1.5rem;font-weight:700;margin-bottom:16px}
.about p{color:rgba(255,255,255,.7);line-height:1.7;font-size:15px}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}
.tag{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);padding:6px 16px;border-radius:9999px;font-size:13px}
.sidebar-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px;position:sticky;top:24px}
.sidebar-card h3{font-size:16px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:12px;margin-bottom:16px}
.meta-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
.meta-row .icon{width:16px;height:16px;flex-shrink:0;margin-top:2px;opacity:.7}
.meta-row .meta-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.35);margin-bottom:2px}
.meta-row .meta-value{font-size:14px;color:rgba(255,255,255,.8);font-weight:500}
.footer{text-align:center;padding:40px 0 20px;border-top:1px solid rgba(255,255,255,.05);font-size:12px;color:rgba(255,255,255,.2)}
.badge{position:absolute;bottom:-12px;right:-12px;background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:8px;transform:rotate(-3deg);box-shadow:0 4px 12px rgba(0,0,0,.3)}
@media(max-width:768px){.hero-content{flex-direction:column-reverse;align-items:center;text-align:center}.hero-left{text-align:center}.cover-wrap{width:220px;height:220px}.content-grid{flex-direction:column}.content-sidebar{width:100%}h1{font-size:1.8rem}.rating{justify-content:center}.cta-row{justify-content:center}}
</style>
</head>
<body>

<!-- HERO -->
<div class="hero">
  <div class="hero-bg"></div>
  ${audiobook.cover_url ? `<div class="hero-blur"><img src="${audiobook.cover_url}" alt=""></div>` : ''}
  <div class="hero-content">
    <div class="hero-left">
      <h1>${audiobook.title}</h1>
      ${audiobook.author_name ? `<p class="meta-line"><span class="label">De</span><span class="value">${audiobook.author_name}</span></p>` : ''}
      ${audiobook.voice_name ? `<p class="meta-line"><span class="label">Lu par</span><span class="value">${audiobook.voice_name}</span></p>` : ''}
      <div class="rating">
        <span style="font-weight:600;font-size:18px">4.7</span>
        <span class="stars">★★★★☆</span>
        <span class="rating-count">${audiobook.play_count || 0} écoutes</span>
      </div>
      ${audiobook.audio_url ? `
      <div class="audio-player">
        <h3>🎧 Écouter l'extrait</h3>
        <audio controls preload="metadata" src="${audiobook.audio_url}">Votre navigateur ne supporte pas l'audio.</audio>
      </div>` : ''}
      <div class="cta-row">
        ${audiobook.audio_url ? `<a href="${audiobook.audio_url}" download class="btn-primary">⬇ Télécharger le MP3</a>` : ''}
        <a href="${window.location.href}" class="btn-outline">🔗 Voir la fiche complète</a>
      </div>
    </div>
    <div class="hero-right">
      <div style="position:relative">
        <div class="cover-wrap">
          ${audiobook.cover_url ? `<img src="${audiobook.cover_url}" alt="${audiobook.title}">` : '<div class="cover-placeholder">📖</div>'}
        </div>
        <div class="badge">EbookStudio</div>
      </div>
    </div>
  </div>
</div>

<!-- CONTENT -->
<div class="container">
  <div class="content-grid">
    <div class="content-main">
      <div class="about">
        <h2>À propos de ce contenu audio</h2>
        <p>${audiobook.description || 'Aucune description disponible.'}</p>
      </div>
      <div class="tags">
        <span class="tag">Livre Audio</span>
        <span class="tag">Audio IA</span>
        ${audiobook.voice_name ? `<span class="tag">${audiobook.voice_name}</span>` : ''}
      </div>
    </div>
    <div class="content-sidebar">
      <div class="sidebar-card">
        <h3>Détails du produit</h3>
        ${audiobook.author_name ? `<div class="meta-row"><div><div class="meta-label">Auteur</div><div class="meta-value">${audiobook.author_name}</div></div></div>` : ''}
        ${audiobook.voice_name ? `<div class="meta-row"><div><div class="meta-label">Narrateur</div><div class="meta-value">${audiobook.voice_name}</div></div></div>` : ''}
        ${createdDate ? `<div class="meta-row"><div><div class="meta-label">Date de publication</div><div class="meta-value">${createdDate}</div></div></div>` : ''}
        <div class="meta-row"><div><div class="meta-label">Langue</div><div class="meta-value">Français</div></div></div>
        <div class="meta-row"><div><div class="meta-label">Format</div><div class="meta-value">Version intégrale · MP3</div></div></div>
        <div class="meta-row"><div><div class="meta-label">Durée</div><div class="meta-value">${formatDuration(audiobook.duration_seconds)}</div></div></div>
        <div class="meta-row"><div><div class="meta-label">Éditeur</div><div class="meta-value">EbookStudio</div></div></div>
        <div class="meta-row"><div><div class="meta-label">Qualité</div><div class="meta-value">HD 192 kbps</div></div></div>
        <div class="meta-row"><div><div class="meta-label">Écoutes</div><div class="meta-value">${audiobook.play_count || 0}</div></div></div>
      </div>
    </div>
  </div>
</div>

<div class="footer">Propulsé par EbookStudio Pro • Audio IA Premium</div>

</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audiobook.slug || 'audiobook'}-fiche-produit.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Fiche produit HTML téléchargée !');
  };


  if (loading) return <LoadingState />;
  if (!audiobook) return <NotFoundState />;

  const descriptionShort = audiobook.description?.slice(0, 300);
  const hasLongDesc = audiobook.description && audiobook.description.length > 300;
  const createdDate = audiobook.created_at ? new Date(audiobook.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a4a5c] via-[#1e2a38] to-[#0f1319] text-white">
      {audiobook.audio_url && <audio ref={audioRef} src={audiobook.audio_url} preload="metadata" />}
      {(audiobook as any).excerpt_url && <audio ref={excerptRef} src={(audiobook as any).excerpt_url} preload="metadata" />}

      {/* ===== HERO HEADER (Audible-style) ===== */}
      <div className="relative overflow-hidden">
        {/* Gradient overlay like Audible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a5568]/60 via-[#2d3748]/80 to-[#1a202c] z-0" />
        {audiobook.cover_url && (
          <div className="absolute inset-0 z-0">
            <img src={audiobook.cover_url} alt="" className="w-full h-full object-cover scale-125 blur-[80px] opacity-15" />
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* LEFT: Title, Author, Rating, CTA, Description */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 min-w-0">
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight tracking-tight">
                {audiobook.title}
              </h1>

              {/* Author & Narrator */}
              <div className="space-y-1 mb-4">
                {audiobook.author_name && (
                  <p className="text-white/70 text-base">
                    <span className="text-white/40 text-sm uppercase tracking-wide mr-2">De</span>
                    <span className="text-amber-400 font-medium hover:underline cursor-pointer">{audiobook.author_name}</span>
                  </p>
                )}
                {audiobook.voice_name && (
                  <p className="text-white/70 text-base">
                    <span className="text-white/40 text-sm uppercase tracking-wide mr-2">Lu par</span>
                    <span className="text-amber-400 font-medium hover:underline cursor-pointer">{audiobook.voice_name}</span>
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-6">
                <span className="text-white font-semibold text-lg">4.7</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/50 fill-amber-400/50'}`} />
                  ))}
                </div>
                <span className="text-amber-400/80 text-sm hover:underline cursor-pointer">{audiobook.play_count || 0} écoutes</span>
              </div>

              {/* Excerpt player - uses dedicated excerpt if available, otherwise full audio */}
              {((audiobook as any).excerpt_url || audiobook.audio_url) && (
                <div className="mb-6">
                  <ExcerptPlayer
                    audioRef={(audiobook as any).excerpt_url ? excerptRef : audioRef}
                    isPlaying={(audiobook as any).excerpt_url ? excerptPlaying : isPlaying}
                    currentTime={(audiobook as any).excerpt_url ? excerptTime : currentTime}
                    duration={(audiobook as any).excerpt_url ? excerptDuration : duration}
                    onTogglePlay={(audiobook as any).excerpt_url ? toggleExcerpt : togglePlay}
                    onSeek={(audiobook as any).excerpt_url ? seekExcerpt : seek}
                    formatTime={formatTime}
                  />
                </div>
              )}

              {/* Price display */}
              {(audiobook as any).price && (audiobook as any).price > 0 && (
                <div className="flex items-baseline gap-3 justify-center lg:justify-start mb-4">
                  <span className="text-4xl font-extrabold text-white">{Number((audiobook as any).price).toFixed(2)} €</span>
                  <span className="text-white/40 text-sm line-through">{(Number((audiobook as any).price) * 1.5).toFixed(2)} €</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">-33%</Badge>
                </div>
              )}
              {!(audiobook as any).price && (
                <div className="flex items-baseline gap-2 justify-center lg:justify-start mb-4">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm font-bold">GRATUIT</Badge>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
                {(audiobook as any).price && (audiobook as any).price > 0 ? (
                  <>
                    <Button 
                      onClick={() => {
                        // Stripe checkout
                        toast.info('Redirection vers le paiement Stripe...');
                        // TODO: integrate stripe checkout session
                      }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-12 rounded-full shadow-lg shadow-amber-500/20 text-base"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Acheter maintenant — {Number((audiobook as any).price).toFixed(2)} €
                    </Button>
                    {(audiobook as any).paypal_link && (
                      <Button 
                        variant="outline" 
                        asChild
                        className="gap-2 border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 rounded-full h-12 font-semibold"
                      >
                        <a href={(audiobook as any).paypal_link} target="_blank" rel="noopener noreferrer">
                          <CreditCard className="h-4 w-4" />
                          Payer via PayPal
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    onClick={() => { setShowFullPlayer(true); togglePlay(); }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-12 rounded-full shadow-lg shadow-amber-500/20 text-base"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    {isPlaying ? 'Pause' : 'Écouter maintenant'}
                  </Button>
                )}
              </div>

              {/* Listen + Download row */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                <Button 
                  variant="outline"
                  onClick={() => { setShowFullPlayer(true); togglePlay(); }}
                  className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-full h-10 font-medium text-sm"
                >
                  <Headphones className="h-4 w-4" />
                  {isPlaying ? 'Pause' : 'Écouter'}
                </Button>
                {audiobook.audio_url && !(audiobook as any).price && (
                  <Button 
                    variant="outline" 
                    asChild
                    className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-full h-10 font-medium text-sm"
                  >
                    <a href={audiobook.audio_url} download>
                      <Download className="h-4 w-4" />
                      Télécharger MP3
                    </a>
                  </Button>
                )}
              </div>

              {/* Share icons */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <button onClick={shareUrl} className="text-white/40 hover:text-white/70 transition-colors" title="Copier le lien">
                  <Link2 className="w-5 h-5" />
                </button>
                <button onClick={() => setShowEmbed(!showEmbed)} className="text-white/40 hover:text-white/70 transition-colors" title="Code embed">
                  <Code className="w-5 h-5" />
                </button>
                <button onClick={generateStandaloneHtml} className="text-white/40 hover:text-white/70 transition-colors" title="Télécharger la fiche HTML pour WordPress">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {/* Embed code (collapsed) */}
              {showEmbed && (
                <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/50 mb-2 font-medium">Code d'intégration :</p>
                  <div className="relative">
                    <pre className="bg-black/40 rounded-lg p-3 text-xs text-white/40 overflow-x-auto font-mono">{embedCode}</pre>
                    <Button size="sm" onClick={copyEmbed} className="absolute top-1.5 right-1.5 gap-1.5 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg text-xs">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copié' : 'Copier'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Cover */}
            <div className="shrink-0 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-transform group-hover:scale-[1.02]">
                  {audiobook.cover_url ? (
                    <img src={audiobook.cover_url} alt={audiobook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 via-orange-700 to-amber-800 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-white/40" />
                    </div>
                  )}
                  {/* Play overlay on cover */}
                  <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all group/play">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl">
                      {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-1 text-white" />}
                    </div>
                  </button>
                </div>
                {/* Audible-style badge */}
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg rotate-[-3deg]">
                  EbookStudio
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: Description + Full Player */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* About section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">À propos de ce contenu audio</h2>
              {audiobook.description ? (
                <div>
                  <p className="text-white/70 leading-relaxed text-[15px]">
                    {showFullDesc ? audiobook.description : descriptionShort}
                    {hasLongDesc && !showFullDesc && '...'}
                  </p>
                  {hasLongDesc && (
                    <button 
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="text-amber-400 text-sm mt-2 flex items-center gap-1 hover:text-amber-300 transition-colors font-medium"
                    >
                      {showFullDesc ? <><ChevronUp className="w-4 h-4" /> Afficher moins</> : <><ChevronDown className="w-4 h-4" /> Afficher plus</>}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-white/40 italic">Aucune description disponible pour le moment.</p>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">
                Livre Audio
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">
                Audio IA
              </Badge>
              {audiobook.voice_name && (
                <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-4 py-1.5">
                  {audiobook.voice_name}
                </Badge>
              )}
            </div>

            {/* Full Player (expandable) */}
            {audiobook.audio_url && (
              <div>
                {!showFullPlayer ? (
                  <Button 
                    variant="outline"
                    onClick={() => setShowFullPlayer(true)}
                    className="gap-2 border-white/15 text-white/70 hover:bg-white/10 hover:text-white rounded-full"
                  >
                    <Headphones className="w-4 h-4" />
                    Ouvrir le lecteur complet
                  </Button>
                ) : (
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
                )}
              </div>
            )}

            {!audiobook.audio_url && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
                <Headphones className="w-14 h-14 mx-auto mb-3 text-white/20" />
                <p className="text-white/40">L'audio n'est pas encore disponible pour ce livre.</p>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar metadata (Audible-style) */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5 sticky top-6">
              <h3 className="text-white font-semibold text-base border-b border-white/10 pb-3">Détails du produit</h3>
              
              {audiobook.author_name && (
                <MetaRow icon={<Users className="w-4 h-4 text-amber-400/70" />} label="Auteur" value={audiobook.author_name} />
              )}
              {audiobook.voice_name && (
                <MetaRow icon={<Mic2 className="w-4 h-4 text-purple-400/70" />} label="Narrateur" value={audiobook.voice_name} />
              )}
              {createdDate && (
                <MetaRow icon={<Calendar className="w-4 h-4 text-blue-400/70" />} label="Date de publication" value={createdDate} />
              )}
              <MetaRow icon={<Globe className="w-4 h-4 text-green-400/70" />} label="Langue" value="Français" />
              <MetaRow icon={<FileAudio className="w-4 h-4 text-cyan-400/70" />} label="Format" value="Version intégrale · MP3" />
              <MetaRow icon={<Clock className="w-4 h-4 text-orange-400/70" />} label="Durée" value={formatDuration(audiobook.duration_seconds)} />
              <MetaRow icon={<Building2 className="w-4 h-4 text-pink-400/70" />} label="Éditeur" value="EbookStudio" />
              <MetaRow icon={<Tag className="w-4 h-4 text-amber-400/70" />} label="Catégories" value="Audio IA Premium" />
              <MetaRow icon={<Headphones className="w-4 h-4 text-emerald-400/70" />} label="Écoutes" value={`${audiobook.play_count || 0}`} />
              <MetaRow icon={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />} label="Qualité" value="HD 192 kbps" />
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10 pt-4 border-t border-white/5">
        <p className="text-xs text-white/20">Propulsé par EbookStudio Pro • Audio IA Premium</p>
      </div>
    </div>
  );
};

// --- Helper components ---

const MetaRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-white/35 mb-0.5">{label}</p>
      <p className="text-sm text-white/80 font-medium">{value}</p>
    </div>
  </div>
);

export default PublicAudiobookPage;
