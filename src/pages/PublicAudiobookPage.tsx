import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Volume2, VolumeX, Headphones, Share2, Code, Copy, Check, 
  SkipBack, SkipForward, BookOpen, Clock, Star, Users, Download, 
  ChevronDown, ChevronUp, Mic2, Sparkles, Link2, Calendar, Globe, 
  FileAudio, Building2, Tag, ShoppingCart, CreditCard, Shield, HelpCircle, Library,
  Zap, Lock, RefreshCw, MessageCircle, Timer, Heart, Award, CheckCircle2,
  Layers, BookHeart, Wand2, AudioLines
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getRandomReviews } from '@/utils/reviewPool';
import { motion } from 'framer-motion';

// --- Loading & Error States ---

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
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
  <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-white">
    <div className="text-center">
      <Headphones className="w-20 h-20 mx-auto mb-4 text-white/20" />
      <h1 className="text-3xl font-bold mb-2">Livre audio introuvable</h1>
      <p className="text-white/50">Ce livre audio n'existe pas ou n'est pas encore public.</p>
    </div>
  </div>
);

// --- MetaRow ---
const MetaRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-white/35 mb-0.5">{label}</p>
      <p className="text-sm text-white/80 font-medium">{value}</p>
    </div>
  </div>
);

// --- FAQ Item ---
const FaqItem = ({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="font-semibold text-sm text-white/80">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
      </button>
      {open && <div className="px-5 pb-4 text-white/40 text-sm leading-relaxed">{answer}</div>}
    </div>
  );
};

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

  // Urgency timer
  const [urgencyEnd] = useState(() => Date.now() + 2.5 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 30, s: 0 });

  useEffect(() => { if (slug) fetchAudiobook(); }, [slug]);

  useEffect(() => {
    const tick = setInterval(() => {
      const diff = Math.max(0, urgencyEnd - Date.now());
      setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
      if (diff <= 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, [urgencyEnd]);

  const fetchAudiobook = async () => {
    try {
      const { data, error } = await supabase.from('audiobooks').select('*').eq('slug', slug).eq('is_public', true).single();
      if (error) throw error;
      setAudiobook(data);
      await supabase.from('audiobooks').update({ play_count: (data.play_count || 0) + 1 }).eq('id', data.id);
    } catch { setAudiobook(null); } finally { setLoading(false); }
  };

  // Audio event listeners
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

  // Playback controls
  const toggleExcerpt = () => {
    if (!excerptRef.current) return;
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
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${audiobook.title}</title></head><body style="margin:0;font-family:sans-serif;background:#0A0A0F;color:#fff;text-align:center;padding:40px"><h1>${audiobook.title}</h1><p>Par ${audiobook.author_name || 'Auteur'}</p>${audiobook.audio_url ? `<audio controls src="${audiobook.audio_url}" style="width:100%;max-width:600px;margin:20px auto"></audio>` : ''}<p>${audiobook.description || ''}</p></body></html>`;
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
  const hasPrice = audiobook.price && audiobook.price > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {audiobook.audio_url && <audio ref={audioRef} src={audiobook.audio_url} preload="metadata" />}
      {audiobook.excerpt_url && <audio ref={excerptRef} src={audiobook.excerpt_url} preload="metadata" />}

      {/* Urgency Banner */}
      {hasPrice && (
        <div className="bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-900/80 border-b border-red-500/20 text-white text-center py-3 px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Timer className="w-5 h-5 animate-pulse text-red-300" />
            <span className="font-semibold text-sm">🔥 Offre de lancement — Prix réduit pendant encore</span>
            <div className="flex gap-1.5">
              {[String(timeLeft.h).padStart(2, '0'), String(timeLeft.m).padStart(2, '0'), String(timeLeft.s).padStart(2, '0')].map((v, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  {i > 0 && <span className="font-bold text-lg text-red-300">:</span>}
                  <span className="bg-black/40 px-2.5 py-1 rounded-lg font-mono font-bold text-base min-w-[2.5rem] text-center text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0d1117] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px]" />
        </div>
        {audiobook.cover_url && (
          <div className="absolute inset-0 z-0">
            <img src={audiobook.cover_url} alt="" className="w-full h-full object-cover scale-125 blur-[80px] opacity-10" />
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            
            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 min-w-0">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide">
                  <AudioLines className="w-3.5 h-3.5 mr-1.5" />
                  LIVRE AUDIO PREMIUM
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 leading-[1.1] tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent"
              >
                {audiobook.title}
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-5">
                {audiobook.author_name && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-sm">De</span>
                    <span className="text-amber-400 font-semibold">{audiobook.author_name}</span>
                  </div>
                )}
                {audiobook.voice_name && (
                  <>
                    <span className="text-white/20">•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-sm">Lu par</span>
                      <span className="text-amber-400 font-semibold">{audiobook.voice_name}</span>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Rating */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex items-center gap-3 justify-center lg:justify-start mb-7">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/40 fill-amber-400/40'}`} />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">4.7</span>
                <span className="text-white/30">|</span>
                <span className="text-white/50 text-sm">{audiobook.play_count || 0} écoutes</span>
              </motion.div>

              {/* Excerpt player */}
              {(audiobook.excerpt_url || audiobook.audio_url) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm rounded-2xl p-5 md:p-6 mb-7"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Headphones className="w-5 h-5 text-amber-400" />
                    <h3 className="text-white/90 font-semibold text-base">Écouter l'extrait gratuit</h3>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] ml-auto">GRATUIT</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={audiobook.excerpt_url ? toggleExcerpt : togglePlay}
                      className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      {(audiobook.excerpt_url ? excerptPlaying : isPlaying) 
                        ? <Pause className="h-6 w-6 text-white" /> 
                        : <Play className="h-6 w-6 ml-0.5 text-white" />}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <Slider 
                        value={[audiobook.excerpt_url ? excerptTime : currentTime]} 
                        max={(audiobook.excerpt_url ? excerptDuration : duration) || 100} 
                        step={1} 
                        onValueChange={audiobook.excerpt_url ? seekExcerpt : seek} 
                        className="cursor-pointer" 
                      />
                      <div className="flex justify-between text-[11px] text-white/30 mt-1.5 font-mono">
                        <span>{formatTime(audiobook.excerpt_url ? excerptTime : currentTime)}</span>
                        <span>{formatTime(audiobook.excerpt_url ? excerptDuration : duration)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Price */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-baseline gap-3 justify-center lg:justify-start mb-5">
                {hasPrice ? (
                  <>
                    <span className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{Number(audiobook.price).toFixed(2)} €</span>
                    <span className="text-white/30 text-lg line-through">{(Number(audiobook.price) * 1.5).toFixed(2)} €</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-bold">-33%</Badge>
                  </>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-5 py-1.5 text-base font-bold">✓ GRATUIT</Badge>
                )}
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5">
                {hasPrice ? (
                  <>
                    {audiobook.stripe_link && (
                      <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base transition-all hover:scale-[1.02]">
                        <a href={audiobook.stripe_link} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="h-5 w-5" />
                          Acheter maintenant — {Number(audiobook.price).toFixed(2)} €
                        </a>
                      </Button>
                    )}
                    {!audiobook.stripe_link && (
                      <Button onClick={() => { setShowFullPlayer(true); togglePlay(); }} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base">
                        <Play className="h-5 w-5" />
                        Écouter maintenant
                      </Button>
                    )}
                    {audiobook.paypal_link && (
                      <Button variant="outline" asChild className="gap-2 border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 rounded-full h-13 font-semibold">
                        <a href={audiobook.paypal_link} target="_blank" rel="noopener noreferrer">
                          <CreditCard className="h-4 w-4" />
                          Payer via PayPal
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    onClick={() => { setShowFullPlayer(true); togglePlay(); }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-8 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base transition-all hover:scale-[1.02]"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    {isPlaying ? 'Pause' : 'Écouter maintenant'}
                  </Button>
                )}
              </motion.div>

              {/* Trust row */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {[
                  { icon: Lock, text: "Paiement sécurisé SSL", color: "text-emerald-400" },
                  { icon: Zap, text: "Téléchargement immédiat", color: "text-amber-400" },
                  { icon: RefreshCw, text: "Remboursé sous 30 jours", color: "text-blue-400" },
                  { icon: MessageCircle, text: "Support réactif 7j/7", color: "text-purple-400" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                    <t.icon className={`w-4 h-4 ${t.color} shrink-0`} />
                    <span className="text-[11px] text-white/50 font-medium">{t.text}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <button onClick={shareUrl} className="text-white/25 hover:text-white/60 transition-colors"><Link2 className="w-5 h-5" /></button>
                <button onClick={() => setShowEmbed(!showEmbed)} className="text-white/25 hover:text-white/60 transition-colors"><Code className="w-5 h-5" /></button>
                <button onClick={generateStandaloneHtml} className="text-white/25 hover:text-white/60 transition-colors"><Download className="w-5 h-5" /></button>
              </div>

              {showEmbed && (
                <div className="mt-4 bg-black/40 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2 font-medium">Code d'intégration :</p>
                  <div className="relative">
                    <pre className="bg-black/50 rounded-lg p-3 text-xs text-white/30 overflow-x-auto font-mono">{embedCode}</pre>
                    <Button size="sm" onClick={copyEmbed} className="absolute top-1.5 right-1.5 gap-1.5 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg text-xs">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copié' : 'Copier'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Cover */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="shrink-0 order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 transition-transform group-hover:scale-[1.02]">
                  {audiobook.cover_url ? (
                    <img src={audiobook.cover_url} alt={audiobook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 via-orange-700 to-amber-800 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                  <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl backdrop-blur-sm">
                      {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-1 text-white" />}
                    </div>
                  </button>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg rotate-[-3deg]">
                  EbookStudio
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== WHAT YOU GET ===== */}
      <div className="bg-gradient-to-b from-[#0d1117] to-[#0f1923] border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
            Ce que vous obtenez
          </h2>
          <p className="text-white/40 text-center mb-10 max-w-xl mx-auto">
            Un livre audio complet, produit avec une technologie vocale de pointe, prêt à écouter sur tous vos appareils.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: AudioLines, title: "Audio HD Premium", desc: "Qualité studio 192kbps, voix IA ultra-naturelle", color: "from-amber-500 to-orange-500" },
              { icon: BookOpen, title: "Livre complet", desc: "Contenu intégral structuré et captivant", color: "from-blue-500 to-cyan-500" },
              { icon: Clock, title: formatDuration(audiobook.duration_seconds), desc: "Durée d'écoute estimée", color: "from-purple-500 to-pink-500" },
              { icon: Download, title: "Téléchargement", desc: "MP3 disponible immédiatement", color: "from-emerald-500 to-teal-500" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center hover:bg-white/[0.05] transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white/90 text-sm mb-1">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="bg-[#0A0A0F]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex flex-col lg:flex-row gap-10">
            
            <div className="flex-1 min-w-0 space-y-10">
              
              {/* Synopsis */}
              <div>
                <h2 className="text-2xl font-bold text-white/90 mb-4 flex items-center gap-2">
                  <BookHeart className="w-6 h-6 text-amber-400" />
                  À propos de ce livre audio
                </h2>
                {audiobook.description ? (
                  <>
                    <p className="text-white/50 leading-relaxed text-[15px]">
                      {showFullDesc ? audiobook.description : descriptionShort}
                      {hasLongDesc && !showFullDesc && '...'}
                    </p>
                    {hasLongDesc && (
                      <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-amber-400 text-sm mt-3 flex items-center gap-1 hover:text-amber-300 transition-colors font-medium">
                        {showFullDesc ? <><ChevronUp className="w-4 h-4" /> Afficher moins</> : <><ChevronDown className="w-4 h-4" /> Lire la suite</>}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-white/40 italic">Découvrez ce livre audio créé avec la technologie EbookStudio Pro.</p>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {['📖 Livre Audio', '🎙️ Audio IA Premium', audiobook.voice_name ? `🗣️ ${audiobook.voice_name}` : null].filter(Boolean).map((tag, i) => (
                  <Badge key={i} variant="outline" className="border-white/10 text-white/50 bg-white/[0.03] hover:bg-white/[0.06] rounded-full px-4 py-1.5 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Full Player */}
              {audiobook.audio_url && (
                <div>
                  {!showFullPlayer ? (
                    <Button variant="outline" onClick={() => setShowFullPlayer(true)} className="gap-2 border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80 rounded-full">
                      <Headphones className="w-4 h-4" />
                      Ouvrir le lecteur complet
                    </Button>
                  ) : (
                    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                      <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                        <FileAudio className="w-5 h-5 text-amber-400" />
                        Lecteur complet
                      </h3>
                      <div className="mb-6">
                        <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={seek} className="cursor-pointer" />
                        <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <Button variant="ghost" size="icon" onClick={() => skip(-15)} className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full">
                          <div className="relative"><SkipBack className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">15s</span></div>
                        </Button>
                        <Button onClick={togglePlay} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
                          {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 ml-0.5 text-white" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => skip(30)} className="text-white/60 hover:text-white hover:bg-white/10 h-12 w-12 rounded-full">
                          <div className="relative"><SkipForward className="h-5 w-5" /><span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/40">30s</span></div>
                        </Button>
                      </div>
                      <div className="flex items-center gap-3 mt-6 max-w-[200px] mx-auto">
                        <Button variant="ghost" size="icon" onClick={() => { setIsMuted(!isMuted); if (audioRef.current) audioRef.current.muted = !isMuted; }} className="text-white/40 hover:text-white hover:bg-white/10 shrink-0 h-8 w-8">
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={changeVolume} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!audiobook.audio_url && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
                  <Headphones className="w-14 h-14 mx-auto mb-3 text-white/20" />
                  <p className="text-white/40">L'audio n'est pas encore disponible pour ce livre.</p>
                </div>
              )}

              {/* Target audience */}
              <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Pour qui est ce livre audio ?
                </h3>
                <ul className="space-y-3 text-white/50 text-sm">
                  {[
                    "Lecteurs et auditeurs passionnés cherchant une expérience audio immersive",
                    "Créateurs de contenu souhaitant découvrir la qualité audio IA premium",
                    "Amateurs de livres audio qui veulent écouter partout, à tout moment",
                    "Toute personne curieuse de la narration vocale nouvelle génération",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5 sticky top-6">
                <h3 className="text-white/80 font-semibold text-base border-b border-white/[0.06] pb-3 flex items-center gap-2">
                  📋 Informations produit
                </h3>
                {hasPrice && <MetaRow icon={<CreditCard className="w-4 h-4 text-emerald-400" />} label="Prix" value={`${Number(audiobook.price).toFixed(2)} €`} />}
                <MetaRow icon={<FileAudio className="w-4 h-4 text-amber-400" />} label="Format" value="Livre audio MP3 HD" />
                {audiobook.author_name && <MetaRow icon={<Users className="w-4 h-4 text-pink-400" />} label="Auteur" value={audiobook.author_name} />}
                {audiobook.voice_name && <MetaRow icon={<Mic2 className="w-4 h-4 text-purple-400" />} label="Narrateur" value={audiobook.voice_name} />}
                <MetaRow icon={<Globe className="w-4 h-4 text-green-400" />} label="Langue" value="Français" />
                <MetaRow icon={<Clock className="w-4 h-4 text-cyan-400" />} label="Durée estimée" value={formatDuration(audiobook.duration_seconds)} />
                <MetaRow icon={<Download className="w-4 h-4 text-emerald-400" />} label="Accès" value="Téléchargement immédiat" />
                {createdDate && <MetaRow icon={<Calendar className="w-4 h-4 text-blue-400" />} label="Publication" value={createdDate} />}
                <MetaRow icon={<Building2 className="w-4 h-4 text-pink-400" />} label="Éditeur" value="EbookStudio" />
                <MetaRow icon={<Headphones className="w-4 h-4 text-amber-400" />} label="Écoutes" value={`${audiobook.play_count || 0}`} />
                <MetaRow icon={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />} label="Qualité" value="HD 192 kbps" />
                
                {/* Mini CTA in sidebar */}
                {hasPrice && audiobook.stripe_link && (
                  <div className="pt-3 border-t border-white/[0.06]">
                    <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 h-11 rounded-xl shadow-lg shadow-amber-500/20">
                      <a href={audiobook.stripe_link} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="h-4 w-4" />
                        Acheter — {Number(audiobook.price).toFixed(2)} €
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== HOW IT'S MADE ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Comment est créé ce livre audio ?
            </h2>
            <p className="text-white/35 text-center mb-10 max-w-lg mx-auto text-sm">
              Une production 100% automatisée grâce à la technologie EbookStudio
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Wand2, title: "1. Rédaction IA", desc: "Le scénario est généré par notre moteur d'écriture créative, calibré pour votre audience.", color: "from-violet-500 to-purple-500" },
                { icon: Mic2, title: "2. Narration vocale", desc: "La voix, synthétisée par Azure Neural Speech, donne vie au texte avec des intonations naturelles.", color: "from-amber-500 to-orange-500" },
                { icon: Sparkles, title: "3. Production finale", desc: "Mastering audio automatique, chapitrage et métadonnées — prêt à écouter.", color: "from-emerald-500 to-teal-500" },
              ].map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white/80 mb-2">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== REVIEWS ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white/90 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              Avis des auditeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRandomReviews(audiobook.slug || audiobook.title).map((review, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white/80">{review.name}</p>
                      <p className="text-[11px] text-white/30">A écouté ce titre</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.stars ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== GUARANTEE ===== */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-14 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/15 rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-emerald-300 mb-2">Garantie Satisfait ou Remboursé — 30 jours</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Vous n'êtes pas satisfait ? Nous vous remboursons intégralement, sans conditions et sans questions. 
                Un simple email suffit. Votre satisfaction est notre priorité absolue.
              </p>
            </div>
          </motion.div>

          {/* ===== FAQ ===== */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-white/90 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              Questions fréquentes
            </h2>
            <div className="space-y-2">
              {[
                { q: "Dans quel format est le livre audio ?", a: "Le livre audio est au format MP3 haute définition (192kbps), compatible avec tous les appareils : smartphone, tablette, ordinateur, enceinte connectée." },
                { q: "Comment accéder à mon achat ?", a: "Après le paiement, vous recevrez un lien de téléchargement par email dans les 2 minutes. Vous pourrez écouter immédiatement." },
                { q: "La voix est-elle naturelle ?", a: "Absolument. Nous utilisons Azure Neural Speech, la technologie de synthèse vocale la plus avancée. La narration est fluide et expressive." },
                { q: "Puis-je être remboursé ?", a: "Oui, garantie satisfait ou remboursé de 30 jours. Un simple email et vous êtes remboursé sous 48h." },
                { q: "Comment ce livre audio a-t-il été créé ?", a: "Le texte a été rédigé par notre moteur d'écriture IA puis narré par une voix de synthèse premium Azure Neural Speech." },
              ].map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>


          {/* ===== CTA FINAL ===== */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 text-center bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/15 rounded-2xl p-10"
          >
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Prêt à découvrir ce livre audio ?
            </h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Téléchargez l'audiobook dès maintenant et profitez d'une expérience audio immersive. 
              Satisfait ou remboursé sous 30 jours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasPrice && audiobook.stripe_link && (
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-10 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base transition-all hover:scale-[1.02]">
                  <a href={audiobook.stripe_link} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="h-5 w-5" />
                    Acheter maintenant — {Number(audiobook.price).toFixed(2)} €
                  </a>
                </Button>
              )}
              {hasPrice && audiobook.paypal_link && (
                <Button variant="outline" asChild className="gap-2 border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 rounded-full h-13 font-semibold px-8">
                  <a href={audiobook.paypal_link} target="_blank" rel="noopener noreferrer">
                    <CreditCard className="h-4 w-4" />
                    Payer via PayPal — {Number(audiobook.price).toFixed(2)} €
                  </a>
                </Button>
              )}
              {!hasPrice && (
                <Button onClick={() => { setShowFullPlayer(true); togglePlay(); }} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold gap-2 px-10 h-13 rounded-full shadow-xl shadow-amber-500/25 text-base transition-all hover:scale-[1.02]">
                  <Play className="h-5 w-5" />
                  Écouter maintenant
                </Button>
              )}
            </div>
          </motion.div>

          {/* ===== EBOOK LINK ===== */}
          <div className="mt-14 text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
            <h3 className="text-white/80 text-lg font-bold mb-2">📚 Découvrez aussi nos ebooks</h3>
            <p className="text-white/35 text-sm mb-4">Retrouvez toute notre collection de livres numériques sur notre boutique</p>
            <a href="https://ebookcluster.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-amber-500/20 transition-all hover:scale-105">
              <Globe className="w-5 h-5" />
              Visiter ebookcluster.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10 pt-6 border-t border-white/[0.04]">
        <p className="text-xs text-white/20">Propulsé par EbookStudio Pro 2026 • Audio IA Premium</p>
      </div>
    </div>
  );
};

export default PublicAudiobookPage;
